// src/components/list/VenueList.js
// Venue directory tab display
import * as React from "react"
import { Link } from "gatsby"
import { getDistance } from "../../utils/distance"

// venueType is a single string: "Club" | "Pro Shop" | "Range"
const venueTypeMapping = {
  Club: {
    icon: "bi-building",
    className: "bg-primary text-white",
    rowBg: "bg-light",
  },
  Range: {
    icon: "bi-bullseye",
    className: "bg-success text-white",
    rowBg: "bg-light",
  },
  "Pro Shop": {
    // ← must match DB exactly
    icon: "bi-shop",
    className: "bg-danger text-white",
    rowBg: "bg-light",
  },
  default: {
    icon: "bi-geo-alt",
    className: "bg-secondary text-white",
    rowBg: "bg-light",
  },
}

const VenueList = ({
  allVenues,
  shoots = [],
  location,
  showUnclaimed = false,
}) => {
  let venues = Array.isArray(allVenues) ? [...allVenues] : []

  if (venues.length === 0) {
    return (
      <div
        className="alert alert-info text-center py-4 my-3 mx-0 px-0"
        role="alert"
        aria-live="polite"
      >
        No venues found.{" "}
        {showUnclaimed ? "" : "Toggle to show unclaimed venues."}
      </div>
    )
  }

  if (location && location.lat && location.lng) {
    venues.sort(
      (a, b) =>
        getDistance(location, a.location) - getDistance(location, b.location)
    )
  } else {
    venues.sort((a, b) => a.vname.localeCompare(b.vname))
  }

  const getVenueShootCounts = venueId => {
    const venueShoots = shoots.filter(shoot => {
      const shootVenueId = shoot.venue?.venueId || shoot.venueId
      return String(shootVenueId) === String(venueId)
    })

    const isSeriesShoot = shoot =>
      Boolean(String(shoot.seriesName || "").trim()) ||
      shoot.isLeague === true ||
      shoot.isLeague === "true"
    const isDestinationShoot = shoot =>
      shoot.isDestination === true || shoot.isDestination === "true"

    return {
      eventCount: venueShoots.filter(
        shoot => !isDestinationShoot(shoot) && !isSeriesShoot(shoot)
      ).length,
      seriesCount: venueShoots.filter(isSeriesShoot).length,
      destinationCount: venueShoots.filter(
        shoot => isDestinationShoot(shoot) && !isSeriesShoot(shoot)
      ).length,
    }
  }

  return (
    <div className="row">
      {venues.map(venue => {
        const venueLocation = venue.location || {}
        const contact = venue.contact || {}
        const hours = Array.isArray(venue.hours) ? venue.hours : []
        const membership = String(venue.isMembership || "").trim()

        const distanceValue =
          location && venueLocation.lat != null && venueLocation.lng != null
            ? getDistance(location, venueLocation).toFixed(1)
            : "—"

        const distance = `${distanceValue} mi`
        const cityState =
          `${venueLocation.city || ""}, ${venueLocation.state || ""}`.trim() ||
          "No Location"

        // venueType is a string – look up mapping directly
        const normalizedVenueType = String(venue.venueType || "")
          .trim()
          .toLowerCase()
        const hostType =
          Object.keys(venueTypeMapping).find(
            type => type.toLowerCase() === normalizedVenueType
          ) || "Club"
        const mapping = venueTypeMapping[hostType]

        const isClaimed =
          venue.isClaimed === true ||
          venue.isClaimed === "true" ||
          venue.isClaimed === 1 ||
          venue.isClaimed === "1"

        const isNonProfit = venue.subscriptionPlan === "Freemium"

        const hasPhone = contact.phone && contact.phone.trim().length > 0
        const hasEmail = contact.email && contact.email.trim().length > 0

        const { eventCount, seriesCount, destinationCount } =
          getVenueShootCounts(venue.venueId)

        return (
          <div
            key={venue.id || venue.venueId}
            id={`venue-${venue.venueId}`}
            className="col-12 mb-3"
          >
            <div className={`card ${mapping.rowBg}`}>
              {/* Card Header */}
              <div className="card-header pt-3">
                <Link
                  to={
                    isClaimed
                      ? `/venues/${venue.venueId}`
                      : `/venues#venue-${venue.venueId}`
                  }
                  className={`badge ${mapping.className} text-decoration-none`}
                >
                  <i className={`bi ${mapping.icon} me-1`}></i>
                  {hostType}
                </Link>{" "}
                <h2 className="card-title fs-3 mt-2 mb-0">{venue.vname}</h2>
                <p className="fs-6 mt-2">
                  <i className="bi bi-geo-alt"></i> {distance} | {cityState}
                </p>
              </div>

              {/* Card Body */}
              <div className="card-body">
                <div className="row">
                  <div className="col-ms-12">
                    <h3 className="fs-5">
                      <strong>About the Venue</strong>
                    </h3>
                    <p>{venue.description || venue.bio || ""}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    {hours.length > 0 ? (
                      <p className="card-text mb-1">
                        <strong>Hours:</strong>
                        {hours.map((schedule, index) => {
                          const days = Array.isArray(schedule.day)
                            ? schedule.day.join(", ")
                            : schedule.day
                          const time = [schedule.open, schedule.close]
                            .filter(Boolean)
                            .join(" - ")

                          return (
                            <React.Fragment key={`${days || "hours"}-${index}`}>
                              <br />
                              {days ? `${days}: ` : ""}
                              {time || "TBD"}
                            </React.Fragment>
                          )
                        })}
                      </p>
                    ) : (
                      <p className="card-text mb-1">
                        <strong>Hours:</strong> TBD
                      </p>
                    )}

                    {membership ? (
                      <p className="card-text mb-1">
                        <strong>Membership:</strong>{" "}
                        {/^(true|1)$/i.test(membership) ? (
                          <>
                            Required
                          </>
                        ) : /^(false|0)$/i.test(membership) ? (
                          "No membership required"
                        ) : (
                          membership
                        )}
                        {contact.membershipUrl && (
                          <a
                            href={contact.membershipUrl}
                            className="ms-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Join
                          </a>
                        )}
                      </p>
                    ) : (
                      contact.membershipUrl ? (
                        <p className="card-text mb-1">
                          <strong>Membership:</strong>{" "}
                          <a
                            href={contact.membershipUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Join
                          </a>
                        </p>
                      ) : (
                        <p className="card-text mb-1">
                          <strong>Membership:</strong> TBD
                        </p>
                      )
                    )}
                  </div>
                  <div className="col-sm-6">
                    <h3 className="fs-5">
                      <strong>Contact Info</strong>
                    </h3>
                    {hasPhone && (
                      <p className="card-text mb-1">
                        <strong>
                          <i
                            className="bi bi-telephone-outbound"
                            data-label="Phone"
                          ></i>
                        </strong>{" "}
                        <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                      </p>
                    )}
                    {hasEmail && (
                      <p className="card-text mb-1">
                        <strong>
                          <i
                            className="bi bi-envelope-arrow-up"
                            data-label="Email"
                          ></i>
                        </strong>{" "}
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </p>
                    )}
                  </div>
                </div>

                <hr />

                <div className="row">
                  <div className="col-sm-12">
                    <h3 className="fs-5">
                      <strong>Event listings:</strong>
                    </h3>

                    {eventCount > 0 ? (
                      <Link
                        to={`/events?activeTab=events&venueId=${encodeURIComponent(venue.venueId)}`}
                        className="btn btn-sm btn-link p-0 text-decoration-none"
                      >
                        ({eventCount}) Events
                      </Link>
                    ) : (
                      <span className="text-muted">(0) Events</span>
                    )}
                    <span className="text-muted"> | </span>
                    {seriesCount > 0 ? (
                      <Link
                        to={`/events?activeTab=series&venueId=${encodeURIComponent(venue.venueId)}`}
                        className="btn btn-sm btn-link p-0 text-decoration-none"
                      >
                        ({seriesCount}) Leagues &amp; Series
                      </Link>
                    ) : (
                      <span className="text-muted">(0) Leagues &amp; Series</span>
                    )}
                    <span className="text-muted"> | </span>
                    {destinationCount > 0 ? (
                      <Link
                        to={`/events?activeTab=destination&venueId=${encodeURIComponent(venue.venueId)}`}
                        className="btn btn-sm btn-link p-0 text-decoration-none"
                      >
                        ({destinationCount}) Destinations
                      </Link>
                    ) : (
                      <span className="text-muted">(0) Destinations</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="card-footer d-flex justify-content-between align-items-center">
                {isClaimed ? (
                  <>
                    <span className="text-success small">
                      <i className="bi bi-patch-check-fill"></i>{" "}
                      {isNonProfit ? "Verified Club" : "Verified Venue"}
                    </span>
                    <Link
                      to={`/venues/${venue.venueId}`}
                      className="btn btn-sm btn-success"
                    >
                      View Details
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-muted small">
                      <i className="bi bi-question-circle"></i> Unclaimed
                    </span>
                    <Link
                      to="/venue-feedback"
                      className="btn btn-sm btn-outline-warning"
                    >
                      Claim Listing
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default VenueList
