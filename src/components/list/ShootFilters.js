import * as React from "react"

const ShootFilters = ({
  shoots,
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
  })

  const [sort, setSort] = React.useState({ field: "", direction: "asc" })

  const options = React.useMemo(() => {
    const bowTypes = new Set()
    const formats = new Set()
    const classes = new Set()
    const levels = new Set()
    const states = new Set()

    shoots.forEach(s => {
      s.bowTypes?.forEach(b => bowTypes.add(b))
      s.shootFormat?.forEach(f => formats.add(f))
      s.shootClass?.forEach(c => classes.add(c))
      s.skillLevel?.forEach(l => levels.add(l))

      const loc =
        s.useVenueLocation !== false && s.venue?.location
          ? s.venue.location
          : s.shootLocation
      if (loc?.state) states.add(loc.state)
    })

    return {
      bowTypes: [...bowTypes].sort(),
      formats: [...formats].sort(),
      classes: [...classes].sort(),
      levels: [...levels].sort(),
      states: [...states].sort(), // ← new
    }
  }, [shoots])

  React.useEffect(() => {
    let result = [...shoots]

    // STATE FILTER (new)
    if (filters.state) {
      result = result.filter(s => {
        const loc =
          s.useVenueLocation !== false && s.venue?.location
            ? s.venue.location
            : s.shootLocation
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

    onFilteredChange(result)
  }, [filters, shoots, onFilteredChange])

  const updateFilter = (key, value) => setFilters(p => ({ ...p, [key]: value }))

  const reset = () => {
    setFilters({
      state: "",
      bowType: "",
      format: "",
      shootClass: "",
      skillLevel: "",
    })
    setSort({ field: "", direction: "asc" })
  }

  return (
    <div className="d-flex flex-nowrap align-items-center gap-2 p-3 small overflow-auto border border-2 border-warning bg-warning-subtle">
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
