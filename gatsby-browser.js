// gatsby-browser.js
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "./src/styles/global.css"

export const onClientEntry = () => {
  // jQuery (required by older Snipcart v2)
  const jq = document.createElement("script")
  jq.src = "https://code.jquery.com/jquery-3.4.1.min.js"
  jq.integrity = "sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  jq.crossOrigin = "anonymous"
  document.head.appendChild(jq)
}
