import "server-only";

import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { JamalErrorCode, JamalErrorResponse, JamalSuccessResponse } from "@/types/jamal";
import { generateJamalReply, JamalProviderError, JamalUnsafeInputError } from "./openai";
import { JAMAL_LIMITS, JamalValidationError, validateJamalRequest } from "./validation";

const SESSION_COOKIE = "jamal_session";

interface JamalGeneratorInput {
  message: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  pathname: string;
  safetyIdentifier: string;
}

type JamalGenerator = (input: JamalGeneratorInput) => Promise<JamalSuccessResponse>;

interface JamalHandlerDependencies {
  generateReply?: JamalGenerator;
  isEnabled?: () => boolean;
  hasApiKey?: () => boolean;
}

function errorResponse(
  status: number,
  code: JamalErrorCode,
  message: string,
  retryAfterSeconds?: number,
): NextResponse<JamalErrorResponse> {
  const response = NextResponse.json<JamalErrorResponse>(
    {
      error: {
        code,
        message,
        ...(retryAfterSeconds ? { retryAfterSeconds } : {}),
      },
    },
    { status },
  );

  response.headers.set("Cache-Control", "no-store");
  if (retryAfterSeconds) response.headers.set("Retry-After", String(retryAfterSeconds));
  return response;
}

function readCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  for (const item of cookieHeader.split(";")) {
    const [key, ...valueParts] = item.trim().split("=");
    if (key === name) return decodeURIComponent(valueParts.join("="));
  }

  return undefined;
}

function validSessionId(value: string | undefined): value is string {
  return Boolean(value && /^jamal_[a-f0-9-]{36}$/.test(value));
}

function setSessionCookie(response: NextResponse, sessionId: string): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 86_400,
  });
}

function isCrossOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originHost = new URL(origin).host;
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",", 1)[0]?.trim();
    const requestHosts = new Set(
      [forwardedHost, request.headers.get("host"), new URL(request.url).host].filter(
        (host): host is string => Boolean(host),
      ),
    );

    return !requestHosts.has(originHost);
  } catch {
    return true;
  }
}

export function createJamalHandler({
  generateReply = generateJamalReply,
  isEnabled = () => process.env.JAMAL_ENABLED === "true",
  hasApiKey = () => Boolean(process.env.OPENAI_API_KEY),
}: JamalHandlerDependencies = {}) {
  return async function POST(request: Request): Promise<NextResponse> {
    if (!isEnabled()) {
      return errorResponse(503, "disabled", "JAMAL is not available yet.");
    }

    if (!hasApiKey()) {
      return errorResponse(503, "unavailable", "JAMAL is temporarily unavailable.");
    }

    if (isCrossOrigin(request)) {
      return errorResponse(400, "invalid_request", "Request origin is not allowed.");
    }

    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return errorResponse(400, "invalid_request", "Content-Type must be application/json.");
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (Number.isFinite(contentLength) && contentLength > JAMAL_LIMITS.maxBodyBytes) {
      return errorResponse(400, "invalid_request", "Request body is too large.");
    }

    let payload: unknown;
    try {
      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > JAMAL_LIMITS.maxBodyBytes) {
        return errorResponse(400, "invalid_request", "Request body is too large.");
      }
      payload = JSON.parse(rawBody);
    } catch {
      return errorResponse(400, "invalid_request", "Request body must be valid JSON.");
    }

    try {
      const validated = validateJamalRequest(payload);
      const existingSessionId = readCookie(request, SESSION_COOKIE);
      const sessionId = validSessionId(existingSessionId) ? existingSessionId : `jamal_${randomUUID()}`;
      const result = await generateReply({ ...validated, safetyIdentifier: sessionId });
      const response = NextResponse.json(result);
      response.headers.set("Cache-Control", "no-store");

      if (!validSessionId(existingSessionId)) setSessionCookie(response, sessionId);
      return response;
    } catch (error) {
      if (error instanceof JamalValidationError) {
        return errorResponse(400, "invalid_request", error.message);
      }

      if (error instanceof JamalUnsafeInputError) {
        return errorResponse(403, "unsafe_input", "That message cannot be processed by JAMAL.");
      }

      if (error instanceof JamalProviderError && error.kind === "rate_limited") {
        return errorResponse(
          429,
          "rate_limited",
          "JAMAL is receiving too many requests. Try again shortly.",
          error.retryAfterSeconds ?? 30,
        );
      }

      return errorResponse(503, "unavailable", "JAMAL is temporarily unavailable.");
    }
  };
}
