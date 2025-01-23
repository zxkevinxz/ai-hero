You may have noticed this, but I am running a content business.

That involves working with a Content Management System, a CMS - creating posts, deleting posts, updating posts.

So I spend a significant amount of my life clicking through UIs on my CMS, which is pretty boring and time-consuming.

Don't get me wrong. I like writing the posts. It's really fun, really creative.

But there are annoying jobs that suck up a surprising amount of time:

- Choosing the correct slug for each post
- Writing an SEO description for each post
- Attaching posts to lists and ensuring they're in the correct order
- Adding tags to posts

So I'm going to create an AI agent to automate a lot of this work.

## The CMS

For this example, I've created a dummy CMS which saves a bunch of posts into a JSON file locally.

We can access the server by calling methods from the `client.ts`.

```ts
import { createCmsClient } from "./client.ts";

const client = createCmsClient();

// Example: Get all posts
const posts = await client.getAllPosts();
```

In the example itself we're going to start the server, seed the database, and then create the client:

```ts !
import { startServer } from "./server.ts";
import { seedDatabase } from "./seed.ts";
import { createCmsClient } from "./client.ts";

const server = await startServer();
await seedDatabase();
const client = createCmsClient();
```

And we'll use the `cliChat` function inside AI Hero as a base, which will allow us to interact with the agent via the command line.

```ts
import { cliChat } from "../../_shared/cli-chat.ts";

await cliChat({
  answerQuestion: async (messages) => {
    // Agent goes here
  },
});
```

Our agent is now ready to do its thing. Let's build it.

## The Basics

<Scrollycoding>

# !!steps

We'll start by using the [streamText](https://www.aihero.dev/streaming-text-with-vercel-ai-sdk) function, passing it a model and the message history.

```ts ! example.ts
import { streamText } from "ai";
import { cliChat } from "../../_shared/cli-chat.ts";

await cliChat({
  answerQuestion: async (messages) => {
    const result = await streamText({
      messages,
      model,
    });

    return result;
  },
});
```

# !!steps

Let's now add a helpful [system prompt](https://www.aihero.dev/system-prompts-with-vercel-ai-sdk).

```ts ! example.ts
import { streamText } from "ai";
import { cliChat } from "../../_shared/cli-chat.ts";

await cliChat({
  answerQuestion: async (messages) => {
    const result = await streamText({
      messages,
      model,
      system:
        `You are a content management agent. ` +
        `You help to update a CMS based on user input. ` +
        `Think step-by-step. ` +
        `Before updating content, offer the user the ` +
        `chance to make changes. `,
    });

    return result;
  },
});
```

# !!steps

