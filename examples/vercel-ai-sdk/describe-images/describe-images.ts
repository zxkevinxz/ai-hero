import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFileSync } from "fs";
import { cacheModelInFs } from "../caching/cache-model-in-fs";

const model = cacheModelInFs(openai("gpt-4o"));

export const describeImage = async (imagePath: string) => {
  const { text } = await generateText({
    model,
    system:
      `You will receive an image. ` +
      `Please create an alt text for the image. ` +
      `Be concise and descriptive. `,
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
