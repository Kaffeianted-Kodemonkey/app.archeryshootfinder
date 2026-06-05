// src/utils/shootFilters.js
import { getDistance } from "./distance"

// Convert any date (Date object or string) to stable YYYY-MM-DD string (UTC)
const toDateKey = input => {
  const d = input instanceof Date ? input : new Date(input)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Compute date boundaries using date keys (now and +21 days)
export const getDateBoundaries = () => {
  const now = new Date()
  const nowKey = toDateKey(now)

  const currentTab = new Date(now)
  currentTab.setDate(currentTab.getDate() + 21) // local, not UTC
  const currentTabKey = toDateKey(currentTab)

  return { now: nowKey, currentTab: currentTabKey }
}

// Filter shoots by date range using YYYY-MM-DD string comparison
export const filterByDateRange = (shoots, startDate, endDate) => {
  const startKey = toDateKey(startDate)
  const endKey = toDateKey(endDate)

  const filtered = shoots.filter(shoot => {
    const shootStartKey = toDateKey(shoot.date)
    const shootEndKey = shoot.endDate ? toDateKey(shoot.endDate) : shootStartKey

    // Include if:
    // 1. Start date falls inside the range, OR
    // 2. The shoot is ongoing (started in past, hasn't ended yet)
    const startsInRange = shootStartKey >= startKey && shootStartKey <= endKey
    const isOngoing = shootStartKey < startKey && shootEndKey >= startKey

    return startsInRange || isOngoing
  })

  // Sort by original date ascending
  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
}

// Filter by distance (unchanged behavior, still uses date filter internally)
export const filterByDistance = (
  shoots,
  userLocation,
  maxMiles = 50,
  fallbackShoots = shoots
) => {
  if (!userLocation?.lat || !userLocation?.lng) {
    return filterByDateRange(shoots, new Date(0), new Date("2100-01-01"))
  }

  const nearby = shoots.filter(shoot => {
    const venueLoc = shoot.venue?.location
    if (!venueLoc?.lat || !venueLoc?.lng) return false
    const distance = getDistance(userLocation, venueLoc)
    return distance <= maxMiles
  })

  const result = nearby.length > 0 ? nearby : fallbackShoots
  return filterByDateRange(result, new Date(0), new Date("2100-01-01"))
}
