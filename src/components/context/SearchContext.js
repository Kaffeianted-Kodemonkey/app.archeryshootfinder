// src/components/context/SearchContext.js
import * as React from "react"
import { createContext, useContext, useReducer, useMemo, useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"

// Data and utils
import shootsData from "../../data/shoots.json"
import venuesData from "../../data/venues.json"
import { getDistance } from "../../utils/distance"

// Updated: Split shoots into current/upcoming with +21 days
const getCurrentUpcomingShoots = (shoots) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Use UTC for consistency
  const twentyOneDaysFromNow = new Date(today);
  twentyOneDaysFromNow.setUTCDate(today.getUTCDate() + 21);

  const currentShoots = shoots.filter(shoot => {
    const shootDate = new Date(shoot.date);
    shootDate.setUTCHours(0, 0, 0, 0);
    return shootDate >= today && shootDate <= twentyOneDaysFromNow && shoot.status === "published";
  });

  const upcomingShoots = shoots.filter(shoot => {
    const shootDate = new Date(shoot.date);
    shootDate.setUTCHours(0, 0, 0, 0);
    return shootDate > twentyOneDaysFromNow && shoot.status === "published";
  });

  return { currentShoots, upcomingShoots };
};

// Inline: Compute venue shoot counts (updated to use +21 days for consistency)
const computeVenueShootCounts = (venues) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twentyOneDaysFromNow = new Date(today);
  twentyOneDaysFromNow.setDate(today.getDate() + 21);
  const shootCounts = {};

  venues.forEach(venue => {
    const upcoming = shootsData.filter(shoot => {
      const shootDate = new Date(shoot.date);
      shootDate.setHours(0, 0, 0, 0);
      return shootDate > twentyOneDaysFromNow && shoot.venueId === venue.id && shoot.status === "published";
    });
    shootCounts[venue.id] = upcoming.length;
  });

  return shootCounts;
};

// Inline: Sort venues
const sortVenues = (venues, field, direction = 'asc') => {
  return [...venues].sort((a, b) => {
    let aVal, bVal;

    switch (field) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'location':
        aVal = `${a.location.city}, ${a.location.state}`.toLowerCase();
        bVal = `${b.location.city}, ${b.location.state}`.toLowerCase();
        break;
      case 'type':
        aVal = a.type.toLowerCase();
        bVal = b.type.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

const SearchContext = createContext()

// Debounce hook (unchanged)
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Initial state (updated: activeTab default to "venue", remove shootTab)
const initialState = {
  searchQuery: "",
  location: { lat: null, lng: null, address: "" },
  radius: 50,
  filters: {
    shootFormat: [],
    shootType: [],
    bowType: [],
    skillLevel: [],
    affiliationType: [],
  },
  sortBy: "date",
  venueFilter: null,
  activeTab: "venue",  // Updated default to match flattened tabs
  showUnclaimed: true,
  shootFormatFilter: "all",
  shootTypeFilter: "all",
  bowFilter: "all",
  shootSortField: "date",
  shootSortDirection: "asc",
  venueSortField: "name",
  venueSortDirection: "asc",
  clubId: null,
}

// Reducer (removed SET_SHOOT_TAB case)
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_LOCATION":
      return { ...state, location: action.payload }
    case "SET_RADIUS":
      return { ...state, radius: action.payload }
    case "TOGGLE_FILTER":
      const currentFilters = state.filters[action.payload.category]
      const isActive = currentFilters.includes(action.payload.value)
      const newFilters = isActive
        ? currentFilters.filter(f => f !== action.payload.value)
        : [...currentFilters, action.payload.value]
      return {
        ...state,
        filters: { ...state.filters, [action.payload.category]: newFilters },
      }
    case "RESET_FILTERS":
      return initialState
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload }
    case "SET_VENUE_FILTER":
      return { ...state, venueFilter: action.payload }
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload }
    case "TOGGLE_SHOW_UNCLAIMED":
      return { ...state, showUnclaimed: !state.showUnclaimed }
    case "SET_SHOOT_FORMAT_FILTER":
      return { ...state, shootFormatFilter: action.payload }
    case "SET_SHOOT_TYPE_FILTER":
      return { ...state, shootTypeFilter: action.payload }
    case "SET_BOW_FILTER":
      return { ...state, bowFilter: action.payload }
    case "SET_SHOOT_SORT":
      return { ...state, shootSortField: action.payload.field, shootSortDirection: action.payload.direction }
    case "SET_VENUE_SORT":
      return { ...state, venueSortField: action.payload.field, venueSortDirection: action.payload.direction }
    case "SET_CLUB_ID":
      return { ...state, clubId: action.payload }
    default:
      return state
  }
}

