// src/components/list/DestList.js
import * as React from "react"
import PropTypes from "prop-types"
import ShootFilters from "./ShootFilters"
import ShootAccordionItem from "./ShootAccordionItem"

/**
 * Destination tab: group by seriesName (fallback sname), not per stop.
 */
const DestList = ({
  shoots = [],
  selectedVenueId = null,
  userLocation,
  onSelectShoot,
}) => {
  const destinationShoots = React.useMemo(() => {
    return shoots.filter(s => {
      const flag = s?.isDestination ?? s?.is_destination
      return flag === true || flag === "true"
    })
  }, [shoots])

  const [filteredShoots, setFilteredShoots] = React.useState(destinationShoots)

  React.useEffect(() => {
    setFilteredShoots(destinationShoots)
  }, [destinationShoots])

  const eventGroups = React.useMemo(() => {
    const grouped = filteredShoots.reduce((acc, s) => {
      const series =
        s.seriesName ||
        s.sname ||
        `destination-${s.shootId || s.id || Math.random()}`
      const groupKey = `dest-${String(series)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")}`

      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(s)
      return acc
    }, {})

    // Sort stops within each series by date
    return Object.entries(grouped).map(([key, list]) => [
      key,
      [...list].sort((a, b) => new Date(a.date) - new Date(b.date)),
    ])
  }, [filteredShoots])

  if (destinationShoots.length === 0) {
    return (
      <div className="alert alert-info text-center py-5 my-4">
        No Destination Shoots listed.
      </div>
    )
  }

  return (
    <div>
      <ShootFilters
        shoots={destinationShoots}
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
            isOpen={groupId === selectedVenueId}
            userLocation={userLocation}
            onSelectShoot={onSelectShoot}
            variant="destination"
          />
        ))}
      </div>
    </div>
  )
}

DestList.propTypes = {
  shoots: PropTypes.array,
  selectedVenueId: PropTypes.string,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
}

export default DestList
