"use client";

import { motion, useReducedMotion } from "motion/react";
import { JamalComposer } from "./JamalComposer";
import { JamalIdentityMark } from "./JamalIdentityMark";
import { JamalMessages, type JamalDisplayMessage } from "./JamalMessages";

interface JamalPanelProps {
  modal: boolean;
  mobile: boolean;
  messages: JamalDisplayMessage[];
  suggestions: string[];
  input: string;
  processing: boolean;
  errorMessage: string | null;
  canRetry: boolean;
  panelRef: React.RefObject<HTMLElement | null>;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onRetry: () => void;
  onClose: () => void;
  onNavigate: () => void;
  onSuggestion: (suggestion: string) => void;
}

export function JamalPanel({
  modal,
  mobile,
  messages,
  suggestions,
  input,
  processing,
  errorMessage,
  canRetry,
  panelRef,
  closeButtonRef,
  textareaRef,
  onInputChange,
  onSubmit,
  onRetry,
  onClose,
  onNavigate,
  onSuggestion,
}: JamalPanelProps) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <motion.aside
      ref={panelRef}
      id="jamal-panel"
      className="jamal-panel"
      role="dialog"
      aria-modal={modal || undefined}
      aria-label="JAMAL portfolio assistant"
      initial={reduceMotion ? false : mobile ? { opacity: 0, y: 28 } : { opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : mobile ? { opacity: 0, y: 28 } : { opacity: 0, x: 32 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
    >
      <div className="jamal-panel__hex-field" aria-hidden="true" />
      <header className="jamal-panel__header">
        <div className="jamal-panel__identity">
          <JamalIdentityMark />
          <div className="jamal-panel__identity-copy">
            <span>Digital companion // Active</span>
            <strong>J.A.M.A.L.</strong>
            <small>Just A Machine Assisting Life</small>
          </div>
        </div>
        <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close JAMAL">
          <i aria-hidden="true" />
          Close
        </button>
      </header>

      <JamalMessages messages={messages} processing={processing} onNavigate={onNavigate} />

      {messages.length === 1 && (
        <div className="jamal-suggestions" aria-label="Suggested questions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={processing}
              onClick={() => onSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {errorMessage && (
        <div className="jamal-error" role="alert">
          <span>{errorMessage}</span>
          {canRetry && (
            <button type="button" disabled={processing} onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      )}

      <JamalComposer
        value={input}
        processing={processing}
        textareaRef={textareaRef}
        onChange={onInputChange}
        onSubmit={onSubmit}
      />

      <footer className="jamal-panel__footer">
        <span>AI CHAT INTERFACE</span>
        <span>JML-01</span>
    </footer>
    </motion.aside>
  );
}
