import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { sendChatMessage } from "@/lib/chat.functions";

type ChatMessage = { role: "user" | "assistant"; content: string };

const FALLBACK_REPLY = "I'm having trouble right now. Please email me at humairyousaf66@gmail.com.";

const STARTERS = [
  "What's your experience?",
  "What projects have you built?",
  "What are your skills?",
  "How can I contact you?",
];

const MAX_CHARS = 500;

export function ChatWidget() {
  const sendToServer = useServerFn(sendChatMessage);
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  function openChat() {
    setOpen(true);
    setEverOpened(true);
  }

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      // Assistant replies can be longer than the 500-character input limit. Keep the full
      // reply visible in the UI, but normalize history before sending it back to the server.
      const history = next.slice(-10).map((message) => ({
        ...message,
        content: message.content.slice(0, MAX_CHARS),
      }));
      const res = await sendToServer({
        data: { messages: history },
      });
      setMessages([
        ...next,
        {
          role: "assistant",
          content: res.reply ?? res.error ?? FALLBACK_REPLY,
        },
      ]);
    } catch {
      setMessages([...next, { role: "assistant", content: FALLBACK_REPLY }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Chat with Humair"
            className="fixed inset-0 z-[60] flex flex-col overflow-hidden border border-border bg-surface shadow-soft sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:max-h-[calc(100vh-8rem)] sm:w-[380px] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-bold leading-tight text-foreground">
                  Chat with Humair
                </p>
                <p className="text-[11px] text-muted-foreground">
                  AI assistant · answers as Humair
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground">
                    Hi! I'm Humair's AI assistant — ask me anything about my experience, projects,
                    or skills.
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => void send(s)}
                        disabled={loading}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary hover:bg-accent/40 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted text-foreground"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => (
                            <ul className="my-2 list-disc space-y-1 pl-4">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="my-2 list-decimal space-y-1 pl-4">{children}</ol>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold">{children}</strong>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="underline underline-offset-2"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-muted px-4 py-3"
                    aria-label="Assistant is typing"
                  >
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form onSubmit={onSubmit} className="border-t border-border bg-background p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={onKeyDown}
                  rows={1}
                  maxLength={MAX_CHARS}
                  placeholder="Ask about my work…"
                  aria-label="Message"
                  className="max-h-28 min-h-[42px] flex-1 resize-none rounded-lg border border-input bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  disabled={loading || input.trim().length === 0}
                  aria-label="Send message"
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-right text-[10px] text-muted-foreground">
                {input.length}/{MAX_CHARS}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      {!open && (
        <button
          onClick={openChat}
          aria-label="Open chat"
          className="relative ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {!everOpened && (
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-full bg-primary opacity-40"
            />
          )}
          <MessageCircle className="relative h-6 w-6" />
        </button>
      )}
    </div>
  );
}
