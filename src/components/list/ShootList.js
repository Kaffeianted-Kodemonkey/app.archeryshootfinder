// src/components/list/ShootList.js
import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { getDistance } from "../../utils/distance"
//import { getLabel } from "../../data/pricingEnums" // Import for pricing labels
import ShootFilters from "./ShootFilters"

// Helper to derive status from unverified (for claiming/verification)
const getStatusInfo = shoot => {
  if (shoot.isVerified) {
    return { className: "bg-success text-white", label: "Verified" }
  }
  return { className: "bg-warning text-dark", label: "Not Verified" }
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

const ShootList = ({
  shoots = [],
  userLocation,
  //venueIdMapping = {},
  onSort,
  sortField = "date",
  sortDirection = "asc",
  onSwitchToVenueTab,
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
  }, [shoots, sortField, sortDirection, userLocation /* venueIdMapping */])
  const [filteredShoots, setFilteredShoots] = React.useState(shoots)

  if (sortedShoots.length === 0) {
    return (
      <div className="alert alert-info">
        No shoots available here. Check the Upcoming tab for future events.
      </div>
    )
  }

  const handleSort = field => {
    onSort(field)
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

  return (
    <div className="flex-wrap">
      <ShootFilters
        shoots={shoots}
        onFilteredChange={setFilteredShoots}
        userLocation={userLocation}
      />
      <div className="accordion accordion-flush" id="shootAccordion">
        {filteredShoots.map((shoot, index) => {
          const venue = shoot.venue || {}
          const loc =
            shoot.useVenueLocation !== false && venue.location
              ? venue.location
              : shoot.shootLocation

          const cityState =
            loc?.city && loc?.state ? `${loc.city}, ${loc.state}` : "TBD"

          const status = getStatusInfo(shoot)
          const regLabel = getRegLabel(shoot.registrationUrl)

          return (
            <div className="accordion-item" key={shoot.id || index}>
              <h2 className="accordion-header" id={`heading-${index}`}>
                <button
                  className="accordion-button collapsed bg-success-subtle border border-2 border-success shadow-none focus-ring-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${index}`}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div>
                      {/* Line 1: Shoot name */}
                      <strong className="fs-5">{shoot.name}</strong>

                      {/* Line 2: Date */}
                      <div>{formatDateShort(shoot.date, shoot.endDate)}</div>

                      {/* Line 3: Badges across the bottom */}
                      <div className="mt-1">
                        <span className="me-2 badge bg-secondary">
                          {humanizeEnum(shoot.shootFormat?.[0])}
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
                id={`collapse-${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${index}`}
                data-bs-parent="#shootAccordion"
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col">
                      <h3 className="fs-5">
                        <strong>Hosted by:</strong>
                        <span className="ms-2">
                          {venue.isClaimed ? (
                            <Link to={`/venues/${venue.slug}`}>
                              {venue.name}
                            </Link>
                          ) : (
                            venue.name
                          )}
                        </span>
                      </h3>
                    </div>
                    <hr />
                    <div className="col">
                      {/* Entry Fee display — supports both simple string and structured pricing */}
                      <h3 className="fs-5 mb-3">
                        <strong>Entry Fee:</strong>{" "}
                        {shoot.pricing && shoot.pricing.length > 0
                          ? shoot.pricing
                              .map(p => {
                                const costs =
                                  p.options?.map(o => o.cost).filter(Boolean) ||
                                  []
                                if (costs.length === 0) return null
                                const min = Math.min(...costs)
                                const max = Math.max(...costs)
                                return `${p.tier}: $${min}${
                                  min !== max ? `–$${max}` : ""
                                }`
                              })
                              .filter(Boolean)
                              .join(" • ")
                          : shoot.entryFee || "TBD"}
                      </h3>
                      <h3 className="fs-6 mb-3">
                        <strong>Prizes:</strong> {shoot.prizes}
                      </h3>
                    </div>
                  </div>
                  {/* About Event */}
                  <h3 className="fs-5">
                    <strong>About the Event</strong>
                  </h3>
                  <p>{shoot.description}</p>

                  {/* Event Rules */}
                  <h3 className="fs-5">
                    <strong>Rules & Regulations</strong>
                  </h3>
                  <p>
                    General evet rules can be found on our landing page. [link
                    PDF]
                  </p>

                  <div className="resposive-table mt-3">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th className="fs-5">Date/Time</th>
                          <th className="fs-5">Location</th>
                          <th className="fs-5">Info</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Shoot name row — spans all 4 columns */}
                        <tr>
                          <td colSpan={4} className="fw-bold bg-light">
                            {shoot.name}
                          </td>
                        </tr>

                        {/* Data row */}
                        <tr>
                          <td>
                            {formatDateShort(shoot.date, shoot.endDate)}
                            <br />
                            {shoot.time || "TBD"}
                          </td>
                          <td>{cityState}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => onSelectShoot?.(shoot)}
                            >
                              Map
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Move this to the Landing Page */}
                  {/* <div className="row">*/}
                  {/* Bow Type */}
                  {/* <div className="col">
                      <h3 className="fs-5">
                        <strong>Bow Type:</strong>
                      </h3>
                      <ul>
                        {shoot.bowTypes?.map(bt => (
                          <li>
                            <span key={bt} className="me-1">
                              {bt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>*/}
                  {/* Shoot Format */}
                  {/* <div className="col">
                      <h3 className="fs-5">
                        <strong>Shoot Format</strong>
                      </h3>
                      <ul>
                        {shoot.shootFormat?.map(bt => (
                          <li>
                            <span key={bt} className="me-1">
                              {bt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>*/}
                  {/* </div>
                  <div className="row">*/}
                  {/* Shoot Class */}
                  {/* <div className="col">
                      <h3 className="fs-5">
                        <strong>Shoot Class</strong>
                      </h3>
                      <ul>
                        {shoot.shootClass?.map(bt => (
                          <li>
                            <span key={bt} className="me-1">
                              {bt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>*/}
                  {/* Skill Class */}
                  {/* <div className="col">
                      <h3 className="fs-5">
                        <strong>Skill Level</strong>
                      </h3>
                      <ul>
                        {shoot.skillLevel?.map(bt => (
                          <li>
                            <span key={bt} className="me-1">
                              {bt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>*/}
                  {/* <div className="row">
                    <div className="col">
                      <h3 className="fs-5">
                        <strong>Terrain</strong>
                      </h3>
                      <ul>
                        {shoot.terrain?.map(bt => (
                          <li>
                            <span key={bt} className="me-1">
                              {bt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col">
                      <h3 className="fs-5">
                        <strong>Amenities</strong>
                      </h3>
                      <ul>
                        {shoot.amenities?.map(bt => (
                          <li>
                            <span key={bt} className="me-1">
                              {bt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>*/}
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
  onSelectShoot: PropTypes.func,
}

export default ShootList
