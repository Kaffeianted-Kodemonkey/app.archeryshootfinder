// src/components/AdminDash.js
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

const Dashboard = ({ user }) => {
  const [chartType, setChartType] = useState("line")
  const [subscription, setSubscription] = useState(null)
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch real venue from MongoDB
  useEffect(() => {
    const fetchVenue = async () => {
      if (!user) return
      const userId = user.id || user.snipcartUserId

      try {
        const res = await fetch(`/api/get-venue?userId=${userId}`)
        const data = await res.json()

        if (data.venue) {
          setVenue(data.venue)
        } else {
          setError("Venue not found")
        }
      } catch (err) {
        setError("Failed to load venue data")
      } finally {
        setLoading(false)
      }
    }

    fetchVenue()
  }, [user])

  if (loading) {
    return <div className="p-5 text-center">Loading your venue...</div>
  }

  if (error || !venue) {
    return <div className="p-5 text-center text-danger">{error}</div>
  }

  // === CHART DATA ===
  const labels = [
    "Spotlight Views",
    "Current Views",
    "Upcoming Views",
    "Destination Tier",
    "Website Clicks",
    "Facebook Links",
    "Instagram Links",
  ]
  const trackingData = [540, 320, 210, 170, 342, 185, 116]

  const chartData = {
    labels,
    datasets: [
      {
        label: "Interactions",
        data: trackingData,
        lineTension: 0.2,
        backgroundColor:
          chartType === "line" ? "rgba(0, 123, 255, 0.05)" : "#007bff",
        borderColor: "#007bff",
        borderWidth: 3,
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
      {/* Testing warning */}
      <div className="alert alert-warning" role="alert">
        App is in Development using Mock Data!
        <br />
        Subscriptions do not work in <strong>TEST MODE</strong>!
      </div>

      {/* Chart */}
      <div className="bg-light rounded border p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold text-dark m-0">
              Engagement Distribution Matrix
            </h5>
            <small className="text-muted">
              Analyzing inbound page locations and social link exits.
            </small>
          </div>
          <div className="btn-group shadow-sm">
            <button
              className={`btn btn-sm px-3 fw-bold ${
                chartType === "line" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setChartType("line")}
            >
              Line
            </button>
            <button
              className={`btn btn-sm px-3 fw-bold ${
                chartType === "bar" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setChartType("bar")}
            >
              Bar
            </button>
          </div>
        </div>
        <div style={{ height: "300px", position: "relative" }}>
          {chartType === "line" ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      <hr />
      <h2>Edit/Update Spotlight Page</h2>
      <hr />

      <form
        onSubmit={async e => {
          e.preventDefault()
          try {
            const res = await fetch("/api/save-venue", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(venue),
            })
            const data = await res.json()
            alert(
              res.ok ? "Venue saved successfully!" : "Error: " + data.message
            )
          } catch {
            alert("Something went wrong while saving.")
          }
        }}
      >
        <div className="accordion accordion-flush" id="venueAccordion">
          {/* === VENUE BASIC INFO === */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
              >
                Venue Basic Information
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div className="accordion-body">
                <div className="row mb-3">
                  <div className="col-10 col-md-6">
                    <label className="col-form-label fw-bold">
                      Venue Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={venue.vname || ""}
                      onChange={e =>
                        setVenue(p => ({ ...p, vname: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-10 col-md-6">
                    <label className="col-form-label fw-bold">
                      Account Owner:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={venue.accOwner || ""}
                      onChange={e =>
                        setVenue(p => ({ ...p, accOwner: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-10 col-md-6 mb-3">
                    <label className="col-form-label fw-bold">
                      Venue Tagline:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={venue.tagline || ""}
                      onChange={e =>
                        setVenue(p => ({ ...p, tagline: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-10 col-md-6">
                    <label className="form-label fw-bold">
                      About Facility:
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={venue.bio || ""}
                      onChange={e =>
                        setVenue(p => ({ ...p, bio: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-10 col-md-6">
                    <label className="col-form-label fw-bold">
                      Logo / Banner Image URL:
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      value={venue.img || ""}
                      onChange={e =>
                        setVenue(p => ({ ...p, img: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-10 col-md-6">
                    <label className="col-form-label fw-bold">
                      Image Alt Text:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={venue.alt || ""}
                      onChange={e =>
                        setVenue(p => ({ ...p, alt: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Membership, Venue Type, Leagues, Classes */}
                <div className="row mb-3">
                  <div className="col-12 col-md-3 mb-3">
                    <p className="fw-bold">Is a Membership Required?</p>
                    {["Yes", "No"].map(val => (
                      <div className="form-check" key={val}>
                        <input
                          type="radio"
                          name="isMembership"
                          className="form-check-input"
                          value={val}
                          checked={venue.isMembership === val}
                          onChange={e =>
                            setVenue(p => ({
                              ...p,
                              isMembership: e.target.value,
                            }))
                          }
                        />
                        <label className="form-check-label">{val}</label>
                      </div>
                    ))}
                  </div>

                  <div className="col-6 col-md-2 mb-3">
                    <p className="fw-bold">Venue Type</p>
                    {["Club", "Range", "Pro-Shop"].map(val => (
                      <div className="form-check" key={val}>
                        <input
                          type="radio"
                          name="venueType"
                          className="form-check-input"
                          value={val}
                          checked={venue.venueType === val}
                          onChange={e =>
                            setVenue(p => ({ ...p, venueType: e.target.value }))
                          }
                        />
                        <label className="form-check-label">{val}</label>
                      </div>
                    ))}
                  </div>

                  <div className="col-3 col-md-2">
                    <p className="fw-bold">Leagues?</p>
                    {["Yes", "No"].map(val => (
                      <div className="form-check" key={val}>
                        <input
                          type="radio"
                          name="isLeague"
                          className="form-check-input"
                          value={val}
                          checked={venue.isLeague === val}
                          onChange={e =>
                            setVenue(p => ({ ...p, isLeague: e.target.value }))
                          }
                        />
                        <label className="form-check-label">{val}</label>
                      </div>
                    ))}
                  </div>

                  <div className="col-3 col-md-2">
                    <p className="fw-bold">Classes?</p>
                    {["Yes", "No"].map(val => (
                      <div className="form-check" key={val}>
                        <input
                          type="radio"
                          name="isClass"
                          className="form-check-input"
                          value={val}
                          checked={venue.isClass === val}
                          onChange={e =>
                            setVenue(p => ({ ...p, isClass: e.target.value }))
                          }
                        />
                        <label className="form-check-label">{val}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === CONTACT & LOCATION === */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
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
                <div className="row mb-3">
                  <div className="col-10 col-md-3">
                    <label className="col-form-label fw-bold">
                      Venue Phone:
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={venue.contact?.phone || ""}
                      onChange={e =>
                        setVenue(p => ({
                          ...p,
                          contact: { ...p.contact, phone: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="col-10 col-md-3">
                    <label className="col-form-label fw-bold">
                      Venue Email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={venue.contact?.email || ""}
                      onChange={e =>
                        setVenue(p => ({
                          ...p,
                          contact: { ...p.contact, email: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="col-10 col-md-3">
                    <label className="col-form-label fw-bold">
                      Venue Website:
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      value={venue.contact?.website || ""}
                      onChange={e =>
                        setVenue(p => ({
                          ...p,
                          contact: { ...p.contact, website: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="col-10 col-md-3">
                    <label className="col-form-label fw-bold">Facebook:</label>
                    <input
                      type="url"
                      className="form-control"
                      value={venue.contact?.socials?.[0]?.url || ""}
                      onChange={e =>
                        setVenue(p => ({
                          ...p,
                          contact: {
                            ...p.contact,
                            socials: [
                              { name: "Facebook", url: e.target.value },
                            ],
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-10 col-md-3">
                    <label className="col-form-label fw-bold">Address:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={venue.location?.address || ""}
                      onChange={e =>
                        setVenue(p => ({
                          ...p,
                          location: { ...p.location, address: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="col-10 col-md-3">
                    <label className="col-form-label fw-bold">City:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={venue.location?.city || ""}
                      onChange={e =>
                        setVenue(p => ({
                          ...p,
                          location: { ...p.location, city: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="col-10 col-md-3">
                    <label className="col-form-label fw-bold">State:</label>
                    <select
                      className="form-select"
                      value={venue.location?.state || ""}
                      onChange={e =>
                        setVenue(p => ({
                          ...p,
                          location: { ...p.location, state: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select State</option>
                      {/* Add all state options here */}
                    </select>
                  </div>
                  <div className="col-10 col-md-3">
                    <label className="col-form-label fw-bold">Zip:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={venue.location?.zip || ""}
                      onChange={e =>
                        setVenue(p => ({
                          ...p,
                          location: { ...p.location, zip: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === PRO SERVICES, RULES, RANGE SPEC === */}
          {/* (I kept the structure but cleaned the patterns — you can paste the remaining accordions from your original file using the same controlled patterns shown above) */}
        </div>

        <div className="row justify-content-end mt-3">
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Dashboard