We should add `maxSteps`, to let the agent [respond to the results of its own tool calls](https://www.aihero.dev/agents-with-vercel-ai-sdk):

```ts ! example.ts
import { streamText } from "ai";
import { cliChat } from "../../_shared/cli-chat.ts";

await cliChat({
  answerQuestion: async (messages) => {
    const result = await streamText({
      messages,
      model,
      system:
        `You are a content management agent. ` +
        `You help to update a CMS based on user input. ` +
        `Think step-by-step. ` +
        `Before updating content, offer the user the ` +
        `chance to make changes. `,
      maxSteps: 10,
    });

    return result;
  },
});
```

# !!steps

Finally, let's add a tools record, which we'll implement below.

```ts ! example.ts
import { streamText } from "ai";
import { cliChat } from "../../_shared/cli-chat.ts";

const tools = {
  // Implement tools here
};

await cliChat({
  answerQuestion: async (messages) => {
    const result = await streamText({
      messages,
      model,
      system,
      tools,
      maxSteps: 10,
    });

    return result;
  },
});
```

</Scrollycoding>

## The Tools

Now that the agent has its basic setup, we can give access to the tools it needs to actually do things in the CMS.

<Scrollycoding>

# !!steps

Let's start by letting it view all of the posts in the CMS.

We give the tool an empty object of parameters, a description (for prompt engineering purposes) and an `execute` function.

```ts ! example.ts
import { tool } from "ai";
import { z } from "zod";

const tools = {
  viewPosts: tool({
    parameters: z.object({}),
    description: "View all posts",
    execute: () => {
      return client.getAllPosts();
    },
  }),
};
```

# !!steps

There is a slight issue here. By default `client.getAllPosts()` returns the `content` of the post too.

If we return that from our tool, that will get put into the prompt of the next LLM call.

That's a lot of tokens that we're burning on something that doesn't need to be in the prompt.

So we should filter out the body of the post before returning it.

```ts ! example.ts
import { tool } from "ai";
import { z } from "zod";

const tools = {
  viewPosts: tool({
    parameters: z.object({}),
    description:
      "View all posts, without the post content",
    execute: async () => {
      const result = await client.getAllPosts();

      return result.map(({ content, ...rest }) => {
        return rest;
      });
    },
  }),
};
```

</Scrollycoding>

<Scrollycoding>

# !!steps

Next we'll let it view a specific post. In this one we need to pass in an `id` parameter.

The `id` parameter is so self-explanatory that I don't feel the need to include a `.describe` function.

```ts ! example.ts
import { tool } from "ai";
import { z } from "zod";

const tools = {
  // ...other tools
  viewPost: tool({
    parameters: z.object({ id: z.string() }),
    description:
      "View a specific post, including its content",
    execute: async ({ id }) => {
      return await client.getPost(id);
    },
  }),
};
```

# !!steps

Next, let's create a post.

Here, the `.describe` functions make more sense. For instance, we want to specify that the content is in markdown format.

```ts ! example.ts
import { tool } from "ai";
import { z } from "zod";

const tools = {
  // ...other tools
  createPost: tool({
    parameters: z.object({
      title: z
        .string()
        .describe("The title of the post"),
      content: z
        .string()
        .describe(
          `The post's content, in markdown format`,
        ),
    }),
    description: "Create a new post",
    execute: async ({ title, content }) => {
      return await client.createPost({
        title,
        content,
      });
    },
  }),
};
```

</Scrollycoding>

Finally, we add `updatePost` and `deletePost`, which follow the same pattern as the previous tools:

```ts ! example.ts
import { tool } from "ai";
import { z } from "zod";

const tools = {
  // ...other tools
  updatePost: tool({
    parameters: z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
    }),
    description:
      "Update a specific post with a new title and content",
    execute: async ({ id, title, content }) => {
      const result = await client.updatePost(id, {
        title,
        content,
      });

      return result;
    },
  }),
  deletePost: tool({
    parameters: z.object({ id: z.string() }),
    description: "Delete a specific post",
    execute: async ({ id }) => {
      return await client.deletePost(id);
    },
  }),
};
```

## Trying It Out

Now we have all our tools set up, let's try out the agent.

Let's ask it to view all the posts in a markdown table:

```bash
┌  Welcome to the chat!
│
◇  Ask a question:
│  View all posts in a markdown table
│
│  I'll help you view all the posts in a markdown
│  table format.
│  I'll first retrieve all the posts and then format them
│  into a markdown table.
│
◇  Posts fetched!
│
│  Here's the posts in a markdown table format:
```

| ID                                   | Title                                 | Created At               |
| ------------------------------------ | ------------------------------------- | ------------------------ |
| c7a59691-e481-4485-a863-6257f56c607c | Best Practices for Prompt Engineering | 2025-01-22T16:49:18.261Z |
| 1dc99f27-6127-49e6-87d9-ecb60d2a74a8 | Understanding Large Language Models   | 2025-01-22T16:49:18.766Z |
| 484b4ef7-9270-4385-b9c5-0364ec0cef29 | AI System Architecture Design         | 2025-01-22T16:49:19.269Z |

(view the video above for more demonstrations)

## Human In The Loop
