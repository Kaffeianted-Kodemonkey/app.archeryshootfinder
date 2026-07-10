// src/pages/register.js
import * as React from "react"
import { useState, useEffect } from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const RegisterPage = ({ location }) => {
  // 1. Initialize state values as safely empty for server-side building
  const [selectedPlanId, setSelectedPlanId] = useState(null)
  const [formData, setFormData] = useState({
    venueName: "",
    contactEmail: "",
  })
  const [formError, setFormError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // 2. Safely parse URL parameters once the page runs inside a real browser
  useEffect(() => {
    if (typeof window !== "undefined" && location) {
      const params = new URLSearchParams(location.search)

      setSelectedPlanId(params.get("plan"))
      setFormData({
        venueName: params.get("venueName") || params.get("company") || "",
        contactEmail: params.get("email") || "",
      })
      setIsLoading(false)
    }
  }, [location])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateAccount = e => {
    e.preventDefault()
    if (!formData.venueName || !formData.contactEmail) {
      setFormError("Please fill out all fields before submitting.")
      return
    }

    // Guard clause to ensure localStorage and window only run on client runtime
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(location.search)
      const plan = urlParams.get("plan") || "free"
      const claimVenueId = urlParams.get("claimVenueId")

      // 1. Create the user session
      const mockUser = {
        name: formData.venueName,
        email: formData.contactEmail,
        planId: plan,
        isLoggedIn: true,
        venueId: claimVenueId ? Number(claimVenueId) : null,
      }
      localStorage.setItem("mock_venue_user", JSON.stringify(mockUser))

      // 2. Store a venue record that includes isClaimed: true
      const venueRecord = {
        id: claimVenueId ? `claimed_${claimVenueId}` : `new_${Date.now()}`,
        name: formData.venueName,
        tier: plan.includes("regional")
          ? "Regional"
          : plan.includes("pro")
          ? "Pro Shops"
          : "Local",
        isClaimed: true,
        planId: plan,
        claimedAt: new Date().toISOString(),
      }
      localStorage.setItem("mock_venue", JSON.stringify(venueRecord))

      // 3. Keep the existing claim flags (for backward compatibility)
      if (claimVenueId) {
        localStorage.setItem("claimed_venue_id", claimVenueId)
        localStorage.setItem("venue_claimed", "true")
        localStorage.setItem("claimed_plan", plan)
      }

      navigate("/portal")
    }
  }

  // Show a blank or loading state while compiling on the server or reading URL hooks
  if (isLoading) {
    return (
      <Layout>
        <Seo title="Loading Registration..." />
        <div className="container py-5 my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    )
  }

  if (!selectedPlanId) {
    return (
      <Layout>
        <Seo title="Registration Error" />
        <div className="container py-5 my-5 text-center">
          <div className="alert alert-danger d-inline-block p-4">
            <h4 className="alert-heading">No Subscription Selected</h4>
            <p className="mb-3">
              Please select a subscription level from our pricing page to
              continue.
            </p>
            <button
              className="btn btn-primary fw-bold"
              onClick={() => navigate("/pricing")}
            >
              View Pricing Tiers
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const isFree =
    selectedPlanId ===
    "Af-85E7wXeddzdG2BnpJC7aVh71hDAzDdOuDmmbZNREZoPtZFtw8hTYV7wgXVFAk70fRgOX3QdfRCQc1"

  const planLabel = isFree
    ? "Freemium Tier"
    : selectedPlanId.includes("DESTINATION")
    ? "Destination Tier"
    : selectedPlanId.includes("2R964487") || selectedPlanId.includes("9XK50720")
    ? "Regional Non-Profit Tier"
    : selectedPlanId.includes("0LA72823") || selectedPlanId.includes("1B047872")
    ? "Pro Shop / Premium Tier"
    : "Premium Tier"

  return (
    <Layout>
      <Seo title={`Register - ${planLabel}`} />
      <main className="container pt-5 pb-5 my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-sm border">
              <div className="card-header bg-dark text-white py-3">
                <h4 className="mb-0 fs-5 fw-bold">Venue Registration</h4>
                <small className="text-light-50">
                  Selected Level:{" "}
                  <strong className="text-warning">{planLabel}</strong>
                </small>
              </div>

              <div className="card-body p-4">
                {formError && (
                  <div className="alert alert-danger small py-2">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleCreateAccount}>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      name="venueName"
                      className="form-control"
                      placeholder="e.g., Mountain Archery Club"
                      value={formData.venueName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold small text-muted">
                      Contact Email Address
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      className="form-control"
                      placeholder="e.g., manager@venue.com"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <hr className="my-4" />

                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold"
                  >
                    Create Account &amp; Continue to Portal
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

export default RegisterPage
