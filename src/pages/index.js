// This is the main page that runs the whole app.
import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import Tabs from "../components/list/tabs"
import {
  getDateBoundaries,
  filterByDateRange,
  filterByDistance,
} from "../utils/shootFilters"

const IndexPage = ({ data }) => {
  const [selectedVenueId, setSelectedVenueId] = useState(null)
  const Shoots = data.allShootsJson.nodes
  const Venues = data.allVenuesJson.nodes
  const [view, setView] = useState("map")

  // Local state for filtered shoots, location, tab (decoupled from SearchContext)
  const [filteredCurrentShoots, setFilteredCurrentShoots] = useState([])
  const [filteredUpcomingShoots, setFilteredUpcomingShoots] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [activeTab, setActiveTab] = useState("current")

  // URL param handling (local)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const activeTabParam = params.get("activeTab")

    if (activeTabParam) setActiveTab(activeTabParam)
  }, [])

  const [selectedShootForMap, setSelectedShootForMap] = useState(null)

  // Just calculate the effectiveLocation
  const shootsWithVenues = useMemo(() => {
    return Shoots.map(shoot => {
      // Use the venue object Gatsby already attached to the shoot
      const venue = shoot.venue
      const effectiveLocation =
        shoot.useVenueLocation !== false && venue?.location
          ? venue.location
          : shoot.shootLocation || venue?.location

      return {
        ...shoot,
        // No need to overwrite venue, it's already there from GraphQL!
        effectiveLocation,
      }
    })
  }, [Shoots])

  const nonDestinationShoots = useMemo(
    () => shootsWithVenues.filter(shoot => shoot.isDestination != true),
    [shootsWithVenues]
  )

  const handleSelectShoot = shoot => {
    setSelectedShootForMap(shoot)
  }

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

  // Synchronous initial fallback: Set current to upcoming if empty
  const initialCurrentShoots = useMemo(() => {
    return computedCurrentShoots.length > 0
      ? computedCurrentShoots
      : computedUpcomingShoots
  }, [computedCurrentShoots, computedUpcomingShoots])

  // Geolocation for preload (current/upcoming only)
  useEffect(() => {
    // Initial setup: Use utils for consistency
    setFilteredCurrentShoots(computedCurrentShoots)
    setFilteredUpcomingShoots(computedUpcomingShoots)
    setActiveTab("current") // Local setter

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

          // Apply distance filter + date sort for each tab
          let geoCurrent = computedCurrentShoots
          let outside = false

          if (computedCurrentShoots.length === 0) {
            const filteredUpcoming = filterByDistance(
              computedUpcomingShoots,
              loc,
              50,
              computedUpcomingShoots
            )
            // Detect fallback → nothing was within 50 miles
            if (filteredUpcoming.length === computedUpcomingShoots.length) {
              outside = true
            }
            geoCurrent = filteredUpcoming
          } else {
            const filteredCurrent = filterByDistance(
              computedCurrentShoots,
              loc,
              50,
              computedCurrentShoots
            )
            if (filteredCurrent.length === computedCurrentShoots.length) {
              outside = true
            }
            geoCurrent = filteredCurrent
          }

          setFilteredCurrentShoots(geoCurrent)
          // setIsOutside50Miles(outside)

          const geoUpcoming = filterByDistance(
            computedUpcomingShoots,
            loc,
            50,
            computedUpcomingShoots
          )
          setFilteredUpcomingShoots(geoUpcoming)
        },
        error => {
          console.warn("Geolocation error", error)
        }
      )
    }
    getUserLocation()
  }, [computedCurrentShoots, computedUpcomingShoots /* , allPublishedShoots */])

  const venueShootCounts = useMemo(() => {
    return Venues.reduce((acc, venue) => {
      // venue.hostedShoots is now an array of objects, not strings
      const validShoots = (venue.hostedShoots || []).filter(shoot => {
        const shootDate = new Date(shoot.date)
        return shootDate > now
      })

      acc[venue.id] = validShoots.length
      return acc
    }, {})
  }, [Venues, now])

  // Map view props (dynamic based on activeTab)
  const mapProps = useMemo(() => {
    let shootsToPass = []
    let venuesToPass = []
    if (activeTab === "venue") {
      venuesToPass = Venues
    } else if (activeTab === "current") {
      shootsToPass = filteredCurrentShoots
    } else if (activeTab === "upcoming") {
      shootsToPass = filteredUpcomingShoots
    } else {
      // Fallback to combined shoots (for 'current' default)
      shootsToPass =
        filteredCurrentShoots.length > 0
          ? filteredCurrentShoots
          : [...filteredCurrentShoots, ...filteredUpcomingShoots]
    }
    return {
      shoots: shootsToPass,
      venues: venuesToPass,
      userLocation: userLocation,
      activeTab: activeTab,
      selectedShoot: selectedShootForMap,
      onClearSelection: () => setSelectedShootForMap(null),
    }
  }, [
    activeTab,
    filteredCurrentShoots,
    filteredUpcomingShoots,
    Venues,
    userLocation,
    selectedShootForMap,
  ])

  const displayCurrentShoots = useMemo(() => {
    if (selectedVenueId === null) return filteredCurrentShoots
    return filteredCurrentShoots.filter(
      shoot => shoot.venueId === selectedVenueId
    )
  }, [filteredCurrentShoots, selectedVenueId])

  const displayUpcomingShoots = useMemo(() => {
    if (selectedVenueId === null) return filteredUpcomingShoots
    return filteredUpcomingShoots.filter(
      shoot => shoot.venueId === selectedVenueId
    )
  }, [filteredUpcomingShoots, selectedVenueId])

  // List props with local data (no SearchContext)
  const listProps = useMemo(() => {
    const isVenueSelected = selectedVenueId !== null

    return {
      shoots: shootsWithVenues,
      venues: Venues,
      // Headers always show global counts (never venue-filtered)
      currentShoots: filteredCurrentShoots,
      upcomingShoots: filteredUpcomingShoots,
      // Display conditionally uses venue-filtered or normal shoots
      displayCurrentShoots: isVenueSelected
        ? displayCurrentShoots
        : filteredCurrentShoots,
      displayUpcomingShoots: isVenueSelected
        ? displayUpcomingShoots
        : filteredUpcomingShoots,
      userLocation: userLocation,
      activeTab,
      setActiveTab,
      selectedVenueId,
      setSelectedVenueId,
      onSelectShoot: handleSelectShoot,
    }
  }, [
    shootsWithVenues,
    Venues,
    filteredCurrentShoots,
    filteredUpcomingShoots,
    displayCurrentShoots,
    displayUpcomingShoots,
    userLocation,
    activeTab,
    setActiveTab,
    selectedVenueId,
    setSelectedVenueId,
  ])

  const listViewContent = <Tabs {...listProps} />

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

