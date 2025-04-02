---
id: lesson-f31ta
---

## Prompt

Steps to complete:

- Ensure that we have a `SERPER_API_KEY` in the `.env` file
- Add a search web tool which can search the web using the searching functions we have declared in the repo
- The search tools should be declared inline in the `streamText` call:

```ts
tools: {
  searchWeb: {
    parameters: z.object({
      query: z.string().describe("The query to search the web for"),
    }),
    execute: async ({ query }, { abortSignal }) => {
      const results = await searchSerper(
        { q: query, num: 10 },
        abortSignal,
      );

      return results.organic.map((result) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
      }));
    },
  },
}
```

- Modify the system prompt passed to `streamText` to make the LLM aware that it can call the search web tool

```ts
streamText({
  system: ``, // system prompt goes here
});
```

- Modify the system prompt so that it attempts to always use the search web tool
- Modify the system prompt so that it attempts to always cite its sources with inline links
- Add `maxSteps: 10` to the `streamText` so that it behaves like an agent

The exercise is finished when:

- The user can chat to the agent and it will search the web

Not required yet:

- The agent does not need to crawl the site specified, they only need to return the snippets
- No persistence is required yet
- Don't need to show the user the search terms
