// src/components/list/DestList.js
import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import ShootFilters from "./ShootFilters"

const getStatusInfo = shoot => {
  if (shoot.isVerified) {
    return { className: "bg-warning text-dark", label: "Not Verified" }
  }
  return { className: "bg-success text-white", label: "Verified" }
}

const humanizeEnum = enumStr => {
  if (!enumStr) return ""
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
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

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

const getRegLabel = url => {
  if (!url) return null
  const lower = url.toLowerCase()
  if (lower.includes("eventbrite")) return "Register on Eventbrite"
  if (lower.includes("facebook")) return "Vendor Reg on Facebook"
  return "Register"
}

const DestList = ({
  shoots = [],
  selectedVenueId = null,
  userLocation,
  onSelectShoot,
}) => {
  const [filteredShoots, setFilteredShoots] = React.useState(shoots)

  React.useEffect(() => {
    setFilteredShoots(shoots)
  }, [shoots])

  if (shoots.length === 0) {
    return (
      <div className="alert alert-info">
        No Destination Shoots have been listed for the season.
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
    <div>
      {/* Filters sit above the accordion - they filter destinations inside the groups */}
      <ShootFilters
        shoots={shoots}
        onFilteredChange={setFilteredShoots}
        userLocation={userLocation}
      />

      {/* Existing grouped accordion structure stays exactly the same */}
      <div className="accordion accordion-flush" id="shootAccordion">
        {venues.map(([venueId, venueShoots], vIndex) => {
          const isOpen = venueId === selectedVenueId
          const first = venueShoots[0]
          const venue = first.venue || {}
          const loc =
            first.useVenueLocation !== false && venue.location
              ? venue.location
              : first.shootLocation
          // const cityState =
          //   loc?.city && loc?.state ? `${loc.city}, ${loc.state}` : "TBD"

          const status = getStatusInfo(first)
          // const regLabel = getRegLabel(first.registrationUrl)

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
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div>
                      {/* Line 1: Venue name */}
                      <strong className="fs-5">{venue.name}</strong>

                      {/* Line 2: Date + total shoots count */}
                      <div>
                        {formatDateShort(first.date, first.endDate)} — Total
                        Shoots in Series ({venueShoots.length})
                      </div>

                      {/* Line 3: Badges across the bottom */}
                      <div className="mt-1">
                        <span className="me-2 badge bg-secondary">
                          {humanizeEnum(first.shootFormat?.[0])}
                        </span>
                        <span className={`badge ${status.className}`}>
                          {status.label}
                        </span>
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
                        {first.pricing && first.pricing.length > 0 ? (
                          first.pricing.map(priceTier => {
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
                          })
                        ) : (
                          <tr>
                            <th className="py-2">Entry Fee</th>
                            <td colSpan={4}>{first.entryFee || "TBD"}</td>
                          </tr>
                        )}

                        {/* Prizes row */}
                        <tr>
                          <th>PRIZES:</th>
                          <td colSpan={4}> {first.prizes}</td>
                        </tr>
                      </tbody>
                    </table>

                    <small>
                      <strong>
                        <em>
                          *Note: 4-Day passes are only applicable to extended
                          stops (ie. Seven Springs, PA or Brian Head, UT).
                        </em>
                      </strong>
                    </small>
                  </div>

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
                                  colSpan={3}
                                  className="fw-bold bg-info-subtle"
                                >
                                  {s.name}
                                </td>
                              </tr>

                              {/* Normal data row */}
                              <tr>
                                <td>{formatDateShort(s.date, s.endDate)}</td>
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

DestList.propTypes = {
  shoots: PropTypes.array,
  selectedVenueId: PropTypes.string, // or number, depending on your IDs
  onSelectShoot: PropTypes.func,
}

export default DestList
