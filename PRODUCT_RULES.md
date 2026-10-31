# Portfolio Product Rules

## Project Systems Project Data

These rules apply whenever a project is added to Project Systems or an existing
project record is materially updated. A project record is one complete,
evidence-backed unit: identity, description, links, branding, media, features,
statistics, technology stack, architecture and the way that data renders.

### Sources of truth

- `src/data/projects.ts` contains the project-specific records.
- `src/types/project.ts` defines the required project-data contract.
- `src/data/projectArchitecture.ts` owns the shared architectural vocabulary.
- `src/data/githubRepositories.ts` owns portfolio-to-repository mappings.
- `public/brand/` contains locally served project branding.
- `public/images/projects/<slug>/` contains locally served project media.
- Shared Project Systems components render the records. Do not duplicate a
  shared component or hard-code a project into JSX when the existing data model
  can represent it.

If a new project cannot be represented accurately by the existing contract,
extend the shared type, data structure and renderer deliberately. Do not force
the project into an inaccurate field merely to avoid a schema change.

### Required intake process

1. Inspect the portfolio worktree before editing and preserve unrelated changes.
2. Inspect the project itself before writing its record. Use its current source
   code, dependency manifests, README, configuration, routes, data layer,
   deployment files and existing assets. Do not rely only on a repository name,
   an old portfolio description, memory or assumptions about a framework.
3. Establish which claims are supported by that evidence. When the source
   repository is unavailable or the evidence is incomplete, mark the specific
   uncertainty or omit the claim. Never guess or invent missing details.
4. Build the complete record as one coherent update. Check identity, copy,
   links, brand assets, media, features, statistics, stack and architecture
   together so they cannot silently contradict one another.
5. Preserve the current Project Systems interaction and visual language unless
   the user has separately requested a redesign.

### Project identity and copy

- Use a stable, URL-safe and unique `slug`.
- Use a unique `recordCode` and preserve existing codes unless a migration has
  been explicitly approved.
- Keep `title`, `category`, `description`, `problemSolved`, `timeline` and
  `architectureSummary` factual and project-specific.
- Describe the current product, not an abandoned prototype or planned feature.
- Keep claims proportional to the evidence. Do not present local packaging,
  tests or configuration as proof of a live deployment.
- Use `null` for unavailable GitHub or live links. Do not add placeholder URLs.

### Branding, screenshots and demonstrations

- Use the project's real logo or brand asset when one exists. Do not substitute
  a generic placeholder for an available project asset.
- Store portfolio media locally under the established `public/brand/` or
  `public/images/projects/<slug>/` paths. Avoid runtime hotlinks for portfolio
  screenshots and branding.
- Select a small, representative set of current visuals that demonstrates the
  strongest distinct workflows. Do not include several images that show the
  same state simply to increase the count.
- Preserve the intended display order and provide accurate, useful alternative
  text and concise labels for every visual.
- Check screenshots for secrets, private account information, personal data,
  debugging residue and obsolete UI before importing them.
- Describe a demonstration as available, pending or unavailable according to
  its real state. Never render a fake play action or imply that a static image
  is a working video.

### Features, statistics and flat stack

- `keyFeatures` must describe implemented, user-visible behaviour supported by
  the inspected project.
- `verifiedStats` must include a concrete evidence explanation. Recalculate
  code-derived counts when the source changes; do not preserve stale numbers
  because they look impressive.
- The top-level `stack` is a concise display list, not a dependency dump. Include
  representative technologies that materially explain how the project works.
- Keep the flat stack consistent with the detailed architecture. A technology
  may appear in both, but the two must not contradict each other.

### Architecture vocabulary and classification

Use only the central categories defined in `src/data/projectArchitecture.ts`,
in this canonical order when they apply:

1. **Presentation** — User interface and interactions.
2. **Application** — Business logic, APIs and request handling.
3. **Identity & Security** — Authentication, authorisation and sessions.
4. **Data & Persistence** — Databases, storage and data access.
5. **Integrations** — External APIs and third-party services.
6. **Infrastructure** — Hosting, deployment and runtime.

For each project:

- Include only categories supported by the inspected implementation.
- Omit irrelevant categories entirely. Never add empty layers or technologies
  merely to complete the six-category list.
- Use each applicable category no more than once.
- Provide at least one actual technology and one concise responsibility for
  every included category.
- Classify a technology by its responsibility in that project. For example, a
  local analysis library performing product logic belongs to Application,
  while a hosted data provider belongs to Integrations.
- Use the optional `uncertainty` field when the category is relevant but its
  implementation cannot be established confidently. Explain the exact gap;
  never use uncertainty as cover for a guess.
- Do not create project-specific synonyms for the central category labels.
- Architecture entries may have different counts and combinations across
  projects. The renderer must derive labels from the central vocabulary and
  support the configured number of layers.

Example: a gym tracker should include Identity & Security only if it actually
authenticates users, and Integrations only if it genuinely connects to services
such as Apple Health, Google Fit, Stripe or an external exercise API. React does
not automatically mean Presentation plus Application; classify it according to
its real responsibility in that implementation.

### Rendering and interaction

- A new record must be reachable through the existing project selector and its
  `/projects/<slug>` route without adding a project-specific page component.
- Variable project counts, architecture-layer counts and visual-record counts
  must not break layout, animation or navigation.
- Maintain semantic headings, meaningful image alternatives, keyboard-operable
  tabs and selectors, visible focus states and accurate ARIA state.
- Verify long titles, labels and descriptions rather than shortening factual
  content solely to hide an overflow defect.
- Desktop and mobile must present the same essential project information, even
  when their layouts differ.

### Required verification

Before calling a project-data update complete:

1. Run lint, TypeScript, the relevant tests and `git diff --check`.
2. Run a production build when the schema, rendering code, routes or imported
   assets changed.
3. Inspect the rendered project at desktop and mobile widths.
4. Select every project and exercise the project selector, screenshot selector,
   dossier tabs, architecture interaction and external links that changed.
5. Check for page-level horizontal overflow, clipped text, missing assets,
   duplicate categories, stale content and console errors.
6. Distinguish source/build verification from deployed-host verification. Do
   not claim that a live project or portfolio deployment was verified unless it
   was actually checked.
7. Do not commit, push, deploy or change external project data unless the user
   explicitly requests that separate action.
