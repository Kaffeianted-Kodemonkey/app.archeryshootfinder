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

function locationCount(shoots) {
  const keys = shoots
    .map(shoot => {
      const loc = resolveLoc(shoot)
      const key = [loc.address, loc.city, loc.state, loc.zip]
        .map(value => String(value || "").trim().toLowerCase())
        .join("|")
      return key.replace(/\|/g, "") ? key : ""
    })
    .filter(Boolean)
  return new Set(keys).size
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

function venueTypeBadge(venue) {
  const types = {
    Club: { icon: "bi-building", className: "bg-primary" },
    Range: { icon: "bi-bullseye", className: "bg-success" },
    "Pro Shop": { icon: "bi-shop", className: "bg-danger" },
  }
  const venueType = Object.keys(types).find(
    type => type.toLowerCase() === String(venue?.venueType || "").trim().toLowerCase()
  )

  return venueType ? { label: venueType, ...types[venueType] } : null
}

function hasVenueContact(contact) {
  return Boolean(contact?.phone || contact?.email || contact?.website)
}

const ShootAccordionItem = ({
  venueId,
  venueShoots = [],
  vIndex,
  isOpen = false,
  onToggle,
  userLocation,
  onSelectShoot,
  variant,
}) => {
  const shoots = Array.isArray(venueShoots) ? venueShoots : []
  const [openDetails, setOpenDetails] = React.useState({})
  const first = shoots[0] || {}

  const loc = resolveLoc(first)

  // Must be inside the component — after first/venue exist
  const groupType = String(first.group?.groupType || "").toLowerCase()
  const isLeagueGroup =
    groupType === "league" ||
    first.isLeague === true ||
    first.isLeague === "true"
  const isDestinationGroup = variant === "destination"
  const isSeriesGroup = variant === "series" || variant === "group"
  const isDestinationLayout = variant === "destination"
  const assocLabel = assocPrefix(first.associationType)

  const status = getStatusInfo?.(first) || {
    label: "Upcoming",
    className: "bg-secondary",
  }
  const title = isSeriesGroup
    ? first.group?.groupName || first.seriesName || first.sname || "Series"
    : isDestinationGroup
    ? first.group?.groupName || first.seriesName || first.sname || "Event"
    : displayTitle(first)
  const whenLabel = isLeagueGroup
    ? shoots.length > 1
      ? `${shoots.length} dates · Next: ${formatDateShort(first.date)}`
      : formatDateShort(first.date, first.endDate)
    : isSeriesGroup && shoots.length > 1
    ? `${dateRangeLabel(shoots)} · ${locationCount(shoots)} ${locationCount(shoots) === 1 ? "location" : "locations"}`
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
  const groupAssociation = first.shootGroup?.ownerAssociation || first.association || {}
  const eventVenueBadge = venueTypeBadge(eventVenue)
  const membershipRequirement = venueMembershipRequirement(
    eventVenue.isMembership
  )
  const claimedVenue =
    eventVenue.isClaimed === true ||
    eventVenue.isClaimed === "true" ||
    eventVenue.isClaimed === 1 ||
    eventVenue.isClaimed === "1"
  const hostHref = eventVenue.venueId
    ? claimedVenue
      ? `/venues/${eventVenue.venueId}`
      : `/venues#venue-${eventVenue.venueId}`
    : null

  const renderEventDetails = () => (
    <>
      <section className="row g-3 border-bottom pb-3 mb-3">
        <div className="col-12 col-md-7">
          <div className="fw-semibold d-flex flex-wrap align-items-center gap-2 mb-2">
            {eventVenueBadge && <span className={`badge ${eventVenueBadge.className} text-white`}>{eventVenueBadge.label}</span>}
            {hostHref ? <Link to={hostHref}>{venueLabel(first)}</Link> : venueLabel(first)}
          </div>
          {first.description && <p className="mb-0 lh-lg">{first.description}</p>}
        </div>
        <div className="col-12 col-md-5">
          <ul className="list-unstyled mb-0 small">
            <li><i className="bi bi-telephone me-2" aria-hidden="true" />{eventContact.phone ? <a href={`tel:${eventContact.phone}`}>{eventContact.phone}</a> : <span className="text-muted">Not Listed</span>}</li>
            <li><i className="bi bi-envelope me-2" aria-hidden="true" />{eventContact.email ? <a href={`mailto:${eventContact.email}`}>{eventContact.email}</a> : <span className="text-muted">Not Listed</span>}</li>
            <li><i className="bi bi-globe me-2" aria-hidden="true" />{eventContact.website ? <a href={eventContact.website} target="_blank" rel="noopener noreferrer">Website</a> : <span className="text-muted">Not Listed</span>}</li>
          </ul>
        </div>
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
              <div className="mt-2 small">
                <div className="fw-semibold">
                  <i className="bi bi-geo-alt me-2" aria-hidden="true" />
                  {[shootLocation.address, shootLocation.city, shootLocation.state, shootLocation.zip].filter(Boolean).join(", ") || "Location not listed"}
                </div>
                {hasMapCoordinates && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onSelectShoot?.(shoot)}
                    >
                      <i className="bi bi-geo-alt-fill me-1" aria-hidden="true" />Show on map
                    </button>
                    <a
                      className="btn btn-sm btn-outline-secondary"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${shootLocation.lat},${shootLocation.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-sign-turn-right me-1" aria-hidden="true" />Directions
                    </a>
                  </div>
                )}
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
        <section className="border-bottom pb-3 mb-3">
          <h3 className="fs-6 text-uppercase text-muted fw-bold mb-2">Venues</h3>
          <div className="row g-3">
            {registrationVenues.map((shoot, index) => {
              const venue = shoot.venue || {}
              const contact = venue.contact || {}
              const venueBadge = venueTypeBadge(venue)
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
                    <p className="mb-2 fw-semibold d-flex flex-wrap align-items-center gap-2">
                      {venueBadge && (
                        <span className={`badge ${venueBadge.className} text-white`}>
                          <i className={`bi ${venueBadge.icon} me-1`} aria-hidden="true" />
                          {venueBadge.label}
                        </span>
                      )}
                      {venue.venueId ? (
                        <Link to={claimed ? `/venues/${venue.venueId}` : `/venues#venue-${venue.venueId}`}>
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
                      {!hasVenueContact(contact) && (
                        <li className="text-muted">Contact info has not been added.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {sharedDescription && (
          <section className="bg-light rounded p-3 mb-3">
            <p className="mb-0 lh-lg">{sharedDescription}</p>
          </section>
        )}



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
    : "Event"

  return (
    <div className="accordion-item border mb-3 rounded shadow-sm">
      <h2
        className="accordion-header d-flex align-items-stretch"
        id={headingId}
      >
        <button
          className={`accordion-button align-items-start w-100 flex-grow-1 ${
            isOpen ? "" : "collapsed"
          } bg-success-subtle border border-2 border-success shadow-none`}
          type="button"
          onClick={() => onToggle?.(venueId)}
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
      </h2>

      <div
        id={collapseId}
        className={`accordion-collapse collapse${isOpen ? " show" : ""}`}
      >
        <div className="accordion-body bg-white border border-2 border-success-subtle">
          {shoots.length === 0 ? (
            renderEventDetails()
          ) : shoots.length < 0 ? (
            renderMultiShootDetails()
          ) : (
            <>
              {isSeriesGroup || isDestinationGroup ? (
                <section className="border-bottom pb-3 mb-3">
                  <h3 className="fs-6 text-uppercase text-muted fw-bold mb-2">
                    {isSeriesGroup ? "League / Series association" : "Group information"}
                  </h3>
                  <div className="fw-semibold">
                    {groupAssociation.acronym && groupAssociation.assocName
                      ? `${groupAssociation.acronym} - ${groupAssociation.assocName}`
                      : groupAssociation.acronym || groupAssociation.assocName || title}
                  </div>
                  {groupAssociation.websiteUrl && (
                    <div className="small">
                      <i className="bi bi-globe me-2" aria-hidden="true" />
                      <a href={groupAssociation.websiteUrl} target="_blank" rel="noopener noreferrer">
                        Association website
                      </a>
                    </div>
                  )}
                  {!groupAssociation.websiteUrl && isDestinationGroup && (
                    <ul className="list-unstyled mb-0 small mt-2">
                      {eventContact.phone && <li><i className="bi bi-telephone me-2" aria-hidden="true" /><a href={`tel:${eventContact.phone}`}>{eventContact.phone}</a></li>}
                      {eventContact.email && <li><i className="bi bi-envelope me-2" aria-hidden="true" /><a href={`mailto:${eventContact.email}`}>{eventContact.email}</a></li>}
                      {eventContact.website && <li><i className="bi bi-globe me-2" aria-hidden="true" /><a href={eventContact.website} target="_blank" rel="noopener noreferrer">Venue website</a></li>}
                      {!hasVenueContact(eventContact) && <li className="text-muted">Contact info has not been added.</li>}
                    </ul>
                  )}
                </section>
              ) : variant === "events" ? (
                <section className="d-flex flex-column flex-md-row justify-content-between gap-2 border-bottom pb-3 mb-3">
                  <div>
                    <p className="mb-2 fw-semibold d-flex flex-wrap align-items-center gap-2">
                      {eventVenueBadge && <span className={`badge ${eventVenueBadge.className} text-white`}>{eventVenueBadge.label}</span>}
                      {hostHref ? <Link to={hostHref}>{venueLabel(first)}</Link> : venueLabel(first)}
                    </p>
                  </div>
                  <ul className="list-unstyled mb-0 small">
                    {eventContact.phone && <li><i className="bi bi-telephone me-2" aria-hidden="true" /><a href={`tel:${eventContact.phone}`}>{eventContact.phone}</a></li>}
                    {eventContact.email && <li><i className="bi bi-envelope me-2" aria-hidden="true" /><a href={`mailto:${eventContact.email}`}>{eventContact.email}</a></li>}
                    {eventContact.website && <li><i className="bi bi-globe me-2" aria-hidden="true" /><a href={eventContact.website} target="_blank" rel="noopener noreferrer">Website</a></li>}
                    {!hasVenueContact(eventContact) && <li className="text-muted">Contact info has not been added.</li>}
                  </ul>
                </section>
              ) : null}
              <div className="table-responsive">
            <table className="table table-bordered table-striped table-sm align-top mb-3 shoot-details-table" style={{ width: "100%", tableLayout: "fixed" }}>
              <thead className="table-dark">
                <tr>
                  <th aria-label="Verification status" style={{ width: "14%" }}></th>
                  <th style={{ width: "20%" }}>Date</th>
                  <th style={{ width: "26%" }}>Event name</th>
                  <th className="text-center" style={{ width: "20%" }}>Reg</th>
                  <th style={{ width: "20%" }}>Details</th>
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
                  const physicalLocation = resolveLoc(s)
                  const showPhysicalAddress = s.useVenueLocation !== true && s.useVenueLocation !== "true"
                  const physicalAddress = [physicalLocation.address, physicalLocation.city, physicalLocation.state, physicalLocation.zip].filter(Boolean).join(", ")
                  const generalRulesUrl = s.association?.ruleBooks?.find(
                    rulebook =>
                      /general/i.test(rulebook.ruleName || "") &&
                      rulebook.rulebookUrl
                  )?.rulebookUrl

                  const detailsId = `shoot-details-${s.shootId || s.id || idx}`
                  const hasDetails = Boolean(
                    s.description || showPhysicalAddress && physicalAddress ||
                    s.bowTypes?.length || s.skillLevel?.length || s.entryFee ||
                    s.shootFormat?.length || s.shootClass?.length || s.amenities?.length ||
                    shootPhone || shootEmail || shootWebsite
                  )

                  return (
                    <>
                    <tr key={s.shootId || s.id || idx}>
                      <td className="align-top">
                        <span className={`badge ${getStatusInfo(s).className}`}>{getStatusInfo(s).label}</span>
                      </td>
                      <td>{formatDateShort(s.date, s.endDate)}</td>
                      <td className="fw-semibold">
                        {s.sname || s.seriesName || "Event"}
                      </td>
                      <td className="text-center align-top">
                        {regButton(s) || (
                          <a href={`#${registrationInfoId}`} className="small">
                            Registration info
                          </a>
                        )}
                      </td>
                      <td className="align-top">
                        {hasDetails ? (
                          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setOpenDetails(current => ({ ...current, [detailsId]: !current[detailsId] }))} aria-expanded={Boolean(openDetails[detailsId])} aria-controls={detailsId}>
                            {openDetails[detailsId] ? "Hide details" : "Details"}
                          </button>
                        ) : <span className="text-muted">—</span>}
                      </td>
                    </tr>
                    {hasDetails && (
                      <tr key={`${s.shootId || s.id || idx}-details`} id={detailsId} hidden={!openDetails[detailsId]}>
                        <td colSpan="5" style={{ overflowWrap: "anywhere" }}>
                          <div className="row g-3 small" style={{ minWidth: 0 }}> 
                            <section className="col-12 col-lg-8" aria-label="Event details">
                              <h4 className="h6 fw-bold border-bottom pb-2 mb-3">Event details</h4>
                              <div className="row g-2">
                                <div className="col-12"><strong>Description:</strong> {s.description || "Not Listed"}</div>
                                <div className="col-12"><strong>Rules:</strong> {generalRulesUrl ? <a href={generalRulesUrl} target="_blank" rel="noopener noreferrer">{associationAbbreviation ? `${associationAbbreviation} Rules` : "Rules"}</a> : "Not Listed"}</div>
                                <div className="col-12 col-md-6"><strong>Event address:</strong> {showPhysicalAddress && physicalAddress ? physicalAddress : "Not Listed"}</div>
                                <div className="col-12 col-md-6"><strong>Bow type:</strong> {s.bowTypes?.length ? s.bowTypes.join(", ") : "Not Listed"}</div>
                                <div className="col-12 col-md-6"><strong>Skill level:</strong> {s.skillLevel?.length ? s.skillLevel.join(", ") : "Not Listed"}</div>
                                <div className="col-12 col-md-6"><strong>Entry fee:</strong> {s.entryFee || "Not Listed"}</div>
                                <div className="col-12 col-md-6"><strong>Format:</strong> {s.shootFormat?.length ? s.shootFormat.join(", ") : "Not Listed"}</div>
                                <div className="col-12 col-md-6"><strong>Classes:</strong> {s.shootClass?.length ? s.shootClass.join(", ") : "Not Listed"}</div>
                                <div className="col-12"><strong>Amenities:</strong> {s.amenities?.length ? s.amenities.join(", ") : "Not Listed"}</div>
                              </div>
                            </section>
                            <section className="col-12 col-lg-4 border-lg-start ps-lg-4" aria-label="Venue contact">
                              <h4 className="h6 fw-bold border-bottom pb-2 mb-3">Venue contact</h4>
                              <p className="mb-2"><strong>Phone:</strong> {shootPhone || "Not Listed"}</p>
                              <p className="mb-2"><strong>Email:</strong> {shootEmail || "Not Listed"}</p>
                              <p className="mb-0"><strong>Website:</strong> {shootWebsite || "Not Listed"}</p>
                            </section>
                          </div>
                        </td>
                      </tr>
                    )}
                    </>
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
  onToggle: PropTypes.func,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
  variant: PropTypes.oneOf(["events", "destination", "series"]),
}

export default ShootAccordionItem
