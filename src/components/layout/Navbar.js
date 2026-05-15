// src/components/layout/Navbar.js
import * as React from "react"
import { useState } from "react"
import { Link } from "gatsby"
import { useSearch } from "../context/SearchContext"

const Navbar = ({ siteTitle, siteDesc, view, setView }) => {
  const { showSearch, setShowSearch } = useSearch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setIsMenuOpen(false) // Close menu on any link click
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm" style={{ zIndex: 1050 }}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          {siteTitle}
        </Link>
        <small className="text-white">{siteDesc}</small>
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
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${view === 'list' ? 'active' : ''}`}
                onClick={() => {
                  setView('list')
                  handleLinkClick()
                }}
              >
                Register Shoot
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${view === 'map' ? 'active' : ''}`}
                onClick={() => {
                  setView('map')
                  handleLinkClick()
                }}
              >
                View Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${view === 'list' ? 'active' : ''}`}
                onClick={() => {
                  setView('list')
                  handleLinkClick()
                }}
              >
                Submit Feedback
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setShowSearch(!showSearch)}
              >
                <i className="bi bi-search me-1"></i>Search
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
