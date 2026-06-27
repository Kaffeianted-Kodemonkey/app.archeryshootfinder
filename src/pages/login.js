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

    setTimeout(() => {
      if (!email.trim()) {
        setError("Please enter the email you used at checkout.")
        setLoading(false)
        return
      }

      // Create or restore the session record
      const user = {
        name: "Venue Owner",
        email: email.trim(),
        isLoggedIn: true,
        venue: {
          name: "Venue",
          email: email.trim(),
        },
      }

      localStorage.setItem("mock_venue_user", JSON.stringify(user))
      navigate("/portal")
    }, 400)
  }

  return (
    <Layout>
      <Seo title="Login" />
      <main className="container pt-5 pb-5 my-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-sm border">
              <div className="card-header bg-dark text-white py-3 text-center">
                <h4 className="mb-0 fs-5 fw-bold">Venue Portal Sign In</h4>
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
                    <label className="form-label small fw-bold">
                      Account Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="email you used at checkout"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
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
