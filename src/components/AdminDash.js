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
      {/* 1. INTERACTION CHART: Right underneath the welcome line header */}
      <div className="bg-light rounded border p-4 shadow-sm mb-4 mt-5">
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

      {/* 3. BILLING SETTINGS & UPGRADE PANEL AREA */}
      <div className="row g-4">
        {/* Snipcart Subscription Manager (Mock) */}
        <div className="col-md-7">
          <div className="card shadow-sm border p-4 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-bold text-dark mb-0">
                <i className="bi bi-cart-check me-2"></i>Subscription Plan
              </h5>
              {subscription && (
                <span
                  className={`badge ${
                    subscription.status === "Active"
                      ? "bg-success"
                      : subscription.status === "Paused"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {subscription.status}
                </span>
              )}
            </div>

            {!subscription ? (
              <div className="text-muted small">
                No active subscription. Choose a plan on the Pricing page.
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <div className="fw-semibold">{subscription.plan?.name}</div>
                  <div className="text-muted small">
                    ${subscription.amount} /{" "}
                    {subscription.plan?.frequency?.toLowerCase()}
                  </div>
                </div>

                <div className="row g-2 mb-3 small">
                  <div className="col-6">
                    <div className="text-muted">Next billing</div>
                    <div>
                      {subscription.nextBillingDate
                        ? new Date(
                            subscription.nextBillingDate
                          ).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted">Payment method</div>
                    <div>•••• 4242 (Visa)</div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <Link
                    to="/pricing"
                    className="btn btn-sm btn-outline-primary fw-bold"
                  >
                    Change plan
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-secondary fw-bold"
                    onClick={() =>
                      alert(
                        "Mock: Update payment method modal would open here (for testing)"
                      )
                    }
                  >
                    Update payment
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning fw-bold"
                    onClick={() => {
                      const newStatus =
                        subscription.status === "Paused" ? "Active" : "Paused"
                      const updated = { ...subscription, status: newStatus }
                      setSubscription(updated)
                      localStorage.setItem("subscription_status", newStatus)
                    }}
                  >
                    {subscription.status === "Paused" ? "Resume" : "Pause"}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger fw-bold"
                    onClick={() => {
                      const updated = { ...subscription, status: "Cancelled" }
                      setSubscription(updated)
                      localStorage.setItem("subscription_status", "Cancelled")
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Tier Upgrades Action Panel */}
        <div className="col-md-5">
          <div className="card shadow-sm border border-warning p-4 h-100 bg-white">
            <h5 className="fw-bold text-dark mb-2">🚀 Tier Scaling Center</h5>
            <p className="text-muted small mb-3">
              Want priority mapping placement, extra photo galleries, or
              advanced geographic intent analytics? Modify your visibility
              layout variables anytime.
            </p>
            <Link
              to="/pricing"
              className="btn btn-sm btn-warning fw-bold py-2 w-100 shadow-sm mt-auto"
            >
              <i className="bi bi-arrow-up-circle-fill me-1"></i> Explore Tier
              Upgrade Options
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
