import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { traceAISDKModel } from "evalite/ai-sdk";
import { z } from "zod";

const model = traceAISDKModel(openai("gpt-4o"));

export const createRecipe = async (prompt: string) => {
  const { object } = await generateObject({
    model: yourModel,
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({ name: z.string(), amount: z.string() })
        ),
        steps: z.array(z.string()),
      }),
    }),
    prompt,
  });
};
