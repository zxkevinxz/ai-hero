import { generateObject } from "ai";
import { z } from "zod";
import { smallModel } from "../../_shared/models";

const model = smallModel;

export const createRecipe = async (prompt: string) => {
  const { object } = await generateObject({
    model,
    system:
      `You are helping a user create a recipe. ` +
      `Use British English variants of ingredient names, like Coriander over Cilantro.`,
    schemaName: "Recipe",
    schema: z.object({
      recipe: z.object({
        name: z.string().describe("The title of the recipe"),
        ingredients: z
          .array(z.object({ name: z.string(), amount: z.string() }))
          .describe("The ingredients needed for the recipe"),
        steps: z.array(z.string()).describe("The steps to make the recipe"),
      }),
    }),
    prompt,
  });

  return object.recipe;
};
