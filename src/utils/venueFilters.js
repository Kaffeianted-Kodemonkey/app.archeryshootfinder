// src/utils/venueFilters.js

/**
 * Filters a list of venues based on optional city, state, and type parameters.
 * If a parameter is missing or empty, that specific filter is skipped.
 *
 * @param {Array} venues - Array of venue nodes from GraphQL
 * @param {Object} filters - The active filtering criteria
 * @param {string} filters.city - Filter by city name
 * @param {string} filters.state - Filter by 2-letter state abbreviation
 * @param {string} filters.type - Filter by venueType (CLUB, RANGE, PRO_SHOP)
 * @returns {Array} Filtered and sorted array of venues
 */
export const filterVenues = (
  venues = [],
  { city = "", state = "", type = "" } = {}
) => {
  let result = [...venues]

  // 1. Filter by Venue Type (CLUB, RANGE, PRO_SHOP)
  if (type) {
    const cleanType = type.trim().toUpperCase()
    result = result.filter(
      venue => venue.venueType?.toUpperCase() === cleanType
    )
  }

  // 2. Filter by State Abbreviation (e.g., "CO")
  if (state) {
    const cleanState = state.trim().toUpperCase()
    result = result.filter(
      venue => venue.location?.state?.toUpperCase() === cleanState
    )
  }

  // 3. Filter by City Name
  if (city) {
    const cleanCity = city.trim().toLowerCase()
    result = result.filter(
      venue => venue.location?.city?.toLowerCase() === cleanCity
    )
  }

  // Keep it sorted alphabetically by venue name as a default baseline
  return result.sort((a, b) => (a.vname || "").localeCompare(b.vname || ""))
}
