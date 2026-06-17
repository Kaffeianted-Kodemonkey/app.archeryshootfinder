// src/components/layout/Navbar.js
import * as React from "react"
import { useState, useEffect } from "react"
import { Link, navigate } from "gatsby"
import InstallButton from "../InstallButton"

const Navbar = ({ siteTitle, siteDesc, view, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Track the dashboard dropdown state
  const [loggedInhost, setLoggedInhost] = useState(null)

  // Dynamic Session Monitor: Look for the portal's active login token
  useEffect(() => {
    const checkhostSession = () => {
      const savedhost = localStorage.getItem("mock_venue_host")
      if (savedhost) {
        setLoggedInhost(JSON.parse(savedhost))
      } else {
        setLoggedInhost(null)
      }
    }

    checkhostSession()

    if (typeof window !== "undefined") {
      window.addEventListener("storage", checkhostSession)
      return () => window.removeEventListener("storage", checkhostSession)
    }
  }, [])

  const handleLinkClick = () => {
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
  }

  const handleLogoutClick = () => {
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
    localStorage.removeItem("mock_venue_host")
    setLoggedInhost(null)
    navigate("/pricing")
  }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm"
      style={{ zIndex: 1050 }}
    >
      <div className="container-fluid">
        {/* Logo + Brand */}
        <Link
          className="navbar-brand d-flex align-items-center fw-bold"
          to="/"
          onClick={handleLinkClick}
        >
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

            {/* NESTED VENUE PORTAL MENU SECTION */}
            {loggedInhost ? (
              /* If Logged In: Render a nested dropdown menu labeled "Venue Portal" */
              <li
                className={`nav-item dropdown ${isDropdownOpen ? "show" : ""}`}
              >
                <button
                  className="nav-link dropdown-toggle btn btn-link fw-bold text-warning border-0"
                  type="button"
                  aria-expanded={isDropdownOpen}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Venue Portal
                </button>
                <ul
                  className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                  data-bs-theme="light"
                >
                  <li>
                    <Link
                      to="/portal/"
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={handleLinkClick}
                    >
                      <span>Dashboard Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/portal/profile"
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={handleLinkClick}
                    >
                      <span>Edit Public Profile</span>
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogoutClick}
                      className="dropdown-item text-danger d-flex align-items-center gap-2 fw-bold"
                    >
                      <span>❌ Disconnect Session</span>
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              /* If Logged Out: Render a standard link straight to the login screen */
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={handleLinkClick}
                >
                  Venue Portal
                </Link>
              </li>
            )}

            {/* General Baseline Links shown to everyone */}
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
                to="https://archeryshootfinder.com"
                className="nav-link"
                onClick={handleLinkClick}
              >
                Feedback
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Displaying an active logged-in badge on the right edge */}
            {loggedInhost && (
              <div className="d-none d-lg-block text-white bg-dark bg-opacity-25 rounded px-3 py-1 small fw-semibold">
                {loggedInhost.name}
              </div>
            )}
            <InstallButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
