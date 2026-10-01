"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getJamalSuggestedQuestions } from "@/lib/jamal/context";
import type {
  JamalApiResponse,
  JamalErrorResponse,
  JamalHistoryMessage,
  JamalSuccessResponse,
} from "@/types/jamal";
import { JamalActivationNode } from "./JamalActivationNode";
import { JamalPanel } from "./JamalPanel";
import type { JamalDisplayMessage } from "./JamalMessages";

interface JamalControllerProps {
  enabled: boolean;
  pathname: string;
  onOpenChange: (open: boolean) => void;
}

interface RetryState {
  message: string;
  history: JamalHistoryMessage[];
}

const WELCOME_MESSAGE: JamalDisplayMessage = {
  id: "jamal-welcome",
  role: "assistant",
  content:
    "I am J.A.M.A.L. (Just A Machine Assisting Life), Spencer's digital portfolio companion. Ask me about his work, skills, background, interests, projects, or how to get in touch.",
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function isErrorResponse(value: JamalApiResponse): value is JamalErrorResponse {
  return "error" in value;
}

function validSuccessResponse(value: JamalApiResponse): value is JamalSuccessResponse {
  return (
    !isErrorResponse(value) &&
    typeof value.answer === "string" &&
    Array.isArray(value.links) &&
    value.links.every(
      (link) =>
        typeof link?.label === "string" &&
        typeof link?.href === "string" &&
        typeof link?.icon === "string" &&
        ((link.kind === "internal" && link.href.startsWith("/")) ||
          (link.kind === "document" && link.href.startsWith("/")) ||
          (link.kind === "email" && link.href.startsWith("mailto:")) ||
          (link.kind === "phone" && link.href.startsWith("tel:")) ||
          (link.kind === "external" && link.href.startsWith("https://"))),
    )
  );
}

function createMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function JamalController({ enabled, pathname, onOpenChange }: JamalControllerProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [open, setOpen] = useState(false);
  const [wideDesktop, setWideDesktop] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [messages, setMessages] = useState<JamalDisplayMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryState, setRetryState] = useState<RetryState | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activationButtonRef = useRef<HTMLButtonElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const modal = !wideDesktop && !mobile;

  const updateOpen = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (nextOpen) onOpenChange(true);
    },
    [onOpenChange],
  );

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 1181px)");
    const mobileMedia = window.matchMedia("(max-width: 720px)");
    const sync = () => {
      setWideDesktop(desktopMedia.matches);
      setMobile(mobileMedia.matches);
    };
    sync();
    desktopMedia.addEventListener("change", sync);
    mobileMedia.addEventListener("change", sync);
    return () => {
      desktopMedia.removeEventListener("change", sync);
      mobileMedia.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  useEffect(() => {
    if (!open) return;

    const focusFrame = window.requestAnimationFrame(() => textareaRef.current?.focus());
    const shellTargets = modal
      ? Array.from(
          document.querySelectorAll<HTMLElement>(
            ".system-shell__header, .system-shell__content, .system-shell__footer",
          ),
        )
      : [];
    const previousBodyOverflow = document.body.style.overflow;

    if (modal) {
      document.body.style.overflow = "hidden";
      shellTargets.forEach((element) => {
        element.inert = true;
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        updateOpen(false);
        return;
      }

      if (!modal || event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      shellTargets.forEach((element) => {
        element.inert = false;
      });
    };
  }, [modal, open, updateOpen]);

  useEffect(() => {
    if (!open) activationButtonRef.current?.focus();
  }, [open]);

  const sendRequest = useCallback(
    async (message: string, history: JamalHistoryMessage[]) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setProcessing(true);
      setErrorMessage(null);
      setRetryState({ message, history });

      try {
        const response = await fetch("/api/jamal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history: history.slice(-8), pathname }),
          signal: controller.signal,
        });
        const payload = (await response.json()) as JamalApiResponse;

        if (!response.ok || isErrorResponse(payload)) {
          const fallback = "JAMAL is temporarily unavailable.";
          setErrorMessage(isErrorResponse(payload) ? payload.error.message : fallback);
          return;
        }

        if (!validSuccessResponse(payload)) {
          setErrorMessage("JAMAL returned an unreadable response. Please try again.");
          return;
        }

        setMessages((current) => [
          ...current,
          {
            id: createMessageId("assistant"),
            role: "assistant",
            content: payload.answer,
            links: payload.links,
          },
        ]);
        setRetryState(null);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setErrorMessage("JAMAL could not establish a connection. Please try again.");
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
          setProcessing(false);
        }
      }
    },
    [pathname],
  );

  const submitMessage = useCallback(
    (override?: string) => {
      const message = (override ?? input).trim();
      if (!message || processing) return;

      const history = messages.map(({ role, content }) => ({ role, content })).slice(-8);
      setMessages((current) => [
        ...current,
        { id: createMessageId("user"), role: "user", content: message },
      ]);
      setInput("");
      void sendRequest(message, history);
    },
    [input, messages, processing, sendRequest],
  );

  if (!enabled) return null;

  return (
    <>
      <JamalActivationNode
        open={open}
        mobile={mobile}
        processing={processing}
        unavailable={Boolean(errorMessage)}
        onActivate={() => updateOpen(true)}
        buttonRef={activationButtonRef}
      />

      <AnimatePresence>
        {open && modal && (
          <motion.button
            className="jamal-backdrop"
            type="button"
            aria-label="Close JAMAL"
            onClick={() => updateOpen(false)}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence onExitComplete={() => onOpenChange(false)}>
        {open && (
          <JamalPanel
            modal={modal}
            mobile={mobile}
            messages={messages}
            suggestions={getJamalSuggestedQuestions(pathname)}
            input={input}
            processing={processing}
            errorMessage={errorMessage}
            canRetry={Boolean(retryState)}
            panelRef={panelRef}
            closeButtonRef={closeButtonRef}
            textareaRef={textareaRef}
            onInputChange={setInput}
            onSubmit={() => submitMessage()}
            onRetry={() => {
              if (retryState && !processing) void sendRequest(retryState.message, retryState.history);
            }}
            onClose={() => updateOpen(false)}
            onNavigate={() => {
              if (!wideDesktop) updateOpen(false);
            }}
            onSuggestion={submitMessage}
          />
        )}
      </AnimatePresence>
    </>
  );
}