// Filter shoots (updated alerts for +21 days, but logic unchanged)
const filterShoots = (shoots, state) => {
  let filtered = [...shoots]

  const { searchQuery: debouncedQuery, location, radius, filters } = state
  if (debouncedQuery) {
    const lowerQuery = debouncedQuery.toLowerCase()
    filtered = filtered.filter(shoot =>
      shoot.name.toLowerCase().includes(lowerQuery) ||
      (shoot.description && shoot.description.toLowerCase().includes(lowerQuery))
    )
  }

  if (location.lat && location.lng && radius > 0) {
    filtered = filtered.filter(shoot => {
      if (!shoot.location?.lat || !shoot.location?.lng) return false
      const distance = getDistance(location, shoot.location)
      return distance <= radius
    })
  }

  if (filters.shootFormat.length > 0) {
    filtered = filtered.filter(shoot => shoot.shootFormat?.some(f => filters.shootFormat.includes(f)))
  }
  if (filters.shootType.length > 0) {
    filtered = filtered.filter(shoot => shoot.shootType?.some(t => filters.shootType.includes(t)))
  }
  if (filters.bowType.length > 0) {
    filtered = filtered.filter(shoot => shoot.bowTypes?.some(b => filters.bowType.includes(b)))
  }
  if (filters.skillLevel.length > 0) {
    filtered = filtered.filter(shoot => shoot.skillLevel?.some(s => filters.skillLevel.includes(s)))
  }
  if (filters.affiliationType.length > 0) {
    filtered = filtered.filter(shoot => 
      shoot.affiliation?.some(a => filters.affiliationType.includes(a.type))
    )
  }

  if (state.shootFormatFilter !== "all") {
    filtered = filtered.filter(shoot => shoot.shootFormat?.includes(state.shootFormatFilter))
  }
  if (state.shootTypeFilter !== "all") {
    filtered = filtered.filter(shoot => shoot.shootType?.includes(state.shootTypeFilter))
  }
  if (state.bowFilter !== "all") {
    filtered = filtered.filter(shoot => shoot.bowTypes?.includes(state.bowFilter))
  }

  if (state.clubId) {
    filtered = filtered.filter(shoot => shoot.venueId === state.clubId) // Updated to venueId
  }

  filtered.sort((a, b) => {
    let aVal, bVal
    switch (state.shootSortField) {
      case "date":
        aVal = new Date(a.date)
        bVal = new Date(b.date)
        break
      case "price":
        aVal = parseFloat(a.entryFee?.replace(/[^0-9.]/g, '') || 0)
        bVal = parseFloat(b.entryFee?.replace(/[^0-9.]/g, '') || 0)
        break
      case "distance":
        if (state.location.lat && state.location.lng) {
          aVal = getDistance(state.location, a.venue?.location || a.location) // Fallback to venue.location
          bVal = getDistance(state.location, b.venue?.location || b.location)
        } else {
          return 0
        }
        break
      default:
        return 0
    }
    const dir = state.shootSortDirection === "asc" ? 1 : -1
    return (aVal > bVal ? 1 : -1) * dir
  })

  return filtered
}

// Filter venues (inlines sorting)
const filterVenues = (venues, state) => {
  let filtered = [...venues]

  const { searchQuery: debouncedQuery, location, radius, venueFilter, showUnclaimed } = state
  if (debouncedQuery) {
    const lowerQuery = debouncedQuery.toLowerCase()
    filtered = filtered.filter(venue =>
      venue.name.toLowerCase().includes(lowerQuery) ||
      (venue.description && venue.description.toLowerCase().includes(lowerQuery))
    )
  }

  if (location.lat && location.lng && radius > 0) {
    filtered = filtered.filter(venue => {
      if (!venue.location?.lat || !venue.location?.lng) return false
      const distance = getDistance(location, venue.location)
      return distance <= radius
    })
  }

  if (venueFilter) {
    filtered = filtered.filter(venue => venue.type === venueFilter || venue.id === venueFilter)
  }

  if (!showUnclaimed) {
    filtered = filtered.filter(venue => venue.tier !== "basic")
  }

  // Inline sorting
  filtered = sortVenues(filtered, state.venueSortField, state.venueSortDirection);

  return filtered
}

