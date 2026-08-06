import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Compass } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const suggestions = [
  "How should I fuel Saturday's 55 mi brick?",
  "Cues for a smoother 2,100 yd swim",
  "Am I peaking at the right time for Sep 11?",
];

function messageText(message: UIMessage) {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

export function AICoach({ className }: { className?: string }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <div className={`panel flex min-h-[440px] flex-col p-5 lg:p-6 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md border border-primary/30 bg-primary/10 text-primary">
            <Compass className="size-4" />
          </span>
          <div>
            <p className="section-label">Digital coach</p>
            <h2 className="mt-1 font-display text-base font-medium">APEX Coach</h2>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <i className="size-1.5 rounded-full bg-success" /> Online
        </span>
      </div>

      <Conversation className="mt-4 min-h-0 flex-1">
        <ConversationContent className="gap-4 p-0">
          {messages.length === 0 ? (
            <div className="space-y-3 py-6">
              <p className="text-sm text-muted-foreground">
                Ask about training cues, pacing, or fueling for the 70.3 block.
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <MessageResponse>{messageText(message)}</MessageResponse>
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && <Shimmer className="text-sm">Thinking...</Shimmer>}
          {error && (
            <p className="text-xs text-destructive">
              Coach is unavailable right now. Try again in a moment.
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        className="mt-4"
        onSubmit={(_message, event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <PromptInputTextarea
          ref={textareaRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask your coach..."
        />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit status={status} disabled={!input.trim() || busy} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
