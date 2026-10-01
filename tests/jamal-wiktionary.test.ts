import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getJamalLinguisticStyle,
  jamalWiktionaryInternals,
} from "@/lib/jamal/wiktionary";
import { JAMAL_APPROVED_STYLE_TERMS } from "@/data/jamalStyle";

function categoryResponse(titles: string[], cmcontinue?: string): Response {
  return new Response(
    JSON.stringify({
      ...(cmcontinue ? { continue: { cmcontinue, continue: "-||" } } : {}),
      query: {
        categorymembers: titles.map((title, pageid) => ({ ns: 0, pageid, title })),
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("JAMAL Wiktionary style source", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("builds the bounded MediaWiki category request", () => {
    const url = new URL(jamalWiktionaryInternals.buildCategoryUrl("next-page"));

    expect(url.origin + url.pathname).toBe("https://en.wiktionary.org/w/api.php");
    expect(url.searchParams.get("action")).toBe("query");
    expect(url.searchParams.get("list")).toBe("categorymembers");
    expect(url.searchParams.get("cmtitle")).toBe(
      "Category:African-American Vernacular English",
    );
    expect(url.searchParams.get("cmnamespace")).toBe("0");
    expect(url.searchParams.get("cmtype")).toBe("page");
    expect(url.searchParams.get("cmlimit")).toBe("500");
    expect(url.searchParams.get("cmcontinue")).toBe("next-page");
  });

  it("follows pagination, deduplicates titles, and returns only approved terms", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(categoryResponse([" Aight ", "arbitrary", "BET"], "page-2"))
      .mockResolvedValueOnce(categoryResponse(["bet", "bruh", "cap"], "page-3"))
      .mockResolvedValueOnce(
        categoryResponse(["no cap", "finna", "ayo", "tryna", "yo", "unreviewed"]),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await getJamalLinguisticStyle();

    expect(result.sourceStatus).toBe("available");
    expect(
      result.terms
        .filter(({ source }) => source === "wiktionary-aae")
        .map(({ term }) => term),
    ).toEqual([
      "aight",
      "bet",
      "bruh",
      "cap",
      "no cap",
      "finna",
      "ayo",
      "tryna",
      "yo",
    ]);
    expect(result.terms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ term: "say less", source: "general-casual" }),
        expect.objectContaining({ term: "splendid", source: "jamal-signature" }),
      ]),
    );
    expect(result.terms.some(({ term }) => term === "unreviewed")).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    for (const [, init] of fetchMock.mock.calls) {
      expect(init).toMatchObject({
        cache: "force-cache",
        next: { revalidate: 86_400 },
        headers: {
          Accept: "application/json",
          "User-Agent": "JAMALPortfolio/1.0 (https://github.com/spncr1)",
        },
      });
    }
  });

  it("stops after three pages even when the API supplies another continuation", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() => Promise.resolve(categoryResponse(["bet"], "another-page")));
    vi.stubGlobal("fetch", fetchMock);

    await getJamalLinguisticStyle();

    expect(fetchMock).toHaveBeenCalledTimes(jamalWiktionaryInternals.constants.maxPages);
  });

  it.each([
    ["rate limiting", new Response("limited", { status: 429 })],
    ["provider failure", new Response("failed", { status: 500 })],
    ["malformed JSON", new Response("not-json", { status: 200 })],
    ["invalid response shape", new Response(JSON.stringify({ query: {} }), { status: 200 })],
  ])("fails open on %s", async (_label, response) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

    const result = await getJamalLinguisticStyle();

    expect(result.sourceStatus).toBe("unavailable");
    expect(result.terms.every(({ source }) => source !== "wiktionary-aae")).toBe(true);
    expect(result.terms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ term: "say less", source: "general-casual" }),
        expect.objectContaining({ term: "splendid", source: "jamal-signature" }),
      ]),
    );
  });

  it("fails open when the request times out", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("The operation was aborted.", "AbortError")),
          );
        }),
      ),
    );

    const resultPromise = getJamalLinguisticStyle();
    await vi.advanceTimersByTimeAsync(2_500);

    const result = await resultPromise;

    expect(result.sourceStatus).toBe("unavailable");
    expect(result.terms.every(({ source }) => source !== "wiktionary-aae")).toBe(true);
    expect(result.terms.some(({ term }) => term === "say less")).toBe(true);
  });

  it("keeps a duplicate-free reviewed registry across all three style sources", () => {
    const normalizedTerms = JAMAL_APPROVED_STYLE_TERMS.map(({ term }) =>
      term.trim().replace(/\s+/g, " ").toLocaleLowerCase("en"),
    );

    expect(JAMAL_APPROVED_STYLE_TERMS).toHaveLength(35);
    expect(new Set(normalizedTerms).size).toBe(normalizedTerms.length);
    expect(JAMAL_APPROVED_STYLE_TERMS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ term: "ayo", source: "wiktionary-aae" }),
        expect.objectContaining({ term: "nah", source: "general-casual" }),
        expect.objectContaining({ term: "we nipped that bud", source: "jamal-signature" }),
      ]),
    );
  });
});
