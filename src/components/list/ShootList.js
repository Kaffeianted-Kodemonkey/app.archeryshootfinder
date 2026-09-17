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
  // Sort shoots based on current sort state
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
          if (!userLocation || !a.effectiveLocation || !b.effectiveLocation) return 0
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
  const [selectedVenueId, setSelectedVenueId] = React.useState(null)

  React.useEffect(() => {
    setFilteredShoots(sortedShoots)
  }, [sortedShoots])

  if (sortedShoots.length === 0) {
    return (
      <div className="alert alert-info">
        No shoots available here. Check the Upcoming tab for future events.
      </div>
    )
  }

  // Group the FILTERED shoots by venue
  const grouped = filteredShoots.reduce((acc, shoot) => {
    const vid = shoot.venue?.venueId || shoot.venueId || "unknown"
    if (!acc[vid]) acc[vid] = []
    acc[vid].push(shoot)
    return acc
  }, {})

  const venues = Object.entries(grouped)

  return (
    <div className="flex-wrap">
      <ShootFilters
        shoots={sortedShoots}
        onFilteredChange={setFilteredShoots}
        userLocation={userLocation}
      />
      <div className="accordion accordion-flush" id="shootAccordion">
        {venues.map(([venueId, venueShoots], vIndex) => (
          <ShootAccordionItem
            key={venueId}
            venueId={venueId}
            venueShoots={venueShoots}
            vIndex={vIndex}
            isOpen={venueId === selectedVenueId}
            userLocation={userLocation}
            onSelectShoot={onSelectShoot}
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
