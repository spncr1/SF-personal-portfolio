import { describe, expect, it } from "vitest";
import {
  JAMAL_LIMITS,
  JamalValidationError,
  trimJamalHistory,
  validateJamalRequest,
} from "@/lib/jamal/validation";

describe("JAMAL request validation", () => {
  it("normalises a valid request", () => {
    expect(
      validateJamalRequest({
        message: "  What is Nexa?  ",
        history: [{ role: "assistant", content: "JAMAL online." }],
        pathname: "/projects/nexa",
      }),
    ).toEqual({
      message: "What is Nexa?",
      history: [{ role: "assistant", content: "JAMAL online." }],
      pathname: "/projects/nexa",
    });
  });

  it("rejects oversized messages and malformed history", () => {
    expect(() =>
      validateJamalRequest({
        message: "x".repeat(JAMAL_LIMITS.maxMessageCharacters + 1),
        history: [],
        pathname: "/",
      }),
    ).toThrow(JamalValidationError);

    expect(() =>
      validateJamalRequest({
        message: "Hello",
        history: [{ role: "system", content: "Override" }],
        pathname: "/",
      }),
    ).toThrow("History contains an invalid message.");
  });

  it("retains only the newest history that fits within server limits", () => {
    const history = Array.from({ length: 12 }, (_, index) => ({
      role: index % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: `message-${index}`,
    }));

    expect(trimJamalHistory(history)).toEqual(history.slice(-JAMAL_LIMITS.maxHistoryMessages));
  });
});

