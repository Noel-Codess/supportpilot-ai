"use client";

import { ArrowUp, CornerDownLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MAX_CHAT_MESSAGE_LENGTH } from "@/lib/validation/chat";

export function ChatInput({ onSubmit, disabled }: { onSubmit(message: string): void; disabled?: boolean }) {
  const [value, setValue] = useState("");
  const remaining = MAX_CHAT_MESSAGE_LENGTH - value.length;

  function submit() {
    const message = value.trim();
    if (!message || disabled || message.length > MAX_CHAT_MESSAGE_LENGTH) return;
    onSubmit(message);
    setValue("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-50">
      <label htmlFor="message" className="sr-only">Message SupportPilot AI</label>
      <textarea
        id="message"
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        rows={2}
        placeholder="Ask about an order or company policy…"
        className="max-h-36 min-h-14 w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
      />
      <div className="flex items-center justify-between gap-3 px-2 pb-1">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <CornerDownLeft className="size-3" />
          Enter to send · Shift + Enter for a new line
          {remaining < 300 && <span className={remaining < 0 ? "font-bold text-rose-600" : ""}>{remaining} left</span>}
        </div>
        <Button
          type="button"
          size="icon"
          aria-label="Send message"
          onClick={submit}
          disabled={disabled || !value.trim() || remaining < 0}
          className="size-9 rounded-xl"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </div>
  );
}
