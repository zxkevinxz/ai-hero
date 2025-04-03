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

- Add a useChat call to the existing chat page in the codebase with the following contents:

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
- Do not add `stop` functionality to the chat page.

## Successful Run

I'll help you implement the chat functionality according to the requirements. Let's start by exploring the codebase to understand what we're working with.

Ran tool
Let's check the package.json to see if we need to install the required packages:

Read file: package.json
Great! I can see that both `ai` and `@ai-sdk/react` packages are already installed. Now let's check the structure of the src directory to understand where we need to add our files:

Ran tool
Let's check the app directory to see if there's already a chat page:

Ran tool
Great! I can see there's already a chat.tsx file. Let's check its contents:

Read file: src/app/chat.tsx
Now let's check the ChatMessage component:

Read file: src/components/chat-message.tsx
Now let's check if there's an API directory structure:

Ran tool
Now I have a good understanding of the codebase. Let's implement the required changes:

1. First, let's create the API route for chat:

```typescript:src/app/api/chat/route.ts
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

2. Now, let's update the chat.tsx file to use the useChat hook:

```typescript jsx:src/app/chat.tsx
"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatMessage } from "~/components/chat-message";
import { SignInModal } from "~/components/sign-in-modal";
import { Send } from "lucide-react";

interface ChatProps {
  userName: string;
}

export const ChatPage = ({ userName }: ChatProps) => {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div
          className="mx-auto w-full max-w-[65ch] flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
          role="log"
          aria-label="Chat messages"
        >
          {messages.map((message) => {
            return (
              <ChatMessage
                key={message.id}
                text={message.content}
                role={message.role}
                userName={userName}
              />
            );
          })}
        </div>

        <div className="border-t border-gray-700">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-[65ch] p-4"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Say something..."
                autoFocus
                aria-label="Chat input"
                className="flex-1 rounded border border-gray-700 bg-gray-800 p-2 text-gray-200 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:hover:bg-gray-700"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </>
  );
};
```

Now let's check if we need to make any changes to the models.ts file:

Read file: src/models.ts
Great! The model is already set up correctly with the Gemini model.

Let's review what we've accomplished:

1. We've created the API route at `/api/chat` with the required implementation that uses the `streamText` function from the `ai` package to handle chat messages.

2. We've updated the chat page to use the `useChat` hook from `@ai-sdk/react`, which connects to our API endpoint.

3. We've verified that the model is correctly set up in `models.ts` using the Gemini model.

The implementation is now complete according to the requirements:

- We have a useChat function hooked up to /api/chat
- We are able to talk to the AI via the chat interface
- We have installed the correct model with the AI SDK

The chat interface will now:

- Display messages from both the user and the AI
- Allow users to input messages and send them
- Show a loading state while the AI is generating a response
- Use the pre-built Message component to display the chat messages

As specified, we haven't implemented:

- Saving messages or chats (they're held in memory until the window is closed)
- Tool calls or searching (the model uses its pre-training to answer questions)
- Stop functionality for the chat page

Would you like to ask any followup questions about the code that has just been added? For example:

1. How does the streaming functionality work in the chat implementation?
2. What are the benefits of using the `useChat` hook from `@ai-sdk/react`?
3. How can we customize the appearance of the chat messages further?

## Human Instructions

### 1. Install Required Packages

1.1. Open your terminal and navigate to your project directory.

1.2. Install the required packages by running:

```bash
npm install ai @ai-sdk/react
```

### 2. Create the API Route

2.1. Create a new file at `src/app/api/chat/route.ts` with the following content:

```typescript
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

### 3. Update the Chat Page

3.1. Open your existing chat page component (likely at `src/app/chat.tsx`).

3.2. Import the `useChat` hook at the top of the file:

```typescript
import { useChat } from "@ai-sdk/react";
```

3.3. Add the `useChat` hook inside your component:

```typescript
const {
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
} = useChat();
```

3.4. Update your component's JSX to use these values:

```typescript
<div className="flex flex-1 flex-col">
  <div
    className="mx-auto w-full max-w-[65ch] flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
    role="log"
    aria-label="Chat messages"
  >
    {messages.map((message) => {
      return (
        <ChatMessage
          key={message.id}
          text={message.content}
          role={message.role}
          userName={userName}
        />
      );
    })}
  </div>

  <div className="border-t border-gray-700">
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-[65ch] p-4"
    >
      <div className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          autoFocus
          aria-label="Chat input"
          className="flex-1 rounded border border-gray-700 bg-gray-800 p-2 text-gray-200 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:hover:bg-gray-700"
        >
          <Send className="size-4" />
        </button>
      </div>
    </form>
  </div>
</div>
```

3.5. Make sure to import the `Send` icon if you're using it:

```typescript
import { Send } from "lucide-react";
```

### 4. Test Your Implementation

4.1. Start your development server:

```bash
npm run dev
```

4.2. Navigate to your chat page in the browser.

4.3. Type a message and send it to verify that:

- The message appears in the chat
- The AI responds
- The loading state works correctly
