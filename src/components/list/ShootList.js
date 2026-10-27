// src/components/list/ShootList.js
import * as React from "react"
import PropTypes from "prop-types"
import { getDistance } from "../../utils/distance"
import ShootFilters from "./ShootFilters"
import ShootAccordionItem from "./ShootAccordionItem"

const ShootList = ({
  shoots = [],
  allShoots = shoots,
  onVisibleShootsChange,
  onSelectShoot,
  userLocation,
  sortField = "date",
  sortDirection = "asc",
}) => {
  const sortedShoots = React.useMemo(() => {
    return [...shoots].sort((a, b) => {
      let aVal, bVal
      switch (sortField) {
        case "name":
          aVal = (a.sname || "").toLowerCase()
          bVal = (b.sname || "").toLowerCase()
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        case "date":
          aVal = new Date(a.date)
          bVal = new Date(b.date)
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        case "distance":
          if (!userLocation || !a.effectiveLocation || !b.effectiveLocation)
            return 0
          aVal = getDistance(userLocation, a.effectiveLocation)
          bVal = getDistance(userLocation, b.effectiveLocation)
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        case "venue":
          aVal = (a.venue?.vname || "").toLowerCase()
          bVal = (b.venue?.vname || "").toLowerCase()
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        default:
          return 0
      }
    })
  }, [shoots, sortField, sortDirection, userLocation])

  const [filteredShoots, setFilteredShoots] = React.useState(sortedShoots)
  const [openGroupId, setOpenGroupId] = React.useState(null)

  React.useEffect(() => {
    setFilteredShoots(sortedShoots)
  }, [sortedShoots])

  // Group repeated event titles at the same venue into one card.
  // Must run every render (before any early return).
  const eventGroups = React.useMemo(() => {
    const grouped = filteredShoots.reduce((acc, shoot) => {
      const venueId = String(
        shoot.venue?.venueId || shoot.venueId || "unknown"
      ).toLowerCase()
      const eventTitle = String(shoot.sname || shoot.seriesName || "event")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
      const groupKey = `event-${JSON.stringify([venueId, eventTitle])}`

      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(shoot)
      return acc
    }, {})
    return Object.entries(grouped)
  }, [filteredShoots])

  const handleFilteredChange = React.useCallback(
    results => {
      setFilteredShoots(results)
      onVisibleShootsChange?.(results)
    },
    [onVisibleShootsChange]
  )

  if (allShoots.length === 0) {
    return (
      <div className="alert alert-info text-center py-5 my-4">
        No upcoming events found.
      </div>
    )
  }

  return (
    <div className="flex-wrap">
      <ShootFilters
        shoots={sortedShoots}
        allShoots={allShoots}
        onFilteredChange={handleFilteredChange}
        userLocation={userLocation}
      />
      {filteredShoots.length === 0 && (
        <div className="alert alert-info text-center py-5 my-4">
          No results found. Please use filters to adjust your results.
        </div>
      )}
      <div className="accordion accordion-flush" id="shootAccordion">
        {eventGroups.map(([groupId, groupShoots], gIndex) => (
          <ShootAccordionItem
            key={groupId}
            venueId={groupId}
            venueShoots={groupShoots}
            vIndex={gIndex}
            isOpen={openGroupId === groupId}
            onToggle={groupId =>
              setOpenGroupId(current => (current === groupId ? null : groupId))
            }
            userLocation={userLocation}
            onSelectShoot={onSelectShoot}
            variant="events"
          />
        ))}
      </div>
    </div>
  )
}

ShootList.propTypes = {
  shoots: PropTypes.array,
  allShoots: PropTypes.array,
  onVisibleShootsChange: PropTypes.func,
  onSelectShoot: PropTypes.func,
  userLocation: PropTypes.object,
  sortField: PropTypes.string,
  sortDirection: PropTypes.string,
}

export default ShootList
