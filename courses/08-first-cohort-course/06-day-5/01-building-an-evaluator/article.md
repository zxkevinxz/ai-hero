## Problem

TODO: Find questions that our system can't answer.

We've improved our system. But i still feel like it's a little bit eager to answer the user's question. There is no explicit evaluation step built in to our implementation.

We rely on the `getNextAction` LLM call to figure out if we have enough information to answer the user's question. This means that if we want to improve the way our system evaluates its own responses we need to target that system prompt.

This feels like putting too many eggs in one basket. Instead, we should build an evaluation step That explicitly evaluates the quality of the response when we answer.

This will form part of our 'answer' action. We'll get the LLM to produce an answer. Then we'll get it to evaluate whether the answer is good enough.

The pseudocode for this looks like this:

```ts
const ctx = {};

while (ctx.step < 10) {
  const nextAction = await getNextAction(ctx);

  // ...other actions...
  if (nextAction === "give-final-answer") {
    const answer = answerQuestion(ctx);
    // Evaluate the answer
    const evaluation = evaluateAnswer(ctx, answer);

    if (evaluation.isGoodEnough) {
      return answer;
    }

    // If the answer is not good enough, we need to try again.
    ctx.badAnswers.push(answer);
  }
}
```

## Designing the `evaluateAnswer` function

Our `evaluateAnswer` function needs to be carefully designed. We need to match it to the success criteria for our answers.

- Definitiveness - fully answers the question
- Relevance - relevant to the question
- Sources - uses sources
- Recency - up to date

There are two possible designs for this. We could run four different LLM calls, one for each of the criteria.

```ts
// Option 1
const results = await Promise.all([
  evaluateDefinitiveness(answer),
  evaluateRelevance(answer),
  evaluateSources(answer),
  evaluateRecency(answer),
]);
```

Or, we could run a single LLM call that evaluates all four criteria at once.

```ts
// Option 2
const results = await evaluateAnswer(answer);
```

We're gonna stick with Option 2 for now. It's simpler to implement, and we should always try to do the simpler thing first.

Option 1 also may end up testing our system on metrics which don't matter to the actual question. For example, not all questions need up-to-date information: "who founded the company that makes the iPhone?". Option 2 will be able to handle the evaluation AND assess whether the evaluation is relevant to the question in a single pass.

However, we should keep option 1 on our radar. Option 2 may end up being too reliant on a single system prompt.

## Implementing the `evaluateAnswer` function

We'll need to use structured outputs to make sure that we get output from the LLM that we can use. We'll need to use this rather large schema, with descriptions for each field:

```ts
import { z } from "zod";
import { generateObject } from "ai";

export const evaluateAnswer = generateObject({
  model,
  schema: z.object({
    metrics: z.object({
      definitiveness: z.object({
        doesMetricMatter: z
          .boolean()
          .describe(
            "Whether the answer needs to be checked for definitiveness",
          ),
        pass: z
          .boolean()
          .describe(
            "Whether the answer is definitively correct",
          ),
        reasoning: z
          .string()
          .describe("The reason for the pass or fail"),
      }),
      relevance: z.object({
        doesMetricMatter: z
          .boolean()
          .describe(
            "Whether the answer needs to be checked for relevance",
          ),
        pass: z
          .boolean()
          .describe(
            "Whether the answer is relevant to the question",
          ),
        reasoning: z
          .string()
          .describe("The reason for the pass or fail"),
      }),
      sources: z.object({
        doesMetricMatter: z
          .boolean()
          .describe(
            "Whether the answer needs to be checked for sources",
          ),
        pass: z
          .boolean()
          .describe("Whether the answer uses sources"),
        reasoning: z
          .string()
          .describe("The reason for the pass or fail"),
      }),
      recency: z.object({
        doesMetricMatter: z
          .boolean()
          .describe(
            "Whether the answer needs to be checked for recency",
          ),
        pass: z
          .boolean()
          .describe(
            "Whether the answer is up to date",
          ),
        reasoning: z
          .string()
          .describe("The reason for the pass or fail"),
      }),
    }),
  }),
  prompt: `
  You are an expert evaluator. You are given an answer to a question. You need to evaluate the answer based on the following criteria:

  - Definitiveness
  - Relevance
  - Sources
  - Recency

  You need to provide a pass/fail for each criterion, and a reason for the pass/fail.

  


  `,
});
```

## Saving Failed Attempts

We'll also need to redesign our `SystemContext` class in order to save failed attempts.

## Steps To Complete

- Create a new `evaluateAnswer` function.
