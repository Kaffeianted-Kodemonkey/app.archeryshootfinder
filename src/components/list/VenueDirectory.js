// src/components/list/VenueDirectory.js
// ONLY shows the Venue tab. Clean, focused, and includes an embedded filter bar.
import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import PropTypes from "prop-types"
import VenueList from "./VenueList"

const Direct = ({
  venues = [],
  userLocation,
  currentShoots = [],
  upcomingShoots = [],
  destinationShoots = [],
  onSelectShoot,
  location, // URL prop to check for footer filter matches
  onFilterChange, // Optional callback to pass filtered results back to a map view
}) => {
  const [showUnclaimed, setShowUnclaimed] = useState(true)
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  // --- Filter Component Local States ---
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const toggleShowUnclaimed = () => setShowUnclaimed(!showUnclaimed)

  const handleSort = field => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // --- Dynamic Option Extractors (Sourced from database data arrays) ---
  const cityOptions = useMemo(() => {
    const cities = venues.map(v => v.location?.city?.trim()).filter(Boolean)
    return [...new Set(cities)].sort()
  }, [venues])

  const stateOptions = useMemo(() => {
    const states = venues
      .map(v => v.location?.state?.trim().toUpperCase())
      .filter(Boolean)
    return [...new Set(states)].sort()
  }, [venues])

  // --- Read & Normalize Inbound Footer / Global Navigation Params ---
  useEffect(() => {
    if (!location?.search) return
    const params = new URLSearchParams(location.search)
    const typeParam = params.get("type")
    const searchParam = params.get("search")

    if (typeParam) {
      const t = typeParam.trim().toUpperCase()
      if (t === "CLUB" || t === "CLUBS") setSelectedType("CLUB")
      else if (t === "RANGE" || t === "RANGES") setSelectedType("RANGE")
      else if (["PRO_SHOP", "PRO_SHOPS", "PRO SHOTS", "PRO SHOP"].includes(t))
        setSelectedType("PRO_SHOP")
    }

    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [location])

  // --- Computational Filtering Engine ---
  const filteredVenues = useMemo(() => {
    let result = [...venues]

    // 1. Filter by Venue Type Classification (Handles both Arrays and Legacy Strings)
    if (selectedType) {
      result = result.filter(v => {
        if (!v.venueType) return false

        if (Array.isArray(v.venueType)) {
          return v.venueType.some(
            type => type?.toUpperCase() === selectedType.toUpperCase()
          )
        }

        return v.venueType.toUpperCase() === selectedType.toUpperCase()
      })
    }

    // 2. Filter by State Abbreviation
    if (selectedState) {
      result = result.filter(
        v => v.location?.state?.toUpperCase() === selectedState.toUpperCase()
      )
    }

    // 3. Filter by Selected City
    if (selectedCity) {
      result = result.filter(
        v => v.location?.city?.toLowerCase() === selectedCity.toLowerCase()
      )
    }

    // 4. Text Input Search Box Matching Lookups
    if (searchQuery) {
      const q = searchQuery.replace(/,/g, "").replace(/\s+/g, " ").toLowerCase()
      result = result.filter(v => {
        const textPool = [v.vname, v.location?.city, v.location?.state, v.bio]
          .join(" ")
          .toLowerCase()
        return textPool.includes(q)
      })
    }

    return result
  }, [venues, selectedType, selectedState, selectedCity, searchQuery])

  // --- Keep External States/Maps Tracked Automatically ---
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filteredVenues)
    }
  }, [filteredVenues, onFilterChange])

  // --- Reset Toolbar Actions ---
  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCity("")
    setSelectedState("")
    setSelectedType("")
  }

  return (
    <section className="directory-section container-fluid px-0">
      {/* Filter Panel Row */}
      <div className="row mx-0 px-3 pt-2 pb-2 mb-2 g-2 align-items-center">
        {/* Text Input Search Field */}
        <div className="col-12 col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Name or Bio..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* City Selector Menu Dropdown */}
        <div className="col-6 col-md-2">
          <select
            className="form-select"
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {cityOptions.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* State Selector Menu Dropdown */}
        <div className="col-6 col-md-2">
          <select
            className="form-select"
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
          >
            <option value="">All States</option>
            {stateOptions.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Venue Category Field Type */}
        <div className="col-12 col-md-3">
          <select
            className="form-select"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="">All Venue Types</option>
            <option value="CLUB">Clubs</option>
            <option value="RANGE">Ranges</option>
            <option value="PRO_SHOP">Pro Shops</option>
          </select>
        </div>

        {/* Reset Action Control Button */}
        <div className="col-12 col-md-2">
          <button
            className="btn btn-outline-success w-100"
            onClick={handleClearFilters}
            disabled={
              !searchQuery && !selectedCity && !selectedState && !selectedType
            }
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Venue Card Output Container Render Flow */}
      <div className="row gx-0 p-0 mx-0 px-0 mt-3">
        <div className="col-12 px-0">
          <div className="list-scroll-container">
            {filteredVenues.length === 0 ? (
              <div className="px-3">
                <div className="alert alert-info text-center py-5 my-4">
                  Nothing found.
                </div>
              </div>
            ) : (
              <VenueList
                allVenues={filteredVenues}
                location={userLocation}
                showUnclaimed={showUnclaimed}
                currentShoots={currentShoots}
                upcomingShoots={upcomingShoots}
                destinationShoots={destinationShoots}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                onSelectShoot={onSelectShoot}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

Direct.propTypes = {
  venues: PropTypes.array.isRequired,
  userLocation: PropTypes.object,
  currentShoots: PropTypes.array,
  upcomingShoots: PropTypes.array,
  destinationShoots: PropTypes.array,
  onSelectShoot: PropTypes.func,
  location: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default React.memo(Direct)
