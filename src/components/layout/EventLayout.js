import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { navigate } from "gatsby"
import Layout from "./Layout"
import EventTabs from "../list/EventTabs"

/** True if shoot is still relevant from today forward (not fully in the past). */
function isFromTodayOnward(shoot, todayStart) {
  const end = shoot.endDate ? new Date(shoot.endDate) : new Date(shoot.date)
  if (Number.isNaN(end.getTime())) return false
  end.setHours(23, 59, 59, 999)
  return end >= todayStart
}

const EventLayout = ({ masterRawShoots = [], location, children }) => {
  const [view, setView] = useState("map")
  const [eventListResults, setEventListResults] = useState(null)
  const [destinationListResults, setDestinationListResults] = useState(null)
  const [associationListResults, setAssociationListResults] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [activeTab, setActiveTab] = useState("events")

  // URL ?activeTab=destination|association|events
  useEffect(() => {
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : location?.search || ""
    )
    const tab = params.get("activeTab")
    if (tab === "destination" || tab === "association" || tab === "events") {
      setActiveTab(tab)
    } else if (tab === "current" || tab === "upcoming") {
      // legacy URLs → main Events tab
      setActiveTab("events")
    }
  }, [location])

  const URLSearchQuery = useMemo(() => {
    if (!location?.search) return ""
    const params = new URLSearchParams(location.search)
    return params.get("search")?.toLowerCase().trim() || ""
  }, [location])

  const todayStart = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  // Attach effectiveLocation once
  const shootsWithVenues = useMemo(() => {
    return masterRawShoots.map(shoot => {
      const venue = shoot.venue
      const effectiveLocation =
        shoot.useVenueLocation !== false && venue?.location
          ? venue.location
          : shoot.location || shoot.shootLocation || venue?.location

      return {
        ...shoot,
        effectiveLocation,
      }
    })
  }, [masterRawShoots])

  // Main Events tab: not destination, from today onward
  const computedEventsShoots = useMemo(() => {
    return shootsWithVenues.filter(
      s => !s.isDestination && isFromTodayOnward(s, todayStart)
    )
  }, [shootsWithVenues, todayStart])

  const computedDestinationShoots = useMemo(
    () =>
      shootsWithVenues.filter(
        s =>
          (s.isDestination === true || s.isDestination === "true") &&
          isFromTodayOnward(s, todayStart)
      ),
    [shootsWithVenues, todayStart]
  )

  const computedAssociationsShoots = useMemo(() => {
    return shootsWithVenues.filter(shoot => {
      if (!isFromTodayOnward(shoot, todayStart)) return false
      const type = shoot.associationType
      return Array.isArray(type) ? type.length > 0 : !!type
    })
  }, [shootsWithVenues, todayStart])

  // Capture device location for optional distance filtering and distance labels.
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      position =>
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      error => console.warn("Geolocation unavailable:", error)
    )
  }, [])

  // Optional ?search= on main Events list
  const displayEventsShoots = useMemo(() => {
    let result = computedEventsShoots
    if (URLSearchQuery) {
      const q = URLSearchQuery.replace(/,/g, "").replace(/\s+/g, " ").toLowerCase()
      result = result.filter(shoot =>
        [
          shoot.sname,
          shoot.venue?.vname,
          shoot.effectiveLocation?.address,
          shoot.effectiveLocation?.city,
          shoot.effectiveLocation?.state,
          shoot.effectiveLocation?.zip,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
    }
    return result
  }, [computedEventsShoots, URLSearchQuery])

  const handleTabChangeWithReset = tab => {
    setActiveTab(tab)
    if (URLSearchQuery) navigate("/events")
  }

  const activeMapShoots = useMemo(() => {
    switch (activeTab) {
      case "destination":
        return destinationListResults || computedDestinationShoots
      case "association":
        return associationListResults || computedAssociationsShoots
      case "events":
      default:
        return eventListResults || displayEventsShoots
    }
  }, [
    activeTab,
    displayEventsShoots,
    eventListResults,
    computedDestinationShoots,
    computedAssociationsShoots,
    destinationListResults,
    associationListResults,
  ])

  const mapProps = useMemo(
    () => ({
      shoots: activeMapShoots,
      venues: [],
      userLocation,
      activeTab,
    }),
    [activeTab, activeMapShoots, userLocation]
  )

  const listProps = useMemo(
    () => ({
      eventsShoots: displayEventsShoots,
      allEventsShoots: URLSearchQuery ? displayEventsShoots : computedEventsShoots,
      destinationShoots: computedDestinationShoots,
      allDestinationShoots: computedDestinationShoots,
      associationsShoots: computedAssociationsShoots,
      allAssociationShoots: computedAssociationsShoots,
      userLocation,
      activeTab,
      setActiveTab: handleTabChangeWithReset,
      onEventResultsChange: setEventListResults,
      onDestinationResultsChange: setDestinationListResults,
      onAssociationResultsChange: setAssociationListResults,
    }),
    [
      displayEventsShoots,
      computedEventsShoots,
      URLSearchQuery,
      computedDestinationShoots,
      computedAssociationsShoots,
      userLocation,
      activeTab,
    ]
  )

  return (
    <Layout
      view={view}
      setView={setView}
      mapProps={mapProps}
      listProps={listProps}
      listViewContent={<EventTabs {...listProps} />}
    >
      {children}
    </Layout>
  )
}

export default EventLayout
