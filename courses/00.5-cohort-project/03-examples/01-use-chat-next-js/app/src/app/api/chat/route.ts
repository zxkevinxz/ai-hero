import type { Message } from "ai";
import { streamText } from "ai";

// Import from wherever you put your models.ts file
import { flagshipModel } from "../../models";

export async function POST(request: Request) {
  const { messages }: { messages: Message[] } =
    await request.json();

  const result = streamText({
    model: flagshipModel,
    messages,
  });

  return result.toDataStreamResponse();
}
