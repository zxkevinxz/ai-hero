import { generateText } from "ai";
import { smallOpenAiModel } from "../../../_shared/models";

const model = smallOpenAiModel;

export const someFunc = async (input: string) => {
  const { text } = await generateText({
    model,
    prompt: input,
  });

  return text;
};
