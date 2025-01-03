An example of using a system prompt with Vercel's AI SDK.

Start with [./basic.ts](./basic.ts).

## Description

Sometimes you need the AI to act in a certain way.

In this case, we want the AI to summarize the text that it receives.

We want to give it a role. We want to give it instructions.

And we want to do all of that before it receives the prompt from the user.

To do that, we can use a system prompt. Doing that in Vercel AI SDK is as simple as passing a system property.

```ts
const { text } = await generateText({
  model,
  prompt: input,
  system:
    `You are a text summarizer. ` +
    `Summarize the text you receive. ` +
    `Be concise. ` +
    `Return only the summary. ` +
    `Do not use the phrase "here is a summary". ` +
    `Highlight relevant phrases in bold. ` +
    `The summary should be two sentences long. `,
});
```

Under the hood, this prepends a special message with a role of "system" that has our system prompt in it.

We could do that in the AI SDK as well if we wanted to. You can pass a messages property that has an array of messages.

```ts
const { text } = await generateText({
  model,
  messages: [
    {
      role: "system",
      content:
        `You are a text summarizer. ` +
        `Summarize the text you receive. ` +
        `Be concise. ` +
        `Return only the summary. ` +
        `Do not use the phrase "here is a summary". ` +
        `Highlight relevant phrases in bold. ` +
        `The summary should be two sentences long. `,
    },
    {
      role: "user",
      content: input,
    },
  ],
});
```

This can be done in generateText, streamText, and all of the other APIs that contact LLM's and GenAI.
