import { streamText, tool } from "ai";
import { z } from "zod";
import {
  cliChat,
  wrapWithSpinner,
} from "../../_shared/cli-chat.ts";
import { smallToolCallingModel } from "../../_shared/models.ts";
import { createCmsClient } from "./client.ts";
import { seedDatabase } from "./seed.ts";
import { startServer } from "./server.ts";

// Setup code
const server = await startServer();
await seedDatabase();
const client = createCmsClient();

// Code

await cliChat({
  answerQuestion: async (messages) => {
    const result = await streamText({
      model: smallToolCallingModel,
      system:
        `You are a content management agent. ` +
        `You help to update a CMS based on user input. ` +
        `Think step-by-step. ` +
        `Before updating content, offer the user the chance to make changes. `,
      messages,
      tools: {
        viewAllPosts: tool({
          parameters: z.object({}),
          description: "View all posts",
          execute: wrapWithSpinner(
            {
              startMessage: "Fetching posts...",
              stopMessage: "Posts fetched!",
            },
            async () => {
              const result =
                await client.getAllPosts();

              return result.map(
                ({ content, ...rest }) => {
                  return rest;
                },
              );
            },
          ),
        }),
        viewPost: tool({
          parameters: z.object({ id: z.string() }),
          description:
            "View a specific post, including its content",
          execute: wrapWithSpinner(
            {
              startMessage: "Fetching post...",
              stopMessage: "Post fetched!",
            },
            async ({ id }) => {
              return await client.getPost(id);
            },
          ),
        }),
        updatePost: tool({
          parameters: z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
          }),
          description:
            "Update a specific post with a new title and content",
          execute: wrapWithSpinner(
            {
              startMessage: "Updating post...",
              stopMessage: "Post updated!",
            },
            async ({ id, title, content }) => {
              const result = await client.updatePost(
                id,
                {
                  title,
                  content,
                },
              );

              return result;
            },
          ),
        }),
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
          execute: wrapWithSpinner(
            {
              startMessage: "Creating post...",
              stopMessage: "Post created!",
            },
            async ({ title, content }) => {
              return await client.createPost({
                title,
                content,
              });
            },
          ),
        }),
        deletePost: tool({
          parameters: z.object({ id: z.string() }),
          description: "Delete a specific post",
          execute: wrapWithSpinner(
            {
              startMessage: "Deleting post...",
              stopMessage: "Post deleted!",
            },
            async ({ id }) => {
              return await client.deletePost(id);
            },
          ),
        }),
      },
      maxSteps: 10,
    });

    return result;
  },
});

// Teardown code
server.close();