IndexPage.propTypes = {
  data: PropTypes.shape({
    allShootsJson: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
    allVenuesJson: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }).isRequired,
}

export const Head = () => <Seo title="Home" />

export default IndexPage

export const query = graphql`
  query AllData {
    # 1. Fetch the Venues
    allVenuesJson {
      nodes {
        id
        venueId
        slug
        name
        description
        venueType
        subscription
        icon
        iconColor
        location {
          address
          city
          state
          zip
          lat
          lng
        }
        contact {
          phone
          email
          website
          facebook
          instagram
        }
        facilities
        amenities
        equipmentAllowed
        customEquipmentRules
        hours {
          day
          open
          closed
        }
        membership
        hostedShoots {
          id
          # name
          date
          # shootFormat
        }
        imageUrl
        isClaimed
      }
    }

    # 2. ADD THIS: Fetch the Shoots
    allShootsJson {
      nodes {
        id
        shootId
        name
        description
        date
        endDate
        time
        amenities
        useVenueLocation
        shootLocation {
          lat
          lng
          city
          state
        }
        shootFormat
        shootClass
        terrain
        bowTypes
        skillLevel
        entryFee
        pricing {
          tier
          note
          options {
            days
            cost
            currency
          }
        }
        prizes
        isDestination
        isVerified
        isRegistration
        registrationUrl
        # Link back to venue for your "shootsWithVenues" logic
        venueId
        venue {
          venueId
          isClaimed
          name
          slug
          contact {
            phone
            email
          }
          location {
            address
            city
            state
            lat
            lng
          }
          subscription
        }
      }
    }
  }
`
