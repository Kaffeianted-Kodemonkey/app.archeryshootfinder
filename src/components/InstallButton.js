import * as React from "react"
import { useState, useEffect } from "react"

const InstallButton = () => {
  if (typeof window === "undefined") return null

  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = e => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }

    setDeferredPrompt(null)
    setShowInstall(false)
  }

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
