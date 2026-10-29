# AGENTS.md

## Project architecture

- ASFinder: Gatsby 5, React 18, JavaScript (no TypeScript).
- Styling: Bootstrap 5 and existing design tokens in `src/styles/global.css`.
- Public data: GraphQL `allShootsJson` / `allVenuesJson`, populated from MongoDB through `gatsby-node.js`. Do not assume `shoots.json` is the data source.
- Maps: `@react-google-maps/api` in `src/components/map/map.js`. Do not introduce Leaflet.
- Filters: `src/utils/shootFilters.js` and `src/utils/venueFilters.js`.
- Portal: Snipcart and `/portal/*`. Logged-out users are redirected to `/pricing`.
- MongoDB/Mongoose access is limited to `gatsby-node.js` and `models/` unless I authorize a change.

## Domain model and ShootingEvents rules

These are the intended product meanings. Keep them distinct from current field names and legacy data when implementing changes.

- **Venue** means the organization running an event: Club, Range, Pro Shop, or Association. It is conceptually separate from the event's physical location. Venue contact details belong to the organization. Do not infer a missing venue type as `Club`; show a type badge only when the type is known.
- **Event/Shoot** means one actual shoot occurrence. It has its own event title, date range, organizer (Venue), and physical location. A multi-stop program has a distinct shoot occurrence for each stop/location. The organizer's base address may also be the event location only when the shoot explicitly uses that location.
- **League/Series** groups related shoot occurrences. When a shoot belongs to a League/Series, use that League/Series title as the accordion heading and group its matching shoots under it.
- **Destination** means an event intended for overnight/travel planning, generally lasting two or more days. It is an independent classification and can coexist with League/Series membership.
- Route each shoot by its own `isDestination` value: `true` appears in Destination mode; `false` or missing appears in Events mode. Do not force all shoots in a League/Series into the same mode. The same League/Series title may therefore appear in both modes, each grouping only the shoots assigned to that mode.
- Use one `ShootingEvents` listing page with no tabs. Homepage Events and Destination buttons open that page in the corresponding mode. Events mode shows non-destination shoots; Destination mode shows destination shoots. Do not apply a distance radius. Preserve the current Events filters, Google map, and accordion presentation, and keep map and list results in sync.
- Exclude completed shoots before grouping: use `endDate` when present, otherwise `date`; a shoot whose resulting date is before today is expired. Keep a group visible while it has at least one non-expired shoot.
- For a standalone shoot, use its event title as the accordion heading. For a League/Series member, use the League/Series title in either mode. For a destination group that is not already grouped as a League/Series, use its destination/program title (for example `TAC-2027`) and show the individual stop/event titles and locations inside it. Do not substitute the physical location name for the organizing group title.

### Current field mapping constraints

- `Shoot.venueId` / `Shoot.venue` currently link a shoot to a `VenuesJson` record; under the intended model this record represents the organizing organization. `Venue.location` is the organization's base address; shoot location fields (`location`, `shootLocation`, `useVenueLocation`) determine the physical event site. Treat the base address as the event site only when the shoot explicitly uses it.
- Current shoot grouping uses `seriesName` and `isLeague`. Confirm source records before assuming these fields distinguish every League, Series, or Destination title; do not invent or derive a parent title from a location.
- `isDestination` is projected and exposed in Gatsby's `ShootsJson` schema, but is not currently declared in `models/Shoot.js`. Reconcile this mismatch before relying on Mongoose validation or adding destination behavior there.
- Do not assume a dedicated destination title or a normalized group identifier exists in MongoDB. Inspect current records and preserve legacy values when designing any new fields or migration.

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
