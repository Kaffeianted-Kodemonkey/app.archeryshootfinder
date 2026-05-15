// src/utils/shootFilters.js
import { getDistance } from "./distance";

// Compute date boundaries (now and +21 days from now, UTC midnight for consistency)
export const getDateBoundaries = () => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  const twentyOneDaysFromNow = new Date(now);
  twentyOneDaysFromNow.setUTCDate(now.getUTCDate() + 21);
  return { now, twentyOneDaysFromNow };
};

// Filter shoots by date range (published status, within start/end dates), sorted by date ASC
export const filterByDateRange = (shoots, startDate, endDate) => {
  const filtered = shoots.filter(shoot => {
    const shootDate = new Date(shoot.date);
    shootDate.setUTCHours(0, 0, 0, 0);
    return shootDate >= startDate && shootDate <= endDate && shoot.status === "published";
  });
  // Sort by date ASC
  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Filter by distance: nearby first (≤ maxMiles), fallback to all if none, then sort by date ASC only
export const filterByDistance = (shoots, userLocation, maxMiles = 25, fallbackShoots = shoots) => {
  if (!userLocation?.lat || !userLocation?.lng) {
    return filterByDateRange(shoots, new Date(0), new Date('2100-01-01')); // No location: sort input by date (broad range)
  }

  // Filter nearby
  const nearby = shoots.filter(shoot => {
    const venueLoc = shoot.venue?.location;
    if (!venueLoc?.lat || !venueLoc?.lng) return false;
    const distance = getDistance(userLocation, venueLoc);
    return distance <= maxMiles;
  });

  // Fallback if none nearby
  const result = nearby.length > 0 ? nearby : fallbackShoots;

  // Sort only by date ASC (no secondary distance)
  return filterByDateRange(result, new Date(0), new Date('2100-01-01'));
};
