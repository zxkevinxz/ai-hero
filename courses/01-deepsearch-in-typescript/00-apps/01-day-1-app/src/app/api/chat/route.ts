import type { Message } from "ai";
import { streamText, createDataStreamResponse } from "ai";
import { z } from "zod";
import { auth } from "~/server/auth";
import { model } from "~/server/ai/model";
import { searchSerper } from "~/serper";

export const maxDuration = 60;

export async function POST(request: Request) {
  // Check if user is authenticated
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as {
    messages: Array<Message>;
  };

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const { messages } = body;

      const result = streamText({
        model,
        messages,
        system: `You are a helpful AI assistant that can search the web to provide accurate and up-to-date information. Always use the search web tool to find current information before answering questions. When providing answers, always cite your sources with inline links to help users verify the information.

You should:
- Search the web for relevant information before answering questions
- Provide accurate, well-researched responses
- Always cite sources with inline markdown links in the format [link text](URL)
- Format all URLs as clickable markdown links for better readability
- Be helpful and informative`,
        maxSteps: 10,
        tools: {
          searchWeb: {
            parameters: z.object({
              query: z.string().describe("The query to search the web for"),
            }),
            execute: async ({ query }, { abortSignal }) => {
              const results = await searchSerper(
                { q: query, num: 10 },
                abortSignal,
              );

              return results.organic.map((result) => ({
                title: result.title,
                link: result.link,
                snippet: result.snippet,
              }));
            },
          },
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occured!";
    },
  });
}
