// src/components/layout/Footer.js
import * as React from "react"
import { Link } from "gatsby"

const Footer = () => {
  return (
    <footer
      aria-label="Quick navigation"
      className="bg-primary text-light py-3 mb-5 fixed-bottom container-fluid gx-0"
      style={{ height: "80px", zIndex: 1030 }}
    >
      <nav className="row footer-nav align-items-center g-0">
        <div className="col">
          <Link to="/" className="text-decoration-none text-white">
            <i className="bi bi-house-door fs-4" aria-hidden="true"></i>
            <span>Home</span>
          </Link>
        </div>
        <div className="col">
          <Link to="/events?mode=events" className="text-decoration-none text-white">
            <i className="bi bi-calendar-event fs-4" aria-hidden="true"></i>
            <span>Event</span>
          </Link>
        </div>
        <div className="col">
          <Link
            to="/events?mode=destination"
            className="text-decoration-none text-white"
          >
            <i className="bi bi-signpost-split fs-4" aria-hidden="true"></i>
            <span>Destination</span>
          </Link>
        </div>
        <div className="col">
          <Link
            to="/venues?type=Club%2CRange"
            className="text-decoration-none text-white"
          >
            <i className="bi bi-trophy fs-4" aria-hidden="true"></i>
            <span>Clubs &amp; Ranges</span>
          </Link>
        </div>
        <div className="col">
          <Link
            to="/venues?type=Pro%20Shop"
            className="text-decoration-none text-white"
          >
            <i className="bi bi-shop-window fs-4" aria-hidden="true"></i>
            <span>Pro Shop</span>
          </Link>
        </div>
      </nav>
      {/* <div className="d-flex align-items-center justify-content-between px-3 px-md-4 h-100">
        <div className="text-start">
          <small>&copy; 2026 Archery Shoot Finder. All rights reserved.</small>
        </div>
        <div className="text-end">
          <small>Find your next shoot</small>
        </div>
      </div>*/}
    </footer>
  )
}

export default Footer
