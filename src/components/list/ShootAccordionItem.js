// src/components/list/ShootAccordionItem.js
// Shared accordion for Events (tournament/league) and Destination series.
import * as React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import { getDistance } from "../../utils/distance"
import {
  getStatusInfo,
  formatDateShort,
  getAssociationBadge,
} from "../../utils/shootUiHelpers"

function resolveLoc(shoot) {
  const venue = shoot?.venue || {}
  if (shoot?.useVenueLocation !== false && venue.location) return venue.location
  return (
    shoot?.effectiveLocation ||
    shoot?.location ||
    shoot?.shootLocation ||
    {}
  )
}

function venueLabel(shoot) {
  const v = shoot?.venue?.vname
  if (v && String(v).trim()) return v.trim()
  const loc = resolveLoc(shoot)
  if (loc.city && loc.state) return `${loc.city}, ${loc.state}`
  if (loc.city) return loc.city
  return "TBD"
}

function assocPrefix(associationType) {
  const label = getAssociationBadge?.(associationType)
  if (label) return label
  if (Array.isArray(associationType) && associationType[0])
    return associationType[0]
  if (typeof associationType === "string" && associationType)
    return associationType
  return null
}

function displayTitle(shoot, { includeAssoc = true } = {}) {
  const series = shoot.seriesName || shoot.sname || "Event"
  const assoc = includeAssoc ? assocPrefix(shoot.associationType) : null
  if (
    assoc &&
    !String(series).toUpperCase().startsWith(String(assoc).toUpperCase())
  ) {
    return `${assoc} – ${series}`
  }
  return series
}

function stopTitle(shoot) {
  const series = shoot.seriesName || ""
  const name = shoot.sname || series || "Event"
  if (series && name !== series) return name
  return name
}

function uniqueLocationKeys(shoots) {
  const keys = new Set()
  shoots.forEach(s => {
    const v = s.venue?.venueId || s.venueId || venueLabel(s)
    keys.add(String(v).toLowerCase())
  })
  return keys
}

function multiStateLabel(shoots) {
  const states = [
    ...new Set(
      shoots
        .map(s => resolveLoc(s).state)
        .filter(Boolean)
        .map(st => String(st).toUpperCase())
    ),
  ].sort()
  if (states.length === 0) return "Multi-state"
  if (states.length === 1) return states[0]
  if (states.length <= 4) return states.join(" · ")
  return "Multi-state"
}

function dateRangeLabel(shoots) {
  if (!shoots.length) return "TBD"
  const times = shoots
    .map(s => ({
      start: new Date(s.date),
      end: new Date(s.endDate || s.date),
    }))
    .filter(d => !Number.isNaN(d.start.getTime()))
  if (!times.length) return "TBD"
  times.sort((a, b) => a.start - b.start)
  const first = times[0]
  const last = times[times.length - 1]
  return formatDateShort(first.start, last.end)
}

function regButton(shoot) {
  const url = shoot.registrationUrl || shoot.registerUrl
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-success"
        onClick={e => e.stopPropagation()}
      >
        Reg
      </a>
    )
  }
  return <span className="text-muted small">Reg at event</span>
}

