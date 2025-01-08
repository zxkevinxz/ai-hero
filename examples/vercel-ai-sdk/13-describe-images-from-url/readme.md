An example of asking the AI SDK to describe an image from a URL.

Start with [./describe-images-from-url.ts](./describe-images-from-url.ts).

## Description

We saw last time how to upload images to [Vercel's AI SDK](https://sdk.vercel.ai/docs/introduction).

This works when you have the entire file in memory. But if you have just the URL to the file, there is a shortcut.

We can tweak our `describeImage` function that we saw last time to instead pass a URL instead of a `Uint8Array`.

```ts
import { generateText } from "ai";

export const describeImage = async (
  imageUrl: string,
) => {
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
            type: "image",
            image: new URL(imageUrl),
          },
        ],
      },
    ],
  });

  return text;
};
```

Let's test it out. We've got an ![image of a church](https://github.com/ai-hero-dev/ai-hero/blob/main/internal/assets/image.jpg?raw=true) that we wanted to describe, that I've hosted on GitHub:

```ts
const result = await describeImage(
  "https://github.com/ai-hero-dev/ai-hero/blob/main/internal/assets/image.jpg?raw=true",
);

console.log(result);
```

When we run this, it's going to pass the url to the lm. The LLM will then download the image and have a look at it. And then we get back our description.

This is just a really great way to take a shortcut when you're working with images hosted on the web.
