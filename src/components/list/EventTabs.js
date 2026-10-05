// src/components/list/EventTabs.js
import * as React from "react"
import PropTypes from "prop-types"
import ShootList from "./ShootList"
import DestList from "./DestList"
import AssocList from "./AssocList"

/**
 * Tabs: Events (all from today) | Destination | Associations
 * Current + Upcoming are merged into Events.
 */
const EventTabs = ({
  eventsShoots = [],
  destinationShoots = [],
  associationsShoots = [],
  userLocation,
  onSelectShoot,
  activeTab = "events",
  setActiveTab,
}) => {
  const handleTabClick = tab => {
    if (setActiveTab) setActiveTab(tab)
  }

  const renderContent = () => {
    if (activeTab === "destination") {
      return (
        <DestList
          shoots={destinationShoots}
          userLocation={userLocation}
          onSelectShoot={onSelectShoot}
        />
      )
    }

    if (activeTab === "association") {
      return (
        <AssocList
          shoots={associationsShoots}
          userLocation={userLocation}
          onSelectShoot={onSelectShoot}
        />
      )
    }

    // Default: Events (from today onward, non-destination)
    if (eventsShoots.length === 0) {
      return (
        <div className="alert alert-info text-center py-5 my-4">
          No upcoming events found.
        </div>
      )
    }

    return (
      <ShootList
        shoots={eventsShoots}
        userLocation={userLocation}
        onSelectShoot={onSelectShoot}
      />
    )
  }

  return (
    <section className="directory-section container-fluid">
      <div className="container-fluid mt-3 gx-0 p-0 px-0">
        <div className="row gx-0">
          <div className="col px-0">
            <ul
              className="nav nav-tabs border-0 mb-0 mx-0 px-0 px-md-1"
              role="tablist"
            >
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeTab === "events" ? "active" : ""}`}
                  onClick={() => handleTabClick("events")}
                >
                  Events ({eventsShoots.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeTab === "destination" ? "active" : ""}`}
                  onClick={() => handleTabClick("destination")}
                >
                  Destination ({destinationShoots.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
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
  eventsShoots: PropTypes.array,
  destinationShoots: PropTypes.array,
  associationsShoots: PropTypes.array,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
}

export default React.memo(EventTabs)
