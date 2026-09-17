// src/components/list/ShootAccordionItem.js
import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { getDistance } from "../../utils/distance"
import { getStatusInfo, formatDateShort, getAssociationBadge } from "../../utils/shootUiHelpers"

const ShootAccordionItem = ({
  venueId,
  venueShoots = [],
  vIndex,
  isOpen,
  userLocation,
  onSelectShoot,
}) => {
  const first = venueShoots.find(s => (s.entryFee != null && s.entryFee !== "") || (Array.isArray(s.pricing) && s.pricing.length > 0)) || venueShoots[0] || {}
  const venue = first.venue || {}
  const loc = first.useVenueLocation !== false && venue.location ? venue.location : first.shootLocation || {}
  const contact = first.contact || {}


  const cityState = loc.city && loc.state ? `${loc.city}, ${loc.state}` : "TBD"
  const status = getStatusInfo(first)
  const assocLabel = getAssociationBadge(first.associationType)

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`heading-${vIndex}`}>
        <button
          className={`accordion-button ${isOpen ? "" : "collapsed"} bg-success-subtle border border-2 border-success shadow-none focus-ring-0`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse-${vIndex}`}
          aria-expanded={isOpen}
          aria-controls={`collapse-${vIndex}`}
        >
          <div className="w-100">
            <div className="row align-items-center mb-1">
              <div className="col-12 col-md-auto d-flex gap-2 mb-1 mb-md-0 align-items-center">
                <span className="badge bg-secondary">
                  {(Array.isArray(first.shootFormat) ? first.shootFormat[0] : first.shootFormat) || ""}
                </span>

                {assocLabel && (
                  <span className="badge bg-primary text-white">
                    <i className="bi bi-trophy-fill me-1"></i> {assocLabel} Circuit
                  </span>
                )}

                <span className={`badge ${status.className}`}>
                  {status.label}
                </span>
              </div>
            </div>
            <div className="row mt-2 small text-muted">
              <div className="col-12">
                <strong className="fs-5 text-dark">{venue.vname || "Unknown Venue"}</strong>
              </div>
            </div>
            <div className="row mt-2 small text-muted">
              <div className="col-12 col-md-auto mb-1 mb-md-0">
                {venueShoots.length} Total Shoot{venueShoots.length === 1 ? "" : "s"}
              </div>
              <div className="col-12 col-md">
                {formatDateShort(first.date, first.endDate)} | {cityState}
                {userLocation && loc?.lat && loc?.lng && ` | ${getDistance(userLocation, loc).toFixed(1)} mi`}
              </div>
            </div>
          </div>
        </button>
      </h2>

      <div id={`collapse-${vIndex}`} className={`accordion-collapse collapse${isOpen ? " show" : ""}`} data-bs-parent="#shootAccordion">
        <div className="accordion-body border-2 border-start border-end border-success-subtle">
          <div className="row">
            <div className="col">
              <small class="fs-6 ms-1">
                <strong>Phone:</strong> {contact.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : "TBD"} |{" "}
                <strong>Email:</strong> {contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : "TBD"}  |{" "}
                <strong>Website:</strong> {contact.websiteUrl ? <a href={contact.websiteUrl} target="_blank" rel="noreferrer">{contact.websiteUrl}</a> : "TBD"} |{" "}
                <strong>Get Directions -> [Link to Map-Pin]</strong>
              </small>
             <hr />
              <h3>About Event</h3>
              <p>{first.description}</p>
            </div>
          </div>
          <hr/>

          <div className="row">
            <div className="col">
              <h3>Course Overview</h3>
              <p>breife overview about the corses</p>
            </div>
            <div className="col col-md-5">
              {first.entryFee ? (
                <p className="fw-bold fs-5 mt-3">Entry Fee: {first.entryFee}</p>
              ) : first.pricing && first.pricing.length > 0 ? (
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
                      {first.pricing.map(priceTier => {
                        const { tier, note, cost1Day, cost2Days, cost3Days, cost4Days, options } = priceTier
                        const currencySymbol = first.currency === "CAD" ? "C" : ""
                        const getCost = days => options ? (options.find(o => o.days === days)?.cost ?? "") : priceTier[`cost${days}Day`] || priceTier[`cost${days}Days`] || ""

                        return (
                          <tr key={tier}>
                            <th className="py-2">
                              <div>{tier}</div>
                              {note && <small className="text-muted fw-normal">{note}</small>}
                            </th>
                            <td>{getCost(1) ? `${currencySymbol}${getCost(1)}` : "—"}</td>
                            <td>{getCost(2) ? `${currencySymbol}${getCost(2)}` : "—"}</td>
                            <td>{getCost(3) ? `${currencySymbol}${getCost(3)}` : "—"}</td>
                            <td>{getCost(4) ? `${currencySymbol}${getCost(4)}` : "—"}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="fw-bold fs-5 mt-3">Entry Fee: TBD</p>
              )}
              <p><strong>Prize:</strong> {first.prize ? first.prize  : "TBD"}</p>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col">
              <h3>Rules & Guidelines</h3>
              <p class="fs=5 ms-1">
                {first.rulesReg && <a href="{first.rulesReg}" className="btn btn-info btn-sm" target="_blank">Rules & Regs</a>}
              </p>
              <p>{first.guidelines ? first.guidelines : "Venue to enter their facility or range genral rules/"}</p>
            </div>
            <div className="col col-md-5">
              <p><strong>Amenities: </strong>{first.amenitites ? first.amenitites : "TBD"}</p>
              <hr />
              <p><strong>Bow Types: </strong>{first.amenitites ? first.amenitites : "TBD"}</p>
            </div>

          </div>

          <hr />

          <div className="table-responsive mt-3">
            {first.time && <h3 className="fs-5 mb-2"><strong>Shoots & Time:</strong> {first.time}</h3>}
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
                  const sLoc = s.useVenueLocation !== false && venue.location ? venue.location : s.shootLocation
                  const sCity = sLoc?.city && sLoc?.state ? `${sLoc.city}, ${sLoc.state}` : "TBD"

                  return (
                    <React.Fragment key={s.shootId || s.id || idx}>
                      <tr><td colSpan={3} className="fw-bold bg-info-subtle">{s.sname}</td></tr>
                      <tr>
                        <td>{formatDateShort(s.date, s.endDate)}</td>
                        <td>{sCity}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => onSelectShoot?.(s)}>
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
}

ShootAccordionItem.propTypes = {
  venueId: PropTypes.string,
  venueShoots: PropTypes.array,
  vIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  userLocation: PropTypes.object,
  onSelectShoot: PropTypes.func,
}

export default ShootAccordionItem
