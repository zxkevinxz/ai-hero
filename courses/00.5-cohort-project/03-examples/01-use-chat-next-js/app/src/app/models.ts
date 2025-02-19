import { anthropic } from "@ai-sdk/anthropic";

export const flagshipModel = anthropic(
  "claude-3-5-sonnet-latest",
);
