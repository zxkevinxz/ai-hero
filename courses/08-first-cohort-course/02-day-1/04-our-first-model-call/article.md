---
id: lesson-jkfv0
---

## Prompt

Steps to complete:

- Install the `ai` and `@ai-sdk/react` packages if you haven't already
- Add a POST route at /api/chat with the following contents:

```ts
import type { Message } from "ai";
import {
  streamText,
  createDataStreamResponse,
} from "ai";
import { model } from "~/models";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json()) as {
    messages: Array<Message>;
  };

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const { messages } = body;

      const result = streamText({
        model,
        messages,
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occured!";
    },
  });
}
```

- Add a useChat call in the codebase with the following contents:

```ts
import { useChat } from "@ai-sdk/react";

const {
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
} = useChat();
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
