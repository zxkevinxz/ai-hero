import { bulkCrawlWebsites } from "./crawl-site";
import { searchSerper } from "./serper";

const NUMBER_OF_SEARCH_RESULTS_TO_CRAWL = 4;

export const getUrlsToCrawl = async (opts: {
  queries: string[];
  abortSignal: AbortSignal | undefined;
}) => {
  const { queries, abortSignal } = opts;

  const searchResults = await Promise.all([
    ...queries.map(async (query) => {
      return {
        query,
        output: await searchSerper(
          { q: query, num: NUMBER_OF_SEARCH_RESULTS_TO_CRAWL },
          abortSignal,
        ),
      };
    }),
  ]);

  const searchResultsByUrl: Record<
    string,
    {
      query: string;
      url: string;
      snippet: string;
      date?: string;
    }
  > = {};

  searchResults.forEach((result) => {
    result.output.organic.forEach((r) => {
      searchResultsByUrl[r.link] = {
        query: result.query,
        url: r.link,
        snippet: r.snippet,
        date: r.date,
      };
    });
  });

  return {
    searchResultsByUrl,
    knowledgeGraphs: searchResults.map(
      (result) => result.output.knowledgeGraph,
    ),
  };
};

export const searchWeb = async (opts: {
  queries: string[];
  abortSignal: AbortSignal | undefined;
}) => {
  const { queries: query, abortSignal } = opts;
  const searchResults = await getUrlsToCrawl({
    queries: query,
    abortSignal,
  });

  try {
    const scrapeResults = await bulkCrawlWebsites({
      urls: Object.keys(searchResults.searchResultsByUrl),
    });

    return {
      knowledgeGraphs: searchResults.knowledgeGraphs,
      results: scrapeResults.results.map((r) => {
        return {
          query: searchResults.searchResultsByUrl[r.url]?.query,
          url: r.url,
          text: r.result.success ? r.result.data : r.result.error,
          date: searchResults.searchResultsByUrl[r.url]?.date,
          snippet: searchResults.searchResultsByUrl[r.url]?.snippet,
        };
      }),
    };
  } catch (e) {
    return {
      error: `Crawling failed: ${e}.`,
    };
  }
};
