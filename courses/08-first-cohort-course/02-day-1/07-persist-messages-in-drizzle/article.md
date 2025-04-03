---
id: lesson-rmy7p
---

Steps to complete:

Create the database resources:

- Create tables in the databases for `messages` and `chats` in Drizzle
- Each chat should contain multiple messages
- Each chat should belong to a user
- Each message should have a role (string), parts (json) and order (int)
- Run the migrations so that the database is up to date

Create helper functions:

- `upsertChat`: Create a chat, with all the messages. Should fail if the chat does not belong to the logged in user. If the chat already exists, it should delete all existing messages and replace them with the new ones. If the chat does not exist, it should create a new chat with the id passed in.

```ts
import type { Message } from "ai";

export const upsertChat = async (opts: {
  userId: string;
  chatId: string;
  title: string;
  messages: Message[];
}) => {
  // ...implementation
};
```

- `getChat`: Get a chat by id with its messages
- `getChats`: Get all chats for a user, without the messages

Not required yet:

- Implement the `deleteChat` and `deleteMessage` functions
- Implement the `updateMessage` function
- Hooking up the frontend to the backend
