// src/pages/pricing.js
import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/Layout" // Adjust path if needed
import Seo from "../components/seo"

const venueTiers = [
  {
    name: "Freemium (Non-Profit)",
    price: 0,
    description: "Free upgrade for verified non-profits. Get a custom landing page and full features without cost.",
    features: [
      "Custom landing page",
      "Full contact and facilities details",
      "Unlimited images and events integration",
      "Priority in search results",
      "Basic analytics"
    ],
    verification: "Verify your 501(c)3/7 status with EIN to qualify. If not eligible, upgrade to Premium.",
    buttonText: "Verify Non-Profit Status (Free)",
    buttonClass: "btn-outline-success",
    buttonLink: "/claim-verify" // Placeholder for EIN form; create later or link to /contact
  },
  {
    name: "Premium",
    price: 25, // Adjust price as needed
    description: "Paid upgrade for all venues. Maximum visibility with advanced features and support.",
    features: [
      "Advanced landing page with gallery",
      "Pro shop and event promotion",
      "Enhanced SEO and social embeds",
      "Dedicated support and custom integrations",
      "Full analytics dashboard",
      "Ad-free promotion"
    ],
    buttonText: "Upgrade to Premium",
    buttonClass: "btn-primary",
    buttonLink: "/premium-signup" // Placeholder for payment form; link to /contact for now
  }
]

const PricingPage = () => {
  return (
    <Layout>
      <Seo title="Pricing - Claim or Upgrade Your Venue" />
      <div className="container my-5">
        <h1 className="mb-4">Claim or Upgrade Your Venue Listing</h1>
        <p className="lead mb-4">Basic listings are free in the directory. Upgrade to Freemium (non-profits) or Premium for a dedicated landing page and more exposure to archers.</p>
        <div className="row g-4">
          {venueTiers.map((tier, index) => (
            <div key={index} className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">{tier.name}</h5>
                  <p className="fw-bold fs-4 text-primary mb-0">${tier.price}<small className="fs-6">/month</small></p>
                </div>
                <div className="card-body">
                  <p className="card-text">{tier.description}</p>
                  {tier.verification && (
                    <div className="alert alert-warning small mb-3">
                      <i className="bi bi-info-circle me-1"></i>{tier.verification}
                    </div>
                  )}
                  <ul className="list-unstyled mb-3">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>{feature}</li>
                    ))}
                  </ul>
                  <Link to={tier.buttonLink} className={tier.buttonClass + " w-100 d-block text-center py-2"}>
                    {tier.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="alert alert-info mt-5">
          <h6>Next Steps & Support</h6>
          <p>Verification for Freemium takes 24-48 hours. Premium upgrades are instant. Questions? <Link to="/contact">Contact us</Link>.</p>
        </div>
      </div>
    </Layout>
  )
}

export default PricingPage

export const Head = () => <Seo title="Pricing" />
