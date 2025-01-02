## Models

### OpenAI

```ts
// pnpm add @ai-sdk/openai

import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4o");
```

### Anthropic

```ts
// pnpm add @ai-sdk/anthropic

import { anthropic } from "@ai-sdk/anthropic";

const model = anthropic("claude-3-5-sonnet-latest");
```

### Google

```ts
// pnpm add @ai-sdk/google

import { google } from "@ai-sdk/google";

const model = google("gemini-1.5-pro-latest");
```

### LMStudio

```ts
// pnpm add @ai-sdk/openai-compatible

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseUrl: "http://localhost:1234",
});

const localModel = lmstudio("local-model-name");
```

## Generating Text

```ts
const { text } = await generateText({
  prompt,
  model,
});
```

## Streaming Text

Returns an `AsyncIterable` of text chunks as soon as they are generated.

```ts
const { textStream } = await streamText({
  prompt,
  model,
});

for await (const chunk of textStream) {
  console.log(chunk);
}
```

## System Prompt

Tell the AI how to behave.

```ts
const { text } = await generateText({
  prompt,
  model,
  system: `Generate a summary of the text.`,
});
```

## Pass Message History

Pass `messages` instead of `prompt`.

```ts
const { text } = await generateText({
  model,
  messages: [
    { role: "user", content: "Hello!" },
    { role: "assistant", content: "Hi there!" },
  ],
});
```

## Generate An Enum

Use `generateObject` and specify `output: "enum"`.

```ts
const { object } = await generateObject({
  model,
  prompt,
  output: "enum",
  enum: ["positive", "negative", "neutral"],
  system: `Classify the sentiment of the text.`,
});

console.log(object);
// "positive" | "negative" | "neutral"
```

## Get Structured Output

```ts
import { z } from "zod";

const prompt = `
  Account Number: 123456
  Balance: $100.00
`;

const { object } = await generateObject({
  model,
  schemaName: "Account information",
  schema: z.object({
    accountNumber: z.string().describe("The account number."),
    balance: z.number().describe("The account balance."),
  }),
  system: `Get account information from the text.`,
  prompt,
});
```

## Tracking Token Usage

`usage` returns the tokens used in the prompt and completion.

```ts
const { usage } = await generateText({
  model: smallModel,
  prompt,
});

console.log(usage.promptTokens); // 10
console.log(usage.completionTokens); // 20
```
