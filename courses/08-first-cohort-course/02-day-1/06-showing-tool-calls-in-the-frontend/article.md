---
id: lesson-c3344
---

Steps to complete:

- Change the `ChatMessage` component to show the tool calls. Currently, it only shows the `text`. Instead, it should rely on the `parts` array of each message to show the tool calls.
- The type for `parts` is available via:

```ts
import type { Message } from "ai";

export type MessagePart = NonNullable<
  Message["parts"]
>[number];
```

- Encourage the user to hover over the `MessagePart` to see all the possible things `parts` can be

## Understanding appendResponseMessages

The `appendResponseMessages` function is a utility that helps manage message history in AI chat applications. It handles the merging of new AI responses with existing messages, particularly focusing on tool call results.

### Basic Usage

```ts
import { appendResponseMessages } from "ai";

// Example usage
const updatedMessages = appendResponseMessages(
  existingMessages,
  newResponseMessages,
);
```

### Key Features

- **Preserves Message IDs**: Reuses existing IDs from response messages
- **Timestamp Management**: Automatically generates new timestamps
- **Tool Call Integration**: Merges tool-call results with previous assistant messages
- **Message History Management**: Maintains a unified message history

### Example Implementation

```ts
// Example of how messages are structured
const existingMessages = [
  {
    id: "msg-1",
    role: "user",
    content: "What's the weather?",
    timestamp: Date.now(),
  },
];

const newResponseMessages = [
  {
    id: "msg-2",
    role: "assistant",
    content: "Let me check that for you.",
    timestamp: Date.now(),
  },
  {
    id: "tool-1",
    role: "tool",
    content: "Weather data: Sunny, 72°F",
    timestamp: Date.now(),
  },
];

// The function will merge these messages appropriately
const updatedMessages = appendResponseMessages(
  existingMessages,
  newResponseMessages,
);
```

### When to Use

- When implementing streaming chat interfaces
- When handling AI responses with tool calls
- When maintaining message history in client-side applications
- When you need to merge tool results with assistant messages

### Important Notes

- Tool call results (messages with `role: "tool"`) are automatically merged with the preceding assistant message
- The function maintains message order and relationships
- It's particularly useful in the context of the `useChat` hook from the Vercel AI SDK
