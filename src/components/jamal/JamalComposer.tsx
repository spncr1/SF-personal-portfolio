"use client";

import type { FormEvent } from "react";
import { JAMAL_LIMITS } from "@/lib/jamal/validation";

interface JamalComposerProps {
  value: string;
  processing: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function JamalComposer({
  value,
  processing,
  textareaRef,
  onChange,
  onSubmit,
}: JamalComposerProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="jamal-composer" onSubmit={submit}>
      <label htmlFor="jamal-input">Ask about Spencer or his portfolio</label>
      <textarea
        ref={textareaRef}
        id="jamal-input"
        value={value}
        rows={3}
        maxLength={JAMAL_LIMITS.maxMessageCharacters}
        disabled={processing}
        placeholder="Enter query..."
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="jamal-composer__footer">
        <span>
          {value.length}/{JAMAL_LIMITS.maxMessageCharacters}
        </span>
        <button type="submit" disabled={processing || !value.trim()}>
          {processing ? "Processing" : "Transmit"}
        </button>
      </div>
    </form>
  );
}

