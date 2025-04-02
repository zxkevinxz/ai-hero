---
id: lesson-rmy7p
---

Steps to complete:

Create the database resources:

- Create tables in the databases for `messages` and `chats` in Drizzle
- Each chat should contain multiple messages
- Each chat should belong to a user
- Run the migrations so that the database is up to date

Create helper functions:

- `upsertChat`: Create a chat, with all the messages. Should fail if the chat does not belong to the logged in user.
- `getChat`: Get a chat by id with its messages
