// src/pages/portal.js
import React, { useEffect, useState } from "react"
import { Router } from "@reach/router"
import { navigate } from "gatsby"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import AdminDash from "../components/AdminDash"
import Profile from "../components/Profile"

const Portal = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      if (window.Snipcart?.api?.user?.current) {
        try {
          const c = await window.Snipcart.api.user.current()
          if (c?.email) {
            setUser({
              name: c.billingAddress?.company || c.email.split("@")[0],
              email: c.email,
              isLoggedIn: true,
              venue: {
                name: c.billingAddress?.company || "Venue",
                email: c.email,
              },
            })
            setLoading(false)
            return
          }
        } catch (_) {}
      }
      const saved = localStorage.getItem("mock_venue_user")
      if (saved) setUser(JSON.parse(saved))
      else navigate("/login")
      setLoading(false)
    }
    check()
  }, [])

  if (loading)
    return (
      <Layout>
        <div className="text-center py-5">Loading...</div>
      </Layout>
    )
  if (!user) return null

  return (
    <Layout>
      <Seo title="Portal" />
      <Router basepath="/portal">
        <AdminDash path="/" user={user} />
        <Profile path="/profile" user={user} />
      </Router>
    </Layout>
  )
}
export default Portal
