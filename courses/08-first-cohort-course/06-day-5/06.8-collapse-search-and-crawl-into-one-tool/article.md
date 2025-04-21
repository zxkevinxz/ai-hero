---
id: lesson-8tchb
---

## Problem statement

We currently have two tools set up:

- Search The Web: searches the web for information, returns a list of URLs and associated snippets
- Crawl A URL: crawls a URL for its contents

If we think about it, we pretty much _always_ want to crawl a URL if we're searching for information. Doing so will give us more complete information, and we avoid an extra round trip to the LLM to decide that for us.

So, experimenting with collapsing these into a single tool seems worthwhile.

However, one thing is worth bearing in mind. Our plan will result in a LOT of information being piled into the context window. To mitigate this, we'll attempt to fetch fewer results from the search engine.

## Steps to complete

- Combine the search and crawl tools into a single tool, still called `searchWeb`. This tool will take in a query, and return a list of URLs, snippets, and the markdown contents of the URLs.
- Update the system prompt to use the new tool, and remove the references to the previous tools.
- Ensure that the search and crawl tools are cached in Redis, using the existing redis caching infrastructure.
- Update the default number of results to fetch from the search engine to 3.
- Test it out!
