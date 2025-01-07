An example of message history using Vercel's AI SDK.

Start with [./chat-history.ts](./chat-history.ts).

## Description

It's pretty common if you're building any kind of chat bot to want to keep track of the conversation history.

We're going to show how to do that with the Vercel AI SDK in this example.

<Scrollycoding>

# !!steps

Our function is going to be called `generateManyExamples`:

It's going to take in an initial prompt and then continue asking the LLM for more examples.

```ts ! example.ts
export const generateManyExamples = async (
  prompt: string,
) => {};
```

# !!steps

In this case, we're going to ask it to generate a bunch of tweets on the topic of painting landscapes:

```ts ! example.ts
export const generateManyExamples = async (
  prompt: string,
) => {};

await generateManyExamples(
  "Write 5 tweets on the topic of painting landscapes.",
);
```

</Scrollycoding>

It's going to be a slightly odd conversation - we're going to ask the LLM for five tweets initially and then keep asking for more examples like a petulant child.

But we will end up with a lot of examples, which is what we want.

<Scrollycoding>

# !!steps

To keep track of this annoying conversation, we're going to put the messages inside an array of `CoreMessage`s.

(`Core` here refers to AI SDK Core instead of AI SDK UI or AI SDK RSC)

```ts ! example.ts
import { type CoreMessage } from "ai";

export const generateManyExamples = async (
  prompt: string,
) => {
  const messages: CoreMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];
};
```

# !!steps

Then we're going to call the LLM a bunch of times in a for loop:

```ts ! example.ts
export const generateManyExamples = async (
  prompt: string,
) => {
  const messages: CoreMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  for (let i = 0; i < 3; i++) {}
};
```

# !!steps

Inside the loop, we first call the LLM, then push its resulting message to the `messages` array with the role of `assistant`.

```ts ! example.ts
export const generateManyExamples = async (
  prompt: string,
) => {
  const messages: CoreMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  for (let i = 0; i < 3; i++) {
    const { text } = await generateText({
      model,
      messages,
    });

    messages.push({
      role: "assistant",
      content: text,
    });
  }
};
```

# !!steps

Finally, we push another message asking the LLM to add more examples.

```ts ! example.ts
export const generateManyExamples = async (
  prompt: string,
) => {
  const messages: CoreMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  for (let i = 0; i < 3; i++) {
    const { text } = await generateText({
      model,
      messages,
    });

    messages.push({
      role: "assistant",
      content: text,
    });

    messages.push({
      role: "user",
      content: "Please add more examples.",
    });
  }
};
```

</Scrollycoding>

We run that three times and we end up with the `messages` array filled with examples of tweets about painting landscapes.

```json
[
  {
    "role": "user",
    "content": "Write 5 tweets on the topic of painting landscapes."
  },
  {
    "role": "assistant",
    "content": "..."
  },
  {
    "role": "user",
    "content": "Please add more examples."
  },
  {
    "role": "assistant",
    "content": "..."
  },
  {
    "role": "user",
    "content": "Please add more examples."
  },
  {
    "role": "assistant",
    "content": "..."
  },
  {
    "role": "user",
    "content": "Please add more examples."
  }
]
```

I'll admit this is a bit of a funky example.

In a real world context, you would be receiving the user's input from the front end of your application and passing that as the latest message in the `messages` array.

This way you can keep track of your chat history, and even do some clever tricks with this which we'll look at later down the road.
