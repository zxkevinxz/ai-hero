An example of asking the AI SDK to describe an image.

Start with [./describe-images.ts](./describe-images.ts).

## Description

Another thing that the AI SDK handles out of the box is passing images and files to LLMs.

LLMs can then look at the file or the image and do things with it. It's an extremely powerful feature.

Not all LLMs support this, but for the ones that do, AI SDK also lets you do it.

In this case, we want the LLM to generate some alt text for the image that we pass it.

We might use this alt text on a website or something to help folks who can't actually see the image understand what's in it.

<Scrollycoding>

# !!steps

We're going to use a pretty simple system prompt:

```ts ! example.ts
const systemPrompt =
  `You will receive an image. ` +
  `Please create an alt text for the image. ` +
  `Be concise. ` +
  `Use adjectives only when necessary. ` +
  `Do not pass 160 characters. ` +
  `Use simple language. `;
```

# !!steps

Then we're going to create a function called `describeImage` which is going to receive a path to an image on our local file system.

```ts ! example.ts
import { generateText } from "ai";

const systemPrompt =
  `You will receive an image. ` +
  `Please create an alt text for the image. ` +
  `Be concise. ` +
  `Use adjectives only when necessary. ` +
  `Do not pass 160 characters. ` +
  `Use simple language. `;

export const describeImage = async (
  imagePath: string,
) => {
  const { text } = await generateText({
    model,
    system: systemPrompt,
  });

  return text;
};
```

</Scrollycoding>

This looks fine, but we're not yet using the `imagePath` inside our function.

We can't pass the image path directly as a prompt; we first need to actually load the image into memory and then pass that into the `generateText` function.

<Scrollycoding>

# !!steps

To load it into memory, we're going to use `readFileSync` from Node.js.

This stores the image in memory as a `Uint8Array`, essentially a raw representation of the bytes that make up the image.

```ts ! example.ts
import { readFileSync } from "fs";
import { generateText } from "ai";

export const describeImage = async (
  imagePath: string,
) => {
  const imageAsUint8Array = readFileSync(imagePath);
  const { text } = await generateText({
    model,
    system: systemPrompt,
  });

  return text;
};
```

# !!steps

We could, of course, use `readFile` from `fs.promises` if we wanted non-blocking I/O. But `readFileSync` is fine for our purposes.

```ts ! example.ts
import { readFile } from "fs/promises";
import { generateText } from "ai";

export const describeImage = async (
  imagePath: string,
) => {
  const imageAsUint8Array = await readFile(imagePath);
  const { text } = await generateText({
    model,
    system: systemPrompt,
  });

  return text;
};
```

# !!steps

Now we can pass this `Uint8Array` into the `generateText` function. But we can't just pass it in as a prompt; we need to pass it in as a `messages` array:

This is in the same format as the chat history we saw before, but this time we have `content` which is an array of different message parts.

The message part that we're passing is of type `image`, and then we're passing the `Uint8Array` into the `image` property.

```ts ! example.ts
import { readFileSync } from "fs";
import { generateText } from "ai";

export const describeImage = async (
  imagePath: string,
) => {
  const imageAsUint8Array = readFileSync(imagePath);
  const { text } = await generateText({
    model,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: imageAsUint8Array,
          },
        ],
      },
    ],
  });

  return text;
};
```

</Scrollycoding>

Let's try running this. I've got an image of some fireworks. Let's pass it in and see what happens.

```ts
const description = await describeImage(
  "./fireworks.jpg",
);

console.log(description);
```

And there we go. We've got a pretty workable description of the image.

To sum up, we read an image into memory, passed it directly into `generateText` via the `messages` array, and got back a description of that image. Pretty sweet.
