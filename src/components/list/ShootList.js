// src/components/list/ShootList.js
import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { getDistance } from "../../utils/distance";
import { getLabel } from "../../data/pricingEnums"; // Import for pricing labels

// Helper to derive status from unverified (for claiming/verification)
const getStatusInfo = (shoot) => {
  if (shoot.unverified) {
    return { className: "bg-warning text-dark", label: "Unverified" };
  }
  return { className: "bg-success text-white", label: "Verified" };
};

const ShootList = ({
  shoots = [],
  userLocation,
  venueMapping = {},
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
          aVal = venueMapping[a.venueId]?.name || "";
          bVal = venueMapping[b.venueId]?.name || "";
          return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        default:
          return 0;
      }
    });
  }, [shoots, sortField, sortDirection, userLocation, venueMapping]);

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
        const venue = shoot.venue || venueMapping[shoot.venueId] || {};
        const effectiveLoc = shoot.effectiveLocation || venue.location;
        const distance = userLocation && effectiveLoc ? `${getDistance(userLocation, effectiveLoc).toFixed(1)} mi` : "N/A";
        const cityState = `${effectiveLoc?.city || "N/A"}, ${effectiveLoc?.state || "N/A"}`;
        const status = getStatusInfo(shoot); // Derived from unverified
        const hasDescription = shoot.description && shoot.description.trim().length > 0;
        const formattedDate = formatDateShort(shoot.date, shoot.endDate);
        const regLabel = getRegLabel(shoot.registrationUrl);
        const isUnverified = shoot.unverified;
        const opacityClass = shoot.status !== "published" ? "opacity-75" : ""; // For WP draft/unpublished


        return (
          <div key={shoot.id} className={`accordion-item ${opacityClass}`}>
            <div className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="false"
                aria-controls={`collapse${index}`}
              >
                <div className="row w-100 align-items-center">
                  <div className="col-sm-3 col">
                    <span className={`badge ${status.className}`}>
                      <i className="bi bi-calendar-check me-1"></i>{status.label}
                    </span>
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
              <div className="accordion-body">
                {isUnverified && (
                  <div className="alert alert-warning small mb-3">
                    Shoot has not been claimed - Verify with Venue
                  </div>
                )}

                <div className="row">
                  <div className="col">
                    {/* Left Column Sched & Loc */}
                    <section>
                      <hr />
                      <h5>
                        <i className="bi bi-info-circle me-1"></i><strong>Schedule & Location</strong>
                      </h5>
                      <hr />
                      <p className="mb-1">
                        <strong>Date:</strong> {formattedDate}
                      </p>
                      <p className="mb-1">
                        <strong>Time:</strong> {shoot.time || "TBD"}
                      </p>
                      <p className="mb-1">
                        <strong>Venue:</strong> {venue.name || "N/A"}
                      </p>
                      <ul>
                        <li><strong>Location:</strong> {effectiveLoc?.address ? `${effectiveLoc.address}, ` : ''}{cityState || "N/A"} {effectiveLoc?.useVenueLocation === false ? `(Hosted by ${venue.name || 'Venue'})` : ''}</li>
                        {venue.contact?.phone ? (
                          <li>
                            <strong>Phone:</strong> <a href={`tel:${venue.contact.phone}`}>{venue.contact.phone}</a>
                          </li>
                        ) : (
                          <li><strong>Phone:</strong> N/A</li>
                        )}

                        {venue.contact?.email ? (
                          <li>
                            <strong>Email:</strong> <a href={`mailto:${venue.contact.email}`}>{venue.contact.email}</a>
                          </li>
                        ) : (
                          <li><strong>Email:</strong> N/A</li>
                        )}

                      </ul>
                    </section>
                    {/* Left Column: Event Details */}
                    <section className="mb-3">
                      <hr />
                      <h5>
                        <i className="bi bi-info-circle me-1"></i><strong>Shoot Details</strong>
                      </h5>
                      <hr />
                      <div className="row">

                        <p className="mb-2">
                          <strong>Terrain:</strong> {shoot.terrain || "N/A"}{' '}
                        </p>
                        <div className="col">
                          <p className="mb-1"><strong>Format:</strong></p>
                          <ul>
                            {shoot.shootFormat?.map((sf) => (
                              <li><span key={sf} className="me-1">
                                {sf}
                              </span></li>
                            ))}
                          </ul>
                        </div>
                        <div className="col">
                          <p className="mb-1"><strong>Class:</strong></p>
                          <ul>
                            {shoot.shootClass?.map((sc) => (
                              <li><span key={sc} className="me-1">
                                {sc}
                              </span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
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
                    </section>
                  </div>

                  {/* COLUMN RIGHT */}
                  <div className="col">
                    {/* Pricing */}
                    <section className="mb-3">
                      <hr />
                      <h5>
                        <i className="bi bi-currency-dollar me-1"></i><strong>Pricing - Teir</strong>
                      </h5>
                      <hr />
                      {/* <p>{shoot.entryFee && <p className="fw-bold mb-2">{shoot.entryFee}</p>} */}
                      <div className="table-responsive">
                        <table className="table table-sm table table-hover">
                          <tbody>
                            {shoot.pricing.tiers?.map((tier, i) => (
                              <tr key={i}>
                                <td>{tier.name}</td>
                                <td>
                                  {shoot.pricing.currency || "USD"} {tier.price || "N/A"}
                                </td>
                                <td>
                                  {tier.inclusions
                                    ?.map((inc) => getLabel(inc, "inclusions") || inc)
                                    .join(", ") || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="mb-2">
                        <small className="text-muted d-block mb-1">Discounts: {shoot.pricing.discounts}</small>
                      </p>
                      <p className="mb-2">
                        <strong>Prizes:</strong> {shoot.prizes}
                      </p>

                    </section>

                    {/* Right Column: Amenities */}
                    <section>
                      <hr />
                      <h5><strong>Amenities</strong></h5>
                      <hr />
                      <ul>
                        {shoot.amenities?.map((amts) => (
                          <li><span key={amts} className="me-1">
                            {amts}
                          </span></li>
                        ))}
                      </ul>
                    </section>

                    {/* Right Column: Organizer/Affiliations */}
                    <section>
                      <hr />
                      <h5><strong>Affiliations</strong></h5>
                      <hr />

                      {shoot.affiliation && (
                        <section className="mb-3">
                          <h5>Affiliations</h5>
                          <ul>
                            <li>{shoot.affiliation.map((a) => a.name).join(", ") || "N/A"}</li>
                          </ul>
                        </section>
                      )}
                    </section>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="d-flex gap-2 flex-column flex-sm-row mt-3 pt-3 border-top">
                  {!venue.isClaimed ? (
                    <button
                      onClick={onSwitchToVenueTab}
                      className="btn btn-md btn-primary"
                    >
                      Browse Venues
                    </button>
                  ) : (
                    <Link
                      to={`/venues/${venue.slug || shoot.venueId}`}
                      className="btn btn-md btn-primary"
                    >
                      View Venue Details
                    </Link>
                  )}
                  {regLabel && shoot.registrationUrl && (
                    <a
                      href={shoot.registrationUrl}
                      className="btn btn-md btn-success"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {regLabel}
                    </a>
                  )}
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
  venueMapping: PropTypes.object,
  onSort: PropTypes.func,
  sortField: PropTypes.string,
  sortDirection: PropTypes.string,
  onSwitchToVenueTab: PropTypes.func
};


export default ShootList;
