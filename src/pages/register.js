// src/pages/register.js
import * as React from "react"
import { useState, useEffect } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { navigate } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const RegisterPage = ({ location }) => {
  // 1. Get the Plan ID from the URL query parameter (?plan=...)
  const params = new URLSearchParams(location.search)
  const selectedPlanId = params.get("plan")

  // 2. Track form inputs and errors
  const [formData, setFormData] = useState({ venueName: "", contactEmail: "" })
  const [formError, setFormError] = useState("")

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (formError) setFormError("") // Clear error when typing
  }

  // Fallback check: If someone lands on /register without picking a plan, send them back
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

  // Determine host friendly label for the selected tier
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

  // Handle Free/Freemium signups without loading PayPal
  const handleFreeSignup = e => {
    e.preventDefault()
    if (!formData.venueName || !formData.contactEmail) {
      setFormError("Please fill out all fields before submitting.")
      return
    }

    // Save mock host to local storage for our draft portal
    const mockhost = {
      name: formData.venueName,
      email: formData.contactEmail,
      subscriptionId: "FREE-ACCOUNT",
      planId: "free",
      isLoggedIn: true,
    }
    localStorage.setItem("mock_venue_host", JSON.stringify(mockhost))

    alert("Non-Profit account drafted successfully!")
    navigate("/portal/")
  }

  return (
    <Layout>
      <Seo title={`Register - ${planLabel}`} />
      <main className="container pt-5 pb-5 my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-sm border">
              {/* Card Header showing selected plan */}
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

                {/* Step A: Gather Venue Account Info */}
                <form
                  onSubmit={isFree ? handleFreeSignup : e => e.preventDefault()}
                >
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

                  {/* Step B: Checkout Area */}
                  {isFree ? (
                    // Button for Freemium hosts
                    <button
                      type="submit"
                      className="btn btn-success w-100 py-2 fw-bold"
                    >
                      Complete Free Verification Setup
                    </button>
                  ) : (
                    // PayPal SDK Integration for Paid Subscriptions
                    <div>
                      <h5 className="fs-6 fw-bold mb-3 text-secondary">
                        Complete Your Secure PayPal Subscription
                      </h5>

                      {/* PayPal Script Wrapper: Replace "test" with your real Client ID later */}
                      <PayPalScriptProvider
                        options={{
                          "client-id":
                            "Af-85E7wXeddzdG2BnpJC7aVh71hDAzDdOuDmmbZNREZoPtZFtw8hTYV7wgXVFAk70fRgOX3QdfRCQc1",
                          vault: true,
                          intent: "subscription",
                        }}
                      >
                        <PayPalButtons
                          style={{
                            layout: "vertical",
                            shape: "rect",
                            label: "subscribe",
                          }}
                          // Block payment if form inputs are blank
                          onClick={(data, actions) => {
                            if (!formData.venueName || !formData.contactEmail) {
                              setFormError(
                                "Please fill out your Venue Name and Email first."
                              )
                              return actions.reject()
                            }
                            return actions.resolve()
                          }}
                          // Tells PayPal which automated plan to attach to this payment
                          createSubscription={(data, actions) => {
                            return actions.subscription.create({
                              plan_id: selectedPlanId,
                            })
                          }}
                          // Fires immediately after the host finishes approving the PayPal popup windows
                          onApprove={async (data, actions) => {
                            console.log(
                              "PayPal Approved Subscription Data:",
                              data
                            )

                            // Mock Session Data: Store in local browser cache to simulate a real host database
                            const mockhost = {
                              name: formData.venueName,
                              email: formData.contactEmail,
                              subscriptionId: data.subscriptionID,
                              planId: selectedPlanId,
                              isLoggedIn: true,
                            }
                            localStorage.setItem(
                              "mock_venue_host",
                              JSON.stringify(mockhost)
                            )

                            alert(
                              "Subscription Authorized! Redirecting to your venue portal dashboard..."
                            )

                            // Push host straight to their brand new dashboard layout
                            navigate("/portal")
                          }}
                          onError={err => {
                            console.error("PayPal Subscription SDK Error:", err)
                            setFormError(
                              "PayPal transaction encountered an error. Please try again."
                            )
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}
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
