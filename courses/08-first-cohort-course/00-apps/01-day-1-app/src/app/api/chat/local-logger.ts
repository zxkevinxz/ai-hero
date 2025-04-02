import { appendFileSync } from "fs";
import path from "path";

const LOG_LOCATION = path.join(process.cwd(), "log.local.md");

export const localLogger = {
  log: (title: string, content: unknown) => {
    if (process.env.NODE_ENV === "production") return;

    let output;

    if (typeof content === "string") {
      output = `## ${title}\n\n${content}\n\n`;
    } else {
      output = [
        `## ${title}`,
        "```json",
        JSON.stringify(content, null, 2),
        "```",
      ].join("\n");
    }

    appendFileSync(LOG_LOCATION, output);
  },
};
