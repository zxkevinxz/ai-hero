import { generateText } from "ai";
import { smallOpenAiModel } from "../../_shared/models";

const model = smallOpenAiModel;

/**
 * This is the simplest setup the AI SDK supports.
 *
 * You generate some text, based on a question passed in and
 * a target model.
 */
export const answerMyQuestion = async (prompt: string) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};
