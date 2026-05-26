// src/utils/shootFilters.js
import { getDistance } from "./distance";

// Convert any date (Date object or string) to stable YYYY-MM-DD string (UTC)
const toDateKey = (input) => {
  const d = input instanceof Date ? input : new Date(input);
  return d.toISOString().split("T")[0];
};

// Compute date boundaries using date keys (now and +21 days)
export const getDateBoundaries = () => {
  const now = new Date();
  const nowKey = toDateKey(now);

  const currentTab = new Date(now);
  currentTab.setUTCDate(currentTab.getUTCDate() + 21);
  const currentTabKey = toDateKey(currentTab);

  return { now: nowKey, currentTab: currentTabKey };
};

// Filter shoots by date range using YYYY-MM-DD string comparison
export const filterByDateRange = (shoots, startDate, endDate) => {
  const startKey = toDateKey(startDate);
  const endKey = toDateKey(endDate);

  const filtered = shoots.filter((shoot) => {
    const shootKey = toDateKey(shoot.date);
    return shootKey >= startKey && shootKey <= endKey;
  });

  // Sort by original date ascending
  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Filter by distance (unchanged behavior, still uses date filter internally)
export const filterByDistance = (shoots, userLocation, maxMiles = 50, fallbackShoots = shoots) => {
  if (!userLocation?.lat || !userLocation?.lng) {
    return filterByDateRange(shoots, new Date(0), new Date("2100-01-01"));
  }

  const nearby = shoots.filter((shoot) => {
    const venueLoc = shoot.venue?.location;
    if (!venueLoc?.lat || !venueLoc?.lng) return false;
    const distance = getDistance(userLocation, venueLoc);
    return distance <= maxMiles;
  });

  const result = nearby.length > 0 ? nearby : fallbackShoots;
  return filterByDateRange(result, new Date(0), new Date("2100-01-01"));
};
