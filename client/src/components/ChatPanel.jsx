import { useState, useRef, useEffect } from "react";
import api from "../lib/api";

const SUGGESTIONS = [
  "Where's the nearest accessible restroom?",
  "¿Dónde está la salida menos concurrida?",
  "Which gate is least crowded right now?",
  "Where can I find first aid?",
];

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm FanPulse. Ask me for directions, accessibility help, or the quickest gate to use — in any language.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat/ask", { question });
      setMessages((m) => [...m, { role: "assistant", text: res.data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry, I couldn't reach the assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-black/5">
      <div className="px-5 py-4 border-b border-black/5">
        <h2 className="font-display text-lg tracking-wide uppercase text-[var(--color-ink)]">
          Ask FanPulse
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">Navigation · Accessibility · Any language</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[280px] max-h-[420px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[var(--color-turf)] text-white rounded-br-sm"
                  : "bg-neutral-100 text-[var(--color-ink)] rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm text-neutral-400">
              typing…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-5 pb-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="text-[11px] px-2.5 py-1 rounded-full border border-black/10 text-neutral-600 hover:border-[var(--color-turf)] hover:text-[var(--color-turf)] transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2 px-5 py-4 border-t border-black/5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-black/10 outline-none focus:border-[var(--color-turf)] transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[var(--color-ink)] text-white text-sm font-medium hover:bg-[var(--color-ink-soft)] transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
