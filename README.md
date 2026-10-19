# Archery Shoot Finder

Archery Shoot Finder is a Gatsby 5 and React 18 web app for finding archery shoots and venues. It includes shoot and venue directories, an interactive Google Map, user accounts, and a portal for venue users.

## Features

- Search and browse shoots on the events directory.
- Browse venues in the venue directory and view individual venue spotlight pages.
- View shoot and venue locations with the Google Maps integration.
- Use the responsive interface and installable PWA features.
- Access account and venue portal flows, including Snipcart integration.

## Requirements

- Node.js and npm
- MongoDB connection details for sourcing public shoot, venue, and association data
- Google Maps JavaScript API key

## Configuration

Gatsby loads environment variables from `.env.${NODE_ENV}` in `gatsby-node.js`. For local development, create `.env.development` in the project root. For a production build, configure the corresponding production environment file or deployment environment variables.

The data source accepts `MONGO_URI`, `GATSBY_MONGO_URI`, or `GATSBY_MONGODB_URI`. The database name is `ASFinder`; Gatsby reads the `venues`, `shoots`, and `associations` collections. Configure `GATSBY_GOOGLE_MAPS_API_KEY` for the Google Maps integration. Do not commit credentials or environment files containing secrets.

## Development

Install dependencies, configure the environment variables above, then run:

```bash
npm run develop
```

Gatsby serves the site at `http://localhost:8000` by default. The available package scripts are `develop`, `build`, `serve`, `start` (an alias for develop), and `clean` (clears Gatsby's cache and generated output).

## Current project structure

```text
├── gatsby-node.js               # MongoDB sourcing, GraphQL schema, dynamic pages
├── models/                      # Mongoose models used by server-side integrations
├── src/
│   ├── api/                     # Server API handlers
│   ├── components/
│   │   ├── layout/              # Site and event layouts, navigation, footer
│   │   ├── list/                # Shoot and venue directory/list components
│   │   ├── map/                 # Google Maps view
│   │   ├── AdminDash.js         # Admin dashboard
│   │   ├── Profile.js           # User profile
│   │   └── seo.js               # SEO metadata
│   ├── pages/                   # Gatsby routes: home, events, venues, login, portal, pricing
│   ├── templates/spotlight.js   # Individual venue spotlight pages
│   ├── utils/                   # Shoot and venue filtering and distance helpers
│   └── styles/global.css        # Global styles and design tokens
├── static/                      # Static assets
├── gatsby-config.js             # Gatsby plugins and site configuration
└── package.json                 # Dependencies and scripts
```

## Data workflow

Public directory data is sourced from MongoDB during Gatsby's `sourceNodes` lifecycle in `gatsby-node.js`. The loader reads the `venues`, `shoots`, and `associations` collections in the `ASFinder` database, applies projections, and creates Gatsby nodes with the types `VenuesJson`, `ShootsJson`, and `AssociationsJson`. A missing MongoDB URI causes sourcing to be skipped; Gatsby queries that require those nodes will therefore have no directory data.

Pages use Gatsby GraphQL data such as `allShootsJson` and `allVenuesJson`. The events page renders shoot data through `EventLayout`; the venues page renders the venue directory. `createPages` creates `/venues/{venueId}` pages from venue nodes using `src/templates/spotlight.js`. Shoots and venues are not maintained in a local `src/data/shoots.json` file. Update records through the application's authorized data workflow or MongoDB process, preserving the existing document fields and relationships.

### MVP source, account scope, and launch boundary

- **Directory source:** MongoDB is the sole source for public venue, shoot, and association records. Gatsby reads the `ASFinder` collections at build time and exposes them as GraphQL nodes. There is no local JSON fallback. A deployment without a MongoDB URI does not have the public directory data required by the pages.
- **Required identifiers:** venue records need `venueId`; shoot records need `shootId` and `venueId`; association records need `acronym` for the current Gatsby schema and links. The schema also marks venue `isClaimed` and `isClass` as non-nullable. Validate real documents against those requirements before a production build.
- **Account scope:** Snipcart supplies portal sign-in. The order webhook associates a venue with a Snipcart user ID, but the portal does not yet persist venue or shoot edits, and subscription lifecycle state is not fully synchronized. Do not treat the portal as self-service venue management or subscription status as authoritative until those write and lifecycle paths are implemented and verified.
- **MVP launch scope:** the implemented public experience is browsing/filtering event and venue directories, viewing map pins, and opening venue spotlight pages. Snipcart login and checkout UI are present. Venue/shoot editing, analytics, and dependable subscription lifecycle management are not launch-ready capabilities. Pricing copy that advertises analytics should be considered a product claim to resolve before launch.
- **Legacy scaffolding:** current source inspection found no `shootService.js` or local shoot/venue JSON data files. Recheck before adding replacements; do not maintain a second source of truth.

Filter behavior lives in `src/utils/shootFilters.js` and `src/utils/venueFilters.js`. The Google Maps component is `src/components/map/map.js` and uses `@react-google-maps/api`.

## Production

Build the site with:

```bash
npm run build
```

Serve a built site locally with:

```bash
npm run serve
```

The production build is generated in `public/`. Gatsby's manifest and offline plugins provide the configured PWA behavior.

## Styling

The project uses Bootstrap 5 alongside the existing design tokens and global styles in `src/styles/global.css`. Follow nearby component conventions when making UI changes.

## License

MIT License - see the LICENSE file for details.
