import { generateObject } from "ai";
import type { TokenBudgetTracker } from "./token-budget-tracker";
import { generalUseModel } from "./models";
import { z } from "zod";
import dedent from "dedent";
import type { QuestionEvaluationMetric } from "./types";

// TODO - error handling
// TODO - add attribution checking
export const getQuestionEvaluationMetrics = async (
  question: string,
  tokenBudgetTracker: TokenBudgetTracker,
) => {
  const result = await generateObject({
    model: generalUseModel,
    prompt: dedent`
      You are an evaluator that determines if a question requires freshness, plurality, and/or completeness checks in addition to the required definitiveness check.

      The current date is ${new Date().toLocaleDateString()}.

      <evaluation_types>
      1. freshness - Checks if the question is time-sensitive or requires very recent information
      2. plurality - Checks if the question asks for multiple items, examples, or a specific count or enumeration
      3. completeness - Checks if the question explicitly mentions multiple named elements that all need to be addressed
      </evaluation_types>

      <rules>
      1. Freshness Evaluation:
        - Required for questions about current state, recent events, or time-sensitive information
        - Required for: prices, versions, leadership positions, status updates
        - Look for terms: "current", "latest", "recent", "now", "today", "new"
        - Consider company positions, product versions, market data time-sensitive
        - Required for topics that change frequently or have recent updates, e.g., technology, politics, news, AI

      2. Plurality Evaluation:
        - ONLY apply when completeness check is NOT triggered
        - Required when question asks for multiple examples, items, or specific counts
        - Check for: numbers ("5 examples"), list requests ("list the ways"), enumeration requests
        - Look for: "examples", "list", "enumerate", "ways to", "methods for", "several"
        - Focus on requests for QUANTITY of items or examples

      3. Completeness Evaluation:
        - Takes precedence over plurality check - if completeness applies, set plurality to false
        - Required when question EXPLICITLY mentions multiple named elements that all need to be addressed
        - This includes:
          * Named aspects or dimensions: "economic, social, and environmental factors"
          * Named entities: "Apple, Microsoft, and Google", "Biden and Trump"
          * Named products: "iPhone 15 and Samsung Galaxy S24"
          * Named locations: "New York, Paris, and Tokyo"
          * Named time periods: "Renaissance and Industrial Revolution"
        - Look for explicitly named elements separated by commas, "and", "or", bullets
        - Example patterns: "comparing X and Y", "differences between A, B, and C", "both P and Q"
        - DO NOT trigger for elements that aren't specifically named
      </rules>

      Now evaluate this question:
      Question: ${question}
    `,
    schema: z.object({
      reasoning: z
        .string()
        .describe(
          `A very concise explanation of why you chose those checks. Max 500 characters.`,
        )
        .max(500),
      needsFreshness: z
        .boolean()
        .describe("If the question requires a freshness check"),
      needsPlurality: z
        .boolean()
        .describe("If the question requires a plurality check"),
      needsCompleteness: z
        .boolean()
        .describe("If the question requires a completeness check"),
    }),
  });

  tokenBudgetTracker.logSpentTokens(result.usage.totalTokens);

  const metrics: QuestionEvaluationMetric[] = [
    // Always include definitiveness
    "definitive",
  ];

  result.object.needsFreshness && metrics.push("freshness");
  result.object.needsPlurality && metrics.push("plurality");
  result.object.needsCompleteness && metrics.push("completeness");

  return {
    metrics,
    reasoning: result.object.reasoning,
  };
};
