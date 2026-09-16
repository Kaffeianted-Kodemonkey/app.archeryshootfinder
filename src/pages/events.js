// This is the main page that runs the whole app.
import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { graphql, navigate } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import EventTabs from "../components/list/EventTabs"
import {
  getDateBoundaries,
  filterByDateRange,
  filterByDistance,
} from "../utils/shootFilters"

const EventPage = ({ data, location }) => {
  const Shoots = data.allShootsJson.nodes
  const [view, setView] = useState("map")

  // Local state for filtered local shoots, location, tab
  const [filteredCurrentShoots, setFilteredCurrentShoots] = useState([])
  const [filteredUpcomingShoots, setFilteredUpcomingShoots] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [userState, setUserState] = useState(null)
  const [activeTab, setActiveTab] = useState("current")

  // URL param handling (local)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const activeTabParam = params.get("activeTab")

    if (activeTabParam) setActiveTab(activeTabParam)
  }, [])

  // Extract search from URL (?search=...)
  const URLSearchQuery = useMemo(() => {
    if (!location?.search) return ""
    const params = new URLSearchParams(location.search)
    return params.get("search")?.toLowerCase().trim() || ""
  }, [location])

  // Calculate the effectiveLocation
  const shootsWithVenues = useMemo(() => {
    return Shoots.map(shoot => {
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
  }, [Shoots])

  // Filter 1: Main Feed Filters (isDestination === false)
  const nonDestinationShoots = useMemo(
    () => shootsWithVenues.filter(shoot => !shoot.isDestination),
    [shootsWithVenues]
  )

  // Filter 2: Destination Feed (isDestination === true)
  const computedDestinationShoots = useMemo(
    () => shootsWithVenues.filter(shoot => shoot.isDestination === true),
    [shootsWithVenues]
  )

  // Filter 3: Association Feed (assocType !== null), grouped by assocType
  const groupedAssociationsShoots = useMemo(() => {
    const associationsOnly = shootsWithVenues.filter(
      shoot => shoot.assocType !== null && shoot.assocType !== undefined
    )

    // Grouping entries securely by assocType keys
    return associationsOnly.reduce((groups, shoot) => {
      const type = shoot.assocType
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(shoot)
      return groups;
    }, {})
  }, [shootsWithVenues])

  // Date boundaries using util
  const { now, currentTab } = useMemo(() => getDateBoundaries(), [])

  // Computed current/upcoming local ranges using utils
  const computedCurrentShoots = useMemo(
    () => filterByDateRange(nonDestinationShoots, now, currentTab),
    [nonDestinationShoots, now, currentTab]
  )

  const computedUpcomingShoots = useMemo(
    () =>
      filterByDateRange(
        nonDestinationShoots,
        currentTab,
        new Date("2100-01-01")
      ),
    [nonDestinationShoots, currentTab]
  )

  // Geolocation processing for Current/Upcoming local views
  useEffect(() => {
    setFilteredCurrentShoots(computedCurrentShoots)
    setFilteredUpcomingShoots(computedUpcomingShoots)
    setActiveTab("current")

    const getUserLocation = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported")
        return
      }
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
              const l =
                s.useVenueLocation !== false && s.venue?.location
                  ? s.venue.location
                  : s.shootLocation
              return !userState || l?.state === userState
            })

          // --- Current tab (Preloaded: 21 days + 50 mile radius) ---
          const distCurrent = filterByDistance(
            computedCurrentShoots,
            loc,
            50,
            computedCurrentShoots
          )
          if (
            distCurrent.length === computedCurrentShoots.length &&
            computedCurrentShoots.length > 0 &&
            userState
          ) {
            geoCurrent = applyStateFilter(computedCurrentShoots)
          } else {
            geoCurrent = distCurrent
          }

          // --- Upcoming tab ---
          const distUpcoming = filterByDistance(
            computedUpcomingShoots,
            loc,
            50,
            computedUpcomingShoots
          )
          if (
            distUpcoming.length === computedUpcomingShoots.length &&
            computedUpcomingShoots.length > 0 &&
            userState
          ) {
            geoUpcoming = applyStateFilter(computedUpcomingShoots)
          } else {
            geoUpcoming = distUpcoming
          }

          setFilteredCurrentShoots(geoCurrent)
          setFilteredUpcomingShoots(geoUpcoming)
        },
        error => {
          console.warn("Geolocation error", error)
        }
      )
    }
    getUserLocation()
  }, [computedCurrentShoots, computedUpcomingShoots])

  // Global search filtering mechanism applied down across local states
  const displayCurrentShoots = useMemo(() => {
    let result = filteredCurrentShoots

    if (URLSearchQuery) {
      const q = URLSearchQuery.replace(/,/g, "").replace(/\s+/g, " ").toLowerCase()
      result = result.filter(shoot => {
        const text = [
          shoot.sname,
          shoot.venue?.vname,
          shoot.shootLocation?.city,
          shoot.shootLocation?.state,
        ].join(" ").toLowerCase()
        return text.includes(q)
      })
    }
    return result
  }, [filteredCurrentShoots, URLSearchQuery])

  const handleTabChangeWithReset = tab => {
    setActiveTab(tab)
    if (URLSearchQuery) {
      navigate("/events")
    }
  }

  // Determine dynamic contextual data for map plots depending on current tab
  const activeMapShoots = useMemo(() => {
    switch (activeTab) {
      case "upcoming":
        return filteredUpcomingShoots
      case "destination":
        return computedDestinationShoots
      case "association":
        return Object.values(groupedAssociationsShoots).flat()
      case "current":
      default:
        return displayCurrentShoots
    }
  }, [activeTab, displayCurrentShoots, filteredUpcomingShoots, computedDestinationShoots, groupedAssociationsShoots])

  const mapProps = useMemo(() => {
    return {
      shoots: activeMapShoots,
      venues: [],
      userLocation: userLocation,
      activeTab: activeTab,
    }
  }, [activeTab, activeMapShoots, userLocation])

  // 1. Update this filter to check array string lengths safely
  const computedAssociationsShoots = useMemo(
    () => shootsWithVenues.filter(shoot => {
      const type = shoot.associationType
      return Array.isArray(type) ? type.length > 0 : !!type
    }),
    [shootsWithVenues]
  )

  // 2. Pass it under the plain flat array prop name "shoots" down inside your listProps hook
  const listProps = useMemo(() => {
    return {
      shoots: shootsWithVenues,
      venues: [],
      currentShoots: filteredCurrentShoots,
      upcomingShoots: filteredUpcomingShoots,
      displayCurrentShoots: displayCurrentShoots,
      displayUpcomingShoots: filteredUpcomingShoots,
      destinationShoots: computedDestinationShoots, // 🌟 FIXED: Pass destination data into the lists layout
      associationsShoots: computedAssociationsShoots,
      userLocation: userLocation,
      activeTab,
      setActiveTab: handleTabChangeWithReset,
    }
  }, [
    shootsWithVenues,
    filteredCurrentShoots,
    filteredUpcomingShoots,
    displayCurrentShoots,
    computedDestinationShoots, // 🌟 FIXED: track updates to destination results
    computedAssociationsShoots,
    userLocation,
    activeTab,
  ])

  const listViewContent = <EventTabs {...listProps} />

  return (
    <Layout
      view={view}
      setView={setView}
      mapProps={view === "map" ? mapProps : null}
      listProps={listProps}
      listViewContent={listViewContent}
    >
      <Seo title="Home" />
    </Layout>
  )
}

EventPage.propTypes = {
  data: PropTypes.shape({
    allShootsJson: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }).isRequired,
}

export const Head = () => <Seo title="Home" />

export default EventPage

export const query = graphql`
  query EventPageData {
    allShootsJson {
      nodes {
        shootId
        sname
        venueId
        date
        endDate
        shootFormat
        entryFee
        description
        isDestination
        associationType
        useVenueLocation
        shootLocation {
          address
          city
          state
          zip
          lat
          lng
        }
        venue {
          vname
          venueType
          isClaimed
          location {
            city
            state
            lat
            lng
          }
        }
      }
    }
    allVenuesJson {
      nodes {
        venueId
        vname
        slug
        venueType
        isClaimed
        subscriptionPlan
        location {
          city
          state
          lat
          lng
        }
      }
    }
  }
`
