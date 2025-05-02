import { streamText, type Message, type StreamTextResult } from "ai";
import { answerQuestion } from "./answer-question";
import { getNextAction } from "./get-next-action";
import { queryRewriter } from "./query-rewriter";
import { searchSerper } from "./serper";
import { bulkCrawlWebsites, type BulkCrawlResponse } from "./server/scraper";
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
  const ctx = new SystemContext(messages);

  while (!ctx.shouldStop()) {
    const { plan, queries } = await queryRewriter(ctx, opts);

    if (opts.writeMessageAnnotation) {
      opts.writeMessageAnnotation({
        type: "PLAN_AND_QUERIES",
        plan,
        queries,
      });
    }

    const searchPromises = queries.map((query) =>
      searchSerper({ q: query, num: 5 }, undefined),
    );
    const searchResultsArray = await Promise.all(searchPromises);

    const allUrlsToScrape = searchResultsArray.flatMap((results) =>
      results.organic.map((result) => result.link),
    );
    const scrapeResultsContainer = await bulkCrawlWebsites({
      urls: allUrlsToScrape,
    });

    const scrapeResultMap = new Map<
      string,
      BulkCrawlResponse["results"][number]
    >();
    scrapeResultsContainer.results.forEach((result, index) => {
      scrapeResultMap.set(allUrlsToScrape[index]!, result);
    });

    const combinedResultsPromises = searchResultsArray.map(
      async (searchResults, queryIndex) => {
        const query = queries[queryIndex]!;
        const summarizedResults = await Promise.all(
          searchResults.organic.map(async (result) => {
            const scrapeResult = scrapeResultMap.get(result.link)?.result;
            let summary: string | undefined;

            if (scrapeResult?.success) {
              summary = await summarizeURL({
                conversationHistory: ctx.getMessageHistory(),
                scrapedContent: scrapeResult.data,
                metadata: {
                  date: result.date || new Date().toISOString(),
                  title: result.title,
                  url: result.link,
                  snippet: result.snippet,
                },
                query,
                langfuseTraceId: opts.langfuseTraceId,
              });
            }

            return {
              date: result.date || new Date().toISOString(),
              title: result.title,
              url: result.link,
              snippet: result.snippet,
              scrapedContent: scrapeResult?.success
                ? scrapeResult.data
                : (scrapeResult?.error ?? "Scraping failed"),
              summary,
            };
          }),
        );

        const combinedResult = {
          query,
          results: summarizedResults,
        };
        ctx.reportSearch(combinedResult);
        return combinedResult;
      },
    );

    await Promise.all(combinedResultsPromises);

    const decision = await getNextAction(ctx, opts);

    // Store the feedback in the context
    ctx.setLatestFeedback(decision.feedback);

    if (opts.writeMessageAnnotation) {
      opts.writeMessageAnnotation({
        type: "DECISION",
        decision,
        feedback: decision.feedback,
      });
    }

    if (decision.type === "answer") {
      return answerQuestion(ctx, { isFinal: false, ...opts });
    }

    ctx.incrementStep();
  }

  return answerQuestion(ctx, { isFinal: true, ...opts });
}
