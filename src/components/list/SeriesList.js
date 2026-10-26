import * as React from "react"
import PropTypes from "prop-types"
import ShootFilters from "./ShootFilters"
import ShootAccordionItem from "./ShootAccordionItem"

const SeriesList = ({
  shoots = [],
  allShoots = shoots,
  onVisibleShootsChange,
  onSelectShoot,
  userLocation,
}) => {
  const [filteredShoots, setFilteredShoots] = React.useState(shoots)

  React.useEffect(() => {
    setFilteredShoots(shoots)
  }, [shoots])

  const seriesGroups = React.useMemo(() => {
    const grouped = filteredShoots.reduce((acc, shoot) => {
      const title = String(
        shoot.seriesName || shoot.sname || "Untitled series"
      )
        .trim()
        .replace(/\s+/g, " ")
      const key = `series-${title.toLowerCase()}`
      if (!acc[key]) acc[key] = []
      acc[key].push(shoot)
      return acc
    }, {})

    return Object.entries(grouped).map(([key, group]) => [
      key,
      group.sort((a, b) => new Date(a.date) - new Date(b.date)),
    ])
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
        No upcoming leagues or series found.
      </div>
    )
  }

  return (
    <div>
      <ShootFilters
        shoots={shoots}
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
        {seriesGroups.map(([groupId, groupShoots], index) => (
          <ShootAccordionItem
            key={groupId}
            venueId={groupId}
            venueShoots={groupShoots}
            vIndex={index}
            userLocation={userLocation}
            onSelectShoot={onSelectShoot}
            variant="series"
          />
        ))}
      </div>
    </div>
  )
}

SeriesList.propTypes = {
  shoots: PropTypes.array,
  allShoots: PropTypes.array,
  onVisibleShootsChange: PropTypes.func,
  onSelectShoot: PropTypes.func,
  userLocation: PropTypes.object,
}

export default SeriesList
