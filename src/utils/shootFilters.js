// src/utils/shootFilters.js
import { getDistance } from "./distance"

/**
 * Safely extracts coordinates from either a Shoot layout or a Venue layout node object.
 */
const extractCoordinates = item => {
  if (!item) return null

  const location =
    item.effectiveLocation ||
    item.location ||
    item.shootLocation ||
    item.venue?.location

  if (!location) return null

  if (
    location.lat === null ||
    location.lat === undefined ||
    location.lat === "" ||
    location.lng === null ||
    location.lng === undefined ||
    location.lng === ""
  ) {
    return null
  }

  const lat = Number(location.lat)
  const lng = Number(location.lng)

  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
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
  const userLat = Number(userLocation?.lat)
  const userLng = Number(userLocation?.lng)

  if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) {
    return []
  }

  const nearby = items.filter(item => {
    const loc = extractCoordinates(item)
    if (!loc) return false
    return getDistance(userLocation, loc) <= maxMiles
  })

  return nearby
}
