import dedent from "dedent";
import { z } from "zod";

export const MAX_URLS_PER_STEP = 2;
export const MAX_QUERIES_PER_STEP = 5;
export const MAX_REFLECT_PER_STEP = 3;

export const getNextStepSchema = z.object({
  action: z.enum(["search", "visit", "answer", "reflect"]),
  reasoning: z
    .string()
    .max(500)
    .describe(
      dedent`
        Explain why choose this action, what's the
        thought process behind choosing this action.
      `,
    ),
  searchRequests: z
    .array(
      z.string().describe(
        dedent`
            A natural language search request. Based on
            the deep intention behind the original
            question and the expected answer format.
            Max number of characters: 50.
          `,
      ),
    )
    .optional()
    .describe(
      dedent`
        Required when action='search'.
        Always prefer a single request, only add another
        request if the original question covers multiple
        aspects or elements and one search request is
        definitely not enough, each request focus on one
        specific aspect of the original question.
        Minimize mutual information between each request.
        Maximum ${MAX_QUERIES_PER_STEP} search requests.
      `,
    ),
  references: z
    .array(
      z.object({
        exactQuote: z
          .string()
          .describe(
            "Exact relevant quote from the document, must be a soundbite, short and to the point, no fluff",
          ),
        url: z
          .string()
          .describe("source URL; must be directly from the context"),
      }),
    )
    .describe(
      "Required when action='answer'. Must be an array of references that support the answer, each reference must contain an exact quote and the URL of the document",
    )
    .optional(),
  answer: z
    .string()
    .describe(
      `Required when action='answer'. Must be definitive, no ambiguity, uncertainty, or disclaimers. Must be confident. Use markdown footnote syntax like [^1], [^2] to refer the corresponding reference item.`,
    )
    .optional(),
  URLTargets: z
    .array(z.string())
    .max(MAX_URLS_PER_STEP)
    .describe(
      `Required when action='visit'. Must be an array of URLs, choose up the most relevant ${MAX_URLS_PER_STEP} URLs to visit`,
    )
    .optional(),
  questionsToAnswer: z
    .array(
      z
        .string()
        .describe(
          "each question must be a single line, Questions must be: Original (not variations of existing questions); Focused on single concepts; Under 20 words; Non-compound/non-complex",
        ),
    )
    .max(MAX_REFLECT_PER_STEP)
    .describe(
      `Required when action='reflect'. List of most important questions to fill the knowledge gaps of finding the answer to the original question. Maximum provide ${MAX_REFLECT_PER_STEP} reflect questions.`,
    )
    .optional(),
});
