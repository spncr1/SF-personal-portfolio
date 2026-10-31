import type { ProjectDevelopmentProcess } from "@/types/project";

export const projectDevelopment = {
  nexa: {
    summary:
      "How Nexa progressed from a small browser prototype into a focused, persistent academic planning application.",
    milestones: [
      {
        id: "initial-prototype",
        title: "Initial prototype",
        period: "January–February 2026",
        objective:
          "Establish a working browser prototype around daily tasks and assignment planning, then identify the core interactions that still needed development.",
        keyDevelopment: [
          "Created the initial HTML, CSS and JavaScript application structure.",
          "Added date-aware dashboard behaviour and daily task creation.",
          "Iterated on task display, sorting, settings and dark-mode foundations.",
          "Introduced the first assignments and tasks page structures.",
        ],
        outcome:
          "A functional prototype that demonstrated the central planning concept and exposed the gaps required for a connected academic workflow.",
        keyChanges: [
          "Static interface expanded into interactive dashboard behaviour.",
          "Task handling progressed through several incomplete states before stabilising.",
          "Assignments and settings moved from placeholders toward working flows.",
        ],
        nextSteps: [
          "Complete the assignment workflow.",
          "Connect tasks and assignments back into the dashboard.",
          "Prepare a coherent first application milestone.",
        ],
        evidence: [
          { source: "commit", reference: "fc70954" },
          { source: "commit", reference: "83b2a48" },
          { source: "commit", reference: "676156c" },
        ],
      },
      {
        id: "academic-workflow",
        title: "Academic workflow",
        period: "March 2026",
        objective:
          "Turn the prototype into a connected academic workflow spanning the dashboard, tasks, assignments and calendar views.",
        keyDevelopment: [
          "Connected assignment records to the dashboard and calendar.",
          "Completed the dedicated tasks planner and shared application data flow.",
          "Refined assignment widgets, dark mode and cross-page behaviour.",
          "Prepared the application structure and media for deployment.",
        ],
        outcome:
          "The first coherent browser application, with its principal academic-planning views working together rather than as isolated prototypes.",
        keyChanges: [
          "Dashboard summaries began reflecting assignment and task data.",
          "Task planning gained complete week and month interactions.",
          "Interface behaviour was polished into a usable product checkpoint.",
        ],
        nextSteps: [
          "Improve responsiveness and deployment reliability.",
          "Introduce user accounts and persistent storage.",
        ],
        evidence: [
          { source: "commit", reference: "5bd0a21" },
          { source: "commit", reference: "35f017b" },
          { source: "documentation", reference: "CHANGELOG.md: March 2026 milestone" },
        ],
      },
      {
        id: "accounts-persistence",
        title: "Accounts and persistence",
        period: "April–May 2026",
        objective:
          "Move from browser-held planning data to authenticated accounts with persistent server-side storage and a deployable server-rendered structure.",
        keyDevelopment: [
          "Introduced account registration and login flows.",
          "Connected user accounts and application data to PostgreSQL.",
          "Added persistent server-side sessions.",
          "Restructured the application around Express, EJS and Vercel routing.",
        ],
        outcome:
          "Nexa became a multi-user full-stack application with persistent accounts, while deployment failures revealed the need for safer runtime paths and session handling.",
        keyChanges: [
          "Static pages moved into server-rendered EJS views.",
          "Authentication became database-backed rather than purely local.",
          "Session storage and deployed view resolution were corrected.",
        ],
        nextSteps: [
          "Unify the interface and shared controls.",
          "Strengthen account validation and recovery flows.",
          "Begin the planned second-generation product pass.",
        ],
        evidence: [
          { source: "commit", reference: "a9ab0ed" },
          { source: "commit", reference: "0855669" },
          { source: "commit", reference: "5f65a2c" },
          { source: "commit", reference: "66e0729" },
        ],
      },
      {
        id: "feature-expansion-pivot",
        title: "Feature expansion and pivot",
        period: "June–July 2026",
        objective:
          "Execute the V2 interface and feature roadmap, then consolidate the product around the academic workflows that best supported Nexa's purpose.",
        keyDevelopment: [
          "Centralised colour tokens, shared controls, settings and navigation.",
          "Completed the Study Planner and expanded responsive behaviour.",
          "Reworked persistence into feature-specific records and migrations.",
          "Removed broader lifestyle modules after experimenting beyond the academic scope.",
        ],
        outcome:
          "A more coherent academic product with a shared design system, structured per-user data and a complete study-planning workflow.",
        keyChanges: [
          "A planned V2 feature branch was merged into the main application.",
          "Generic application-state storage was replaced by structured repositories.",
          "The wider lifestyle-suite direction was narrowed to academic planning.",
        ],
        nextSteps: [
          "Harden account creation and profile workflows.",
          "Improve the public entry experience.",
          "Continue mobile and responsive refinement.",
        ],
        evidence: [
          { source: "commit", reference: "95ce17c" },
          { source: "commit", reference: "b134b04" },
          { source: "commit", reference: "3fc3aab" },
          { source: "commit", reference: "1c1df92" },
        ],
      },
      {
        id: "account-ui-hardening",
        title: "Account and UI hardening",
        period: "August–September 2026",
        objective:
          "Resolve remaining account-lifecycle and interface defects while improving the entry experience across desktop and mobile.",
        keyDevelopment: [
          "Corrected profile saving, avatar uploads and profile settings.",
          "Changed email verification to require explicit account confirmation.",
          "Added the public welcome page and connected authentication entry points.",
          "Improved welcome-page responsiveness and assignment-page overflow.",
        ],
        outcome:
          "More reliable account creation and profile management, supported by a clearer public entry flow and stronger mobile behaviour.",
        keyChanges: [
          "Account creation no longer completed merely by opening a verification link.",
          "Welcome, login and registration became a connected journey.",
          "Targeted responsive defects were removed from key pages.",
        ],
        nextSteps: [
          "Document the current product baseline.",
          "Introduce formal project versioning and milestone history.",
        ],
        evidence: [
          { source: "commit", reference: "009aa96" },
          { source: "commit", reference: "52187db" },
          { source: "commit", reference: "19ae55e" },
          { source: "commit", reference: "897e67b" },
        ],
      },
      {
        id: "formal-version-baseline",
        title: "Formal version baseline",
        period: "October 2026",
        objective:
          "Establish a documented version baseline that accurately described the current MVP without presenting earlier milestones as formal releases.",
        keyDevelopment: [
          "Added the authoritative project VERSION file.",
          "Introduced an evidence-backed changelog and refreshed README.",
          "Recorded the current application as the Nexa 2.1.1 MVP baseline.",
        ],
        outcome:
          "Nexa gained a clear, traceable product baseline and historical milestone record for future changes.",
        keyChanges: [
          "Project-level semantic versioning was established.",
          "Historical development phases were documented without inventing releases.",
          "Current product scope and operation were consolidated in repository documentation.",
        ],
        evidence: [
          { source: "commit", reference: "180132f" },
          { source: "documentation", reference: "CHANGELOG.md: 2.1.1 baseline" },
        ],
      },
    ],
  },
  "atmos-fc": {
    summary:
      "How Atmos FC evolved from an experimental match-reaction service into a resilient, validated football analysis showcase.",
    milestones: [
      {
        id: "foundation-source-pivot",
        title: "Foundation and source pivot",
        period: "May 2026",
        objective:
          "Establish the end-to-end football sentiment concept and identify a reaction source that could be tied directly to selected matches.",
        keyDevelopment: [
          "Created the FastAPI, frontend and VADER sentiment-analysis foundation.",
          "Started with Reddit discussion as the reaction source.",
          "Replaced Reddit collection with YouTube highlight-video comments.",
          "Developed initial fixture loading, search and visual identity.",
        ],
        outcome:
          "A working foundation centred on match-specific highlight comments, with the principal data and interface flows ready for full MVP development.",
        keyChanges: [
          "PRAW and Reddit-specific services were removed.",
          "YouTube video discovery and comment collection were introduced.",
          "The first colour palette and match-search presentation were established.",
        ],
        nextSteps: [
          "Complete the match-analysis experience.",
          "Refine fixture search and unavailable states.",
          "Prepare the first deployable MVP.",
        ],
        evidence: [
          { source: "commit", reference: "3a85c41" },
          { source: "commit", reference: "0d45a0c" },
          { source: "commit", reference: "36d3cc4" },
        ],
      },
      {
        id: "first-mvp-deployment",
        title: "First MVP and deployment",
        period: "May–June 2026",
        objective:
          "Complete the searchable post-match analysis flow and establish separate frontend and backend deployments.",
        keyDevelopment: [
          "Completed match search, result selection and sentiment-analysis views.",
          "Added match context, reaction summaries and Chart.js visualisation.",
          "Handled cup ties, penalty-decided fixtures and off-season results.",
          "Restructured styling and expanded mobile and tablet responsiveness.",
        ],
        outcome:
          "The first coherent Atmos FC MVP, configured for a Vercel frontend and Railway-hosted FastAPI backend.",
        keyChanges: [
          "Match analysis moved from draft layout to a complete user flow.",
          "Frontend and backend gained distinct deployment configuration.",
          "A monolithic stylesheet was separated into page-focused styles.",
        ],
        nextSteps: [
          "Address upstream rate limits and coverage gaps.",
          "Introduce a more durable football-data source and persistence layer.",
        ],
        evidence: [
          { source: "commit", reference: "4e1694f" },
          { source: "commit", reference: "48acaa2" },
          { source: "commit", reference: "e0b97ea" },
          { source: "documentation", reference: "CHANGELOG.md: May–June 2026 milestone" },
        ],
      },
      {
        id: "persistent-provider-redesign",
        title: "Persistent data and provider redesign",
        period: "August 2026",
        objective:
          "Reduce dependence on limited live lookups by adopting a broader football provider and persisting reusable match data.",
        keyDevelopment: [
          "Adopted API-Football as the primary source and retained Football-Data.org as legacy support.",
          "Added Neon PostgreSQL, SQLAlchemy repositories and Alembic migrations.",
          "Introduced fixture syncing, background jobs and YouTube comment caching.",
          "Added team profiles, visual metadata and stale-data reporting.",
        ],
        outcome:
          "Atmos FC became a persistent data-backed system capable of reusing match context instead of rebuilding every view from live provider requests.",
        keyChanges: [
          "Provider-specific calls moved behind services and repositories.",
          "Versioned relational storage replaced transient-only match handling.",
          "Scheduled workers began maintaining fixture and event coverage.",
        ],
        nextSteps: [
          "Keep stored search available during upstream failures.",
          "Make event completeness explicit during analysis.",
          "Add focused coverage for failure paths.",
        ],
        evidence: [
          { source: "commit", reference: "c428cd3" },
          { source: "commit", reference: "549fa18" },
          { source: "commit", reference: "524b994" },
        ],
      },
      {
        id: "resilience-targeted-testing",
        title: "Resilience and targeted testing",
        period: "September 2026",
        objective:
          "Preserve useful stored results during provider failures and make missing event timelines recoverable and observable.",
        keyDevelopment: [
          "Changed match search to prefer local records before attempting refreshes.",
          "Added freshness notices instead of failing the entire search request.",
          "Introduced on-demand event hydration with explicit completion states.",
          "Added focused automated tests for provider fallback and event hydration.",
        ],
        outcome:
          "Stored match discovery continued through upstream outages, while analysis could distinguish complete, missing and unavailable event data.",
        keyChanges: [
          "Provider failures became recoverable search states.",
          "Event fetching gained persisted status rather than silent fallback behaviour.",
          "Critical failure paths received dedicated test coverage.",
        ],
        nextSteps: [
          "Expand club and competition discovery.",
          "Retain resilience while introducing richer profile data.",
        ],
        evidence: [
          { source: "commit", reference: "b835a4e" },
          { source: "commit", reference: "3920745" },
          { source: "test", reference: "tests/test_match_search_provider_fallback.py" },
          { source: "test", reference: "tests/test_match_event_hydration.py" },
        ],
      },
      {
        id: "product-expansion",
        title: "Product expansion",
        period: "October 2026",
        objective:
          "Extend match analysis into richer club and competition discovery without abandoning the established data model and validation approach.",
        keyDevelopment: [
          "Added competition profiles with season summaries, clubs and recent results.",
          "Expanded club profiles with honours, squads and season snapshots.",
          "Introduced supporting backend services, schemas and frontend pages.",
          "Added focused tests for team and competition profile behaviour.",
        ],
        outcome:
          "Atmos FC expanded beyond individual match records into connected club and competition intelligence views.",
        keyChanges: [
          "New competition routes and presentation layers were added.",
          "Club records gained broader reviewed and provider-backed context.",
          "Profile expansion remained supported by targeted validation tests.",
        ],
        nextSteps: [
          "Make the public portfolio experience independent of live service availability.",
          "Publish only complete and validated analysis records.",
        ],
        evidence: [
          { source: "commit", reference: "717367e" },
          { source: "commit", reference: "b705dc2" },
          { source: "test", reference: "tests/test_competition_profiles.py" },
          { source: "test", reference: "tests/test_team_profiles.py" },
        ],
      },
      {
        id: "validated-showcase-delivery",
        title: "Validated showcase delivery",
        period: "October 2026",
        objective:
          "Keep the public experience available without requiring every live service or external provider to respond at visit time.",
        keyDevelopment: [
          "Added a versioned static archive for search, profiles and completed analyses.",
          "Introduced cumulative current-result refreshes and canonical fixture deduplication.",
          "Added schema checks, integrity checksums and generated-data secret scanning.",
          "Automated validation, data publication, production build and Vercel deployment.",
        ],
        outcome:
          "The public site could operate from validated showcase data by default while preserving the complete live FastAPI system as an explicit mode.",
        keyChanges: [
          "The frontend gained a provider-neutral data layer.",
          "A separate data branch retained the last successfully published result pack.",
          "Invalid generated data was blocked before publication or deployment.",
        ],
        evidence: [
          { source: "commit", reference: "ae68f93" },
          { source: "commit", reference: "a4bd50a" },
          { source: "commit", reference: "3e00a3e" },
          { source: "configuration", reference: ".github/workflows/refresh-showcase.yml" },
        ],
      },
    ],
  },
} as const satisfies Record<"nexa" | "atmos-fc", ProjectDevelopmentProcess>;

