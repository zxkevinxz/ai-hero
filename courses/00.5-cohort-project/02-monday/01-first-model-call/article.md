# Our First Model Call

## The Plan

Our job today is to get a proof of concept up and running.

We've got a little sketch of a frontend already in the repo. But what we don't have is a connection to an AI model.

That's what we're going to build. We're going to:

1. Build an API endpoint that will contact our chat model and stream back the response
2. Build a simple frontend that will send a message to the API and show the response

With that connection going we should be able to have a chat with the AI using a frontend that we've built. That should be enough to keep the bosses off our back for one day.

To do that we're going to use Vercel's AI SDK.

Let's get started.

## Goals

- Declare a model in a `models.ts` file.
- Use `useChat` in your Next.js frontend.
- Use `streamText` in your API endpoint, a POST endpoint at `/api/chat`.
- Have a chat with your new AI chatbot!

## Resources

- My guide on [building a simple chatbot with the AI SDK](TODO) will give you a step-by-step guide.

- The AI SDK docs on working with [Next.js's App Router](https://sdk.vercel.ai/docs/getting-started/nextjs-app-router#create-a-route-handler) will help you with the backend.

- The AI SDK Docs for [`useChat`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat) will help you with the frontend.
