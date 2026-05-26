// src/components/list/ShootList.js
import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { getDistance } from "../../utils/distance";
import { getLabel } from "../../data/pricingEnums"; // Import for pricing labels

// Helper to derive status from unverified (for claiming/verification)
const getStatusInfo = (shoot) => {
  if (shoot.isVerified) {
    return { className: "bg-warning text-dark", label: "Not Verified" };
  }
  return { className: "bg-success text-white", label: "Verified" };
};

const ShootList = ({
  shoots = [],
  userLocation,
  //venueIdMapping = {},
  onSort,
  sortField = "date",
  sortDirection = "asc",
  onSwitchToVenueTab
}) => {
  // Sort shoots based on current sort state (unchanged)
  const sortedShoots = React.useMemo(() => {

    return [...shoots].sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case "date":
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        case "distance":
          if (!userLocation || !a.location || !b.location) return 0;
          aVal = getDistance(userLocation, a.location);
          bVal = getDistance(userLocation, b.location);
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        case "venue":
          aVal = a.venue?.name?.toLowerCase() || "";
          bVal = b.venue?.name?.toLowerCase() || "";
          return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        default:
          return 0;
      }
    });
  }, [shoots, sortField, sortDirection, userLocation, /* venueIdMapping */]);

  if (sortedShoots.length === 0) {
    return <div className="alert alert-info">No shoots available here. Check the Upcoming tab for future events.</div>;
  }

  const handleSort = (field) => {
    onSort(field);
  };

  // Helper for short date (Month Day or range)
  const formatDateShort = (start, end) => {
    const s = new Date(start);
    const e = new Date(end || start);
    if (s.toDateString() === e.toDateString()) {
      return s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${e.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  // Helper for registration button label
  const getRegLabel = (url) => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('eventbrite')) return 'Register on Eventbrite';
    if (lowerUrl.includes('facebook')) return 'Vendor Reg on Facebook';
    return 'Register';
  };


  return (
    <div className="accordion accordion-flush" id="shootAccordion">
      {sortedShoots.map((shoot, index) => {
        const venue = shoot.venue || {};
        //const effectiveLoc = shoot.useVenueLocation ? venue.location : shoot.shootLocation;
        const effectiveLoc = (shoot.shootLocation?.city || shoot.shootLocation?.address)
          ? shoot.shootLocation  // 1. Use Shoot location if it has a city or address
          : (venue?.location || { city: "TBD", state: "N/A" }); // 2. Otherwise use Venue, then TBD

        const distance = userLocation && effectiveLoc ? `${getDistance(userLocation, effectiveLoc).toFixed(1)} mi` : "N/A";
        const cityState = `${effectiveLoc?.city || "N/A"}, ${effectiveLoc?.state || "N/A"}`;
        //const status = getStatusInfo(shoot); // Derived from unverified
        const hasDescription = shoot.description && shoot.description.trim().length > 0;
        const formattedDate = formatDateShort(shoot.date, shoot.endDate);
        const regLabel = getRegLabel(shoot.registrationUrl);
        const isUnverified = shoot.isVerified;
        //const opacityClass = shoot.status !== "published" ? "opacity-75" : ""; // For WP draft/unpublished


        return (
          <div key={shoot.id} className="accordion-item">
            <div className="accordion-header border border-success">
              <button
                className="accordion-button collapsed bg-success-subtle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="false"
                aria-controls={`collapse${index}`}
              >
                <div className="row w-100 align-items-center">
                  <div className="col-sm-3 col">
                    {shoot.isVerified ? (
                      <span className="badge bg-success">
                        <i className="bi bi-patch-check-fill"></i> Verified
                      </span>
                    ) : (
                      <span className="badge bg-secondary">
                        <i className="bi bi-info-circle"></i> Unvaified
                      </span>
                    )}
                    <small className="d-block text-muted mt-2">{formattedDate}</small>
                    <small className="d-block mt-2">
                      <i className="bi bi-geo-alt me-1"></i> {distance} |{' '}
                      {cityState}
                    </small>
                  </div>
                  <div className="col-sm-9 col">
                    <h4 className="mb-1">{shoot.name}</h4>
                    <p className="mb-0 text-muted small text-truncate">
                      {hasDescription ? shoot.description : "No description available."}
                    </p>
                  </div>
                </div>
              </button>

            </div>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              data-bs-parent="#shootAccordion"
              aria-labelledby={`heading${index}`}
            >
              <div className="accordion-body bg-white">
                {!shoot.isVerified && (
                  <div className="alert alert-warning small mb-3">
                    Shoot is not veified - Shoot at your own risk
                  </div>
                )}
                {shoot.isDestination && (
                  <div className="row">
                    <div className="col text-left">
                      <h5><strong>Sponsors</strong></h5>
                    </div>
                    <div className="col-2 text-center">
                      <h5><strong>Influancers</strong></h5>
                    </div>
                  </div>
                )}

                {shoot.isDestination && (
                  <hr />
                )}
                {/* Price Teirs */}
                <div className="row">
                  <div className="col">
                    {/* Pricing */}
                    <div className="row">
                      <div className="col">
                        <h5>
                          <i className="bi bi-currency-dollar me-1"></i><strong>Pricing</strong>
                        </h5>
                      </div>
                      <div className="col-4">
                        {venue.isClaimed && (
                          <>
                            {/* 2. Show Registration ONLY if both isClaimed and isRegistration are true */}
                            {!shoot.isRegistration && (
                              <a
                                href={shoot.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-warning text-light"
                              >
                                Registration
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <hr />
                    {/* <p>{shoot.entryFee && <p className="fw-bold mb-2">{shoot.entryFee}</p>} */}
                    <div className="table-responsive">
                      <table className="table table-sm table table-hover">
                        <thead>
                          <tr>
                            <th>Tier</th>
                            <th>Cost</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shoot.pricing?.map((pLevel, i) => (
                            <tr key={i}>
                              <td>{pLevel.tier}</td>
                              <td>
                                {pLevel.cost ? `$${pLevel.cost} ${pLevel.currency || "USD"}` : "N/A"}
                              </td>
                              <td>
                                {pLevel.note || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mb-2">
                      <strong>Prizes:</strong> {shoot.prizes}
                    </p>
                  </div>
                </div>

                {/* Shoot Details */}
                <div className="row">
                  <hr />
                  <h5>
                    <i className="bi bi-info-circle me-1"></i><strong>Schedule & Location</strong>
                  </h5>
                  <hr />
                  <div className="col">
                    <p className="mb-1">
                      <strong>Date:</strong> {formattedDate}
                    </p>
                    <p className="mb-1">
                      <strong>Time:</strong> {shoot.time || "TBD"}
                    </p>
                    <p className="mb-1">
                      <strong>Venue:</strong> {shoot.isVerified ? (
                        <a
                          href={"/"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {venue.name}
                        </a>
                      ) : (
                        <>
                          {venue.name || "N/A"}
                        </>
                      )}

                      {/* {venue.name || "N/A"} */}
                    </p>
                    <ul>
                      <li><strong>Location:</strong> {effectiveLoc?.address ? `${effectiveLoc.address}, ` : ''}{cityState || "N/A"} {effectiveLoc?.useVenueLocation === false ? `(Hosted by ${venue.name || 'Venue'})` : ''}</li>
                      <li>
                        <strong>Phone:</strong> {venue.contact?.phone ? (<a href={`tel:${venue.contact.phone}`}>{venue.contact.phone}</a>
                        ) : (
                          "N/A"
                        )}
                      </li>
                      <li>
                        <strong>Email:</strong> {venue.contact?.email ? (<a href={`mailto:${venue.contact.email}`}>{venue.contact.email}</a>
                        ) : (
                          "N/A"
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <hr />
                    <h5><strong>Amenities</strong></h5>
                    <hr />
                    <ul>
                      {shoot.amenities?.map((amts) => (
                        <li><span key={amts} >
                          {amts}
                        </span></li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Terrain - Format - Class - Bow Type - Skill Levels */}
                <div className="row">
                  <hr />
                  <h5>
                    <i className="bi bi-info-circle me-1"></i><strong>Shoot Details</strong>
                  </h5>
                  <hr />
                  <div className="col">
                    <p className="mb-1"><strong>Terrain:</strong></p>
                    <ul>
                      {shoot.terrain?.map((sTerrain) => (
                        <li><span keys={sTerrain}>
                          {sTerrain}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="col">
                    <p className="mb-1"><strong>Format:</strong></p>
                    <ul>
                      {shoot.shootFormat?.map((sf) => (
                        <li><span key={sf}>
                          {sf}
                        </span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="col">
                    <p className="me-1"><strong>Class:</strong></p>
                    <ul>
                      {shoot.shootClass?.map((sc) => (
                        <li><span key={sc} className="me-1">
                          {sc}
                        </span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="col">
                    <p className="mb-1"><strong>Bow Type:</strong></p>
                    <ul>
                      {shoot.bowTypes?.map((bt) => (
                        <li><span key={bt} className="me-1">
                          {bt}
                        </span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="col">
                    <p className="mb-1">
                      <strong>Skill Level:</strong>
                    </p>
                    <ul>
                      {shoot.skillLevel?.map((sl) => (
                        <li> <span key={sl} className="me-1">
                          {sl}
                        </span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

ShootList.propTypes = {
  shoots: PropTypes.array,
  userLocation: PropTypes.object,
  //venueIdMapping: PropTypes.object,
  onSort: PropTypes.func,
  sortField: PropTypes.string,
  sortDirection: PropTypes.string,
  onSwitchToVenueTab: PropTypes.func
};


export default ShootList;
