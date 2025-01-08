import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...markdown.configs.processor,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // For .ts file inside markdown code blocks
    files: ["**/*.md/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "no-empty": "off",
      "no-undef": "warn",
    },
    languageOptions: {
      globals: {
        model: "readonly",
        console: "readonly",
        URL: "readonly",
        process: "readonly",
      },
    },
  },
);
