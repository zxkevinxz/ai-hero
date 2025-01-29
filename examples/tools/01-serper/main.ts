import { streamText } from "ai";
import { flagshipAnthropicModel } from "../../_shared/models.ts";
import { serper } from "./tools.ts";
import dedent from "dedent";

const result = streamText({
  model: flagshipAnthropicModel,
  tools: {
    ...serper.tools,
  },
  system: dedent`
    You are a research agent. You can search the web to
    find out information.

    For every fact you return, reference the URL you used
    to find out the information.
  `,
  prompt: `Tell me about the history of the antelope.`,
  maxSteps: 5,
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
