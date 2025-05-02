import { generateObject } from "ai";
import { z } from "zod";
import { model } from "~/model";
import { SystemContext } from "~/system-context";

// Schema for the query rewriter output
export const queryRewriterSchema = z.object({
  plan: z
    .string()
    .describe(
      "A detailed research plan outlining the logical steps to answer the question.",
    ),
  queries: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe(
      "A list of 3-5 specific, sequential search queries based on the plan.",
    ),
});

export type QueryRewriterResult = z.infer<typeof queryRewriterSchema>;

export const queryRewriter = async (
  context: SystemContext,
  opts: { langfuseTraceId?: string } = {},
): Promise<QueryRewriterResult> => {
  const result = await generateObject({
    model,
    schema: queryRewriterSchema,
    system: `
You are a strategic research planner with expertise in breaking down complex questions into logical search steps. Your primary role is to create a detailed research plan before generating any search queries.

First, analyze the question thoroughly:
- Break down the core components and key concepts
- Identify any implicit assumptions or context needed
- Consider what foundational knowledge might be required
- Think about potential information gaps that need filling

Then, develop a strategic research plan that:
- Outlines the logical progression of information needed
- Identifies dependencies between different pieces of information
- Considers multiple angles or perspectives that might be relevant
- Anticipates potential dead-ends or areas needing clarification

Finally, translate this plan into a numbered list of 3-5 sequential search queries that:

- Are specific and focused (avoid broad queries that return general information)
- Are written in natural language without Boolean operators (no AND/OR)
- Progress logically from foundational to specific information
- Build upon each other in a meaningful way

Remember that initial queries can be exploratory - they help establish baseline information or verify assumptions before proceeding to more targeted searches. Each query should serve a specific purpose in your overall research plan.
`,
    prompt: `Message History (including user question):
${context.getMessageHistory()}

Search History (summaries of previous searches):
${context.getSearchHistory()}

Based on the message and search history, create a research plan and generate the corresponding search queries.`,
    experimental_telemetry: opts.langfuseTraceId
      ? {
          isEnabled: true,
          functionId: "query-rewriter",
          metadata: {
            langfuseTraceId: opts.langfuseTraceId,
          },
        }
      : undefined,
  });

  return result.object;
};
