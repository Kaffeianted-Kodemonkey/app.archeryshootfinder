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

const Dashboard = ({ user }) => {
  const [chartType, setChartType] = useState("line")
  const [subscription, setSubscription] = useState(null)

  // ADD THIS MOCK VENUE (so the spotlight markup can render)
  const venue = {
    vname: "Mock Archery Range",
    venueType: "indoor_range",
    isClaimed: true,
    tagline: "Where precision meets passion",
    description: "Mock description for testing",
    bio: "This is the mock bio text that appears in the Facility section.",
    rulesGuidlines: "Mock rules & guidelines text.",
    amenities: [
      "Climate Controlled",
      "Pro Shop",
      "Lessons",
      "Wi-Fi",
      "Parking",
    ],
    location: {
      address: "123 Mock Lane",
      city: "Denver",
      state: "CO",
      zip: "80202",
    },
    contact: {
      phone: "(303) 555-1234",
      email: "info@mockrange.com",
      website: "https://mockrange.com",
      socials: [
        { name: "Facebook", url: "https://facebook.com/mock" },
        { name: "Instagram", url: "https://instagram.com/mock" },
      ],
    },
    // add any extra fields your spotlight JSX references (hours, services, etc.)
  }

  useEffect(() => {
    // Try to load the plan the user just purchased on the Pricing page
    const storedPlanId = localStorage.getItem("claimed_plan")
    const activeSub = mockSubscriptionData[0]?.items?.find(
      item => item.status === "Active"
    )

    if (storedPlanId) {
      // For testing: create a mock subscription object from the purchased planId
      setSubscription({
        id: `sub_${storedPlanId}`,
        status: "Active",
        amount: activeSub?.amount || 25,
        plan: {
          name: storedPlanId.includes("yearly")
            ? storedPlanId.replace("-yearly-sub", " Yearly")
            : storedPlanId.replace("-monthly-sub", " Monthly"),
          frequency: storedPlanId.includes("yearly") ? "Yearly" : "Monthly",
        },
        nextBillingDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
    } else if (activeSub) {
      setSubscription(activeSub)
    }
  }, [])

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
<<<<<<< HEAD
=======
      <div class="alert alert-warning" role="alert">
        App is in Development using Mock Data!
        <br />
        Subcriptions do not work in <strong>TEST MODE</strong>!
      </div>

>>>>>>> parent of 1c4092b (update code to add snipcart data to the database)
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
      {/* 2. ANALYTICS METRICS CARDS: Directly below the charting area */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card p-3 border-0 bg-white border-start border-primary border-4 shadow-sm">
            <small className="text-uppercase text-muted fw-bold small">
              Spotlight Views
            </small>
            <h3 className="fw-bold text-dark m-0 mt-1">1,240</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 border-0 bg-white border-start border-success border-4 shadow-sm">
            <small className="text-uppercase text-muted fw-bold small">
              Website Clicks
            </small>
            <h3 className="fw-bold text-dark m-0 mt-1">342</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 border-0 bg-white border-start border-warning border-4 shadow-sm">
            <small className="text-uppercase text-muted fw-bold small">
              Direct Inquiries
            </small>
            <h3 className="fw-bold text-dark m-0 mt-1">18</h3>
          </div>
        </div>
      </div>
      {/* UPDATE SPOTLIGHT PAGE */}
      <hr />
      <h2>Edit/Update Spoltlight Page:</h2>
      <small className="text-danger">
        <em>All field marked with * is required.</em>
      </small>
      <hr />

      {/* START ACCORDION */}
      <form>
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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> parent of 1c4092b (update code to add snipcart data to the database)
                {/* Venue Name */}
                <div className="row mb-3">
                  <div className="col-10 col-md-6">
                    <label for="vname" className="col-form-label fw-bold">
                      Venue Name: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vname"
                      value={venue.vname || ""}
                      onChange={e => {
                        // later: update your state here
                        console.log("New tagline:", e.target.value)
                      }}
                      placeholder="Enter Company/Venue Name"
                    />
                  </div>
                  {/* Venue Tagline */}
                  <div className="col-10 col-md-6">
                    <label for="tagline" className="col-form-label fw-bold">
                      Venue Tagline: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tagline"
                      value={venue.tagline || ""}
                      onChange={e => {
                        // later: update your state here
                        console.log("New tagline:", e.target.value)
                      }}
                      placeholder="Enter short description for venue"
                    />
                  </div>
                </div>
                {/* Venue Bio & Image/Alt */}
                <div className="row mb-3">
                  <div className="col-10 col-md-6">
                    <label for="bio" className="form-label fw-bold">
                      About Facility:
                    </label>
                    <textarea
                      className="form-control"
                      id="bio"
                      value={venue.bio || ""}
                      onChange={e => {
                        // later: update your state here
                        console.log("New tagline:", e.target.value)
                      }}
                      placeholder="Enter short description for venue"
                    />
                  </div>
                  <div className="col-10 col-md-6">
                    {/* Log Banner image */}
                    <div className="row mb-3">
                      <div className="col">
                        <label for="img" className="col-form-label fw-bold">
                          Enter Logo or Banner image:
                        </label>
<<<<<<< HEAD
                        <input type="file" className="form-control" id="img" />
=======
                        <input
                          type="file"
                          className="form-control"
                          id="img"
                          value={venue.image || ""}
                          onChange={e => {
                            // later: update your state here
                            console.log("New tagline:", e.target.value)
                          }}
                          placeholder="Enter Logo"
                        />
>>>>>>> parent of 1c4092b (update code to add snipcart data to the database)
                      </div>
                    </div>
                    <div className="row">
                      {/* Alt tag for image */}
                      <div className="col">
                        <label for="alt" className="col-form-label fw-bold">
                          Image/Logo Name for alt tag:
                        </label>
<<<<<<< HEAD
                        <input type="text" className="form-control" id="alt" />
=======
                        <input
                          type="text"
                          className="form-control"
                          id="alt"
                          value={venue.alt || ""}
                          onChange={e => {
                            // later: update your state here
                            console.log("New tagline:", e.target.value)
                          }}
                          placeholder="Enter image/logo name"
                        />
>>>>>>> parent of 1c4092b (update code to add snipcart data to the database)
                      </div>
                    </div>
                  </div>
                </div>
                {/* Venue Type & Amenitites */}
                <div className="row mb-3">
                  {/* Type */}
                  <div className="col-6 col-md-3 mt-2">
                    <fieldset>
                      <legend className="col-form-label pt-0 fw-bold">
                        Venue Type
                      </legend>
                      <div className="col-sm-10">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="veneuType"
                            id="veneuType1"
                            value="Range-Only"
                            checked
                          />
                          <label className="form-check-label" for="veneuType1">
                            Range Only
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="veneuType"
                            id="veneuType2"
                            value="Club"
                          />
                          <label className="form-check-label" for="veneuType2">
                            Club
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="veneuType"
                            id="veneuType3"
                            value="Pro-Shop"
                          />
                          <label className="form-check-label" for="veneuType3">
                            Pro Shop
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="veneuType"
                            id="veneuType4"
                            value="Association"
                          />
                          <label className="form-check-label" for="veneuType4">
                            Association
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  {/* Amenitites */}
                  <div className="col-6 col-md-3 mt-2">
                    <fieldset>
                      <legend className="col-form-label pt-0 fw-bold">
                        Amenitites
                      </legend>
                      <div className="col-sm-10">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="amenities"
                            id="amenities1"
                            value="WheelchairAccess"
                            checked
                          />
                          <label className="form-check-label" for="amenities1">
                            Weelchair Access
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="amenities"
                            id="amenities2"
                            value="Restrooms"
                          />
                          <label className="form-check-label" for="amenities2">
                            Restrooms
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="amenities"
                            id="amenities3"
                            value="Wi-Fi"
                          />
                          <label className="form-check-label" for="amenities3">
                            Wi-Fi
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="amenities"
                            id="amenities4"
                            value="Food"
                          />
                          <label className="form-check-label" for="amenities4">
                            Food
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  {/* League & Classes */}
                  <div className="col-6 col-md-3">
                    <fieldset>
                      <legend className="col-form-label fw-bold">
                        Leagues?
                      </legend>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="Leagues"
                          id="Leagues1"
                          value="Yes"
                        />
                        <label className="form-check-label" for="Leagues1">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="Leagues"
                          id="Leagues2"
                          value="No"
                          checked
                        />
                        <label className="form-check-label" for="Leagues2">
                          No
                        </label>
                      </div>
                    </fieldset>
                  </div>
                  <div className="col-6 col-md-3">
                    <fieldset>
                      <legend className="col-form-label fw-bold">
                        Classes?
                      </legend>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="Classes"
                          id="Classes1"
                          value="Yes"
                        />
                        <label className="form-check-label" for="Classes1">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="Classes"
                          id="Classes2"
                          value="No"
                          checked
                        />
                        <label className="form-check-label" for="Classes2">
                          No
                        </label>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* VENUE CONTACT & LOCATION #2 */}
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
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
              class="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div class="accordion-body">
                {/*Venue Phone*/}
                <div className="row mb-3">
                  <div className="col-10 col-md-3">
                    <label for="vphone" className="col-form-label fw-bold">
                      Venue Phone:
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="vphone"
                      placeholder="(000) 000-0000)"
                    />
                  </div>
                  {/* Venue Emial */}
                  <div className="col-10 col-md-3">
                    <label for="vemial" className="col-form-label fw-bold">
                      Venue Email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="vemial"
                      placeholder="example@yousite.com"
                    />
                  </div>
                </div>
                {/* Venue Webite */}
                <div className="row mb-3">
                  <div className="col-10 col-md-3">
                    <label for="vwebsite" className="col-form-label fw-bold">
                      Venue Website:
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="vwebsite"
                      placeholder="htptts://www.yousite.com"
                    />
                  </div>
                  {/* social */}
                  <div className="col-10 col-md-3">
                    <label for="facebook" className="col-form-label fw-bold">
                      Facebook:
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="facebook"
                      placeholder="htptts://www.facebook.com/Venue"
                    />
                  </div>
                </div>
                {/* Venue Address */}
                <div className="row mb-3">
                  <div className="col-10 col-md-3">
                    <label for="vaddress" className=" col-form-label fw-bold">
                      Venue Adress:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vaddress"
                      placeholder="123 Main St."
                    />
                  </div>
                  {/* Venue City */}
                  <div className="col-10 col-md-3">
                    <label for="vcity" className="col-form-label fw-bold">
                      Venue City:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vcity"
                      placeholder="Denver"
                    />
                  </div>
                </div>
                {/* Venue State & Zip*/}
                <div className="row mb-3">
                  <div className="col-10 col-md-3">
                    <label for="state" className="col-form-label fw-bold me-2">
                      State:
                    </label>
                    <select
                      name="state"
                      id="state"
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
                  {/* Venue Zip */}
                  <div className="col-10 col-md-3">
                    <label for="vzip" className="col-form-label fw-bold">
                      Venue Zip:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vstate"
                      placeholder="80224"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* PRO-SHOP ONLY #3 */}
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Equipment & Pro Services
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div class="accordion-body">
                <h3>Bow Maintenance & Setup</h3>
                <p>
                  Select they types os Equipment and Services that meet your
                  services. If there is service you offer that is not listed you
                  can add it as Other.
                </p>
                <div className="row mb-3">
                  <div className="col-10">
                    <div className="form-check">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        name="BowMainSet"
                        value="Bow Press Labor: Compressing compound bows to safely swap out worn-out strings and cables."
                        id="BowPressLabor"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="BowPressLabor"
                      >
                        <span className="fw-bold">Bow Press Labor:</span>{" "}
                        Compressing compound bows to safely swap out worn-out
                        strings and cables.
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="BowMainSet"
                        value="D-Loop & Peep Sight Tying: Installing the two essential string components needed to hook up a mechanical release and sight through the bow."
                        id="dLoop"
                      />
                      <label className="form-check-label mb-3" for="dLoop">
                        <span className="fw-bold">
                          D-Loop & Peep Sight Tying:{" "}
                        </span>{" "}
                        Installing the two essential string components needed to
                        hook up a mechanical release and sight through the bow.
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="BowMainSet"
                        value="Draw String Adjustments: Changing module settings or turning limb bolts to alter how far and how heavy a shooter must pull."
                        id="DrawLenAdj"
                      />
                      <label className="form-check-label mb-3" for="DrawLenAdj">
                        <span className="fw-bold">
                          Draw String Adjustments:
                        </span>{" "}
                        Changing module settings or turning limb bolts to alter
                        how far and how heavy a shooter must pull.
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="BowMainSet"
                        value="Basic Accessory Mounting: Bolting on and leveling basic hardware like arrow rests, multi-pin sights, and stabilizers."
                        id="BasicAssMoun"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="BasicAssMoun"
                      >
                        <span className="fw-bold">
                          Basic Accessory Mounting:
                        </span>{" "}
                        Bolting on and leveling basic hardware like arrow rests,
                        multi-pin sights, and stabilizers.
                      </label>
                    </div>
                  </div>
                </div>
                <hr />
                <h3>Basic Arrow Services</h3>
                <p>
                  Because arrows are consumable ammunition that break, tear, and
                  lose parts constantly, shops provide quick assembly and repair
                  work.
                </p>
                <div className="row mb-3">
                  <div className="col-10">
                    <div className="form-check">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        name="BasicArrowSer"
                        value="Arrow Cutting: Trimming raw carbon or aluminum arrow shafts down to a safe, custom length using a specialized high-speed saw."
                        id="ArrowCutting"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="ArrowCutting"
                      >
                        <span className="fw-bold">Arrow Cutting:</span> Trimming
                        raw carbon or aluminum arrow shafts down to a safe,
                        custom length using a specialized high-speed saw.
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="BasicArrowSer"
                        value="Fletching & Re-fletching: Gluing plastic vanes or feathers onto the back of an arrow to stabilize its flight."
                        id="FlechReFlech"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="FlechReFlech"
                      >
                        <span className="fw-bold">
                          Fletching & Re-fletching:
                        </span>{" "}
                        Gluing plastic vanes or feathers onto the back of an
                        arrow to stabilize its flight.
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="BasicArrowSer"
                        value="Component Gluing: Permanently setting point inserts and replacing cracked plastic nocks.."
                        id="Wraps"
                      />
                      <label className="form-check-label mb-3" for="Wraps">
                        <span className="fw-bold">Component Gluing:</span>{" "}
                        Permanently setting point inserts and replacing cracked
                        plastic nocks.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* RULES & REGS #4 */}
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
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
              class="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div class="accordion-body">
                {/* behave rules */}
                <h3>Behavioral Rules</h3>
                <p>
                  Shooting Line Conduct protect archers standing
                  shoulder-to-shoulder on an active shooting line.
                </p>
                <div className="row">
                  <div className="col-10">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="BehaveRules"
                        value="Straddle the Line: Archers must stand straddling the shooting line (one foot on each side) while shooting."
                        id="StraddleLine"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="StraddleLine"
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
                        name="BehaveRules"
                        value="Shoot Only from Designated Lines: No archer may advance past the active shooting line until a clear 'ceasefire' command is given."
                        id="DesignatedLines"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="DesignatedLines"
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
                        name="BehaveRules"
                        value="Keep Bows Pointed Down-Range: Bows must always remain pointed directly at the targets while loading an arrow, drawing, or aiming."
                        id="BowPointDownRange"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="BowPointDownRange"
                      >
                        <span className="fw-bold">
                          Keep Bows Pointed Down-Range:
                        </span>{" "}
                        Bows must always remain pointed directly at the targets
                        while loading an arrow, drawing, or aiming.
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="BehaveRules"
                        value="No Sky Drawing: Bows must be drawn straight down-range, level with or below the target face plane. (Drawing upwards can cause an accidental release over the safety walls)"
                        id="SkyDraw"
                      />
                      <label className="form-check-label mb-3" for="SkyDraw">
                        <span className="fw-bold">No Sky Drawing:</span> Bows
                        must be drawn straight down-range, level with or below
                        the target face plane. (Drawing upwards can cause an
                        accidental release over the safety walls)
                      </label>
                    </div>
                  </div>
                </div>
                {/* gear control */}
                <hr />
                <h3>Gear Controls</h3>
                <p>
                  Equipment Restrictions prevent damage to target infrastructure
                  and ensure fair practice lanes.
                </p>
                <div className="row">
                  <div className="col-10">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="GearControl"
                        value="Target or Field Points Only: Absolutely no broadheads, hunting tips, blunts, or small-game tips are allowed on standard target bales."
                        id="TargetFieldPoints"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="TargetFieldPoints"
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
                        name="GearControl"
                        value="Peak Draw Weight Limits: Maximum draw weight is capped at 60 lbs for indoor ranges and 70 lbs for outdoor lanes. (This prevents heavy compound setups from blowing through target backstops)."
                        id="DraeWeight"
                      />
                      <label className="form-check-label mb-3" for="DraeWeight">
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
                        name="GearControl"
                        value="Crossbow Policy (Preset Dropdown): Crossbows are prohibited on standard lanes unless explicit matching target blocks are provided."
                        id="CrossbowPolicy"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="CrossbowPolicy"
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
                        name="GearControl"
                        value="Maximum Arrow Diameter: Arrow shafts must not exceed 9.3mm (e.g., 23-diameter target arrows) to prevent excessive target wear."
                        id="ArrowDiameter"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="ArrowDiameter"
                      >
                        <span className="fw-bold">Maximum Arrow Diameter:</span>{" "}
                        Arrow shafts must not exceed 9.3mm (e.g., 23-diameter
                        target arrows) to prevent excessive target wear.
                      </label>
                    </div>
                  </div>
                </div>
                {/* safty etiquette */}
                <hr />
                <h3>Safety & Etiquette</h3>
                <p>
                  General Range Safety & Etiquette dictate the overall
                  operational flow of the facility.
                </p>
                <div className="row">
                  <div className="col-10">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="SafetyEtiquette"
                        value="Youth Supervision Required: Archers under the age of 15 must be accompanied and actively supervised by an adult at all times."
                        id="SupervisionReq"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="SupervisionReq"
                      >
                        <span className="fw-bold">
                          outh Supervision Required:
                        </span>{" "}
                        Archers under the age of 15 must be accompanied and
                        actively supervised by an adult at all times.
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="SafetyEtiquette"
                        value="Wait for the Whistle / Visual Commands: Obey all formal range commands (e.g., 1 whistle to shoot, 2 whistles to retrieve arrows, 3 or more whistles for emergency ceasefire)."
                        id="WhistleRule"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="WhistleRule"
                      >
                        <span className="fw-bold">
                          Wait for the Whistle / Visual Commands:
                        </span>{" "}
                        Obey all formal range commands (e.g., 1 whistle to
                        shoot, 2 whistles to retrieve arrows, 3 or more whistles
                        for emergency ceasefire).
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="SafetyEtiquette"
                        value="Pulling Arrows Safely: Stand to the side of the target block when pulling arrows to avoid hitting someone standing directly behind you. Ensure the area behind the target is clear."
                        id="ArrowPulling"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="ArrowPulling"
                      >
                        <span className="fw-bold">Pulling Arrows Safely:</span>{" "}
                        Stand to the side of the target block when pulling
                        arrows to avoid hitting someone standing directly behind
                        you. Ensure the area behind the target is clear.
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="SafetyEtiquette"
                        value="No Alcohol or Substance Use: Absolutely no consumption of alcohol or drugs before or during active range shooting sessions."
                        id="SubdtanceUse"
                      />
                      <label
                        className="form-check-label mb-3"
                        for="SubdtanceUse"
                      >
                        <span className="fw-bold">
                          No Alcohol or Substance Use:
                        </span>{" "}
                        Absolutely no consumption of alcohol or drugs before or
                        during active range shooting sessions.
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="RangeAccess"
                        value="Bow Tuning: Allowing customers to shoot a couple of arrows through a new bow model before deciding to buy it."
                        id="BowTuning"
                      />
                      <label className="form-check-label mb-3" for="BowTuning">
                        <span className="fw-bold">Bow Tuning:</span> Allowing
                        customers to shoot a couple of arrows through a new bow
                        model before deciding to buy it.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* RANGE SPEC #5 */}
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
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
              class="accordion-collapse collapse"
              data-bs-parent="#venueAccordion"
            >
              <div class="accordion-body">
                {/* Range and Target types */}
                <h3>Range & Target Types</h3>
                <div className="row">
                  {/* Range Type */}
                  <div className="col-12 col-md-3">
                    <fieldset>
                      <legend className="col-form-label fw-bold">
                        Range Type
                      </legend>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="rangeType"
                          id="indoors"
                          value="indoorRange"
                          checked
                        />
                        <label className="form-check-label" for="indoorRange">
                          Indoor Range
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="rangeType"
                          id="outdoors"
                          value="outdoorRange"
                        />
                        <label className="form-check-label" for="outdoorRange">
                          Outdoor Range
                        </label>
                      </div>
                    </fieldset>
                  </div>
                  {/* Targer Type */}
                  <div className="col-12 col-md-3">
                    <fieldset>
                      <legend className="col-form-label fw-bold">
                        Target Type
                      </legend>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="MCPF"
                          value="122cm and 80cm Multi-Color Paper Faces"
                          checked
                        />
                        <label className="form-check-label" for="MCPF">
                          122cm and 80cm Multi-Color Paper Faces
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="NFAA-FAF"
                          value="NFAA Field Archery Faces"
                        />
                        <label className="form-check-label" for="NFAA-FAF">
                          NFAA Field Archery Faces
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="3DAT"
                          value="3D Animal Targets"
                          checked
                        />
                        <label className="form-check-label" for="3DAT">
                          3D Animal Targets
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="NFAA-ARF"
                          value="NFAA Animal Round Faces"
                        />
                        <label className="form-check-label" for="NFAA-ARF">
                          NFAA Animal Round Faces
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="NFAA-BWF"
                          value="NFAA Blue/White Faces"
                          checked
                        />
                        <label className="form-check-label" for="NFAA-BWF">
                          NFAA Blue/White Faces
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="3SVVF"
                          value="3-Spot Vertical / Vegas Faces"
                        />
                        <label className="form-check-label" for="3SVVF">
                          3-Spot Vertical / Vegas Faces
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="targetType"
                          id="40SSPF"
                          value="40cm Single-Spot Paper Faces"
                        />
                        <label className="form-check-label" for="40SSPF">
                          40cm Single-Spot Paper Faces
                        </label>
                      </div>
                    </fieldset>
                  </div>
                </div>
                <hr />
                <h3>Broadhead Tuning</h3>
                <div className="row">
                  {/* Broadhead Tuning. */}
                  <div className="col-12 col-md-3">
                    {/* BT-Indoors */}
                    <fieldset>
                      <legend className="col-form-label fw-bold">
                        Indoors
                      </legend>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="btIndoors"
                          id="btid1"
                          value="No"
                        />
                        <label className="form-check-label" for="btid1">
                          No
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="btIndoors"
                          id="btid2"
                          value="Yes"
                          checked
                        />
                        <label className="form-check-label" for="btid2">
                          Yes - Designated areas Only
                        </label>
                      </div>
                    </fieldset>
                  </div>
                  <div className="col-12 col-md-3">
                    {/* BT-Outdoors */}
                    <fieldset>
                      <legend className="col-form-label fw-bold">
                        Outdoors
                      </legend>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="btOutdoors"
                          id="btod1"
                          value="No"
                        />
                        <label className="form-check-label" for="btod1">
                          No
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="btOutdoors"
                          id="btod2"
                          value="Yes"
                          checked
                        />
                        <label className="form-check-label" for="btod2">
                          Yes - Designated areas Only
                        </label>
                      </div>
                    </fieldset>
                  </div>
                </div>
                {/* Max Dist. */}
                <hr />
                <h3>Maximum Distance</h3>
                <div className="row">
                  <div className="col-10 col-md-3">
                    <label for="indoorDist" className="col-form-label fw-bold">
                      Indoor Max Dist.
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="indoorDist"
                    />
                  </div>
                  <div className="col-10 col-md-3">
                    <label for="outdoorDist" className="col-form-label fw-bold">
                      Outdoor Max Dist.
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="outdoorDist"
                    />
                  </div>
                </div>
                {/* Lane Cap */}
                <hr />
                <h3>Lane Cap.</h3>
                <div className="row">
                  <div className="col-10 col-md-3">
                    <label for="laneCapIn" className="col-form-label fw-bold">
                      Lane Cap. Indoors
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="laneCapIn"
                    />
                  </div>
                  <div className="col-10  col-md-3">
                    <label for="laneCapOut" className="col-form-label fw-bold">
                      Lane Cap. Outdoors
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="laneCapOut"
                    />
                  </div>
                </div>
              </div>
            </div>
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
