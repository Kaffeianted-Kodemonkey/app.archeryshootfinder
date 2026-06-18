// src/components/Dashboard.js
import * as React from "react"
import { useState } from "react"
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

      {/* 3. BILLING SETTINGS & UPGRADE PANEL AREA */}
      <div className="row g-4">
        {/* PayPal Gateway Configuration Area */}
        <div className="col-md-7">
          <div className="card shadow-sm border p-4 h-100 bg-white">
            <h5 className="fw-bold text-dark mb-2">
              💳 Billing Account Settings
            </h5>
            <p className="text-muted small mb-3">
              Your ongoing subscription profiles are linked securely with your
              automated PayPal checkout pipeline. Use the dashboard shortcut to
              process updates, clear invoices, or change credentials.
            </p>
            <div className="bg-light border rounded p-2 mb-3 font-monospace small text-truncate">
              Reference Token:{" "}
              {user?.subscriptionId || "FREE-VERIFICATION-NODE"}
            </div>
            <button className="btn btn-sm btn-outline-primary fw-bold py-2 px-3 shadow-sm mt-auto align-self-start">
              <i className="bi bi-paypal me-1"></i> Launch PayPal Billing Center
            </button>
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
