import { convertToCoreMessages, generateText } from "ai";
import { localModel } from "../../_shared/models";

const model = localModel;

export const generateManyExamples = async (prompt: string) => {
  /**
   * We first create a set of 'core messages', which are
   * special objects that the AI SDK uses to represent
   * messages.
   *
   * AI SDK has two types of messages: 'CoreMessage' and
   * 'UIMessage'. UIMessage is a simple object with a role
   * and content.
   *
   * convertToCoreMessages takes in an array of UIMessages
   * and converts them to CoreMessages.
   */
  const messages = convertToCoreMessages([
    {
      role: "user",
      content: prompt,
    },
  ]);

  for (let i = 0; i < 3; i++) {
    const { text } = await generateText({
      model,
      messages,
    });

    messages.push({
      role: "assistant",
      content: text,
    });

    messages.push({
      role: "user",
      content: "Please add more examples.",
    });
  }

  return messages;
};
