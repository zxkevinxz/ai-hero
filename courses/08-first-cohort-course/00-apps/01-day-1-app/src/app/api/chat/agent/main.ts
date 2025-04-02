import { type CoreMessage, type DataStreamWriter, type Message } from "ai";
import dedent from "dedent";
import { setTimeout } from "node:timers/promises";
import { getUrlsToCrawl } from "../search-web";
import { AgentGlobalContext } from "./agent-global-context";
import { createDataStreamWritable } from "./create-data-stream-writable";
import { evaluateAnswer } from "./evaluate-answer";
import { getNextStep } from "./get-next-step";
import { getQuestionEvaluationMetrics } from "./get-question-evaluation-metrics";
import { TokenBudgetTracker } from "./token-budget-tracker";

const EXAMPLE_MESSAGES: Array<CoreMessage> = [
  {
    content: "Who is going to InfoBip Shift this year?",
    role: "user",
  },
  {
    content:
      "Infobip Shift 025 is bringing together a global community of developers, software engineers, product owners, founders, startups, and IT professionals to Zadar, Croatia, from September 14-16, 2025 1. Some confirmed speakers include Rasmus Lerdorf (creator of PHP), Hakon Wium Lie (creator of CSS), Una Kravets (Senior Developer Relations Engineer at Google), Rich Harris (Graphics Editor at New York Times), and Charity Majors (Co-Founder / CTO at honeycomb.io) 2.",
    role: "assistant",
  },
];

export const runAgent = async (opts: {
  messages: Array<Message>;
  dataStream: DataStreamWriter;
  tokenBudget: number;
}) => {
  const tokenBudgetTracker = new TokenBudgetTracker(opts.tokenBudget);

  const question = opts.messages[opts.messages.length - 1]?.content;

  if (!question) throw new Error("Could not find question in messages");

  const textStream = createDataStreamWritable({
    chunkDelay: 40,
  });

  opts.dataStream.merge(textStream.readableStream);

  const ctx = new AgentGlobalContext({ question });

  while (!tokenBudgetTracker.isInDangerZone()) {
    ctx.incrementStepCount();

    ctx.updateCurrentQuestion();

    const [metrics, nextStep] = await Promise.all([
      getQuestionEvaluationMetrics(ctx.currentQuestion, tokenBudgetTracker),
      getNextStep({ context: ctx, messages: opts.messages }),
    ]);

    textStream.addChunk(nextStep.reasoning + " ", "reasoning");

    if (nextStep.action === "answer") {
      const answer = nextStep.answer!;
      const question = ctx.currentQuestion;

      if (ctx.step === 0) {
        // We are on the first step, the LLM thinks it has
        // the knowledge in its training data

        textStream.addChunk(answer, "text");
        break;
      }

      textStream.addChunk(
        `But wait, let me evaluate the answer first. `,
        "reasoning",
      );

      const evaluation = await evaluateAnswer({
        answer,
        question,
        metrics: metrics.metrics,
      });

      if (evaluation.pass) {
        if (ctx.isAnsweringInitialQuestion()) {
          textStream.addChunk(answer, "text");
          break;
        }

        ctx.diary.push(dedent`
          At step ${ctx.step}, you took the **answer** action.
          You found a good answer to the sub-question:

          Sub-question:
          ${ctx.currentQuestion}

          Answer:
          ${answer}

          Although you solved a sub-question, you still need
          to find the answer to the original question.
          You need to keep going.
        `);

        ctx.prevAnswers.push({
          question: ctx.currentQuestion,
          answer,
          references: nextStep.references,
        });
      } else {
        ctx.diary.push(dedent`
          At step ${ctx.step}, you took **answer** action but evaluator thinks it is not a good answer:

          Original question: 
          ${ctx.currentQuestion}

          Your answer: 
          ${answer}

          Your answer failed the ${evaluation.metric} evaluation.

          The evaluator thinks your answer is bad because: 
          ${evaluation.reasoning}
        `);

        // ctx.badAttempts.push({

        // })
      }
    } else if (nextStep.action === "search") {
      const searchQueries = nextStep.searchRequests;

      if (!searchQueries || searchQueries.length === 0) {
        continue;
      }

      textStream.addChunk(
        `Let's search the web for ${searchQueries.join(", ")}. `,
        "reasoning",
      );

      const results = await getUrlsToCrawl({
        queries: searchQueries,
        abortSignal: undefined, // TODO
      });

      Object.assign(ctx.searchResultsStore, results.searchResultsByUrl);
      ctx.searchTerms.push(...searchQueries);
    } else if (nextStep.action === "visit") {
      const urls = nextStep.URLTargets;

      if (!urls || urls.length === 0) {
        continue;
      }

      textStream.addChunk(
        `Let's read the results of these sites.`,
        "reasoning",
      );
    }
  }

  await textStream.waitForClose();

  await setTimeout(5000);
};
