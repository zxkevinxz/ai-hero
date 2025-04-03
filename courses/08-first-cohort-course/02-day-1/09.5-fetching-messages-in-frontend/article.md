---
id: lesson-yex6y
---

Steps to complete:

- Use the `getChats` helper function to fetch the chats from the database to display in the sidebar.

- If there is an `/?id=...` search param, use the `getChat` helper function to fetch the chat from the database to display in the `ChatPage` component. Pass the messages to `initialMessages` in `useChat`.

- You will need to fix a TypeScript error, because the messages in our database are not typed strictly enough to be passed as the `initialMessages` prop to `useChat`.

This mapping will be enough to fix the error:

```ts
const initialMessages = chatFromDb?.messages.map(
  (message) => {
    return {
      id: message.id,
      // If content is empty, the message will constructed
      // from the 'parts'. We don't save 'content' in the DB,
      // so passing an empty string is safe.
      content: "",
      // message.role is typed as string, so we need to
      // cast it to the correct type
      role: message.role as "user" | "assistant",
      // message.parts is typed as unknown[], so we need
      // to cast it to the correct type
      parts: message.parts as MessagePart[],
    };
  },
);
```

- If there is no `/?id=...` search param, do not fetch a chat.
