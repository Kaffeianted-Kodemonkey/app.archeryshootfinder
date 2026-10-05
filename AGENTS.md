# AGENTS.md

ASFinder. Gatsby 5, React 18, JS (no TS), Bootstrap 5 + `src/styles/global.css` tokens.
Public data: GraphQL `allShootsJson` / `allVenuesJson` from Mongo in `gatsby-node.js`. Not `shoots.json`.
Map: `@react-google-maps/api` in `src/components/map/map.js`. No Leaflet.
Filters: `src/utils/shootFilters.js`, `venueFilters.js`.
Portal: Snipcart + `/portal/*`. Logged out → `/pricing`.
Mongo/mongoose only in `gatsby-node.js` and `models/`.

Do not run npm/gatsby. Tell me the command; I paste errors only.
No new deps, stores, fetch wrappers, or CSS approach.
Match the nearest file. One concern per change. Prettier: no semicolons.
If unsure, ask.

Do not run gatsby clean unless I ask. Keep .cache and public.
