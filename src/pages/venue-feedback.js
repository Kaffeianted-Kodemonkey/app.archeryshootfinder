import * as React from "react"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const VenueFeedbackPage = () => (
  <Layout>
    <Seo title="Help Shape Venue Listings - Archery Shoot Finder" />
    <main className="container pt-5 pb-5 my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-4">
            <span className="badge bg-warning text-dark mb-3 fs-5">
              <i className="bi bi-tools me-1" aria-hidden="true" />
              In development
            </span>
            <h1 className="fs-2 mb-3">Help us shape venue listings</h1>
            <p className="lead">
              We’re developing a way for archery clubs, ranges, and shops to
              claim and manage their listings. We’d like to hear what would be
              useful to you before we build it.
            </p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="fs-4 mb-3">What would help your organization?</h2>
              <p className="text-muted">
                Tell us what you’d want to update or manage, and which tools
                would make Archery Shoot Finder more useful for your club,
                range, or shop.
              </p>

              <form action="https://formspree.io/f/moeeepqp" method="POST">
                <div className="mb-3">
                  <label htmlFor="venue-name" className="form-label">
                    Venue or organization name <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    id="venue-name"
                    name="venue_name"
                    className="form-control"
                    type="text"
                    autoComplete="organization"
                  />
                </div>

                {/* <div className="mb-3">
                  <label htmlFor="venue-link" className="form-label">
                    Listing link <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    id="venue-link"
                    name="venue_link"
                    className="form-control"
                    type="url"
                    placeholder="https://archeryshootfinder.com/venues/..."
                  />
                </div>*/}

                <fieldset className="mb-3">
                  <legend className="fs-6 fw-semibold">
                    What would you want to manage?
                  </legend>
                  {[
                    ["listing", "Venue details, hours, and contact information"],
                    ["shoots", "Shoot and event listings"],
                    ["photos", "Photos, logo, and facilities"],
                    ["promotions", "Announcements or promotions"],
                    ["insights", "Views and other listing insights"],
                  ].map(([value, label]) => (
                    <div className="form-check" key={value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`feature-${value}`}
                        name="useful_features"
                        value={value}
                      />
                      <label className="form-check-label" htmlFor={`feature-${value}`}>
                        {label}
                      </label>
                    </div>
                  ))}
                </fieldset>

                <div className="mb-3">
                  <label htmlFor="feedback" className="form-label">
                    What else would be useful?
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    className="form-control"
                    rows="5"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-muted">(optional, if you’d like a reply)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    className="form-control"
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Send feedback
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-muted small mt-4">
            Claiming and listing management are still in development. Sending
            feedback does not claim a venue or create an account.
          </p>
        </div>
      </div>
    </main>
  </Layout>
)

export default VenueFeedbackPage
