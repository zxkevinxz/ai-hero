import { anthropic } from "@ai-sdk/anthropic";
import { type Message, streamObject } from "ai";
import dedent from "dedent";
import { traceAISDKModel } from "evalite/ai-sdk";
import { z } from "zod";

const model = traceAISDKModel(anthropic("claude-3-5-sonnet-latest"));

export const createPlan = (messages: Message[]) => {
  const todaysDate = new Date().toISOString().split("T")[0];

  return streamObject({
    model,
    schema: z.object({
      plan: z.string().describe(
        dedent`
          The step-by-step plan for how to solve the user's
          question. Reply with a list.
        `,
      ),
      queries: z.array(
        z.object({
          query: z.string().describe("The query to search the web for"),
        }),
      ),
    }),
    system: dedent`
      Based on the user's question, create a plan on how to
      search the web to answer the their question.
      Then, return the queries to search the web for.
      Today's date is ${todaysDate}.

      ## Creating The Plan

      If only one query is needed, use one query.

        Who is Kai Havertz? -> ["Kai Havertz"]

      If multiple queries are needed, for comparison purposes,
      use multiple queries:

        Compare Arsene Wenger and Sir Alex Ferguson's
        managerial record -> [
          "Arsene Wenger managerial record",
          "Sir Alex Ferguson managerial record"
        ]

      ## Up To Date Information

      - Today's date is ${todaysDate}.
      - Use the current year in search queries to get up to
        date information if needed.
    `,
    messages,
  });
};
