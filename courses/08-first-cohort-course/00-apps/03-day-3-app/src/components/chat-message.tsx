import ReactMarkdown, { type Components } from "react-markdown";
import type { Message } from "ai";
import { Lightbulb } from "lucide-react";
import { useState } from "react";
import rehypeRaw from "rehype-raw";

export type MessagePart = NonNullable<Message["parts"]>[number];

interface ChatMessageProps {
  parts: MessagePart[] | undefined;
  role: string;
  userName: string;
}

const ThinkingSection = ({ children }: { children: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 rounded-lg bg-gray-700/50 p-2 text-sm text-gray-300 hover:bg-gray-700/70"
      >
        <Lightbulb className="size-4 text-yellow-400" />
        <span>AI's Thinking Process</span>
      </button>
      {isExpanded && (
        <div className="mt-2 rounded-lg bg-gray-700/30 p-4 text-sm text-gray-400">
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
            {children}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

// Extend the Components type to include our custom components
type CustomComponents = Components & {
  thinking: React.ComponentType<{ children: string }>;
  answer: React.ComponentType<{ children: string }>;
};

const components: CustomComponents = {
  // Override default elements with custom styling
  p: ({ children }) => <p className="mb-4 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-4">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ className, children, ...props }) => (
    <code
      className={`rounded bg-gray-700 px-1 py-0.5 font-mono text-sm ${
        className ?? ""
      }`}
      {...props}
    >
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
  thinking: ({ children }) => <ThinkingSection>{children}</ThinkingSection>,
  answer: ({ children }) => (
    <div className="rounded-lg bg-gray-700/30 p-4 text-gray-300">
      <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  ),
};

const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

const ToolInvocation = ({
  toolInvocation,
}: {
  toolInvocation: NonNullable<
    MessagePart & { type: "tool-invocation" }
  >["toolInvocation"];
}) => {
  return (
    <div className="mb-4 rounded-lg bg-gray-700 p-4">
      <div className="mb-2 font-mono text-sm text-gray-400">
        {toolInvocation.toolName}
      </div>
      <div className="overflow-x-auto">
        <pre className="text-sm">
          {JSON.stringify(toolInvocation.args, null, 2)}
        </pre>
        {toolInvocation.state === "result" && (
          <>
            <div className="my-2 border-t border-gray-600" />
            <pre className="text-sm">
              {JSON.stringify(toolInvocation.result, null, 2)}
            </pre>
          </>
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
              return <Markdown key={index}>{part.text}</Markdown>;
            }

            if (part.type === "tool-invocation") {
              return (
                <ToolInvocation
                  key={index}
                  toolInvocation={part.toolInvocation}
                />
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
