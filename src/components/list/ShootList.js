// src/components/list/ShootList.js
import * as React from "react"
import PropTypes from "prop-types"
import { getDistance } from "../../utils/distance"
import ShootFilters from "./ShootFilters"
import ShootAccordionItem from "./ShootAccordionItem"

const ShootList = ({
  shoots = [],
  userLocation,
  sortField = "date",
  sortDirection = "asc",
  onSelectShoot,
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

  React.useEffect(() => {
    setFilteredShoots(sortedShoots)
  }, [sortedShoots])

  // Leagues: seriesName (or sname) + venueId; tournaments: one per shootId
  // Must run every render (before any early return)
  const eventGroups = React.useMemo(() => {
    const grouped = filteredShoots.reduce((acc, shoot) => {
      const venueId = shoot.venue?.venueId || shoot.venueId || "unknown"
      const isLeague = shoot.isLeague === true || shoot.isLeague === "true"
      const series = shoot.seriesName || shoot.sname || "league"

      const groupKey = isLeague
        ? `league-${String(series)
            .replace(/\s+/g, "-")
            .toLowerCase()}-${venueId}`
        : `tournament-${shoot.shootId || shoot.id || Math.random()}`

      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(shoot)
      return acc
    }, {})
    return Object.entries(grouped)
  }, [filteredShoots])

  if (sortedShoots.length === 0) {
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
        onFilteredChange={setFilteredShoots}
        userLocation={userLocation}
      />
      <div className="accordion accordion-flush" id="shootAccordion">
        {eventGroups.map(([groupId, groupShoots], gIndex) => (
          <ShootAccordionItem
            key={groupId}
            venueId={groupId}
            venueShoots={groupShoots}
            vIndex={gIndex}
            isOpen={false}
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
  userLocation: PropTypes.object,
  sortField: PropTypes.string,
  sortDirection: PropTypes.string,
  onSelectShoot: PropTypes.func,
}

export default ShootList
