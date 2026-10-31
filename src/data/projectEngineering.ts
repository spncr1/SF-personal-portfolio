import type { ProjectEngineering } from "@/types/project";

export const projectEngineering = {
  nexa: {
    objective: {
      problem:
        "Academic work is typically split across separate task, calendar, assignment and study tools, making deadlines and workloads harder to bring together as one, unified plan.",
      opportunity:
        "Bring assignments, scheduled tasks and study sessions into one consistent personal workspace, giving students a unified view of their academic workload.",
      goal:
        "Deliver a focused academic planning system that keeps each student's records separate while supporting assignments, task planning, study progress and optional reminders across desktop and mobile.",
    },
    decisions: [
      {
        id: "academic-scope",
        label: "Product scope",
        choice: "Academic planning only",
        icon: "school",
        context:
          "Nexa's second-generation codebase contained broader lifestyle modules alongside its academic tools. That breadth weakened the product's stated purpose.",
        alternatives: [
          { label: "Dedicated academic workflow", status: "selected" },
          { label: "Retain the broader lifestyle suite", status: "replaced" },
        ],
        reasoning:
          "The July 2026 refactor removed finance, habits, job-application and other unrelated modules so the dashboard, assignments, tasks and study planner could operate as one coherent student workflow.",
        tradeoffs: [
          { effect: "benefit", text: "Clearer product boundary and navigation." },
          { effect: "benefit", text: "Development effort stays focused on academic workflows." },
          { effect: "cost", text: "Previously implemented non-academic breadth was removed." },
        ],
        outcome:
          "The current application exposes a focused dashboard plus tasks, assignments and study-planning routes.",
      },
      {
        id: "structured-persistence",
        label: "Data model",
        choice: "Structured per-user records",
        icon: "database",
        context:
          "Academic data had been handled through a generic application-state model that did not express the rules of assignments, tasks, subjects and study sessions directly.",
        alternatives: [
          { label: "Feature-specific relational records", status: "selected" },
          { label: "Generic application-state storage", status: "replaced" },
        ],
        reasoning:
          "The backend was reorganised around validated feature routes, repositories and versioned database migrations, with every operation scoped to the authenticated user.",
        tradeoffs: [
          { effect: "benefit", text: "Validation and ownership rules are explicit per feature." },
          { effect: "benefit", text: "Individual records can be queried and updated predictably." },
          { effect: "cost", text: "Schema changes and legacy-data migration require more care." },
        ],
        outcome:
          "Assignments, tasks, subjects, study sessions, profiles and preferences now use dedicated persisted records.",
      },
      {
        id: "confirmation-gate",
        label: "Account verification",
        choice: "Confirmation-gated creation",
        icon: "mail",
        context:
          "The earlier verification route could complete account creation when a verification link was opened, before the user deliberately confirmed the action.",
        alternatives: [
          { label: "Explicit confirmation before creation", status: "selected" },
          { label: "Create account on link visit", status: "replaced" },
        ],
        reasoning:
          "The verification flow was split into a read-only page load and a separate confirmation request. Pending registrations are checked for validity before the user record is created.",
        tradeoffs: [
          { effect: "benefit", text: "Account creation now requires an intentional action." },
          { effect: "benefit", text: "Expired and previously used links receive explicit states." },
          { effect: "cost", text: "Registration includes one additional confirmation step." },
        ],
        outcome:
          "The repository records the previous registration defect as resolved by the confirmation-gated flow.",
      },
    ],
    challenges: [
      {
        id: "registration-lifecycle",
        label: "Registration lifecycle",
        icon: "mail",
        constraint:
          "An emailed verification link had to prove address ownership without creating an account merely because the link was opened.",
        investigation:
          "The verification route and pending-registration lifecycle were separated to identify where user creation occurred and how expired or reused tokens were handled.",
        solution:
          "Page loading now inspects the pending registration only. A separate confirmation request validates the hashed token and creates the user transactionally.",
        outcome:
          "Account creation requires confirmation, and invalid, expired and already-used links have defined responses.",
      },
      {
        id: "legacy-data-transition",
        label: "Legacy data transition",
        icon: "database",
        constraint:
          "The backend needed structured academic tables without silently discarding state written by the earlier generic storage model.",
        investigation:
          "The migration work catalogued legacy keys for tasks, assignments, subjects, study sessions, goals, profile data and preferences, then defined validation for each shape.",
        solution:
          "Versioned migrations, import snapshots, stable source hashes and transactional replacement move recognised state into feature-specific records once per user.",
        outcome:
          "The current code can preserve recognised legacy state while using the structured repositories for subsequent reads and writes.",
      },
      {
        id: "deployed-session-state",
        label: "Deployed session state",
        icon: "vercel",
        constraint:
          "Authenticated sessions and server-rendered views had to survive the application's deployed runtime rather than depend on process-local state or development paths.",
        investigation:
          "Repository history isolated PostgreSQL session handling and the deployed EJS view location as separate causes of login and rendering failures.",
        solution:
          "Sessions are persisted in PostgreSQL and the Express view root is resolved explicitly from the application directory.",
        outcome:
          "The current server uses persistent session storage and a deployment-safe EJS view path.",
      },
    ],
  },
  "atmos-fc": {
    objective: {
      problem:
        "Match facts, highlight videos and thousands of fan comments were scattered across different sources, making the emotional story of a finished match difficult to assess quickly.",
      opportunity:
        "Combine finished-match context and the strongest first-day fan reaction into one readable post-match view instead of making supporters assemble the story themselves.",
      goal:
        "Deliver a resilient, searchable post-match analysis system that reuses stored results during upstream outages and publishes only validated, complete records.",
    },
    decisions: [
      {
        id: "reaction-source",
        label: "Reaction source",
        choice: "Match-video comments",
        icon: "description",
        context:
          "The original reaction collector used a forum-oriented source before the project shifted to comments attached directly to football highlight videos.",
        alternatives: [
          { label: "YouTube highlight comments", status: "selected" },
          { label: "Reddit discussion via PRAW", status: "replaced" },
        ],
        reasoning:
          "The May 2026 refactor aligned reaction collection with videos matched to the selected fixture and retained direct source links for surfaced comments.",
        tradeoffs: [
          { effect: "benefit", text: "Reaction is tied to videos for the selected match." },
          { effect: "benefit", text: "Surfaced comments can link back to their source video." },
          { effect: "cost", text: "Analysis depends on video discovery, quota and comment availability." },
        ],
        outcome:
          "The live pipeline now aggregates top-level comments from available match videos and exposes an explicit unavailable state when it cannot do so.",
      },
      {
        id: "local-first-search",
        label: "Match discovery",
        choice: "Local-first with refresh fallback",
        icon: "database",
        context:
          "Searching through an upstream football source on every request made fixture discovery vulnerable to configuration, rate-limit and availability failures.",
        alternatives: [
          { label: "Search stored fixtures first", status: "selected" },
          { label: "Require a live upstream lookup", status: "replaced" },
          { label: "Refresh only when local scope is empty", status: "retained" },
        ],
        reasoning:
          "The search service now queries persisted fixtures first and attempts a scoped refresh only when the requested archive is not already available.",
        tradeoffs: [
          { effect: "benefit", text: "Existing match search remains available during outages." },
          { effect: "benefit", text: "External requests are limited to missing scopes." },
          { effect: "cost", text: "Stored results can temporarily lag a live source." },
        ],
        outcome:
          "Provider failures now produce a freshness notice while already stored matches remain searchable.",
      },
      {
        id: "hybrid-delivery",
        label: "Public delivery",
        choice: "Showcase by default, live by choice",
        icon: "vercel",
        context:
          "A live-backend-only portfolio would make the public experience depend on every database, service and external data source being available at request time.",
        alternatives: [
          { label: "Validated static showcase", status: "selected" },
          { label: "Live backend for every visitor", status: "replaced" },
          { label: "Explicit live mode", status: "retained" },
        ],
        reasoning:
          "The public site reads versioned static records by default, while the complete FastAPI analysis path remains available when live mode is deliberately enabled.",
        tradeoffs: [
          { effect: "benefit", text: "The public portfolio survives backend and provider outages." },
          { effect: "benefit", text: "Published analyses are stable and reviewable." },
          { effect: "cost", text: "Static results require a refresh and publication pipeline." },
        ],
        outcome:
          "Search, profiles and exported analyses can operate without contacting the live backend at runtime.",
      },
      {
        id: "validation-gate",
        label: "Data publication",
        choice: "Validate before publish",
        icon: "git",
        context:
          "Generated match packs join fixtures, profiles and analyses; a partial or inconsistent pack could expose broken analysis links or overwrite valid coverage.",
        alternatives: [
          { label: "Validate, then publish atomically", status: "selected" },
          { label: "Deploy generated output immediately", status: "replaced" },
        ],
        reasoning:
          "The refresh checks schemas, counts, checksums, analysis versions, timeline completeness and prohibited fields before updating the data branch or deployment.",
        tradeoffs: [
          { effect: "benefit", text: "Invalid or incomplete packs are blocked before release." },
          { effect: "benefit", text: "Previous valid competition data survives partial failures." },
          { effect: "cost", text: "Publication requires additional automation and validation time." },
        ],
        outcome:
          "The deployment workflow publishes only after validation succeeds and retains the last valid pack as its baseline.",
      },
    ],
    challenges: [
      {
        id: "upstream-outages",
        label: "Upstream outages",
        icon: "api",
        constraint:
          "Users still needed access to previously stored matches when a football-data refresh could not complete.",
        investigation:
          "The search path was traced from team resolution through archive refresh and local fixture queries, with failure cases reproduced in focused fallback tests.",
        solution:
          "Search now queries local records first, catches refresh failures and returns a freshness notice instead of failing the request.",
        outcome:
          "Stored fixture search continues during upstream failures, although newly completed matches may appear later.",
      },
      {
        id: "event-hydration",
        label: "Event timeline hydration",
        icon: "code",
        constraint:
          "A stored finished fixture could reach analysis without the event timeline required for a complete public match record.",
        investigation:
          "The analysis path distinguished complete, missing, unavailable and failed event states and added focused coverage for on-demand hydration.",
        solution:
          "Analysis reuses stored events when present, fetches missing events on demand and records an explicit failure or unavailable state when hydration cannot complete.",
        outcome:
          "The interface can distinguish an unfetched timeline from a genuinely unavailable one, and public exports reject incomplete analysis records.",
      },
      {
        id: "fixture-identity",
        label: "Cross-source fixture identity",
        icon: "database",
        constraint:
          "The same fixture could arrive with different team spellings, identifiers or timestamp precision, creating duplicate current results.",
        investigation:
          "Initial identifier-only matching produced no reliable cross-source deduplication, so team names and kickoff times were compared across stored and refreshed records.",
        solution:
          "The refresh normalises provider names to canonical team keys and matches competition, season, UTC-minute kickoff, home team and away team together.",
        outcome:
          "Equivalent fixtures can merge without depending on source-specific match identifiers.",
      },
      {
        id: "publication-integrity",
        label: "Publication integrity",
        icon: "git",
        constraint:
          "A generated archive could contain stale analysis links, mismatched fixture keys, incomplete timelines or fields that should never become public.",
        investigation:
          "Validation was expanded across the manifest, typed records, analysis-to-fixture links, timeline completeness, integrity checksums and generated-file scanning.",
        solution:
          "The workflow blocks publication unless the archive and current pack pass every offline validation check.",
        outcome:
          "Broken generated data stops before the data branch or production deployment is updated.",
      },
    ],
  },
} as const satisfies Record<"nexa" | "atmos-fc", ProjectEngineering>;

