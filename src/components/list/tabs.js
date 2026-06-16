// src/components/list/tabs.js
// this componande runs the tabs
import * as React from "react"
import PropTypes from "prop-types"
import ShootList from "./ShootList"
import VenueList from "./VenueList"
import DestList from "./DestList"

// Helper to toggle sort direction in lines 182
const toggleDirection = (currentField, currentDir) => {
  if (currentField !== "name") return "asc"
  return currentDir === "asc" ? "desc" : "asc"
}

// set Props
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
}) => {
  // Destructure activeTab and setActiveTab from props (with local fallback if undefined)
  const [localActiveTab, setLocalActiveTab] = React.useState("current")
  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab
  const setActiveTabFunc = propSetActiveTab || setLocalActiveTab

  // Local state for sorting and showUnclaimed
  const [shootSortField, setShootSortField] = React.useState("date")
  const [shootSortDirection, setShootSortDirection] = React.useState("asc")
  const [venueSortField, setVenueSortField] = React.useState("name") // sort logice 150-160ish
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

  // Prioritize props for shoots (full counts for tab headers)
  const shootsForCurrent = propCurrentShoots || []
  const shootsForUpcoming = propUpcomingShoots || []

  // Store the ORIGINAL unfiltered counts for tab headers
  const originalCurrentCount = propCurrentShoots?.length || 0
  const originalUpcomingCount = propUpcomingShoots?.length || 0

  // Filter shoots by selectedVenueId only when displaying the list
  const filteredShootsForDisplay = {
    current: propSelectedVenueId
      ? shootsForCurrent.filter(shoot => shoot.venueId === propSelectedVenueId)
      : shootsForCurrent,
    upcoming: propSelectedVenueId
      ? shootsForUpcoming.filter(shoot => shoot.venueId === propSelectedVenueId)
      : shootsForUpcoming,
  }

  // Compute filteredVenues locally (from venues prop, apply showUnclaimed if false)
  const computedFilteredVenues = React.useMemo(() => {
    let filtered = venues || []
    // Sort venues locally
    return filtered.sort((a, b) => {
      let aVal, bVal
      switch (venueSortField) {
        case "name":
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
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
  }, [venues, showUnclaimed, venueSortField, venueSortDirection])

  const filteredVenues = computedFilteredVenues

  // Venue sort handlers (local)
  const handleVenueSort = field => {
    const newDir = toggleDirection(venueSortField, venueSortDirection)
    setVenueSortField(field)
    setVenueSortDirection(newDir)
  }

  // Shoot sort handlers (local, but ShootList handles its own sorting via props)
  const handleShootSort = field => {
    const newDir = toggleDirection(shootSortField, shootSortDirection)
    setShootSortField(field)
    setShootSortDirection(newDir)
  }

  // Toggle showUnclaimed (local)
  const toggleShowUnclaimed = () => setShowUnclaimed(!showUnclaimed)

  // Tab header - Single row, stable
  const TabHeader = React.memo(() => (
    <div className="container-fluid mt-2 gx-0 p-0 px-0">
      <div className="row gx-0">
        <div className="col px-0">
          <ul
            className="nav nav-tabs border-0 mb-0 mx-0 px-0 px-md-1"
            id="main-tabs"
            role="tablist"
            aria-label="Switch between current, upcoming shoots, and venues"
          >
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "current" ? "active" : ""
                }`}
                onClick={() => {
                  if (propSetSelectedVenueId) propSetSelectedVenueId(null)
                  setActiveTabFunc("current")
                }}
                aria-selected={activeTab === "current"}
                aria-controls="current-shoots"
              >
                Current ({originalCurrentCount})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "upcoming" ? "active" : ""
                }`}
                onClick={() => {
                  if (propSetSelectedVenueId) propSetSelectedVenueId(null)
                  setActiveTabFunc("upcoming")
                }}
                aria-selected={activeTab === "upcoming"}
                aria-controls="upcoming-shoots"
              >
                Upcoming ({originalUpcomingCount})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "destination" ? "active" : ""
                }`}
                onClick={() => {
                  if (propSetSelectedVenueId) propSetSelectedVenueId(null)
                  setActiveTabFunc("destination")
                }}
                aria-selected={activeTab === "destination"}
                aria-controls="destination-list"
              >
                Destination ({destinationShoots.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link w-100 ${
                  activeTab === "venue" ? "active" : ""
                }`}
                onClick={() => {
                  if (propSetSelectedVenueId) propSetSelectedVenueId(null)
                  setActiveTabFunc("venue")
                }}
                aria-selected={activeTab === "venue"}
                aria-controls="venues-list"
              >
                Venue ({filteredVenues.length})
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ))

  // Render content - Direct like Venue, with logs
  const renderContent = () => {
    if (activeTab === "destination") {
      return destinationShoots.length === 0 ? (
        <div className="alert alert-info text-center py-4 my-3 mx-0 px-0">
          No Destination Shoots have been listed for the season.
        </div>
      ) : (
        <DestList
          key={activeTab}
          shoots={destinationShoots}
          selectedVenueId={propSelectedVenueId}
          onSelectShoot={onSelectShoot}
        />
      )
    }

    if (activeTab === "venue") {
      return filteredVenues.length === 0 ? (
        <div
          className="alert alert-info text-center py-4 my-3 mx-0 px-0"
          role="alert"
          aria-live="polite"
        >
          No venues found.{" "}
          {showUnclaimed ? "" : "Toggle to show unclaimed venues."}
        </div>
      ) : (
        <VenueList
          allVenues={filteredVenues}
          location={userLocation}
          // venueMapping={venueMapping}
          showUnclaimed={showUnclaimed}
          currentShoots={shootsForCurrent}
          upcomingShoots={shootsForUpcoming}
          destinationShoots={destinationShoots}
          onSort={handleVenueSort}
          sortField={venueSortField}
          sortDirection={venueSortDirection}
          //venueShootCounts={venueShootCounts}
          setActiveTab={setActiveTabFunc}
          setSelectedVenueId={propSetSelectedVenueId}
        />
      )
    }

    if (activeTab === "current") {
      const shoots = propDisplayCurrentShoots || shootsForCurrent
      return shoots.length === 0 ? (
        <div
          className="alert alert-info text-center py-4 my-3 mx-0 px-0"
          role="alert"
          aria-live="polite"
        >
          No shoots in the next 21 days.
        </div>
      ) : (
        <>
          {showRegionalBanner && (
            <div className="alert alert-info py-2 mx-3 mt-2 small">
              No shoots within 50 miles of your location. Showing regional
              results for <strong>{userState}</strong>.
            </div>
          )}
          <ShootList
            key={activeTab}
            shoots={shoots}
            userLocation={userLocation}
            venueIdMapping={venueIdMapping}
            onSort={handleShootSort}
            sortField={shootSortField}
            sortDirection={shootSortDirection}
            onSwitchToVenueTab={() => setActiveTabFunc("venue")}
            onSelectShoot={onSelectShoot}
          />
        </>
      )
    }

    if (activeTab === "upcoming") {
      const shoots = propDisplayUpcomingShoots || shootsForUpcoming
      return shoots.length === 0 ? (
        <div
          className="alert alert-info text-center py-4 my-3 mx-0 px-0"
          role="alert"
          aria-live="polite"
        >
          No upcoming shoots beyond 21 days.
        </div>
      ) : (
        <>
          {showRegionalBanner && (
            <div className="alert alert-info py-2 mx-3 mt-2 small">
              No shoots within 50 miles of your location. Showing regional
              results for <strong>{userState}</strong>.
            </div>
          )}
          <ShootList
            key={activeTab}
            shoots={shoots}
            userLocation={userLocation}
            venueIdMapping={venueIdMapping}
            onSort={handleShootSort}
            sortField={shootSortField}
            sortDirection={shootSortDirection}
            onSwitchToVenueTab={() => setActiveTabFunc("venue")}
            onSelectShoot={onSelectShoot}
          />
        </>
      )
    }

    return <div>No content selected.</div>
  }

  return (
    <section
      name="directory"
      className="directory-section container-fluid"
      aria-labelledby="directory-heading"
      key="tabs-container" // Stable key
    >
      <TabHeader key="tab-header" />
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
