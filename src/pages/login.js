import * as React from "react"
import { useState, useEffect } from "react"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
/**
 * LoginPage Component
 *
 * Automatically captures the `signin` search parameter from the URL query string
 * via Gatsby's `location` prop, conditionally filtering the login view options.
 */ const LoginPage = ({ location }) => {
  const [currentView, setCurrentView] = useState("both")

  useEffect(() => {
    // Check for query parameters safely on the client side to avoid SSR mismatch
    if (location?.search) {
      const params = new URLSearchParams(location.search)
      const signinValue = params.get("signin")

      if (signinValue === "shooter") {
        setCurrentView("shooter")
      } else if (signinValue === "venue") {
        setCurrentView("venue")
      }
    }
  }, [location])

  return (
    <Layout>
      <Seo title="Portal Login" />
      <main className="container pt-5 pb-5 my-5">
        {/* Navigation utility to return to view both options if desired */}
        {/* {currentView !== "both" && (
          <div className="text-center mb-4">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setCurrentView("both")
                // Safely clean up the address bar query string state
                if (typeof window !== "undefined") {
                  window.history.pushState({}, "", "/login")
                }
              }}
            >
              ← View All Login Options
            </button>
          </div>
        )}*/}

        <div className="row justify-content-center g-4">
          {/* LEFT COLUMN: CONSUMER PORTAL (SHOOTERS VIA STYTCH) */}
          {(currentView === "both" || currentView === "shooter") && (
            <div className="col-lg-5 col-md-6">
              <div className="card h-100 shadow-sm border">
                <div className="card-header bg-primary text-white py-3 text-center">
                  <h4 className="mb-0 fs-5 fw-bold">Shooter Portal</h4>
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <p className="text-muted small text-center mb-4">
                      Log in to track your scores, manage saved archery shoots,
                      and customize your finder preferences.
                    </p>

                    {/* Target anchor placeholder for Stytch login initialization script later */}
                    <div
                      id="stytch-sdk-ui-root"
                      className="border rounded p-3 bg-light text-center text-muted small"
                      style={{
                        minHeight: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Stytch Passwordless SDK UI <br /> (Will handle shooter
                      login later)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN: BUSINESS PORTAL (VENUES VIA SNIPCART) */}
          {/* {(currentView === "both" || currentView === "venue") && (
            <div className="col-lg-5 col-md-6">
              <div className="card h-100 shadow-sm border">
                <div className="card-header bg-dark text-white py-3 text-center">
                  <h4 className="mb-0 fs-5 fw-bold">Venue Admin Portal</h4>
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">*/}
          {/* <div>
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
                  </div>*/}

          {/* Using the native class trigger opens the standard modal cleanly */}
          {/* <button
                    className="btn btn-dark w-100 py-3 fw-bold mt-auto snipcart-user-profile"
                    data-login="login"
                  >
                    Sign In to Venue Admin
                  </button>*/}
          {/* </div>
              </div>*/}
          {/* <div className="row">
                <div className="col mt-3">
                  <p>
                    <a href="/pricing">New Venue Registrations</a>
                  </p>
                </div>
              </div>*/}
          {/* </div>
          )}*/}
        </div>
      </main>
    </Layout>
  )
}
export default LoginPage
