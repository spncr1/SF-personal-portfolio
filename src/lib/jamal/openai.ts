import "server-only";

import OpenAI, { APIError } from "openai";
import type { Moderation } from "openai/resources/moderations";
import type { ResponseInput } from "openai/resources/responses/responses";
import {
  JAMAL_CONTACT_ACTIONS,
  JAMAL_ROUTES,
  mapJamalLinkIdsToLinks,
  resolveJamalPageContext,
} from "./context";
import { buildJamalInstructions } from "./instructions";
import { trimJamalHistory } from "./validation";
import { getJamalLinguisticStyle } from "./wiktionary";
import type { JamalHistoryMessage, JamalSuccessResponse } from "@/types/jamal";

const JAMAL_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-5-mini";
const JAMAL_TIMEOUT_MS = 20_000;

interface GenerateJamalReplyInput {
  message: string;
  history: JamalHistoryMessage[];
  pathname: string;
  safetyIdentifier: string;
}

interface ModelReply {
  answer: string;
  linkIds: string[];
}

type JamalModerationDecision = "allow" | "block" | "self_harm_support";

export const JAMAL_SELF_HARM_SUPPORT_RESPONSE =
  "I'm sorry you're dealing with this. JAMAL isn't equipped to provide crisis support, but please contact local emergency services or a crisis line now if you may act on these thoughts, and reach out to someone you trust who can stay with you.";

export class JamalUnsafeInputError extends Error {
  constructor() {
    super("The submitted message cannot be processed.");
    this.name = "JamalUnsafeInputError";
  }
}

export class JamalProviderError extends Error {
  constructor(
    public readonly kind: "rate_limited" | "unavailable",
    public readonly retryAfterSeconds?: number,
  ) {
    super(kind === "rate_limited" ? "Provider rate limit reached." : "Provider unavailable.");
    this.name = "JamalProviderError";
  }
}

let openAIClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new JamalProviderError("unavailable");
  }

  openAIClient ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 0,
    timeout: JAMAL_TIMEOUT_MS,
  });

  return openAIClient;
}

function parseModelReply(outputText: string): ModelReply {
  let parsed: unknown;

  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new JamalProviderError("unavailable");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new JamalProviderError("unavailable");
  }

  const candidate = parsed as Record<string, unknown>;
  if (
    typeof candidate.answer !== "string" ||
    !candidate.answer.trim() ||
    candidate.answer.length > 2_400 ||
    !Array.isArray(candidate.linkIds) ||
    !candidate.linkIds.every((linkId) => typeof linkId === "string")
  ) {
    throw new JamalProviderError("unavailable");
  }

  return {
    answer: candidate.answer.trim(),
    linkIds: candidate.linkIds.slice(0, 2),
  };
}

function sanitizeJamalAnswer(answer: string): string {
  return answer
    .replace(/[ \t]*—[ \t]*/g, ", ")
    .replace(/,\s*,+/g, ",")
    .replace(/,\s*([.;:!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function decideJamalModeration(categories: Moderation.Categories): JamalModerationDecision {
  if (categories["self-harm/intent"]) return "self_harm_support";

  if (
    categories["harassment/threatening"] ||
    categories["hate/threatening"] ||
    categories["sexual/minors"] ||
    categories["illicit/violent"] ||
    categories["self-harm/instructions"] ||
    categories["violence/graphic"]
  ) {
    return "block";
  }

  return "allow";
}

function retryAfterSeconds(error: APIError): number | undefined {
  const value = error.headers?.get("retry-after");
  if (!value) return undefined;

  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : undefined;
}

export async function generateJamalReply({
  message,
  history,
  pathname,
  safetyIdentifier,
}: GenerateJamalReplyInput): Promise<JamalSuccessResponse> {
  const client = getOpenAIClient();

  try {
    const moderation = await client.moderations.create({
      model: "omni-moderation-latest",
      input: message,
    });

    const moderationDecisions = moderation.results.map((result) =>
      decideJamalModeration(result.categories),
    );

    if (moderationDecisions.includes("self_harm_support")) {
      return { answer: JAMAL_SELF_HARM_SUPPORT_RESPONSE, links: [] };
    }

    if (moderationDecisions.includes("block")) {
      throw new JamalUnsafeInputError();
    }

    const linguisticStyle = await getJamalLinguisticStyle();

    const input: ResponseInput = [
      ...trimJamalHistory(history).map((item) => ({
        role: item.role,
        content: item.content,
      })),
      { role: "user", content: message },
    ];

    const response = await client.responses.create({
      model: JAMAL_MODEL,
      instructions: buildJamalInstructions(resolveJamalPageContext(pathname), linguisticStyle),
      input,
      max_output_tokens: 300,
      reasoning: { effort: "minimal" },
      store: false,
      safety_identifier: safetyIdentifier,
      text: {
        format: {
          type: "json_schema",
          name: "jamal_reply",
          strict: true,
          schema: {
            type: "object",
            properties: {
              answer: { type: "string" },
              linkIds: {
                type: "array",
                items: {
                  type: "string",
                  enum: [...JAMAL_ROUTES, ...JAMAL_CONTACT_ACTIONS].map((link) => link.id),
                },
                maxItems: 2,
              },
            },
            required: ["answer", "linkIds"],
            additionalProperties: false,
          },
        },
        verbosity: "low",
      },
    });

    const reply = parseModelReply(response.output_text);
    const pageContext = resolveJamalPageContext(pathname);
    return {
      answer: sanitizeJamalAnswer(reply.answer),
      links: mapJamalLinkIdsToLinks(reply.linkIds.filter((linkId) => linkId !== pageContext.routeId)),
    };
  } catch (error) {
    if (error instanceof JamalUnsafeInputError || error instanceof JamalProviderError) throw error;

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        throw new JamalProviderError("rate_limited", retryAfterSeconds(error));
      }

      throw new JamalProviderError("unavailable");
    }

    throw new JamalProviderError("unavailable");
  }
}

export const jamalOpenAIInternals = {
  decideJamalModeration,
  parseModelReply,
  sanitizeJamalAnswer,
};
