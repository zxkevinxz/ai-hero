> Note for Joel: At the start of each day, learners will be given a fresh repo to work in. They can optionally choose to work in this repo, or use the previous day's repo. They can of course choose to do both: copying over some code from the exercise repo into their repo.

## The Plan

Our job today is to get a proof of concept up and running.

We've got a little sketch of a frontend already in the repo. But what we don't have is a connection to an AI model.

That's what we're going to build. We're going to:

1. Build an API endpoint that will contact our chat model and stream back the response
2. Build a simple frontend that will send a message to the API and show the response

With that connection going we should be able to have a chat with the AI using a frontend that we've built. That should be enough to keep the bosses off our back for one day.

To do that we're going to use Vercel's AI SDK.

Let's get started.

## Step-By-Step Guide

### 1. Installing the AI SDK

1. Install the AI SDK:

```bash
pnpm add ai
```

2. Install the AI provider for your specific model. For example if you're using anthropic, install this package:

```bash
pnpm add @ai-sdk/anthropic
```

3. Create a file somewhere in the repo called `models.ts`.

This will be where our model definitions will live. We're calling it flagship model because we may use other types of models in the future, so it's useful to distinguish it now.

```ts
import { anthropic } from "@ai-sdk/anthropic";

export const flagshipModel = anthropic(
  "claude-3-5-sonnet-latest",
);
```

4. Make sure your api keys are inside your `.env` file.

```bash
ANTHROPIC_API_KEY=your-api-key
```

We've now got all the pieces we need to start building our API endpoint.

### 2. Creating The Endpoint

1. Create the api endpoint by creating a file at `src/app/api/chat/route.ts`.

This is [Next.js-specific syntax](https://nextjs.org/docs/app/building-your-application/routing/route-handlers). It creates a post endpoint at `/api/chat`.

```ts
// src/app/api/chat/route.ts
export async function POST(request: Request) {
  return Response.json({
    message: "Hello, world!",
  });
}
```

2. You can verify this is working by using `curl`:

```bash
curl -X POST http://localhost:3000/api/chat
```

Make sure `localhost:3000` is running, and you should see the response `{"message":"Hello, world!"}`.

3. Our POST endpoint is going to receive an array of messages.

We're not going to define the type for these messages ourselves. Instead we're going to use the `Message` type from the AI SDK.

We're going to use `await request.json()` to get the messages.

Note that this doesn't validate the shape of the messages yet. We'll do that later.

```ts
import type { Message } from "ai";

export async function POST(request: Request) {
  const { messages }: { messages: Message[] } =
    await request.json();

  return Response.json({
    message: "Hello, world!",
  });
}
```

4. We're going to use our model to generate a response.

We're going to use the `streamText` function from the AI SDK to do this.

We'll import our `flagshipModel` from the `models.ts` file we created earlier.

Then, we call `streamText` with our model and the messages we received.

Finally, we call `toDataStreamResponse` on the result to get a response that we can send back to the frontend.

```ts
import type { Message } from "ai";
import { streamText } from "ai";

// Import from wherever you put your models.ts file
import { flagshipModel } from "./models";

export async function POST(request: Request) {
  const { messages }: { messages: Message[] } =
    await request.json();

  const result = streamText({
    model: flagshipModel,
    messages,
  });

  return result.toDataStreamResponse();
}
```

5. We can now test this endpoint using `curl`.

We're going to pass our endpoint a messages array with a single message. We'll dive into this format later, but for now all we need to know is that we're saying hello to the LLM.

```bash
curl -X POST http://localhost:4317/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"content": "Hello!", "role": "user"}]}'
```

If everything is configured correctly, you should see a strange response streamed back:

```txt
f:{"messageId":"msg-GZ6VOpPDumPmRUL1eYdpgMp0"}
0:"Hi "
0:"there! "
0:"How "
0:"are "
0:"you "
0:"doing "
0:"today? "
0:"Is "
0:"there "
0:"anything "
0:"I "
0:"can "
0:"help "
0:"you "
0:"with?"
e:{"finishReason":"stop","usage":{"promptTokens":9,"completionTokens":21},"isContinued":false}
d:{"finishReason":"stop","usage":{"promptTokens":9,"completionTokens":21}}
```

This is the [data stream protocol](https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol#data-stream-protocol). It's a custom protocol that the AI SDK uses to stream data back to the frontend.

Some parts are text, as we can see, and some parts are JSON. We'll be learning a lot more about this data stream protocol as we go through this course.

## 3. Building The Frontend

What we definitely need is something on the front end that's going to understand this garbled output And turn it into something that we can display to the user.

Fortunately the AI SDK has us covered.

1. Install the AI SDK on the frontend:

```bash
pnpm add @ai-sdk/react
```

2. Create a file at `src/app/page.tsx`.

This is a Next.js specific syntax that creates a page at `/`.

Copy the code below into this file.

```tsx
// src/app/page.tsx

import { useChat } from "@ai-sdk/react";

export default function Page() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat();

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

Amazingly this is all the code we need to get started. If you don't provide an `api` property to the AI SDK, it assumes that the endpoint it needs is `/api/chat`.

3. Verify it works.

Start your frontend with `pnpm dev` and navigate to `http://localhost:3000`.

You should see a chat box where you can type messages. When you hit send, you should see the message appear in the chat box.

4. Check it out in the network tab

If you open the network tab in your browser's developer tools, you should see a POST request to `/api/chat` when you hit send.

If you click on this request, you should see the response from the server. It should be the same as the response we got when we tested the endpoint with `curl`.

## Conclusion

Just like that we've got a functional chat bot. Typing in the chat input and submitting will behave as expected, and we can have actual conversations with the LLM.

This chat app is missing all sorts of things before we can deploy it. But it's a good start.
