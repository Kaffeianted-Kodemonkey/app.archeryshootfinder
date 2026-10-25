// src/utils/shootUiHelpers.js

/**
 * Checks a list or an individual shoot to determine verification badges.
 */
export const getStatusInfo = target => {
  if (Array.isArray(target)) {
    const hasUnverified = target.some(s => s?.isVerified === false)
    return hasUnverified
      ? { className: "bg-warning text-dark", label: "Contains Unverified" }
      : { className: "bg-success text-white", label: "Verified" }
  }
  return target?.isVerified
    ? { className: "bg-success text-white", label: "Verified" }
    : { className: "bg-warning text-dark", label: "Not Verified" }
}

/**
 * Safely extracts and formats the association label if it exists.
 * Returns a clean string or null if empty/missing.
 */
export const getAssociationBadge = assocType => {
  return typeof assocType === "string" && assocType.trim().length > 0
    ? assocType.trim()
    : null
}

/**
 * Formats multi-day or single-day events intelligently while dropping duplicate months.
 */
export const formatDateShort = (start, end) => {
  const s = new Date(`${start}T00:00:00`)
  const e = new Date(`${end || start}T00:00:00`)

  if (s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    const startStr = s.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    return `${startStr} - ${e.getDate()}`
  }

  return `${s.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${e.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
}
