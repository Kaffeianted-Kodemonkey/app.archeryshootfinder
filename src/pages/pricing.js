// src/pages/pricing.js
import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const venueTiers = [
  {
    name: "Freemium",
    priceM: 0,
    billing: "Free Forever",
    themeColor: "success",
    borderClass: "border-success",
    badgeText: "Local Non-Profit",
    headline: "Empower Your Local Archery Community",
    description:
      "Perfect for volunteer-run clubs, local leagues, and grassroots 3D shoots. Get discovered by hometown archers and keep your range busy.",
    features: [
      "Green 'Verified Club' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Visible to all archers within a 100-mile local driving radius",
      "Custom Spotlight page",
      "Unlimited local league & shoot listings",
      "Monthly Analytics Metrics for ROI",
    ],
    verification: "EIN required for verification of your 501(c) status.",
    buttonText: "Verify Local Status (Free)",
    buttonClass: "btn-outline-success",
    buttonLink:
      "/register?plan=Af-85E7wXeddzdG2BnpJC7aVh71hDAzDdOuDmmbZNREZoPtZFtw8hTYV7wgXVFAk70fRgOX3QdfRCQc1",
  },
  {
    name: "Regional Non-Profit",
    priceM: 25,
    priceY: 275,
    billingY: "(billed annually — Save 1 month free!)",
    themeColor: "success",
    borderClass: "border-success",
    badgeText: "Regional Non-Profit",
    headline: "Expand Your Reach Across the Region",
    description:
      "Designed for state associations and regional clubs hosting multi-day tournaments or championship shoots that draw a traveling crowd.",
    features: [
      "Green 'Verified' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Visible state-wide and to out-of-state archers within a 300-mile radius",
      "Custom Spotlight page",
      "Unlimited local & regional shoot listings",
      "Monthly Analytics Metrics for ROI",
    ],
    buttonTextM: "Monthly Subscription",
    buttonTextY: "Yearly Subscription",
    buttonClass: "btn-outline-success",
    buttonLinkM: "/register?plan=P-2R964487TT6048906NIUHRMQ", // FIX: Was pointing to free tier
    buttonLinkY: "/register?plan=P-9XK50720WX185754DNIUMZSA",
  },
  {
    name: "Pro Shops",
    priceM: 45,
    priceY: 495,
    billingY: "(billed annually — Save 1 month free!)",
    themeColor: "danger",
    borderClass: "border-secondary",
    badgeText: "Pro Shops",
    headline: "Drive Foot Traffic and Increase Sales", // FIX: Typo 'increass'
    description:
      "Built for commercial brick-and-mortar archery retailers looking to turn local users into paying customers at their tech counters and lanes.",
    features: [
      "Green 'Verified' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Target active, gear-buying archers within a 100-mile radius",
      "Custom Spotlight page",
      "Display full pro shop services (bow tuning, lessons, lane rentals)",
      "Monthly Analytics Metrics for ROI",
    ],
    buttonTextM: "Monthly Subscription",
    buttonTextY: "Yearly Subscription",
    buttonClass: "btn-outline-danger",
    buttonLinkM: "/register?plan=P-0LA72823FD1895121NIUMQZY",
    buttonLinkY: "/register?plan=P-1B047872NY769674TNIUMSGA",
  },
  {
    name: "Local Destination",
    priceY: 299,
    billingY: "Billed annually",
    themeColor: "warning",
    borderClass: "border-warning border-2 shadow",
    badgeText: "Local Destination",
    headline: "Local Reach with up to 2 Major Events",
    description:
      "List your major weekend events in the directory and stand out on the map so traveling archers can find you.", // FIX: Typo 'direcotry'
    features: [
      "Green 'Verified' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Visible to all archers within a 100-mile local driving radius",
      "Custom Spotlight page",
      "Logo in app banner & ASFinder Splash page",
      "Monthly Analytics Metrics for ROI",
    ],
    verification: "List local events with up to 2 Large Events", // FIX: Typo 'withup'
    buttonText: "Yearly Subscription",
    buttonClass: "btn-outline-warning", // FIX: Mismatched theme color
    buttonLink: "/register?plan=PROD-9C970826KR889811B",
  },
  {
    name: "Regional Destination",
    priceY: 599,
    billingY: "Billed annually",
    themeColor: "warning",
    borderClass: "border-warning border-2 shadow",
    badgeText: "Regional Destination",
    headline: "Regional Reach with up to 5 Major Events",
    description:
      "List your major weekend events in the directory and stand out on the map so traveling archers can find you.",
    features: [
      "Green 'Verified' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Visible state-wide and to out-of-state archers within a 300-mile radius",
      "Custom Spotlight page",
      "Logo in app banner & ASFinder Splash page",
      "Monthly Analytics Metrics for ROI",
    ],
    verification: "Local & Regional with up to 5 Large Events",
    buttonText: "Yearly Subscription", // FIX: Typo 'Destinaion'
    buttonClass: "btn-outline-warning", // FIX: Mismatched theme color
    buttonLink: "/register?plan=P-5J527610V72114814NIUM73A", // FIX: Duplicate ID
  },
  {
    name: "National Destination",
    priceY: 995,
    billingY: "Billed annually",
    themeColor: "warning",
    borderClass: "border-warning border-2 shadow",
    badgeText: "National Destination",
    headline: "National Tournaments & Competitions",
    description:
      "The ultimate marketing package for major multi-state touring circuits and massive national competitive organizations running unlimited events.",
    features: [
      "Green 'Verified' badge",
      "Directory Listing with pre-generated non-verified shoots",
      "Visible nationwide to all active archers", // FIX: Typo 'Nation wide'
      "Custom Spotlight page",
      "Logo in app banner & ASFinder Splash page",
      "Monthly Analytics Metrics for ROI",
    ],
    verification: "Unlimited local, regional, & national Events",
    buttonText: "Yearly Subscription", // FIX: Typo 'Destinaion'
    buttonClass: "btn-outline-warning", // FIX: Mismatched theme color
    buttonLink: "/register?plan=P-63B70373DT466414ANIUNAVA", // FIX: Duplicate ID
  },
]

