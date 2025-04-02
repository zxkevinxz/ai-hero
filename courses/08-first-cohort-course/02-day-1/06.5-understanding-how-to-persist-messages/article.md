---
id: lesson-ynhp4
---

The exercise is finished when:

- The user understands the message shape expected by the AI SDK
- The user understands the parts of the AI SDK shape that are legacy (like `toolInvocations`)
- The user understands that it's better to treat the `chat` as a single unity, to allow for editing of the chat history later

Not Required Yet:

- Modify the database schema
- Create helper functions

Potential Discussion Points:

- Saving edit histories of chats in chat 'versions'
- Having different API endpoints for editing vs appending
- Reduce the number of bits over the wire by only sending the latest user message
