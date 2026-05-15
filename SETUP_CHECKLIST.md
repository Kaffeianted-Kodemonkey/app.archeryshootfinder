### Project Workflow: ArcheryShootFinder Layout Enhancements

**Overview:**
- Goal: Add Venue Tab (clubs/ranges/pro shops/associations/organizations), refine shoots tabs (remove filters, add sorts/columns), implement tiers (basic muted, freemium/premium pages), ShootModal, no vendor modals, pro shop cross-links, populate script, claim flow.
- Tech: Gatsby, React, Bootstrap, Google Maps, JSON data.
- Assumptions: Current codebase (tabs.js, SearchContext.js, etc.); no Act mode—manual edits with my SEARCH/REPLACE guidance.
- Total Phases: 9 (core build + future).
- Estimated Time: 20-40 hours (depending on testing).

#### Phase 1: Data Preparation (Low Effort, 1-2 hours)
Dependencies: None.
1. Rename clubs.json to venues.json and expand with samples (new types: pro_shop, association, organization, standalone range; add tier "basic"/"freemium"/"premium", type for colors/icons, imageUrl as logo, membership.url for "Join", hostedShoots empty for ranges).
2. Update shoots.json: Add mandatory "venue" ref to all shoots (object with type/tier/imageUrl/contact if available; no standalone; optional locationVenue for range if club host).
3. Validate data: Ensure all shoots have venue ref, ranges no hosting, samples include claimed/unclaimed for testing.

#### Phase 2: Context and Utilities (Medium Effort, 2-3 hours)
Dependencies: Phase 1.
1. Enhance SearchContext.js: Add states for venueFilter, tier checks, activeTab (for map toggle), "showUnclaimed" toggle, type-to-color/icon mapping.
2. Add haversine utility (new file src/utils/distance.js): Function to calculate distance between lat/lng points for sorts/pro shop links.
3. Test context: Manual verify new states update correctly (console.log or simple component).

#### Phase 3: Venue Tab Implementation (Medium Effort, 3-4 hours)
Dependencies: Phase 2.
1. Update tabs.js: Add "Venue" tab (third tab), load venues data (from venues.json), sorting (name asc/desc, distance if location set), auto-location (use if set in context, else all).
2. Create VenueItem component (new file src/components/list/VenueItem.js): Responsive cards/table rows with type-colored icon/badge, hosted count (limited current month for basic, full for claimed), conditional: Muted row for basic/unclaimed (name/location/teaser count + "Claim Listing" button, no details); full row for freemium/premium + "View Page" button.
3. Integrate map in Venue tab: Pass activeTab to map.js prop, show colored/simple venue pins (Google Maps, ADA keyboard/alt; mute unclaimed pins).
4. Test Venue tab: Verify sorting, mute/teaser, count limits, map toggle.

#### Phase 4: Shoot Tab Refinements (Medium Effort, 3-4 hours)
Dependencies: Phase 3.
1. Update tabs.js shoots tabs: Remove local filters (button groups), add columns in order (Price sortable low-high, Distance sortable closest, Venue with icon/color/tier badge/teaser/claim button—hide venue on mobile, show location).
2. Add sorting logic: Clickable headers for price/distance (useState for field/direction, memoized sort).
3. Update map in shoots tabs: Show simple shoot pins (Google Maps, ADA; all shoots unmuted).
4. Test shoots tabs: Verify column order/responsiveness, sorting, no filters, map.

#### Phase 5: Templates and Modals (Medium Effort, 4-5 hours)
Dependencies: Phase 4.
1. Implement ShootModal (new file src/components/modals/ShootModal.js): Basics (logo from venue.imageUrl, bow/range/format/amenities/fee/description); direct registration button if URL; "Hosted At" teaser/link (for unclaimed: muted header with icon no logo, name/city/state/contact if pulled or "Search for Contact", no claim button; for claimed: link to page); optional "Location" link; "Nearest Pro Shops" (3 closest claimed pro shops only, name + page link).
2. Build separate venue templates: venues-freemium.js (simple: basics + full mini-list + "Join" if membership.url + "Submit Shoot" stub if type != "range") and venues-premium.js (enhanced: freemium base + advanced "Submit Shoot" + featured badge + PayPal stub; full upcoming).
3. Route templates: In VenueItem, link to appropriate template based on tier (freemium → venues-freemium, premium → venues-premium).
4. Test modals/templates: Verify ShootModal teaser/contact/pro shops (claimed only), no vendor modals, tier routing, "Submit Shoot" stub.

#### Phase 6: Search and Integration (Medium Effort, 3-4 hours)
Dependencies: Phase 5.
1. Update SearchDrawer.js: Add venue-specific searches, type filters/icons/colors/tiers (ADA badges), conditional details by tier, registration URL handling, "Show Unclaimed" toggle.
2. Integrate bidirectional links: Tab switches/filters/highlights (e.g., hosted count link to filtered shoots tab), map updates (tab-specific pins, mute unclaimed).
3. Add pro shop cross-link logic: In ShootModal, filter/haversine for 3 closest claimed pro shops.
4. Test search/integration: Verify filters/toggles, links (tab switch, venue page), map (pins/mute), pro shop list.

#### Phase 7: Styling and ADA (Low-Medium Effort, 2-3 hours)
Dependencies: Phase 6.
1. Add CSS/SCSS (global.css or new file): Type colors/icons (Bootstrap with bi-shop etc., ADA aria-labels), tier badges (gold for premium), mute class (opacity 0.5 for basic), muted header/teaser styles, PayPal stub.
2. Ensure ADA: Contrast checks, keyboard nav for maps/modals, alt/aria on icons/banners/pins.
3. Test styling/ADA: Visual mute/teaser, colors/icons, screen reader (NVDA/VoiceOver stub), mobile responsiveness.

#### Phase 8: Testing and Polish (Medium Effort, 3-4 hours)
Dependencies: Phase 7.
1. Test core flow: Geolocation (auto if set), logo/registration (direct URL), tier conditionals (mute/teaser/page), mandatory venue ref, ranges no hosting, open claim flow, mobile (hide columns, show location).
2. Test advanced: Unclaimed mute/toggle, tier-limited shoots (current month basic, full claimed), pro shop cross-link (claimed only), bidirectional links/map.
3. Polish: Edge cases (no pro shops, gaps "Contact Venue"), UI consistency, performance (memo sorts).
4. Deploy stub: Build/test locally, no live yet.

#### Phase 9: Future Features (High Effort, 10+ hours, Post-Core)
Dependencies: Phase 8 complete.
1. Claim Flow: /pricing page (tier overview, no paywall, PayPal stub); /claim/{slug} form (tier selection, mandatory EIN for Freemium → verifyEIN.js ProPublica check → set tier).
2. Tier Logic: Freemium verified non-profits (any 501c3/7), Premium paid; update components for full features.
3. Populate Script: populateData.js (monthly cron/manual, regional/national, API/RSS only, dedupe, tier-limited add, infer vendors/pro shops, unconditional linking, gaps defaults, notification).
4. Admin Panel: Shelved—add post-launch (open for beta, paywall later; edit content/shoots, analytics for premium, mobile-limited).
5. Expansion: National script, EIN expansion (beyond clubs), PayPal integration, DB for real-time (beyond JSON).
