// src/pages/pricing.js
import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import { useEffect, useState } from "react"

const venueTiers = [
  {
    name: "Non-Profit",
    priceM: 0,
    themeColor: "success",
    borderClass: "border-success",
    badgeText: "Non-Profit",
    headline: "Unlimited shoots within 50 mi of business location",
    addShootL: "50 miles outside Bus. Locaiotion $15",
    addShootR: "Outside Bus. Locaiotion state $20",
    description:
      "Perfect for volunteer-run clubs, local leagues, and grassroots 3D shoots. Get discovered by hometown archers and keep your range busy.",
    features: [
      "Green 'Verified Club' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Visible to all archers within a 100-mile local driving radius",
      "Custom Spotlight page",
      "Unlimited local league & shoot listings",
      "Pause Monthly at anytime",
    ],
    verification: "EIN required for verification of your 501(c) status.",
    buttonText: "Verify Local Status (Free)",
    buttonClass: "btn-outline-success",
    snipcartIdM: "Non-Profit",
  },
  {
    name: "Local",
    priceM: 25,
    priceY: 250,
    themeColor: "success",
    borderClass: "border-success",
    badgeText: "Local",
    headline: "Unlimited shoots within 50 mi. of business location",
    addShootL: "50 miles outside Bus. Locaiotion $15",
    addShootR: "Outside Bus. Locaiotion state $20",
    description:
      "Perfect for volunteer-run clubs, local leagues, and grassroots 3D shoots. Get discovered by hometown archers and keep your range busy.",
    features: [
      "Green 'Verified Club' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Visible to all archers within a 100-mile local driving radius",
      "Custom Spotlight page",
      "Unlimited local league & shoot listings",
      "Monthly Analytics Metrics for ROI",
      "Pause Monthly at anytime",
    ],
    buttonTextM: "Monthly Subscription",
    buttonTextY: "Yearly Subscription",
    buttonClass: "btn-outline-success",
    snipcartIdM: "local-monthly-sub",
    snipcartIdY: "local-yearly-sub",
  },
  {
    name: "Regional",
    priceM: 55,
    priceY: 550,
    themeColor: "success",
    borderClass: "border-success",
    badgeText: "Regional",
    headline: "Unlimited shoots statewide of business location",
    addShootR: "Outside Bus. Locaiotion state $45",
    description:
      "Designed for state associations and regional clubs hosting multi-day tournaments or championship shoots that draw a traveling crowd.",
    features: [
      "Green 'Verified' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Visible state-wide and to out-of-state archers within a 300-mile radius",
      "Custom Spotlight page",
      "Unlimited local & regional shoot listings",
      "Monthly Analytics Metrics for ROI",
      "Pause Monthly at anytime",
    ],
    buttonTextM: "Monthly Subscription",
    buttonTextY: "Yearly Subscription",
    buttonClass: "btn-outline-success",
    snipcartIdM: "regional-monthly-sub",
    snipcartIdY: "regional-yearly-sub",
  },
  {
    name: "Pro Shops",
    priceM: 45,
    priceY: 450,
    billing: "Yearly billing includes 2 mo free",
    themeColor: "danger",
    borderClass: "border-secondary",
    badgeText: "Pro Shops",
    headline: "Drive Foot Traffic and Increase Sales",
    addShootR: "Outside Bus. Locaiotion state $45",
    description:
      "Built for commercial brick-and-mortar archery retailers looking to turn local users into paying customers at their tech counters and lanes.",
    features: [
      "Green 'Verified' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Target active, gear-buying archers within your state",
      "Custom Spotlight page",
      "Display full pro shop services (bow tuning, lessons, lane rentals)",
      "Monthly Analytics Metrics for ROI",
      "Pause Monthly at anytime",
    ],
    buttonTextM: "Monthly Subscription",
    buttonTextY: "Yearly Subscription",
    buttonClass: "btn-outline-danger",
    snipcartIdM: "pro-shops-monthly-sub",
    snipcartIdY: "pro-shops-yearly-sub",
  },
  {
    name: "National",
    priceM: 99,
    priceY: 990,
    themeColor: "warning",
    borderClass: "border-warning border-2 shadow",
    badgeText: "National",
    headline: "National Tournaments & Competitions",
    addShootL: "Inculde all states at not additional cost",
    description:
      "The ultimate package for major multi-state touring circuits and massive national competitive organizations running unlimited events.",
    features: [
      "Green 'Verified' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Visible nationwide to all active archers",
      "Custom Spotlight page",
      "Logo in app banner & ASFinder Splash page",
      "Monthly Analytics Metrics for ROI",
      "Pause Monthly at anytime",
    ],
    buttonTextM: "Monthly Subscription",
    buttonTextY: "Yearly Subscription",
    buttonClass: "btn-outline-warning",
    snipcartIdM: "national-monthly-sub",
    snipcartIdY: "national-yearly-sub",
  },
]

