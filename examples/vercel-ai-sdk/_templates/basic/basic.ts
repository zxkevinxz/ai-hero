import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFileSync } from "fs";
import { cacheModelInFs } from "../../caching/cache-model-in-fs";
import { smallOpenAiModel } from "../../_shared/models";

const model = smallOpenAiModel;

export const someFunc = async (input: string) => {
  const { text } = await generateText({
    model,
    prompt: input,
  });

  return text;
};
