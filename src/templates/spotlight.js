// src/templates/spotlight.js
import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const SpotlightTemplate = ({ data }) => {
  const venue = data?.venuesJson

  if (!venue) return null

  const mapQuery =
    venue.location?.lat != null && venue.location?.lng != null
      ? `${venue.location.lat},${venue.location.lng}`
      : [
          venue.location?.address,
          venue.location?.city,
          venue.location?.state,
          venue.location?.zip,
        ]
          .filter(Boolean)
          .join(", ")
  const directionsUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : null
  const venueTypes = Array.isArray(venue.venueType)
    ? venue.venueType
    : venue.venueType
    ? [venue.venueType]
    : []
  const facilityDetails = [
    ["Range types", venue.rangeType?.join(", ")],
    ["Target types", venue.targetType?.join(", ")],
    ["Indoor maximum distance", venue.maxDistIndoor],
    ["Outdoor maximum distance", venue.maxDistOutdoor],
    ["Indoor lane capacity", venue.laneCapIndoor],
    ["Outdoor lane capacity", venue.laneCapOutdoor],
  ].filter(([, value]) => value)

  return (
    <Layout>
      <Seo title={venue.vname} description={venue.description} />

      {/* Floating Close Button – always shown on Spotlight pages */}
      <button
        onClick={() => window.history.back()}
        className="btn btn-dark position-fixed"
        style={{
          top: "60px",
          right: "15px",
          zIndex: 2000,
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          fontSize: "1.5rem",
          lineHeight: "1",
        }}
        aria-label="Close and return to shoot list"
      >
        ✕
      </button>

      <main className="container py-3 py-md-5">
        <div className="card border-0 shadow-sm mb-4 overflow-hidden">
          {venue.img ? (
            <img
              src={venue.img}
              alt={venue.vname || "Venue"}
              className="w-100"
              style={{ maxHeight: "360px", objectFit: "cover" }}
            />
          ) : (
            <div className="bg-body-tertiary text-muted text-center py-5">
              Venue image not available
            </div>
          )}
          <div className="card-body p-3 p-md-4">
            <div className="d-flex flex-wrap gap-2 mb-2">
              {venueTypes.map((type, index) => (
                <span key={`${type}-${index}`} className="badge bg-primary">
                  {typeof type === "string" ? type.replace(/_/g, " ") : ""}
                </span>
              ))}
            </div>
            <h1 className="h2 mb-2">{venue.vname}</h1>
            <p className="lead mb-0">
              {venue.tagline || "No tagline provided."}
            </p>
          </div>
        </div>

        <div className="row g-3 g-lg-4">
          <div className="col-12 col-lg-5">
            <section className="card h-100 shadow-sm">
              <div className="card-body p-3 p-md-4">
                <h2 className="h4">Plan your visit</h2>
                <address className="mb-3">
                  {venue.location?.address && (
                    <>
                      {venue.location.address}
                      <br />
                    </>
                  )}
                  {[
                    venue.location?.city,
                    venue.location?.state,
                    venue.location?.zip,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Location not listed"}
                </address>
                {venue.hours?.length > 0 ? (
                  <div className="mb-3">
                    <h3 className="h6">Hours</h3>
                    <ul className="list-unstyled mb-0">
                      {venue.hours.map((hours, index) => (
                        <li key={`${(hours.day || []).join("-")}-${index}`}>
                          {(hours.day || []).join(", ")}: {hours.open || "Hours unavailable"}
                          {hours.close ? `–${hours.close}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-muted mb-3">Hours not listed.</p>
                )}
                {directionsUrl && (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-100 mb-3"
                  >
                    <i className="bi bi-geo-alt-fill me-2" aria-hidden="true"></i>
                    Get directions
                  </a>
                )}
                <div className="d-grid gap-2">
                  {venue.contact?.phone ? (
                    <a
                      className="btn btn-outline-secondary"
                      href={`tel:${venue.contact.phone}`}
                    >
                      Call venue
                    </a>
                  ) : (
                    <span className="small text-muted">No phone listed</span>
                  )}
                  {venue.contact?.email ? (
                    <a
                      className="btn btn-outline-secondary"
                      href={`mailto:${venue.contact.email}`}
                    >
                      Email venue
                    </a>
                  ) : (
                    <span className="small text-muted">No email listed</span>
                  )}
                  {venue.contact?.membershipUrl && (
                    <a
                      className="btn btn-outline-primary"
                      href={venue.contact.membershipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Membership information
                    </a>
                  )}
                  {venue.contact?.website ? (
                    <a
                      className="btn btn-outline-secondary"
                      href={venue.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit website
                    </a>
                  ) : (
                    <span className="small text-muted">No website listed</span>
                  )}
                </div>
                {venue.contact?.socials?.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {venue.contact.socials.map((social, index) => (
                      <a
                        key={`${social.name}-${index}`}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        {social.name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="small text-muted mt-3 mb-0">
                    No social links listed.
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="col-12 col-lg-7">
            <section className="card h-100 shadow-sm">
              <div className="card-body p-3 p-md-4">
                <h2 className="h4">About the venue</h2>
                <p className="mb-0">
                  {venue.bio || "Venue information coming soon."}
                </p>
              </div>
            </section>
          </div>

          <div className="col-12 col-md-6">
            <section className="card h-100 shadow-sm">
              <div className="card-body p-3 p-md-4">
                <h2 className="h4">Amenities & services</h2>
                <h3 className="h6">Amenities</h3>
                {venue.amenities?.length > 0 ? (
                  <ul className="mb-3">
                    {venue.amenities.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No amenities listed.</p>
                )}
                <h3 className="h6">Services</h3>
                {venue.services?.length > 0 ? (
                  <ul className="mb-3">
                    {venue.services.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No services listed.</p>
                )}
                <p className="mb-0">
                  <strong>Bow types:</strong>{" "}
                  {venue.bowTypes?.length
                    ? venue.bowTypes.join(", ")
                    : "Not listed"}
                </p>
              </div>
            </section>
          </div>

          <div className="col-12 col-md-6">
            <section className="card h-100 shadow-sm">
              <div className="card-body p-3 p-md-4">
                <h2 className="h4">Facility details</h2>
                <dl className="row mb-0">
                  {facilityDetails.length ? (
                    facilityDetails.map(([label, value]) => (
                      <React.Fragment key={label}>
                        <dt className="col-7">{label}</dt>
                        <dd className="col-5">{value}</dd>
                      </React.Fragment>
                    ))
                  ) : (
                    <dd className="col-12 text-muted">
                      Facility details not listed.
                    </dd>
                  )}
                </dl>
              </div>
            </section>
          </div>

          <div className="col-12">
            <section className="card shadow-sm">
              <div className="card-body p-3 p-md-4">
                <h2 className="h4">Association sanctions</h2>
                {venue.sanctioning?.length ? (
                  <div className="table-responsive">
                    <table className="table table-striped align-middle mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Association</th>
                          <th scope="col">Scope</th>
                          <th scope="col">Website</th>
                        </tr>
                      </thead>
                      <tbody>
                        {venue.sanctioning.map((acronym, index) => {
                          const association = venue.sanctioningAssociations?.find(
                            item => item?.acronym === acronym
                          )

                          return (
                            <tr key={`${acronym}-${index}`}>
                              <td>
                                {association?.assocName || acronym}
                                {association?.assocName && (
                                  <span className="text-muted"> ({acronym})</span>
                                )}
                              </td>
                              <td>{association?.scope || "—"}</td>
                              <td>
                                {association?.websiteUrl ? (
                                  <a
                                    href={association.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Visit website
                                  </a>
                                ) : (
                                  "—"
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted mb-0">No sanctions listed.</p>
                )}
              </div>
            </section>
          </div>

          <div className="col-12">
            <section className="card border-warning-subtle shadow-sm">
              <div className="card-body p-3 p-md-4">
                <h2 className="h4">Rules & safety</h2>
                <div className="row">
                  {[
                    ["Behavioral rules", venue.behavioralRules],
                    ["Equipment rules", venue.gearControl],
                    ["Safety etiquette", venue.safetyEtiquette],
                  ].map(([heading, rules]) =>
                    rules?.length > 0 && (
                      <div className="col-12 col-md-4" key={heading}>
                        <h3 className="h6">{heading}</h3>
                        <ul className="mb-3 mb-md-0">
                          {rules.map((rule, index) => (
                            <li key={`${heading}-${index}`}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
                {!venue.behavioralRules?.length &&
                  !venue.gearControl?.length &&
                  !venue.safetyEtiquette?.length && (
                    <p className="text-muted mb-0">No venue rules listed.</p>
                  )}
              </div>
            </section>
          </div>
        </div>

      </main>
    </Layout>
  )
}

// FULL ENUM-SAFE INJECTION PAGE QUERY
export const query = graphql`
  query GetVersatileSpotlightVenue($id: String!) {
    venuesJson(id: { eq: $id }) {
      vname
      venueType
      tagline
      bio
      behavioralRules
      gearControl
      safetyEtiquette
      img
      alt
      sanctioning
      sanctioningAssociations {
        acronym
        assocName
        websiteUrl
        logoUrl
        scope
      }
      amenities
      services
      bowTypes
      rangeType
      targetType
      maxDistIndoor
      maxDistOutdoor
      laneCapIndoor
      laneCapOutdoor
      hours {
        day
        open
        close
      }
      location {
        address
        city
        state
        zip
        lat
        lng
      }
      contact {
        phone
        email
        website
        membershipUrl
        socials {
          name
          url
        }
      }
    }
  }
`

export default SpotlightTemplate