const ShootAccordionItem = ({
  venueId,
  venueShoots = [],
  vIndex,
  isOpen = false,
  userLocation,
  onSelectShoot,
  variant,
}) => {
  const shoots = Array.isArray(venueShoots) ? venueShoots : []
  const first =
    shoots.find(
      s =>
        (s.entryFee != null && s.entryFee !== "") ||
        (Array.isArray(s.pricing) && s.pricing.length > 0)
    ) ||
    shoots[0] ||
    {}

  const venue = first.venue || {}
  const loc = resolveLoc(first)

  // Must be inside the component — after first/venue exist
  const isVerified =
    first.isVerified === true ||
    first.isVerified === "true" ||
    venue.isClaimed === true ||
    venue.isClaimed === "true"

  const isLeagueGroup = first.isLeague === true || first.isLeague === "true"
  const isDestinationGroup =
    variant === "destination" ||
    first.isDestination === true ||
    first.isDestination === "true"

  const phoneNum =
    venue.contact?.phone ||
    venue.phone ||
    first.contact?.phone ||
    first.phone ||
    ""
  const emailAddr =
    venue.contact?.email ||
    venue.email ||
    first.contact?.email ||
    first.email ||
    ""
  const webLink =
    venue.contact?.website ||
    venue.website ||
    first.website ||
    first.eventListing ||
    ""

  const status = getStatusInfo?.(first) || {
    label: "Upcoming",
    className: "bg-secondary",
  }
  const assocLabel = assocPrefix(first.associationType)

  const title = displayTitle(first, {
    includeAssoc: !isDestinationGroup || !!assocLabel,
  })
  const whenLabel = isLeagueGroup
    ? shoots.length > 1
      ? `${shoots.length} sessions · Next: ${formatDateShort(first.date)}`
      : formatDateShort(first.date, first.endDate)
    : isDestinationGroup && shoots.length > 1
      ? dateRangeLabel(shoots)
      : formatDateShort(first.date, first.endDate)

  const whereLabel = isDestinationGroup
    ? multiStateLabel(shoots)
    : loc.city && loc.state
      ? `${loc.city}, ${loc.state}`
      : "TBD"

  const showDistance =
    !isDestinationGroup &&
    userLocation &&
    loc?.lat != null &&
    loc?.lng != null

  const locationKeys = uniqueLocationKeys(shoots)
  const showLocationCols = locationKeys.size > 1

  const leagueSummaryRow =
    isLeagueGroup && shoots.length > 0
      ? {
          schedule:
            shoots.length > 1
              ? `Recurring series · ${shoots.length} dates`
              : formatDateShort(first.date, first.endDate),
          name: displayTitle(first),
          shoot: first,
        }
      : null

  const headingId = `heading-${vIndex}`
  const collapseId = `collapse-${vIndex}`

  const badgeKind = isDestinationGroup
    ? "Destination"
    : isLeagueGroup
      ? "League"
      : "Tournament"

  return (
    <div className="accordion-item border mb-3 rounded shadow-sm">
      <h2 className="accordion-header" id={headingId}>
        <button
          className={`accordion-button ${isOpen ? "" : "collapsed"} bg-success-subtle border border-2 border-success shadow-none`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${collapseId}`}
          aria-expanded={isOpen}
          aria-controls={collapseId}
        >
          <div className="w-100 text-start">
            <div className="d-flex flex-wrap gap-2 mb-1">
              {assocLabel && (
                <span className="badge bg-primary text-white">{assocLabel}</span>
              )}
              <span className="badge bg-dark text-white">{badgeKind}</span>
              {status?.label && (
                <span className={`badge ${status.className || "bg-secondary"}`}>
                  {status.label}
                </span>
              )}
            </div>
            <div className="fs-4 fw-bold text-dark">{title}</div>
            <div className="small text-muted mt-1">
              <i className="bi bi-calendar-event me-1" />
              {whenLabel}
              {" · "}
              <i className="bi bi-geo-alt me-1" />
              {whereLabel}
              {showDistance &&
                ` · ${getDistance(userLocation, loc).toFixed(1)} mi`}
            </div>
          </div>
        </button>
      </h2>

      <div
        id={collapseId}
        className={`accordion-collapse collapse${isOpen ? " show" : ""}`}
        data-bs-parent="#shootAccordion"
      >
        <div className="accordion-body bg-white border border-2 border-success-subtle">
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-sm align-middle mb-3">
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Shoot name</th>
                  {showLocationCols && <th>Location</th>}
                  {showLocationCols && <th className="text-center">Map</th>}
                  <th className="text-center">Reg</th>
                </tr>
              </thead>
              <tbody>
                {isLeagueGroup && leagueSummaryRow ? (
                  <tr>
                    <td>{leagueSummaryRow.schedule}</td>
                    <td className="fw-semibold">{leagueSummaryRow.name}</td>
                    {showLocationCols && (
                      <td>{venueLabel(leagueSummaryRow.shoot)}</td>
                    )}
                    {showLocationCols && (
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            onSelectShoot?.(leagueSummaryRow.shoot)
                          }
                        >
                          Map
                        </button>
                      </td>
                    )}
                    <td className="text-center">
                      {regButton(leagueSummaryRow.shoot)}
                    </td>
                  </tr>
                ) : (
                  shoots.map((s, idx) => (
                    <tr key={s.shootId || s.id || idx}>
                      <td>{formatDateShort(s.date, s.endDate)}</td>
                      <td className="fw-semibold">
                        {isDestinationGroup ? stopTitle(s) : displayTitle(s)}
                      </td>
                      {showLocationCols && <td>{venueLabel(s)}</td>}
                      {showLocationCols && (
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onSelectShoot?.(s)}
                          >
                            Map
                          </button>
                        </td>
                      )}
                      <td className="text-center">{regButton(s)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="row fs-5 mb-2">
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Entry fee:</strong>{" "}
                {first.entryFee ||
                  (Array.isArray(first.pricing) && first.pricing.length
                    ? "See pricing"
                    : "TBD")}
              </p>
              {Array.isArray(first.shootFormat) &&
                first.shootFormat.length > 0 && (
                  <p className="mb-1">
                    <strong>Format:</strong> {first.shootFormat.join(", ")}
                  </p>
                )}
              {Array.isArray(first.bowTypes) && first.bowTypes.length > 0 && (
                <p className="mb-1">
                  <strong>Bow types:</strong> {first.bowTypes.join(", ")}
                </p>
              )}
            </div>
            <div className="col-md-6">
              {!showLocationCols && (
                <p className="mb-1">
                  <strong>Host:</strong> {venue.vname || venueLabel(first)}
                </p>
              )}
              <p className="mb-1">
                <strong>Ph:</strong>{" "}
                {phoneNum ? <a href={`tel:${phoneNum}`}>{phoneNum}</a> : "TBD"}
              </p>
              <p className="mb-1">
                <strong>Email:</strong>{" "}
                {emailAddr ? (
                  <a href={`mailto:${emailAddr}`}>{emailAddr}</a>
                ) : (
                  "TBD"
                )}
              </p>
              <p className="mb-1 d-flex flex-wrap gap-2">
                {webLink && (
                  <a
                    href={webLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    Event website
                  </a>
                )}
                {isVerified && (venue.venueId || venue.slug) && (
                  <Link
                    to={`/venues/${venue.slug || venue.venueId}`}
                    className="btn btn-sm btn-primary"
                  >
                    Venue SLP
                  </Link>
                )}
              </p>
            </div>
          </div>

          <div className="border-top pt-2 mt-2">
            <h3 className="fs-5 fw-bold">Rules / registration</h3>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              {regButton(first)}
              {first.rulesReg && (
                <a
                  href={first.rulesReg}
                  className="btn btn-sm btn-outline-info"
                  target="_blank"
                  rel="noreferrer"
                >
                  Event rules
                </a>
              )}
              {assocLabel && (
                <span className="small text-muted">
                  See {assocLabel} rulebooks on the Associations tab /
                  association site
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ShootAccordionItem.propTypes = {
  venueId: PropTypes.string,
  venueShoots: PropTypes.array,
  vIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
  variant: PropTypes.oneOf(["events", "destination"]),
}

export default ShootAccordionItem
