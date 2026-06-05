// src/pages/pricing.js
import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const venueTiers = [
  {
    name: "Freemium",
    price: 0,
    billing: "Free Forever",
    themeColor: "success",
    borderClass: "border-success",
    badgeText: "Non-Profit",
    description: "Designed for community-driven clubs. Get verified and unlock essential event tracking features.",
    features: [
      "Green 'Verified Club' badge",
      "Full contact details, phone links & hours",
      "Unlimited local league & shoot listings",
      "Direct registration URL integration",
      "Basic monthly page-view tracking"
    ],
    verification: "Verify your 501(c)3/7 status with an EIN to qualify. For-profit clubs should upgrade to Premium.",
    buttonText: "Verify Non-Profit Status (Free)",
    buttonClass: "btn-outline-success",
    buttonLink: "/claim-verify"
  },
  {
    name: "Premium",
    price: 149,
    billing: "Billed annually",
    themeColor: "secondary",
    borderClass: "border-secondary",
    badgeText: " Clubs & Pro Shops",
    description: "Dominates your local 50-mile radius. Perfect for pro shops looking to turn digital traffic into retail foot traffic.",
    features: [
      "Everything in Freemium",
      "Advanced profile layout with photo gallery",
      "Social media feeds & video embeds",
      "Detailed local analytics dashboard",
      "Ad-free business promotion layout",
      "Priority email support"
    ],
    buttonText: "Upgrade to Premium",
    buttonClass: "btn-secondary",
    buttonLink: "/premium-signup"
  },
  {
    name: "Destination",
    price: 599,
    billing: "Billed annually",
    themeColor: "warning",
    borderClass: "border-warning border-2 shadow",
    badgeText: "Gold Tier / Elite Destination",
    description: "Designed for high-visibility brands pulling travel-ready shooters across state lines (like TAC, Bow Disciples, or multi-state tournament circuits).",
    features: [
      "Top-of-mind priority in search results",
      "Custom branded map pin icons",
      "Multi-course breakdown views per event",
      "Homepage countdowns for 'Registration Openings'",
      "Dedicated Vendor/Sponsor application links",
      "Geographic shooter intent analytics"
    ],
    verification: "Have a single, massive one-off flagship event? Contact us for a specialized $299 Single-Event rate.",
    buttonText: "Register Tour / Competition",
    buttonClass: "btn-warning text-dark",
    buttonLink: "/destination-signup"
  }
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
            Basic scraped listings are free in the directory. Take control of your venue to guarantee data accuracy, build local trust, or scale a national event circuit.
          </p>
        </div>
        
        {/* mb-5 ensures the row container itself keeps a safe space from the layout bottom */}
        <div className="row g-4 justify-content-center mb-5">
          {venueTiers.map((tier, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className={`card h-100 border ${tier.borderClass || ''} d-flex flex-column shadow-sm`}>
                <div className="card-header bg-light py-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">                    
                    <span className={`badge bg-${tier.themeColor || 'dark'} ${tier.themeColor === 'warning' ? 'text-dark' : ''} small`}>
                      {tier.badgeText}
                    </span>
                  </div>
                  <h5 className="card-title mb-0 fw-bold">{tier.name}</h5>
                  <p className="fw-bold fs-3 text-primary mb-0">
                    ${tier.price}
                    <small className="fs-6 text-muted fw-normal"> / {tier.billing}</small>
                  </p>
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <p className="card-text text-muted mb-3">{tier.description}</p>
                    {tier.verification && (
                      <div className="alert alert-warning small mb-3 p-2">
                        <i className="bi bi-info-circle me-1"></i>{tier.verification}
                      </div>
                    )}
                    <ul className="list-unstyled mb-4">
                      {tier.features?.map((feature, fIndex) => (
                        <li key={fIndex} className="mb-2 d-flex align-items-start">
                          <i className={`bi bi-check-circle text-${tier.themeColor || 'success'} me-2 mt-1`}></i>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to={tier.buttonLink} className={`btn ${tier.buttonClass} w-100 py-2 mt-auto fw-bold`}>
                    {tier.buttonText}
                  </Link>
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
