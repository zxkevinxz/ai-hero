import { Factuality } from "autoevals";
import { createScorer, evalite } from "evalite";
import { describeImage } from "./describe-images-from-url";

evalite("Describe Image From URL", {
  data: async () => [
    {
      input:
        "https://github.com/ai-hero-dev/ai-hero/blob/main/internal/assets/image.jpg?raw=true",
      expected: `A church next to a lake, with mountains in the background.`,
    },
    {
      input:
        "https://github.com/ai-hero-dev/ai-hero/blob/main/internal/assets/fireworks.jpg?raw=true",
      expected: `A fireworks display in the night sky.`,
    },
    {
      input:
        "https://github.com/ai-hero-dev/ai-hero/blob/main/internal/assets/man-with-computer.jpg?raw=true",
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
