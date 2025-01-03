An example of generating text using Vercel's AI SDK.

Start with [./generate-text.ts](./generate-text.ts).

## Description

Let's look at literally the simplest setup that the AI SDK supports: generating text.

You take the `generateText` function that you import from `ai`, pass it a prompt and a model, and you get back an object that contains some text.

The model we're using is Anthropic's `claude-3.5-haiku`, which we're getting from Vercel's `@ai-sdk/anthropic`.

If we wanted to, we could specify a different model - let's say we're using `claude-3.5-sonnet` instead.

We can then use the function that we've created called `answerMyQuestion`.

Let's say we ask it "what is the chemical formula for dihydrogen monoxide?"

When we run this, it will call Anthropic with our query and get back the thing we asked it.

There's also a bunch of other stuff in this object that we get back, but we'll cover that in our other examples.
