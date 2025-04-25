import { SystemContext } from "./system-context";
import { getNextAction } from "./get-next-action";
import { searchSerper } from "./serper";
import { bulkCrawlWebsites } from "./server/scraper";
import { streamText, type StreamTextResult } from "ai";
import { model } from "~/model";
import { answerQuestion } from "./answer-question";

export async function runAgentLoop(
  initialQuestion: string,
): Promise<StreamTextResult<{}, string>> {
  // A persistent container for the state of our system
  const ctx = new SystemContext(initialQuestion);

  // A loop that continues until we have an answer
  // or we've taken 10 actions
  while (!ctx.shouldStop()) {
    // We choose the next action based on the state of our system
    const nextAction = await getNextAction(ctx);

    // We execute the action and update the state of our system
    if (nextAction.type === "search") {
      if (!nextAction.query) {
        throw new Error("Query is required for search action");
      }
      const results = await searchSerper(
        { q: nextAction.query, num: 10 },
        undefined,
      );
      ctx.reportQueries([
        {
          query: nextAction.query,
          results: results.organic.map((result) => ({
            date: result.date || new Date().toISOString(),
            title: result.title,
            url: result.link,
            snippet: result.snippet,
          })),
        },
      ]);
    } else if (nextAction.type === "scrape") {
      if (!nextAction.urls) {
        throw new Error("URLs are required for scrape action");
      }
      const results = await bulkCrawlWebsites({ urls: nextAction.urls });
      if (results.success) {
        ctx.reportScrapes(
          results.results.map(({ url, result }) => ({
            url,
            result: result.data,
          })),
        );
      }
    } else if (nextAction.type === "answer") {
      return answerQuestion(ctx);
    }

    // We increment the step counter
    ctx.incrementStep();
  }

  // If we've taken 10 actions and haven't answered yet,
  // we ask the LLM to give its best attempt at an answer
  return answerQuestion(ctx, { isFinal: true });
}