export function validateProjectEngineering(
  engineering: ProjectEngineering,
): string[] {
  const errors: string[] = [];
  const hasText = (value: string) => value.trim().length > 0;

  if (!hasText(engineering.objective.problem)) errors.push("Objective problem is required.");
  if (!hasText(engineering.objective.opportunity)) errors.push("Objective opportunity is required.");
  if (!hasText(engineering.objective.goal)) errors.push("Objective goal is required.");

  const decisionIds = new Set<string>();
  engineering.decisions.forEach((decision) => {
    if (!hasText(decision.id) || decisionIds.has(decision.id)) {
      errors.push(`Decision id must be present and unique: ${decision.id || "missing"}.`);
    }
    decisionIds.add(decision.id);
    if (!decision.alternatives.some((alternative) => alternative.status === "selected")) {
      errors.push(`Decision ${decision.id} must identify its selected option.`);
    }
    if ([decision.label, decision.choice, decision.context, decision.reasoning, decision.outcome]
      .some((value) => !hasText(value))) {
      errors.push(`Decision ${decision.id} contains empty content.`);
    }
  });

  const challengeIds = new Set<string>();
  engineering.challenges.forEach((challenge) => {
    if (!hasText(challenge.id) || challengeIds.has(challenge.id)) {
      errors.push(`Challenge id must be present and unique: ${challenge.id || "missing"}.`);
    }
    challengeIds.add(challenge.id);
    if ([challenge.label, challenge.constraint, challenge.investigation, challenge.solution, challenge.outcome]
      .some((value) => !hasText(value))) {
      errors.push(`Challenge ${challenge.id} contains empty content.`);
    }
  });

  return errors;
}
