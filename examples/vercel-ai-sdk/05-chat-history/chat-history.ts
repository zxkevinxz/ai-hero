import { generateText, type CoreMessage } from "ai";
import { localModel } from "../../_shared/models";

const model = localModel;

export const generateManyExamples = async (
  prompt: string,
) => {
  /**
   * We first create a set of 'core messages'. 'Core' here
   * refers to the AI SDK Core, as opposed to AI SDK UI or
   * AI SDK RSC.
   */
  const messages: CoreMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  // In a for loop, we then...
  for (let i = 0; i < 3; i++) {
    const { text } = await generateText({
      model,
      // Pass the existing messages to `generateText`
      messages,
    });

    // Push the result to the messages array
    messages.push({
      role: "assistant",
      content: text,
    });

    // Ask the assistant to add more examples
    messages.push({
      role: "user",
      content: "Please add more examples.",
    });
  }

  // In this way, we can generate infinite examples
  // if we keep the for loop going indefinitely.
  // For now, we'll stop at 3.

  return messages;
};
