// This is the main page that runs the whole app.
import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { graphql, navigate } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import EventTabs from "../components/list/EventTabs" // Verified implementation target
import {
  getDateBoundaries,
  filterByDateRange,
  filterByDistance,
} from "../utils/shootFilters"

const EventPage = ({ data, location }) => {
  const Shoots = data.allShootsJson.nodes
  const [view, setView] = useState("map")

  // Local state for filtered shoots, location, tab
  const [filteredCurrentShoots, setFilteredCurrentShoots] = useState([])
  const [filteredUpcomingShoots, setFilteredUpcomingShoots] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [userState, setUserState] = useState(null)
  const [showRegionalBanner, setShowRegionalBanner] = useState(false)
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

  const nonDestinationShoots = useMemo(
    () => shootsWithVenues.filter(shoot => !shoot.isDestination),
    [shootsWithVenues]
  )

  // Date boundaries using util
  const { now, currentTab } = useMemo(() => getDateBoundaries(), [])

  // Computed current/upcoming using utils (date range filter + sort)
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

  // Geolocation for preload (current/upcoming only)
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
          let showBanner = false

          const applyStateFilter = list =>
            list.filter(s => {
              const l =
                s.useVenueLocation !== false && s.venue?.location
                  ? s.venue.location
                  : s.shootLocation
              return !userState || l?.state === userState
            })

          // --- Current tab (Preloaded: 21 days + 50 mil radius) ---
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
            showBanner = true
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
            showBanner = true
            geoUpcoming = applyStateFilter(computedUpcomingShoots)
          } else {
            geoUpcoming = distUpcoming
          }

          setFilteredCurrentShoots(geoCurrent)
          setFilteredUpcomingShoots(geoUpcoming)
          setShowRegionalBanner(showBanner)
        },
        error => {
          console.warn("Geolocation error", error)
        }
      )
    }
    getUserLocation()
  }, [computedCurrentShoots, computedUpcomingShoots])

  // Filter preloaded results down strictly by the URL search parameters
  const displayCurrentShoots = useMemo(() => {
    let result = filteredCurrentShoots // Scoped directly to current preloaded tab state

    if (URLSearchQuery) {
      const q = URLSearchQuery.replace(/,/g, "")
        .replace(/\s+/g, " ")
        .toLowerCase()

      result = result.filter(shoot => {
        const text = [
          shoot.sname,
          shoot.venue?.vname,
          shoot.shootLocation?.city,
          shoot.shootLocation?.state,
          shoot.venue?.location?.city,
          shoot.venue?.location?.state,
        ]
          .join(" ")
          .toLowerCase()

        return text.includes(q)
      })
    }

    return result
  }, [filteredCurrentShoots, URLSearchQuery])

  // Custom fallback helper function to wipe filters clean on re-click
  const handleTabChangeWithReset = tab => {
    setActiveTab(tab)
    if (URLSearchQuery) {
      navigate("/events") // Removes parameters securely to load all pre-filters back up
    }
  }

  const mapProps = useMemo(() => {
    return {
      shoots:
        activeTab === "upcoming"
          ? filteredUpcomingShoots
          : displayCurrentShoots,
      venues: [],
      userLocation: userLocation,
      activeTab: activeTab,
    }
  }, [activeTab, displayCurrentShoots, filteredUpcomingShoots, userLocation])

  // List props matching EventTabs structural attributes cleanly
  const listProps = useMemo(() => {
    return {
      shoots: shootsWithVenues,
      venues: [],
      // Badges keep showing full global preloaded counts
      currentShoots: filteredCurrentShoots,
      upcomingShoots: filteredUpcomingShoots,
      // Target list render loops point to computed queries (safely registers 0 items)
      displayCurrentShoots: displayCurrentShoots,
      displayUpcomingShoots: filteredUpcomingShoots,
      userLocation: userLocation,
      activeTab,
      setActiveTab: handleTabChangeWithReset,
    }
  }, [
    shootsWithVenues,
    filteredCurrentShoots,
    filteredUpcomingShoots,
    displayCurrentShoots,
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
