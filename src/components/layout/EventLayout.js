import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { navigate } from "gatsby"
import Layout from "./Layout"
import EventTabs from "../list/EventTabs"
import {
  getDateBoundaries,
  filterByDateRange,
  filterByDistance,
} from "../../utils/shootFilters"

const EventLayout = ({ masterRawShoots = [], location, children }) => {
  const [view, setView] = useState("map")

  // Application engine processing states
  const [filteredCurrentShoots, setFilteredCurrentShoots] = useState([])
  const [filteredUpcomingShoots, setFilteredUpcomingShoots] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [userState, setUserState] = useState(null)
  const [activeTab, setActiveTab] = useState("current")

  // Sync state tracking with incoming parameter URLs
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const activeTabParam = params.get("activeTab")
    if (activeTabParam) setActiveTab(activeTabParam)
  }, [location])

  const URLSearchQuery = useMemo(() => {
    if (!location?.search) return ""
    const params = new URLSearchParams(location.search)
    return params.get("search")?.toLowerCase().trim() || ""
  }, [location])

  // Normalization layer mapping fallback locations
  const shootsWithVenues = useMemo(() => {
    return masterRawShoots.map(shoot => {
      const venue = shoot.venue
      const effectiveLocation =
        shoot.useVenueLocation !== false && venue?.location
          ? venue.location
          : shoot.shootLocation || venue?.location

      return {
        ...shoot,
        effectiveLocation,
      }
    })
  }, [masterRawShoots])

  const nonDestinationShoots = useMemo(
    () => shootsWithVenues.filter(shoot => !shoot.isDestination),
    [shootsWithVenues]
  )

  const computedDestinationShoots = useMemo(
    () => shootsWithVenues.filter(shoot => shoot.isDestination === true),
    [shootsWithVenues]
  )

  // Chronological Calculations & Geolocation Watch Loops
  const { now, currentTab } = useMemo(() => getDateBoundaries(), [])

  const computedCurrentShoots = useMemo(
    () => filterByDateRange(nonDestinationShoots, now, currentTab),
    [nonDestinationShoots, now, currentTab]
  )

  const computedUpcomingShoots = useMemo(
    () => filterByDateRange(nonDestinationShoots, currentTab, new Date("2100-01-01")),
    [nonDestinationShoots, currentTab]
  )

  useEffect(() => {
    setFilteredCurrentShoots(computedCurrentShoots)
    setFilteredUpcomingShoots(computedUpcomingShoots)

    if (typeof window === "undefined" || !navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      position => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(loc)

        let geoCurrent = computedCurrentShoots
        let geoUpcoming = computedUpcomingShoots

        const applyStateFilter = list =>
          list.filter(s => {
            const l = s.useVenueLocation !== false && s.venue?.location ? s.venue.location : s.shootLocation
            return !userState || l?.state === userState
          })

        const distCurrent = filterByDistance(computedCurrentShoots, loc, 50, computedCurrentShoots)
        geoCurrent = distCurrent.length === computedCurrentShoots.length && userState ? applyStateFilter(computedCurrentShoots) : distCurrent

        const distUpcoming = filterByDistance(computedUpcomingShoots, loc, 50, computedUpcomingShoots)
        geoUpcoming = distUpcoming.length === computedUpcomingShoots.length && userState ? applyStateFilter(computedUpcomingShoots) : distUpcoming

        setFilteredCurrentShoots(geoCurrent)
        setFilteredUpcomingShoots(geoUpcoming)
      },
      error => console.warn("Proximity geocoding engine lookup trace down:", error)
    )
  }, [computedCurrentShoots, computedUpcomingShoots, userState])

  // Searching string text normalizer
  const displayCurrentShoots = useMemo(() => {
    let result = filteredCurrentShoots
    if (URLSearchQuery) {
      const q = URLSearchQuery.replace(/,/g, "").replace(/\s+/g, " ").toLowerCase()
      result = result.filter(shoot => {
        return [shoot.sname, shoot.venue?.vname, shoot.shootLocation?.city, shoot.shootLocation?.state].join(" ").toLowerCase().includes(q)
      })
    }
    return result
  }, [filteredCurrentShoots, URLSearchQuery])

  const displayUpcomingShoots = useMemo(() => {
    let result = filteredUpcomingShoots
    if (URLSearchQuery) {
      const q = URLSearchQuery.replace(/,/g, "").replace(/\s+/g, " ").toLowerCase()
      result = result.filter(shoot => {
        return [shoot.sname, shoot.venue?.vname, shoot.shootLocation?.city, shoot.shootLocation?.state].join(" ").toLowerCase().includes(q)
      })
    }
    return result
  }, [filteredUpcomingShoots, URLSearchQuery])

  const computedAssociationsShoots = useMemo(() => {
    return shootsWithVenues.filter(shoot => {
      const type = shoot.associationType
      return Array.isArray(type) ? type.length > 0 : !!type
    })
  }, [shootsWithVenues])

  const groupedAssociationsShoots = useMemo(() => {
    return computedAssociationsShoots.reduce((groups, shoot) => {
      const rawType = shoot.associationType
      const type = Array.isArray(rawType) ? (rawType[0] || "General") : (rawType || "General")
      if (!groups[type]) groups[type] = []
      groups[type].push(shoot)
      return groups
    }, {})
  }, [computedAssociationsShoots])

  const handleTabChangeWithReset = tab => {
    setActiveTab(tab)
    if (URLSearchQuery) navigate("/events")
  }

  const activeMapShoots = useMemo(() => {
    switch (activeTab) {
      case "upcoming": return displayUpcomingShoots
      case "destination": return computedDestinationShoots
      case "association": return Object.values(groupedAssociationsShoots).flat()
      case "current":
      default: return displayCurrentShoots
    }
  }, [activeTab, displayCurrentShoots, displayUpcomingShoots, computedDestinationShoots, groupedAssociationsShoots])

  const mapProps = useMemo(() => {
    return { shoots: activeMapShoots, venues: [], userLocation, activeTab }
  }, [activeTab, activeMapShoots, userLocation])

  const listProps = useMemo(() => {
    return {
      shoots: shootsWithVenues,
      venues: [],
      currentShoots: displayCurrentShoots,
      upcomingShoots: displayUpcomingShoots,
      displayCurrentShoots,
      displayUpcomingShoots,
      destinationShoots: computedDestinationShoots,
      associationsShoots: computedAssociationsShoots,
      userLocation,
      activeTab,
      setActiveTab: handleTabChangeWithReset,
    }
  }, [shootsWithVenues, displayCurrentShoots, displayUpcomingShoots, computedDestinationShoots, computedAssociationsShoots, userLocation, activeTab])

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
