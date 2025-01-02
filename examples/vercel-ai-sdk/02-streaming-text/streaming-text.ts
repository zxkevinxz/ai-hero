import { streamText } from "ai";
import { smallOpenAiModel } from "../../_shared/models";

const model = smallOpenAiModel;

/**
 * Instead of generating the text, we are now streaming it!
 */
export const answerMyQuestion = async (prompt: string) => {
  const { textStream } = await streamText({
    model,
    prompt,
  });

  // The textStream is an AsyncIterable, so it can be
  // iterated over like an array.
  for await (const chunk of textStream) {
    // Here, we're just console.logging every chunk
    // that comes in.
    console.log(chunk);
  }

  return textStream;
};
