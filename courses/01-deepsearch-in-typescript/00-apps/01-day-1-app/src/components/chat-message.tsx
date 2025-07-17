import ReactMarkdown, { type Components } from "react-markdown";
import type { Message } from "ai";

export type MessagePart = NonNullable<Message["parts"]>[number];

interface ChatMessageProps {
  parts: MessagePart[] | undefined;
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

const ToolInvocation = ({ part }: { part: MessagePart }) => {
  if (part.type !== "tool-invocation") return null;

  const { toolInvocation } = part;

  return (
    <div className="mb-4 rounded-lg border border-gray-600 bg-gray-700 p-3">
      <div className="mb-2">
        <span className="text-xs font-semibold text-blue-400">
          🔧 {toolInvocation.toolName}
        </span>
        <span className="ml-2 text-xs text-gray-400">
          ({toolInvocation.state})
        </span>
      </div>

      {toolInvocation.state === "call" ||
      toolInvocation.state === "partial-call" ? (
        <div>
          <div className="mb-1 text-xs text-gray-500">Arguments:</div>
          <pre className="overflow-x-auto rounded bg-gray-800 p-2 text-xs">
            {JSON.stringify(toolInvocation.args, null, 2)}
          </pre>
        </div>
      ) : toolInvocation.state === "result" ? (
        <div>
          <div className="mb-1 text-xs text-gray-500">Arguments:</div>
          <pre className="mb-2 overflow-x-auto rounded bg-gray-800 p-2 text-xs">
            {JSON.stringify(toolInvocation.args, null, 2)}
          </pre>
          <div className="mb-1 text-xs text-gray-500">Result:</div>
          <pre className="overflow-x-auto rounded bg-gray-800 p-2 text-xs">
            {JSON.stringify(toolInvocation.result, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
};

const TextPart = ({ part }: { part: MessagePart }) => {
  if (part.type !== "text") return null;

  return <Markdown>{part.text}</Markdown>;
};

const Source = ({ part }: { part: MessagePart }) => {
  if (part.type !== "source") return null;

  const { source } = part;

  return (
    <div className="mb-4 rounded-lg border border-blue-600 bg-blue-900/20 p-3">
      <div className="mb-2">
        <span className="text-xs font-semibold text-blue-400">🔗 Source</span>
      </div>
      <div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          {source.title || source.url}
        </a>
        {source.id && (
          <div className="mt-1 text-xs text-gray-500">ID: {source.id}</div>
        )}
      </div>
    </div>
  );
};

export const ChatMessage = ({ parts, role, userName }: ChatMessageProps) => {
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
          {parts?.map((part, index) => {
            if (part.type === "text") {
              return <TextPart key={index} part={part} />;
            } else if (part.type === "tool-invocation") {
              return <ToolInvocation key={index} part={part} />;
            } else if (part.type === "source") {
              return <Source key={index} part={part} />;
            }

            // For other part types we don't handle yet, just return null
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
