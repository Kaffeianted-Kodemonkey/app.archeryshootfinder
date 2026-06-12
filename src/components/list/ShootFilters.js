import * as React from "react"

const ShootFilters = ({ shoots, onFilteredChange, userLocation }) => {
  const [filters, setFilters] = React.useState({
    state: "",
    bowType: "",
    format: "",
    shootClass: "",
    skillLevel: "",
  })
  const [sort, setSort] = React.useState({ field: "", direction: "asc" })

  const options = React.useMemo(() => {
    const states = new Set()
    const bowTypes = new Set()
    const formats = new Set()
    const classes = new Set()
    const levels = new Set()

    shoots.forEach(s => {
      const loc =
        s.useVenueLocation !== false && s.venue?.location
          ? s.venue.location
          : s.shootLocation
      if (loc?.state) states.add(loc.state)
      s.bowTypes?.forEach(b => bowTypes.add(b))
      s.shootFormat?.forEach(f => formats.add(f))
      s.shootClass?.forEach(c => classes.add(c))
      s.skillLevel?.forEach(l => levels.add(l))
    })

    return {
      states: [...states].sort(),
      bowTypes: [...bowTypes].sort(),
      formats: [...formats].sort(),
      classes: [...classes].sort(),
      levels: [...levels].sort(),
    }
  }, [shoots])

  React.useEffect(() => {
    let result = [...shoots]

    if (filters.state) {
      result = result.filter(s => {
        const loc =
          s.useVenueLocation !== false && s.venue?.location
            ? s.venue.location
            : s.shootLocation
        return loc?.state === filters.state
      })
    }
    if (filters.bowType)
      result = result.filter(s => s.bowTypes?.includes(filters.bowType))
    if (filters.format)
      result = result.filter(s => s.shootFormat?.includes(filters.format))
    if (filters.shootClass)
      result = result.filter(s => s.shootClass?.includes(filters.shootClass))
    if (filters.skillLevel)
      result = result.filter(s => s.skillLevel?.includes(filters.skillLevel))

    if (sort.field === "state") {
      result.sort((a, b) => {
        const la =
          a.useVenueLocation !== false && a.venue?.location
            ? a.venue.location
            : a.shootLocation
        const lb =
          b.useVenueLocation !== false && b.venue?.location
            ? b.venue.location
            : b.shootLocation
        const sa = la?.state || ""
        const sb = lb?.state || ""
        return sort.direction === "asc"
          ? sa.localeCompare(sb)
          : sb.localeCompare(sa)
      })
    }

    onFilteredChange(result)
  }, [filters, sort, shoots, userLocation, onFilteredChange])

  const updateFilter = (key, value) => setFilters(p => ({ ...p, [key]: value }))
  const toggleSort = field => {
    const dir =
      sort.field === field && sort.direction === "asc" ? "desc" : "asc"
    setSort({ field, direction: dir })
  }
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
    <div className="d-flex flex-nowrap align-items-center gap-2 p-3 small overflow-auto border border-2 border-black bg-warning-subtle">
      <select
        className="form-select form-select-sm w-auto"
        value={filters.state}
        onChange={e => updateFilter("state", e.target.value)}
      >
        <option value="">State</option>
        {options.states.map(s => (
          <option key={s} value={s}>
            {s}
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
