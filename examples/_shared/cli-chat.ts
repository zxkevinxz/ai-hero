import type {
  CoreMessage,
  StreamTextResult,
} from "ai";
import * as p from "@clack/prompts";

export const cliChat = async (opts: {
  intro?: string;
  outro?: string;
  askQuestion: (
    question: string,
    prevMessages: CoreMessage[],
  ) => Promise<StreamTextResult<any>>;
}) => {
  console.clear();

  p.intro(opts.intro ?? "Welcome to the chat!");

  const messages: CoreMessage[] = [];

  while (true) {
    const question = await p.text({
      message: "Ask a question:",
    });

    if (p.isCancel(question)) {
      p.outro();
      process.exit(0);
    }

    const result = await opts.askQuestion(
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
  }
};