const PricingPage = () => {
  return (
    <Layout>
      <Seo title="Pricing - Claim or Upgrade Your Venue" />
      {/* pt-5 pushes content below sticky navbars. pb-5 forces a bottom buffer area. */}
      <main className="container pt-5 pb-5 my-5">
        <div className="text-center mb-5">
          <h1 className="mb-3">Claim or Upgrade Your Venue Listing</h1>
          <p className="lead mx-auto" style={{ maxWidth: "800px" }}>
            Basic scraped listings are free in the directory. Take control of
            your venue to guarantee data accuracy, build local trust, or scale a
            national event circuit.
          </p>
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
                  <h5 className="card-title mb-0 fw-bold">{tier.name}</h5>
                  <p className="fw-bold fs-3 text-primary mb-0">
                    {tier.name === "Freemium" ? (
                      `$${tier.priceM}/mo`
                    ) : tier.name.includes("Destination") ? (
                      <>
                        ${tier.priceY}/yr <br />
                        <small className="fs-6 text-muted fw-normal">
                          ({tier.billingY})
                        </small>
                      </>
                    ) : (
                      <>
                        ${tier.priceM}mo / ${tier.priceY}yr <br />
                        <small className="fs-6 text-muted fw-normal">
                          {tier.billingY}
                        </small>
                      </>
                    )}
                  </p>
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h2 className="card-text text-muted mb-3 fs-5">
                      {tier.headline}
                    </h2>
                    <hr />
                    <p className="card-text text-muted mb-3">
                      {tier.description}
                    </p>

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
                  {tier.verification && (
                    <div className="alert alert-warning small mb-3 p-2">
                      <i className="bi bi-info-circle me-1"></i>
                      {tier.verification}
                    </div>
                  )}

                  {tier.name === "Fremium" ? (
                    <Link
                      to={tier.buttonLink}
                      className={`btn btn-md ${tier.buttonClass}  py-2 mt-auto fw-bold`}
                    >
                      {tier.buttonText}
                    </Link>
                  ) : tier.name.includes("Regional Non-Profit") ||
                    tier.name.includes("Pro Shops") ? (
                    <>
                      <Link
                        to={tier.buttonLinkM}
                        className={`btn btn-md ${tier.buttonClass} py-2 mt-auto fw-bold`}
                      >
                        {tier.buttonTextM}
                      </Link>
                      <Link
                        to={tier.buttonLinkY}
                        className={`btn btn-md ${tier.buttonClass} py-2 mt-auto fw-bold`}
                      >
                        {tier.buttonTextY}
                      </Link>
                    </>
                  ) : (
                    <Link
                      to={tier.buttonLink}
                      className={`btn btn-md ${tier.buttonClass}  py-2 mt-auto fw-bold`}
                    >
                      {tier.buttonText}
                    </Link>
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
