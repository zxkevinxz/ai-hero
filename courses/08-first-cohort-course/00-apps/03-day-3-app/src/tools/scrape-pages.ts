import { cacheWithRedis } from "~/server/redis/redis";
import { crawlMultipleUrls } from "~/firecrawl";

export const scrapePages = cacheWithRedis("scrape-pages", async (urls) => {
  const result = await crawlMultipleUrls(urls);

  if ("error" in result) {
    return result;
  }

  return result.map((item) => ({
    markdown: item.markdown ?? "",
    url: item.url ?? "",
  }));
});
