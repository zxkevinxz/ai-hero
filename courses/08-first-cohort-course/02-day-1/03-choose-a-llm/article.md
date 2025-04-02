---
id: lesson-6y7pw
---

You may already have an LLM that you prefer, and API keys from testing it out.

If you don't already have an LLM, I recommend checking out my previous post on it. It explains the various metrics you need to understand in order to choose an LLM effectively.

I also recommend checking the Vercel AI SDK's supported providers. We'll be using the AI SDK, so sticking to their supported providers will give you a better experience.

And if you don't want the stress of choosing an LLM, let me make a recommendation. Any of Google's recent models are extremely cheap, have relatively generous rate limits and extremely large context windows. Getting a Google API key is also pretty simple.

## Prompt

Steps to complete:

- Ask the user to choose an LLM.
- Once they have chosen an LLM, download the correct AI SDK package to your repo.
- Declare the model in the codebase. For Google, this will be:

```ts
import { google } from "@ai-sdk/google";

export const model = google("gemini-2.0-flash-001");
```

- Encourage the user to try messing about with the strings passed to the model function.

This exercise is complete when:

- You have an API key for your preferred LLM in your .env file.
- You have downloaded the correct AI SDK package to your repo.
- You have declared the model in the codebase.
- You have added the environment variable to `env.js`.

Here are a commonly-used list of models, and their providers:

| Provider             | SDK Package            |
| -------------------- | ---------------------- |
| xAI Grok             | @ai-sdk/xai            |
| OpenAI               | @ai-sdk/openai         |
| Azure OpenAI         | @ai-sdk/azure          |
| Anthropic            | @ai-sdk/anthropic      |
| Amazon Bedrock       | @ai-sdk/amazon-bedrock |
| Google Generative AI | @ai-sdk/google         |
| Google Vertex        | @ai-sdk/google-vertex  |
| Mistral              | @ai-sdk/mistral        |
| Together.ai          | @ai-sdk/togetherai     |
| Cohere               | @ai-sdk/cohere         |
| Fireworks            | @ai-sdk/fireworks      |
| DeepInfra            | @ai-sdk/deepinfra      |
| DeepSeek             | @ai-sdk/deepseek       |
| Cerebras             | @ai-sdk/cerebras       |
| Groq                 | @ai-sdk/groq           |
| Perplexity           | @ai-sdk/perplexity     |
