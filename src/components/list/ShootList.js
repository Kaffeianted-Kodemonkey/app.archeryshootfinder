// src/components/list/ShootList.js
import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { getDistance } from "../../utils/distance"
import ShootFilters from "./ShootFilters"

// Helper to derive status from unverified (for claiming/verification)
const getStatusInfo = shoot => {
  if (shoot.isVerified) {
    return { className: "bg-warning text-dark", label: "Not Verified" }
  }
  return { className: "bg-success text-white", label: "Verified" }
}

const humanizeEnum = enumStr => {
  if (!enumStr) return ""

  // Custom manual overrides for specific industry abbreviations
  const specialCases = {
    THREE_D: "3D",
    TAC: "TAC",
    ASA: "ASA",
    IBO: "IBO",
    NFAA: "NFAA",
    S3DA: "S3DA",
  }

  if (specialCases[enumStr]) return specialCases[enumStr]

  return enumStr
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Helper for short date (Month Day or range)
const formatDateShort = (start, end) => {
  const s = new Date(`${start}T00:00:00`)
  const e = new Date(`${end || start}T00:00:00`)

  if (s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }
  return `${s.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${e.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
}

// Helper for registration button label
const getRegLabel = url => {
  if (!url) return null
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.includes("eventbrite")) return "Register on Eventbrite"
  if (lowerUrl.includes("facebook")) return "Vendor Reg on Facebook"
  return "Register"
}

const ShootList = ({
  shoots = [],
  userLocation,
  // onSort,
  sortField = "date",
  sortDirection = "asc",
  onSelectShoot,
}) => {
  // Sort shoots based on current sort state (unchanged)
  const sortedShoots = React.useMemo(() => {
    return [...shoots].sort((a, b) => {
      let aVal, bVal
      switch (sortField) {
        case "name":
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        case "date":
          aVal = new Date(a.date)
          bVal = new Date(b.date)
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        case "distance":
          if (!userLocation || !a.location || !b.location) return 0
          aVal = getDistance(userLocation, a.location)
          bVal = getDistance(userLocation, b.location)
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        case "venue":
          aVal = a.venue?.name?.toLowerCase() || ""
          bVal = b.venue?.name?.toLowerCase() || ""
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        default:
          return 0
      }
    })
  }, [shoots, sortField, sortDirection, userLocation])

  // All hooks must be here — before any early returns
  const [filteredShoots, setFilteredShoots] = React.useState(shoots)
  const [selectedVenueId, setSelectedVenueId] = React.useState(null)

  if (sortedShoots.length === 0) {
    return (
      <div className="alert alert-info">
        No shoots available here. Check the Upcoming tab for future events.
      </div>
    )
  }

  // Group the FILTERED shoots by venue (this is the key one-line change)
  const grouped = filteredShoots.reduce((acc, shoot) => {
    const vid = shoot.venue?.venueId || shoot.venueId || "unknown"
    if (!acc[vid]) acc[vid] = []
    acc[vid].push(shoot)
    return acc
  }, {})

  const venues = Object.entries(grouped)

  return (
    <div className="flex-wrap">
      {/* Only ONE filter bar at the top */}
      <ShootFilters
        shoots={shoots}
        onFilteredChange={setFilteredShoots}
        userLocation={userLocation}
      />
      <div className="accordion accordion-flush" id="shootAccordion">
        {venues.map(([venueId, venueShoots], vIndex) => {
          const isOpen = venueId === selectedVenueId
          // Prefer a shoot that has entryFee or pricing so the cost section shows real data
          // Pick a shoot that actually has pricing info so the cost section shows real data
          const first =
            venueShoots.find(
              s =>
                (s.entryFee != null && s.entryFee !== "") ||
                (Array.isArray(s.pricing) && s.pricing.length > 0)
            ) || venueShoots[0]

          const venue = first.venue || {}
          const loc =
            first.useVenueLocation !== false && venue.location
              ? venue.location
              : first.shootLocation
          const cityState =
            loc?.city && loc?.state ? `${loc.city}, ${loc.state}` : "TBD"

          const status = getStatusInfo(first)
          const regLabel = getRegLabel(first.registrationUrl)

          return (
            <div className="accordion-item" key={venueId}>
              <h2 className="accordion-header" id={`heading-${vIndex}`}>
                <button
                  className={`accordion-button ${
                    isOpen ? "" : "collapsed"
                  } bg-success-subtle border border-2 border-success shadow-none focus-ring-0`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${vIndex}`}
                  aria-expanded={isOpen}
                  aria-controls={`collapse-${vIndex}`}
                >
                  {/* Row 1: Badges (left) + Venue name (right) */}
                  <div className="w-100">
                    {/* Row 1: Badges (left) + Venue name (right) — name slides under on mobile */}
                    <div className="row align-items-center mb-1">
                      <div className="col-12 col-md-auto d-flex gap-2 mb-1 mb-md-0">
                        <span className="badge bg-secondary">
                          {humanizeEnum(first.shootFormat?.[0])}
                        </span>
                        <span className={`badge ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Total shoots (left) + Date / City / Distance (right) */}
                    <div className="row mt-2 small text-muted">
                      <div className="col-12 md-2">
                        <strong className="fs-5">
                          {venue.vname || "Unknown Venue"}
                        </strong>
                      </div>
                    </div>
                    {/* Row 2: Total shoots (left) + Date / City / Distance (right) */}
                    <div className="row mt-2 small text-muted">
                      <div className="col-12 col-md-auto mb-1 mb-md-0">
                        {venueShoots.length} Total Shoot
                        {venueShoots.length === 1 ? "" : "s"}
                      </div>
                      <div className="col-12 col-md">
                        {formatDateShort(first.date, first.endDate)} |{" "}
                        {cityState} |{" "}
                        {userLocation && loc?.lat && loc?.lng
                          ? `${getDistance(userLocation, loc).toFixed(1)} mi`
                          : "—"}
                      </div>
                    </div>
                  </div>
                </button>
              </h2>

              <div
                id={`collapse-${vIndex}`}
                className={`accordion-collapse collapse${
                  isOpen ? " show" : ""
                }`}
                aria-labelledby={`heading-${vIndex}`}
                data-bs-parent="#shootAccordion"
              >
                <div className="accordion-body">
                  <h3 className="fa-5">Registration Cost per Shooter</h3>
                  {/* Price table – prefers structured pricing, falls back to entryFee string */}
                  {first.entryFee ? (
                    // Plain text entry fee — NO table
                    <p className="fw-bold fs-5 mt-3">
                      Entry Fee: {first.entryFee}
                    </p>
                  ) : first.pricing && first.pricing.length > 0 ? (
                    // Structured pricing table only
                    <div className="resposive-table my-3">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Tickets</th>
                            <th>1 Day</th>
                            <th>2 Days</th>
                            <th>3 Days</th>
                            <th>4 Days*</th>
                          </tr>
                        </thead>
                        <tbody>
                          {first.pricing.map(priceTier => {
                            const tier = priceTier.tier
                            const options = priceTier.options || []
                            const getCost = days =>
                              options.find(o => o.days === days)?.cost ?? ""

                            return (
                              <tr key={tier}>
                                <th className="py-2">{tier}</th>
                                <td>${getCost(1)}</td>
                                <td>${getCost(2)}</td>
                                <td>${getCost(3)}</td>
                                <td>${getCost(4)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    // Neither value — plain TBD
                    <p className="fw-bold fs-5 mt-3">Entry Fee: TBD</p>
                  )}

                  {/* About Event */}
                  <h3 className="fs-5">
                    <strong>About the Event</strong>
                  </h3>
                  <p>{first.venue?.description}</p>

                  {/* Event Rules */}
                  <h3 className="fs-5">
                    <strong>Rules & Regulations</strong>
                  </h3>
                  <p>
                    General evet rules can be found on our landing page. [link
                    PDF]
                  </p>

                  {first.registrationUrl && (
                    <a
                      href={first.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-success me-2"
                    >
                      {getRegLabel(first.registrationUrl)}
                    </a>
                  )}

                  {first.venue?.slug && (
                    <Link
                      to={`/venues/${first.venue.slug}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Venue Details
                    </Link>
                  )}

                  {/* Dynamic table listing ALL shoots for this venue */}
                  <div className="resposive-table mt-3">
                    <div className="row ">
                      <div className="col">
                        {first.time && (
                          <h3 className="fs-5">
                            <strong>Shoots & Time:</strong> {first.time}
                          </h3>
                        )}
                      </div>
                    </div>
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          {/* <th width="45%">Shoot</th>*/}
                          <th className="fs-5">Date</th>
                          <th className="fs-5">Format</th>
                          <th className="fs-5">Location</th>
                          <th className="fs-5">Info</th>
                        </tr>
                      </thead>
                      <tbody>
                        {venueShoots.map((s, idx) => {
                          const sLoc =
                            s.useVenueLocation !== false && venue.location
                              ? venue.location
                              : s.shootLocation
                          const sCity =
                            sLoc?.city && sLoc?.state
                              ? `${sLoc.city}, ${sLoc.state}`
                              : "TBD"

                          return (
                            <React.Fragment key={s.id || idx}>
                              {/* New name row */}
                              <tr>
                                <td
                                  colSpan={4}
                                  className="fw-bold bg-info-subtle"
                                >
                                  {s.sname}
                                </td>
                              </tr>

                              {/* Normal data row */}
                              <tr>
                                <td>{formatDateShort(s.date, s.endDate)}</td>
                                <td>{s.shootFormat?.join(", ")}</td>
                                <td>{sCity}</td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => onSelectShoot?.(s)}
                                  >
                                    Map
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

ShootList.propTypes = {
  shoots: PropTypes.array,
  userLocation: PropTypes.object,
  //venueIdMapping: PropTypes.object,
  onSort: PropTypes.func,
  sortField: PropTypes.string,
  sortDirection: PropTypes.string,
  onSwitchToVenueTab: PropTypes.func,
}

export default ShootList
