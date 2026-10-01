import "server-only";

import {
  JAMAL_APPROVED_STYLE_TERMS,
  getLocallyApprovedJamalStyleTerms,
  selectApprovedJamalStyleTerms,
  type JamalApprovedStyleTerm,
} from "@/data/jamalStyle";

const WIKTIONARY_API_URL = "https://en.wiktionary.org/w/api.php";
const WIKTIONARY_CATEGORY = "Category:African-American Vernacular English";
const WIKTIONARY_USER_AGENT = "JAMALPortfolio/1.0 (https://github.com/spncr1)";
const WIKTIONARY_REVALIDATE_SECONDS = 86_400;
const WIKTIONARY_TIMEOUT_MS = 2_500;
const WIKTIONARY_MAX_PAGES = 3;

interface WiktionaryCategoryMember {
  title: string;
}

interface WiktionaryCategoryResponse {
  continue?: {
    cmcontinue?: string;
  };
  query: {
    categorymembers: WiktionaryCategoryMember[];
  };
}

export interface JamalLinguisticStyle {
  sourceStatus: "available" | "unavailable";
  terms: JamalApprovedStyleTerm[];
}

function normalizeTerm(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en");
}

function unavailableStyle(): JamalLinguisticStyle {
  return {
    sourceStatus: "unavailable",
    terms: getLocallyApprovedJamalStyleTerms(),
  };
}

function parseCategoryResponse(value: unknown): WiktionaryCategoryResponse | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const candidate = value as Record<string, unknown>;
  if (!candidate.query || typeof candidate.query !== "object" || Array.isArray(candidate.query)) {
    return null;
  }

  const query = candidate.query as Record<string, unknown>;
  if (!Array.isArray(query.categorymembers)) return null;

  const categorymembers: WiktionaryCategoryMember[] = [];
  for (const member of query.categorymembers) {
    if (!member || typeof member !== "object" || Array.isArray(member)) return null;
    const title = (member as Record<string, unknown>).title;
    if (typeof title !== "string" || !title.trim()) return null;
    categorymembers.push({ title });
  }

  let continuation: WiktionaryCategoryResponse["continue"];
  if (candidate.continue !== undefined) {
    if (!candidate.continue || typeof candidate.continue !== "object" || Array.isArray(candidate.continue)) {
      return null;
    }

    const cmcontinue = (candidate.continue as Record<string, unknown>).cmcontinue;
    if (typeof cmcontinue !== "string" || !cmcontinue) return null;
    continuation = { cmcontinue };
  }

  return {
    query: { categorymembers },
    ...(continuation ? { continue: continuation } : {}),
  };
}

function buildCategoryUrl(cmcontinue?: string): string {
  const url = new URL(WIKTIONARY_API_URL);
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "categorymembers");
  url.searchParams.set("cmtitle", WIKTIONARY_CATEGORY);
  url.searchParams.set("cmnamespace", "0");
  url.searchParams.set("cmtype", "page");
  url.searchParams.set("cmlimit", "500");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  if (cmcontinue) url.searchParams.set("cmcontinue", cmcontinue);
  return url.toString();
}

export async function getJamalLinguisticStyle(): Promise<JamalLinguisticStyle> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WIKTIONARY_TIMEOUT_MS);

  try {
    const availableTerms = new Set<string>();
    let continuation: string | undefined;

    for (let page = 0; page < WIKTIONARY_MAX_PAGES; page += 1) {
      const response = await fetch(buildCategoryUrl(continuation), {
        headers: {
          Accept: "application/json",
          "User-Agent": WIKTIONARY_USER_AGENT,
        },
        cache: "force-cache",
        next: { revalidate: WIKTIONARY_REVALIDATE_SECONDS },
        signal: controller.signal,
      });

      if (!response.ok) return unavailableStyle();

      const parsed = parseCategoryResponse(await response.json());
      if (!parsed) return unavailableStyle();

      for (const member of parsed.query.categorymembers) {
        availableTerms.add(normalizeTerm(member.title));
      }

      continuation = parsed.continue?.cmcontinue;
      if (!continuation) break;
    }

    const verifiedWiktionaryTerms = new Set(
      selectApprovedJamalStyleTerms([...availableTerms])
        .filter(({ source }) => source === "wiktionary-aae")
        .map(({ term }) => normalizeTerm(term)),
    );

    return {
      sourceStatus: "available",
      terms: JAMAL_APPROVED_STYLE_TERMS.filter(
        ({ source, term }) =>
          source !== "wiktionary-aae" || verifiedWiktionaryTerms.has(normalizeTerm(term)),
      ),
    };
  } catch {
    return unavailableStyle();
  } finally {
    clearTimeout(timeout);
  }
}

export const jamalWiktionaryInternals = {
  buildCategoryUrl,
  normalizeTerm,
  parseCategoryResponse,
  constants: {
    maxPages: WIKTIONARY_MAX_PAGES,
    revalidateSeconds: WIKTIONARY_REVALIDATE_SECONDS,
    userAgent: WIKTIONARY_USER_AGENT,
  },
};
