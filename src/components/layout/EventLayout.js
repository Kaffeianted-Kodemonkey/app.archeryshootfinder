import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import Layout from "./Layout"
import EventListing from "../list/EventTabs"
import { getEffectiveShootLocation } from "../../utils/shootFilters"

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
  const [userLocation, setUserLocation] = useState(null)
  const [mode, setMode] = useState("events")
  const [selectedShoot, setSelectedShoot] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(location?.search || "")
    const requestedMode = params.get("mode") || params.get("activeTab")
    setMode(requestedMode === "destination" ? "destination" : "events")
  }, [location])

  const URLSearchQuery = useMemo(() => {
    if (!location?.search) return ""
    return new URLSearchParams(location.search).get("search")?.toLowerCase().trim() || ""
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

  const shootsWithVenues = useMemo(
    () => masterRawShoots
      .filter(shoot => {
        if (!URLVenueId) return true
        const shootVenueId = shoot.venue?.venueId || shoot.venueId
        return String(shootVenueId) === String(URLVenueId)
      })
      .map(shoot => ({
        ...shoot,
        effectiveLocation: getEffectiveShootLocation(shoot),
      })),
    [masterRawShoots, URLVenueId]
  )

  const eligibleShoots = useMemo(
    () => shootsWithVenues.filter(shoot => isFromTodayOnward(shoot, todayStart)),
    [shootsWithVenues, todayStart]
  )

  const computedEventsShoots = useMemo(
    () => eligibleShoots.filter(shoot => shoot.isDestination !== true && shoot.isDestination !== "true"),
    [eligibleShoots]
  )

  const computedDestinationShoots = useMemo(
    () => eligibleShoots.filter(shoot => shoot.isDestination === true || shoot.isDestination === "true"),
    [eligibleShoots]
  )

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      position => setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }),
      error => console.warn("Geolocation unavailable:", error)
    )
  }, [])

  const filterBySearch = shoots => {
    if (!URLSearchQuery) return shoots
    const q = URLSearchQuery.replace(/,/g, "").replace(/\s+/g, " ").toLowerCase()
    return shoots.filter(shoot => [
      shoot.group?.groupName,
      shoot.seriesName,
      shoot.sname,
      shoot.venue?.vname,
      shoot.effectiveLocation?.address,
      shoot.effectiveLocation?.city,
      shoot.effectiveLocation?.state,
      shoot.effectiveLocation?.zip,
    ].join(" ").toLowerCase().includes(q))
  }

  const displayEventsShoots = useMemo(
    () => filterBySearch(computedEventsShoots),
    [computedEventsShoots, URLSearchQuery]
  )
  const displayDestinationShoots = useMemo(
    () => filterBySearch(computedDestinationShoots),
    [computedDestinationShoots, URLSearchQuery]
  )

  const visibleShoots = mode === "destination" ? displayDestinationShoots : displayEventsShoots
  const activeMapShoots = mode === "destination"
    ? destinationListResults || visibleShoots
    : eventListResults || visibleShoots

  const mapProps = useMemo(() => ({
    shoots: activeMapShoots,
    venues: [],
    userLocation,
    activeTab: mode,
    selectedShoot,
  }), [mode, activeMapShoots, userLocation, selectedShoot])

  const listProps = {
    mode,
    shoots: visibleShoots,
    allShoots: mode === "destination"
      ? URLSearchQuery ? displayDestinationShoots : computedDestinationShoots
      : URLSearchQuery ? displayEventsShoots : computedEventsShoots,
    userLocation,
    onVisibleShootsChange: mode === "destination"
      ? setDestinationListResults
      : setEventListResults,
    onSelectShoot: shoot => {
      setSelectedShoot({ ...shoot })
      setView("map")
    },
  }

  return (
    <Layout
      view={view}
      setView={setView}
      mapProps={mapProps}
      listProps={listProps}
      listViewContent={<EventListing {...listProps} />}
    >
      {children}
    </Layout>
  )
}

export default EventLayout
