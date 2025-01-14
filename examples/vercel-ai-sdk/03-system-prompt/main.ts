import { generateText } from "ai";
import { smallModel } from "../../_shared/models.ts";

const model = smallModel;

export const summarizeText = async (input: string) => {
  const { text } = await generateText({
    model,
    prompt: input,
    system:
      `You are a text summarizer. ` +
      `Summarize the text you receive. ` +
      `Be concise. ` +
      `Return only the summary. ` +
      `Do not use the phrase "here is a summary". ` +
      `Highlight relevant phrases in bold. ` +
      `The summary should be two sentences long. `,
  });

  return text;
};
