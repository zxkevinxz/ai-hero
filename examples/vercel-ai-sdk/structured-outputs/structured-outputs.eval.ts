import { createScorer, evalite } from "evalite";
import { createRecipe } from "./structured-outputs";

evalite<string, Awaited<ReturnType<typeof createRecipe>>>(
  "Structured Outputs",
  {
    data: async () => [
      {
        input: "How to make baba ganoush",
      },
      {
        input: "How to make a vegan chocolate cake",
      },
    ],
    task: async (input) => {
      const recipe = await createRecipe(input);

      return recipe;
    },
    scorers: [
      createScorer({
        name: "Ingredients Length",
        description: "Should have at least one ingredient",
        scorer: async ({ output }) => (output.ingredients.length > 1 ? 1 : 0),
      }),
      createScorer({
        name: "Steps Length",
        description: "Should have at least one step",
        scorer: async ({ output }) => (output.steps.length > 1 ? 1 : 0),
      }),
    ],
  }
);
