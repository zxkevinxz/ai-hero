import type { Message } from "@ai-sdk/react";

export function sanitizeUIMessagesAfterStop(
  messages: Array<Message>,
): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (!message.parts) return message;

    const toolResultIds: Array<string> = [];

    const toolInvocations = message.parts
      .filter((p) => p.type === "tool-invocation")
      .map((p) => p.toolInvocation);

    for (const toolInvocation of toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedParts = message.parts.filter((part) => {
      if (part.type !== "tool-invocation") return true;

      return toolResultIds.includes(part.toolInvocation.toolCallId);
    });

    return {
      ...message,
      parts: sanitizedParts,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 || (message.parts && message.parts.length > 0),
  );
}

export type WorkflowMessageAnnotation =
  | {
      type: "URLS_CRAWLED";
      urls: string[];
    }
  | {
      type: "PLAN_UPDATE";
      plan?: string;
      queries?: ({ query?: string } | undefined)[];
    };
