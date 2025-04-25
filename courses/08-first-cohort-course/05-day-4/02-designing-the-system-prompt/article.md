---
id: lesson-f0b5g
---

The first step I want to walk through is designing the shape of the context. We'll be passing this context to the `getNextAction` function, so its shape will be important - and will evolve with our implementation.

I found it helpful to model this as a class in TypeScript - using a persistent container with methods has been useful.

```ts
export class SystemContext {}
```

We'll need several properties:

- `step`: The current step in the loop
- `queries`: The history of all queries searched
- `urls`: The history of all URLs scraped

Keeping them `private` means we can expose a smaller API to the rest of our codebase, which helps keep the code organized.

And a couple of methods:

- `shouldStop`: Whether the loop should stop
- `reportQueries`: Report the results of a query
- `reportScrapes`: Report the results of a scrape

```ts
type QueryResult = {
  query: string;
  results: {
    date: string;
    title: string;
    url: string;
    snippet: string;
  }[];
};

type ScrapeResult = {
  url: string;
  result: string;
};

export class SystemContext {
  /**
   * The current step in the loop
   */
  private step = 0;

  /**
   * The history of all queries searched
   */
  private queryHistory: QueryResult[] = [];

  /**
   * The history of all URLs scraped
   */
  private scrapeHistory: ScrapeResult[] = [];

  shouldStop() {
    return this.step >= 10;
  }

  reportQueries(queries: QueryResult[]) {
    this.queryHistory.push(...queries);
  }

  reportScrapes(scrapes: ScrapeResult[]) {
    this.scrapeHistory.push(...scrapes);
  }
}
```

We can then pass this context to the `getNextAction` function, when we implement it.

## Steps To Complete

- Create a new file containing the `SystemContext` class above.
- Don't implement `getNextAction` yet, we'll do that next.
