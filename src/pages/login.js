import * as React from "react"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

/**
 * LoginPage Component
 *
 * Uses the `signin` search parameter to show the requested login option.
 */
const LoginPage = ({ location }) => {
  const params = new URLSearchParams(location?.search || "")
  const signinValue = params.get("signin")
  const currentView = ["shooter", "venue"].includes(signinValue)
    ? signinValue
    : "both"

  return (
    <Layout>
      <Seo title="Portal Login" />
      <main className="container pt-5 pb-5 my-5">
        <div className="row justify-content-center g-4">
          {(currentView === "both" || currentView === "shooter") && (
            <div className="col-lg-5 col-md-6">
              <div className="card h-100 shadow-sm border">
                <div className="card-header bg-primary text-white py-3 text-center">
                  <h4 className="mb-0 fs-5 fw-bold">Shooter Portal</h4>
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <p className="text-muted small text-center mb-4">
                    Log in to track your scores, manage saved archery shoots,
                    and customize your finder preferences.
                  </p>
                  <div className="border rounded p-4 bg-light text-center flex-grow-1 d-flex flex-column justify-content-center">
                    <h5 className="fw-bold">
                      Shooter sign in
                    </h5>
                    <p className="text-muted small mb-3">
                      Shooter accounts will be available soon.
                    </p>
                    <a
                      className="btn btn-dark align-self-center"
                      href="/shooter-feedback"
                    >
                      What you would like to see?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(currentView === "both" || currentView === "venue") && (
            <div className="col-lg-5 col-md-6">
              <div className="card h-100 shadow-sm border">
                <div className="card-header bg-dark text-white py-3 text-center">
                  <h4 className="mb-0 fs-5 fw-bold">Venue - Admin Portal</h4>
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <p className="text-muted small text-center mb-4">
                    Manage your venue, shoots, and account details.
                  </p>
                  <div className="border rounded p-4 bg-light text-center flex-grow-1 d-flex flex-column justify-content-center">
                    <h5 className="fw-bold">Venue accounts are coming</h5>
                    <p className="text-muted small mb-3">
                      Accounts will be subscription based.
                    </p>
                    <a
                      className="btn btn-dark align-self-center"
                      href="/venue-feedback"
                    >
                      What would help you?
                    </a>
                  </div>
                  {/* Previous Snipcart sign-in and registration actions:
                  <div>
                    <p className="text-muted small text-center mb-4">
                      Access your venue statistics, manage target directories,
                      or update your public profile settings.
                    </p>
                    <div
                      className="p-3 border rounded text-center mb-4"
                      style={{ background: "rgba(0,0,0,0.02)" }}
                    >
                      <p className="small text-muted mb-0">
                        Billing, invoicing, passwords, and cancellation tiers
                        are securely isolated through Snipcart.
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-dark w-100 py-3 fw-bold mt-auto snipcart-user-profile"
                    data-login="login"
                  >
                    Sign In to Venue Admin
                  </button>
                  <p className="text-center mt-3 mb-0">
                    <a href="/pricing">New Venue Registrations</a>
                  </p>
                  */}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}

export default LoginPage
