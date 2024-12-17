import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFileSync } from "fs";
import { cacheModelInFs } from "../caching/cache-model-in-fs";

const model = cacheModelInFs(openai("gpt-4o"));

export const describeImage = async (imagePath: string) => {
  const { text } = await generateText({
    model,
    system:
      `You will receive an image. ` + `Please describe the image in detail.`,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: readFileSync(imagePath),
          },
        ],
      },
    ],
  });

  return text;
};
