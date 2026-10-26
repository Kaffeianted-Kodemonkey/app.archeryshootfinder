// src/pages/venue.js
import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import Direct from "../components/list/VenueDirectory"

const Directory = ({ data, location }) => {
  const Venues = data.allVenuesJson.nodes
  const Shoots = data.allShootsJson.nodes
  const [view, setView] = useState("map")

  const [userLocation, setUserLocation] = useState(null)
  const [displayedVenues, setDisplayedVenues] = useState(Venues)

  useEffect(() => {
    if (location.hash) setView("list")
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
    if (view !== "list" || !location.hash) return
    const scrollTimeout = window.setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    }, 100)

    return () => window.clearTimeout(scrollTimeout)
  }, [view, location.hash])

  // Standardized browser coordinate lookup loop
  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      position => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(loc)
      },
      error => {
        console.warn("Geolocation skipped/failed:", error)
      }
    )
  }, [Venues])

  const listProps = useMemo(() => {
    return {
      venues: Venues,
      allVenues: Venues,
      userLocation: userLocation,
      shoots: Shoots,
      location: location, // Checks URL parameter contexts
      onFilterChange: setDisplayedVenues,
    }
  }, [Venues, Shoots, userLocation, location])

  const mapProps = useMemo(() => {
    return {
      shoots: [],
      venues: displayedVenues, // Markers react to user filtering strings
      userLocation: userLocation,
      activeTab: "venue",
    }
  }, [displayedVenues, userLocation])

  return (
    <Layout
      view={view}
      setView={setView}
      mapProps={view === "map" ? mapProps : null}
      listProps={listProps}
      listViewContent={<Direct {...listProps} />}
    >
      <Seo title="Venue Directory" />
    </Layout>
  )
}

Directory.propTypes = {
  data: PropTypes.shape({
    allVenuesJson: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
    allShootsJson: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }).isRequired,
  location: PropTypes.object.isRequired,
}

export const Head = () => <Seo title="Venue Directory" />

export default Directory

export const query = graphql`
  query VenuesPageData {
    allShootsJson {
      nodes {
        shootId
        sname
        venueId
        venue {
          venueId
        }
        date
        endDate
        isDestination
        isLeague
        seriesName
      }
    }
    allVenuesJson {
      nodes {
        venueId
        vname
        venueType
        isClaimed
        subscriptionPlan
        bio
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
          membershipUrl
        }
        isMembership
        hours {
          day
          open
          close
        }
        amenities
      }
    }
  }
`
