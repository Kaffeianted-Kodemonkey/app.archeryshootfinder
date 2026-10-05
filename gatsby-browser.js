import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "./src/styles/global.css"
import { navigate } from "gatsby"

// Global browser entry lifecycle execution hook
export const onClientEntry = () => {
  if (typeof window === "undefined") return

  // Catch missing asset chunks seamlessly when navigating offline
  window.addEventListener("unhandledrejection", event => {
    if (event.reason && /Loading chunk \d+ failed/.test(event.reason)) {
      console.warn("PWA asset chunk failed to load offline. Fetching fallback state...")
    }
  })

  // Listen for global clicks on the page
  window.addEventListener("click", e => {
    // Check if Snipcart API is loaded and available
    if (window.Snipcart && typeof window.Snipcart.api === "object") {
      // Identify if the user clicked a nav link (adjust selectors if needed)
      const isNavLink =
        e.target.closest("nav a") || e.target.closest(".nav-link")

      if (isNavLink) {
        // Force the Snipcart modal to close cleanly
        window.Snipcart.api.modal.close()
      }
    }
  })
}

// Prompt users to reload immediately when a fresh Netlify deployment is detected
export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `Archery Shoot Finder has been updated. ` +
    `Would you like to reload to display the latest shoots?`
  )

  if (answer === true) {
    window.location.reload()
  }
}

// === Snipcart v2 Lifecycle Handler ===
const initSnipcartHandler = () => {
  if (!window.Snipcart) return

  // EVENT HOOK: Triggers instantly when a Venue successfully logs in
  window.Snipcart.subscribe("authentication.success", user => {
    if (window.Snipcart.api && window.Snipcart.api.modal) {
      window.Snipcart.api.modal.close()
    }

    if (window.location.hash.includes("!/")) {
      window.history.replaceState("", document.title, window.location.pathname)
    }

    window.dispatchEvent(
      new CustomEvent("snipcart:user-logged-in", {
        detail: { email: user.email },
      })
    )

    /*
      FIXED: Updated destination route path string from "/portal/admin-dashboard" directly to "/portal/"
    */
    setTimeout(() => {
      window.location.href = "/portal/"
    }, 100)
  })

  // EVENT HOOK: Triggers when an order/subscription checkout completes
  window.Snipcart.subscribe("order.completed", async data => {
    if (window.Snipcart.api && window.Snipcart.api.modal) {
      window.Snipcart.api.modal.close()
    }

    const companyName =
      data.billingAddress?.company || data.billingAddress?.name || "Venue"
    const email = data.email

    try {
      await fetch("https://github.com", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GATSBY_GITHUB_PAT || ""}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: "cms_create_venue_on_payment",
          client_payload: { companyName, email, snipcartOrderId: data.token },
        }),
      })
    } catch (err) {
      console.error("Failed to forward payload to repository pipeline", err)
    }

    window.dispatchEvent(
      new CustomEvent("snipcart:user-logged-in", {
        detail: { companyName, email },
      })
    )

    /*
      FIXED: Updated payment completion route path string directly to "/portal/" as well
    */
    setTimeout(() => {
      window.location.href = "/portal/"
    }, 100)
  })

  // CLEANER HOOK: Catches manual modal close actions
  window.Snipcart.subscribe("page.closed", () => {
    if (window.location.hash.includes("!/")) {
      const cleanPath = window.location.pathname
      navigate(cleanPath, { replace: true })
      window.location.reload()
    }
  })
}

// Check if Snipcart is loaded or wire up the browser event listener
if (window.Snipcart?.ready) {
  initSnipcartHandler()
} else {
  // FIXED: Simplified bracket syntax block initialization safely
  document.addEventListener("snipcart.ready", initSnipcartHandler, {
    once: true,
  })
}
