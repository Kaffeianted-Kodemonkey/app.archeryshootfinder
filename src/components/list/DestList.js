import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import ShootFilters from "./ShootFilters"

const getStatusInfo = shoot => {
  if (shoot?.isVerified) {
    return { className: "bg-success text-white", label: "Verified" }
  }
  return { className: "bg-warning text-dark", label: "Not Verified" }
}

const formatDateShort = (start, end) => {
  const s = new Date(`${start}T00:00:00`)
  const e = new Date(`${end || start}T00:00:00`)

  // 1. Single-day event (e.g., "Jun 15")
  if (s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // 2. Multi-day event within the SAME month (e.g., "Jun 15 - 18")
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    const startStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `${startStr} - ${e.getDate()}`
  }

  // 3. Multi-day event spanning CROSS-months (e.g., "Jun 30 - Jul 2")
  return `${s.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${e.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
}
const DestList = ({
  shoots = [],
  selectedVenueId = null,
  userLocation,
  onSelectShoot,
}) => {
  // Filter the incoming shoots to show only destination events
  const destinationShoots = React.useMemo(() => {
    return shoots.filter(shoot => shoot?.isDestination === true)
  }, [shoots])

  const [filteredShoots, setFilteredShoots] = React.useState(destinationShoots)

  React.useEffect(() => {
    setFilteredShoots(destinationShoots)
  }, [destinationShoots])

  const venues = React.useMemo(() => {
    const grouped = filteredShoots.reduce((acc, shoot) => {
      const vid = shoot.venue?.venueId || shoot.venueId || "unknown"
      if (!acc[vid]) acc[vid] = []
      acc[vid].push(shoot)
      return acc
    }, {})
    return Object.entries(grouped)
  }, [filteredShoots])

  if (destinationShoots.length === 0) {
    return (
      <div className="alert alert-info text-center py-5 my-4">
        No Destination Shoots have been listed for the season.
      </div>
    )
  }

  return (
    <div>
      <ShootFilters
        shoots={destinationShoots}
        onFilteredChange={setFilteredShoots}
        userLocation={userLocation}
      />

      <div className="accordion accordion-flush" id="shootAccordion">
        {venues.map(([venueId, venueShoots], vIndex) => {
          const isOpen = venueId === selectedVenueId
          const first = venueShoots[0] || {}
          const venue = first.venue || {}
          const status = getStatusInfo(first)

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
                  <div className="w-100">
                    <div className="row align-items-center mb-1">
                      <div className="col-12 col-md-auto d-flex gap-2 mb-1 mb-md-0">
                        <span className="badge bg-secondary">
                          {first.shootFormat?.[0] || "3D"}
                        </span>
                        <span className={`badge ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <div className="row mt-2 small text-muted">
                      <div className="col-12">
                        <strong className="fs-5 text-dark">
                          {venue.vname || "Unknown Venue"}
                        </strong>
                      </div>
                    </div>
                    <div className="row mt-2 small text-muted">
                      <div className="col-12 col-md-auto mb-1 mb-md-0">
                        {formatDateShort(first.date, first.endDate)} — Total
                        Shoots in Series ({venueShoots.length})
                      </div>
                    </div>
                  </div>
                </button>
              </h2>

              <div
                id={`collapse-${vIndex}`}
                className={`accordion-collapse collapse${isOpen ? " show" : ""}`}
                aria-labelledby={`heading-${vIndex}`}
                data-bs-parent="#shootAccordion"
              >
                <div className="accordion-body border-2 border-start border-end border-success-subtle">
                  <h3 className="fs-5 fw-bold">Registration Cost per Shooter</h3>
                  <div className="table-responsive my-3">
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
                            // FIXED: Direct destructured mapping with clean default values if a cell is empty
                            const { tier, note, cost1Day, cost2Days, cost3Days, cost4Days } = priceTier;
                            const currencySymbol = first.currency === "CAD" ? "C$" : "$";

                            return (
                              <tr key={tier}>
                                <th className="py-2">
                                  <div>{tier}</div>
                                  {note && <small className="text-muted fw-normal">{note}</small>}
                                </th>
                                <td>{cost1Day ? `${currencySymbol}${cost1Day}` : "—"}</td>
                                <td>{cost2Days ? `${currencySymbol}${cost2Days}` : "—"}</td>
                                <td>{cost3Days ? `${currencySymbol}${cost3Days}` : "—"}</td>
                                <td>{cost4Days ? `${currencySymbol}${cost4Days}` : "—"}</td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <th className="py-2">Entry Fee</th>
                            <td colSpan={4}>{first.entryFee || "TBD"}</td>
                          </tr>
                        )}
                        <tr>
                          <th>PRIZES:</th>
                          <td colSpan={4}>{first.prizes || "None listed"}</td>
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

                  <h3 className="fs-5"><strong>About the Event</strong></h3>
                  <p>{venue.description || "No description provided."}</p>

                  <h3 className="fs-5"><strong>Rules & Regulations</strong></h3>
                  <p>General event rules can be found on our landing page.</p>

                  {first.registrationUrl && (
                    <a
                      href={first.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-success me-2"
                    >
                      Register Here
                    </a>
                  )}

                  {venue.slug && (
                    <Link
                      to={`/venues/${venue.slug}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Venue Details
                    </Link>
                  )}

                  <div className="table-responsive mt-3">
                    {first.time && (
                      <h3 className="fs-5 mb-2">
                        <strong>Shoots & Time:</strong> {first.time}
                      </h3>
                    )}
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
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
                            <React.Fragment key={s.shootId || idx}>
                              <tr>
                                <td colSpan={3} className="fw-bold bg-info-subtle">
                                  {s.sname}
                                </td>
                              </tr>
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
  selectedVenueId: PropTypes.string,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
}

export default DestList
