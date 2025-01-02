import { evalite } from "evalite";
import { summarizeText } from "./system-prompt";
import { readFileSync } from "node:fs";
import path from "node:path";

evalite("Summarize Text", {
  data: async () => [
    {
      input: readFileSync(
        path.join(import.meta.dirname, "article.md"),
        "utf-8"
      ),
    },
  ],
  task: async (input) => {
    return summarizeText(input);
  },
  scorers: [],
});
