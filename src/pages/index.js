import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import Tabs from "../components/list/tabs"
import { getDateBoundaries, filterByDateRange, filterByDistance } from "../utils/shootFilters"
import { getDistance } from "../utils/distance"
import venuesData from '../data/venues.json'; //Call the json file.

const IndexPage = ({ data }) => {
  const rawShoots = data.allShootsJson.nodes
  const rawVenues = data.allVenuesJson.nodes
  const [view, setView] = useState("map")

  // Local state for filtered shoots, location, tab (decoupled from SearchContext)
  const [filteredCurrentShoots, setFilteredCurrentShoots] = useState([]);
  const [filteredUpcomingShoots, setFilteredUpcomingShoots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  // URL param handling (local)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const activeTabParam = params.get('activeTab')

    if (activeTabParam) setActiveTab(activeTabParam)
  }, [])

  // Join venue data to each shoot for full access in components
  const shootsWithVenues = useMemo(() => rawShoots.map(shoot => {
    const venue = venuesData.find(v => v.id === shoot.venueId) || null;
    const effectiveLocation = (shoot.useVenueLocation !== false && venue?.location)
      ? venue.location
      : (shoot.shootLocation || venue?.location);  // Fallback to venue if no custom
    return {
      ...shoot,
      venue,
      effectiveLocation
    };
  }), [rawShoots, rawVenues])

  // Date boundaries using util
  const { now, twentyOneDaysFromNow } = useMemo(() => getDateBoundaries(), [])

  // Computed current/upcoming using utils (date range filter + sort)
  const computedCurrentShoots = useMemo(() =>
    filterByDateRange(shootsWithVenues, now, twentyOneDaysFromNow),
    [shootsWithVenues, now, twentyOneDaysFromNow]
  )

  const computedUpcomingShoots = useMemo(() =>
    filterByDateRange(shootsWithVenues, twentyOneDaysFromNow, new Date('2100-01-01')),
    [shootsWithVenues, twentyOneDaysFromNow]
  )

  // All published shoots (fallback)
  const allPublishedShoots = useMemo(() =>
    filterByDateRange(shootsWithVenues, new Date(0), new Date('2100-01-01')),
    [shootsWithVenues]
  )

  // Synchronous initial fallback: Set current to upcoming if empty
  const initialCurrentShoots = useMemo(() => {
    return computedCurrentShoots.length > 0 ? computedCurrentShoots : computedUpcomingShoots;
  }, [computedCurrentShoots, computedUpcomingShoots]);

  // Geolocation for preload (current/upcoming only)
  useEffect(() => {
    // Initial setup: Use utils for consistency
    setFilteredCurrentShoots(computedCurrentShoots);
    setFilteredUpcomingShoots(computedUpcomingShoots);
    setActiveTab('current'); // Local setter

    const getUserLocation = () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);


          // Apply distance filter + date sort for each tab
          let geoCurrent = computedCurrentShoots;
          if (computedCurrentShoots.length === 0) {
            // No current: fallback to upcoming (with distance)
            const filteredUpcoming = filterByDistance(computedUpcomingShoots, loc, 25, computedUpcomingShoots);
            geoCurrent = filteredUpcoming;
          } else {
            geoCurrent = filterByDistance(computedCurrentShoots, loc, 25, computedCurrentShoots);
          }
          setFilteredCurrentShoots(geoCurrent);

          const geoUpcoming = filterByDistance(computedUpcomingShoots, loc, 25, computedUpcomingShoots);
          setFilteredUpcomingShoots(geoUpcoming);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          // Fallback: keep initial full lists (already date-sorted)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    };
    getUserLocation();
  }, [computedCurrentShoots, computedUpcomingShoots, allPublishedShoots]);

  // Compute venueShootCounts using ID matching (verifies schema via venueId)
  const venueShootCounts = useMemo(() => rawVenues.reduce((acc, venue) => {
    const hostedIds = venue.hostedShoots || []
    const count = rawShoots.filter(shoot => hostedIds.includes(shoot.id) && new Date(shoot.date) > now && shoot.status === "published").length
    acc[venue.id] = count
    return acc
  }, {}), [rawVenues, rawShoots, now])

  // Simplified isFiltered: true if distance applied and results reduced
  const isFiltered = useMemo(() => {
    return !!userLocation && (filteredCurrentShoots.length < allPublishedShoots.length || filteredUpcomingShoots.length < computedUpcomingShoots.length);
  }, [userLocation, filteredCurrentShoots, filteredUpcomingShoots, allPublishedShoots, computedUpcomingShoots]);

  // Map view props (dynamic based on activeTab)
  const mapProps = useMemo(() => {
    let shootsToPass = [];
    let venuesToPass = [];
    if (activeTab === 'venue') {
      venuesToPass = rawVenues;
    } else if (activeTab === 'current') {
      shootsToPass = filteredCurrentShoots;
    } else if (activeTab === 'upcoming') {
      shootsToPass = filteredUpcomingShoots;
    } else {
      // Fallback to combined shoots (for 'current' default)
      shootsToPass = filteredCurrentShoots.length > 0 ? filteredCurrentShoots : [...filteredCurrentShoots, ...filteredUpcomingShoots];
    }
    return {
      shoots: shootsToPass,
      venues: venuesToPass,
      userLocation: userLocation,
      activeTab: activeTab  // New: Pass activeTab to map
    };
  }, [activeTab, filteredCurrentShoots, filteredUpcomingShoots, rawVenues, userLocation]);

  // List props with local data (no SearchContext)
  const listProps = useMemo(() => {
    return {
      shoots: shootsWithVenues,
      venues: rawVenues,
      currentShoots: filteredCurrentShoots,
      upcomingShoots: filteredUpcomingShoots,
      venueShootCounts,
      isFiltered,
      totalCount: shootsWithVenues.length + rawVenues.length,
      resetFilters: () => { }, // Placeholder; can implement local reset if needed
      userLocation: userLocation,
      activeTab,
      setActiveTab,
    };
  }, [shootsWithVenues, rawVenues, filteredCurrentShoots, filteredUpcomingShoots, venueShootCounts, isFiltered, userLocation, activeTab, setActiveTab])


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
  query DirectoryQuery {
allShootsJson(sort: { date: ASC }) {
      nodes {
        id
        slug
        name
        description
        date
        endDate
        time
        venueId
        useVenueLocation
        shootLocation {
          address
          city
          state
          zip
          lat
          lng
          country
        }
        unverified
        shootFormat
        shootClass
        bowTypes
        skillLevel
        terrain        
        pricing
        prizes
        amenities
        registrationRequired
        registrationUrl
        entryFee
        status
      }
    }
    allVenuesJson {
      nodes {
        id
        slug
        name
        description
        venueType
        tier
        icon
        iconColor
        location  # JSON
        contact  # JSON
        facilities
        equipment  # JSON
        hours  # JSON
        membership  # JSON
        hostedShoots  # [String] IDs
        imageUrl
        isClaimed
      }
    }
  }
`
