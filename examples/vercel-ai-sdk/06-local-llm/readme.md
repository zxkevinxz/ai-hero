A simple setup for using the Vercel AI SDK to connect to [LM Studio](https://lmstudio.ai/).

## Instructions

1. Download LM Studio from [lmstudio.ai](https://lmstudio.ai/).

2. Download a model. The app should prompt you to download a model when you first open it.

3. Go to the developer panel and start the local server.

4. Test the server by visiting http://localhost:1234/v1/models. You should see a JSON output of the models you have downloaded.

5. Run `evalite watch local-llm` to start the local server.

## Code

Start with [./local-llm.ts](./local-llm.ts).

## Description

You can use Vercel's AI SDK to connect to locally running models. In fact, not just locally running models but models running at any URL.

<Scrollycoding>

# !!steps

The AI SDK has a function called `createOpenAICompatible` which lets you communicate with models that have an OpenAI-compatible API.

```ts ! example.ts
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
```

# !!steps

In our case, I'm using an app called LM Studio which exposes this API on `localhost:1234`.

So I can install `ai-sdk/openai-compatible` and then create an LM Studio provider.

```ts ! example.ts
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: `http://localhost:1234/v1`,
});
```

# !!steps

And I can use this provider to grab a model.

I'm using an empty string here because if you pass an empty string it will default to choosing the model you have loaded in LM studio.

```ts ! example.ts
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: `http://localhost:1234/v1`,
});

const model = lmstudio("");
```

# !!steps

I can then use this model by passing it into `generateText`.

I've specified `maxRetries` as zero here. By default, the SDK will retry queries three times to make things more robust and handle any network issues.

But since the model is on our local network, we want it to fail instantly if it can't reach it.

```ts ! example.ts
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: `http://localhost:1234/v1`,
});

const model = lmstudio("");

export const askLocalLLMQuestion = async (
  input: string,
) => {
  const { text } = await generateText({
    model,
    prompt: input,
    maxRetries: 0,
  });

  return text;
};
```

# !!steps

Let's give this a go. We're going to ask the LLM a story about its grandmother:

```ts ! example.ts
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: `http://localhost:1234/v1`,
});

const model = lmstudio("");

export const askLocalLLMQuestion = async (
  input: string,
) => {
  const { text } = await generateText({
    model,
    prompt: input,
    maxRetries: 0,
  });

  return text;
};

const input = `Tell me a story about your grandmother.`;

const localLLMResult =
  await askLocalLLMQuestion(input);

console.log(localLLMResult);
```

And if we run it we get a story about the LLM's grandmother.

</Scrollycoding>

So this is a nice simple setup with how you can connect the Vercel AI SDK to a local model.
