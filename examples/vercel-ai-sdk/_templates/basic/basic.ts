import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFileSync } from "fs";
import { cacheModelInFs } from "../../caching/cache-model-in-fs";

const model = cacheModelInFs(openai("gpt-4o-mini"));

export const someFunc = async (input: string) => {
  const { text } = await generateText({
    model,
    prompt: input,
  });

  return text;
};
