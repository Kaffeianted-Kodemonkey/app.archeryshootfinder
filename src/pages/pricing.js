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
  //const [venueId, setVenueId] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      //const claimVenueId = params.get("claimVenueId")
      const venueName = params.get("venueName")
    }
  }, [])

  return (
    <Layout>
      <Seo title="Pricing - Claim or Upgrade Your Venue" />
      {/* pt-5 pushes content below sticky navbars. pb-5 forces a bottom buffer area. */}
      <main className="container pt-5 pb-5 my-5">
        <div class="alert alert-warning" role="alert">
          App is in Development using Mock Data!
          <br />
          Subcriptions do not work in <strong>TEST MODE</strong>!
        </div>
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

          {/* <p className="lead mx-auto" style={{ maxWidth: "800px" }}>
            Basic scraped listings are free in the directory. Take control of
            your venue to guarantee data accuracy, build local trust, or scale a
            national event circuit.
          </p>*/}
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
                  {/* <h5 className="card-title mb-0 fw-bold">{tier.name}</h5>*/}
                  <p className="fw-bold fs-3 text-primary mb-0">
                    {tier.name === "Non-Profit" ? (
                      <>
                        ${tier.priceM}/mo <br />
                        <small className="fs-6 text-muted fw-normal">
                          Free Forever!
                        </small>
                      </>
                    ) : (
                      <>
                        ${tier.priceM}mo / ${tier.priceY}yr <br />
                        <small className="fs-6 text-muted fw-normal">
                          Yearly billing includes 2 mo free
                        </small>
                      </>
                    )}
                  </p>
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h2 className="card-text text-muted mb-3 fs-6">
                      {tier.headline}
                    </h2>
                    <hr />
                    <p className="card-text text-muted mb-3">
                      {tier.description}
                    </p>
                    {tier.verification && (
                      <div className="alert alert-warning small mb-3 p-2">
                        <i className="bi bi-info-circle me-1"></i>
                        {tier.verification}
                      </div>
                    )}
                    <ul className="list-unstyled mb-4">
                      {tier.features?.map((feature, fIndex) => (
                        <li
                          key={fIndex}
                          className="mb-2 d-flex align-items-start"
                        >
                          <i
                            className={`bi bi-check-circle text-${
                              tier.themeColor || "success"
                            } me-2 mt-1`}
                          ></i>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p>
                    <strong>Cost Per shoot: </strong>
                    <br />
                    {tier.addShootL}
                    <br />
                    {tier.addShootR}
                  </p>

                  {tier.name === "Non-Profit" ? (
                    <div className="d-flex gap-2">
                      <Link
                        to={tier.buttonLink}
                        className={`btn btn-sm ${tier.buttonClass}  py-2 mt-auto fw-bold`}
                      >
                        {tier.buttonText}
                      </Link>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      {/* SNIPCART MONTHLY CHECKOUT BUTTO N */}
                      <button
                        className={`snipcart-add-item btn btn-sm ${tier.buttonClass} py-2 mt-auto fw-bold`}
                        data-item-id={`${tier.name
                          .toLowerCase()
                          .replace(" ", "-")}-monthly`}
                        data-item-name={`${tier.name} - Monthly Subscription`}
                        data-item-url="/pricing"
                        data-item-price={tier.priceM}
                        data-item-plan-id={tier.snipcartIdM}
                        data-item-description={`Billed monthly at $${tier.priceM}/mo.`}
                        data-plan-id={`${tier.name}-Monthly`}
                        data-plan-name={`${tier.name} - Monthly Subscription`}
                        data-item-payment-interval="Month"
                        data-item-payment-interval-count="1"
                        data-item-plan-price={tier.priceM}
                      >
                        {tier.buttonTextM}
                      </button>

                      {/* SNIPCART YEARLY CHECKOUT BUTTON */}
                      <button
                        className={`snipcart-add-item btn btn-sm ${tier.buttonClass} py-2 mt-auto fw-bold`}
                        data-item-id={`${tier.name
                          .toLowerCase()
                          .replace(" ", "-")}-yearly`}
                        data-item-name={`${tier.name} - Yearly Subscription`}
                        data-item-price={tier.priceY}
                        data-item-url="/pricing"
                        data-item-description={`Billed yearly at $${tier.priceY}/yr.`}
                        data-plan-id={`${tier.name}-Yearly`}
                        data-plan-name={`${tier.name} - Yearly Subscription`}
                        data-item-payment-interval="Year"
                        data-plan-payment-count="1"
                        data-item-plan-price={tier.priceY}
                      >
                        {tier.buttonTextY}
                      </button>
                    </div>
                  )}
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
