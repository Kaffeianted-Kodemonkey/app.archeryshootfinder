// this componande runs the tabs
// src/components/list/tabs.js
import * as React from "react"
import PropTypes from "prop-types"
import ShootList from "./ShootList"
import VenueList from "./VenueList"
import DestList from "./DestList"

const toggleDirection = (currentField, currentDir) => {
  if (currentField !== "name") return "asc"
  return currentDir === "asc" ? "desc" : "asc"
}

const Tabs = ({
  shoots,
  venues,
  userLocation,
  onSelectShoot,
  currentShoots: propCurrentShoots,
  upcomingShoots: propUpcomingShoots,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  selectedVenueId: propSelectedVenueId,
  setSelectedVenueId: propSetSelectedVenueId,
  showRegionalBanner,
  userState,
  displayCurrentShoots: propDisplayCurrentShoots,
  displayUpcomingShoots: propDisplayUpcomingShoots,
  visibleTabs = ["current", "upcoming", "destination", "venue"], // default = all tabs
}) => {
  const [localActiveTab, setLocalActiveTab] = React.useState("current")
  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab
  const setActiveTabFunc = propSetActiveTab || setLocalActiveTab

  const [shootSortField, setShootSortField] = React.useState("date")
  const [shootSortDirection, setShootSortDirection] = React.useState("asc")
  const [venueSortField, setVenueSortField] = React.useState("name")
  const [venueSortDirection, setVenueSortDirection] = React.useState("asc")
  const [showUnclaimed, setShowUnclaimed] = React.useState(true)

  const venueIdMapping = React.useMemo(
    () =>
      (venues || []).reduce((acc, venue) => {
        acc[venue.id] = venue
        return acc
      }, {}),
    [venues]
  )

  const destinationShoots = React.useMemo(
    () => (shoots || []).filter(s => s.isDestination === true),
    [shoots]
  )

  const shootsForCurrent = propCurrentShoots || []
  const shootsForUpcoming = propUpcomingShoots || []

  const originalCurrentCount = propCurrentShoots?.length || 0
  const originalUpcomingCount = propUpcomingShoots?.length || 0

  const computedFilteredVenues = React.useMemo(() => {
    let filtered = venues || []
    return filtered.sort((a, b) => {
      let aVal, bVal
      switch (venueSortField) {
        case "name":
          aVal = (a.vname || "").toLowerCase()
          bVal = (b.vname || "").toLowerCase()
          break
        case "location":
          aVal = `${a.location?.city || ""}, ${
            a.location?.state || ""
          }`.toLowerCase()
          bVal = `${b.location?.city || ""}, ${
            b.location?.state || ""
          }`.toLowerCase()
          break
        case "venueType":
          aVal = a.venueType?.toLowerCase() || ""
          bVal = b.venueType?.toLowerCase() || ""
          break
        default:
          return 0
      }
      if (aVal < bVal) return venueSortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return venueSortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [venues, venueSortField, venueSortDirection])

  const filteredVenues = computedFilteredVenues

  const handleVenueSort = field => {
    const newDir = toggleDirection(venueSortField, venueSortDirection)
    setVenueSortField(field)
    setVenueSortDirection(newDir)
  }

  const TabHeader = React.memo(() => (
    <div className="container-fluid mt-3 gx-0 p-0 px-0">
      <div className="row gx-0">
        <div className="col px-0">
          <ul
            className="nav nav-tabs border-0 mb-0 mx-0 px-0 px-md-1"
            role="tablist"
          >
            {visibleTabs.includes("current") && (
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "current" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (propSetSelectedVenueId) propSetSelectedVenueId(null)
                    setActiveTabFunc("current")
                  }}
                >
                  Current ({originalCurrentCount})
                </button>
              </li>
            )}

            {visibleTabs.includes("upcoming") && (
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "upcoming" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (propSetSelectedVenueId) propSetSelectedVenueId(null)
                    setActiveTabFunc("upcoming")
                  }}
                >
                  Upcoming ({originalUpcomingCount})
                </button>
              </li>
            )}

            {visibleTabs.includes("destination") && (
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "destination" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (propSetSelectedVenueId) propSetSelectedVenueId(null)
                    setActiveTabFunc("destination")
                  }}
                >
                  Destination ({destinationShoots.length})
                </button>
              </li>
            )}

            {visibleTabs.includes("venue") && (
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "venue" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (propSetSelectedVenueId) propSetSelectedVenueId(null)
                    setActiveTabFunc("venue")
                  }}
                >
                  Venue ({filteredVenues.length})
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  ))

  // ... rest of the component stays the same (renderContent function etc.)
  const renderContent = () => {
    if (activeTab === "destination") {
      return destinationShoots.length === 0 ? (
        <div className="alert alert-info text-center py-4 my-3 mx-0 px-0">
          No Destination Shoots have been listed for the season.
        </div>
      ) : (
        <DestList
          shoots={destinationShoots}
          selectedVenueId={propSelectedVenueId}
          onSelectShoot={onSelectShoot}
        />
      )
    }

    if (activeTab === "venue") {
      return filteredVenues.length === 0 ? (
        <div className="alert alert-info text-center py-4 my-3 mx-0 px-0">
          No venues found.
        </div>
      ) : (
        <VenueList
          allVenues={filteredVenues}
          location={userLocation}
          showUnclaimed={showUnclaimed}
          currentShoots={propCurrentShoots}
          upcomingShoots={propUpcomingShoots}
          destinationShoots={destinationShoots}
          onSort={handleVenueSort}
          sortField={venueSortField}
          sortDirection={venueSortDirection}
          setActiveTab={setActiveTabFunc}
          setSelectedVenueId={propSetSelectedVenueId}
        />
      )
    }

    const shoots =
      activeTab === "current"
        ? propDisplayCurrentShoots || shootsForCurrent
        : propDisplayUpcomingShoots || shootsForUpcoming

    return shoots.length === 0 ? (
      <div className="alert alert-info text-center py-4 my-3 mx-0 px-0">
        No shoots available.
      </div>
    ) : (
      <ShootList
        key={activeTab}
        shoots={shoots}
        userLocation={userLocation}
        venueIdMapping={venueIdMapping}
        onSelectShoot={onSelectShoot}
      />
    )
  }

  return (
    <section
      className="directory-section container-fluid"
      aria-labelledby="directory-heading"
    >
      <TabHeader />
      <div className="row gx-0 p-0 mx-0 px-0">
        <div className="col-12 px-0">
          <div className="list-scroll-container">{renderContent()}</div>
        </div>
      </div>
    </section>
  )
}

Tabs.propTypes = {
  totalCount: PropTypes.number,
  venues: PropTypes.array, // Updated to match index.js
  venueShootCounts: PropTypes.object,
  userLocation: PropTypes.object,
  currentShoots: PropTypes.array,
  upcomingShoots: PropTypes.array,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  onSelectShoot: PropTypes.func,
}

export default React.memo(Tabs) // Memo to prevent unnecessary re-renders
