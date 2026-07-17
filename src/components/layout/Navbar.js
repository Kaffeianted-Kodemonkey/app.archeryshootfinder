import * as React from "react"
import { useState, useEffect } from "react"
import { Link } from "gatsby"

const Navbar = ({ siteTitle, siteDesc }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loggedInuser, setLoggedInuser] = useState(null)

  const checkSnipcartUser = async () => {
    // Guard clause: Exit early if window does not exist (Server-Side Rendering)
    if (typeof window === "undefined") return

    // Snipcart v2 global object checks
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

  useEffect(() => {
    // Only run this code if window is fully available in the browser
    if (typeof window !== "undefined") {
      checkSnipcartUser()

      const handleLogin = () => checkSnipcartUser()
      window.addEventListener("snipcart:user-logged-in", handleLogin)
      window.addEventListener("storage", checkSnipcartUser)

      return () => {
        window.removeEventListener("snipcart:user-logged-in", handleLogin)
        window.removeEventListener("storage", checkSnipcartUser)
      }
    }
  }, [])

  const handleLogoutClick = async () => {
    // Guard clause: Ensure window exists before running browser logic
    if (typeof window !== "undefined") {
      if (window.Snipcart?.api?.user?.logout) {
        await window.Snipcart.api.user.logout()
      }
      setLoggedInuser(null)
      window.location.href = "/"
    }
  }

  const handleLinkClick = () => setIsMenuOpen(false)

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm"
      style={{ zIndex: 1050 }}
    >
      <div className="container-fluid">
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
              <Link to="/" className="nav-link" onClick={handleLinkClick}>
                Home
              </Link>
            </li>
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
          {/* RIGHT SIDE: Dynamic Auth Navigation Panel */}
          <ul className="navbar-nav ms-auto gap-2">
            {loggedInuser ? (
              <>
                <li className="nav-item d-none d-md-inline">
                  <span className="text-white small fw-bold me-2">
                    {loggedInuser.name}
                  </span>
                </li>
                <li className="nav-item">
                  <Link
                    to="/portal/"
                    className="btn btn-outline-light btn-sm px-3"
                    onClick={handleLinkClick}
                  >
                    Admin Dashboard
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link
                    to="/portal/profile"
                    className="btn btn-outline-light btn-sm px-3"
                    onClick={handleLinkClick}
                  >
                    Venue Profile
                  </Link>
                </li>*/}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm px-3 snipcart-edit-profile"
                    onClick={handleLinkClick}
                  >
                    Billing
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm px-3 snipcart-user-profile"
                    onClick={handleLinkClick}
                  >
                    Subscriptions
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogoutClick}
                    className="btn btn-dark btn-sm px-3"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  to="/login"
                  className="btn btn-warning btn-sm px-4 fw-bold"
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
