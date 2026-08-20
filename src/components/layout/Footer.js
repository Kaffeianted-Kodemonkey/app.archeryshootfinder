// src/components/layout/Footer.js
import * as React from "react"

const Footer = () => {
  return (
    <footer
      className="bg-primary text-light py-3 mb-5 fixed-bottom container-fluid gx-0"
      style={{ height: "80px", zIndex: 1030 }}
    >
      <div className="row align-items-center justify-content-between pb-3 g-0">
        <div className="col d-flex flex-column align-items-center text-nowrap">
          <i className="bi bi-house-door fs-4"></i>
          <a href="/" className="text-decoration-none text-white ">
            Home
          </a>
        </div>
        <div className="col d-flex flex-column align-items-center text-nowrap">
          <span>
            <i className="bi bi-person fs-4"></i>
          </span>
          <a href="/events" className="text-decoration-none text-white ">
            Events
          </a>
        </div>

        <div className="col d-flex flex-column align-items-center text-nowrap">
          <span>
            <i className="bi bi-trophy fs-4"></i>
          </span>
          <a
            href="/venues?type=Club"
            className="text-decoration-none text-white "
          >
            Clubs
          </a>
        </div>

        <div className="col d-flex flex-column align-items-center text-nowrap">
          <span>
            <i className="bi bi-shop-window fs-4"></i>
          </span>
          <a
            href="/venues?type='pro_shop"
            className="text-decoration-none text-white "
          >
            Pro Shop
          </a>
        </div>

        <div className="col d-flex flex-column align-items-center text-nowrap">
          <span>
            <i className="bi bi-bullseye fs-4"></i>
          </span>
          <a
            href="/venues?type='range'"
            className="text-decoration-none text-white "
          >
            Ranges
          </a>
        </div>
      </div>
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
