// src/utils/shootFilters.js
import { getDistance } from "./distance"

/**
 * Safely extracts coordinates from either a Shoot layout or a Venue layout node object.
 */
const extractCoordinates = item => {
  if (!item) return null

  // If it's a venue node directly
  if (item.location?.lat && item.location?.lng) return item.location

  // If it's a shoot node
  const venue = item.venue
  const effectiveLocation =
    item.useVenueLocation !== false && venue?.location
      ? venue.location
      : item.shootLocation || venue?.location

  return effectiveLocation?.lat && effectiveLocation?.lng
    ? effectiveLocation
    : null
}

const toDateKey = input => {
  const d = input instanceof Date ? input : new Date(input)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const getDateBoundaries = () => {
  const now = new Date()
  const currentTab = new Date(now)
  currentTab.setDate(currentTab.getDate() + 21)

  return { now, currentTab }
}

export const filterByDateRange = (shoots, startDate, endDate) => {
  const startKey = toDateKey(startDate)
  const endKey = toDateKey(endDate)

  const filtered = shoots.filter(shoot => {
    const shootStartKey = toDateKey(shoot.date)
    return shootStartKey >= startKey && shootStartKey <= endKey
  })

  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
}

/**
 * Polymorphic Distance Filter - Streamlined to process BOTH Shoots and Venues
 */
export const filterByDistance = (items = [], userLocation, maxMiles = 50) => {
  if (!userLocation?.lat || !userLocation?.lng) {
    return items
  }

  const nearby = items.filter(item => {
    const loc = extractCoordinates(item)
    if (!loc) return false
    return getDistance(userLocation, loc) <= maxMiles
  })

  // Fallback pattern: if nothing matches within the radius loop, return the full list baseline
  return nearby.length > 0 ? nearby : items
}
