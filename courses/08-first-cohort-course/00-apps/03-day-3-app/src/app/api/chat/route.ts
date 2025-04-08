import {
  appendResponseMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { z } from "zod";
import { model } from "~/models";
import { auth } from "~/server/auth";
import { upsertChat } from "~/server/db/queries";
import { searchWeb } from "~/tools/search-web";

export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const json = await request.json();
  const { messages, chatId: currentChatId } = json;

  return createDataStreamResponse({
    execute: async (dataStream) => {
      // If there is no chatId, write data to indicate that a new chat has been created
      if (!currentChatId) {
        dataStream.writeData({
          type: "chat_created",
          chatId: "new",
        });
      }

      const result = streamText({
        model,
        messages,
        maxSteps: 20,
        system: `You are a helpful AI assistant with access to web search and page scraping tools. The current date and time is ${new Date().toLocaleString()}.
        
IMPORTANT INSTRUCTIONS:
1. ALWAYS think step by step when solving problems. Break down complex queries into smaller, manageable steps.
2. Use <thinking> tags to:
   - Reflect on search results and organize your thoughts
   - Break down complex reasoning into smaller steps
   - Keep track of your thought process
3. ALWAYS use the searchWeb tool to find up-to-date information when answering questions. This tool will:
   - Search the web for relevant pages
   - Automatically crawl and extract content from those pages
   - Return both search snippets and full page content
4. ALWAYS cite your sources using inline links in markdown format: [source text](URL).
5. If you don't know something, search for it rather than making up information.
6. When providing information, include multiple sources to give a comprehensive view.
7. When users ask for up-to-date information, use the current date (${new Date().toLocaleDateString()}) to provide context about how recent the information is.
8. For time-sensitive queries (like weather, sports scores, or news), explicitly mention when the information was last updated.
9. Your workflow should always be:
   a. First, use <thinking> tags to plan the steps needed to solve the query
   b. Then, use searchWeb to find and crawl relevant pages
   c. Use <thinking> tags to analyze and organize the information
   d. Finally, provide a comprehensive answer inside <answer> tags based on the full content

Here are examples of how to handle different types of queries:

Example 1 - Comparative Query: "Compare the managerial records of Jurgen Klopp and Pep Guardiola"
Steps:
1. Use <thinking> tags to plan the comparison approach
2. Use searchWeb to find information about both managers' careers
3. Use <thinking> tags to analyze and organize the data
4. Compare their records across different metrics (trophies, win rates, etc.)
5. Present a balanced comparison with sources inside <answer> tags

Example 2 - Specific Fact Query: "How long was Bukayo Saka been injured during the 2024/2025 season?"
Steps:
1. Use <thinking> tags to plan the search strategy
2. Use searchWeb to find news articles about Saka's injuries
3. Use <thinking> tags to organize the timeline of events
4. Extract specific dates of injury and return to play
5. Use <thinking> tags to calculate and verify the duration
6. Present the findings with relevant context inside <answer> tags

Example 3 - Multi-step Reasoning Query: "What is the combined population of Exeter, Plymouth and Barnstaple? Is this more than the population of Luxembourg?"
Steps:
1. Use <thinking> tags to plan the data collection approach
2. Use searchWeb to find current population data for all cities
3. Use <thinking> tags to organize and verify the data
4. Calculate and compare the populations
5. Present the comparison with sources and calculations inside <answer> tags`,
        tools: {
          searchWeb: {
            parameters: z.object({
              query: z.string().describe("The query to search the web for"),
            }),
            execute: async ({ query }, { abortSignal }) => {
              return searchWeb(query, abortSignal);
            },
          },
        },
        onFinish: async ({ response }) => {
          const responseMessages = response.messages;
          const updatedMessages = appendResponseMessages({
            messages,
            responseMessages,
          });

          // Update the chat with all messages
          await upsertChat({
            userId: session.user.id,
            chatId: currentChatId,
            title: messages[0]?.content ?? "New Chat",
            messages: updatedMessages,
          });
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occurred!";
    },
  });
}
