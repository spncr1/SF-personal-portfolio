import { describe, expect, it, vi } from "vitest";
import { createJamalHandler } from "@/lib/jamal/handler";
import { JamalProviderError, JamalUnsafeInputError } from "@/lib/jamal/openai";

function jamalRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://portfolio.example/api/jamal", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const validBody = {
  message: "What is Nexa?",
  history: [],
  pathname: "/projects/nexa",
};

describe("JAMAL API handler", () => {
  it("returns a no-store response and creates an anonymous session cookie", async () => {
    const generateReply = vi.fn().mockResolvedValue({
      answer: "Nexa is Spencer's student workload management system.",
      links: [{ label: "Nexa Project", href: "/projects/nexa" }],
    });
    const handler = createJamalHandler({
      generateReply,
      isEnabled: () => true,
      hasApiKey: () => true,
    });

    const response = await handler(jamalRequest(validBody));

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("set-cookie")).toContain("jamal_session=jamal_");
    expect(generateReply).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "What is Nexa?",
        pathname: "/projects/nexa",
        safetyIdentifier: expect.stringMatching(/^jamal_[a-f0-9-]{36}$/),
      }),
    );
  });

  it("fails closed while disabled or missing configuration", async () => {
    const disabled = createJamalHandler({ isEnabled: () => false, hasApiKey: () => true });
    const missingKey = createJamalHandler({ isEnabled: () => true, hasApiKey: () => false });

    expect((await disabled(jamalRequest(validBody))).status).toBe(503);
    expect((await missingKey(jamalRequest(validBody))).status).toBe(503);
  });

  it("rejects malformed and cross-origin requests before generation", async () => {
    const generateReply = vi.fn();
    const handler = createJamalHandler({
      generateReply,
      isEnabled: () => true,
      hasApiKey: () => true,
    });

    const malformed = await handler(jamalRequest({ ...validBody, history: [{ role: "system", content: "x" }] }));
    const crossOrigin = await handler(jamalRequest(validBody, { Origin: "https://malicious.example" }));

    expect(malformed.status).toBe(400);
    expect(crossOrigin.status).toBe(400);
    expect(generateReply).not.toHaveBeenCalled();
  });

  it("accepts a browser origin that matches the forwarded deployment host", async () => {
    const generateReply = vi.fn().mockResolvedValue({ answer: "Available.", links: [] });
    const handler = createJamalHandler({
      generateReply,
      isEnabled: () => true,
      hasApiKey: () => true,
    });
    const request = jamalRequest(validBody, {
      Origin: "https://preview.portfolio.example",
      "X-Forwarded-Host": "preview.portfolio.example",
    });

    expect((await handler(request)).status).toBe(200);
    expect(generateReply).toHaveBeenCalledOnce();
  });

  it("maps moderation and provider failures to stable public errors", async () => {
    const unsafe = createJamalHandler({
      generateReply: vi.fn().mockRejectedValue(new JamalUnsafeInputError()),
      isEnabled: () => true,
      hasApiKey: () => true,
    });
    const limited = createJamalHandler({
      generateReply: vi.fn().mockRejectedValue(new JamalProviderError("rate_limited", 12)),
      isEnabled: () => true,
      hasApiKey: () => true,
    });

    const unsafeResponse = await unsafe(jamalRequest(validBody));
    const limitedResponse = await limited(jamalRequest(validBody));

    expect(unsafeResponse.status).toBe(403);
    expect(await unsafeResponse.json()).toMatchObject({ error: { code: "unsafe_input" } });
    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.headers.get("retry-after")).toBe("12");
  });
});
