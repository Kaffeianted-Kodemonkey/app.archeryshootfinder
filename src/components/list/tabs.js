// src/components/list/tabs.js
// this componande runs the tabs
import * as React from "react";
import PropTypes from "prop-types";
import ShootList from "./ShootList";
import VenueList from "./VenueList";


// Helper to toggle sort direction
const toggleDirection = (currentField, currentDir) => {
  if (currentField !== "name") return "asc";
  return currentDir === "asc" ? "desc" : "asc";
};

// Local venue mapping computation (from venues prop, like in SearchContext)
const computeVenueMapping = (venues) => {
  const typeMap = {
    range: { icon: 'bi-crosshairs', className: 'bg-success text-white', rowBg: 'bg-success-subtle', textColor: 'text-success' },
    'pro_shop': { icon: 'bi-shop', className: 'bg-danger text-white', rowBg: 'bg-danger-subtle', textColor: 'text-danger' },
    club: { icon: 'bi-building', className: 'bg-primary text-white', rowBg: 'bg-primary-subtle', textColor: 'text-primary' },
    association: { icon: 'bi-people', className: 'bg-info text-white', rowBg: 'bg-info-subtle', textColor: 'text-info' },
    organization: { icon: 'bi-star', className: 'bg-warning text-dark', rowBg: 'bg-warning-subtle', textColor: 'text-warning' },
    default: { icon: 'bi-geo-alt', className: 'bg-secondary text-white', rowBg: 'bg-light', textColor: 'text-secondary' }
  };
  venues.forEach(venue => {
    if (venue.venueType && (venue.icon || venue.iconColor)) {
      const base = typeMap[venue.venueType] || typeMap.default;
      typeMap[venue.venueType] = {
        ...base,
        icon: venue.icon || base.icon,
        className: venue.iconColor ? (
          venue.iconColor === '#28a745' ? 'bg-success text-white' :
            venue.iconColor === '#dc3545' ? 'bg-danger text-white' :
              venue.iconColor === '#007bff' ? 'bg-primary text-white' :
                venue.iconColor === '#6f42c1' ? 'bg-info text-white' :
                  venue.iconColor === '#fd7e14' ? 'bg-warning text-dark' :
                    'bg-secondary text-white'
        ) : base.className,
        rowBg: base.rowBg,
        textColor: base.textColor
      };
    }
  });
  return typeMap;
};

