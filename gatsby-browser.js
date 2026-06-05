/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js" // Add this for JS components (popper, dropdowns, offcanvas)
import "./src/styles/global.css"

// Wrap root element with SearchProvider
// export const wrapRootElement = ({ element }) => (
//   <SearchProvider>{element}</SearchProvider>
// );

// Service Worker for PWA (uncomment if needed)
/* if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} */
