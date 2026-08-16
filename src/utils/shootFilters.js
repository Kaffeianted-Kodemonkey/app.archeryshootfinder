// src/utils/shootFilters.js
import { getDistance } from "./distance"

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

  return {
    now: now, // actual Date object
    currentTab: currentTab,
  }
}

// Only looks at START date. No overlap between Current and Upcoming.
export const filterByDateRange = (shoots, startDate, endDate) => {
  const startKey = toDateKey(startDate)
  const endKey = toDateKey(endDate)

  const filtered = shoots.filter(shoot => {
    const shootStartKey = toDateKey(shoot.date)
    return shootStartKey >= startKey && shootStartKey <= endKey
  })

  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
}

// Fixed: No longer resets the date filter
export const filterByDistance = (shoots, userLocation, maxMiles = 50) => {
  if (!userLocation?.lat || !userLocation?.lng) {
    return shoots
  }

  const nearby = shoots.filter(shoot => {
    const loc = shoot.venue?.location || shoot.shootLocation
    if (!loc?.lat || !loc?.lng) return false
    return getDistance(userLocation, loc) <= maxMiles
  })

  return nearby.length > 0 ? nearby : shoots
}
