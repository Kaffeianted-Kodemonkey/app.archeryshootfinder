// src/templates/spotlight.js
import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import { Link } from "gatsby"

const SpotlightTemplate = ({ data }) => {
  const venue = data?.venuesJson

  if (!venue) {
    return (
      <Layout>
        <div className="container py-5">Venue not found.</div>
      </Layout>
    )
  }

  const location = venue.location || {}
  const contact = venue.contact || {}
  const hours = venue.hours || {}
  const isClaimed = venue.isClaimed === true || venue.isClaimed === "true"

  return (
    <Layout>
      <Seo title={venue.vname} description={venue.bio || venue.tagline} />

      {/* Floating Close Button */}
      <button
        onClick={() => window.history.back()}
        className="btn btn-dark position-fixed"
        style={{
          top: "70px",
          right: "20px",
          zIndex: 2000,
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "1.6rem",
        }}
      >
        ✕
      </button>

      <main className="container py-5">
        <div className="row">
          <div className="col-12">
            {isClaimed && (
              <span className="badge bg-success mb-3">
                <i className="bi bi-patch-check-fill"></i> Verified Venue
              </span>
            )}

            <h1 className="display-5 fw-bold">{venue.vname}</h1>
            <p className="lead text-muted">{venue.tagline}</p>

            <div className="mb-4">
              <span className="badge bg-primary me-2">
                {venue.venueType?.replace("_", " ")}
              </span>
              {venue.subscriptionPlan &&
                venue.subscriptionPlan !== "Freemium" && (
                  <span className="badge bg-warning text-dark">Premium</span>
                )}
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header bg-light">
                <strong>Location</strong>
              </div>
              <div className="card-body">
                <p>
                  <strong>Address:</strong> {location.address || "Not listed"}
                </p>
                <p>
                  <strong>City:</strong> {location.city || "—"}
                </p>
                <p>
                  <strong>State:</strong> {location.state || "—"}
                </p>
                {location.lat && location.lng && (
                  <p className="text-muted small">
                    Lat: {location.lat.toFixed(4)}, Lng:{" "}
                    {location.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header bg-light">
                <strong>Contact Information</strong>
              </div>
              <div className="card-body">
                {contact.phone && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </p>
                )}
                {contact.email && (
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </p>
                )}
                {contact.website && (
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contact.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-5">
          <h3 className="border-bottom pb-3 mb-4">About This Venue</h3>
          <p className="lead">
            {venue.bio || venue.description || "No description available."}
          </p>
        </div>

        {/* Hours */}
        {(hours.weekday || hours.weekend) && (
          <div className="mb-5">
            <h3 className="border-bottom pb-3 mb-4">Hours</h3>
            {hours.weekday && (
              <p>
                <strong>Weekdays:</strong> {hours.weekday}
              </p>
            )}
            {hours.weekend && (
              <p>
                <strong>Weekends:</strong> {hours.weekend}
              </p>
            )}
          </div>
        )}

        {/* Amenities */}
        {venue.amenities && venue.amenities.length > 0 && (
          <div>
            <h3 className="border-bottom pb-3 mb-4">Amenities</h3>
            <div className="row row-cols-2 row-cols-md-3 g-3">
              {venue.amenities.map((item, i) => (
                <div key={i} className="col">
                  <div className="bg-light p-3 rounded">{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 text-center">
          <Link to="/" className="btn btn-outline-secondary">
            ← Back to All Venues
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export default SpotlightTemplate

export const query = graphql`
  query SpotlightPage($id: String!) {
    venuesJson(id: { eq: $id }) {
      vname
      accOwner
      venueType
      isClaimed
      isLeague
      isClass
      isMembership
      img
      alt
      tagline
      bio
      behavioralRules
      gearControl
      safteyEtiquette
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
      }
      hours {
        day
        open
        close
      }
      rangeType
      targetType
      tuningIndoor
      tuningOutdoor
      maDistIndoor
      maDistOutdoor
      laneCapIndoor
      laneCapOutdoor
      amenities
      services
      sanctioning
      bowTypes
    }
  }
`
