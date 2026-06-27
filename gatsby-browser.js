// gatsby-browser.js
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "./src/styles/global.css"

export const onClientEntry = () => {
  const jq = document.createElement("script")
  jq.src = "https://code.jquery.com/jquery-3.4.1.min.js"
  jq.integrity = "sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  jq.crossOrigin = "anonymous"
  document.head.appendChild(jq)
}

// gatsby-browser.js  (near the bottom)
if (typeof window !== "undefined") {
  window.Snipcart = window.Snipcart || []
  window.Snipcart.subscribe("order.completed", data => {
    const companyName =
      data.billingAddress?.company || data.billingAddress?.name || "Venue"
    const email = data.email

    const user = {
      name: companyName,
      email,
      isLoggedIn: true,
      venue: { name: companyName, email },
    }
    localStorage.setItem("mock_venue_user", JSON.stringify(user))

    setTimeout(() => {
      window.location.href = "/portal"
    }, 500)
  })
}
