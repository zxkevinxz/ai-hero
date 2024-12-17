import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*{problem,solution,explainer}*.{ts,tsx}"],
    passWithNoTests: true,
    setupFiles: ["dotenv/config"],
  },
});
