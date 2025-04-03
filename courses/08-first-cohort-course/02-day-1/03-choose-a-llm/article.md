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

## Previous Successful Run

I'll help you set up Google's Generative AI (Gemini) integration. Let's go through this step by step.

First, I'll check if we have a package.json file to add the dependency to.

Ran tool
Great! Let's first install the Google AI SDK package using pnpm:

```bash
pnpm add @ai-sdk/google
```

Now, let's create a models file to declare our Google model. First, I'll check if we already have a models file:

Ran tool
I'll create a new `models.ts` file in the src directory:

```typescript:src/models.ts
import { google } from "@ai-sdk/google";

export const model = google("gemini-2.0-flash-001");
```

Now, let's check the env.js file to add the Google API key configuration:

Read file: src/env.js
Let's add the Google API key configuration to the env.js file:

```javascript:src/env.js
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    ANTHROPIC_API_KEY: z.string(),
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    FIRECRAWL_API_KEY: z.string(),
    GOOGLE_API_KEY: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    REDIS_URL: z.string(),
  },

  client: {},

  runtimeEnv: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    REDIS_URL: process.env.REDIS_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

Now, let's check the .env file to add the Google API key:

Read file: .env
I see that you already have a Google API key in your .env file, but it's named `GOOGLE_GENERATIVE_AI_API_KEY`. Let's update our env.js to use this key name instead:

```javascript:src/env.js
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    ANTHROPIC_API_KEY: z.string(),
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    FIRECRAWL_API_KEY: z.string(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    REDIS_URL: z.string(),
  },

  client: {},

  runtimeEnv: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    REDIS_URL: process.env.REDIS_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

Perfect! Now you have everything set up for using Google's Generative AI (Gemini) in your application:

1. ✅ Installed the Google AI SDK package (`@ai-sdk/google`)
2. ✅ Created the model declaration in `src/models.ts`
3. ✅ Added the environment variable configuration in `src/env.js`
4. ✅ Confirmed the API key is present in your `.env` file

Would you like to:

1. Learn how to use the model in your chat implementation?
2. Try a different model version?
3. See examples of how to customize the model's behavior?

## Human Instructions

Follow these steps to set up Google's Generative AI (Gemini) in your project:

### 1. Install the Google AI SDK Package

1.1. Open your terminal and navigate to your project directory.

1.2. Install the Google AI SDK package using pnpm:

```bash
pnpm add @ai-sdk/google
```

### 2. Create a Model Declaration File

2.1. Create a new file called `models.ts` in your `src` directory.

2.2. Add the following code to declare your Google model:

```typescript
import { google } from "@ai-sdk/google";

export const model = google("gemini-2.0-flash-001");
```

2.3. You can experiment with different model versions by changing the string parameter. For example, you might try "gemini-1.5-pro" or other available models.

### 3. Configure Environment Variables

3.1. Open your `.env` file and add your Google API key:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

3.2. If you don't have a Google API key, you can get one from the [Google AI Studio](https://makersuite.google.com/app/apikey).

3.3. Open your `src/env.js` file and add the Google API key configuration:

```javascript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // ... existing environment variables ...
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    // ... other environment variables ...
  },

  client: {},

  runtimeEnv: {
    // ... existing environment variables ...
    GOOGLE_GENERATIVE_AI_API_KEY:
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    // ... other environment variables ...
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

### 4. Verify Your Setup

4.1. Confirm that you have completed all the following steps:

- Installed the Google AI SDK package (`@ai-sdk/google`)
- Created the model declaration in `src/models.ts`
- Added the environment variable configuration in `src/env.js`
- Added your API key to the `.env` file