export function validateProjectDevelopmentProcess(
  process: ProjectDevelopmentProcess,
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const hasText = (value: string | undefined) => Boolean(value?.trim());

  if (!hasText(process.summary)) errors.push("Development process summary is required.");

  process.milestones.forEach((milestone) => {
    if (!hasText(milestone.id) || ids.has(milestone.id)) {
      errors.push(`Milestone id must be present and unique: ${milestone.id || "missing"}.`);
    }
    ids.add(milestone.id);

    if (!hasText(milestone.title) || !hasText(milestone.period)) {
      errors.push(`Milestone ${milestone.id} requires a title and period.`);
    }

    const fields = [
      milestone.objective,
      milestone.outcome,
      ...(milestone.keyDevelopment ?? []),
      ...(milestone.keyChanges ?? []),
      ...(milestone.nextSteps ?? []),
    ].filter((value): value is string => value !== undefined);
    if (!fields.some(hasText)) {
      errors.push(`Milestone ${milestone.id} requires at least one breakdown field.`);
    }
    if (fields.some((value) => !hasText(value))) {
      errors.push(`Milestone ${milestone.id} contains empty public content.`);
    }
    if (milestone.evidence.some((evidence) => !hasText(evidence.reference))) {
      errors.push(`Milestone ${milestone.id} contains an empty evidence reference.`);
    }
  });

  return errors;
}
