// gatsby-ssr.js (Must be located at the root of your project)
import React from "react"

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  setPostBodyComponents([
    // The pinned Snipcart v2 Core Engine fueled by your .env production key
    <script
      key="snipcart-js"
      src="https://snipcart.com"
      data-api-key={process.env.GATSBY_SNIPCART_API_KEY}
      id="snipcart"
    />,
  ])
  // 1. Inject assets that belong inside the <head> tags
  setHeadComponents([
    // Theme color for PWA address bar + splash screen
    <meta name="theme-color" content="#C2410C" key="theme-color" />,

    // Icon Stylesheet
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      key="bootstrap-icons"
    />,

    // Snipcart v2 Core Layout Styling
    <link
      key="snipcart-css"
      href="https://snipcart.com"
      rel="stylesheet"
      type="text/css"
    />,

    // Bootstrap JS Framework Bundle
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
      crossOrigin="anonymous"
      key="bootstrap-js"
    ></script>,
  ])

  // 2. Inject checkout script engines right before the closing </body> tag
  setPostBodyComponents([
    // jQuery dependency pinned for Snipcart v2
    <script
      key="jquery"
      src="https://jquery.com"
      integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
      crossOrigin="anonymous"
    />,
  ])
}
