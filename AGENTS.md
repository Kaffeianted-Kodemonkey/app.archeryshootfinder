# AGENTS.md

## Project architecture

- ASFinder: Gatsby 5, React 18, JavaScript (no TypeScript).
- Styling: Bootstrap 5 and existing design tokens in `src/styles/global.css`.
- Public data: GraphQL `allShootsJson` / `allVenuesJson`, populated from MongoDB through `gatsby-node.js`. Do not assume `shoots.json` is the data source.
- Maps: `@react-google-maps/api` in `src/components/map/map.js`. Do not introduce Leaflet.
- Filters: `src/utils/shootFilters.js` and `src/utils/venueFilters.js`.
- Portal: Snipcart and `/portal/*`. Logged-out users are redirected to `/pricing`.
- MongoDB/Mongoose access is limited to `gatsby-node.js` and `models/` unless I authorize a change.

## Development rules

- Match the nearest existing implementation and coding conventions.
- Make small, targeted changes. One concern per change.
- Do not refactor unrelated code or replace working patterns without a demonstrated need.
- No new dependencies, state stores, fetch wrappers, or alternative CSS approaches without approval.
- Preserve existing data structures, API contracts, and business rules unless the requested change requires an explicitly approved modification.
- If a requirement is ambiguous or a change risks breaking existing behavior, ask before proceeding.
- Do not expose secrets, credentials, API keys, or environment variable values.
- Do not commit, push, deploy, or publish changes unless explicitly requested.

## Commands and generated files

- Do not run npm or Gatsby commands. Tell me the exact command to run; I will execute it and provide any errors.
- Never run `gatsby clean` unless I explicitly authorize it.
- Do not delete, clean, or regenerate `.cache` or `public` without my explicit approval.
- You may inspect relevant configuration, source files, and existing tests without running prohibited commands.

## Code and output

- Use JavaScript, not TypeScript.
- Follow existing formatting; Prettier style uses no semicolons.
- Read relevant files directly instead of asking me to paste files already in the repository.
- Do not print entire files, unchanged code, or code already written to disk.
- Make authorized changes directly in the repository.
- Show replacement code in chat only when I need to paste it manually or explicitly request it.
- Do not create extra documentation or instruction files unless needed.

## Completion report

After each change, report briefly:

1. What changed and which files were modified.
2. Any relevant checks performed.
3. The exact command I should run, if validation is needed.
4. Any remaining issue or decision requiring my input.

Do not claim that a build or test passed if it was not run.

## Token efficiency

- Inspect only the files relevant to the task and their necessary dependencies.
- Avoid rereading or summarizing unchanged files unnecessarily.
- Do not repeat these instructions in responses.
- Prefer concise, actionable explanations.
- If unsure, ask.

## Full-App Code Review & Audit Rules

When explicitly asked to run a full app code review, adhere to these analytical constraints:
- **Trace Cross-File Dependencies:** Focus heavily on the data flow from your MongoDB `models/` through `gatsby-node.js` into your GraphQL queries (`allShootsJson` and `allVenuesJson`). Audit for schema mismatches or field deprecations.
- **Identify Dead Code and Unused Files:** Actively scan for orphaned components, unused utility modules, or asset files that are no longer imported or referenced anywhere in the active dependency tree, marking them as candidates for removal.
- **Audit Core Modules:** Prioritize auditing your core filtering engine (`src/utils/shootFilters.js`, `src/utils/venueFilters.js`) and map integration (`src/components/map/map.js`) for edge cases or multi-conditional array leaks.
- **Security Check:** Scan specifically for accidentally hardcoded Google Maps keys, Snipcart credentials, or database connection strings. Verify they are properly referenced via environment variables.
- **Deliver Findings as a List:** Do not rewrite or modify files during the review phase. Deliver all findings as a structured, prioritized text list inside the chat, categorized by:
  1. Critical Bugs / Potential Runtime Crashes
  2. Dead Code & Unused Files (Candidates for deletion)
  3. Security & Credential Isolation Gaps
  4. Architectural Violations
