import type { JamalHistoryMessage, JamalRequest } from "@/types/jamal";

export const JAMAL_LIMITS = {
  maxBodyBytes: 32_768,
  maxMessageCharacters: 600,
  maxHistoryMessages: 8,
  maxHistoryCharacters: 6_000,
  maxHistoryMessageCharacters: 2_400,
} as const;

export class JamalValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JamalValidationError";
  }
}

function isHistoryMessage(value: unknown): value is JamalHistoryMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0 &&
    candidate.content.length <= JAMAL_LIMITS.maxHistoryMessageCharacters
  );
}

export function validateJamalRequest(value: unknown): JamalRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new JamalValidationError("Request body must be a JSON object.");
  }

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.message !== "string") {
    throw new JamalValidationError("Message is required.");
  }

  const message = candidate.message.trim();
  if (!message || message.length > JAMAL_LIMITS.maxMessageCharacters) {
    throw new JamalValidationError(
      `Message must be between 1 and ${JAMAL_LIMITS.maxMessageCharacters} characters.`,
    );
  }

  if (!Array.isArray(candidate.history) || candidate.history.length > JAMAL_LIMITS.maxHistoryMessages) {
    throw new JamalValidationError(
      `History must contain no more than ${JAMAL_LIMITS.maxHistoryMessages} messages.`,
    );
  }

  if (!candidate.history.every(isHistoryMessage)) {
    throw new JamalValidationError("History contains an invalid message.");
  }

  const historyCharacters = candidate.history.reduce((total, item) => total + item.content.length, 0);
  if (historyCharacters > JAMAL_LIMITS.maxHistoryCharacters) {
    throw new JamalValidationError("History is too long.");
  }

  if (typeof candidate.pathname !== "string") {
    throw new JamalValidationError("Pathname is required.");
  }

  return {
    message,
    history: candidate.history.map((item) => ({
      role: item.role,
      content: item.content.trim(),
    })),
    pathname: candidate.pathname,
  };
}

export function trimJamalHistory(history: JamalHistoryMessage[]): JamalHistoryMessage[] {
  const retained: JamalHistoryMessage[] = [];
  let characterCount = 0;

  for (const message of history.slice(-JAMAL_LIMITS.maxHistoryMessages).reverse()) {
    if (characterCount + message.content.length > JAMAL_LIMITS.maxHistoryCharacters) break;
    retained.unshift(message);
    characterCount += message.content.length;
  }

  return retained;
}

