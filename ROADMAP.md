# ArcheryShootFinder - Updated Product Roadmap

**Project Type**: Progressive Web App (PWA) - Shoot Discovery Platform  
**Tech Stack**: Gatsby.js, React, TypeScript, **Bootstrap 5**, Mock JSON Data (Phase 1), later Headless WordPress  
**Goal**: Build a fast, beautiful, app-like PWA that makes it extremely easy for archers to discover shoots, clubs, and events.

## High-Quality PWA Standards (Must Follow)

- `display: standalone` in manifest.json (feels like a native app)
- Proper app icons (192x192 + 512x512, maskable preferred)
- Reliable Service Worker with offline caching for shoots and assets
- Bottom navigation bar on mobile (thumb-friendly)
- Pull-to-refresh on listing and map pages
- Skeleton loaders and smooth loading states
- Offline support: cached shoots, favorites, and details
- Target Lighthouse: 90+ in Performance, Accessibility, Best Practices
- Safe-area insets and touch-friendly UI
- Dark mode support
- Fast performance (< 1.5s First Contentful Paint)

**Design Direction**: Earthy terracotta (#C2410C) as primary accent, forest green (#166534) secondary accents, warm neutrals, clean outdoor/sports aesthetic. Mobile-first.

## Main Layout Priority (Discover Page)

- **Top**: Prominent search bar + filter button
- **Toggle**: Map View ↔ List View ↔ Calendar View (default = Map)
- **Focus**: Make it **extremely quick** for archers to find shoots near them or by date
- **Bottom Navigation** (mobile):
  1. Discover (Map/List/Calendar)
  2. Near Me
  3. My Shoots
  4. Profile

---

## Updated Phases & Cost Estimates

| Phase       | Name                       | Timeline  | Key Focus                                                 | Estimated Cost (grok-4-1-fast-reasoning) |
| ----------- | -------------------------- | --------- | --------------------------------------------------------- | ---------------------------------------- |
| **Phase 1** | MVP Shoot Finder PWA       | 3–5 weeks | Core discovery experience with Map, List & Calendar views | **$30 – $52**                            |
| **Phase 2** | Club & Venue System        | 5–7 weeks | Club profiles, directory, self-service shoots             | **$35 – $62**                            |
| **Phase 3** | User Accounts & Engagement | 5–7 weeks | Login, profiles, My Shoots, favorites, phpBB forum link   | **$30 – $55**                            |
| **Phase 4** | Monetization Foundations   | 6–8 weeks | Featured listings, pro shops, premium indicators          | **$40 – $70**                            |

**Total estimated cost for Phase 1 + 2 + 3 (launch-ready MVP):** **$95 – $169**

---

### Phase 1 Detailed Breakdown (Current Priority)

**Goal**: Deliver a high-quality, installable PWA focused on quick shoot discovery.

1. **Project Setup & Bootstrap 5 Integration**
2. **Data Schema & TypeScript Types** (`Shoot`, `Club`, `Venue`)
3. **Rich Mock Data** (100+ realistic archery shoots)
4. **Core Components** (ShootCard, Filter controls, Map wrapper)
5. **Main Discover Page** with Map ↔ List ↔ Calendar toggle
6. **Shoot Detail Page**
7. **Interactive Map** (with clustering and markers)
8. **Bottom Navigation + Mobile Layout**
9. **Full PWA Configuration** (manifest, service worker, install prompt, offline support)
10. **Theme Customization & Polish** (terracotta/green + dark mode)

---

### Phase 1 Success Criteria

- Fast, responsive, app-like experience on mobile
- Easy toggle between Map, List, and Calendar views
- Users can quickly find shoots by location and date
- Works well offline for cached data
- High visual polish with Bootstrap 5

---

**Current Status**: In Progress (Bootstrap migration + layout refinement)

---

**Notes**:

- We are using **Bootstrap 5** instead of Tailwind CSS.
- Phase 1 uses mock JSON data (easy migration to WordPress later).
- phpBB forum will be added later as a simple external link from the Profile page.
- We will stay PWA-first. Native apps will only be considered after strong user validation.

---

Would you like me to expand any section or create a more detailed task list for Phase 1?
