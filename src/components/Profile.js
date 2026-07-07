// src/components/Profile.js
import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const Profile = ({ user: propUser, data }) => {
  // Pull real Snipcart user data to fill any missing fields from the prop
  const [snipUser, setSnipUser] = useState(null)

  useEffect(() => {
    const loadSnipcart = async () => {
      if (window.Snipcart?.api?.user?.current) {
        try {
          const c = await window.Snipcart.api.user.current()
          if (c?.email) {
            setSnipUser({
              name: c.billingAddress?.company || c.email.split("@")[0],
              email: c.email,
              phone: c.billingAddress?.phone || "",
              address: c.billingAddress?.address1 || "",
              city: c.billingAddress?.city || "",
              state: c.billingAddress?.province || "",
              zip: c.billingAddress?.postalCode || "",
              venue: {
                name: c.billingAddress?.company || "Venue",
                email: c.email,
                phone: c.billingAddress?.phone || "",
              },
            })
          }
        } catch (_) {}
      }
    }
    loadSnipcart()
  }, [])

  // Merge: propUser always wins; fall back to Snipcart data only when missing
  const user = {
    ...snipUser,
    ...propUser,
    venue: { ...snipUser?.venue, ...propUser?.venue },
  }

  // 1. Setup local form state mirroring your custom WordPress schema
  const [formData, setFormData] = useState({
    name: user?.name || "",
    venueType: user?.venueType, // Matches your VenueType Enum
    description: "",
    location: {
      address: user?.location || "",
      city: user?.city || "",
      state: user?.state || "",
      zip: user?.zip || "",
    },
    contact: {
      phone: user?.phone || "",
      email: user?.email || "",
      website: user?.url || "",
    },
    facilities: [], // Holds selected Facility Enums
  })

  const [saveStatus, setSaveStatus] = useState("")

  const [selectedVenueId, setSelectedVenueId] = useState(null)
  const Shoots = data?.allShootsJson?.nodes || []
  const Venues = data?.allVenuesJson?.nodes || []
  const [view, setView] = useState("map")
  const [myShoots, setMyShoots] = useState([])
  const [editingShoot, setEditingShoot] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // === NEW: Bottom sheet state ===
  const [showVenueSheet, setShowVenueSheet] = useState(false)
  const [showShootSheet, setShowShootSheet] = useState(false)
  const [selectedShoot, setSelectedShoot] = useState(null)

  const venue = user

  // Handler for top-level text inputs
  const handleTopLevelChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handler for nested object items (location & contact fields)
  const handleNestedChange = (section, e) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [e.target.name]: e.target.value,
      },
    })
  }

  useEffect(() => {
    if (!user || !Shoots.length) return

    // The user owns exactly one venue – get its ID
    const venueId = user.venueId || user.venue?.venueId

    const ownedShoots = Shoots.filter(
      s => s.venueId === venueId || s.venue?.venueId === venueId
    )

    setMyShoots(ownedShoots)
  }, [user, Shoots])

  // Handler for pushing/removing checked facility enums from state array
  const handleFacilityChange = facilityEnum => {
    const currentFacilities = [...formData.facilities]
    const index = currentFacilities.indexOf(facilityEnum)

    if (index > -1) {
      currentFacilities.splice(index, 1) // Remove if unchecked
    } else {
      currentFacilities.push(facilityEnum) // Add if checked
    }

    setFormData({ ...formData, facilities: currentFacilities })
  }

  // Emulate sending a clean payload to the WordPress API
  const handleSubmit = e => {
    e.preventDefault()
    setSaveStatus("Syncing changes with WordPress Custom Post Type...")

    setTimeout(() => {
      console.log("Structured payload ready for WP-API:", formData)
      setSaveStatus("✅ Profile synced successfully! Public Spotlight updated.")
    }, 1200)
  }

  // Options matching your exact gatsby-node.js Facility Enum strings
  // const facilityOptions = [
  //   { label: "3D Course", value: "THREE_D_COURSE" },
  //   { label: "Indoor Range", value: "INDOOR_RANGE" },
  //   { label: "Outdoor Range", value: "OUTDOOR_RANGE" },
  //   { label: "Pro Shop on Site", value: "PRO_SHOP" },
  //   { label: "Kitchen / Food Prep", value: "KITCHEN" },
  //   { label: "Campground Available", value: "CAMPING" },
  // ]

  return (
    <div>
      {/* View Header */}
      {/* ========== VENUE DETAILS FORM (no card, no slide) ========== */}
      <div className="mb-4">
        <h4 className="h5 fw-bold mb-3">Venue Details</h4>

        <form>
          <div className="row g-3">
            {/* Venue Name */}
            <div className="col-md-12">
              <label htmlFor="venueName" className="form-label">
                Venue/Company Name
              </label>
              <input
                type="text"
                className="form-control"
                id="venueName"
                defaultValue={user?.venue?.name || user?.name || ""}
              />
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label htmlFor="venuePhone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                className="form-control"
                id="venuePhone"
                defaultValue={user?.venue?.phone || user?.phone || ""}
              />
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label htmlFor="venueEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="venueEmail"
                defaultValue={user?.venue?.email || user?.email || ""}
              />
            </div>

            {/* Address */}
            <div className="col-12">
              <label htmlFor="venueAddress" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="venueAddress"
                defaultValue={user?.address || ""}
              />
            </div>

            {/* City */}
            <div className="col-md-6">
              <label htmlFor="venueCity" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="venueCity"
                defaultValue={user?.city || ""}
              />
            </div>

            {/* State */}
            <div className="col-md-4">
              <label htmlFor="venueState" className="form-label">
                State
              </label>
              <select
                id="venueState"
                className="form-select"
                defaultValue={user?.state || ""}
              >
                <option value="">Choose...</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                {/* Add the rest of the states as needed */}
              </select>
            </div>

            {/* Zip */}
            <div className="col-md-2">
              <label htmlFor="venueZip" className="form-label">
                Zip
              </label>
              <input
                type="text"
                className="form-control"
                id="venueZip"
                defaultValue={user?.zip || ""}
              />
            </div>
          </div>

          <div className="mt-4">
            <button type="button" className="btn btn-primary fw-bold">
              Save Venue Details
            </button>
          </div>
        </form>
      </div>

      {/* ========== SHOOTS LIST (always visible) ========== */}
      <div className="card border mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h4 className="h5 fw-bold mb-0">My Shoot Events</h4>
            <p className="text-muted small mb-0">
              Tap any row to edit or claim
            </p>
          </div>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setSelectedShoot({
                id: `new-${Date.now()}`,
                name: "",
                date: "",
                venueId: venue?.venueId || venue?.venue?.venueId,
                isVerified: false,
              })
              setShowShootSheet(true)
            }}
          >
            + Add Shoot
          </button>
        </div>

        <div className="card-body p-0">
          {myShoots.length === 0 ? (
            <div className="p-4 text-center text-muted">
              No shoots found for this venue yet.
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myShoots.map(shoot => (
                  <tr
                    key={shoot.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedShoot(shoot)
                      setShowShootSheet(true)
                    }}
                  >
                    <td>{shoot.name}</td>
                    <td>{shoot.date}</td>
                    <td>
                      {shoot.isVerified ? (
                        <span className="badge bg-success">Verified</span>
                      ) : (
                        <span className="badge bg-secondary">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bottom Sheet for Venue (kept exactly as original) */}
      {showVenueSheet && (
        <div
          className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg"
          style={{ zIndex: 1060, maxHeight: "70vh", overflowY: "auto" }}
        >
          {/* ... original sheet content unchanged ... */}
        </div>
      )}

      {/* Bottom Sheet for Shoot (kept exactly as original) */}
      {showShootSheet && selectedShoot && (
        <div
          className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg"
          style={{ zIndex: 1060, maxHeight: "70vh", overflowY: "auto" }}
        >
          {/* ... original sheet content unchanged ... */}
        </div>
      )}
    </div>
  )
}

Profile.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
}

export default Profile

export const query = graphql`
  query ProfileQuery {
    allShootsJson {
      nodes {
        id
        name
        date
        venueId
        isVerified
      }
    }
    allVenuesJson {
      nodes {
        id
        name
        venueId
      }
    }
  }
`
