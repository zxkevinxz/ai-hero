---
id: lesson-c3344
---

<AISummary title="Understanding Message Parts" href="https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat#messages.ui-message.parts">

The `MessagePart` type represents different types of content that can appear in a message. Here's a comprehensive overview of all possible message parts:

## Basic Structure

```ts
type MessagePart =
  | TextUIPart
  | ReasoningUIPart
  | ToolInvocationUIPart
  | SourceUIPart
  | FileUIPart
  | StepStartUIPart;
```

## Individual Part Types

### Text Part

```ts
type TextUIPart = {
  type: "text";
  text: string;
};
```

The simplest part type, containing plain text content.

### Reasoning Part

```ts
type ReasoningUIPart = {
  type: "reasoning";
  reasoning: string;
  details: Array<
    | {
        type: "text";
        text: string;
        signature?: string;
      }
    | {
        type: "redacted";
        data: string;
      }
  >;
};
```

Contains reasoning text and associated details, which can be either text or redacted data.

### Tool Invocation Part

```ts
type ToolInvocationUIPart = {
  type: "tool-invocation";
  toolInvocation: ToolInvocation;
};
```

Represents a tool call or its result. The `ToolInvocation` can be in three states:

```ts
type ToolInvocation =
  | ({
      state: "partial-call";
      step?: number;
    } & ToolCall<string, any>)
  | ({ state: "call"; step?: number } & ToolCall<
      string,
      any
    >)
  | ({ state: "result"; step?: number } & ToolResult<
      string,
      any,
      any
    >);
```

### Source Part

```ts
type SourceUIPart = {
  type: "source";
  source: LanguageModelV1Source;
};
```

Contains source information from the language model.

### File Part

```ts
type FileUIPart = {
  type: "file";
  mimeType: string;
  data: string;
};
```

Represents a file with its MIME type and data.

### Step Start Part

```ts
type StepStartUIPart = {
  type: "step-start";
};
```

Marks the beginning of a new step in the conversation.

## Important Notes

- Each assistant tool call has one corresponding tool invocation
- Tool invocations can be in three states:
  - `partial-call`: When the call is in progress
  - `call`: When the call is complete
  - `result`: When the tool has returned a result
- The `step` property is optional and helps map assistant UI messages with multiple tool invocations back to LLM assistant/tool result message pairs

</AISummary>

`Message['parts']` is the most recent attempt by the AI SDK team to express all the different bits a message can contain. It supercedes things like `toolInvocations` and `reasoning`.

Steps to complete:

- Change the `ChatMessage` component to show the tool invocations. Currently, it only shows the `text`. Instead, it should rely on the `parts` array of each message to show the tool invocations. `text` will not be needed any more.
- The type for `parts` is available via:

```ts
import type { Message } from "ai";

export type MessagePart = NonNullable<
  Message["parts"]
>[number];
```

- Encourage the user to hover over the `MessagePart` to see all the possible things `parts` can be

Not required:

- Handling source parts
- Handling file parts
- Handling step start parts
- Handling image parts
- Handling redacted parts
- Handling reasoning parts
