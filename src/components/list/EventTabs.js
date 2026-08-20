// src/components/list/EventTabs.js
// ONLY shows Current, Upcoming, and Destination tabs.
// Still passes full venue data so shoot cards can show "who is hosting it"

import * as React from "react"
import PropTypes from "prop-types"
import ShootList from "./ShootList"
import DestList from "./DestList"

const EventTabs = ({
  currentShoots = [], // Preloaded global data array (used for count badge)
  upcomingShoots = [], // Upcoming global data array
  displayCurrentShoots = [], // ← READS SEARCH FILTERED RESULTS (Can be 0)
  displayUpcomingShoots = [], // Upcoming filtered results
  destinationShoots = [],
  userLocation,
  onSelectShoot,
  venueIdMapping,
  activeTab = "current", // Controlled by parent state
  setActiveTab, // Handled by parent reset function
}) => {
  const handleTabClick = tab => {
    if (setActiveTab) {
      setActiveTab(tab)
    }
  }

  const renderContent = () => {
    if (activeTab === "destination") {
      return destinationShoots.length === 0 ? (
        <div className="alert alert-info text-center py-5 my-4">
          No Destination Shoots have been listed for the season.
        </div>
      ) : (
        <DestList
          shoots={destinationShoots}
          userLocation={userLocation}
          onSelectShoot={onSelectShoot}
        />
      )
    }

    // Swapped to display variables so search queries filter lists down to 0 correctly
    const shootsToShow =
      activeTab === "current" ? displayCurrentShoots : displayUpcomingShoots

    return shootsToShow.length === 0 ? (
      <div className="alert alert-info text-center py-5 my-4">
        Nothing found.
      </div>
    ) : (
      <ShootList
        shoots={shootsToShow}
        userLocation={userLocation}
        venueIdMapping={venueIdMapping}
        onSelectShoot={onSelectShoot}
      />
    )
  }

  return (
    <section className="directory-section container-fluid">
      {/* Tab Navigation - Only 3 tabs */}
      <div className="container-fluid mt-3 gx-0 p-0 px-0">
        <div className="row gx-0">
          <div className="col px-0">
            <ul
              className="nav nav-tabs border-0 mb-0 mx-0 px-0 px-md-1"
              role="tablist"
            >
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "current" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("current")}
                >
                  Current ({currentShoots.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "upcoming" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("upcoming")}
                >
                  Upcoming ({upcomingShoots.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "destination" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("destination")}
                >
                  Destination ({destinationShoots.length})
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="row gx-0 p-0 mx-0 px-0">
        <div className="col-12 px-0">
          <div className="list-scroll-container">{renderContent()}</div>
        </div>
      </div>
    </section>
  )
}

EventTabs.propTypes = {
  currentShoots: PropTypes.array,
  upcomingShoots: PropTypes.array,
  displayCurrentShoots: PropTypes.array,
  displayUpcomingShoots: PropTypes.array,
  destinationShoots: PropTypes.array,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
  venueIdMapping: PropTypes.object,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
}

export default React.memo(EventTabs)
