import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { navigate } from "gatsby"
import Layout from "./Layout"
import EventTabs from "../list/EventTabs"
import { getEffectiveShootLocation } from "../../utils/shootFilters"

/** True if shoot is still relevant from today forward (not fully in the past). */
function isFromTodayOnward(shoot, todayStart) {
  const end = shoot.endDate ? new Date(shoot.endDate) : new Date(shoot.date)
  if (Number.isNaN(end.getTime())) return false
  end.setHours(23, 59, 59, 999)
  return end >= todayStart
}

function isSeriesShoot(shoot) {
  return (
    Boolean(String(shoot.seriesName || "").trim()) ||
    shoot.isLeague === true ||
    shoot.isLeague === "true"
  )
}

const EventLayout = ({ masterRawShoots = [], location, children }) => {
  const [view, setView] = useState("map")
  const [eventListResults, setEventListResults] = useState(null)
  const [seriesListResults, setSeriesListResults] = useState(null)
  const [destinationListResults, setDestinationListResults] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [activeTab, setActiveTab] = useState("events")
  const [selectedShoot, setSelectedShoot] = useState(null)

  // URL ?activeTab=destination|events|series
  useEffect(() => {
    const params = new URLSearchParams(
      typeof window !== "undefined"
        ? window.location.search
        : location?.search || ""
    )
    const tab = params.get("activeTab")
    if (tab === "destination" || tab === "events" || tab === "series") {
      setActiveTab(tab)
    } else if (tab === "association") {
      setActiveTab("events")
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

  const URLVenueId = useMemo(() => {
    if (!location?.search) return ""
    return new URLSearchParams(location.search).get("venueId") || ""
  }, [location])

  const todayStart = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  // Attach effectiveLocation once
  const shootsWithVenues = useMemo(() => {
    return masterRawShoots
      .filter(shoot => {
        if (!URLVenueId) return true
        const shootVenueId = shoot.venue?.venueId || shoot.venueId
        return String(shootVenueId) === String(URLVenueId)
      })
      .map(shoot => {
        return {
          ...shoot,
          effectiveLocation: getEffectiveShootLocation(shoot),
        }
      })
  }, [masterRawShoots, URLVenueId])

  // Series names explicitly group separate shoots into one series card.
  const computedSeriesShoots = useMemo(
    () =>
      shootsWithVenues.filter(
        s => isSeriesShoot(s) && isFromTodayOnward(s, todayStart)
      ),
    [shootsWithVenues, todayStart]
  )

  // Main Events tab excludes destinations and shoots assigned to a series.
  const computedEventsShoots = useMemo(() => {
    return shootsWithVenues.filter(
      s =>
        !s.isDestination &&
        !isSeriesShoot(s) &&
        isFromTodayOnward(s, todayStart)
    )
  }, [shootsWithVenues, todayStart])

  const computedDestinationShoots = useMemo(
    () =>
      shootsWithVenues.filter(
        s =>
          (s.isDestination === true || s.isDestination === "true") &&
          !isSeriesShoot(s) &&
          isFromTodayOnward(s, todayStart)
      ),
    [shootsWithVenues, todayStart]
  )

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
      const q = URLSearchQuery.replace(/,/g, "")
        .replace(/\s+/g, " ")
        .toLowerCase()
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

  const displaySeriesShoots = useMemo(() => {
    if (!URLSearchQuery) return computedSeriesShoots
    const q = URLSearchQuery.replace(/,/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
    return computedSeriesShoots.filter(shoot =>
      [
        shoot.seriesName,
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
  }, [computedSeriesShoots, URLSearchQuery])

  const handleTabChangeWithReset = tab => {
    setActiveTab(tab)
    if (URLSearchQuery) navigate("/events")
  }

  const activeMapShoots = useMemo(() => {
    switch (activeTab) {
      case "destination":
        return destinationListResults || computedDestinationShoots
      case "series":
        return seriesListResults || displaySeriesShoots
      case "events":
      default:
        return eventListResults || displayEventsShoots
    }
  }, [
    activeTab,
    displayEventsShoots,
    displaySeriesShoots,
    eventListResults,
    seriesListResults,
    computedDestinationShoots,
    destinationListResults,
  ])

  const mapProps = useMemo(
    () => ({
      shoots: activeMapShoots,
      venues: [],
      userLocation,
      activeTab,
      selectedShoot,
    }),
    [activeTab, activeMapShoots, userLocation, selectedShoot]
  )

  const listProps = useMemo(
    () => ({
      eventsShoots: displayEventsShoots,
      allEventsShoots: URLSearchQuery
        ? displayEventsShoots
        : computedEventsShoots,
      destinationShoots: computedDestinationShoots,
      allDestinationShoots: computedDestinationShoots,
      seriesShoots: displaySeriesShoots,
      allSeriesShoots: URLSearchQuery
        ? displaySeriesShoots
        : computedSeriesShoots,
      userLocation,
      activeTab,
      setActiveTab: handleTabChangeWithReset,
      onEventResultsChange: setEventListResults,
      onSeriesResultsChange: setSeriesListResults,
      onDestinationResultsChange: setDestinationListResults,
      onSelectShoot: shoot => {
        setSelectedShoot({ ...shoot })
        setView("map")
      },
    }),
    [
      displayEventsShoots,
      displaySeriesShoots,
      computedEventsShoots,
      computedSeriesShoots,
      URLSearchQuery,
      computedDestinationShoots,
      userLocation,
      activeTab,
      setView,
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
