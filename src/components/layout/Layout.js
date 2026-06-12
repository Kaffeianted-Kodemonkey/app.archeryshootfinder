// src/components/layout/Layout.js
import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Navbar from "./Navbar"
import MapComponent from "../map/map"
import Footer from "./Footer"
import OfflineIndicator from "../OfflineIndicator" // ← ADD THIS

const Layout = ({
  children,
  view,
  setView,
  mapProps,
  listProps,
  listViewContent,
}) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  const mainClass = "container-fluid gx-0 p-0 flex-grow-1 pb-3"
  const finalMainClass = view === "map" ? `${mainClass} map-view` : mainClass

  return (
    <>
      <OfflineIndicator />{" "}
      {/* ← ADD THIS (fixed-top, auto-offsets below navbar) */}
      <Navbar
        siteTitle={data.site.siteMetadata?.title || `Title`}
        siteDesc={data.site.siteMetadata?.description || `Description`}
        view={view}
        setView={setView}
      />
      <main className={finalMainClass}>
        {/* ... rest of the component stays exactly the same ... */}
        {view === "map" && mapProps && listProps ? (
          <div className="d-flex flex-column h-100">
            <div
              className="row g-0 sticky-top shadow-sm"
              style={{ zIndex: 1020, top: "56px" }}
            >
              <div
                className="col bg-light border-bottom position-relative"
                style={{
                  height: "35vh",
                  maxHeight: "400px",
                  minHeight: "250px",
                }}
              >
                <MapComponent {...mapProps} />
              </div>
            </div>

            {/* Sponsor/Influencer Banner - Placeholder */}
            <div className="row g-0">
              <div className="col bannertext-white text-center py-3">
                <p className="mb-0 small">
                  <i className="bi bi-star-fill me-1"></i>
                  Sponsor &amp; Influencer Banner Area
                  <span className="ms-2 text-white-50">(Coming Soon)</span>
                </p>
              </div>
            </div>

            <div className="row g-0 flex-grow-0 mt-5 pt-5">
              <div className="col /* bg-white */ overflow-auto">
                {listViewContent}{" "}
                {/* Use prop instead of direct <Tabs {...listProps} /> */}
              </div>
            </div>
          </div>
        ) : view === "list" && listViewContent ? (
          listViewContent
        ) : (
          children
        )}
      </main>
      <Footer />
    </>
  )
}

export default Layout
