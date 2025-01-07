import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";

export default tseslint.config(
  ...eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...markdown.configs.recommended,
  {
    files: ["**/*.md"],
    plugins: {
      markdown,
    },
    language: "markdown/commonmark",
    rules: {
      "markdown/no-html": "error",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
