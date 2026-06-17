// src/pages/portal.js
import React, { useEffect, useState } from "react"
import { Router } from "@reach/router"
import { navigate } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import AdminDash from "../components/AdminDash"
import Profile from "../components/Profile"

const Portal = () => {
  const [host, sethost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedhost = localStorage.getItem("mock_venue_host")
    if (savedhost) {
      sethost(JSON.parse(savedhost))
    } else {
      navigate("/login")
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Portal...</span>
          </div>
        </div>
      </Layout>
    )
  }

  if (!host) return null

  // Format subscription plan naming rules for the badge string display
  const getPlanBadgeLabel = () => {
    const plan = host.planId ? host.planId.toUpperCase() : ""
    if (plan.includes("DESTINATION")) return "Destination Tier"
    if (plan.includes("PREMIUM")) return "⭐ Premium Tier"
    return "Freemium Non-Profit"
  }

  return (
    <Layout>
      <Seo title="Venue Management Portal" />
      <div className="container-fluid my-5 pt-4">
        <div className="row">
          <main className="col-12 px-md-4">
            {/* FIXED TOP ACTION BAR: Displays welcome and subscription label */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
              <div>
                <h1 className="h2 fw-bold text-dark mb-0">
                  Welcome back, {host.name}!
                </h1>
                <p className="text-muted small mb-0">
                  Managing content & account parameters for:{" "}
                  <strong>{host.email}</strong>
                </p>
              </div>

              {/* TOP RIGHT: Replaced buttons with Active Subscription level indicator badge */}
              <div className="btn-toolbar mb-2 mb-md-0 mt-2 mt-md-0">
                <span className="badge bg-success fs-6 py-2 px-3 shadow-sm border border-success">
                  {getPlanBadgeLabel()}
                </span>
              </div>
            </div>

            {/* DYNAMIC CONTENT ROUTER PANEL */}
            <div className="py-2">
              <Router basepath="/portal">
                <AdminDash path="/" host={host} />
                <Profile path="/profile" host={host} />
              </Router>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default Portal
