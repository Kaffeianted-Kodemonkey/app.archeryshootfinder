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

  // Only shoots with an explicit groupId share a group heading.
  const eventGroups = React.useMemo(() => {
    const grouped = filteredShoots.reduce((acc, shoot) => {
      const groupId = String(shoot.groupId || shoot.group?.groupId || "").trim()
      if (groupId) {
        const key = `group-${groupId}`
        if (!acc[key]) acc[key] = []
        acc[key].push(shoot)
        return acc
      }

      const key = `shoot-${shoot.shootId || shoot.id}`
      acc[key] = [shoot]
      return acc
    }, {})
    return Object.entries(grouped).map(([key, group]) => [
      key,
      group,
      group[0]?.groupId || group[0]?.group?.groupId ? "group" : "events",
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
        {eventGroups.map(([groupId, groupShoots, variant], gIndex) => (
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
            variant={variant}
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
