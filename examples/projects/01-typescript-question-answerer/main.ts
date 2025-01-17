import {
  cosineSimilarity,
  embed,
  streamText,
  type CoreMessage,
} from "ai";
import { createInterface } from "node:readline/promises";
import vectorDatabase from "../../../datasets/typescript-q-and-a/embeddings.json" with { type: "json" };
import { lmstudio } from "../../_shared/models.ts";
import { anthropic } from "@ai-sdk/anthropic";

const SIMILARITY_THRESHOLD = 0.6;

const embeddingModel = lmstudio.textEmbeddingModel("");

const takeFirstUnique =
  (num: number) => (arr: { answer: string }[]) => {
    const answerSet = new Set<string>();

    for (const entry of arr) {
      if (answerSet.size === num) {
        break;
      }

      answerSet.add(entry.answer);
    }

    return Array.from(answerSet);
  };

const messages: CoreMessage[] = [];

const askQuestion = async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("");
  const question = await rl.question(
    "Ask a question: ",
  );

  rl.close();

  const userMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .filter((content) => typeof content === "string");

  const embeddedQuestion = await embed({
    value: [question, ...userMessages].join("\n"),
    model: embeddingModel,
  });

  const dbEntries = vectorDatabase
    .map((entry) => ({
      answer: entry.answer,
      question: entry.question,
      similarity: cosineSimilarity(
        entry.vector,
        embeddedQuestion.embedding,
      ),
    }))
    .filter(
      (entry) =>
        entry.similarity > SIMILARITY_THRESHOLD,
    )
    .sort((a, b) => b.similarity - a.similarity);

  console.dir(dbEntries, { depth: null });

  const contentToInclude =
    takeFirstUnique(6)(dbEntries);

  messages.push({
    role: "user",
    content: `
      <dataset>
        ${contentToInclude.join("\n\n")}
      </dataset>
  
      <question>
        ${question}
      </question>
    `,
  });

  const result = streamText({
    model: anthropic("claude-3-5-haiku-latest"),
    messages,
    system: `
      You are Matt Pocock, a helpful TypeScript expert
      from Oxford, UK.
      Answer only using the information in
      the <dataset> tags.
      Answer only the question asked. Do not elaborate.
      Use code samples.
      Answer the question in the <question> tags.
      If the information cannot be directly found in your context,
      respond with "I don't know. That's not in my dataset yet.".
      Return only the answer.
    `,
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
  console.log("");

  const finalMessages = (await result.response)
    .messages;

  messages.push(...finalMessages);
};

while (true) {
  await askQuestion();
}
