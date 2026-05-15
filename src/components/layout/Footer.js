// src/components/layout/Footer.js
import * as React from "react"

const Footer = () => {
  return (
    <footer className="bg-primary text-light py-3 fixed-bottom container-fluid gx-0 p-0" style={{ height: "60px", zIndex: 1030 }}>
      <div className="d-flex align-items-center justify-content-between px-3 px-md-4 h-100">
        <div className="text-start">
          <small>&copy; 2026 Archery Shoot Finder. All rights reserved.</small>
        </div>
        <div className="text-end">
          <small>Find your next shoot</small>
        </div>
      </div>
    </footer>
  )
}

export default Footer
