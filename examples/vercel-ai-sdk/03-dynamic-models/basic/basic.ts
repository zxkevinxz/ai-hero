import { generateText } from "ai";
import { smallModel } from "../../../_shared/models";

const model = smallModel;

export const someFunc = async (input: string) => {
  const { text } = await generateText({
    model,
    prompt: input,
  });

  return text;
};
