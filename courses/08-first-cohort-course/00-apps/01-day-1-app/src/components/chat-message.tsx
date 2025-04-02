import { Lightbulb } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import type { WorkflowMessageAnnotation } from "~/app/utils";

interface ChatMessageProps {
  text: string;
  role: string;
  userName: string;
  annotations: WorkflowMessageAnnotation[] | undefined;
  reasoning: string;
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
} as Components;

// Add newlines after <thought> and before </thought> tags
const addNewLines = (markdownText: string) => {
  return markdownText
    .replace(/<thought>/g, "<thought>\n")
    .replace(/<\/thought>/g, "\n</thought>")
    .replace(/<observation>/g, "<observation>\n")
    .replace(/<\/observation>/g, "\n</observation>")
    .replace(/<reply>/g, "<reply>\n")
    .replace(/<\/reply>/g, "\n</reply>")
    .trim();
};

const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown components={components}>
      {addNewLines(children)}
    </ReactMarkdown>
  );
};

export const ChatMessage = ({
  text,
  role,
  userName,
  annotations,
  reasoning,
}: ChatMessageProps) => {
  const isAI = role === "assistant";

  const planAnnotation = annotations?.findLast((a) => a.type === "PLAN_UPDATE");

  const queries = planAnnotation?.queries ?? [];
  const plan = planAnnotation?.plan;

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
        {plan && (
          <div className="my-4 flex items-start gap-3 text-sm text-gray-400">
            <Lightbulb className="mt-1 size-5 flex-shrink-0" />
            <div>
              <Markdown>{plan}</Markdown>
            </div>
          </div>
        )}
        {queries.length > 0 && (
          <div className="my-4 flex gap-4 text-xs">
            <span className="text-gray-400">Searched:</span>
            {queries
              .filter((q) => typeof q === "object")
              .map((q, i) => (
                <a
                  key={i}
                  href={`https://google.com?q=${encodeURIComponent(q.query ?? "")}`}
                  className="text-blue-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {q.query ?? ""}
                </a>
              ))}
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          {reasoning && <Markdown>{reasoning}</Markdown>}
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </div>
  );
};
