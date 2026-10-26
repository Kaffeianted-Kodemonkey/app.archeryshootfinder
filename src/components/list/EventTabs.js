// src/components/list/EventTabs.js
import * as React from "react"
import PropTypes from "prop-types"
import ShootList from "./ShootList"
import DestList from "./DestList"
import SeriesList from "./SeriesList"

/**
 * Tabs: Events | Leagues & Series | Destination
 */
const EventTabs = ({
  eventsShoots = [],
  allEventsShoots = eventsShoots,
  destinationShoots = [],
  allDestinationShoots = destinationShoots,
  seriesShoots = [],
  allSeriesShoots = seriesShoots,
  userLocation,
  activeTab = "events",
  setActiveTab,
  onEventResultsChange,
  onDestinationResultsChange,
  onSeriesResultsChange,
  onSelectShoot,
}) => {
  const handleTabClick = tab => {
    if (setActiveTab) setActiveTab(tab)
  }

  const renderContent = () => {
    if (activeTab === "destination") {
      return (
        <DestList
          shoots={destinationShoots}
          allShoots={allDestinationShoots}
          onVisibleShootsChange={onDestinationResultsChange}
          onSelectShoot={onSelectShoot}
          userLocation={userLocation}
        />
      )
    }

    if (activeTab === "series") {
      return (
        <SeriesList
          shoots={seriesShoots}
          allShoots={allSeriesShoots}
          onVisibleShootsChange={onSeriesResultsChange}
          onSelectShoot={onSelectShoot}
          userLocation={userLocation}
        />
      )
    }

    // Default: Events (from today onward, non-destination)
    if (eventsShoots.length === 0 && allEventsShoots.length === 0) {
      return (
        <div className="alert alert-info text-center py-5 my-4">
          No upcoming events found.
        </div>
      )
    }

    return (
      <ShootList
        shoots={eventsShoots}
        allShoots={allEventsShoots}
        onVisibleShootsChange={onEventResultsChange}
        onSelectShoot={onSelectShoot}
        userLocation={userLocation}
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
                  className={`nav-link ${
                    activeTab === "events" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("events")}
                >
                  Events ({eventsShoots.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${
                    activeTab === "series" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("series")}
                >
                  Leagues &amp; Series ({seriesShoots.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
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
  allEventsShoots: PropTypes.array,
  destinationShoots: PropTypes.array,
  allDestinationShoots: PropTypes.array,
  seriesShoots: PropTypes.array,
  allSeriesShoots: PropTypes.array,
  userLocation: PropTypes.object,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  onEventResultsChange: PropTypes.func,
  onDestinationResultsChange: PropTypes.func,
  onSeriesResultsChange: PropTypes.func,
  onSelectShoot: PropTypes.func,
}

export default React.memo(EventTabs)
