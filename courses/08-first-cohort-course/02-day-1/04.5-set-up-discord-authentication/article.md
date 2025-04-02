---
id: lesson-gzxr6
---

## Prompt

Steps to complete:

- The user needs to create a new Discord application, get the Discord API token and add it to the `.env` file
- Do NOT modify the existing `next-auth` config - it will work as is
- Hook up the authentication to the existing Login and Logout buttons
- Check that the user is logged in before they can chat (in the /api/chat route). If they are not logged in, return a 401 error

The exercise is complete when:

- You have a Discord API token in your `.env` file
- The user can Log In and Log Out

Not required yet:

- Anonymous chatting
- Saving chats
