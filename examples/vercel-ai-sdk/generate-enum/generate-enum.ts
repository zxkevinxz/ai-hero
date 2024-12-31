import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { cacheModelInFs } from "../caching/cache-model-in-fs";

const model = cacheModelInFs(openai("gpt-4o-mini"));

export const classifySentiment = async (text: string) => {
  /**
   * 1. Using the generateObject function...
   */
  const { object } = await generateObject({
    model,
    /**
     * 2. ...we can specify the output type as "enum".
     */
    output: "enum",
    /**
     * 3. Then, we can specify the enum values.
     */
    enum: ["positive", "negative", "neutral"],
    prompt: text,
    system: `Classify the sentiment of the text as either positive, negative, or neutral.`,
  });

  return object;
};
