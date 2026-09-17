// src/components/list/DestList.js
import * as React from "react"
import PropTypes from "prop-types"
import ShootFilters from "./ShootFilters"
import ShootAccordionItem from "./ShootAccordionItem"

const DestList = ({ shoots = [], selectedVenueId = null, userLocation, onSelectShoot }) => {
  const destinationShoots = React.useMemo(() => shoots.filter(s => s?.isDestination === true), [shoots])
  const [filteredShoots, setFilteredShoots] = React.useState(destinationShoots)

  React.useEffect(() => { setFilteredShoots(destinationShoots) }, [destinationShoots])

  const venues = React.useMemo(() => {
    const grouped = filteredShoots.reduce((acc, s) => {
      const vid = s.venue?.venueId || s.venueId || "unknown"
      if (!acc[vid]) acc[vid] = []
      acc[vid].push(s)
      return acc
    }, {})
    return Object.entries(grouped)
  }, [filteredShoots])

  if (destinationShoots.length === 0) {
    return <div className="alert alert-info text-center py-5 my-4">No Destination Shoots listed.</div>
  }

  return (
    <div>
      <ShootFilters shoots={destinationShoots} onFilteredChange={setFilteredShoots} userLocation={userLocation} />
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

DestList.propTypes = {
  shoots: PropTypes.array,
  selectedVenueId: PropTypes.string,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
}

export default DestList