const Tabs = ({
  totalCount, // Keep for propTypes, but not used now
  venues, // From index.js (rawVenues renamed for consistency)
  rawShoots, // shootsWithVenues from index.js
  venueShootCounts,
  userLocation,
  currentShoots: propCurrentShoots, // Prioritize props
  upcomingShoots: propUpcomingShoots, // Prioritize props
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab
}) => {
  // Destructure activeTab and setActiveTab from props (with local fallback if undefined)
  const [localActiveTab, setLocalActiveTab] = React.useState('current');
  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const setActiveTabFunc = propSetActiveTab || setLocalActiveTab;

  // Local state for sorting and showUnclaimed (decoupled defaults - true to show all venues)
  const [shootSortField, setShootSortField] = React.useState("date");
  const [shootSortDirection, setShootSortDirection] = React.useState("asc");
  const [venueSortField, setVenueSortField] = React.useState("name");
  const [venueSortDirection, setVenueSortDirection] = React.useState("asc");
  const [showUnclaimed, setShowUnclaimed] = React.useState(true);

  // Compute venueMapping locally
  const venueMapping = React.useMemo(() => computeVenueMapping(venues || []), [venues]);
  const venueIdMapping = React.useMemo(() =>
    (venues || []).reduce((acc, venue) => {
      acc[venue.id] = venue;
      return acc;
    }, {}),
    [venues]);

  // Prioritize props for shoots
  const shootsForCurrent = propCurrentShoots || [];
  const shootsForUpcoming = propUpcomingShoots || [];

  // Compute filteredVenues locally (from venues prop, apply showUnclaimed if false)
  const computedFilteredVenues = React.useMemo(() => {
    let filtered = venues || [];
   
    // Sort venues locally
    return filtered.sort((a, b) => {
      let aVal, bVal;
      switch (venueSortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'location':
          aVal = `${a.location?.city || ''}, ${a.location?.state || ''}`.toLowerCase();
          bVal = `${b.location?.city || ''}, ${b.location?.state || ''}`.toLowerCase();
          break;
        case 'venueType':
          aVal = a.venueType?.toLowerCase() || '';
          bVal = b.venueType?.toLowerCase() || '';
          break;
        default:
          return 0;
      }
      if (aVal < bVal) return venueSortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return venueSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [venues, showUnclaimed, venueSortField, venueSortDirection]);

  const filteredVenues = computedFilteredVenues;

  // Venue sort handlers (local)
  const handleVenueSort = (field) => {
    const newDir = toggleDirection(venueSortField, venueSortDirection);
    setVenueSortField(field);
    setVenueSortDirection(newDir);
  };

  // Shoot sort handlers (local, but ShootList handles its own sorting via props)
  const handleShootSort = (field) => {
    const newDir = toggleDirection(shootSortField, shootSortDirection);
    setShootSortField(field);
    setShootSortDirection(newDir);
  };

  // Toggle showUnclaimed (local)
  const toggleShowUnclaimed = () => setShowUnclaimed(!showUnclaimed);

  // Tab header - Single row, stable
  const TabHeader = React.memo(() => (
    <div className="container-fluid mt-5 gx-0 p-0 px-0">
      <div className="row gx-0">
        <div className="col px-0">
          <ul className="nav nav-tabs border-0 mb-0 mx-0 px-0 px-md-3" id="main-tabs" role="tablist" aria-label="Switch between current, upcoming shoots, and venues">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "current" ? "active" : ""}`}
                onClick={() => setActiveTabFunc("current")}
                aria-selected={activeTab === "current"}
                aria-controls="current-shoots"
              >
                Current ({shootsForCurrent.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
                onClick={() => setActiveTabFunc("upcoming")}
                aria-selected={activeTab === "upcoming"}
                aria-controls="upcoming-shoots"
              >
                Upcoming ({shootsForUpcoming.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "venue" ? "active" : ""}`}
                onClick={() => setActiveTabFunc("venue")}
                aria-selected={activeTab === "venue"}
                aria-controls="venues-list"
              >
                Venues ({filteredVenues.length})
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ));

  // Render content - Direct like Venue, with logs
  const renderContent = () => {
    if (activeTab === "venue") {
      return filteredVenues.length === 0 ? (
        <div className="alert alert-info text-center py-4 my-3 mx-0 px-0" role="alert" aria-live="polite">
          No venues found. {showUnclaimed ? "" : "Toggle to show unclaimed venues."}
        </div>
      ) : (
        <VenueList
          venues={filteredVenues}
          location={userLocation}
          venueMapping={venueMapping}
          showUnclaimed={showUnclaimed}
          onSort={handleVenueSort}
          sortField={venueSortField}
          sortDirection={venueSortDirection}
          venueShootCounts={venueShootCounts}
        />
      );
    }

    if (activeTab === "current") {
      const shoots = shootsForCurrent;
      return shoots.length === 0 ? (
        <div className="alert alert-info text-center py-4 my-3 mx-0 px-0" role="alert" aria-live="polite">
          No shoots in the next 21 days.
        </div>
      ) : (
        <ShootList
          shoots={shoots}
          userLocation={userLocation}
          venueIdMapping={venueIdMapping}
          onSort={handleShootSort}
          sortField={shootSortField}
          sortDirection={shootSortDirection}
          onSwitchToVenueTab={() => setActiveTabFunc('venue')}
        />
      );
    }

    if (activeTab === "upcoming") {
      const shoots = shootsForUpcoming;
      return shoots.length === 0 ? (
        <div className="alert alert-info text-center py-4 my-3 mx-0 px-0" role="alert" aria-live="polite">
          No upcoming shoots beyond 21 days.
        </div>
      ) : (
        <ShootList
          shoots={shoots}
          userLocation={userLocation}
          venueIdMapping={venueIdMapping}
          onSort={handleShootSort}
          sortField={shootSortField}
          sortDirection={shootSortDirection}
          onSwitchToVenueTab={() => setActiveTabFunc('venue')}
        />

      );
    }

    return <div>No content selected.</div>;
  };

  return (
    <section
      name="directory"
      className="directory-section container-fluid"
      aria-labelledby="directory-heading"
      key="tabs-container"  // Stable key
    >
      <TabHeader key="tab-header" />
      <div className="row gx-0 p-0 mx-0 px-0">
        <div className="col-12 px-0">
          <div className="list-scroll-container">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

Tabs.propTypes = {
  totalCount: PropTypes.number,
  venues: PropTypes.array, // Updated to match index.js
  rawShoots: PropTypes.array,
  venueShootCounts: PropTypes.object,
  userLocation: PropTypes.object,
  currentShoots: PropTypes.array,
  upcomingShoots: PropTypes.array,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
};

export default React.memo(Tabs);  // Memo to prevent unnecessary re-renders
