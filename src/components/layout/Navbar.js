// src/components/layout/Navbar.js
import * as React from "react"
import { useState, useEffect } from "react"
import { Link, navigate } from "gatsby"
import InstallButton from "../InstallButton"

const Navbar = ({ siteTitle, siteDesc, view, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Track the dashboard dropdown state
  const [loggedInuser, setLoggedInuser] = useState(null)

  // Only use real Snipcart data — no role, no mock fallback
  useEffect(() => {
    const check = async () => {
      if (window.Snipcart?.api?.user?.current) {
        try {
          const c = await window.Snipcart.api.user.current()
          if (c?.email) {
            setLoggedInuser({
              name: c.billingAddress?.company || c.email.split("@")[0],
              email: c.email,
            })
            return
          }
        } catch (_) {}
      }
      setLoggedInuser(null)
    }
    check()
    window.addEventListener("storage", check)
    return () => window.removeEventListener("storage", check)
  }, [])

  const handleLogoutClick = async () => {
    if (window.Snipcart?.api?.user?.logout) {
      await window.Snipcart.api.user.logout()
    }
    setLoggedInuser(null)
    window.location.href = "/pricing"
  }

  const handleLinkClick = () => {
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
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
            {loggedInuser ? (
              // LOGGED IN
              <li
                className={`nav-item dropdown ${isDropdownOpen ? "show" : ""}`}
              >
                <button
                  className="nav-link dropdown-toggle btn btn-link fw-bold text-warning border-0"
                  type="button"
                  aria-expanded={isDropdownOpen}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Account Login
                </button>
                <ul
                  className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                  data-bs-theme="light"
                >
                  {/* Venue role items */}
                  {(loggedInuser.role || "venue") === "venue" && (
                    <li>
                      <Link
                        to="/portal/"
                        className="dropdown-item"
                        onClick={handleLinkClick}
                      >
                        <span class="snipcart-user-email">Dashboard</span>
                      </Link>
                    </li>
                  )}

                  {/* Common items */}
                  <li>
                    <Link
                      to="/portal/profile"
                      className="dropdown-item"
                      onClick={handleLinkClick}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={handleLogoutClick}
                      className="dropdown-item text-danger fw-bold"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              // LOGGED OUT
              <li
                className={`nav-item dropdown ${isDropdownOpen ? "show" : ""}`}
              >
                <button
                  className="nav-link dropdown-toggle btn btn-link fw-bold text-warning border-0"
                  type="button"
                  aria-expanded={isDropdownOpen}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Account Login
                </button>
                <ul
                  className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                  data-bs-theme="light"
                >
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item snipcart-user-profile"
                      onClick={handleLinkClick}
                    >
                      Venue
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item"
                      onClick={handleLinkClick}
                    >
                      Shooter
                    </Link>
                  </li>
                </ul>
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
            {loggedInuser && (
              <div className="d-none d-lg-block text-white bg-dark bg-opacity-25 rounded px-3 py-1 small fw-semibold">
                {loggedInuser.name}
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
