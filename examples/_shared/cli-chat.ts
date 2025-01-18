import type {
  CoreMessage,
  CoreTool,
  StreamTextResult,
} from "ai";
import * as p from "@clack/prompts";

export const cliChat = async <
  T extends Record<string, CoreTool<any, any>>,
>(opts: {
  intro?: string;
  outro?: string;
  /**
   * The price per million tokens, used to calculate usage
   */
  dollarsPerMillionTokens?: number;
  answerQuestion: (
    question: string,
    prevMessages: CoreMessage[],
  ) => Promise<StreamTextResult<T>>;
  processQuestionResults?: (opts: {
    messages: CoreMessage[];
    result: StreamTextResult<T>;
  }) => Promise<void>;
}) => {
  const costPerToken = opts.dollarsPerMillionTokens
    ? opts.dollarsPerMillionTokens / 1_000_000
    : undefined;
  console.clear();

  p.intro(opts.intro ?? "Welcome to the chat!");

  const messages: CoreMessage[] = [];

  while (true) {
    const question = await p.text({
      message: "Ask a question:",
    });

    exitProcessIfCancel(question);

    const result = await opts.answerQuestion(
      question,
      messages,
    );

    p.log.message("");

    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }

    p.log.message("");

    const finalMessages = (await result.response)
      .messages;

    messages.push(...finalMessages);

    if (opts.processQuestionResults) {
      await opts.processQuestionResults({
        messages,
        result,
      });
    }

    const usage = await result.usage;

    if (typeof costPerToken === "number") {
      p.log.message(
        `Cost: $${
          usage.completionTokens * costPerToken
        }`,
      );
    }
  }
};

export function exitProcessIfCancel<T>(
  input: T | symbol,
): asserts input is T {
  if (p.isCancel(input)) {
    p.outro();
    process.exit(0);
  }
}
