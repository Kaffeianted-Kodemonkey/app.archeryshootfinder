// src/components/list/ShootAccordionItem.js
// Shared accordion for event, series, and destination shoot groups.
import * as React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import { getDistance } from "../../utils/distance"
import {
  getStatusInfo,
  formatDateShort,
  getAssociationBadge,
} from "../../utils/shootUiHelpers"
import { getEffectiveShootLocation } from "../../utils/shootFilters"

function resolveLoc(shoot) {
  return getEffectiveShootLocation(shoot) || {}
}

function venueLabel(shoot) {
  const v = shoot?.venue?.vname
  if (v && String(v).trim()) return v.trim()
  const loc = resolveLoc(shoot)
  const addressLabel = String(loc.address || "")
    .split(",")[0]
    .trim()
  if (addressLabel) return addressLabel
  if (loc.city && loc.state) return `${loc.city}, ${loc.state}`
  if (loc.city) return loc.city
  return "TBD"
}

function assocPrefix(associationType) {
  return getAssociationBadge(associationType)
}

function displayTitle(shoot) {
  return shoot.sname || shoot.seriesName || "Event"
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
        Register
      </a>
    )
  }
  return null
}

function venueMembershipRequirement(value) {
  const requirement = String(value || "").trim()
  if (!requirement || /^(true|false)$/i.test(requirement)) return ""
  return requirement
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
  const first = shoots[0] || {}

  const loc = resolveLoc(first)

  // Must be inside the component — after first/venue exist
  const isLeagueGroup = first.isLeague === true || first.isLeague === "true"
  const isDestinationGroup = variant === "destination"
  const isSeriesGroup = variant === "series"
  const assocLabel = assocPrefix(first.associationType)

  const status = getStatusInfo?.(first) || {
    label: "Upcoming",
    className: "bg-secondary",
  }
  const title = isSeriesGroup
    ? first.seriesName || first.sname || "Series"
    : isDestinationGroup
    ? first.seriesName || first.sname || "Event"
    : displayTitle(first)
  const whenLabel = isLeagueGroup
    ? shoots.length > 1
      ? `${shoots.length} dates · Next: ${formatDateShort(first.date)}`
      : formatDateShort(first.date, first.endDate)
    : !isDestinationGroup && shoots.length > 1
    ? `${shoots.length} dates · Next: ${formatDateShort(first.date)}`
    : isDestinationGroup && shoots.length > 1
    ? dateRangeLabel(shoots)
    : formatDateShort(first.date, first.endDate)

  const whereLabel = isDestinationGroup
    ? multiStateLabel(shoots)
    : loc.city && loc.state
    ? `${loc.city}, ${loc.state}`
    : "TBD"

  const showDistance =
    !isDestinationGroup && userLocation && loc?.lat != null && loc?.lng != null

  const headingId = `heading-${vIndex}`
  const collapseId = `collapse-${vIndex}`
  const registrationInfoId = `registration-info-${vIndex}`
  const registrationVenues = [
    ...new Map(
      shoots.map(shoot => [
        shoot.venue?.venueId || venueLabel(shoot),
        shoot,
      ])
    ).values(),
  ]
  const eventVenue = first.venue || {}
  const eventContact = eventVenue.contact || {}
  const membershipRequirement = venueMembershipRequirement(
    eventVenue.isMembership
  )
  const claimedVenue =
    eventVenue.isClaimed === true ||
    eventVenue.isClaimed === "true" ||
    eventVenue.isClaimed === 1 ||
    eventVenue.isClaimed === "1"
  const hostTypes = {
    Club: { icon: "bi-building", className: "bg-primary" },
    Range: { icon: "bi-bullseye", className: "bg-success" },
    "Pro Shop": { icon: "bi-shop", className: "bg-danger" },
  }
  const normalizedVenueType = String(eventVenue.venueType || "")
    .trim()
    .toLowerCase()
  const hostType =
    Object.keys(hostTypes).find(
      type => type.toLowerCase() === normalizedVenueType
    ) || "Club"
  const hostTypeStyle = hostTypes[hostType]
  const hostHref = eventVenue.venueId
    ? claimedVenue
      ? `/venues/${eventVenue.venueId}`
      : `/venues#venue-${eventVenue.venueId}`
    : null

  const renderEventDetails = () => (
    <>
      {first.description && (
        <section className="bg-light rounded p-3 mb-3">
          <p className="mb-0 lh-lg">{first.description}</p>
        </section>
      )}

      <section className="d-flex flex-column flex-md-row justify-content-between gap-2 border-bottom pb-3 mb-3">
        <div>
          <h3 className="fs-6 text-uppercase text-muted fw-bold mb-1">Venue</h3>
          <p className="mb-0 fw-semibold">
            {hostHref ? (
              <Link to={hostHref}>
                {venueLabel(first)}
              </Link>
            ) : (
              venueLabel(first)
            )}
          </p>
        </div>
        <ul className="list-unstyled mb-0 small">
          {eventContact.phone && (
            <li>
              <i className="bi bi-telephone me-2" aria-hidden="true" />
              <a href={`tel:${eventContact.phone}`}>{eventContact.phone}</a>
            </li>
          )}
          {eventContact.email && (
            <li>
              <i className="bi bi-envelope me-2" aria-hidden="true" />
              <a href={`mailto:${eventContact.email}`}>{eventContact.email}</a>
            </li>
          )}
          {eventContact.website && (
            <li>
              <i className="bi bi-globe me-2" aria-hidden="true" />
              <a href={eventContact.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </li>
          )}
        </ul>
      </section>

      <section>
        <h3 className="fs-5 fw-bold mb-2">Event details</h3>
        {shoots.map((shoot, index) => {
          const shootLocation = resolveLoc(shoot)
          const hasMapCoordinates =
            Number.isFinite(parseFloat(shootLocation.lat)) &&
            Number.isFinite(parseFloat(shootLocation.lng))
          const associationAbbreviation =
            shoot.association?.acronym || assocPrefix(shoot.associationType)
          const generalRulesUrl = shoot.association?.ruleBooks?.find(
            rulebook =>
              /general/i.test(rulebook.ruleName || "") && rulebook.rulebookUrl
          )?.rulebookUrl
          const value = items =>
            Array.isArray(items) && items.length ? items.join(", ") : ""
          const fields = [
            ["Bow type", value(shoot.bowTypes)],
            ["Format", value(shoot.shootFormat)],
            ["Class", value(shoot.shootClass)],
            ["Level", value(shoot.skillLevel)],
          ].filter(([, fieldValue]) => fieldValue)

          return (
            <div
              key={shoot.shootId || shoot.id || index}
              className="bg-light border rounded p-3 mb-2"
            >
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div className="fw-bold">
                  {formatDateShort(shoot.date, shoot.endDate)}
                </div>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  {generalRulesUrl ? (
                    <a
                      href={generalRulesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-info"
                    >
                      {associationAbbreviation ? `${associationAbbreviation} Rules` : "Rules"}
                    </a>
                  ) : (
                    <span className="small text-muted">Rules not listed</span>
                  )}
                  {regButton(shoot)}
                </div>
              </div>
              {fields.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {fields.map(([label, fieldValue]) => (
                    <span className="badge bg-white text-dark border" key={label}>
                      <span className="text-muted">{label}:</span> {fieldValue}
                    </span>
                  ))}
                </div>
              )}
              {hasMapCoordinates && (
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => onSelectShoot?.(shoot)}
                  >
                    <i
                      className="bi bi-geo-alt-fill me-1"
                      aria-hidden="true"
                    />
                    Show on map
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </section>

      <section className="border-top pt-3">
        <h3 className="fs-5 fw-bold">Registration</h3>
        {membershipRequirement || eventContact.membershipUrl ? (
          <>
            {membershipRequirement && (
              <p className="mb-2">
                <strong>Venue registration requirement:</strong>{" "}
                {membershipRequirement}
              </p>
            )}
            {eventContact.membershipUrl && (
              <a
                href={eventContact.membershipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                Registration information
              </a>
            )}
          </>
        ) : (
          <p className="mb-0">
            No Registration information available at this time. Contact {venueLabel(first)}.
          </p>
        )}
      </section>
    </>
  )

  const renderMultiShootDetails = () => {
    const isDestinationLayout = variant === "destination"
    const descriptions = [
      ...new Set(
        shoots.map(shoot => String(shoot.description || "").trim()).filter(Boolean)
      ),
    ]
    const sharedDescription = descriptions.length === 1 ? descriptions[0] : ""

    return (
      <>
        {sharedDescription && (
          <section className="bg-light rounded p-3 mb-3">
            <p className="mb-0 lh-lg">{sharedDescription}</p>
          </section>
        )}

        <section className="border-bottom pb-3 mb-3">
          <h3 className="fs-6 text-uppercase text-muted fw-bold mb-2">Venues!</h3>
          <div className="row g-3">
            {registrationVenues.map((shoot, index) => {
              const venue = shoot.venue || {}
              const contact = venue.contact || {}
              const claimed =
                venue.isClaimed === true ||
                venue.isClaimed === "true" ||
                venue.isClaimed === 1 ||
                venue.isClaimed === "1"

              return (
                <div
                  className="col-12 col-md-6"
                  key={`${venue.venueId || venueLabel(shoot)}-${index}`}
                >
                  <div className="border rounded p-3 h-100">
                    <p className="mb-2 fw-semibold">
                      {venue.venueId && claimed ? (
                        <Link to={`/venues/${venue.venueId}`}>
                          {venueLabel(shoot)}
                        </Link>
                      ) : (
                        venueLabel(shoot)
                      )}
                    </p>
                    <ul className="list-unstyled mb-0 small">
                      {contact.phone && (
                        <li>
                          <i className="bi bi-telephone me-2" aria-hidden="true" />
                          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                        </li>
                      )}
                      {contact.email && (
                        <li>
                          <i className="bi bi-envelope me-2" aria-hidden="true" />
                          <a href={`mailto:${contact.email}`}>{contact.email}</a>
                        </li>
                      )}
                      {contact.website && (
                        <li>
                          <i className="bi bi-globe me-2" aria-hidden="true" />
                          <a href={contact.website} target="_blank" rel="noopener noreferrer">
                            Website
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h3 className="fs-5 fw-bold mb-2">
            {isDestinationLayout ? "Destination stops" : "Events in this series"}
          </h3>
          {shoots.map((shoot, index) => {
            const shootLocation = resolveLoc(shoot)
            const hasMapCoordinates =
              Number.isFinite(parseFloat(shootLocation.lat)) &&
              Number.isFinite(parseFloat(shootLocation.lng))
            const associationAbbreviation =
              shoot.association?.acronym || assocPrefix(shoot.associationType)
            const generalRulesUrl = shoot.association?.ruleBooks?.find(
              rulebook =>
                /general/i.test(rulebook.ruleName || "") && rulebook.rulebookUrl
            )?.rulebookUrl
            const value = items =>
              Array.isArray(items) && items.length ? items.join(", ") : ""
            const fields = [
              ["Bow type", value(shoot.bowTypes)],
              ["Format", value(shoot.shootFormat)],
              ["Class", value(shoot.shootClass)],
              ["Level", value(shoot.skillLevel)],
            ].filter(([, fieldValue]) => fieldValue)
            const hasUniqueDescription =
              !sharedDescription && Boolean(String(shoot.description || "").trim())

            return (
              <div
                key={shoot.shootId || shoot.id || index}
                className="bg-light border rounded p-3 mb-2"
              >
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <div className="fw-bold">
                      {shoot.sname || shoot.seriesName || "Event"}
                    </div>
                    <div className="small text-muted">
                      {formatDateShort(shoot.date, shoot.endDate)}
                      {shoot.venue && ` · ${venueLabel(shoot)}`}
                    </div>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    {generalRulesUrl ? (
                      <a
                        href={generalRulesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-info"
                      >
                        {associationAbbreviation
                          ? `${associationAbbreviation} Rules`
                          : "Rules"}
                      </a>
                    ) : (
                      <span className="small text-muted">Rules not listed</span>
                    )}
                    {regButton(shoot)}
                  </div>
                </div>
                {hasUniqueDescription && (
                  <p className="mb-0 mt-3">{shoot.description}</p>
                )}
                {fields.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {fields.map(([label, fieldValue]) => (
                      <span className="badge bg-white text-dark border" key={label}>
                        <span className="text-muted">{label}:</span> {fieldValue}
                      </span>
                    ))}
                  </div>
                )}
                {hasMapCoordinates && (
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onSelectShoot?.(shoot)}
                    >
                      <i className="bi bi-geo-alt-fill me-1" aria-hidden="true" />
                      Show on map
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </section>

        <section className="border-top pt-3 mt-3">
          <h3 className="fs-5 fw-bold">Registration</h3>
          {registrationVenues.map((shoot, index) => {
            const venue = shoot.venue || {}
            const membershipRequirement = venueMembershipRequirement(
              venue.isMembership
            )
            const membershipUrl = venue.contact?.membershipUrl

            return (
              <div
                key={`${venue.venueId || venueLabel(shoot)}-registration-${index}`}
                className="mb-3"
              >
                <p className="mb-1 fw-semibold">{venueLabel(shoot)}</p>
                {membershipRequirement || membershipUrl ? (
                  <>
                    {membershipRequirement && (
                      <p className="mb-2">
                        <strong>Venue registration requirement:</strong>{" "}
                        {membershipRequirement}
                      </p>
                    )}
                    {membershipUrl && (
                      <a
                        href={membershipUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        Registration information
                      </a>
                    )}
                  </>
                ) : (
                  <p className="mb-0">
                    No Registration information available at this time. Contact{" "}
                    {venueLabel(shoot)}.
                  </p>
                )}
              </div>
            )
          })}
        </section>
      </>
    )
  }

  const badgeKind = isDestinationGroup
    ? "Destination"
    : isSeriesGroup
    ? "League / Series"
    : isLeagueGroup
    ? "League"
    : "Tournament"

  return (
    <div className="accordion-item border mb-3 rounded shadow-sm">
      <h2
        className="accordion-header d-flex align-items-stretch"
        id={headingId}
      >
        <button
          className={`accordion-button align-items-start w-auto flex-grow-1 ${
            isOpen ? "" : "collapsed"
          } bg-success-subtle border border-2 border-success shadow-none`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${collapseId}`}
          aria-expanded={isOpen}
          aria-controls={collapseId}
        >
          <div className="w-100 text-start">
            <div className="d-flex flex-wrap gap-2 mb-1">
              {isDestinationGroup && assocLabel && (
                <span className="badge align-self-start text-wrap lh-sm bg-primary text-white px-2 py-1" style={{ fontSize: "0.8rem" }}>
                  {assocLabel}
                </span>
              )}
              <span className="badge align-self-start text-wrap lh-sm bg-dark text-white px-2 py-1" style={{ fontSize: "0.8rem" }}>
                {badgeKind}
              </span>
              {status?.label && (
                <span
                  className={`badge align-self-start text-wrap lh-sm px-2 py-1 ${status.className || "bg-secondary"}`}
                  style={{ fontSize: "0.8rem" }}
                >
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
        {hostHref && (
          <Link
            to={hostHref}
            className="d-flex flex-column justify-content-start gap-1 px-2 pt-3 border border-2 border-start-0 border-success-subtle bg-light text-decoration-none overflow-hidden"
            style={{ width: "14rem", minWidth: 0, flexShrink: 0, alignSelf: "stretch" }}
            onClick={e => e.stopPropagation()}
          >
            <span className={`badge align-self-start text-wrap lh-sm px-2 py-1 ${hostTypeStyle.className} text-white`} style={{ fontSize: "0.8rem" }}>
              <i className={`bi ${hostTypeStyle.icon} me-1`} aria-hidden="true" />
              {hostType}
            </span>
            <span className="fs-4 fw-bold lh-sm text-truncate text-dark w-100">
              {eventVenue.vname || venueLabel(first)}
            </span>
          </Link>
        )}
      </h2>

      <div
        id={collapseId}
        className={`accordion-collapse collapse${isOpen ? " show" : ""}`}
        data-bs-parent="#shootAccordion"
      >
        <div className="accordion-body bg-white border border-2 border-success-subtle">
          {variant === "events" ? (
            renderEventDetails()
          ) : variant === "series" || variant === "destination" ? (
            renderMultiShootDetails()
          ) : (
            <>
              <div className="table-responsive">
            <table className="table table-bordered table-striped table-sm align-middle mb-3">
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Event name</th>
                  <th>Rules association</th>
                  <th>Venue</th>
                  <th className="text-center">Reg</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {shoots.map((s, idx) => {
                  const associationAbbreviation =
                    s.association?.acronym || assocPrefix(s.associationType)
                  const shootVenue = s.venue || {}
                  const shootPhone = shootVenue.contact?.phone || ""
                  const shootEmail = shootVenue.contact?.email || ""
                  const shootWebsite = shootVenue.contact?.website || ""
                  const generalRulesUrl = s.association?.ruleBooks?.find(
                    rulebook =>
                      /general/i.test(rulebook.ruleName || "") &&
                      rulebook.rulebookUrl
                  )?.rulebookUrl

                  return (
                    <tr key={s.shootId || s.id || idx}>
                      <td>{formatDateShort(s.date, s.endDate)}</td>
                      <td className="fw-semibold">
                        {s.sname || s.seriesName || "Event"}
                      </td>
                      <td>
                        {generalRulesUrl ? (
                          <a
                            href={generalRulesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-info"
                          >
                            {associationAbbreviation
                              ? `${associationAbbreviation} Rules`
                              : "Rules"}
                          </a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {s.venue?.venueId &&
                        (s.venue.isClaimed === true ||
                          s.venue.isClaimed === "true" ||
                          s.venue.isClaimed === 1 ||
                          s.venue.isClaimed === "1") ? (
                          <Link to={`/venues/${s.venue.venueId}`}>
                            {venueLabel(s)}
                          </Link>
                        ) : (
                          venueLabel(s)
                        )}
                      </td>
                      <td className="text-center">
                        {regButton(s) || (
                          <a href={`#${registrationInfoId}`} className="small">
                            Registration info
                          </a>
                        )}
                      </td>
                      <td>
                        <details>
                          <summary className="btn btn-sm btn-outline-secondary">
                            Details
                          </summary>
                          <div className="small mt-2">
                            {s.description && (
                              <p className="mb-2">
                                <strong>Description:</strong> {s.description}
                              </p>
                            )}
                            {s.entryFee && (
                              <p className="mb-2">
                                <strong>Entry fee:</strong> {s.entryFee}
                              </p>
                            )}
                            {Array.isArray(s.shootFormat) &&
                              s.shootFormat.length > 0 && (
                                <p className="mb-2">
                                  <strong>Format:</strong>{" "}
                                  {s.shootFormat.join(", ")}
                                </p>
                              )}
                            {Array.isArray(s.shootClass) &&
                              s.shootClass.length > 0 && (
                                <p className="mb-2">
                                  <strong>Classes:</strong>{" "}
                                  {s.shootClass.join(", ")}
                                </p>
                              )}
                            {Array.isArray(s.amenities) &&
                              s.amenities.length > 0 && (
                                <p className="mb-0">
                                  <strong>Amenities:</strong>{" "}
                                  {s.amenities.join(", ")}
                                </p>
                              )}
                            {shootPhone && (
                              <p className="mb-2">
                                <strong>Venue phone:</strong>{" "}
                                <a href={`tel:${shootPhone}`}>{shootPhone}</a>
                              </p>
                            )}
                            {shootEmail && (
                              <p className="mb-2">
                                <strong>Venue email:</strong>{" "}
                                <a href={`mailto:${shootEmail}`}>{shootEmail}</a>
                              </p>
                            )}
                            {shootWebsite && (
                              <p className="mb-2">
                                <a
                                  href={shootWebsite}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Venue website
                                </a>
                              </p>
                            )}
                            {!s.description &&
                              !s.entryFee &&
                              !s.shootFormat?.length &&
                              !s.shootClass?.length &&
                              !s.amenities?.length &&
                              !shootPhone &&
                              !shootEmail &&
                              !shootWebsite && (
                                <span className="text-muted">
                                  No additional details listed.
                                </span>
                              )}
                          </div>
                        </details>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div id={registrationInfoId} className="border-top pt-2 mt-2">
            <h3 className="fs-5 fw-bold">Registration</h3>
            {registrationVenues.map((s, index) => {
              const registrationVenue = s.venue || {}
              const phone = registrationVenue.contact?.phone || ""
              const email = registrationVenue.contact?.email || ""
              const membershipUrl = registrationVenue.contact?.membershipUrl
              const requirement = venueMembershipRequirement(
                registrationVenue.isMembership
              )

              return (
                <div
                  key={`${registrationVenue.venueId || venueLabel(s)}-${index}`}
                  className="mb-3"
                >
                  <p className="mb-1 fw-semibold">{venueLabel(s)}</p>
                  {requirement && (
                    <p className="mb-1">
                      <strong>Venue registration requirement:</strong>{" "}
                      {requirement}
                    </p>
                  )}
                  {membershipUrl ? (
                    <a
                      href={membershipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Membership / registration information
                    </a>
                  ) : (
                    <p className="mb-0">
                      No Registration Info Available at this time. Contact{" "}
                      {venueLabel(s)}
                      {phone && (
                        <>
                          {" at "}
                          <a href={`tel:${phone}`}>{phone}</a>
                        </>
                      )}
                      {phone && email && " or "}
                      {!phone && email && " at "}
                      {email && <a href={`mailto:${email}`}>{email}</a>}
                      {!phone && !email && " directly"}
                      .
                    </p>
                  )}
                </div>
              )
            })}
              </div>
            </>
          )}
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
  variant: PropTypes.oneOf(["events", "destination", "series"]),
}

export default ShootAccordionItem
