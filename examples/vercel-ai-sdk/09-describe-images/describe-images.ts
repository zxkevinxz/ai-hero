import { generateText } from "ai";
import { readFileSync } from "fs";
import { smallOpenAiModel } from "../../_shared/models";

const model = smallOpenAiModel;

export const describeImage = async (imagePath: string) => {
  const { text } = await generateText({
    model,
    system:
      `You will receive an image. ` +
      `Please create an alt text for the image. ` +
      `Be concise. ` +
      `Use adjectives only when necessary. ` +
      `Do not pass 160 characters. ` +
      `Use simple language. `,
    messages: [
      {
        role: "user",
        content: [
          {
            /**
             * 1. You can pass images into generateText,
             * if the model supports them.
             */
            type: "image",
            /**
             * 2. Here, readFileSync is just a buffer.
             */
            image: readFileSync(imagePath),
          },
        ],
      },
    ],
  });

  return text;
};
