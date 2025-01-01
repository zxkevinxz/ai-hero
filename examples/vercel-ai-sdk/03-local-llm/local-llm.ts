import { generateText } from "ai";
import { localModel } from "../_shared/models";

const model = localModel;

export const askLocalLLMQuestion = async (input: string) => {
  const { text } = await generateText({
    model,
    prompt: input,
    maxRetries: 0, // Error on first failure to show network issues early
  });

  return text;
};
