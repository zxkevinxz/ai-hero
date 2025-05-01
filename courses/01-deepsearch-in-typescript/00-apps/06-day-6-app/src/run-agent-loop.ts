import { streamText, type Message, type StreamTextResult } from "ai";
import { answerQuestion } from "./answer-question";
import { getNextAction } from "./get-next-action";
import { searchSerper } from "./serper";
import { bulkCrawlWebsites } from "./server/scraper";
import { summarizeURL } from "./summarize-url";
import { SystemContext } from "./system-context";
import type { OurMessageAnnotation } from "./types";

export async function runAgentLoop(
  messages: Message[],
  opts: {
    langfuseTraceId?: string;
    writeMessageAnnotation?: (annotation: OurMessageAnnotation) => void;
    onFinish: Parameters<typeof streamText>[0]["onFinish"];
  },
): Promise<StreamTextResult<{}, string>> {
  // A persistent container for the state of our system
  const ctx = new SystemContext(messages);

  // A loop that continues until we have an answer
  // or we've taken 10 actions
  while (!ctx.shouldStop()) {
    // We choose the next action based on the state of our system
    const nextAction = await getNextAction(ctx, opts);

    // Send the action as an annotation if writeMessageAnnotation is provided
    if (opts.writeMessageAnnotation) {
      opts.writeMessageAnnotation({
        type: "NEW_ACTION",
        action: nextAction,
      });
    }

    // We execute the action and update the state of our system
    if (nextAction.type === "search") {
      if (!nextAction.query) {
        throw new Error("Query is required for search action");
      }
      // Search with fewer results to reduce context window usage
      const results = await searchSerper(
        { q: nextAction.query, num: 10 },
        undefined,
      );

      // Scrape the URLs from the search results
      const scrapeResults = await bulkCrawlWebsites({
        urls: results.organic.map((result) => result.link),
      });

      // Summarize each scraped result in parallel
      const summarizedResults = await Promise.all(
        results.organic.map(async (result, index) => {
          const scrapeResult = scrapeResults.results[index]!.result;

          let summary: string | undefined;

          if (scrapeResult.success) {
            summary = await summarizeURL({
              conversationHistory: ctx.getMessageHistory(),
              scrapedContent: scrapeResult.data,
              metadata: {
                date: result.date || new Date().toISOString(),
                title: result.title,
                url: result.link,
                snippet: result.snippet,
              },
              query: nextAction.query!,
              langfuseTraceId: opts.langfuseTraceId,
            });
          }

          return {
            date: result.date || new Date().toISOString(),
            title: result.title,
            url: result.link,
            snippet: result.snippet,
            scrapedContent: scrapeResult.success
              ? scrapeResult.data
              : scrapeResult.error,
            summary,
          };
        }),
      );

      // Combine search and scrape results
      ctx.reportSearch({
        query: nextAction.query,
        results: summarizedResults,
      });
    } else if (nextAction.type === "answer") {
      return answerQuestion(ctx, { isFinal: false, ...opts });
    }

    // We increment the step counter
    ctx.incrementStep();
  }

  // If we've taken 10 actions and still haven't answered, return a final answer
  return answerQuestion(ctx, { isFinal: true, ...opts });
}
