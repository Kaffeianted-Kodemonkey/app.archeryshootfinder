// src/components/search/SearchDrawer.js
import * as React from "react"
import { useState, useEffect, useRef, useImperativeHandle } from "react"
import PropTypes from "prop-types"
import { useSearch } from "../context/SearchContext"

const SearchDrawer = React.forwardRef((props, ref) => {
  const offcanvasRef = useRef(null)
  const {
    searchQuery,
    setSearchQuery,
    location,
    setLocation,
    radius,
    setRadius,
    filters,
    sortBy,
    setSortBy,
    uniqueShootFormat,
    uniqueShootTypes,
    uniqueBowTypes,
    uniqueSkillLevels,
    uniqueAffiliationTypes,
    showSearch,
    setShowSearch,
    toggleFilter,
    resetFilters,
  } = useSearch()

  const hasLocation = location.lat && location.lng

  // Debounce search query
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setSearchQuery(debouncedQuery)
  }, [debouncedQuery, setSearchQuery])

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location",
          })
          setRadius(50)
        },
        (error) => {
          console.warn("Geolocation error:", error)
        }
      )
    } else {
      console.warn("Geolocation not supported.")
    }
  }

  const handleNearMe = () => {
    handleGeolocation()
    // Close drawer
    const offcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasRef.current)
    if (offcanvas) offcanvas.hide()
  }

  // Expose show/hide to parent
  useImperativeHandle(ref, () => ({
    show: () => {
      if (offcanvasRef.current && window.bootstrap) {
        const offcanvas = new window.bootstrap.Offcanvas(offcanvasRef.current)
        offcanvas.show()
        setShowSearch(true)
      } else {
        console.error('Bootstrap Offcanvas not available')
      }
    },
    hide: () => {
      if (offcanvasRef.current && window.bootstrap) {
        const offcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasRef.current)
        if (offcanvas) {
          offcanvas.hide()
          setShowSearch(false)
        }
      }
    }
  }))

  // Sync state on hide
  const handleHidden = () => {
    setShowSearch(false)
  }

  return (
    <div
      ref={offcanvasRef}
      className="offcanvas offcanvas-start search-offcanvas"
      tabIndex="-1"
      id="searchOffcanvas"
      aria-labelledby="searchOffcanvasLabel"
      data-bs-backdrop="false"
      data-bs-scroll="false"
      onHidden={handleHidden}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="searchOffcanvasLabel">
          <i className="bi bi-search me-2" aria-hidden="true"></i>Search & Filters
        </h5>
        <button
          type="button"
          className="btn-close"
          aria-label="Close search drawer"
          onClick={() => {
            const offcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasRef.current)
            if (offcanvas) offcanvas.hide()
          }}
        ></button>
      </div>
      <div className="offcanvas-body">
        <div className="search-content">
          {/* Search Input */}
          <div className="input-group mb-2">
            <span className="input-group-text">
              <i className="bi bi-search" aria-hidden="true"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by shoot name"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search shoots by name"
              aria-describedby="searchHint"
            />
          </div>
          <small id="searchHint" className="text-muted mb-2">Results update as you type.</small>

          {/* Location Input */}
          <div className="mb-2">
            <label className="form-label mb-2"><strong>Location</strong></label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter address or city"
                value={location.address}
                onChange={e => setLocation({ ...location, address: e.target.value })}
                aria-label="Enter location address or city"
                aria-describedby="locationHint"
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleGeolocation}
                title="Use current location"
                aria-label="Use current location"
              >
                <i className="bi bi-geo-alt" aria-hidden="true"></i>
              </button>
            </div>
            <small id="locationHint" className="text-muted">Set location to use distance filter.</small>
          </div>

          {/* Distance Filter */}
          <div className="mb-3">
            <label htmlFor="radius" className="form-label mb-2">
              <strong>Distance (miles)</strong>
            </label>
            <input
              type="range"
              className="form-range"
              id="radius"
              min="0"
              max="200"
              step="10"
              value={radius}
              disabled={!hasLocation}
              onChange={e => setRadius(Number(e.target.value))}
              aria-label="Search radius in miles"
              aria-describedby={!hasLocation ? "radiusDisabledHint" : "radiusValue"}
            />
            <div className="d-flex justify-content-between">
              <small>0</small>
              <small id="radiusValue">{hasLocation ? radius : 'Disabled'}</small>
              <small>200</small>
            </div>
            {!hasLocation && <small id="radiusDisabledHint" className="text-muted d-block">Set location to enable.</small>}
          </div>

          <hr />

          {/* Two-Column Filters - Left Column */}
          <div className="row">
            <div className="col">
              <label className="form-label mb-2"><strong>Shoot Format</strong></label>
              <div className="filters-section mb-2" aria-label="Shoot format filters">
                {uniqueShootFormat.map(format => (
                  <div key={format} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`format-${format.toLowerCase()}`}
                      checked={filters.shootFormat.includes(format)}
                      onChange={() => toggleFilter("shootFormat", format)}
                      aria-label={`Toggle filter for ${format} shoot format`}
                    />
                    <label className="form-check-label" htmlFor={`format-${format.toLowerCase()}`}>
                      {format}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="col">
              <label className="form-label mb-2"><strong>Shoot Type</strong></label>
              <div className="filters-section mb-2" aria-label="Shoot type filters">
                {uniqueShootTypes.map(type => (
                  <div key={type} className="form-check mb-2">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id={`type-${type.toLowerCase()}`} 
                      checked={filters.shootType.includes(type)} 
                      onChange={() => toggleFilter("shootType", type)}
                      aria-label={`Toggle filter for ${type} shoot type`}
                    />
                    <label className="form-check-label" htmlFor={`type-${type.toLowerCase()}`}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col">
              <label className="form-label mb-2"><strong>Bow Type</strong></label>
              <div className="filters-section mb-2" aria-label="Bow type filters">
                {uniqueBowTypes.map(type => (
                  <div key={type} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`bow-${type.toLowerCase()}`}
                      checked={filters.bowType.includes(type)}
                      onChange={() => toggleFilter("bowType", type)}
                      aria-label={`Toggle filter for ${type} bow type`}
                    />
                    <label className="form-check-label" htmlFor={`bow-${type.toLowerCase()}`}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="col">
              <label className="form-label mb-2"><strong>Skill Level</strong></label>
              <div className="filters-section mb-2" aria-label="Skill level filters">
                {uniqueSkillLevels.map(level => (
                  <div key={level} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`skill-${level.toLowerCase()}`}
                      checked={filters.skillLevel.includes(level)}
                      onChange={() => toggleFilter("skillLevel", level)}
                      aria-label={`Toggle filter for ${level} skill level`}
                    />
                    <label className="form-check-label" htmlFor={`skill-${level.toLowerCase()}`}>
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr />
          
          <div className="row">
            <div className="col">
              <label className="form-label mb-2"><strong>Affiliation Type</strong></label>
              <div className="filters-section mb-2" aria-label="Affiliation type filters">
                {uniqueAffiliationTypes.map(type => (
                  <div key={type} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`aff-type-${type.toLowerCase()}`}
                      checked={filters.affiliationType.includes(type)}
                      onChange={() => toggleFilter("affiliationType", type)}
                      aria-label={`Toggle filter for ${type.charAt(0).toUpperCase() + type.slice(1)} affiliation`}
                    />
                    <label className="form-check-label" htmlFor={`aff-type-${type.toLowerCase()}`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="col">
              <button
                className="btn btn-primary mb-1"
                onClick={handleNearMe}
                aria-label="Search near my current location"
              >
                <i className="bi bi-geo-alt me-2" aria-hidden="true"></i>Near Me
              </button> <br />
              <button
                className="btn btn-outline-secondary"
                onClick={resetFilters}
                aria-label="Reset all filters and search"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

SearchDrawer.displayName = 'SearchDrawer'

export default SearchDrawer
