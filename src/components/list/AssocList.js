import * as React from "react"
import PropTypes from "prop-types"
import ShootFilters from "./ShootFilters"

const getStatusInfo = shootsForAssoc => {
  const hasUnverified = shootsForAssoc.some(s => s?.isVerified === false)
  if (hasUnverified) {
    return { className: "bg-warning text-dark", label: "Contains Unverified" }
  }
  return { className: "bg-success text-white", label: "Verified" }
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

const AssocList = ({
  shoots = [],
  userLocation,
  onSelectShoot,
}) => {
  const [filteredShoots, setFilteredShoots] = React.useState(shoots)

  React.useEffect(() => {
    setFilteredShoots(shoots)
  }, [shoots])

  const groupedByAssociation = React.useMemo(() => {
    return filteredShoots.reduce((acc, shoot) => {
      const rawType = shoot.associationType
      const type = Array.isArray(rawType) ? (rawType[0] || "General") : (rawType || "General")

      if (!acc[type]) acc[type] = []
      acc[type].push(shoot)
      return acc
    }, {})
  }, [filteredShoots])

  if (shoots.length === 0) {
    return (
      <div className="alert alert-info text-center py-5 my-4">
        No Association Shoots have been listed for the season.
      </div>
    )
  }

  return (
    <div>
      <ShootFilters
        shoots={shoots}
        onFilteredChange={setFilteredShoots}
        userLocation={userLocation}
      />

      <div className="accordion accordion-flush" id="assocShootAccordion">
        {Object.entries(groupedByAssociation).map(([assocType, assocShoots], index) => {
          const firstShoot = assocShoots[0] || {}
          const status = getStatusInfo(assocShoots)

          return (
            <div className="accordion-item border mb-3 rounded shadow-sm" key={assocType}>
              <h2 className="accordion-header" id={`heading-${index}`}>
                <button
                  className="accordion-button collapsed bg-success-subtle border border-2 border-success shadow-none focus-ring-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${index}`}
                >
                  <div className="w-100">
                    <div className="row align-items-center mb-1">
                      <div className="col-12 col-md-auto d-flex gap-2 mb-1 mb-md-0">
                        {/* FIXED: Outputs clean, scraper-normalized formats instantly with zero overhead */}
                        <span className="badge bg-secondary">
                          {firstShoot.shootFormat || "3D"}
                        </span>
                        <span className={`badge ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <div className="row mt-2 small text-muted">
                      <div className="col-12">
                        <strong className="fs-4 text-dark">
                          {assocType} Association
                        </strong>
                      </div>
                    </div>
                    <div className="row mt-2 small text-muted">
                      <div className="col-12 col-md-auto mb-1 mb-md-0">
                        Total Scheduled Events in Circuit: ({assocShoots.length})
                      </div>
                    </div>
                  </div>
                </button>
              </h2>

              <div
                id={`collapse-${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${index}`}
                data-bs-parent="#assocShootAccordion"
              >
                <div className="accordion-body bg-white border-2 border-start border-end border-success-subtle">
                  <h3 className="fs-5 fw-bold">Circuit Overview</h3>
                  <p>Official scheduled events sanctioned under the rules of the {assocType} Association.</p>

                  <div className="table-responsive mt-4">
                    <table className="table table-bordered table-striped align-middle">
                      <thead>
                        <tr className="table-dark">
                          <th className="fs-6">Event Name</th>
                          <th className="fs-6">Date</th>
                          <th className="fs-6">Host Venue & Location</th>
                          <th className="fs-6 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assocShoots.map((s, idx) => {
                          const venue = s.venue || {}
                          const sLoc = s.useVenueLocation !== false && venue.location ? venue.location : s.shootLocation
                          const sCity = sLoc?.city && sLoc?.state ? `${sLoc.city}, ${sLoc.state}` : "TBD"

                          return (
                            <tr key={s.shootId || idx}>
                              <td className="fw-bold text-success">{s.sname}</td>
                              <td>{formatDateShort(s.date, s.endDate)}</td>
                              <td>
                                <div className="fw-bold text-dark">{venue.vname || "Unknown Venue"}</div>
                                <div className="small text-muted">{sCity}</div>
                              </td>
                              <td className="text-center">
                                <div className="d-flex gap-2 justify-content-center">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => onSelectShoot?.(s)}
                                  >
                                    Map
                                  </button>
                                  {s.registrationUrl && (
                                    <a
                                      href={s.registrationUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-success"
                                    >
                                      {getRegLabel(s.registrationUrl)}
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
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

AssocList.propTypes = {
  shoots: PropTypes.array,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
}

export default AssocList
