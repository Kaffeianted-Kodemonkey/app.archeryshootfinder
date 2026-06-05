// src/components/InstallButton.js
import * as React from "react"
import { useState, useEffect } from "react"

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = e => {
      // Prevent the default mini-infobar from appearing on mobile
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }

    // Clear the deferredPrompt so it can only be used once
    setDeferredPrompt(null)
    setShowInstall(false)
  }

  // Don't show the button if the app is already installed or prompt isn't available
  if (!showInstall) return null

  return (
    <button
      onClick={handleInstallClick}
      className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
      aria-label="Install Archery Shoot Finder app"
    >
      <i className="bi bi-download"></i>
      <span className="d-none d-md-inline">Install App</span>
    </button>
  )
}

export default InstallButton
