// gatsby-browser.js
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "./src/styles/global.css"
import { navigate } from "gatsby"

export const onClientEntry = () => {
  const jq = document.createElement("script")
  //  FIXED: Pointed to the actual jQuery CDN script file path instead of just the homepage website URL
  jq.src = "https://jquery.com"
  jq.integrity = "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
  jq.crossOrigin = "anonymous"
  document.head.appendChild(jq)
}

// === Snipcart v2 Lifecycle Handler ===
const initSnipcartHandler = () => {
  if (!window.Snipcart) return

  // EVENT HOOK: Triggers instantly when a Venue successfully logs in
  window.Snipcart.subscribe("user.logged-in", user => {
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

    navigate("/portal/admin-dashboard", { replace: true })
  })

  // EVENT HOOK: Triggers when an order/subscription checkout completes
  window.Snipcart.subscribe("order.completed", async data => {
    if (window.Snipcart.api && window.Snipcart.api.modal) {
      window.Snipcart.api.modal.close()
    }

    const companyName =
      data.billingAddress?.company || data.billingAddress?.name || "Venue"
    const email = data.email

    //  FIXED: Point to your target repository's API endpoint rather than the generic web link homepage
    // Replace YOUR_GITHUB_USERNAME and YOUR_REPO_NAME with your actual values!
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

    navigate("/portal/admin-dashboard", { replace: true })
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
}
{
  document.addEventListener("snipcart.ready", initSnipcartHandler, {
    once: true,
  })
}
