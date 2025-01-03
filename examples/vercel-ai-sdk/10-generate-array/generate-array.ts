import { generateObject } from "ai";
import { z } from "zod";
import { smallModel } from "../../_shared/models";

const model = smallModel;

export const createFakeUsers = async (input: string) => {
  const { object } = await generateObject({
    model,
    prompt: input,
    system: `You are generating fake user data.`,
    output: "array",
    schema: z.object({
      name: z.string().describe("The name of the user"),
      age: z.number().describe("The user's age"),
      email: z
        .string()
        .email()
        .describe("The user's email address, @example.com"),
    }),
  });

  return object;
};
