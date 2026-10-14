<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## JAMAL Semantic Versioning

JAMAL follows Semantic Versioning: MAJOR.MINOR.PATCH.

Current version: 1.2.0

When making changes specifically to JAMAL:

- PATCH: bug fixes, factual corrections, styling fixes, small behavioural refinements,
  or changes that do not introduce new functionality.
- MINOR: new backward-compatible functionality, capabilities, integrations,
  knowledge systems, actions, or meaningful behavioural features.
- MAJOR: fundamental redesigns, breaking architectural changes, or changes
  that substantially redefine JAMAL's role or core behaviour.

Before completing JAMAL-related work:
1. Review the actual changes made.
2. Determine the appropriate SemVer increment.
3. Propose the new JAMAL version to Spencer.
4. Briefly explain why that version increment applies.
5. Do NOT commit or push automatically.
6. Suggest a commit message in this format:

   vX.Y.Z: implemented <concise description of JAMAL changes>

Never increment JAMAL's version for changes unrelated to JAMAL.
Never make a versioning decision based solely on lines changed.