// Uniques (unchanged)
const getUniqueValues = (shoots, key) => {
  const values = new Set()
  shoots.forEach(shoot => {
    if (Array.isArray(shoot[key])) {
      shoot[key].forEach(v => values.add(v))
    } else if (shoot[key]) {
      values.add(shoot[key])
    }
  })
  return Array.from(values)
}

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [rawShoots] = useState(shootsData)
  const [rawVenues] = useState(venuesData)

  const debouncedSearchQuery = useDebounce(state.searchQuery, 300)

  // Updated: Use new getCurrentUpcomingShoots with +21 days
  const { currentShoots: baseCurrent, upcomingShoots: baseUpcoming } = useMemo(
    () => getCurrentUpcomingShoots(rawShoots),
    [rawShoots]
  )

  // Apply filters to base splits
  const filteredCurrentShoots = useMemo(() => 
    filterShoots(baseCurrent, { ...state, searchQuery: debouncedSearchQuery }),
    [baseCurrent, state, debouncedSearchQuery]
  )

  const filteredUpcomingShoots = useMemo(() => 
    filterShoots(baseUpcoming, { ...state, searchQuery: debouncedSearchQuery }),
    [baseUpcoming, state, debouncedSearchQuery]
  )

  const filteredShoots = useMemo(() => [...filteredCurrentShoots, ...filteredUpcomingShoots], [filteredCurrentShoots, filteredUpcomingShoots])

  const filteredVenues = useMemo(() => 
    filterVenues(rawVenues, { ...state, searchQuery: debouncedSearchQuery }),
    [rawVenues, state, debouncedSearchQuery]
  )

  // Uniques (unchanged)
  const uniqueShootFormat = useMemo(() => getUniqueValues(rawShoots, "shootFormat"), [rawShoots])
  const uniqueShootTypes = useMemo(() => getUniqueValues(rawShoots, "shootType"), [rawShoots])
  const uniqueBowTypes = useMemo(() => getUniqueValues(rawShoots, "bowTypes"), [rawShoots])
  const uniqueSkillLevels = useMemo(() => getUniqueValues(rawShoots, "skillLevel"), [rawShoots])
  const uniqueAffiliationTypes = useMemo(() => [...new Set(rawShoots.map(s => s.affiliation?.map(a => a.type)).flat())], [rawShoots])

  // Venue mapping (unchanged)
  const venueMapping = useMemo(() => {
    const typeMap = {
      range: { icon: 'bi-crosshairs', className: 'bg-success text-white', rowBg: 'bg-success-subtle', textColor: 'text-success' },
      'pro_shop': { icon: 'bi-shop', className: 'bg-danger text-white', rowBg: 'bg-danger-subtle', textColor: 'text-danger' },
      club: { icon: 'bi-building', className: 'bg-primary text-white', rowBg: 'bg-primary-subtle', textColor: 'text-primary' },
      association: { icon: 'bi-people', className: 'bg-info text-white', rowBg: 'bg-info-subtle', textColor: 'text-info' },
      organization: { icon: 'bi-star', className: 'bg-warning text-dark', rowBg: 'bg-warning-subtle', textColor: 'text-warning' },
      default: { icon: 'bi-geo-alt', className: 'bg-secondary text-white', rowBg: 'bg-light', textColor: 'text-secondary' }
    };
    rawVenues.forEach(venue => {
      if (venue.type && (venue.icon || venue.iconColor)) {
        const base = typeMap[venue.type] || typeMap.default;
        typeMap[venue.type] = {
          ...base,
          icon: venue.icon || base.icon,
          className: venue.iconColor ? (
            venue.iconColor === '#28a745' ? 'bg-success text-white' : 
            venue.iconColor === '#dc3545' ? 'bg-danger text-white' : 
            venue.iconColor === '#007bff' ? 'bg-primary text-white' :
            venue.iconColor === '#6f42c1' ? 'bg-info text-white' :
            venue.iconColor === '#fd7e14' ? 'bg-warning text-dark' :
            'bg-secondary text-white'
          ) : base.className,
          rowBg: base.rowBg,
          textColor: base.textColor
        };
      }
    });
    return typeMap;
  }, [rawVenues])

  // Updated: Pre-compute venue shoot counts with +21 days
  const venueShootCounts = useMemo(() => computeVenueShootCounts(rawVenues), [rawVenues]);

  // URL param sync (removed shootTab handling)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const activeTab = params.get('activeTab')
    const clubId = params.get('clubId')

    if (activeTab && activeTab !== state.activeTab) dispatch({ type: "SET_ACTIVE_TAB", payload: activeTab })
    if (clubId && clubId !== state.clubId) dispatch({ type: "SET_CLUB_ID", payload: clubId })
  }, [])

  // Setters (removed setShootTab)
  const setSearchQuery = useCallback((query) => dispatch({ type: "SET_SEARCH_QUERY", payload: query }), [])
  const setLocation = useCallback((loc) => dispatch({ type: "SET_LOCATION", payload: loc }), [])
  const setRadius = useCallback((r) => dispatch({ type: "SET_RADIUS", payload: r }), [])
  const toggleFilter = useCallback((category, value) => dispatch({ type: "TOGGLE_FILTER", payload: { category, value } }), [])
  const resetFilters = useCallback(() => dispatch({ type: "RESET_FILTERS" }), [])
  const setSortBy = useCallback((sort) => dispatch({ type: "SET_SORT_BY", payload: sort }), [])
  const setVenueFilter = useCallback((filter) => dispatch({ type: "SET_VENUE_FILTER", payload: filter }), [])
  const setActiveTab = useCallback((tab) => dispatch({ type: "SET_ACTIVE_TAB", payload: tab }), [])
  const toggleShowUnclaimed = useCallback(() => dispatch({ type: "TOGGLE_SHOW_UNCLAIMED" }), [])
  const setShootFormatFilter = useCallback((filter) => dispatch({ type: "SET_SHOOT_FORMAT_FILTER", payload: filter }), [])
  const setShootTypeFilter = useCallback((filter) => dispatch({ type: "SET_SHOOT_TYPE_FILTER", payload: filter }), [])
  const setBowFilter = useCallback((filter) => dispatch({ type: "SET_BOW_FILTER", payload: filter }), [])
  const setShootSort = useCallback((field, direction) => dispatch({ type: "SET_SHOOT_SORT", payload: { field, direction } }), [])
  const setVenueSort = useCallback((field, direction) => dispatch({ type: "SET_VENUE_SORT", payload: { field, direction } }), [])
  const setClubId = useCallback((id) => dispatch({ type: "SET_CLUB_ID", payload: id }), [])

  // Value (removed shootTab, setShootTab)
  const value = useMemo(() => ({
    ...state,
    filteredShoots,
    filteredCurrentShoots,
    filteredUpcomingShoots,
    filteredVenues,
    venueMapping,
    venueShootCounts,
    uniqueShootFormat,
    uniqueShootTypes,
    uniqueBowTypes,
    uniqueSkillLevels,
    uniqueAffiliationTypes,
    setSearchQuery,
    setLocation,
    setRadius,
    toggleFilter,
    resetFilters,
    setSortBy,
    setVenueFilter,
    setActiveTab,
    toggleShowUnclaimed,
    setShootFormatFilter,
    setShootTypeFilter,
    setBowFilter,
    setShootSort,
    setVenueSort,
    setClubId,
    clubId: state.clubId,
    currentShoots: filteredCurrentShoots,
    upcomingShoots: filteredUpcomingShoots,
    isFiltered: filteredShoots.length < rawShoots.length
  }), [
    state, filteredShoots, filteredCurrentShoots, filteredUpcomingShoots, filteredVenues, venueMapping, venueShootCounts,
    uniqueShootFormat, uniqueShootTypes, uniqueBowTypes, uniqueSkillLevels, uniqueAffiliationTypes,
    setSearchQuery, setLocation, setRadius, toggleFilter, resetFilters, setSortBy, setVenueFilter, setActiveTab, toggleShowUnclaimed,
    setShootFormatFilter, setShootTypeFilter, setBowFilter, setShootSort, setVenueSort, setClubId
  ])

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider")
  }
  return context
}

export default SearchContext
