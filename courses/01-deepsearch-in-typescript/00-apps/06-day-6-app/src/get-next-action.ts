import { generateObject } from "ai";
import { z } from "zod";
import { model } from "~/model";
import { SystemContext } from "~/system-context";

export const nextActionSchema = z.object({
  reasoning: z
    .string()
    .describe(
      "The reasoning behind choosing to continue searching or to answer the question.",
    ),
  type: z.enum(["continue", "answer"]).describe(
    `The type of action to take next.
      - 'continue': Indicate that more searching is needed before answering.
      - 'answer': Indicate that enough information has been gathered to answer the question.`,
  ),
});

// Update the Action type accordingly
export type NextAction = z.infer<typeof nextActionSchema>;

export const getNextAction = async (
  context: SystemContext,
  opts: { langfuseTraceId?: string } = {},
) => {
  const result = await generateObject({
    model,
    schema: nextActionSchema, // Use the new schema
    system: `
    You are an AI assistant determining the next step in a research process. Your goal is to decide whether the system has gathered enough information to answer the user's question or if it needs to continue searching.
    `,
    prompt: `Message History (including user question):
${context.getMessageHistory()}

Search History (summaries of previous searches):
${context.getSearchHistory()}

Based on the message history and the search history, decide the next step:
1. If the available information is sufficient to provide a comprehensive answer to the user's question, choose 'answer'.
2. If more information is needed or the current information isn't quite enough, choose 'continue'.

Explain your reasoning clearly.`,
    experimental_telemetry: opts.langfuseTraceId
      ? {
          isEnabled: true,
          functionId: "get-next-action",
          metadata: {
            langfuseTraceId: opts.langfuseTraceId,
          },
        }
      : undefined,
  });

  return result.object;
};
