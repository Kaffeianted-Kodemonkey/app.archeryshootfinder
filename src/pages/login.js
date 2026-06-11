// src/pages/login.js
import * as React from "react"
import { useState } from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = e => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate network delay
    setTimeout(() => {
      // 1. Look for a mock user previously created during registration
      const registeredUserString = localStorage.getItem("mock_venue_user")

      if (!registeredUserString) {
        setError(
          "No registered venue found. Please go to the pricing page to sign up first!"
        )
        setLoading(false)
        return
      }

      const registeredUser = JSON.parse(registeredUserString)

      // 2. Validate the email (Case-insensitive check)
      if (
        email.toLowerCase().trim() === registeredUser.email.toLowerCase().trim()
      ) {
        // Update the cached user session to mark them as actively logged in
        registeredUser.isLoggedIn = true
        localStorage.setItem("mock_venue_user", JSON.stringify(registeredUser))

        // 3. Send them straight into their working dashboard!
        navigate("/portal")
      } else {
        setError(
          "Invalid email address. (Hint: Use the exact email you registered with!)"
        )
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <Layout>
      <Seo title="Venue Portal Login" />
      <main className="container pt-5 pb-5 my-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-sm border">
              <div className="card-header bg-dark text-white py-3 text-center">
                <h4 className="mb-0 fs-5 fw-bold">Venue Portal Sign In</h4>
                <small className="text-light-50">
                  Manage your subscription and spotlight data
                </small>
              </div>

              <div className="card-body p-4">
                {error && (
                  <div
                    className="alert alert-danger small py-2 text-center"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-muted mb-1">
                      Account Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="e.g., manager@venue.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold mb-3 shadow-sm d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Verifying Session...
                      </>
                    ) : (
                      "Sign In to Dashboard"
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <p className="small text-muted mb-0">
                      Need to list a new venue?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/pricing")}
                        className="btn btn-link p-0 small fw-bold text-decoration-none"
                      >
                        View Subscription Tiers
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default LoginPage
