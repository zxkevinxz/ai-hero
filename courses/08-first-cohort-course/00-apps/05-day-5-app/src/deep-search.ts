import { streamText, type Message, type StreamTextResult } from "ai";
import { runAgentLoop } from "./run-agent-loop";

export const streamFromDeepSearch = async (opts: {
  messages: Message[];
  onFinish: Parameters<typeof streamText>[0]["onFinish"];
  langfuseTraceId?: string;
}): Promise<StreamTextResult<{}, string>> => {
  const lastMessage = opts.messages[opts.messages.length - 1];
  if (!lastMessage) {
    throw new Error("No messages provided");
  }

  return runAgentLoop(lastMessage.content, {
    langfuseTraceId: opts.langfuseTraceId,
  });
};

export async function askDeepSearch(messages: Message[]) {
  const result = await streamFromDeepSearch({
    messages,
    onFinish: () => {}, // just a stub
    langfuseTraceId: undefined,
  });

  // Consume the stream - without this,
  // the stream will never finish
  await result.consumeStream();

  return await result.text;
}
