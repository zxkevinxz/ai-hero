import { anthropic } from "@ai-sdk/anthropic";
import { cacheModelInFs } from "../caching/cache-model-in-fs";
import { openai } from "@ai-sdk/openai";

export const pdfModel = cacheModelInFs(anthropic("claude-3-5-sonnet-latest"));

export const smallOpenAiModel = cacheModelInFs(openai("gpt-4o-mini"));
