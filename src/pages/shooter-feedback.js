import * as React from "react"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const ShooterFeedbackPage = () => (
  <Layout>
    <Seo title="Help Shape Shooter Accounts - Archery Shoot Finder" />
    <main className="container pt-5 pb-5 my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-4">
            <span className="badge bg-warning text-dark mb-3 fs-5">
              <i className="bi bi-tools me-1" aria-hidden="true" />
              In development
            </span>
            <h1 className="fs-2 mb-3">Help us shape shooter accounts</h1>
            <p className="lead">
              We’re exploring accounts for archers and would like to hear what
              would make them useful to you.
            </p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="fs-4 mb-3">What would help you?</h2>
              <p className="text-muted">
                Tell us what you’d want to save, track, or customize on
                Archery Shoot Finder.
              </p>

              <form action="https://formspree.io/f/xbgggpwb" method="POST">
                <div className="mb-3">
                  <label htmlFor="shooter-name" className="form-label">
                    Name <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    id="shooter-name"
                    name="name"
                    className="form-control"
                    type="text"
                    autoComplete="name"
                  />
                </div>

                <fieldset className="mb-3">
                  <legend className="fs-6 fw-semibold">
                    What would you use?
                  </legend>
                  {[
                    ["saved-shoots", "Save shoots I’m interested in"],
                    ["scores", "Track my scores"],
                    ["preferences", "Customize my shoot finder preferences"],
                    ["history", "Keep a history of shoots I’ve attended"],
                  ].map(([value, label]) => (
                    <div className="form-check" key={value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`feature-${value}`}
                        name="useful_features"
                        value={value}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`feature-${value}`}
                      >
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
                    Email{" "}
                    <span className="text-muted">
                      (optional, if you’d like a reply)
                    </span>
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
            Shooter accounts are still in development. Sending feedback does
            not create an account.
          </p>
        </div>
      </div>
    </main>
  </Layout>
)

export default ShooterFeedbackPage
