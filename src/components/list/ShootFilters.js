import * as React from "react"
import {
  filterByDistance,
  getEffectiveShootLocation,
} from "../../utils/shootFilters"

const ShootFilters = ({
  shoots,
  allShoots = shoots,
  onFilteredChange,
  userLocation,
  userState,
  userCountry,
}) => {
  const [filters, setFilters] = React.useState({
    state: "", // ← new: selected state (empty = show all)
    city: "",
    bowType: "",
    format: "",
    shootClass: "",
    skillLevel: "",
    distance: "",
  })

  const [sort, setSort] = React.useState({ field: "", direction: "asc" })

  const options = React.useMemo(() => {
    const bowTypes = new Set()
    const formats = new Set()
    const classes = new Set()
    const levels = new Set()
    const states = new Set()
    const cities = new Set()

    allShoots.forEach(s => {
      s.bowTypes?.forEach(b => bowTypes.add(b))
      s.shootFormat?.forEach(f => formats.add(f))
      s.shootClass?.forEach(c => classes.add(c))
      s.skillLevel?.forEach(l => levels.add(l))

      const loc = getEffectiveShootLocation(s)
      if (loc?.state) states.add(loc.state)
      if (loc?.city) cities.add(loc.city.trim())
    })

    return {
      bowTypes: [...bowTypes].sort(),
      formats: [...formats].sort(),
      classes: [...classes].sort(),
      levels: [...levels].sort(),
      states: [...states].sort(), // ← new
      cities: [...cities].filter(Boolean).sort(),
    }
  }, [allShoots])

  React.useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(Boolean)
    let result = [...(hasActiveFilters ? allShoots : shoots)]

    // STATE FILTER (new)
    if (filters.state) {
      result = result.filter(s => {
        const loc = getEffectiveShootLocation(s)
        return loc?.state === filters.state
      })
    }
    if (filters.city) {
      result = result.filter(s => {
        const loc = getEffectiveShootLocation(s)
        return loc?.city?.toLowerCase() === filters.city.toLowerCase()
      })
    }
    // "local" = do nothing (data is already the local set from index.js)

    // other filters stay the same
    if (filters.bowType)
      result = result.filter(s => s.bowTypes?.includes(filters.bowType))
    if (filters.format)
      result = result.filter(s => s.shootFormat?.includes(filters.format))
    if (filters.shootClass)
      result = result.filter(s => s.shootClass?.includes(filters.shootClass))
    if (filters.skillLevel)
      result = result.filter(s => s.skillLevel?.includes(filters.skillLevel))
    if (filters.distance && userLocation) {
      result = filterByDistance(result, userLocation, Number(filters.distance))
    }

    onFilteredChange(result)
  }, [filters, shoots, allShoots, userLocation, onFilteredChange])

  const updateFilter = (key, value) => setFilters(p => ({ ...p, [key]: value }))

  const reset = () => {
    setFilters({
      state: "",
      city: "",
      bowType: "",
      format: "",
      shootClass: "",
      skillLevel: "",
      distance: "",
    })
    setSort({ field: "", direction: "asc" })
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <section
      className="border border-warning rounded bg-warning-subtle p-3 mb-3"
      aria-label="Refine event results"
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h2 className="h6 mb-1">Refine results</h2>
          <p className="small text-body-secondary mb-0">
            Choose one or more filters to narrow the events.
          </p>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            onClick={reset}
          >
            Clear {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"}
          </button>
        )}
      </div>
      <div className="d-flex flex-wrap align-items-center gap-2 small">
        <select
          className="form-select form-select-sm flex-grow-1"
          style={{ minWidth: "10rem", maxWidth: "15rem" }}
          value={filters.distance}
          onChange={e => updateFilter("distance", e.target.value)}
          aria-label="Filter by distance"
        >
          <option value="">Any distance</option>
          <option value="50" disabled={!userLocation}>
            Within 50 miles
          </option>
          <option value="100" disabled={!userLocation}>
            Within 100 miles
          </option>
        </select>

        <select
          className="form-select form-select-sm flex-grow-1"
          style={{ minWidth: "8rem", maxWidth: "12rem" }}
          value={filters.state}
          onChange={e => updateFilter("state", e.target.value)}
          aria-label="Filter by state"
        >
          <option value="">Any state</option>
          {options.states.map(st => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <select
          className="form-select form-select-sm flex-grow-1"
          style={{ minWidth: "9rem", maxWidth: "14rem" }}
          value={filters.city}
          onChange={e => updateFilter("city", e.target.value)}
          aria-label="Filter by city"
        >
          <option value="">Any city</option>
          {options.cities.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          className="form-select form-select-sm flex-grow-1"
          style={{ minWidth: "9rem", maxWidth: "14rem" }}
          value={filters.bowType}
          onChange={e => updateFilter("bowType", e.target.value)}
          aria-label="Filter by bow type"
        >
          <option value="">Any bow type</option>
          {options.bowTypes.map(b => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          className="form-select form-select-sm flex-grow-1"
          style={{ minWidth: "9rem", maxWidth: "14rem" }}
          value={filters.format}
          onChange={e => updateFilter("format", e.target.value)}
          aria-label="Filter by format"
        >
          <option value="">Any format</option>
          {options.formats.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="form-select form-select-sm flex-grow-1"
          style={{ minWidth: "8rem", maxWidth: "12rem" }}
          value={filters.shootClass}
          onChange={e => updateFilter("shootClass", e.target.value)}
          aria-label="Filter by class"
        >
          <option value="">Any class</option>
          {options.classes.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="form-select form-select-sm flex-grow-1"
          style={{ minWidth: "8rem", maxWidth: "12rem" }}
          value={filters.skillLevel}
          onChange={e => updateFilter("skillLevel", e.target.value)}
          aria-label="Filter by skill level"
        >
          <option value="">Any level</option>
          {options.levels.map(l => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}

export default ShootFilters
