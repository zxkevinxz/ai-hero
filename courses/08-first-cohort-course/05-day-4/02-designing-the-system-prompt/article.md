## Problem

The first step I want to walk through is designing the shape of the context. We'll be passing this context to the `getNextAction` function, so its shape will be important - and will evolve with our implementation.

I found it helpful to model this as a class in TypeScript - using a persistent container with methods has been useful.

```ts
export class SystemContext {}
```

We'll need several properties:

- `step`: The current step in the loop
- `queries`: The history of all queries searched
- `urls`: The history of all URLs scraped

We'll also add a `toPrompt` method, to serialize the context into a string that can be passed to the LLM.

We'll use XML as the formatter for the context. This is easier for LLM's to parse than JSON.

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
  step = 0;
  queries: QueryResult[] = [];
  urls: ScrapeResult[] = [];

  toPrompt() {
    return `
  <queries>
    ${this.queries
      .map(
        (q) => `
    <query>
      <text>${q.query}</text>
      <results>
        ${q.results
          .map(
            (r) => `
        <result>
          <date>${r.date}</date>
          <title>${r.title}</title>
          <url>${r.url}</url>
          <snippet>${r.snippet}</snippet>
        </result>`,
          )
          .join("")}
      </results>
    </query>`,
      )
      .join("")}
  </queries>
  <urls>
    ${this.urls
      .map(
        (u) => `
    <url>
      <address>${u.url}</address>
      <content>${u.result}</content>
    </url>`,
      )
      .join("")}
  </urls>`;
  }
}
```

We can then pass this context to the `getNextAction` function, when we implement it.

## Steps To Complete

- Create a new file containing the `SystemContext` class above.
- Don't implement `getNextAction` yet, we'll do that next.
