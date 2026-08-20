// src/components/layout/Layout.js
import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Navbar from "./Navbar"
import MapComponent from "../map/map"
import Footer from "./Footer"
import OfflineIndicator from "../OfflineIndicator"

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

  // Force the layout container to lock to the full viewport size on map view
  const mainClass = "container-fluid gx-0 p-0 flex-grow-1 pb-3"
  const isMapView = view === "map" && mapProps && listProps
  const finalMainClass = isMapView
    ? `${mainClass} map-view vh-100 d-flex flex-column overflow-hidden`
    : mainClass

  return (
    <>
      <OfflineIndicator />
      <Navbar
        siteTitle={data.site.siteMetadata?.title || `Title`}
        siteDesc={data.site.siteMetadata?.description || `Description`}
        view={view}
        setView={setView}
      />
      <main className={finalMainClass}>
        {isMapView ? (
          <>
            {/* 1. FIXED TOP ELEMENT: Map Row (Stays static, no scrolling) */}
            <div className="row g-0 flex-shrink-0">
              <div
                className="col bg-light border-bottom"
                style={{
                  height: "35vh",
                  maxHeight: "400px",
                  minHeight: "250px",
                }}
              >
                <MapComponent {...mapProps} />
              </div>
            </div>

            {/* 2. SCROLLABLE CONTAINER: Banner and Tabs content slide underneath here */}
            <div className="flex-grow-1 overflow-auto bg-white">
              {/* Marketing Banner */}
              <div className="row g-0">
                <div
                  className="col banner d-flex align-items-center justify-content-center py-5 fw-bold text-center"
                >
                  <p className="pt-2 mb-0 d-flex align-items-center justify-content-center flex-wrap gap-2">
                    <i
                      className="bi bi-star-fill"
                      style={{ color: "red" }}
                    ></i>
                    <span>Marketing Banner </span>
                    <span
                      className="px-3 py-1 rounded-pill ms-2"
                      style={{
                        backgroundColor: "#d4af37",
                        color: "#2e4a2e",
                        fontSize: "0.85rem",
                      }}
                    >
                      COMING SOON
                    </span>
                  </p>
                </div>
              </div>

              {/* List View Tabs Content */}
              <div className="row g-0">
                <div className="col">{listViewContent}</div>
              </div>
            </div>
          </>
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
