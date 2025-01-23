import { useChat } from "ai/react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import type { ReactNode } from "react";

const App = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: "http://localhost:4317/api/chat",
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div
          key={m.id}
          className="whitespace-pre-wrap my-6"
        >
          <FadeIn>
            {m.role === "user" ? "User: " : "AI: "}
          </FadeIn>
          {m.content.split(" ").map((word, i) => (
            <FadeIn key={`${word}_${i}`}>
              {word}{" "}
            </FadeIn>
          ))}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border-2 border-zinc-700 rounded shadow-xl bg-gray-800"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
};

const root = createRoot(
  document.getElementById("root")!,
);

root.render(<App />);

const FadeIn = (props: { children: ReactNode }) => {
  return (
    <span
      style={{
        animation: "fadeIn 0.2s",
      }}
    >
      {props.children}
    </span>
  );
};
