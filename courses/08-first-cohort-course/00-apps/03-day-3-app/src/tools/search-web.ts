import { cacheWithRedis } from "~/server/redis/redis";
import { searchSerper } from "~/serper";
import { scrapePages } from "./scrape-pages";
import { env } from "~/env";

export type SearchWebResult = {
  title: string;
  link: string;
  snippet: string;
  content?: string;
};

export const searchWeb = cacheWithRedis(
  "search-web",
  async (query: string, signal: AbortSignal | undefined) => {
    // First, search for relevant pages
    const searchResults = await searchSerper(
      { q: query, num: env.SEARCH_RESULTS_COUNT },
      signal,
    );

    console.dir(searchResults, { depth: null });

    // Extract URLs from search results
    const urls = searchResults.organic.map((result) => result.link);

    // Crawl the pages
    const crawledPages = await scrapePages(urls);

    // Combine search results with crawled content
    return searchResults.organic.map((result, index) => {
      const crawledPage = Array.isArray(crawledPages)
        ? crawledPages[index]
        : undefined;
      return {
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        content: crawledPage?.markdown,
      };
    });
  },
);
