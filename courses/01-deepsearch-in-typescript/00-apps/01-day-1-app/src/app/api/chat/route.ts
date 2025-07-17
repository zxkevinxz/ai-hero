import type { Message } from "ai";
import { streamText, createDataStreamResponse } from "ai";
import { auth } from "~/server/auth";
import { model } from "~/server/ai/model";

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
        system: `You are a helpful AI assistant that can search the web to provide accurate and up-to-date information. When providing answers, always cite your sources with inline links to help users verify the information.

You should:
- Provide accurate, well-researched responses
- Always cite sources with inline markdown links in the format [link text](URL)
- Format all URLs as clickable markdown links for better readability
- Be helpful and informative`,
      });

      result.mergeIntoDataStream(dataStream, {
        sendSources: true,
      });
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occured!";
    },
  });
}
