// src/components/list/EventTabs.js
import * as React from "react"
import PropTypes from "prop-types"
import ShootList from "./ShootList"
import DestList from "./DestList"
import AssocList from "./AssocList"

const EventTabs = ({
  currentShoots = [],
  upcomingShoots = [],
  displayCurrentShoots = [],
  displayUpcomingShoots = [],
  destinationShoots = [],
  associationsShoots = [], // 🌟 ACCEPT AS FLAT ARRAY FROM EVENT.JS
  userLocation,
  onSelectShoot,
  venueIdMapping,
  activeTab = "current",
  setActiveTab,
}) => {
  const handleTabClick = tab => {
    if (setActiveTab) {
      setActiveTab(tab)
    }
  }

  const renderContent = () => {
    // FIXED: Let DestList manage its own filtering and empty warning layouts
    if (activeTab === "destination") {
      return (
        <DestList
          shoots={destinationShoots}
          userLocation={userLocation}
          onSelectShoot={onSelectShoot}
        />
      )
    }

    // Updated tab state string keyword to singular "association"
    if (activeTab === "association") {
      return associationsShoots.length === 0 ? (
        <div className="alert alert-info text-center py-5 my-4">
          No Association Shoots have been listed for the season.
        </div>
      ) : (
        <AssocList
          shoots={associationsShoots} // 🌟 PASS FLAT ARRAY DOWN TO ASSOCLIST FOR REDUCTION
          userLocation={userLocation}
          onSelectShoot={onSelectShoot}
        />
      )
    }

    const shootsToShow = activeTab === "current" ? displayCurrentShoots : displayUpcomingShoots

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
      <div className="container-fluid mt-3 gx-0 p-0 px-0">
        <div className="row gx-0">
          <div className="col px-0">
            <ul className="nav nav-tabs border-0 mb-0 mx-0 px-0 px-md-1" role="tablist">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "current" ? "active" : ""}`}
                  onClick={() => handleTabClick("current")}
                >
                  Current ({currentShoots.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
                  onClick={() => handleTabClick("upcoming")}
                >
                  Upcoming ({upcomingShoots.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "destination" ? "active" : ""}`}
                  onClick={() => handleTabClick("destination")}
                >
                  Destination ({destinationShoots.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "association" ? "active" : ""}`}
                  onClick={() => handleTabClick("association")}
                >
                  Associations ({associationsShoots.length})
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

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
  associationsShoots: PropTypes.array,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
  venueIdMapping: PropTypes.object,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
}

export default React.memo(EventTabs)
