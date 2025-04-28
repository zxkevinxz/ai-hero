Currently, we are only passing the latest message to the loop. This means that if we ask a follow-up question, we lose all context on what came before it.

<!-- VIDEO! -->

We need to integrate the messages into our loop.

To do that we'll redesign our system context to take in the right inputs, and pass it to the LLM calls inside the loop.

## Steps To Complete

- Find the place where the agent loop is implemented
- Instead of taking in an initial question, take in a `messages` array from the `ai` package:

```ts
import type { Message } from "ai";

const imaginaryFunction = async (
  messages: Message[],
) => {
  // ...
};
```

- Find the central place where we're storing context for the system.
- Instead of taking in a question, take in a `messages` array. Store it in the context.
- Find anywhere we're calling the LLM inside the loop, and pass the messages to the LLM instead of the first question.
- Run the app to see if the initial bug is fixed.
