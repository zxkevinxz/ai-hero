import { execSync } from "node:child_process";
import path from "node:path";

execSync("pnpm next dev --turbo", {
  stdio: "inherit",
  cwd: path.join(import.meta.dirname, "app"),
});
