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
    venueType: "CLUB", // Matches your VenueType Enum
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    contact: {
      phone: "",
      email: user?.email || "",
      website: "",
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
  const facilityOptions = [
    { label: "3D Course", value: "THREE_D_COURSE" },
    { label: "Indoor Range", value: "INDOOR_RANGE" },
    { label: "Outdoor Range", value: "OUTDOOR_RANGE" },
    { label: "Pro Shop on Site", value: "PRO_SHOP" },
    { label: "Kitchen / Food Prep", value: "KITCHEN" },
    { label: "Campground Available", value: "CAMPING" },
  ]

  return (
    <div>
      {/* View Header */}
      <header className="mb-4 pb-3 border-bottom">
        <h3 className="fw-bold text-dark m-0">Edit Public Profile Content</h3>
        <p className="text-muted small m-0 mt-1">
          This data links directly to your public Spotlight listing layout.
        </p>
      </header>

      {/* Sync Status Banner notification */}
      {saveStatus && (
        <div
          className={`alert text-center fw-bold py-2 mb-4 ${
            saveStatus.includes("✅") ? "alert-success" : "alert-info"
          }`}
        >
          {saveStatus}
        </div>
      )}

      {/* ==================== MY SHOOTS ACCORDION ==================== */}
      <div className="mt-5">
        <h4 className="fw-bold text-dark mb-3">My Venue Shoots</h4>

        {myShoots.length === 0 ? (
          <p className="text-muted">You have no shoots yet.</p>
        ) : (
          <div
            className="accordion accordion-flush border"
            id="venueShootsAccordion"
          >
            {myShoots.map((shoot, index) => {
              const isOpen = editingShoot?.id === shoot.id
              const headerId = `shoot-header-${shoot.id}`
              const bodyId = `shoot-body-${shoot.id}`

              return (
                <div className="accordion-item" key={shoot.id}>
                  {/* Header */}
                  <h2 className="accordion-header" id={headerId}>
                    <button
                      className={`accordion-button ${
                        isOpen ? "" : "collapsed"
                      }`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${bodyId}`}
                      aria-expanded={isOpen}
                      aria-controls={bodyId}
                      onClick={() => setEditingShoot(shoot)}
                    >
                      Shoot #{shoot.shootId} – {shoot.name || "Untitled Shoot"}
                    </button>
                  </h2>

                  {/* Body / Edit Form */}
                  <div
                    id={bodyId}
                    className={`accordion-collapse collapse ${
                      isOpen ? "show" : ""
                    }`}
                    aria-labelledby={headerId}
                    data-bs-parent="#venueShootsAccordion"
                  >
                    <div className="accordion-body">
                      <form
                        onSubmit={e => {
                          e.preventDefault()
                          // TODO: send updated shoot data to your backend / WP API
                          console.log("Saving shoot", editingShoot)
                        }}
                      >
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label small fw-bold">
                              Shoot Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={editingShoot?.name || ""}
                              onChange={e =>
                                setEditingShoot({
                                  ...editingShoot,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label small fw-bold">
                              Date
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              value={editingShoot?.date || ""}
                              onChange={e =>
                                setEditingShoot({
                                  ...editingShoot,
                                  date: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Add any other fields you need: description, format, entryFee, etc. */}
                        </div>

                        <div className="d-flex gap-2 mt-4">
                          <button type="submit" className="btn btn-primary">
                            Save Changes
                          </button>

                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                              // Mark as verified
                              const updated = {
                                ...editingShoot,
                                isVerified: true,
                              }
                              setEditingShoot(updated)
                              // TODO: persist the verification change
                              console.log("Verified shoot", updated)
                            }}
                          >
                            Verify Shoot
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {/* ==================== ADD NEW SHOOT (always visible) ==================== */}
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-outline-primary fw-bold"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "+ Add New Shoot"}
        </button>

        {showAddForm && (
          <div className="card border mt-3 p-4 shadow-sm">
            <h5 className="fw-bold mb-3 text-secondary">Create New Shoot</h5>

            <form
              onSubmit={e => {
                e.preventDefault()
                const newShoot = {
                  ...(editingShoot || {}),
                  id: `new-${Date.now()}`,
                  venueId: user?.venueId || user?.venue?.venueId,
                  isVerified: false,
                }
                console.log("Creating new shoot:", newShoot)

                setMyShoots(prev => [...prev, newShoot])
                setShowAddForm(false)
                setEditingShoot(null)
              }}
            >
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Shoot Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingShoot?.name || ""}
                    onChange={e =>
                      setEditingShoot({
                        ...(editingShoot || {}),
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={editingShoot?.date || ""}
                    onChange={e =>
                      setEditingShoot({
                        ...(editingShoot || {}),
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success mt-4">
                Create Shoot
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

export const query = graphql`
  query AllData {
    # 1. Fetch the Venues
    allVenuesJson {
      nodes {
        id
        venueId
        slug
        name
        description
        venueType
        subscription
        icon
        iconColor
        location {
          address
          city
          state
          zip
          lat
          lng
        }
        contact {
          phone
          email
          website
          facebook
          instagram
        }
        facilities
        amenities
        equipmentAllowed
        customEquipmentRules
        hours {
          day
          open
          closed
        }
        membership
        hostedShoots {
          id
          # name
          date
          # shootFormat
        }
        imageUrl
        isClaimed
      }
    }

    # 2. ADD THIS: Fetch the Shoots
    allShootsJson {
      nodes {
        id
        shootId
        name
        description
        date
        endDate
        time
        amenities
        useVenueLocation
        shootLocation {
          lat
          lng
          city
          state
        }
        shootFormat
        shootClass
        terrain
        bowTypes
        skillLevel
        entryFee
        pricing {
          tier
          note
          options {
            days
            cost
            currency
          }
        }

        prizes
        isVerified
        isRegistration
        isDestination
        # Link back to venue for your "shootsWithVenues" logic
        venueId
        venue {
          venueId
          isClaimed
          name
          contact {
            phone
            email
          }
          location {
            address
            city
            state
            lat
            lng
          }
          subscription
        }
      }
    }
  }
`
