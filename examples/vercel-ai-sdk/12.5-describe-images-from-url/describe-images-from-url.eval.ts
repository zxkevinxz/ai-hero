import { Factuality } from "autoevals";
import { createScorer, evalite } from "evalite";
import { describeImage } from "./describe-images-from-url";

evalite("Describe Image", {
  data: async () => [
    {
      input: "",
      expected: `A church next to a lake, with mountains in the background.`,
    },
    {
      input: "",
      expected: `A fireworks display in the night sky.`,
    },
    {
      input: "",
      expected: `A person looking at a computer screen displaying a chart, holding a glass.`,
    },
  ],
  task: async (input) => {
    const output = await describeImage(input);

    return output;
  },
  scorers: [
    createScorer({
      name: "Under 160 Chars",
      scorer: async ({ output }) => (output.length < 160 ? 1 : 0),
    }),
    Factuality as any,
  ],
  experimental_customColumns: async (result) => [
    {
      label: "Image File",
      value: result.input,
    },
    {
      label: "Description",
      value: result.output,
    },
    {
      label: "Description Length",
      value: result.output.length,
    },
  ],
});
