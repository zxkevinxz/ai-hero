A basic example of how you can pass in different models to the Vercel AI SDK.

Start with [./dynamic-models.ts](./dynamic-models.ts).

## Description

I wanted to demonstrate for you just how flexible the Vercel AI SDK is when it comes to model selection.

Here we have an `ask` function that takes in a prompt and a model of a type of language model.

```ts
export const ask = async (
  prompt: string,
  model: LanguageModel,
) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};
```

We can call this function with any model that the AI SDK provides.

For instance, we can call it with Anthropic:

```ts
import { anthropic } from "@ai-sdk/anthropic";

const prompt = `Tell me a story about your grandmother.`;

const anthropicResult = await ask(
  prompt,
  anthropic("claude-3-5-haiku-latest"),
);

console.log(anthropicResult);
```

Or with OpenAI:

```ts
import { openai } from "@ai-sdk/openai";

const openaiResult = await ask(
  prompt,
  openai("gpt-4o-mini-2024-07-18"),
);

console.log(openaiResult);
```

This gives you a ton of flexibility with how you want to build your application.

The `LanguageModel` type exposed by the AI SDK lets you do dependency injection. In other words, you can inject any model into your system.
