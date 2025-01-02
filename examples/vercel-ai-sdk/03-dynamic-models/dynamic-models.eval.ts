import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { evalite } from "evalite";
import { ask } from "./dynamic-models";

const prompt = `Tell me a story about your grandmother.`;

evalite("Testing Different Models", {
  data: async () => [
    {
      input: {
        model: anthropic("claude-3-5-haiku-latest"),
        prompt,
      },
    },
    {
      input: {
        model: openai("gpt-4o-mini"),
        prompt,
      },
    },
  ],
  task: async (input) => {
    return ask(input.prompt, input.model);
  },
  scorers: [],
});
