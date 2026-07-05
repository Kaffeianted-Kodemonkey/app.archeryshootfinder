// src/components/Profile.js
import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const Profile = ({ user, data }) => {
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
            <p className="p-3 text-muted">No shoots yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Verified</th>
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
                      <td>{shoot.date || "—"}</td>
                      <td>{shoot.name || "Untitled"}</td>
                      <td>{shoot.status || "—"}</td>
                      <td>
                        {shoot.isVerified ? (
                          <span className="badge bg-success">Verified</span>
                        ) : (
                          <span className="badge bg-secondary">Unclaimed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ========== VENUE EDIT BOTTOM SHEET ========== */}
      {showVenueSheet && (
        <div
          className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg"
          style={{ zIndex: 1050, maxHeight: "70vh", overflowY: "auto" }}
        >
          <div className="p-3">
            <div className="mb-3">
              <label className="form-label small fw-bold">Venue Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleTopLevelChange}
              />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.contact.email}
                  onChange={e => handleNestedChange("contact", e)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.contact.phone}
                  onChange={e => handleNestedChange("contact", e)}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label small fw-bold">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.location.address}
                onChange={e => handleNestedChange("location", e)}
              />
            </div>

            <div className="row g-3 mt-1">
              <div className="col-md-5">
                <label className="form-label small fw-bold">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.location.city}
                  onChange={e => handleNestedChange("location", e)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">State</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={formData.location.state}
                  onChange={e => handleNestedChange("location", e)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Zip</label>
                <input
                  type="text"
                  className="form-control"
                  name="zip"
                  value={formData.location.zip}
                  onChange={e => handleNestedChange("location", e)}
                />
              </div>
            </div>
          </div>

          <div className="p-3">
            {/* TODO: paste your venue form fields here */}
            <p className="text-muted">Venue edit form goes here…</p>
          </div>

          <div className="p-3 border-top d-flex gap-2">
            <button
              className="btn btn-primary flex-fill"
              onClick={() => {
                // TODO: send formData to your backend / WP
                console.log("Saving venue:", formData)
                setShowVenueSheet(false)
              }}
            >
              Save Changes
            </button>

            <button
              className="btn btn-outline-secondary flex-fill"
              onClick={() => setShowVenueSheet(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ========== SHOOT EDIT / CLAIM BOTTOM SHEET ========== */}
      {showShootSheet && selectedShoot && (
        <div
          className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg"
          style={{ zIndex: 1050, maxHeight: "75vh", overflowY: "auto" }}
        >
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Edit Shoot</h5>
            <button
              className="btn-close"
              onClick={() => setShowShootSheet(false)}
            />
          </div>

          <div className="p-3">
            <div className="mb-3">
              <label className="form-label small fw-bold">Shoot Name</label>
              <input
                type="text"
                className="form-control"
                value={selectedShoot.name || ""}
                onChange={e =>
                  setSelectedShoot({ ...selectedShoot, name: e.target.value })
                }
              />
            </div>

            {/* Add any other fields you need (date, location, spots, etc.) */}
          </div>

          <div className="p-3 border-top d-grid gap-2">
            <button
              className="btn btn-success"
              o
              onClick={() => {
                if (!selectedShoot) return
                const updatedShoot = { ...selectedShoot, isVerified: true }
                const isNew = updatedShoot.id.startsWith("new-")

                setMyShoots(prev =>
                  isNew
                    ? [...prev, updatedShoot]
                    : prev.map(s =>
                        s.id === updatedShoot.id ? updatedShoot : s
                      )
                )

                setShowShootSheet(false)
                setSelectedShoot(null)
              }}
            >
              Claim &amp; Verify
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                if (!selectedShoot) return
                const isNew = selectedShoot.id.startsWith("new-")

                setMyShoots(prev =>
                  isNew
                    ? [...prev, selectedShoot]
                    : prev.map(s =>
                        s.id === selectedShoot.id ? selectedShoot : s
                      )
                )

                setShowShootSheet(false)
                setSelectedShoot(null)
              }}
            >
              Save Changes
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setShowShootSheet(false)
                setSelectedShoot(null)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile

// export const query = graphql`
//   query AllData {
//     # 1. Fetch the Venues
//     allVenuesJson {
//       nodes {
//         id
//         venueId
//         slug
//         name
//         description
//         venueType
//         subscription
//         icon
//         iconColor
//         location {
//           address
//           city
//           state
//           zip
//           lat
//           lng
//         }
//         contact {
//           phone
//           email
//           website
//           facebook
//           instagram
//         }
//         facilities
//         amenities
//         equipmentAllowed
//         customEquipmentRules
//         hours {
//           day
//           open
//           closed
//         }
//         membership
//         useredShoots {
//           id
//           # name
//           date
//           # shootFormat
//         }
//         imageUrl
//         isClaimed
//       }
//     }

//     # 2. ADD THIS: Fetch the Shoots
//     allShootsJson {
//       nodes {
//         id
//         shootId
//         name
//         description
//         date
//         endDate
//         time
//         amenities
//         useVenueLocation
//         shootLocation {
//           lat
//           lng
//           city
//           state
//         }
//         shootFormat
//         shootClass
//         terrain
//         bowTypes
//         skillLevel
//         entryFee
//         pricing {
//           tier
//           note
//           options {
//             days
//             cost
//             currency
//           }
//         }

//         prizes
//         isVerified
//         isRegistration
//         isDestination
//         # Link back to venue for your "shootsWithVenues" logic
//         venueId
//         venue {
//           venueId
//           isClaimed
//           name
//           contact {
//             phone
//             email
//           }
//           location {
//             address
//             city
//             state
//             lat
//             lng
//           }
//           subscription
//         }
//       }
//     }
//   }
// `
