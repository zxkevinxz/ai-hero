---
id: lesson-wnbd7
---

## Problem statement

Our app only uses the snippets from search results. We need to add a scraper tool that will allow us to extract the full text of the page.

There are several options I've picked out for you:

## Supporting information

### Firecrawl

`@mendable/firecrawl-js` is the Firecrawl Node SDK. It'll need to be installed as a package in the project.

```ts
import FirecrawlApp from "@mendable/firecrawl-js";
import { env } from "./env";

const firecrawl = new FirecrawlApp({
  apiKey: env.FIRECRAWL_API_KEY,
});

type CrawlError = {
  error: string;
};

type CrawlResult = {
  markdown: string | undefined;
  url: string | undefined;
};

export const crawlMultipleUrls = async (
  urls: string[],
): Promise<CrawlResult[] | CrawlError> => {
  const response = await firecrawl.batchScrapeUrls(
    urls,
    {
      formats: ["markdown"],
    },
  );

  if (response.success) {
    return response.data.map((result) => {
      return {
        markdown: result.markdown,
        url: result.url,
      };
    });
  } else {
    return {
      error: response.error,
    };
  }
};
```

## Steps to complete

- Install the `@mendable/firecrawl-js` package

- Ensure there is a `FIRECRAWL_API_KEY` environment variable in the environment variables, and in the environment variables setup file

- Add the `crawlMultipleUrls` function somewhere in the codebase

- Add a new tool, `scrapePages`, that takes in a list of URLs and returns the full text of the pages, formatted in markdown.

- Inside the `scrapePages` tool, use the `crawlMultipleUrls` function to get the full text of the pages and return it to the LLM. Errors should also be passed to the LLM.

- Cache the usage of the `scrapePages` tool using the existing `cacheWithRedis` function

- Add a section to the system prompt that explains that the `scrapePages` tool is available to use, and when to use it.
