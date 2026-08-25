// src/templates/spotlight.js
import * as React from "react"
import { useState } from "react"
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
                alt={venue.vname || "Venue Imgae"}
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
                <span key={index} className="badge bg-primary mb-3 py-2 px-3 fw-bold small me-2">
                  <i className="bi bi-building-gear"></i>{" "}
                  {typeof type === "string" ? type.replace("_", " ") : ""}
                </span>
              ))
            ) : venue.venueType ? (
              <span className="badge bg-primary mb-3 py-2 px-3 fw-bold small">
                <i className="bi bi-building-gear"></i>{" "}
                {typeof venue.venueType === "string" ? venue.venueType.replace("_", " ") : ""}
              </span>
            ) : null}

            <h1 className="display-6 fst-italic">{venue.vname}</h1>
            <p className="lead my-3">{venue.tagline}</p>
          </div>
        </div>
        {/* CONTACT & lOCATION INFO */}
        <div className="row g-4 justify-content-center">
          <div className="col-md-6">
            <div className="p-3 border border-2 border-dark-subtle bg-body-tertiary rounded shadow-sm h-100">
              <h2 className="fs-2">Contact Info</h2>
              <p className="fs-5">
                <strong>Phone:</strong>{" "}
                {venue.contact.phone || "No Phone Listed"}
              </p>
              <p className="fs-5">
                <strong>Email:</strong>{" "}
                {venue.contact.email || "No Email Listed"}
              </p>
              <p className="fs-5">
                <strong>Website:</strong>{" "}
                {venue.contact.website || " No Website listed"}
              </p>
              <p className="fs-5">
                <strong>Socials:</strong>{" "}
                {venue.contact.socials || "No Socicals Listed"}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 border border-2 border-dark-subtle bg-body-tertiary rounded shadow-sm h-100">
              <h2 className="fs-2">Location & Directions</h2>
              <p className="fs-5">
                <strong>Address:</strong>{" "}
                {venue.location.address || "No Address listed"}
              </p>
              <p className="fs-5">
                <strong>City:</strong> {venue.location.city || "No City Listed"}
              </p>
              <p className="fs-5">
                <strong>State:</strong>{" "}
                {venue.location.state || "No State Listed"}
              </p>
              <button>Directions</button>
              {/* This need to be linked to the map on homepage */}
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

        {/* Standalone Equipment, Rentals & Tech Services Component  */}
        <div className="row mt-3 mb-3">
          <h3 className="fs-4 fw-bold text-dark pb-2 mb-1">
            <i className="bi bi-tools text-primary me-1"></i> Equipment & Pro
            Services
          </h3>
          <table className="table table-striped small">
            <thead className="table-dark">
              <tr>
                <th scope="col" className="text-start p-3">
                  Service
                </th>
                <th scope="col" className="p-3">
                  Details
                </th>
                <th scope="col" className="p-3">
                  Rates/Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {/* ROW 1: RENTALS  */}
              <tr>
                <td className="text-start fw-bold text-secondary p-3">
                  Equipment Rentals
                </td>
                <td className="p-3 text-dark fw-medium">
                  <span className="text-success fw-bold">
                    <i className="bi bi-check-circle-fill me-1"></i> Available
                  </span>
                  <br />
                  <small className="text-muted">
                    Recurve & Genesis compound setups on-site
                  </small>
                </td>
                <td className="p-3 text-dark fw-semibold">$15 / Hour</td>
              </tr>

              {/* ROW 2: RETAIL SALES  */}
              <tr>
                <td className="text-start fw-bold text-secondary p-3">
                  Equipment Sales
                </td>
                <td className="p-3 text-dark fw-medium">
                  <span className="text-primary fw-bold">
                    <i className="bi bi-tags-fill me-1"></i> Full Pro Shop
                  </span>
                  <br />
                  <small className="text-muted">
                    Bows, arrows, sights, stabilizers, and releases
                  </small>
                </td>
                <td className="p-3 text-muted">
                  Authorized Hoyt, Mathews, Elite Retailer
                </td>
              </tr>

              {/* ROW 3: PRO TECH SERVICES  */}
              <tr>
                <td className="text-start fw-bold text-secondary p-3">
                  Bow Corner
                </td>
                <td className="p-3 text-dark fw-medium">
                  <span className="text-success fw-bold">
                    <i className="bi bi-wrench-adjustable me-1"></i> Bowsmith
                  </span>
                  <br />
                  <small className="text-muted">
                    Paper tuning, timing sync, and timing adjustments
                  </small>
                </td>
                <td className="p-3 text-dark fw-semibold">
                  Custom Quotes / Bench Rates
                </td>
              </tr>

              {/* ROW 4: ARROW SERVICES  */}
              <tr>
                <td className="text-start fw-bold text-secondary p-3">
                  Arrow Corner
                </td>
                <td className="p-3 text-dark fw-medium">
                  <span className="text-success fw-bold">
                    <i className="bi bi-wrench-adjustable me-1"></i> Bowsmith
                  </span>
                  <br />
                  Precision arrow cutting, component gluing, and fletching
                  repairs
                </td>
                <td className="p-3 text-muted">Per Arrow / Per Dozen Rates</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RULES & REGULATIONS */}
        <div className="row">
          <h3 className="fs-4 fw-bold text-danger">
            <i className="bi bi-exclamation-triangle-fill me-1"></i> Rules &
            Regulations
          </h3>
          <p>{venue.rulesregulations || "No bio at listed at this time."}</p>
          {/* THIS NEEDS TO BE LOOK AT AND MAYBE ADDED TO THE
            DB AS A BOOLAN IF THE CURENT STATED RULE IS OR IS NOT TRUE */}
          {/* Rules & Regulations Component Block  */}
          {/* Critical Safety Alerts Row  */}
          <div className="col mb-3">
            <div className="alert alert-danger d-flex align-items-center mb-0 p-2 small">
              <i className="bi bi-x-octagon-fill fs-5 me-1"></i>
              <strong className="me-2">Broadhead Restriction:</strong>{" "}
              Broadheads are strictly banned on all standard target faces.
            </div>
          </div>
          <div className="col mb-3">
            <div className="alert alert-warning d-flex align-items-center mb-0 p-2 small text-dark">
              <i className="bi bi-speedometer2 fs-5 me-2"></i>
              <strong className="me-2">Speed Boundary:</strong> Maximum arrow
              velocity capped at 300 FPS to preserve foam layers.
            </div>
          </div>
        </div>

        {/* THIS NEED TO BE ADDED TO THE DB AS; THE CROSSBOW Allowance IS A BOOLON */}
        {/* Standard Policy Parameter Grid  */}
        <div className="row mt-3">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th scope="col" className="px-3 fs-5">
                  Requirements
                </th>
                <th scope="col" className="px-3 fs-5">
                  Guidelines
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold text-secondary p-3">
                  Crossbow Allowance
                </td>
                <td className="p-3 text-dark">
                  <span className="badge bg-danger py-1 px-2 me-2">
                    Banned Indoor
                  </span>
                  <span className="badge bg-success py-1 px-2">
                    Allowed Outdoor Loop Only
                  </span>
                </td>
              </tr>
              <tr>
                <td className="fw-bold text-secondary p-3">Drawing Conduct</td>
                <td className="p-3 text-dark">
                  <strong>No Sky Drawing:</strong> Bows must be drawn straight
                  down-range level with the target face plane.
                </td>
              </tr>
              <tr>
                <td className="fw-bold text-secondary p-3">
                  Youth Supervision
                </td>
                <td className="p-3 text-dark">
                  Archers under the age of 15 must be accompanied by an active
                  supervising adult at all times.
                </td>
              </tr>
              <tr>
                <td className="fw-bold text-secondary p-3">
                  Arrow Constraints
                </td>
                <td className="p-3 text-dark">
                  Target or field points only. Blunts, judo points, and
                  small-game tips are prohibited.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RANGE INFO */}
        <div className="row mt-3">
          <h3 className="fs-4 fw-bold text-dark pb-2 mt-3 mb-3">
            <i className="bi bi-cone-striped text-primary me-1"></i> Range
            Specifications
          </h3>
          {/* Bootstrap Responsive Table Container Component  */}
          <table className="table table-striped small">
            <thead className="table-dark">
              <tr>
                <th scope="col" className="text-start p-3">
                  Feature
                </th>
                <th scope="col" className="p-3">
                  Indoor
                </th>
                <th scope="col" className="p-3">
                  Outdoor
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-start fw-bold text-secondary p-3">
                  Status
                </td>
                <td className="p-3">
                  <span className="badge bg-success py-1 px-3 fw-bold">
                    Active
                  </span>
                </td>
                <td className="p-3">
                  <span className="badge bg-success py-1 px-3 fw-bold">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="text-start fw-bold text-secondary p-3">
                  Max Dist.
                </td>
                <td className="p-3 fw-semibold text-dark">30 Yards</td>
                <td className="p-3 fw-semibold text-dark">100+ Yards</td>
              </tr>
              <tr>
                <td className="text-start fw-bold text-secondary p-3">
                  Lane Cap.
                </td>
                <td className="p-3 text-muted">16 Active Lanes</td>
                <td className="p-3 text-muted">28 Target Walking Loop</td>
              </tr>
              <tr>
                <td className="text-start fw-bold text-secondary p-3">
                  Broadhead Tuning
                </td>
                <td className="p-3 text-danger fw-bold">
                  <i className="bi bi-x-circle-fill me-1"></i> Banned / No
                </td>
                <td className="p-3 text-success fw-bold">
                  <i className="bi bi-check-circle-fill me-1"></i> Allowed (Sand
                  Pits Only)
                </td>
              </tr>
              <tr>
                <td className="text-start fw-bold text-secondary p-3">
                  Target Type
                </td>
                <td className="p-3">
                  <div className="d-flex flex-wrap gap-1 justify-content-center">
                    <span className="badge bg-white text-secondary border px-2 py-1">
                      Paper Faces
                    </span>
                    <span className="badge bg-white text-secondary border px-2 py-1">
                      Foam Bales
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="d-flex flex-wrap gap-1 justify-content-center">
                    <span className="badge bg-white text-secondary border px-2 py-1">
                      3D Animal Foam
                    </span>
                    <span className="badge bg-white text-secondary border px-2 py-1">
                      Field Targets
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LEAGUES & CLASSES */}
        {/* Leagues, Classes & Programs Component Block  */}
        <div className="row g-4 mt-2">
          <h3 className="fs-4 fw-bold text-dark pb-0 mb-0">
            <i className="bi bi-calendar-event-fill text-primary me-1"></i>{" "}
            Leagues, Classes & Programs
          </h3>
          {/* PROGRAM ITEM 1: WEEKLY LEAGUE  */}
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span className="badge bg-primary p-2 mb-2 small text-uppercase">
                    Weekly League
                  </span>
                  <h5 className="fw-bold text-dark m-0">
                    Winter Indoor Bowhunter League
                  </h5>
                </div>
                <span className="badge bg-success p-2 mb-2 text-uppercase">
                  Enrolling
                </span>
              </div>

              <p className="text-muted small mb-3">
                Our premier indoor spot and 3D simulation league. Handicap
                scoring applies so archers of all skill levels can compete
                equally.
              </p>

              <ul className="list-group list-group-flush bg-transparent small border-top pt-2">
                <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-1">
                  <span className="text-muted fw-semibold">
                    <i className="bi bi-clock me-1"></i> Schedule
                  </span>
                  <strong className="text-dark">
                    Tuesdays @ 6:30 PM (10 Weeks)
                  </strong>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-1">
                  <span className="text-muted fw-semibold">
                    <i className="bi bi-crosshair me-1"></i> Divisions
                  </span>
                  <strong className="text-dark">
                    Compound, Traditional, Pins
                  </strong>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-1">
                  <span className="text-muted fw-semibold">
                    <i className="bi bi-cash-stack me-1"></i> Costs
                  </span>
                  <strong className="text-dark">
                    $12/Night or $100 Full Season
                  </strong>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-1 border-bottom-0 pb-0">
                  <span className="text-muted fw-semibold">
                    <i className="bi bi-info-circle me-1"></i> Access Rules
                  </span>
                  <strong className="text-primary fw-bold">
                    Walk-Ins Welcome First Night
                  </strong>
                </li>
              </ul>
            </div>
          </div>

          {/* PROGRAM ITEM 2: INSTRUCTIONAL CLASS  */}
          {/* <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span className="badge bg-secondary p-2 mb-2 text-uppercase">
                    Instructional Class
                  </span>
                  <h5 className="fw-bold text-dark m-0">
                    Introduction to Archery 101
                  </h5>
                </div>
                <span className="badge bg-warning p-2 m-0 text-uppercase">
                  Pre-Reg Required
                </span>
              </div>

              <p className="text-muted small mb-3">
                Perfect for total beginners. Covers standard safety lines, eye
                dominance, baseline shooting form, and shot execution rules.
                Rental gear is provided.
              </p>

              <ul className="list-group list-group-flush bg-transparent small border-top pt-2">
                <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-1">
                  <span className="text-muted fw-semibold">
                    <i className="bi bi-clock me-1"></i> Schedule
                  </span>
                  <strong className="text-dark">
                    Saturdays @ 9:00 AM (Single Session)
                  </strong>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-1">
                  <span className="text-muted fw-semibold">
                    <i className="bi bi-crosshair me-1"></i> Divisions
                  </span>
                  <strong className="text-dark">
                    Beginners Only (Ages 8 to Adult)
                  </strong>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-1">
                  <span className="text-muted fw-semibold">
                    <i className="bi bi-cash-stack me-1"></i> Costs
                  </span>
                  <strong className="text-dark">
                    $25 (Includes Bow & Arrow Rental)
                  </strong>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-1 border-bottom-0 pb-0">
                  <span className="text-muted fw-semibold">
                    <i className="bi bi-info-circle me-1"></i> Access Rules
                  </span>
                  <a
                    href="#"
                    className="btn btn-xs btn-success fw-bold py-0 px-2 small"
                    style={{ fontSize: "11px" }}
                  >
                    Book Slot Online
                  </a>
                </li>
              </ul>
            </div>
          </div>*/}
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
      slug
      tagline
      bio
      behavioralRules
      gearControl
      safteyEtiquette
      subscriptionStatus
      isMembership
      isClass
      isLeague
      subscriptionPlan
      img
      alt
      isClaimed
      sanctioning
      amenities
      services
      bowTypes
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
