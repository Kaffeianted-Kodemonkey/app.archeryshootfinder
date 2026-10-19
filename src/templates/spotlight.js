// src/templates/spotlight.js
import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const SpotlightTemplate = ({ data }) => {
  const venue = data?.venuesJson

  if (!venue) return null

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

      <main className="container py-5 border border-2 border-warning-subtle bg-white rounded shadow-sm">
        {/* TITLE AND TAGLINE & HERO IMAGE */}
        <div className="row px-3 py-5 mb-4  text-body-emphasis">
          <div className="col">
            {venue.img ? (
              <img
                src={venue.img}
                alt={venue.vname || "Venue Image"}
                className="img-fluid rounded"
              />
            ) : (
              <span className="text-muted small">
                Update image in the Dashboard
              </span>
            )}
          </div>
        </div>
        {/* TITLE AND TAGLINE */}
        <div className="row px-3 pt-3 mb-4 text-body-emphasis border-top border-bottom border-2 border-success bg-success-subtle">
          <div className="col">
            {Array.isArray(venue.venueType) ? (
              venue.venueType.map((type, index) => (
                <span
                  key={index}
                  className="badge bg-primary mb-3 py-2 px-3 fw-bold small me-2"
                >
                  <i className="bi bi-building-gear"></i>{" "}
                  {typeof type === "string" ? type.replace("_", " ") : ""}
                </span>
              ))
            ) : venue.venueType ? (
              <span className="badge bg-primary mb-3 py-2 px-3 fw-bold small">
                <i className="bi bi-building-gear"></i>{" "}
                {typeof venue.venueType === "string"
                  ? venue.venueType.replace("_", " ")
                  : ""}
              </span>
            ) : null}

            <h1 className="display-6 fst-italic">{venue.vname}</h1>
            <p className="lead my-3">{venue.tagline}</p>
          </div>
        </div>
        {/* CONTACT & LOCATION INFO */}
        <div className="row g-4 justify-content-center">
          <div className="col-md-6">
            <div className="p-3 border border-2 border-dark-subtle bg-body-tertiary rounded shadow-sm h-100">
              <h2 className="fs-2">Contact Info</h2>
              <p className="fs-5">
                <strong>Phone:</strong>{" "}
                {venue.contact?.phone || "No Phone Listed"}
              </p>
              <p className="fs-5">
                <strong>Email:</strong>{" "}
                {venue.contact?.email || "No Email Listed"}
              </p>
              <p className="fs-5">
                <strong>Website:</strong>{" "}
                {venue.contact?.website || " No Website listed"}
              </p>
              <p className="fs-5">
                <strong>Socials:</strong>{" "}
                {venue.contact?.socials?.length > 0 ? (
                  venue.contact.socials.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge bg-secondary text-decoration-none text-white px-2 py-1"
                    >
                      {social.name}
                    </a>
                  ))
                ) : (
                  <span className="text-muted fs-6">No Socials Listed</span>
                )}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 border border-2 border-dark-subtle bg-body-tertiary rounded shadow-sm h-100">
              <h2 className="fs-2">Location & Directions</h2>
              <p className="fs-5">
                <strong>Address:</strong>{" "}
                {venue.location?.address || "No Address listed"}
              </p>
              <p className="fs-5">
                <strong>City:</strong> {venue.location?.city || "No City Listed"}
              </p>
              <p className="fs-5">
                <strong>State:</strong>{" "}
                {venue.location?.state || "No State Listed"}
              </p>
              {venue.hours?.length > 0 && (
                <div>
                  <strong>Hours:</strong>
                  <ul className="mb-0">
                    {venue.hours.map((hours, index) => (
                      <li key={index}>
                        {(hours.day || []).join(", ")}: {hours.open || "Hours unavailable"}
                        {hours.close ? `–${hours.close}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button>Directions</button>
              {/* This needs to be linked to the map on the homepage */}
            </div>
          </div>
        </div>
        {/* ABOUT & AMENITIES*/}
        <div className="row mt-3">
          <div className="col-12 p-3">
            <h2 className="fw-bold text-dark border-bottom pb-2 mb-3">
              Our Facility
            </h2>
            <p>{venue.bio || "No Bio Listed"}</p>
          </div>
          <div className="col p-3">
            <h3 className="fw-bold text-dark border-bottom pb-2 mb-3">
              Amenities
            </h3>
            {(() => {
              const amenities = venue.amenities || []
              const mid = Math.ceil(amenities.length / 2)
              const left = amenities.slice(0, mid)
              const right = amenities.slice(mid)
              return (
                <div className="row">
                  <div className="col">
                    <ul className="list-unstyled">
                      {left.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="col">
                    <ul className="list-unstyled">
                      {right.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
        <hr />

        {/* Database-backed services and equipment */}
        <div className="row mt-3 mb-3">
          <h3 className="fs-4 fw-bold text-dark pb-2 mb-1">
            <i className="bi bi-tools text-primary me-1"></i> Services &
            Equipment
          </h3>
          {venue.services?.length ? (
            <ul className="list-group">
              {venue.services.map((service, index) => (
                <li className="list-group-item" key={index}>{service}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No services listed.</p>
          )}
          {venue.bowTypes?.length > 0 && (
            <p className="mt-3">
              <strong>Bow types:</strong> {venue.bowTypes.join(", ")}
            </p>
          )}
        </div>

        {/* RULES & REGULATIONS */}
        <div className="row">
          <h3 className="fs-4 fw-bold text-danger">
            <i className="bi bi-exclamation-triangle-fill me-1"></i> Rules &
            Regulations
          </h3>
          {[
            ["Behavioral rules", venue.behavioralRules],
            ["Equipment rules", venue.gearControl],
            ["Safety etiquette", venue.safetyEtiquette],
          ].map(
            ([heading, rules]) =>
              rules?.length > 0 && (
                <div className="col-12 mb-3" key={heading}>
                  <h4 className="fs-6 fw-bold">{heading}</h4>
                  <ul>
                    {rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </div>

        {/* Database-backed range information */}
        <div className="row mt-3">
          <h3 className="fs-4 fw-bold text-dark pb-2 mt-3 mb-3">
            <i className="bi bi-cone-striped text-primary me-1"></i> Range information
          </h3>
          <dl className="row">
            {[
              ["Range types", venue.rangeType?.join(", ")],
              ["Target types", venue.targetType?.join(", ")],
              ["Indoor maximum distance", venue.maxDistIndoor],
              ["Outdoor maximum distance", venue.maxDistOutdoor],
              ["Indoor lane capacity", venue.laneCapIndoor],
              ["Outdoor lane capacity", venue.laneCapOutdoor],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <React.Fragment key={label}>
                  <dt className="col-sm-4">{label}</dt>
                  <dd className="col-sm-8">{value}</dd>
                </React.Fragment>
              ))}
          </dl>
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
        socials {
          name
          url
        }
      }
    }
  }
`

export default SpotlightTemplate
