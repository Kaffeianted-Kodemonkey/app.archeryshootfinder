import * as React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api"
import { Link } from "gatsby"
import { getDistance } from "../../utils/distance"

const mapContainerStyle = {
  width: "100%",
  height: "40vh", // Reduced to match FTA sticky map height
}

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795, // Central US
}

const MapComponent = ({
  shoots,
  venues,
  userLocation,
  activeTab,
  selectedShoot,
  onClearSelection,
}) => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [map, setMap] = useState(null)
  const [center, setCenter] = useState(defaultCenter)
  const infoWindowRef = useRef(null)

  useEffect(() => {
    if (userLocation && map) {
      map.panTo(userLocation)
      setCenter(userLocation)
    }
  }, [userLocation, map])

  useEffect(() => {
    if (selectedShoot && map) {
      // Find the location for this shoot
      const loc = selectedShoot.effectiveLocation || selectedShoot.shootLocation
      if (loc) {
        const lat = parseFloat(loc.lat)
        const lng = parseFloat(loc.lng)
        if (!isNaN(lat) && !isNaN(lng)) {
          map.panTo({ lat, lng })
          setSelectedItem(selectedShoot) // opens the InfoWindow
        }
      }
    }
  }, [selectedShoot, map])

  // effectiveLocation already computed in index.js; no need to enrich here
  const enrichedShoots = shoots // Direct pass-through

  const markers = useMemo(() => {
    if (activeTab === "venue") {
      // Venue markers
      return venues
        .map(venue => {
          const location = venue.location
          if (!location) {
            console.warn(
              `Skipping marker for ${venue.name}: No location available`
            )
            return null
          }
          const lat = parseFloat(location.lat)
          const lng = parseFloat(location.lng)
          if (
            isNaN(lat) ||
            isNaN(lng) ||
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
          ) {
            console.warn(
              `Skipping marker for ${venue.name}: Invalid coordinates (${location.lat}, ${location.lng})`
            )
            return null
          }
          const position = { lat, lng }
          return {
            position,
            venue, // Use 'venue' key for this type
            key: venue.id,
          }
        })
        .filter(Boolean) // Remove null entries
    }

    // Existing shoot markers logic (for non-venue tabs)
    return enrichedShoots
      .map(shoot => {
        const location = shoot.effectiveLocation
        if (!location) {
          console.warn(
            `Skipping marker for ${shoot.name}: No effective location available`
          )
          return null
        }
        const lat = parseFloat(location.lat)
        const lng = parseFloat(location.lng)
        if (
          isNaN(lat) ||
          isNaN(lng) ||
          lat < -90 ||
          lat > 90 ||
          lng < -180 ||
          lng > 180
        ) {
          console.warn(
            `Skipping marker for ${shoot.name}: Invalid coordinates (${location.lat}, ${location.lng})`
          )
          return null
        }
        const position = { lat, lng }
        return {
          position,
          shoot,
          key: shoot.id,
        }
      })
      .filter(Boolean) // Remove null entries
  }, [enrichedShoots, venues, activeTab]) // Added venues to deps

  const handleMarkerClick = marker => {
    if (marker.shoot) {
      setSelectedItem(marker.shoot)
    } else if (marker.venue) {
      setSelectedItem(marker.venue)
    }
  }

  const handleMapClick = () => {
    setSelectedItem(null)
  }

  const formatDate = dateString => {
    const date = new Date(`${dateString}T00:00:00`)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getDisplayFormat = shoot => {
    const format = shoot.shootFormat?.[0] ?? "Event"
    const indoor = shoot.isIndoor ? " Indoor" : " Outdoor"
    return `${format}${indoor}`
  }

  const getShootTypeDisplay = shoot => shoot.shootType?.[0] ?? "General"

  const getAmenityIcons = amenities => {
    if (!amenities) return ""
    const icons = []
    if (amenities.petFriendly) icons.push("🐕")
    if (amenities.food) icons.push("🍔")
    if (amenities.wheelchairAccessible) icons.push("♿")
    if (amenities.camping) icons.push("⛺")
    return icons.join(" ")
  }

  // Custom SVG icon for markers
  const geoIcon = useMemo(
    () => ({
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#dc3545" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
    </svg>
  `),
    }),
    []
  )

  // Safe position for InfoWindow (using effectiveLocation for shoots, location for venues)
  const safeInfoPosition = useMemo(() => {
    if (!selectedItem) return null
    const loc = selectedItem.effectiveLocation || selectedItem.location
    if (!loc) return null
    const lat = parseFloat(loc.lat)
    const lng = parseFloat(loc.lng)
    if (isNaN(lat) || isNaN(lng)) return null
    return { lat, lng }
  }, [selectedItem])

  return (
    // <LoadScript googleMapsApiKey={process.env.GATSBY_GOOGLE_MAPS_API_KEY}>
    <LoadScript googleMapsApiKey="AIzaSyCUM-y330tVty37B9avJLFoA_XpxyQyJFI">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={5}
        onLoad={setMap}
        onClick={handleMapClick}
        options={{
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: true,
        }}
      >
        {markers.map(marker => (
          <Marker
            key={marker.key}
            position={marker.position}
            onClick={() => handleMarkerClick(marker)}
            icon={geoIcon}
          />
        ))}

        {selectedItem && safeInfoPosition && (
          <InfoWindow
            position={safeInfoPosition}
            onCloseClick={() => {
              setSelectedItem(null)
              onClearSelection?.()
            }}
            ref={infoWindowRef}
          >
            {(() => {
              const isShoot = selectedItem.date // Simple check: shoots have 'date'
              if (isShoot) {
                return (
                  <div className="p-2">
                    <h6 className="mb-2">{selectedItem.name}</h6>
                    <p className="mb-2 small">
                      <strong>Date:</strong> {formatDate(selectedItem.date)}
                    </p>
                    <p className="mb-2 small">
                      <strong>Location:</strong>{" "}
                      {selectedItem.effectiveLocation?.address || "TBD"},{" "}
                      {selectedItem.effectiveLocation?.city},{" "}
                      {selectedItem.effectiveLocation?.state}{" "}
                      {selectedItem.effectiveLocation?.zip || ""}
                    </p>
                    {userLocation && selectedItem.effectiveLocation && (
                      <p className="mb-2 small">
                        <strong>Distance:</strong>{" "}
                        {getDistance(
                          userLocation,
                          selectedItem.effectiveLocation
                        ).toFixed(1)}{" "}
                        mi
                      </p>
                    )}
                    {getAmenityIcons(selectedItem.amenities) && (
                      <p className="mb-2 small text-muted">
                        <strong>Amenities:</strong>{" "}
                        {getAmenityIcons(selectedItem.amenities)}
                      </p>
                    )}
                    <div className="d-flex gap-2">
                      <a
                        href={`https://www.google.com/maps?q=${selectedItem.effectiveLocation?.lat},${selectedItem.effectiveLocation?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        Directions
                      </a>
                      <Link
                        to={`/shoots/${selectedItem.slug}`}
                        className="btn btn-sm btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                )
              } else {
                // Venue
                return (
                  <div className="p-2">
                    <h6 className="mb-2">{selectedItem.name}</h6>
                    <p className="mb-2 small">
                      <strong>Type:</strong> {selectedItem.venueType || "Venue"}
                    </p>
                    {selectedItem.hours && (
                      <p className="mb-2 small">
                        <strong>Hours:</strong> Weekdays:{" "}
                        {selectedItem.hours.weekday || "TBD"} | Weekends:{" "}
                        {selectedItem.hours.weekend || "TBD"}
                      </p>
                    )}

                    {selectedItem.contact && (
                      <p className="mb-2 small text-muted">
                        <strong>Contact:</strong> Phone:{" "}
                        {selectedItem.contact.phone || "TBD"}
                      </p>
                    )}
                    {selectedItem.contact && (
                      <p className="mb-2 small">
                        <strong>Email:</strong>{" "}
                        {selectedItem.contact.email || "TBD"}
                      </p>
                    )}
                    <p className="mb-2 small">
                      <strong>Location:</strong>{" "}
                      {selectedItem.location?.address || "TBD"},{" "}
                      {selectedItem.location?.city},{" "}
                      {selectedItem.location?.state}{" "}
                      {selectedItem.location?.zip || ""}
                    </p>
                    <div className="d-flex gap-2">
                      <a
                        href={`https://www.google.com/maps?q=${selectedItem.location?.lat},${selectedItem.location?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        Directions
                      </a>
                      {/* Placeholder for venue details page; update if slugs exist */}
                      <button className="btn btn-sm btn-primary">
                        View Details
                      </button>
                    </div>
                  </div>
                )
              }
            })()}
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}

MapComponent.propTypes = {
  shoots: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      venueId: PropTypes.string, // For joining
      date: PropTypes.string.isRequired,
      shootFormat: PropTypes.array,
      shootType: PropTypes.array,
      isIndoor: PropTypes.bool,
      amenities: PropTypes.shape({
        petFriendly: PropTypes.bool,
        food: PropTypes.bool,
        wheelchairAccessible: PropTypes.bool,
        camping: PropTypes.bool,
      }),
      description: PropTypes.string,
      time: PropTypes.string,
      slug: PropTypes.string.isRequired,
    })
  ),
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.shape({
        lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        city: PropTypes.string,
        state: PropTypes.string,
        address: PropTypes.string,
        zip: PropTypes.string,
      }),
    })
  ).isRequired,
  userLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    activeTab: PropTypes.string,
  }),
  selectedShoot: PropTypes.object,
  onClearSelection: PropTypes.func,
}

export default MapComponent
