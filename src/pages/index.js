// This is the main page that runs the whole app.  
import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import Tabs from "../components/list/tabs"
import { getDateBoundaries, filterByDateRange, filterByDistance } from "../utils/shootFilters"
//import { getDistance } from "../utils/distance"

const IndexPage = ({ data }) => {
  const Shoots = data.allShootsJson.nodes
  const Venues = data.allVenuesJson.nodes
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

  // Just calculate the effectiveLocation
  const shootsWithVenues = useMemo(() => {
    return Shoots.map(shoot => {
      // Use the venue object Gatsby already attached to the shoot
      const venue = shoot.venue;

      const effectiveLocation = (shoot.useVenueLocation !== false && venue?.location)
        ? venue.location
        : (shoot.shootLocation || venue?.location);

      return {
        ...shoot,
        // No need to overwrite venue, it's already there from GraphQL!
        effectiveLocation
      };
    });
  }, [Shoots]);

  // Date boundaries using util
  const { now, currentTab } = useMemo(() => getDateBoundaries(), [])

  // Computed current/upcoming using utils (date range filter + sort)
  const computedCurrentShoots = useMemo(() =>
    filterByDateRange(shootsWithVenues, now, currentTab),
    [shootsWithVenues, now, currentTab]
  )

  const computedUpcomingShoots = useMemo(() =>
    filterByDateRange(shootsWithVenues, currentTab, new Date('2100-01-01')),
    [shootsWithVenues, currentTab]
  )

  /*  // All published shoots (fallback)
   const allPublishedShoots = useMemo(() =>
     filterByDateRange(shootsWithVenues, new Date(0), new Date('2100-01-01')),
     [shootsWithVenues]
   ) */

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
  }, [computedCurrentShoots, computedUpcomingShoots/* , allPublishedShoots */]);

  const venueShootCounts = useMemo(() => {
    return Venues.reduce((acc, venue) => {
      // venue.hostedShoots is now an array of objects, not strings
      const validShoots = (venue.hostedShoots || []).filter(shoot => {
        const shootDate = new Date(shoot.date);
        return shootDate > now;
      });

      acc[venue.id] = validShoots.length;
      return acc;
    }, {});
  }, [Venues, now]);


  // Simplified isFiltered: true if distance applied and results reduced

  // Map view props (dynamic based on activeTab)
  const mapProps = useMemo(() => {
    let shootsToPass = [];
    let venuesToPass = [];
    if (activeTab === 'venue') {
      venuesToPass = Venues;
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
  }, [activeTab, filteredCurrentShoots, filteredUpcomingShoots, Venues, userLocation]);

  // List props with local data (no SearchContext)
  const listProps = useMemo(() => {
    return {
      shoots: shootsWithVenues,
      venues: Venues,
      currentShoots: filteredCurrentShoots,
      upcomingShoots: filteredUpcomingShoots,
      venueShootCounts,
      /* isFiltered, */
      totalCount: shootsWithVenues.length + Venues.length,
      resetFilters: () => { }, // Placeholder; can implement local reset if needed
      userLocation: userLocation,
      activeTab,
      setActiveTab,
    };
  }, [shootsWithVenues, Venues, filteredCurrentShoots, filteredUpcomingShoots, venueShootCounts, /* isFiltered,  */ userLocation, activeTab, setActiveTab])


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
        pricing {
          cost
          currency
          note
          tier
        }
        prizes
        isVerified
        isRegistration
        
        # Link back to venue for your "shootsWithVenues" logic
        venueId
        venue {
          venueId
          isClaimed
          name
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

