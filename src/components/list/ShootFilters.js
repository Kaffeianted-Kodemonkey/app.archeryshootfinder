import * as React from "react"
import { filterByDistance } from "../../utils/shootFilters"

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

    allShoots.forEach(s => {
      s.bowTypes?.forEach(b => bowTypes.add(b))
      s.shootFormat?.forEach(f => formats.add(f))
      s.shootClass?.forEach(c => classes.add(c))
      s.skillLevel?.forEach(l => levels.add(l))

      const loc =
        s.useVenueLocation !== false && s.venue?.location
          ? s.venue.location
          : s.effectiveLocation || s.shootLocation || s.location
      if (loc?.state) states.add(loc.state)
    })

    return {
      bowTypes: [...bowTypes].sort(),
      formats: [...formats].sort(),
      classes: [...classes].sort(),
      levels: [...levels].sort(),
      states: [...states].sort(), // ← new
    }
  }, [allShoots])

  React.useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(Boolean)
    let result = [...(hasActiveFilters ? allShoots : shoots)]

    // STATE FILTER (new)
    if (filters.state) {
      result = result.filter(s => {
        const loc =
          s.useVenueLocation !== false && s.venue?.location
            ? s.venue.location
            : s.effectiveLocation || s.shootLocation || s.location
        return loc?.state === filters.state
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
      bowType: "",
      format: "",
      shootClass: "",
      skillLevel: "",
      distance: "",
    })
    setSort({ field: "", direction: "asc" })
  }

  return (
    <div className="d-flex flex-nowrap align-items-center gap-2 p-3 small overflow-auto border border-2 border-warning bg-warning-subtle">
      <select
        className="form-select form-select-sm w-auto"
        value={filters.distance}
        onChange={e => updateFilter("distance", e.target.value)}
        aria-label="Filter by distance"
      >
        <option value="">All distances</option>
        <option value="50" disabled={!userLocation}>Within 50 miles</option>
        <option value="100" disabled={!userLocation}>Within 100 miles</option>
      </select>

      {/* State filter – shows every state that has shoots */}
      <select
        className="form-select form-select-sm w-auto"
        value={filters.state}
        onChange={e => updateFilter("state", e.target.value)}
      >
        <option value="">All States</option>
        {options.states.map(st => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>

      <select
        className="form-select form-select-sm w-auto"
        value={filters.bowType}
        onChange={e => updateFilter("bowType", e.target.value)}
      >
        <option value="">Bow</option>
        {options.bowTypes.map(b => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select
        className="form-select form-select-sm w-auto"
        value={filters.format}
        onChange={e => updateFilter("format", e.target.value)}
      >
        <option value="">Format</option>
        {options.formats.map(f => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <select
        className="form-select form-select-sm w-auto"
        value={filters.shootClass}
        onChange={e => updateFilter("shootClass", e.target.value)}
      >
        <option value="">Class</option>
        {options.classes.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        className="form-select form-select-sm w-auto"
        value={filters.skillLevel}
        onChange={e => updateFilter("skillLevel", e.target.value)}
      >
        <option value="">Level</option>
        {options.levels.map(l => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn btn-sm btn-link text-decoration-none px-1"
        onClick={reset}
      >
        Reset
      </button>
    </div>
  )
}

export default ShootFilters
