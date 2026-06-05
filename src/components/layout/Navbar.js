// src/components/layout/Navbar.js
import * as React from "react"
import { useState } from "react"
import { Link } from "gatsby"
import InstallButton from "../InstallButton"

const Navbar = ({ siteTitle, siteDesc, view, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm"
      style={{ zIndex: 1050 }}
    >
      <div className="container-fluid">
        {/* Logo + Brand */}
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <img
            src="/images/logo-sticker-pop.png"
            alt="Archery Shoot Finder"
            height="32"
            className="me-2"
          />
          {siteTitle}
        </Link>

        <small className="text-white fs-5 pe-2 d-none d-md-inline">
          {siteDesc}
        </small>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                to="/pricing"
                className="nav-link"
                onClick={handleLinkClick}
              >
                Price Tiers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleLinkClick}>
                View Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="https://archeryshootfinder.com"
                className="nav-link"
                onClick={handleLinkClick}
              >
                FAQ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="https://archeryshootfinder.com/#join"
                className="nav-link"
                onClick={handleLinkClick}
              >
                Feedback
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <InstallButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
