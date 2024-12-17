import { createScorer, evalite } from "evalite";
import { describeImage } from "./describe-images";
import path from "path";
import { readFileSync } from "fs";

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
  scorers: [],
  experimental_customColumns: async (result) => [
    {
      label: "Image File",
      value: result.input,
    },
    {
      label: "Description",
      value: result.output,
    },
  ],
});
