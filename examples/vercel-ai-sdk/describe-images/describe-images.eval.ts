import { createScorer, evalite } from "evalite";
import { describeImage } from "./describe-images";
import path from "path";

evalite<string, Awaited<ReturnType<typeof describeImage>>>("Describe Image", {
  data: async () => [
    {
      input: path.join(import.meta.dirname, "./image.jpg"),
    },
  ],
  task: async (input) => {
    const output = await describeImage(input);

    return output;
  },
  scorers: [
    createScorer({
      name: "Under 200 Chars",
      scorer: async ({ output }) => (output.length < 200 ? 1 : 0),
    }),
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
