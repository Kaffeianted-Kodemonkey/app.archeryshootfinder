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
    association: "",
    distance: "",
    leagueSeries: "",
  })

  const [sort, setSort] = React.useState({ field: "", direction: "asc" })
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)

  const options = React.useMemo(() => {
    const bowTypes = new Set()
    const formats = new Set()
    const classes = new Set()
    const levels = new Set()
    const states = new Set()
    const cities = new Set()
    const associations = new Set()

    allShoots.forEach(s => {
      s.bowTypes?.forEach(b => bowTypes.add(b))
      s.shootFormat?.forEach(f => formats.add(f))
      s.shootClass?.forEach(c => classes.add(c))
      s.skillLevel?.forEach(l => levels.add(l))
      const association = s.associationType || s.association?.acronym
      if (association) associations.add(association)

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
      associations: [...associations].sort(),
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
    if (filters.association)
      result = result.filter(
        s =>
          (s.associationType || s.association?.acronym) === filters.association
      )
    if (filters.leagueSeries) {
      result = result.filter(s => {
        const grouped = s.isLeague === true || s.isLeague === "true" ||
          Boolean(String(s.seriesName || s.group?.groupName || "").trim())
        return filters.leagueSeries === "grouped" ? grouped : !grouped
      })
    }
    if (filters.distance && userLocation) {
      result = filterByDistance(result, userLocation, Number(filters.distance))
    }

    onFilteredChange(result)
  }, [filters, shoots, allShoots, userLocation, onFilteredChange])

  const updateFilter = (key, value) => {
    setFilters(p => ({ ...p, [key]: value }))
    setMobileFiltersOpen(false)
  }

  const reset = () => {
    setFilters({
      state: "",
      city: "",
      bowType: "",
      format: "",
      shootClass: "",
      skillLevel: "",
      association: "",
      distance: "",
      leagueSeries: "",
    })
    setSort({ field: "", direction: "asc" })
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <section
      className="border border-warning rounded bg-warning-subtle p-3 mb-3"
      aria-label="Refine event results"
    >
      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
        <button className="btn btn-link link-dark p-0 text-decoration-none d-lg-none" type="button"
          onClick={() => setMobileFiltersOpen(open => !open)} aria-expanded={mobileFiltersOpen}
          aria-controls="event-filter-options">
          <span className="fw-semibold">Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}</span>
        </button>
        <div className="d-none d-lg-block">
          <h2 className="h6 mb-0">Refine results</h2>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            onClick={reset}
          >
            Clear filters
          </button>
        )}
      </div>
      <div id="event-filter-options" className={`collapse ${mobileFiltersOpen ? "show" : ""} d-lg-block`}>
      <div className="row g-2 small">
        <div className="col-12 col-sm-6 col-lg-3">
        <select
          className="form-select form-select-sm w-100"
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
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
        <select
          className="form-select form-select-sm w-100"
          value={filters.association}
          onChange={e => updateFilter("association", e.target.value)}
          aria-label="Filter by rules association"
        >
          <option value="">Any rules association</option>
          {options.associations.map(association => (
            <option key={association} value={association}>
              {association}
            </option>
          ))}
        </select>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <select className="form-select form-select-sm w-100" value={filters.leagueSeries}
            onChange={e => updateFilter("leagueSeries", e.target.value)} aria-label="Filter by League or Series">
            <option value="">Any event grouping</option>
            <option value="grouped">League / Series</option>
            <option value="standalone">Standalone events</option>
          </select>
        </div>

        <div className="col-12 col-sm-6 col-lg-3"><select
          className="form-select form-select-sm w-100"
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
        </select></div>

        <div className="col-12 col-sm-6 col-lg-3"><select
          className="form-select form-select-sm w-100"
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
        </select></div>

        <div className="col-12 col-sm-6 col-lg-3"><select
          className="form-select form-select-sm w-100"
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
        </select></div>

        <div className="col-12 col-sm-6 col-lg-3"><select
          className="form-select form-select-sm w-100"
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
        </select></div>

        <div className="col-12 col-sm-6 col-lg-3"><select
          className="form-select form-select-sm w-100"
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
        </select></div>

        <select
          className="form-select form-select-sm col-12 col-sm-6 col-lg-3"
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
      </div>
    </section>
  )
}

export default ShootFilters
