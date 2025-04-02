---
id: lesson-f31ta
---

Steps to complete:

- Find the file that we have declared our `streamText` implementation in
- Add a search web tool which can search the web using the search tools we have declared in the repo
- Make sure you format the result of the search tool nicely so that the prompt isn't overloaded
- Modify the system prompt passed to `streamText` to make the LLM aware that it can call the search web tool
- Modify the system prompts so that it attempts to always use the search web tool
- Add max steps to the `streamText` so that it behaves like an agent

The exercise is finished when:

- The user can chat to the agent and it will search the web

Not required yet:

- The agent does not need to crawl the site specified, they only need to return the snippets
- No persistence is required yet
