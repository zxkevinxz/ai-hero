import ReactMarkdown, { type Components } from "react-markdown";
import type { Message } from "ai";

export type MessagePart = NonNullable<Message["parts"]>[number];

interface ChatMessageProps {
  parts?: MessagePart[];
  text?: string;
  role: string;
  userName: string;
}

const components: Components = {
  // Override default elements with custom styling
  p: ({ children }) => <p className="mb-4 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-4">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ className, children, ...props }) => (
    <code className={`${className ?? ""}`} {...props}>
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-700 p-4">
      {children}
    </pre>
  ),
  a: ({ children, ...props }) => (
    <a
      className="text-blue-400 underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
};

const Markdown = ({ children }: { children: string }) => {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

type ToolInvocationPart = Extract<MessagePart, { type: "tool-invocation" }>;

const ToolInvocation = ({
  toolInvocation,
}: {
  toolInvocation: ToolInvocationPart;
}) => {
  const invocation = toolInvocation.toolInvocation;

  return (
    <div className="my-2 rounded border border-gray-700 bg-gray-900/50 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
        <span className="font-mono">Tool Call</span>
        <span className="text-xs text-gray-500">{invocation.state}</span>
      </div>

      <div className="mb-2">
        <div className="text-xs text-gray-500">Tool Call:</div>
        <pre className="mt-1 overflow-x-auto text-sm">
          {JSON.stringify(invocation, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const ChatMessage = ({
  parts,
  text,
  role,
  userName,
}: ChatMessageProps) => {
  const isAI = role === "assistant";

  return (
    <div className="mb-6">
      <div
        className={`rounded-lg p-4 ${
          isAI ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-gray-300"
        }`}
      >
        <p className="mb-2 text-sm font-semibold text-gray-400">
          {isAI ? "AI" : userName}
        </p>

        <div className="prose prose-invert max-w-none">
          {parts ? (
            parts.map((part, i) => {
              if (part.type === "text") {
                return <Markdown key={i}>{part.text}</Markdown>;
              }

              if (part.type === "tool-invocation") {
                return <ToolInvocation key={i} toolInvocation={part} />;
              }

              return null;
            })
          ) : text ? (
            <Markdown>{text}</Markdown>
          ) : null}
        </div>
      </div>
    </div>
  );
};
