import { anthropic } from "@ai-sdk/anthropic";
import { cacheModelInFs } from "../vercel-ai-sdk/14-caching/cache-model-in-fs";
import { openai } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const pdfModel = cacheModelInFs(anthropic("claude-3-5-sonnet-latest"));

export const flagshipAnthropicModel = cacheModelInFs(
  anthropic("claude-3-5-sonnet-latest")
);

export const smallOpenAiModel = cacheModelInFs(openai("gpt-4o-mini"));

/**
 * Matt here!
 *
 * I have a weird WSL setup which means I have occasional
 * trouble connecting to localhost. So, this is a me-only
 * workaround.
 */
const getLocalhost = () => {
  return process.env.LOCALHOST_OVERRIDE || "localhost";
};

/**
 * 1. We use `@ai-sdk/openai-compatible` to create a model
 * that is compatible with OpenAI's API.
 *
 * {@link https://lmstudio.ai/ LM Studio} is an app that can
 * run on Windows, Mac, and Linux. It serves an API which is
 * compatible with OpenAI's API - so we can use it here.
 */
const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: `http://${getLocalhost()}:1234/v1`,
});

/**
 * 2. This localModel is just another model, so can be passed
 * to `generateText`, `streamText`, etc.
 */
export const localModel = cacheModelInFs(
  // Passing an empty string will use the model
  // you currently have loaded
  lmstudio("")
);

export const smallModel = process.env.USE_LOCAL_MODEL
  ? localModel
  : smallOpenAiModel;
