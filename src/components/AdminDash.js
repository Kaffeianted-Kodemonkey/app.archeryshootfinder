dfsdg

sdgsd

// src/components/Dashboard.js
import * as React from "react"
import { useState, useEffect } from "react"
import { Link } from "gatsby"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import mockSubscriptionData from "../data/mockSubscription.json"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

const [logoFile, setLogoFile] = useState(null)

const Dashboard = ({ user }) => {
  const [chartType, setChartType] = useState("line")
  const [subscription, setSubscription] = useState(null)
  const [venue, setVenue] = useState(null) // ← Changed from static object
  const [loading, setLoading] = useState(true)

  // Fetch venue when user is available
  useEffect(() => {
    const fetchVenue = async () => {
      if (!user) return

      try {
        const res = await fetch(
          `/api/get-venue?userId=${user.id || user.snipcartUserId}`
        )
        const data = await res.json()

        if (data.venue) {
          setVenue(data.venue)
        } else {
          // No venue yet — initialize with empty form
          setVenue({
            venueId: "", // Will be set by webhook or manually
            vname: "",
            // ... add other default fields if needed
          })
        }
      } catch (error) {
        console.error("Failed to load venue:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVenue()
  }, [user])

  const labels = [
    "Spotlight Views",
    "Current Views",
    "Upcoming Views",
    "Destination Tier",
    "Website Clicks",
    "Facebook Links",
    "Instagram Links",
  ]

  // Mock index matching your parameters
  const trackingData = [540, 320, 210, 170, 342, 185, 116]

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Interactions / Click counts",
        data: trackingData,
        lineTension: 0.2,
        backgroundColor:
          chartType === "line" ? "rgba(0, 123, 255, 0.05)" : "#007bff",
        borderColor: "#007bff",
        borderWidth: 3,
        pointBackgroundColor: "#007bff",
        fill: true,
      },
    ],
  }

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#6c757d" },
        grid: { color: "#f1f3f5" },
      },
      x: { ticks: { color: "#6c757d" }, grid: { display: false } },
    },
    responsive: true,
    maintainAspectRatio: false,
  }

  return (
    <div>
      <div className="alert alert-warning" role="alert">
        App is in Development using Mock Data!
        <br />
        Subcriptions do not work in <strong>TEST MODE</strong>!
      </div>

      {/* 1. INTERACTION CHART: Right underneath the welcome line header */}
      <div className="bg-light rounded border p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h5 className="fw-bold text-dark m-0">
              Engagement Distribution Matrix
            </h5>
            <small className="text-muted">
              Analyzing inbound page locations and social link exits.
            </small>
          </div>

          {/* Line vs Bar Graph Toggle Buttons */}
          <div className="btn-group shadow-sm" role="group">
            <button
              type="button"
              className={`btn btn-sm px-3 fw-bold ${
                chartType === "line" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setChartType("line")}
            >
              <i className="bi bi-graph-up me-1"></i> Line
            </button>
            <button
              type="button"
              className={`btn btn-sm px-3 fw-bold ${
                chartType === "bar" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setChartType("bar")}
            >
              <i className="bi bi-bar-chart-line-fill me-1"></i> Bar
            </button>
          </div>
        </div>

        <div style={{ height: "300px", position: "relative", width: "100%" }}>
          {chartType === "line" ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      </div>
      <hr />
      <h2>Edit/Update Spoltlight Page:</h2>
      {/* <small className="text-danger">
        <em>All field marked with * is required.</em>
      </small> */}
      <hr />

      {/* START ACCORDION */}
      <form
        onSubmit={async e => {
          e.preventDefault()

          try {
            const res = await fetch("/api/save-venue", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(venue),
            })

            const data = await res.json()

            if (res.ok) {
              alert("Venue saved successfully!")
              console.log("Saved:", data)
            } else {
              alert("Error saving venue: " + data.message)
            }
          } catch (error) {
            console.error("Save failed:", error)
            alert("Something went wrong while saving.")
          }
        }}
      >
        <div className="accordion accordion-flush" id="venueAccordion">
          {/* VENUE BASIC INFO #1 */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Venue Basic Informaion
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div className="accordion-body">
                {/*  VName and AccOwner */}
                <fieldset>
                  {/*  VName and AccOwner */}
                  <div className="row mb-3">
                    {/* Venue Name */}
                    <div className="col-10 col-md-6">
                      <label htmlFor="vname" className="col-form-label fw-bold">
                        Venue Name:{" "}
                        {/* <span className="text-danger">*</span>*/}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vname"
                        name="vname"
                        value={venue.vname || ""}
                        onChange={e => {
                          // later: update your state here
                          setVenue(prev => ({ ...prev, vname: e.target.value }))
                          //console.log("New tagline:", e.target.value)
                        }}
                        placeholder="Enter Company/Venue Name"
                      />
                    </div>
                    {/* Account Owner */}
                    <div className="col-10 col-md-6">
                      <label
                        htmlFor="accOwner"
                        className="col-form-label fw-bold"
                      >
                        Account Owner:{" "}
                        {/* <span className="text-danger">*</span> */}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="accOwner"
                        name="accOwner"
                        value={venue.accOwner || ""}
                        onChange={e => {
                          // later: update your state here
                          //console.log("Account Owner:", e.target.value)
                          setVenue(prev => ({
                            ...prev,
                            accOwner: e.target.value,
                          }))
                        }}
                        placeholder="Enter Account Owner name"
                      />
                    </div>
                  </div>
                  {/* Tagline & Venue Bio */}
                  <div className="row mb-3">
                    {/* Venue Tagline */}
                    <div className="col-10 col-md-6 mb-3">
                      <label
                        htmlFor="tagline"
                        className="col-form-label fw-bold"
                      >
                        Venue Tagline:{" "}
                        {/* <span className="text-danger">*</span> */}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="tagline"
                        name="tagline"
                        value={venue.tagline || ""}
                        onChange={e => {
                          // later: update your state here
                          //console.log("New tagline:", e.target.value)
                          setVenue(prev => ({
                            ...prev,
                            tagline: e.target.value,
                          }))
                        }}
                        placeholder="Enter short description for venue"
                      />
                    </div>
                    {/* About Bio */}
                    <div className="col-10 col-md-6">
                      <label htmlFor="bio" className="form-label fw-bold">
                        About Facility:
                      </label>
                      <textarea
                        className="form-control"
                        id="bio"
                        value={venue.bio || ""}
                        name="bio"
                        onChange={e => {
                          // later: update your state here
                          //console.log("New tagline:", e.target.value)
                          setVenue(prev => ({ ...prev, bio: e.target.value }))
                        }}
                        rows="2"
                        placeholder="Enter short description for venue"
                      />
                    </div>
                  </div>
                  {/* Image URL & Alt */}
                  <div className="row mb-3">
                    <div className="col-10 col-md-6">
                      <label htmlFor="img" className="col-form-label fw-bold">
                        Logo or Banner Image URL:
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="img"
                        name="img"
                        value={venue.img || ""}
                        onChange={e =>
                          setVenue(prev => ({ ...prev, img: e.target.value }))
                        }
                        placeholder="https://example.com/logo.png"
                      />
                      <small className="text-muted">
                        Paste a direct link to your logo or banner image
                      </small>
                    </div>

                    <div className="col-10 col-md-6">
                      <label htmlFor="alt" className="col-form-label fw-bold">
                        Image Alt Text:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="alt"
                        name="alt"
                        value={venue.alt || ""}
                        onChange={e =>
                          setVenue(prev => ({ ...prev, alt: e.target.value }))
                        }
                        placeholder="Describe the image for accessibility"
                      />
                    </div>
                  </div>

                  {/* Membership/Venue Type/Leagues/Classes */}
                  <div className="row mb-3">
                    {/* Membership */}
                    <div className="col-12 col-md-3 mb-3">
                      <p className="fw-bold">Is a Membership Required?</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isMembership"
                          id="Membership1"
                          value="Yes"
                          onChange={e => {
                            // later: update your state here
                            //console.log("New tagline:", e.target.value)
                            setVenue(prev => ({
                              ...prev,
                              isMembershp: e.target.value,
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="Membership1"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isMembership"
                          id="Membership2"
                          value="No"
                          onChange={e => {
                            // later: update your state here
                            //console.log("New tagline:", e.target.value)
                            setVenue(prev => ({
                              ...prev,
                              isMembershp: e.target.value,
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="Membership2"
                        >
                          No
                        </label>
                      </div>
                    </div>
                    {/* Venue Type */}
                    <div className="col-6 col-md-2 mb-3">
                      <p className="fw-bold">Venue Type</p>
                      {/* club */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="veneuType"
                          id="veneuType2"
                          value="Club"
                          onChange={e => {
                            setVenue(prev => ({
                              ...prev,
                              venueType: e.target.value,
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="veneuType2"
                        >
                          Club
                        </label>
                      </div>
                      {/* range - only */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="veneuType"
                          id="veneuType1"
                          value="Range"
                          onChange={e => {
                            setVenue(prev => ({
                              ...prev,
                              venueType: e.target.value,
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="veneuType1"
                        >
                          Range - Only
                        </label>
                      </div>
                      {/* Pro Shop */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="veneuType"
                          id="veneuType3"
                          value="Pro-Shop"
                          onChange={e => {
                            setVenue(prev => ({
                              ...prev,
                              venueType: e.target.value,
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="veneuType3"
                        >
                          Pro Shop
                        </label>
                      </div>
                    </div>
                    {/* Leagues */}
                    <div className="col-3 col-md-2">
                      <p className="fw-bold">Leagues?</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isLeague"
                          id="Leagues1"
                          value="Yes"
                          onChange={e => {
                            setVenue(prev => ({
                              ...prev,
                              isLeague: e.target.value,
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="Leagues1">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isLeague"
                          id="Leagues2"
                          value="No"
                          onChange={e => {
                            setVenue(prev => ({
                              ...prev,
                              isLeague: e.target.value,
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="Leagues2">
                          No
                        </label>
                      </div>
                    </div>
                    {/* Classes */}
                    <div className="col-3 col-md-2">
                      <p className="fw-bold">Classes?</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isClass"
                          id="Classes1"
                          value="Yes"
                          onChange={e => {
                            setVenue(prev => ({
                              ...prev,
                              isClass: e.target.value,
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="Classes1">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isClass"
                          id="Classes2"
                          value="No"
                          onChange={e => {
                            setVenue(prev => ({
                              ...prev,
                              isClass: e.target.value,
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="Classes2">
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* Amenitites & Sanctions */}
                  <div className="row mb-3">
                    {/* Amenitites */}
                    <div className="col-12 col-md-6 mt-2 mb-3">
                      <p className="fw-bold">Amenitites</p>
                      {/* WiFi */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="amenities"
                          id="amenities3"
                          value="Wi-Fi"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              amenities: e.target.checked
                                ? [...(prev.amenities || []), val]
                                : (prev.amenities || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="amenities3"
                        >
                          Wi-Fi
                        </label>
                      </div>
                      {/* Food */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="amenities"
                          id="amenities4"
                          value="Food"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              amenities: e.target.checked
                                ? [...(prev.amenities || []), val]
                                : (prev.amenities || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="amenities4"
                        >
                          Food
                        </label>
                      </div>
                      {/* Parking */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="amenities"
                          id="amenities7"
                          value="Parking"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              amenities: e.target.checked
                                ? [...(prev.amenities || []), val]
                                : (prev.amenities || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="amenities7"
                        >
                          Parking
                        </label>
                      </div>
                      {/* Restrooms */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="amenities"
                          id="amenities2"
                          value="Restrooms"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              amenities: e.target.checked
                                ? [...(prev.amenities || []), val]
                                : (prev.amenities || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="amenities2"
                        >
                          Restrooms
                        </label>
                      </div>
                      {/* WheelchairAccess */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="amenities"
                          id="amenities1"
                          value="WheelchairAccess"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              amenities: e.target.checked
                                ? [...(prev.amenities || []), val]
                                : (prev.amenities || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="amenities1"
                        >
                          Wheelchair Access
                        </label>
                      </div>
                      {/* Climate-Control */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="amenities"
                          id="amenities5"
                          value="Climate-Control"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              amenities: e.target.checked
                                ? [...(prev.amenities || []), val]
                                : (prev.amenities || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="amenities5"
                        >
                          Climate Control / Pavilions
                        </label>
                      </div>
                      {/* Seating */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="amenities"
                          id="amenities6"
                          value="Seating"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              amenities: e.target.checked
                                ? [...(prev.amenities || []), val]
                                : (prev.amenities || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="amenities6"
                        >
                          Seating / Spectator Areas
                        </label>
                      </div>
                      {/* Other */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="amenities"
                          id="amenities8"
                          value="Other"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              amenities: e.target.checked
                                ? [...(prev.amenities || []), val]
                                : (prev.amenities || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="amenities8"
                        >
                          Other
                        </label>
                      </div>
                    </div>
                    {/* Sanctions */}
                    <div className="col-12 col-md-6 mt-2 mb-3">
                      <p className="fw-bold">Sanctions</p>
                      <div className="col-sm-10">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="sanctions"
                            id="sanctions1  "
                            value="USAA"
                            onChange={e => {
                              const val = e.target.value
                              setVenue(prev => ({
                                ...prev,
                                sanctioning: e.target.checked
                                  ? [...(prev.sanctioning || []), val]
                                  : (prev.sanctioning || []).filter(
                                      v => v !== val
                                    ),
                              }))
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="sanctions1"
                          >
                            USA Archery (USAA)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="sanctions"
                            id="sanctions2"
                            value="NFAA"
                            onChange={e => {
                              const val = e.target.value
                              setVenue(prev => ({
                                ...prev,
                                sanctioning: e.target.checked
                                  ? [...(prev.sanctioning || []), val]
                                  : (prev.sanctioning || []).filter(
                                      v => v !== val
                                    ),
                              }))
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="sanctions2"
                          >
                            National Field Archery Association (NFAA)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="sanctions"
                            id="sanctions3"
                            value="ASA"
                            onChange={e => {
                              const val = e.target.value
                              setVenue(prev => ({
                                ...prev,
                                sanctioning: e.target.checked
                                  ? [...(prev.sanctioning || []), val]
                                  : (prev.sanctioning || []).filter(
                                      v => v !== val
                                    ),
                              }))
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="sanctions3"
                          >
                            Archery Shooters Association (ASA)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="sanctions"
                            id="sanctions4"
                            value="IBO"
                            onChange={e => {
                              const val = e.target.value
                              setVenue(prev => ({
                                ...prev,
                                sanctioning: e.target.checked
                                  ? [...(prev.sanctioning || []), val]
                                  : (prev.sanctioning || []).filter(
                                      v => v !== val
                                    ),
                              }))
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="sanctions4"
                          >
                            International Bowhunting Organization (IBO)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          {/* VENUE CONTACT/LOCATION/HOURS #2 */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Venue Contact & Location
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div className="accordion-body">
                {/* Venue Phone, Emial, Website & Social*/}
                <fieldset>
                  {/* Venue Phone, Emial, Website & Social*/}
                  <div className="row mb-3">
                    {/* Venue Phone */}
                    <div className="col-10 col-md-3">
                      <label
                        htmlFor="vphone"
                        className="col-form-label fw-bold"
                      >
                        Venue Phone:
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="vphone"
                        name="contact.phone"
                        value={venue.contact.phone || ""}
                        onChange={e => {
                          // later: update your state here
                          //console.log("New tagline:", e.target.value)
                          setVenue(prev => ({
                            ...prev,
                            contact: { ...prev.contact, phone: e.target.value },
                          }))
                        }}
                        placeholder="(000) 000-0000)"
                      />
                    </div>
                    {/* Venue Emial */}
                    <div className="col-10 col-md-3">
                      <label
                        htmlFor="vemial"
                        className="col-form-label fw-bold"
                      >
                        Venue Email:
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="vemial"
                        name="contact.email"
                        value={venue.contact.email || ""}
                        onChange={e => {
                          // later: update your state here
                          //console.log("New tagline:", e.target.value)
                          setVenue(prev => ({
                            ...prev,
                            contact: { ...prev.contact, emil: e.target.value },
                          }))
                        }}
                        placeholder="example@yousite.com"
                      />
                    </div>
                    {/* Website */}
                    <div className="col-10 col-md-3">
                      <label
                        htmlFor="vwebsite"
                        className="col-form-label fw-bold"
                      >
                        Venue Website:
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="vwebsite"
                        name="contact.website"
                        value={venue.contact.website || ""}
                        onChange={e => {
                          // later: update your state here
                          //console.log("New tagline:", e.target.value)
                          setVenue(prev => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              website: e.target.value,
                            },
                          }))
                        }}
                        placeholder="htptts://www.yousite.com"
                      />
                    </div>
                    {/* Social */}
                    <div className="col-10 col-md-3">
                      <label
                        htmlFor="facebook"
                        className="col-form-label fw-bold"
                      >
                        Facebook:
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="facebook"
                        name="contact.socials"
                        value={venue.contact.socials?.[0]?.url || ""}
                        onChange={e =>
                          setVenue(prev => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              socials: [
                                { name: "Facebook", url: e.target.value },
                              ],
                            },
                          }))
                        }
                        placeholder="https://www.facebook.com/Venue"
                      />
                    </div>
                  </div>
                  {/* Venue Address & City */}
                  <div className="row mb-3">
                    {/* Address */}
                    <div className="col-10 col-md-3">
                      <label
                        htmlFor="vaddress"
                        className=" col-form-label fw-bold"
                      >
                        Venue Address:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vaddress"
                        name="contact.address"
                        value={venue.location.address || ""}
                        onChange={e => {
                          setVenue(prev => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              address: e.target.value,
                            },
                          }))
                        }}
                        placeholder="123 Main St."
                      />
                    </div>
                    {/* City */}
                    <div className="col-10 col-md-3">
                      <label htmlFor="vcity" className="col-form-label fw-bold">
                        Venue City:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vcity"
                        name="city"
                        value={venue.location.city || ""}
                        onChange={e => {
                          setVenue(prev => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              city: e.target.value,
                            },
                          }))
                        }}
                        placeholder="Denver"
                      />
                    </div>
                    {/* State */}
                    <div className="col-10 col-md-3">
                      <label
                        htmlFor="vstate"
                        className="col-form-label fw-bold me-2"
                      >
                        State:
                      </label>
                      <select
                        name="vstate"
                        id="vstate"
                        name="vstate"
                        value={venue.location.state || ""}
                        onChange={e => {
                          setVenue(prev => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              state: e.target.value,
                            },
                          }))
                        }}
                        className="form-select"
                        size="1"
                      >
                        <option value="" selected disabled>
                          Select State
                        </option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select>
                    </div>
                    {/* Zip */}
                    <div className="col-10 col-md-3">
                      <label htmlFor="vzip" className="col-form-label fw-bold">
                        Venue Zip:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vzip"
                        name="zip"
                        value={venue.location.zip || ""}
                        onChange={e => {
                          setVenue(prev => ({
                            ...prev,
                            location: { ...prev.location, zip: e.target.value },
                          }))
                        }}
                        placeholder="80224"
                      />
                    </div>
                  </div>
                </fieldset>
                {/* Hours of Operation */}
                <fieldset>
                  <legend>Hours of Operation </legend>
                  <div className="row mb-3">
                    {/* days opened */}
                    <div className="col-12 col-md-6">
                      <p className="fw-bold">Days Open</p>
                      {/* Sunday  */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="hours.day"
                          id="DO1"
                          value="Sunday"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              hours: e.target.checked
                                ? [...(prev.hours.day || []), val]
                                : (prev.hours.day || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="DO1">
                          Sunday
                        </label>
                      </div>
                      {/* Monday */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="hours.day"
                          id="DO2"
                          value="Monday"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              hours: e.target.checked
                                ? [...(prev.hours.day || []), val]
                                : (prev.hours.day || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="DO2">
                          Monday
                        </label>
                      </div>
                      {/* Tuesday */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="hours.day"
                          id="DO3"
                          value="Tuesday"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              hours: e.target.checked
                                ? [...(prev.hours.day || []), val]
                                : (prev.hours.day || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="DO3">
                          Tuesday
                        </label>
                      </div>
                      {/* Wednesday */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="hours.day"
                          id="DO4"
                          value="Wednesday"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              hours: e.target.checked
                                ? [...(prev.hours.day || []), val]
                                : (prev.hours.day || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="DO4">
                          Wednesday
                        </label>
                      </div>
                      {/* Thursday */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="hours.day"
                          id="DO5"
                          value="Thursday"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              hours: e.target.checked
                                ? [...(prev.hours.day || []), val]
                                : (prev.hours.day || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="DO5">
                          Thursday
                        </label>
                      </div>
                      {/* Friday */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="hours.day"
                          id="DO6"
                          value="Friday"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              hours: e.target.checked
                                ? [...(prev.hours.day || []), val]
                                : (prev.hours.day || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="DO6">
                          Friday
                        </label>
                      </div>
                      {/* Saturday */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="hours.day"
                          id="DO7"
                          value="Saturday"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              hours: e.target.checked
                                ? [...(prev.hours.day || []), val]
                                : (prev.hours.day || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="DO7">
                          Saturday
                        </label>
                      </div>
                    </div>
                    {/* Time */}
                    <div className="col-12 col-md-6">
                      {/* Oening Time */}
                      <div className="row">
                        {/* Open Time Input */}
                        <div className="col-6 col-md-4">
                          <label htmlFor="openTime" className="col-form-label">
                            Open Time:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="openTime"
                            name="hours.open"
                            value={
                              venue.hours?.open?.replace(/\s?(AM|PM)/i, "") ||
                              ""
                            }
                            placeholder="6:00"
                            onChange={e => {
                              const time = e.target.value.trim()
                              const period =
                                venue.hours?.open?.match(/AM|PM/i)?.[0] || "AM"
                              setVenue(prev => ({
                                ...prev,
                                hours: {
                                  ...prev.hours,
                                  open: `${time} ${period}`,
                                },
                              }))
                            }}
                          />
                        </div>

                        {/* AM / PM Radios */}
                        <div className="col-6 col-md-4 mt-4 pt-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="openPeriod"
                              id="openAM"
                              value="AM"
                              checked={venue.hours?.open?.includes("AM")}
                              onChange={e => {
                                const time =
                                  venue.hours?.open
                                    ?.replace(/\s?(AM|PM)/i, "")
                                    .trim() || "6:00"
                                setVenue(prev => ({
                                  ...prev,
                                  hours: {
                                    ...prev.hours,
                                    open: `${time} AM`,
                                  },
                                }))
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="openAM"
                            >
                              AM
                            </label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="openPeriod"
                              id="openPM"
                              value="PM"
                              checked={venue.hours?.open?.includes("PM")}
                              onChange={e => {
                                const time =
                                  venue.hours?.open
                                    ?.replace(/\s?(AM|PM)/i, "")
                                    .trim() || "6:00"
                                setVenue(prev => ({
                                  ...prev,
                                  hours: {
                                    ...prev.hours,
                                    open: `${time} PM`,
                                  },
                                }))
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="openPM"
                            >
                              PM
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Closing Time */}
                      <div className="row">
                        {/* Close Time Input */}
                        <div className="col-6 col-md-4">
                          <label htmlFor="closeTime" className="col-form-label">
                            Close Time:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="closeTime"
                            name="hours.close"
                            value={
                              venue.hours?.close?.replace(/\s?(AM|PM)/i, "") ||
                              ""
                            }
                            placeholder="6:00"
                            onChange={e => {
                              const time = e.target.value.trim()
                              const period =
                                venue.hours?.close?.match(/AM|PM/i)?.[0] || "PM"
                              setVenue(prev => ({
                                ...prev,
                                hours: {
                                  ...prev.hours,
                                  close: `${time} ${period}`,
                                },
                              }))
                            }}
                          />
                        </div>

                        {/* AM / PM Radios */}
                        <div className="col-6 col-md-4 mt-4 pt-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="closePeriod"
                              id="closeAM"
                              value="AM"
                              checked={venue.hours?.close?.includes("AM")}
                              onChange={e => {
                                const time =
                                  venue.hours?.close
                                    ?.replace(/\s?(AM|PM)/i, "")
                                    .trim() || "6:00"
                                setVenue(prev => ({
                                  ...prev,
                                  hours: {
                                    ...prev.hours,
                                    close: `${time} AM`,
                                  },
                                }))
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="closeAM"
                            >
                              AM
                            </label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="closePeriod"
                              id="closePM"
                              value="PM"
                              checked={venue.hours?.close?.includes("PM")}
                              onChange={e => {
                                const time =
                                  venue.hours?.close
                                    ?.replace(/\s?(AM|PM)/i, "")
                                    .trim() || "6:00"
                                setVenue(prev => ({
                                  ...prev,
                                  hours: {
                                    ...prev.hours,
                                    close: `${time} PM`,
                                  },
                                }))
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="closePM"
                            >
                              PM
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          {/* PRO-SHOP ONLY #3 */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Pro Services
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div className="accordion-body">
                <fieldset>
                  <div className="row mb-3">
                    <div className="col-10">
                      {/* Bow Press */}
                      <div className="form-check">
                        <input
                          className="form-check-input "
                          type="checkbox"
                          name="services"
                          value="Bow Press Labor: Compressing compound bows to safely swap out worn-out strings and cables."
                          id="BowPressLabor"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              services: e.target.checked
                                ? [...(prev.services || []), val]
                                : (prev.services || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="BowPressLabor"
                        >
                          <span className="fw-bold">Bow Press Labor:</span>{" "}
                          Compressing compound bows to safely swap out worn-out
                          strings and cables.
                        </label>
                      </div>
                      {/* d-Loop & Peep */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="services"
                          value="D-Loop & Peep Sight Tying: Installing the two essential string components needed to hook up a mechanical release and sight through the bow."
                          id="dLoop"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              services: e.target.checked
                                ? [...(prev.services || []), val]
                                : (prev.services || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="dLoop"
                        >
                          <span className="fw-bold">
                            D-Loop & Peep Sight Tying:{" "}
                          </span>{" "}
                          Installing the two essential string components needed
                          to hook up a mechanical release and sight through the
                          bow.
                        </label>
                      </div>
                      {/* draw String */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="services"
                          value="Draw String Adjustments: Changing module settings or turning limb bolts to alter how far and how heavy a shooter must pull."
                          id="DrawLenAdj"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              services: e.target.checked
                                ? [...(prev.services || []), val]
                                : (prev.services || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="DrawLenAdj"
                        >
                          <span className="fw-bold">
                            Draw String Adjustments:
                          </span>{" "}
                          Changing module settings or turning limb bolts to
                          alter how far and how heavy a shooter must pull.
                        </label>
                      </div>
                      {/* Basic Accessory Mounting*/}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="services"
                          value="Basic Accessory Mounting: Bolting on and leveling basic hardware like arrow rests, multi-pin sights, and stabilizers."
                          id="BasicAssMoun"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              services: e.target.checked
                                ? [...(prev.services || []), val]
                                : (prev.services || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="BasicAssMoun"
                        >
                          <span className="fw-bold">
                            Basic Accessory Mounting:
                          </span>{" "}
                          Bolting on and leveling basic hardware like arrow
                          rests, multi-pin sights, and stabilizers.
                        </label>
                      </div>
                      {/* Arrow Cutting */}
                      <div className="form-check">
                        <input
                          className="form-check-input "
                          type="checkbox"
                          name="services"
                          value="Arrow Cutting: Trimming raw carbon or aluminum arrow shafts down to a safe, custom length using a specialized high-speed saw."
                          id="ArrowCutting"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              services: e.target.checked
                                ? [...(prev.services || []), val]
                                : (prev.services || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="ArrowCutting"
                        >
                          <span className="fw-bold">Arrow Cutting:</span>{" "}
                          Trimming raw carbon or aluminum arrow shafts down to a
                          safe, custom length using a specialized high-speed
                          saw.
                        </label>
                      </div>
                      {/* Flechings */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="services"
                          value="Fletching & Re-fletching: Gluing plastic vanes or feathers onto the back of an arrow to stabilize its flight."
                          id="FlechReFlech"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              services: e.target.checked
                                ? [...(prev.services || []), val]
                                : (prev.services || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="FlechReFlech"
                        >
                          <span className="fw-bold">
                            Fletching & Re-fletching:
                          </span>{" "}
                          Gluing plastic vanes or feathers onto the back of an
                          arrow to stabilize its flight.
                        </label>
                      </div>
                      {/* Gluing */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="services"
                          value="Component Gluing: Permanently setting point inserts and replacing cracked plastic nocks.."
                          id="Wraps"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              services: e.target.checked
                                ? [...(prev.services || []), val]
                                : (prev.services || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="Wraps"
                        >
                          <span className="fw-bold">Component Gluing:</span>{" "}
                          Permanently setting point inserts and replacing
                          cracked plastic nocks.
                        </label>
                      </div>
                      {/* Other */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="services"
                          value="Other"
                          id="other"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              services: e.target.checked
                                ? [...(prev.services || []), val]
                                : (prev.services || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="other"
                        >
                          <span className="fw-bold">Other:</span> Enter Service
                          if not listed
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          {/* RULES & REGS #4 */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                Rules & Regulations
              </button>
            </h2>
            <div
              id="collapseFour"
              className="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div className="accordion-body">
                <fieldset>
                  <legend className="fw-bold">Behavioral Rules</legend>
                  <p>
                    Shooting Line Conduct protect archers standing
                    shoulder-to-shoulder on an active shooting line.
                  </p>
                  {/* behave rules */}
                  <div className="row mt-3">
                    <div className="col">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="behavioralRules"
                          value="Straddle the Line: Archers must stand straddling the shooting line (one foot on each side) while shooting."
                          id="StraddleLine"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              behavioralRules: e.target.checked
                                ? [...(prev.behavioralRules || []), val]
                                : (prev.behavioralRules || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="StraddleLine"
                        >
                          <span className="fw-bold">Straddle the Line:</span>{" "}
                          Archers must stand straddling the shooting line (one
                          foot on each side) while shooting.
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="behavioralRules"
                          value="Shoot Only from Designated Lines: No archer may advance past the active shooting line until a clear 'ceasefire' command is given."
                          id="DesignatedLines"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              behavioralRules: e.target.checked
                                ? [...(prev.behavioralRules || []), val]
                                : (prev.behavioralRules || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="DesignatedLines"
                        >
                          <span className="fw-bold">
                            Shoot Only from Designated Lines:
                          </span>{" "}
                          No archer may advance past the active shooting line
                          until a clear 'ceasefire' command is given.
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="behavioralRules"
                          value="Keep Bows Pointed Down-Range: Bows must always remain pointed directly at the targets while loading an arrow, drawing, or aiming."
                          id="BowPointDownRange"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              behavioralRules: e.target.checked
                                ? [...(prev.behavioralRules || []), val]
                                : (prev.behavioralRules || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="BowPointDownRange"
                        >
                          <span className="fw-bold">
                            Keep Bows Pointed Down-Range:
                          </span>{" "}
                          Bows must always remain pointed directly at the
                          targets while loading an arrow, drawing, or aiming.
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="behavioralRules"
                          value="No Sky Drawing: Bows must be drawn straight down-range, level with or below the target face plane. (Drawing upwards can cause an accidental release over the safety walls)"
                          id="SkyDraw"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              behavioralRules: e.target.checked
                                ? [...(prev.behavioralRules || []), val]
                                : (prev.behavioralRules || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="SkyDraw"
                        >
                          <span className="fw-bold">No Sky Drawing:</span> Bows
                          must be drawn straight down-range, level with or below
                          the target face plane. (Drawing upwards can cause an
                          accidental release over the safety walls)
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <hr />
                <fieldset>
                  <legend className="fw-bold">Gear Controls</legend>
                  <p>
                    Equipment Restrictions prevent damage to target
                    infrastructure and ensure fair practice lanes.
                  </p>
                  {/* gear control */}
                  <div className="row">
                    <div className="col">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="gearControl"
                          value="Target or Field Points Only: Absolutely no broadheads, hunting tips, blunts, or small-game tips are allowed on standard target bales."
                          id="TargetFieldPoints"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              gearControl: e.target.checked
                                ? [...(prev.gearControl || []), val]
                                : (prev.gearControl || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="TargetFieldPoints"
                        >
                          <span className="fw-bold">
                            Target or Field Points Only:
                          </span>{" "}
                          Absolutely no broadheads, hunting tips, blunts, or
                          small-game tips are allowed on standard target bales.
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="gearControl"
                          value="Peak Draw Weight Limits: Maximum draw weight is capped at 60 lbs for indoor ranges and 70 lbs for outdoor lanes. (This prevents heavy compound setups from blowing through target backstops)."
                          id="DraeWeight"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              gearControl: e.target.checked
                                ? [...(prev.gearControl || []), val]
                                : (prev.gearControl || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="DraeWeight"
                        >
                          <span className="fw-bold">
                            Peak Draw Weight Limits:
                          </span>{" "}
                          Maximum draw weight is capped at 60 lbs for indoor
                          ranges and 70 lbs for outdoor lanes. (This prevents
                          heavy compound setups from blowing through target
                          backstops).
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="gearControl"
                          value="Crossbow Policy (Preset Dropdown): Crossbows are prohibited on standard lanes unless explicit matching target blocks are provided."
                          id="CrossbowPolicy"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              gearControl: e.target.checked
                                ? [...(prev.gearControl || []), val]
                                : (prev.gearControl || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="CrossbowPolicy"
                        >
                          <span className="fw-bold">
                            Crossbow Policy (Preset Dropdown):
                          </span>{" "}
                          Crossbows are prohibited on standard lanes unless
                          explicit matching target blocks are provided.
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="gearControl"
                          value="Maximum Arrow Diameter: Arrow shafts must not exceed 9.3mm (e.g., 23-diameter target arrows) to prevent excessive target wear."
                          id="ArrowDiameter"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              gearControl: e.target.checked
                                ? [...(prev.gearControl || []), val]
                                : (prev.gearControl || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="ArrowDiameter"
                        >
                          <span className="fw-bold">
                            Maximum Arrow Diameter:
                          </span>{" "}
                          Arrow shafts must not exceed 9.3mm (e.g., 23-diameter
                          target arrows) to prevent excessive target wear.
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <hr />
                <fieldset>
                  <legend className="fw-bold">Safety & Etiquette</legend>
                  <p>
                    General Range Safety & Etiquette dictate the overall
                    operational flow of the facility.
                  </p>
                  {/* safty etiquette */}
                  <div className="row">
                    <div className="col">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="safteyEtiquette"
                          value="Youth Supervision Required: Archers under the age of 15 must be accompanied and actively supervised by an adult at all times."
                          id="SupervisionReq"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              safteyEtiquette: e.target.checked
                                ? [...(prev.safteyEtiquette || []), val]
                                : (prev.safteyEtiquette || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="SupervisionReq"
                        >
                          <span className="fw-bold">
                            Youth Supervision Required:
                          </span>{" "}
                          Archers under the age of 15 must be accompanied and
                          actively supervised by an adult at all times.
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="safteyEtiquette"
                          value="Wait for the Whistle / Visual Commands: Obey all formal range commands (e.g., 1 whistle to shoot, 2 whistles to retrieve arrows, 3 or more whistles for emergency ceasefire)."
                          id="WhistleRule"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              safteyEtiquette: e.target.checked
                                ? [...(prev.safteyEtiquette || []), val]
                                : (prev.safteyEtiquette || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="WhistleRule"
                        >
                          <span className="fw-bold">
                            Wait for the Whistle / Visual Commands:
                          </span>{" "}
                          Obey all formal range commands (e.g., 1 whistle to
                          shoot, 2 whistles to retrieve arrows, 3 or more
                          whistles for emergency ceasefire).
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="safteyEtiquette"
                          value="Pulling Arrows Safely: Stand to the side of the target block when pulling arrows to avoid hitting someone standing directly behind you. Ensure the area behind the target is clear."
                          id="ArrowPulling"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              safteyEtiquette: e.target.checked
                                ? [...(prev.safteyEtiquette || []), val]
                                : (prev.safteyEtiquette || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="ArrowPulling"
                        >
                          <span className="fw-bold">
                            Pulling Arrows Safely:
                          </span>{" "}
                          Stand to the side of the target block when pulling
                          arrows to avoid hitting someone standing directly
                          behind you. Ensure the area behind the target is
                          clear.
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="safteyEtiquette"
                          value="No Alcohol or Substance Use: Absolutely no consumption of alcohol or drugs before or during active range shooting sessions."
                          id="SubdtanceUse"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              safteyEtiquette: e.target.checked
                                ? [...(prev.safteyEtiquette || []), val]
                                : (prev.safteyEtiquette || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="SubdtanceUse"
                        >
                          <span className="fw-bold">
                            No Alcohol or Substance Use:
                          </span>{" "}
                          Absolutely no consumption of alcohol or drugs before
                          or during active range shooting sessions.
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="RangeAccess"
                          value="Bow Tuning: Allowing customers to shoot a couple of arrows through a new bow model before deciding to buy it."
                          id="BowTuning"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              safteyEtiquette: e.target.checked
                                ? [...(prev.safteyEtiquette || []), val]
                                : (prev.safteyEtiquette || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label mb-3"
                          htmlFor="BowTuning"
                        >
                          <span className="fw-bold">Bow Tuning:</span> Allowing
                          customers to shoot a couple of arrows through a new
                          bow model before deciding to buy it.
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          {/* RANGE SPEC #5 */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive"
                aria-expanded="false"
                aria-controls="collapseFive"
              >
                Range Specifications
              </button>
            </h2>
            <div
              id="collapseFive"
              className="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div className="accordion-body">
                <fieldset>
                  <div className="row mb-3">
                    {/* Bow Type */}
                    <div className="col-12 col-md-3 mb-3">
                      <p className="col-form-label fw-bold">Bow Type</p>
                      {/* Compound */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="bowTypes"
                          id="bowType1"
                          value="Compound"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              bowTypes: e.target.checked
                                ? [...(prev.bowTypes || []), val]
                                : (prev.bowTypes || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="bowType1">
                          Compound
                        </label>
                      </div>
                      {/* Recurve */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="bowTypes"
                          id="bowType2"
                          value="Recurve"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              bowTypes: e.target.checked
                                ? [...(prev.bowTypes || []), val]
                                : (prev.bowTypes || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="bowType2">
                          Recurve
                        </label>
                      </div>
                      {/* Longbow */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="bowTypes"
                          id="bowType3"
                          value="Longbow"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              bowTypes: e.target.checked
                                ? [...(prev.bowTypes || []), val]
                                : (prev.bowTypes || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="bowType3">
                          Longbow
                        </label>
                      </div>
                      {/* Barebow */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="bowTypes"
                          id="bowType4"
                          value="Barebow"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              bowTypes: e.target.checked
                                ? [...(prev.bowTypes || []), val]
                                : (prev.bowTypes || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="bowType4">
                          Barebow
                        </label>
                      </div>
                      {/* Crossbow */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="bowTypes"
                          id="bowType5"
                          value="Crossbow"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              bowTypes: e.target.checked
                                ? [...(prev.bowTypes || []), val]
                                : (prev.bowTypes || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="bowType5">
                          Crossbow
                        </label>
                      </div>
                    </div>
                    {/* Broadhead Tuning - Indoors */}
                    <div className="col-12 col-md-3 mb-3">
                      <p className="col-form-label fw-bold">
                        Broadhead Tuning Indoors
                      </p>
                      {/* indoor */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="TuningIndoors"
                          id="TuningIndoors1"
                          value="No"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="TuningIndoors1"
                        >
                          No
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="TuningIndoors"
                          id="TuningIndoors2"
                          value="Yes"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="TuningIndoors2"
                        >
                          Yes - Designated areas Only
                        </label>
                      </div>
                    </div>
                    {/* Broadhead Tuning - Outdoors. */}
                    <div className="col-12 col-md-3 mb-3">
                      <p className="col-form-label fw-bold">
                        Broadhead Tuning Outdoors
                      </p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="TuningOutdoors"
                          id="TuningOutdoors1"
                          value="No"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="TuningOutdoors1"
                        >
                          No
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="TuningOutdoors"
                          id="TuningOutdoors2"
                          value="Yes"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="TuningOutdoors2"
                        >
                          Yes - Designated areas Only
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* Range and Target types */}
                  <div className="row">
                    {/* Range Type */}
                    <div className="col-12 col-md-6">
                      <p className="col-form-label fw-bold">Range Type</p>
                      {/* indoor range */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="rangeType"
                          id="indoorRange"
                          value="Indoor Range: Standard climate-controlled commercial archery shops or dedicated indoor club lanes"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              rangeType: e.target.checked
                                ? [...(prev.rangeType || []), val]
                                : (prev.rangeType || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="indoorRange"
                        >
                          <span className="fw-bold">Indoor Range:</span>{" "}
                          Standard climate-controlled commercial archery shops
                          or dedicated indoor club lanes.
                        </label>
                      </div>
                      {/* outdoor range */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="rangeType"
                          id="outdoors"
                          value="Outdoor Range: Permanent, dedicated flat fields with fixed target butts (standard archery-only fields)."
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              rangeType: e.target.checked
                                ? [...(prev.rangeType || []), val]
                                : (prev.rangeType || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="outdoorRange"
                        >
                          <span className="fw-bold">Outdoor Range:</span>{" "}
                          Permanent, dedicated flat fields with fixed target
                          butts.
                        </label>
                      </div>
                      {/* field 3D range */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="rangeType"
                          id="field3D"
                          value="Field / 3D Course: Dedicated permanent archery properties built specifically for walk-through loops."
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              rangeType: e.target.checked
                                ? [...(prev.rangeType || []), val]
                                : (prev.rangeType || []).filter(v => v !== val),
                            }))
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="outdoorRange"
                        >
                          <span className="fw-bold">Field / 3D Course:</span>{" "}
                          Dedicated permanent archery properties built
                          specifically for walk-through loops.
                        </label>
                      </div>
                    </div>
                    {/* Targer Type */}
                    <div className="col-12 col-md-6">
                      <p className="col-form-label fw-bold">Target Type</p>
                      {/* 3D Animal */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="3DAT"
                          value="3D Animal Targets"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              targetType: e.target.checked
                                ? [...(prev.targetType || []), val]
                                : (prev.targetType || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="3DAT">
                          3D Animal Targets
                        </label>
                      </div>
                      {/* NFAA Blue/White */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="NFAA-BWF"
                          value="NFAA Blue/White Faces"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              targetType: e.target.checked
                                ? [...(prev.targetType || []), val]
                                : (prev.targetType || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="NFAA-BWF">
                          NFAA Blue/White Faces
                        </label>
                      </div>
                      {/* NFAA FAF */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="NFAA-FAF"
                          value="NFAA Field Archery Faces"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              targetType: e.target.checked
                                ? [...(prev.targetType || []), val]
                                : (prev.targetType || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="NFAA-FAF">
                          NFAA Field Archery Faces
                        </label>
                      </div>
                      {/*NFAA ARF */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="NFAA-ARF"
                          value="NFAA Animal Round Faces"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              targetType: e.target.checked
                                ? [...(prev.targetType || []), val]
                                : (prev.targetType || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="NFAA-ARF">
                          NFAA Animal Round Faces
                        </label>
                      </div>
                      {/* 3-Spot Vegas */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="3SVVF"
                          value="3-Spot Vertical / Vegas Faces"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              targetType: e.target.checked
                                ? [...(prev.targetType || []), val]
                                : (prev.targetType || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="3SVVF">
                          3-Spot Vertical / Vegas Faces
                        </label>
                      </div>
                      {/* 40cm Single-Spot */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="40SSPF"
                          value="40cm Single-Spot Paper Faces"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              targetType: e.target.checked
                                ? [...(prev.targetType || []), val]
                                : (prev.targetType || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="40SSPF">
                          40cm Single-Spot Paper Faces
                        </label>
                      </div>
                      {/* 122cm - 80cm MCPF */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="MCPF"
                          value="122cm and 80cm Multi-Color Paper Faces"
                          onChange={e => {
                            const val = e.target.value
                            setVenue(prev => ({
                              ...prev,
                              targetType: e.target.checked
                                ? [...(prev.targetType || []), val]
                                : (prev.targetType || []).filter(
                                    v => v !== val
                                  ),
                            }))
                          }}
                        />
                        <label className="form-check-label" htmlFor="MCPF">
                          122cm and 80cm Multi-Color Paper Faces
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* Lane Cap */}
                  <div className="row">
                    <div className="col-10 col-md-3">
                      <label
                        htmlFor="laneCapIndoor"
                        className="col-form-label fw-bold"
                      >
                        Lane Cap. Indoors
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="laneCapIndoor"
                        name="laneCapIndoor"
                        value={venue.laneCapIndoor || ""}
                        onChange={e => {
                          setVenue(prev => ({
                            ...prev,
                            laneCapIndoor: e.target.value,
                          }))
                        }}
                      />
                    </div>
                    <div className="col-10  col-md-3">
                      <label
                        htmlFor="laneCapOutdoor"
                        className="col-form-label fw-bold"
                      >
                        Lane Cap. Outdoors
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="laneCapOutdoor"
                        name="laneCapOutdoor"
                        value={venue.laneCapOutdoor || ""}
                        onChange={e => {
                          setVenue(prev => ({
                            ...prev,
                            laneCapOutdoor: e.target.value,
                          }))
                        }}
                      />
                    </div>
                    {/* Max Dist. */}
                    <div className="col-10 col-md-3">
                      <label
                        htmlFor="maxDistIndoor"
                        className="col-form-label fw-bold"
                      >
                        Max Dist. Indoor
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="maxDistIndoor"
                        name="maxDistIndoor"
                        value={venue.maxDistIndoor || ""}
                        onChange={e => {
                          setVenue(prev => ({
                            ...prev,
                            maxDistIndoor: e.target.value,
                          }))
                        }}
                      />
                    </div>
                    <div className="col-10 col-md-3">
                      <label
                        htmlFor="maxDistOutdoor"
                        className="col-form-label fw-bold"
                      >
                        Max Dist. Outdoor
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="maxDistOutdoor"
                        name="maxDistOutdoor"
                        value={venue.maxDistOutdoor || ""}
                        onChange={e => {
                          setVenue(prev => ({
                            ...prev,
                            maxDistOutdoor: e.target.value,
                          }))
                        }}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <hr />
          </div>
          {/* END ACCORDION */}
        </div>
        <div className="row justify-content-end mt-3">
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
      {/* END SPOTLIGHT PAGE */}
    </div>
  )
}

export default Dashboard
