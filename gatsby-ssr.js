// gatsby-ssr.js
import React from "react"

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  setHeadComponents([
    <meta name="theme-color" content="#C2410C" key="theme-color" />,
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      key="bootstrap-icons"
    />,
    // Snipcart v2 CSS
    <link
      key="snipcart-css"
      href="https://cdn.snipcart.com/themes/2.0/base/snipcart.min.css"
      rel="stylesheet"
      type="text/css"
    />,
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
      crossOrigin="anonymous"
      key="bootstrap-js"
    />,
  ])

  setPostBodyComponents([
    // jQuery (required for Snipcart v2)
    <script
      key="jquery"
      src="https://code.jquery.com/jquery-3.4.1.min.js"
      integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
      crossOrigin="anonymous"
    />,
    // Snipcart v2 (correct CDN + API key from .env)
    <script
      key="snipcart-js"
      src="https://cdn.snipcart.com/scripts/2.0/snipcart.js"
      data-api-key="ZDY2ZThjZmMtYTQzYS00YTVjLWFhMTQtYTMyOTE3NWEyNmJkNjM2ODAyNjEzODcxNDY5NTQ3"
      id="snipcart"
    />,
  ])
}
