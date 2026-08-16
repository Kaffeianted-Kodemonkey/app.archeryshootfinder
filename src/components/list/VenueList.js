// src/components/list/VenueList.js
// Poupers of this page: This is my venue directory tab disply.
import * as React from "react"
import { Link } from "gatsby"
import { getDistance } from "../../utils/distance"

// venueType mapping for icons and styles (uppercase enums)
const venueTypeMapping = {
  CLUB: {
    icon: "bi-building",
    className: "bg-primary text-white",
    rowBg: "bg-light",
  },
  RANGE: {
    icon: "bi-crosshairs",
    className: "bg-success text-white",
    rowBg: "bg-light",
  },
  PRO_SHOP: {
    icon: "bi-shop",
    className: "bg-danger text-white",
    rowBg: "bg-light",
  },
  ASSOCIATION: {
    icon: "bi-people",
    className: "bg-purple text-white",
    rowBg: "bg-light",
  },
  ORGANIZATION: {
    icon: "bi-star",
    className: "bg-warning text-dark",
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
  location,
  showUnclaimed = false,
  currentShoots = [],
  upcomingShoots = [],
  destinationShoots = [],
  setActiveTab,
  setSelectedVenueId,
}) => {
  let venues = Array.isArray(allVenues) ? [...allVenues] : []
  const allShoots = [...currentShoots, ...upcomingShoots, ...destinationShoots]

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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const horizon = new Date(today)
    horizon.setDate(today.getDate() + 21)
    horizon.setHours(23, 59, 59, 999)

    const venueShoots = allShoots.filter(s => {
      const vid = s.venue?.venueId || s.venueId
      return vid === venueId
    })

    let current = 0,
      upcoming = 0,
      destination = 0

    venueShoots.forEach(shoot => {
      if (shoot.isDestination) {
        destination++
      } else {
        const start = new Date(shoot.date)
        const end = shoot.endDate ? new Date(shoot.endDate) : start
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        if (start <= horizon && end >= today) current++
        else if (start > horizon) upcoming++
      }
    })

    return {
      currentCount: current,
      upcomingCount: upcoming,
      destinationCount: destination,
    }
  }

  return (
    <div className="row">
      {venues.map(venue => {
        const venueLocation = venue.location || {}
        const contact = venue.contact || {}
        //const equipment = venue.equipment || {}
        const hours = venue.hours || {}
        const membership = venue.membership || {}

        // Calculate distance from the USER (prop) to the VENUE
        const distanceValue =
          location && venueLocation.lat != null && venueLocation.lng != null
            ? getDistance(location, venueLocation).toFixed(1)
            : "—"

        const distance = `${distanceValue} mi`
        const cityState =
          `${venueLocation.city || ""}, ${venueLocation.state || ""}`.trim() ||
          "No Location"

        const mapping =
          venueTypeMapping[venue.venueType] || venueTypeMapping.default

        // FIXED: Robust isClaimed check (Mongo can return boolean, string, or number)
        const isClaimed =
          venue.isClaimed === true ||
          venue.isClaimed === "true" ||
          venue.isClaimed === 1 ||
          venue.isClaimed === "1"

        const isUnclaimed = !isClaimed
        const isNonProfit = venue.subscriptionPlan === "Freemium"

        const isPaidTier =
          venue.subscriptionPlan && venue.subscriptionPlan !== "Freemium"

        const hasPhone = contact.phone && contact.phone.trim().length > 0
        const hasEmail = contact.email && contact.email.trim().length > 0

        // Inside your venues.map loop:
        const { currentCount, upcomingCount, destinationCount } =
          getVenueShootCounts(venue.venueId)

        const totalShoots = currentCount + upcomingCount

        return (
          <div key={venue.id} className="col-12 mb-3">
            <div className={`card ${mapping.rowBg}`}>
              {/* Card Header starts here */}
              <div className="card-header pt-3">
                <span className={`badge ${mapping.className}`}>
                  <i className={`bi ${venue.icon || mapping.icon} me-1`}></i>
                  {venue.venueType}
                </span>{" "}
                <h2 className="card-title fs-3 mt-2 mb-0">{venue.vname}</h2>
                <p className="fs-6 mt-2">
                  <i className="bi bi-geo-alt"></i> {distance} | {cityState}
                </p>
              </div>
              {/* Card Body starts here */}
              <div className="card-body">
                <div className="row">
                  <div className="col-ms-12">
                    <h3 className="fs-5">
                      <strong>About the Venue</strong>
                    </h3>
                    <p>{venue.description}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    {hours && (hours.weekday || hours.weekend) ? (
                      <p className="card-text mb-1">
                        <strong>Hours:</strong>
                        <br />
                        Weekdays: {hours.weekday || "TBD"} <br />
                        Weekends: {hours.weekend || "TBD"}
                      </p>
                    ) : (
                      <p className="card-text mb-1">
                        <strong>Hours:</strong> TBD
                      </p>
                    )}

                    {membership && membership.required !== undefined ? (
                      <p className="card-text mb-1">
                        <strong>Membership:</strong>{" "}
                        {membership.required ? (
                          <>
                            Required
                            {membership.url && (
                              <a
                                href={membership.url}
                                className="ms-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Join
                              </a>
                            )}
                            {membership.details && ` - ${membership.details}`}
                          </>
                        ) : (
                          "No membership required"
                        )}
                      </p>
                    ) : (
                      <p className="card-text mb-1">
                        <strong>Membership:</strong> TBD
                      </p>
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
                      <strong>Number of Shoots:</strong>
                    </h3>

                    {currentCount > 0 ? (
                      <button
                        onClick={() => {
                          if (setSelectedVenueId && setActiveTab) {
                            setSelectedVenueId(venue.venueId)
                            setActiveTab("current")
                          }
                        }}
                        className="btn btn-sm btn-link p-0 text-decoration-none"
                      >
                        ({currentCount}) Current
                      </button>
                    ) : (
                      <span className="text-muted">(0) Current</span>
                    )}
                    <span className="text-muted"> | </span>
                    {upcomingCount > 0 ? (
                      <button
                        onClick={() => {
                          if (setSelectedVenueId && setActiveTab) {
                            setSelectedVenueId(venue.venueId)
                            setActiveTab("upcoming")
                          }
                        }}
                        className="btn btn-sm btn-link p-0 text-decoration-none"
                      >
                        ({upcomingCount}) Upcoming
                      </button>
                    ) : (
                      <span className="text-muted">(0) Upcoming</span>
                    )}
                    <span className="text-muted"> | </span>
                    {destinationCount > 0 ? (
                      <button
                        onClick={() => {
                          if (setSelectedVenueId && setActiveTab) {
                            setSelectedVenueId(venue.venueId)
                            setActiveTab("destination")
                          }
                        }}
                        className="btn btn-sm btn-link p-0 text-decoration-none"
                      >
                        ({destinationCount}) Destination
                      </button>
                    ) : (
                      <span className="text-muted">(0) Destination</span>
                    )}
                  </div>
                </div>
              </div>
              {/* Card Footer UI */}
              <div className="card-footer d-flex justify-content-between align-items-center">
                {isClaimed ? (
                  <>
                    <span className="text-success small">
                      <i className="bi bi-patch-check-fill"></i>{" "}
                      {isNonProfit ? "Verified Club" : "Verified Venue"}
                    </span>
                    <Link
                      to={`/venues/${venue.slug || venue.venueId}`}
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
                      to="/pricing"
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
