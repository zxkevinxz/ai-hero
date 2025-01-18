import type {
  CoreTool,
  CoreToolMessage,
  StreamTextResult,
  ToolResultPart,
} from "ai";
import type { z } from "zod";

export type ToolCall = Awaited<
  StreamTextResult<any>["toolCalls"]
>[number];

export const createDelayedToolExecutor = <
  T extends Record<string, z.ZodType>,
>(tools: {
  [K in keyof T]: {
    tool: CoreTool<T[K]>;
    execute: (parameters: z.output<T[K]>) => any;
  };
}) => {
  const toolNames = new Set(Object.keys(tools));

  return {
    /**
     * Retrieve unresolved tool calls from a StreamTextResult
     * that match the tool names in the tools object
     */
    getUnresolvedToolCalls: async (
      result: StreamTextResult<any>,
    ): Promise<ToolCall[]> => {
      const toolCalls = await result.toolCalls;
      const toolResults = await result.toolResults;

      const toolCallsWithoutMatchingResults =
        toolCalls.filter(
          (toolCall) =>
            !toolResults.some(
              (toolResult) =>
                toolCall.toolCallId ===
                toolResult.toolCallId,
            ),
        );

      const toolCallsMatchingToolNames =
        toolCallsWithoutMatchingResults.filter(
          (toolCall) =>
            toolNames.has(toolCall.toolName),
        );

      return toolCallsMatchingToolNames;
    },
    /**
     * Executes the tools, returning a CoreToolMessage
     * which can be appended to the messages array.
     */
    executeTools: async (
      toolCalls: ToolCall[],
    ): Promise<CoreToolMessage> => {
      const toolResults = await Promise.all(
        toolCalls.map(async (toolCall) => {
          const toolEntry = tools[toolCall.toolName];

          if (!toolEntry) {
            throw new Error(
              `Tool not found: ${toolCall.toolName}`,
            );
          }

          try {
            const result = await toolEntry.execute(
              toolCall.args,
            );
            return {
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.toolName,
              type: "tool-result",
              result,
            } satisfies ToolResultPart;
          } catch (e) {
            if (e instanceof Error) {
              return {
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
                type: "tool-result",
                result: e.message,
              } satisfies ToolResultPart;
            }

            throw e;
          }
        }),
      );

      return {
        role: "tool",
        content: toolResults,
      };
    },
  };
};
