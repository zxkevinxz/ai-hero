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
  feedback: z
    .string()
    .optional()
    .describe(
      "If type is 'continue', provide feedback on what information is still missing or needs clarification based on the original research goal and the search results so far. This feedback will be used to refine the next search.",
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
    You are a research query optimizer. Your task is to analyze search results against the original research goal and either decide to answer the question or to search for more information.

    PROCESS:
    1. Identify ALL information explicitly requested in the original research goal (in the message history)
    2. Analyze what specific information has been successfully retrieved in the search results (in the search history)
    3. Identify ALL information gaps between what was requested and what was found
    4. If deciding to 'continue' searching: Provide feedback detailing the identified gaps. This feedback should guide the generation of new search queries. Focus on WHAT information is missing.
    5. If deciding to 'answer': Provide a brief reasoning, but feedback is not necessary.
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
