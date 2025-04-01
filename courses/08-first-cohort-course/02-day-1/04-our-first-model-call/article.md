---
id: lesson-jkfv0
---

Steps to complete:

- Ask the user which LLM they're planning to use
- Install the correct LLM From package from the Vercel AI SDK, and the `ai` package.
- Install the correct frontend package for ai
- Add a POST route at /api/chat with the following contents:

```ts

```

- Find the place in the codebase where the chat interface is being built
- Add a useChat call in the codebase with the following contents:

```ts

```

- Hook up the pre-built Message component to the result of the useChat

This exercise is finished when:

- We have a useChat function hooked up to /api/chat
- We are able to talk to the AI via the chat interface
- We have installed the correct model with the AI SDK

Not required yet:

- There's no need to be able to save the messages or save the chats either
- Every chat will be temporary held in memory until the User closes the window
- No need for any tool calls or searching - The model will simply use its pre training to answer any questions
