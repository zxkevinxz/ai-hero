An example of streaming text using Vercel's AI SDK.

Start with [./streaming-text.ts](./streaming-text.ts).

## Description

In our previous example, we saw how we can generate text with the AI SDK.

But this spits out the text all at once at the end. What if we need to stream the text token by token?

For that, we can use the `streamText` function from the AI SDK.

```ts
const { textStream } = await streamText({
  model,
  prompt,
});
```

This takes in a model and a prompt in exactly the same way, but instead of just returning text, it returns a `textStream`.

A text stream is an async iterable. That means it can be streamed to a file or over a network connection.

```ts
for await (const text of textStream) {
  console.log(text);
}
```

In this example we can just log the text as it comes in, using a for await loop.

The stream text function also returns a text promise. This means if you just want to wait for the full text anyway, you can just await the promise.

```ts
const { text } = await streamText({
  model,
  prompt,
});

const finalText = await text;
```
