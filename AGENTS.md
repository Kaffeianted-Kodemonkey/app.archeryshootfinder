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
