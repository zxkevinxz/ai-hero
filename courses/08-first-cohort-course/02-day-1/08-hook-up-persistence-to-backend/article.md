<AISummary href="https://sdk.vercel.ai/docs/reference/ai-sdk-ui/append-response-messages">

## Understanding appendResponseMessages

The `appendResponseMessages` function is a utility that helps manage message history in AI chat applications. It handles the merging of new AI responses with existing messages, particularly focusing on tool call results.

### Basic Usage

```ts
import { appendResponseMessages } from "ai";

// Example usage
const updatedMessages = appendResponseMessages({
  messages, // Message[]
  responseMessages, // ResponseMessage[], for instance from onFinish
});
```

### Key Features

- **Preserves Message IDs**: Reuses existing IDs from response messages
- **Preserves `parts`**: The `parts` property is correctly calculated, ready to be saved to the database
- **Timestamp Management**: Automatically generates new timestamps
- **Tool Call Integration**: Merges tool-call results with previous assistant messages
- **Message History Management**: Maintains a unified message history

### Important Notes

- Tool call results (messages with `role: "tool"`) are automatically merged with the preceding assistant message
- The function maintains message order and relationships
- It's particularly useful in the context of the `useChat` hook from the Vercel AI SDK

</AISummary>

Steps to complete:

- Allow the `/api/chat` route to handle a `chatId` parameter
- If the `chatId` is not provided, the route should create a new chat containing the user's message.
- Once the stream completes (using `onFinish` in `streamText`), the route should save the chat and the messages to the database. If there was no chat initially, it should use the id of the new chat.
- The `chat` should be created in the database before the stream begins, because the stream may take a long time or may be cancelled.

```ts
import { appendResponseMessages } from "ai";

streamText({
  // ...other properties
  onFinish({ text, finishReason, usage, response }) {
    const newMessages = response.messages; // messages that were generated

    const updatedMessages = appendResponseMessages(
      existingMessages, // from the POST body
      newMessages,
    );

    // save the updated messages to the database,
    // by saving over the ENTIRE chat, deleting all
    // the old messages and replacing them with the
    // new ones
  },
});
```

- Ignore the `content` property of the `updatedMessages` array - only `parts` matters.
