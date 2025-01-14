import { generateText } from "ai";
import { readFileSync } from "fs";
import { flagshipAnthropicModel } from "../../_shared/models";
import path from "path";

const model = flagshipAnthropicModel;

const systemPrompt =
  `You will receive an image. ` +
  `Please create an alt text for the image. ` +
  `Be concise. ` +
  `Use adjectives only when necessary. ` +
  `Do not pass 160 characters. ` +
  `Use simple language. `;

export const describeImage = async (
  imageUrl: string,
) => {
  const { text } = await generateText({
    model,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: new URL(imageUrl),
          },
        ],
      },
    ],
  });

  return text;
};

const description = await describeImage(
  "https://raw.githubusercontent.com/ai-hero-dev/ai-hero/refs/heads/main/internal/assets/fireworks.jpg?token=GHSAT0AAAAAACZQ4KTLUF265PDICHWARKEWZ4FPTJA",
);

console.log(description);