const PricingPage = () => {
  const [claimInfo, setClaimInfo] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const claimVenueId = params.get("claimVenueId")
      const venueName = params.get("venueName")

      // Only set claimInfo when a venue is actually being claimed via a URL query string
      if (claimVenueId) {
        setClaimInfo({
          id: claimVenueId,
          name: venueName ? decodeURIComponent(venueName) : "this venue",
        })
      } else {
        setClaimInfo(null) // new venue layout → no message banner
      }
    }
  }, [])

  // Custom helper to dynamically generate consistent metadata flags for Snipcart v2
  const getSnipcartMetadata = () => {
    return JSON.stringify({
      claimVenueId: claimInfo ? claimInfo.id : "new",
      checkoutMode: claimInfo ? "login_or_register" : "register_only",
    })
  }

  return (
    <Layout>
      <Seo title="Pricing - Claim or Upgrade Your Venue" />
      {/* pt-5 pushes content below sticky navbars. pb-5 forces a bottom buffer area. */}
      <main className="container pt-5 pb-5 my-5">
        <div className="text-center mb-5">
          <h1 className="fs-2 mb-3 lead text-center">
            {claimInfo && (
              <div className="alert alert-info text-center mb-4">
                <strong>You are claiming {claimInfo.name}</strong>
                <br />
                <small>
                  Complete your subscription below to activate management
                  access.
                </small>
              </div>
            )}
          </h1>
        </div>

        {/* mb-5 ensures the row container itself keeps a safe space from the layout bottom */}
        <div className="row g-4 justify-content-center mb-5">
          {venueTiers.map((tier, index) => (
            <div key={index} className="col-lg-4 col-md-4">
              <div
                className={`card h-100 border ${
                  tier.borderClass || ""
                } d-flex flex-column shadow-sm`}
              >
                <div className="card-header bg-light py-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className={`badge bg-${tier.themeColor || "dark"} ${
                        tier.themeColor === "warning" ? "text-dark" : ""
                      } small`}
                    >
                      {tier.badgeText}
                    </span>
                  </div>
                  <p className="fw-bold fs-3 text-primary mb-0">
                    ${tier.priceM}/mo
                  </p>
                  <h5 className="card-title mt-2 mb-0 fw-bold">{tier.name}</h5>
                </div>

                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <p className="small fw-bold text-dark mb-2">
                      {tier.headline}
                    </p>
                    <p className="text-muted small mb-4">{tier.description}</p>
                    <hr />
                    <ul className="list-unstyled small text-muted mb-4">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="mb-2 d-flex align-items-start">
                          <span className="text-success me-2">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-3">
                    {tier.name === "Non-Profit" ? (
                      <>
                        <button
                          className="snipcart-add-item btn w-100 fw-bold btn-success"
                          data-item-id={tier.snipcartIdM}
                          data-item-name={`${tier.name} Plan - Free Verification`}
                          data-item-price="0.00"
                          data-item-url="/pricing"
                          data-item-metadata={getSnipcartMetadata()}
                        >
                          {tier.buttonText}
                        </button>
                        <p
                          className="text-center text-muted small mt-2 mb-0"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {tier.verification}
                        </p>
                      </>
                    ) : (
                      <div className="d-grid gap-2">
                        <button
                          className={`snipcart-add-item btn ${tier.buttonClass} fw-bold`}
                          data-item-id={tier.snipcartIdM}
                          data-item-name={`${tier.name} Plan - Monthly`}
                          data-item-price={tier.priceM.toFixed(2)}
                          data-item-url="/pricing"
                          data-item-metadata={getSnipcartMetadata()}
                        >
                          {tier.buttonTextM}
                        </button>

                        <button
                          className="snipcart-add-item btn btn-dark fw-bold"
                          data-item-id={tier.snipcartIdY}
                          data-item-name={`${tier.name} Plan - Yearly`}
                          data-item-price={tier.priceY.toFixed(2)}
                          data-item-url="/pricing"
                          data-item-metadata={getSnipcartMetadata()}
                        >
                          {tier.buttonTextY}
                        </button>
                        {tier.billing && (
                          <span
                            className="text-center text-muted small d-block mt-1"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {tier.billing}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  )
}

export default PricingPage

export const Head = () => <Seo title="Pricing & Tier Upgrades" />
