// src/components/layout/gatsby-ssr.js  (or root gatsby-ssr.js)
import React from "react"

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    // Theme color for PWA address bar + splash screen
    <meta name="theme-color" content="#C2410C" key="theme-color" />,

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      key="bootstrap-icons"
    />,
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
      crossOrigin="anonymous"
      key="bootstrap-js"
    ></script>,
  ])
}
