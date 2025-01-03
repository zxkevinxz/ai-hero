import { streamObject } from "ai";
import { z } from "zod";
import { smallOpenAiModel } from "../../_shared/models";

const model = smallOpenAiModel;

export const createRecipe = async (prompt: string) => {
  const result = await streamObject({
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

  // You can iterate over the partialObjectStream to get
  // partial results:

  for await (const obj of result.partialObjectStream) {
    // `obj` will be the latest version of the object,
    // sometimes with not all properties populated
    //
    // In this case it may not contain steps, ingredients,
    // or name.
    console.dir(obj, { depth: null });
  }

  // You can await result.object to get the final result:
  const finalObject = await result.object;

  return finalObject.recipe;
};
