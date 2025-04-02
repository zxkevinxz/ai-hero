import { generateObject } from "ai";
import type { QuestionEvaluationMetric } from "./types";
import { generalUseModel } from "./models";
import { z } from "zod";
import dedent from "dedent";
import {
  getCompletenessPrompt,
  getDefinitivePrompt,
  getFreshnessPrompt,
  getPluralityPrompt,
} from "./evaluate-answer.prompt";

export const evaluateAnswer = async (opts: {
  question: string;
  answer: string;
  metrics: QuestionEvaluationMetric[];
}) => {
  const results: {
    metric: QuestionEvaluationMetric;
    pass: boolean;
    reasoning: string;
  }[] = [];

  for (const metric of opts.metrics) {
    let prompt = "";

    if (metric === "definitive") {
      prompt = getDefinitivePrompt(opts);
    } else if (metric === "freshness") {
      prompt = getFreshnessPrompt(opts);
    } else if (metric === "plurality") {
      prompt = getPluralityPrompt(opts);
    } else if (metric === "completeness") {
      prompt = getCompletenessPrompt(opts);
    } else if (metric === "attribution") {
      continue; // TODO
    }

    const result = await generateObject({
      model: generalUseModel,
      schema: z.object({
        pass: z
          .boolean()
          .describe(
            "Whether the answer passes the evaluation criteria defined by the evaluator",
          ),
        reasoning: z
          .string()
          .describe(
            `Explanation the thought process why the answer does not pass the evaluation criteria.`,
          )
          .max(500),
      }),
      prompt,
    });
    results.push({ ...result.object, metric });
    if (!result.object.pass) {
      return {
        pass: false,
        metric,
        reasoning: result.object.reasoning,
      };
    }
  }

  return {
    pass: true,
  };
};
