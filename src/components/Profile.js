// src/components/Profile.js
import * as React from "react"
import { useState } from "react"

const Profile = ({ user }) => {
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

      <form onSubmit={handleSubmit}>
        {/* BLOCK 1: Core Details */}
        <div className="card border-0 bg-light p-3 mb-4 shadow-sm">
          <h5 className="fw-bold text-secondary mb-3">Core Details</h5>

          <div className="mb-3">
            <label className="form-label fw-bold text-muted small mb-1">
              Venue Display Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleTopLevelChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-muted small mb-1">
              Venue Classification
            </label>
            <select
              name="venueType"
              className="form-select"
              value={formData.venueType}
              onChange={handleTopLevelChange}
            >
              <option value="CLUB">Club</option>
              <option value="ASSOCIATION">Association</option>
              <option value="PRO_SHOP">Pro Shop & Range</option>
              <option value="ORGANIZATION">Organization</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold text-muted small mb-1">
              About / Description
            </label>
            <textarea
              name="description"
              rows="3"
              className="form-control"
              placeholder="Detail your target distances, layout rules, and operating values..."
              value={formData.description}
              onChange={handleTopLevelChange}
            />
          </div>
        </div>

        {/* BLOCK 2: Location Parameters */}
        <div className="card border-0 bg-light p-3 mb-4 shadow-sm">
          <h5 className="fw-bold text-secondary mb-3">Location Mapping</h5>

          <div className="mb-3">
            <label className="form-label fw-bold text-muted small mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.location.address}
              onChange={e => handleNestedChange("location", e)}
            />
          </div>

          <div className="row g-2">
            <div className="col-6">
              <label className="form-label fw-bold text-muted small mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={formData.location.city}
                onChange={e => handleNestedChange("location", e)}
              />
            </div>
            <div className="col-3">
              <label className="form-label fw-bold text-muted small mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="CO"
                value={formData.location.state}
                onChange={e => handleNestedChange("location", e)}
              />
            </div>
            <div className="col-3">
              <label className="form-label fw-bold text-muted small mb-1">
                Zip
              </label>
              <input
                type="text"
                name="zip"
                className="form-control"
                value={formData.location.zip}
                onChange={e => handleNestedChange("location", e)}
              />
            </div>
          </div>
        </div>

        {/* BLOCK 3: Contact Channels */}
        <div className="card border-0 bg-light p-3 mb-4 shadow-sm">
          <h5 className="fw-bold text-secondary mb-3">Contact Channels</h5>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label fw-bold text-muted small mb-1">
                Public Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.contact.phone}
                onChange={e => handleNestedChange("contact", e)}
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-bold text-muted small mb-1">
                Public Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.contact.email}
                onChange={e => handleNestedChange("contact", e)}
              />
            </div>
          </div>

          <div className="mb-1">
            <label className="form-label fw-bold text-muted small mb-1">
              External Website Link
            </label>
            <input
              type="url"
              name="website"
              className="form-control"
              placeholder="https://yourarcheryrange.com"
              value={formData.contact.website}
              onChange={e => handleNestedChange("contact", e)}
            />
          </div>
        </div>

        {/* BLOCK 4: Facilities Array Checklist */}
        <div className="card border-0 bg-light p-3 mb-4 shadow-sm">
          <h5 className="fw-bold text-secondary mb-1">Available Facilities</h5>
          <p className="text-muted small mb-3">
            Toggles feature parameters inside directory queries.
          </p>

          <div className="row g-3">
            {facilityOptions.map(option => (
              <div key={option.value} className="col-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id={option.value}
                    className="form-check-input"
                    checked={formData.facilities.includes(option.value)}
                    onChange={() => handleFacilityChange(option.value)}
                  />
                  <label
                    htmlFor={option.value}
                    className="form-check-label fw-semibold text-dark cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Submit Button */}
        <button
          type="submit"
          className="btn btn-primary fw-bold px-4 py-2 shadow-sm"
        >
          Save Profile Content
        </button>
      </form>
    </div>
  )
}

export default Profile
