import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import Layout from "./Layout"
import VenueDirectory from "../list/VenueDirectory"

const VenueLayout = ({ venues = [], shoots = [], location, children }) => {
  const [view, setView] = useState("map")
  const [userLocation, setUserLocation] = useState(null)
  const [displayedVenues, setDisplayedVenues] = useState(venues)

  useEffect(() => {
    if (location.hash) setView("map")
  }, [location.hash])

  useEffect(() => {
    const showOfflineDirectory = () => {
      if (!navigator.onLine) setView("list")
    }

    window.addEventListener("offline", showOfflineDirectory)
    showOfflineDirectory()

    return () => window.removeEventListener("offline", showOfflineDirectory)
  }, [])

  useEffect(() => {
    if (view !== "map" || !location.hash) return
    const scrollTimeout = window.setTimeout(() => {
      const target = document.getElementById(location.hash.slice(1))
      const scrollContainer = target?.closest(".flex-grow-1.overflow-auto")
      if (!target || !scrollContainer) return

      const containerTop = scrollContainer.getBoundingClientRect().top
      const targetTop = target.getBoundingClientRect().top
      scrollContainer.scrollTop += targetTop - containerTop
    }, 300)

    return () => window.clearTimeout(scrollTimeout)
  }, [view, location.hash])

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      position => setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }),
      error => console.warn("Geolocation skipped/failed:", error)
    )
  }, [venues])

  const listProps = useMemo(() => ({
    venues,
    allVenues: venues,
    userLocation,
    shoots,
    location,
    onFilterChange: setDisplayedVenues,
  }), [venues, shoots, userLocation, location])

  const mapProps = useMemo(() => ({
    shoots: [],
    venues: displayedVenues,
    userLocation,
    activeTab: "venue",
  }), [displayedVenues, userLocation])

  return (
    <Layout
      view={view}
      setView={setView}
      mapProps={view === "map" ? mapProps : null}
      listProps={listProps}
      listViewContent={<VenueDirectory {...listProps} />}
    >
      {children}
    </Layout>
  )
}

VenueLayout.propTypes = {
  venues: PropTypes.array,
  shoots: PropTypes.array,
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
}

export default VenueLayout
