// src/components/list/VenueDirectory.js
// ONLY shows the Venue tab. Clean, focused, and includes an embedded filter bar.
import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import PropTypes from "prop-types"
import VenueList from "./VenueList"
import { filterByDistance } from "../../utils/shootFilters"

const Direct = ({
  venues = [],
  allVenues = venues,
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
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedDistance, setSelectedDistance] = useState("")

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
    const cities = allVenues.map(v => v.location?.city?.trim()).filter(Boolean)
    return [...new Set(cities)].sort()
  }, [allVenues])

  const stateOptions = useMemo(() => {
    const states = allVenues
      .map(v => v.location?.state?.trim().toUpperCase())
      .filter(Boolean)
    return [...new Set(states)].sort()
  }, [allVenues])

  // --- Read & Normalize Inbound Footer / Global Navigation Params ---
  useEffect(() => {
    if (!location?.search) return
    const params = new URLSearchParams(location.search)
    const typeParam = params.get("type")

    if (typeParam) {
      const t = typeParam.trim().toUpperCase()
      if (t === "CLUB" || t === "Club") setSelectedType("Club")
      else if (t === "RANGE" || t === "Range") setSelectedType("Range")
      else if (["PRO_SHOP", "PRO_SHOPS", "PRO SHOP"].includes(t))
        setSelectedType("Pro Shop")
    }
  }, [location])

  // --- Computational Filtering Engine ---
  const filteredVenues = useMemo(() => {
    const hasActiveFilters = Boolean(
      selectedCity || selectedState || selectedType || selectedDistance
    )
    let result = [...(hasActiveFilters ? allVenues : venues)]

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

    if (selectedDistance && userLocation) {
      result = filterByDistance(result, userLocation, Number(selectedDistance))
    }

    return result
  }, [
    venues,
    allVenues,
    selectedType,
    selectedState,
    selectedCity,
    selectedDistance,
    userLocation,
  ])

  // --- Keep External States/Maps Tracked Automatically ---
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filteredVenues)
    }
  }, [filteredVenues, onFilterChange])

  // --- Reset Toolbar Actions ---
  const handleClearFilters = () => {
    setSelectedCity("")
    setSelectedState("")
    setSelectedType("")
    setSelectedDistance("")
  }

  return (
    <section className="directory-section container-fluid px-0">
      {/* Filter Panel Row */}
      <div className="d-flex flex-nowrap gap-2 align-items-center mx-0 px-3 pt-2 pb-2 mb-2 overflow-auto">
        {/* City Selector Menu Dropdown */}
        <div className="flex-shrink-0" style={{ width: "160px" }}>
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
        <div className="flex-shrink-0" style={{ width: "140px" }}>
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
        <div className="flex-shrink-0" style={{ width: "180px" }}>
          <select
            className="form-select"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="">All Venue Types</option>
            <option value="Club">Clubs</option>
            <option value="Range">Ranges</option>
            <option value="Pro Shop">Pro Shops</option>
          </select>
        </div>

        <div className="flex-shrink-0" style={{ width: "160px" }}>
          <select
            className="form-select"
            value={selectedDistance}
            onChange={e => setSelectedDistance(e.target.value)}
            aria-label="Filter by distance"
          >
            <option value="">All distances</option>
            <option value="50" disabled={!userLocation}>
              Within 50 miles
            </option>
            <option value="100" disabled={!userLocation}>
              Within 100 miles
            </option>
          </select>
        </div>

        {/* Reset Action Control Button */}
        <div className="flex-shrink-0" style={{ width: "130px" }}>
          <button
            className="btn btn-outline-success w-100"
            onClick={handleClearFilters}
            disabled={
              !selectedCity &&
              !selectedState &&
              !selectedType &&
              !selectedDistance
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
                  No results found. Please use filters to adjust your results.
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
  allVenues: PropTypes.array,
  userLocation: PropTypes.object,
  currentShoots: PropTypes.array,
  upcomingShoots: PropTypes.array,
  destinationShoots: PropTypes.array,
  onSelectShoot: PropTypes.func,
  location: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default React.memo(Direct)
