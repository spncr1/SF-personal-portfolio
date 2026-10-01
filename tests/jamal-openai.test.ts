import type { Moderation } from "openai/resources/moderations";
import { describe, expect, it } from "vitest";
import {
  JAMAL_SELF_HARM_SUPPORT_RESPONSE,
  JamalProviderError,
  jamalOpenAIInternals,
} from "@/lib/jamal/openai";

function moderationCategories(
  overrides: Partial<Moderation.Categories> = {},
): Moderation.Categories {
  return {
    harassment: false,
    "harassment/threatening": false,
    hate: false,
    "hate/threatening": false,
    illicit: false,
    "illicit/violent": false,
    "self-harm": false,
    "self-harm/instructions": false,
    "self-harm/intent": false,
    sexual: false,
    "sexual/minors": false,
    violence: false,
    "violence/graphic": false,
    ...overrides,
  };
}

describe("JAMAL model output validation", () => {
  it("accepts the bounded structured response", () => {
    expect(
      jamalOpenAIInternals.parseModelReply(
        JSON.stringify({ answer: "Nexa is a student workload system.", linkIds: ["project-nexa"] }),
      ),
    ).toEqual({
      answer: "Nexa is a student workload system.",
      linkIds: ["project-nexa"],
    });
  });

  it("rejects invalid or oversized model output", () => {
    expect(() => jamalOpenAIInternals.parseModelReply("not json")).toThrow(JamalProviderError);
    expect(() =>
      jamalOpenAIInternals.parseModelReply(JSON.stringify({ answer: "x".repeat(2_401), linkIds: [] })),
    ).toThrow(JamalProviderError);
  });

  it("removes em dashes without changing hyphens or en dashes", () => {
    expect(jamalOpenAIInternals.sanitizeJamalAnswer("Nexa — for real — is focused."))
      .toBe("Nexa, for real, is focused.");
    expect(jamalOpenAIInternals.sanitizeJamalAnswer("One—two—three."))
      .toBe("One, two, three.");
    expect(jamalOpenAIInternals.sanitizeJamalAnswer("That works—. Next point."))
      .toBe("That works. Next point.");
    expect(jamalOpenAIInternals.sanitizeJamalAnswer("full-stack and 2025–2026"))
      .toBe("full-stack and 2025–2026");
  });

  it("guarantees that sanitized model answers contain no em dash", () => {
    const parsed = jamalOpenAIInternals.parseModelReply(
      JSON.stringify({ answer: "First — second—and third", linkIds: [] }),
    );

    expect(jamalOpenAIInternals.sanitizeJamalAnswer(parsed.answer)).not.toContain("—");
  });

  it.each([
    ["casual profanity or harassment", { harassment: true }],
    ["non-threatening hate classification", { hate: true }],
    ["non-graphic violence discussion", { violence: true }],
    ["non-violent illicit discussion", { illicit: true }],
    ["adult sexual content", { sexual: true }],
  ])("allows %s so JAMAL can focus on a harmless task", (_label, categories) => {
    expect(
      jamalOpenAIInternals.decideJamalModeration(moderationCategories(categories)),
    ).toBe("allow");
  });

  it.each([
    ["direct threats", { "harassment/threatening": true }],
    ["threatening hate", { "hate/threatening": true }],
    ["sexual content involving minors", { "sexual/minors": true }],
    ["violent wrongdoing instructions", { "illicit/violent": true }],
    ["self-harm instructions", { "self-harm/instructions": true }],
    ["graphic violence", { "violence/graphic": true }],
  ])("blocks %s", (_label, categories) => {
    expect(
      jamalOpenAIInternals.decideJamalModeration(moderationCategories(categories)),
    ).toBe("block");
  });

  it("routes self-harm intent to a dedicated supportive response", () => {
    expect(
      jamalOpenAIInternals.decideJamalModeration(
        moderationCategories({
          "self-harm/intent": true,
          "self-harm/instructions": true,
        }),
      ),
    ).toBe("self_harm_support");
    expect(JAMAL_SELF_HARM_SUPPORT_RESPONSE).toContain("contact local emergency services");
  });
});
