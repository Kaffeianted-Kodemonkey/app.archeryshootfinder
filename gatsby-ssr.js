import React from "react"

import { SearchProvider } from "./src/components/context/SearchContext"

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
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

// Wrap root element with SearchProvider for SSR
export const wrapRootElement = ({ element }) => (
  <SearchProvider>{element}</SearchProvider>
)