// src/components/OfflineIndicator.js
import * as React from "react"
import { useState, useEffect } from "react"

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Set initial state
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  if (isOnline) return null

  return (
    <div
      className="alert alert-warning text-center py-2 mb-0 fixed-top"
      style={{ top: "56px", zIndex: 1040 }}
      role="alert"
    >
      <i className="bi bi-wifi-off me-2"></i>
      You are currently offline. Some features may be limited.
    </div>
  )
}

export default OfflineIndicator
