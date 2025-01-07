import { generateText, type CoreMessage } from "ai";
import { smallModel } from "../../_shared/models";
import { writeFileSync } from "fs";

const model = smallModel;

export const generateManyExamples = async (
  prompt: string,
) => {
  const messages: CoreMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

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

  return messages;
};
