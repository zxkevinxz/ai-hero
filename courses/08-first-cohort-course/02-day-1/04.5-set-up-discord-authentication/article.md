---
id: lesson-gzxr6
---

## Prompt

Steps to complete:

- The user needs to create a new Discord application, get the Discord API token and add it to the `.env` file
- Do NOT modify the existing `next-auth` config to explicitly pass the environment variables - it will work as is
- Hook up the authentication to the existing Login and Logout buttons
- Check that the user is logged in before they can chat (in the /api/chat route). If they are not logged in, return a 401 error
- Do NOT modify the icon used in the button.

The exercise is complete when:

- You have a Discord API token in your `.env` file
- The user can Log In and Log Out

Not required yet:

- Anonymous chatting
- Saving chats

## Successful Run

I'll help you implement Discord authentication for your chat application. Let's break this down into steps.

First, let's check the current structure of the project to understand what we're working with.

Ran tool
Let's look at the src directory to understand the application structure:

Ran tool
Let's check the app directory to understand the routing structure:

Ran tool
Let's check the API directory to understand the chat route:

Ran tool
Let's check the auth directory to understand the authentication setup:

Ran tool
Let's check the NextAuth configuration:

Ran tool
Let's look at the NextAuth route file:

Read file: src/app/api/auth/[...nextauth]/route.ts
Now let's check the server auth implementation:

Ran tool
Let's look at the auth config file:

Read file: src/server/auth/config.ts
Let's check the auth index file:

Read file: src/server/auth/index.ts
Now let's check the chat page and API route:

Read file: src/app/chat.tsx
Let's check the chat API route:

Ran tool

Read file: src/app/api/chat/route.ts
Let's check the components directory to find the login and logout buttons:

Ran tool
Let's check the auth-button component:

Read file: src/components/auth-button.tsx
Let's check the sign-in-modal component:

Read file: src/components/sign-in-modal.tsx
Let's check the main page to see how the auth button is used:

Read file: src/app/page.tsx
Let's check the .env file to see what environment variables we need to add:

Read file: .env
Let's check the .env.example file to see what environment variables are expected:

Read file: .env.example
Now that I have a good understanding of the codebase, let's implement the required changes:

1. First, let's update the chat page to accept the `isAuthenticated` prop and show the sign-in modal when not authenticated:

```ts jsx:src/app/chat.tsx
"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatMessage } from "~/components/chat-message";
import { SignInModal } from "~/components/sign-in-modal";
import { Send } from "lucide-react";

interface ChatProps {
  userName: string;
  isAuthenticated: boolean;
}

export const ChatPage = ({ userName, isAuthenticated }: ChatProps) => {
  return (
    <>
      {/* ...existing code ... */}
      {!isAuthenticated && <SignInModal />}
    </>
  );
};
```

2. Now, let's update the main page to pass the `isAuthenticated` prop to the ChatPage component:

```ts jsx:src/app/page.tsx
<ChatPage userName={userName} isAuthenticated={isAuthenticated} />
```

3. Now, let's update the chat API route to check if the user is authenticated before allowing them to chat:

```ts:src/app/api/chat/route.ts
import type { Message } from "ai";
import { streamText, createDataStreamResponse } from "ai";
import { model } from "~/models";
import { auth } from "~/server/auth";

export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // ... existing code ...
}
```

Now that we've made all the necessary code changes, let's provide instructions for the user to create a Discord application and get the API token:

To complete the setup, you need to create a Discord application and get the API token. Here's how to do it:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on "New Application" and give it a name (e.g., "AI Chat App")
3. Navigate to the "OAuth2" section in the left sidebar
4. Under "Redirects", add the following URL: `http://localhost:3000/api/auth/callback/discord` (or your production URL if deploying)
5. Copy the "Client ID" and "Client Secret" values
6. Update your `.env` file with these values:
   - `AUTH_DISCORD_ID` should be set to the Client ID
   - `AUTH_DISCORD_SECRET` should be set to the Client Secret

I see that you already have these values in your `.env` file:

```
AUTH_DISCORD_ID="XXX"
AUTH_DISCORD_SECRET="XXX"
```

So it looks like you've already created a Discord application and added the credentials to your `.env` file. The authentication should now be working with the changes we've made.

To summarize what we've done:

1. Updated the `ChatPage` component to accept an `isAuthenticated` prop and show the sign-in modal when not authenticated
2. Updated the `HomePage` component to pass the `isAuthenticated` prop to the `ChatPage` component
3. Updated the chat API route to check if the user is authenticated before allowing them to chat

The authentication flow should now work as follows:

1. When a user visits the site, they'll see the chat interface with a sign-in button
2. If they try to chat without being authenticated, they'll see the sign-in modal
3. When they click the sign-in button, they'll be redirected to Discord to authenticate
4. After authenticating, they'll be redirected back to the site and can chat
5. The chat API will check if they're authenticated before allowing them to chat

Is there anything else you'd like me to explain or modify?

## Human Instructions

# 1. Set Up Discord Application

1.1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
1.2. Click on "New Application" and give it a name (e.g., "AI Chat App")
1.3. Navigate to the "OAuth2" section in the left sidebar
1.4. Under "Redirects", add the following URL: `http://localhost:3000/api/auth/callback/discord` (or your production URL if deploying)
1.5. Copy the "Client ID" and "Client Secret" values
1.6. Update your `.env` file with these values:

- `AUTH_DISCORD_ID` should be set to the Client ID
- `AUTH_DISCORD_SECRET` should be set to the Client Secret

# 2. Update the Chat Page Component

2.1. Modify the `ChatPage` component to accept an `isAuthenticated` prop and show the sign-in modal when not authenticated:

```tsx
// src/app/chat.tsx
"use client";

import { SignInModal } from "~/components/sign-in-modal";

interface ChatProps {
  isAuthenticated: boolean;
}

export const ChatPage = ({
  isAuthenticated,
}: ChatProps) => {
  return (
    <>
      {/* ...existing code ... */}
      {!isAuthenticated && <SignInModal />}
    </>
  );
};
```

# 3. Update the Main Page Component

3.1. Modify the main page to pass the `isAuthenticated` prop to the ChatPage component:

```ts
// src/app/page.tsx
<ChatPage userName={userName} isAuthenticated={isAuthenticated} />
```

# 4. Update the Chat API Route

4.1. Modify the chat API route to check if the user is authenticated before allowing them to chat:

```ts
// src/app/api/chat/route.ts
import { auth } from "~/server/auth";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // ... existing code ...
}
```

# 5. Test the Authentication Flow

5.1. Start your application and navigate to the chat page
5.2. Verify that the sign-in modal appears when you're not authenticated
5.3. Click the sign-in button and complete the Discord authentication process
5.4. Verify that you can chat after authenticating
5.5. Test the logout functionality to ensure it works correctly

The authentication flow should now work as follows:

- When a user visits the site, they'll see the chat interface with a sign-in button
- If they try to chat without being authenticated, they'll see the sign-in modal
- When they click the sign-in button, they'll be redirected to Discord to authenticate
- After authenticating, they'll be redirected back to the site and can chat
- The chat API will check if they're authenticated before allowing them to chat
