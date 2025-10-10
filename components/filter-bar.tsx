"use client"

type Filters = {
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  crimeType: string // "All" or specific
  policeStation: string // "All" or specific
}

type FilterBarProps = {
  filters: Filters
  onChange: (next: Partial<Filters>) => void
  crimeTypes: string[]
  policeStations: string[]
  onReset: () => void
}

export type { Filters }

export default function FilterBar({ filters, onChange, crimeTypes, policeStations, onReset }: FilterBarProps) {
  return (
    <section className="rounded-md border p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-70" htmlFor="startDate">
            Start date
          </label>
          <input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="h-9 rounded-md border px-2 text-sm bg-(--color-card) text-(--color-card-foreground)"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-70" htmlFor="endDate">
            End date
          </label>
          <input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="h-9 rounded-md border px-2 text-sm bg-(--color-card) text-(--color-card-foreground)"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-70" htmlFor="crimeType">
            Crime type
          </label>
          <select
            id="crimeType"
            value={filters.crimeType}
            onChange={(e) => onChange({ crimeType: e.target.value })}
            className="h-9 rounded-md border px-2 text-sm bg-(--color-card) text-(--color-card-foreground)"
          >
            <option value="All">All</option>
            {crimeTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-70" htmlFor="policeStation">
            Police station
          </label>
          <select
            id="policeStation"
            value={filters.policeStation}
            onChange={(e) => onChange({ policeStation: e.target.value })}
            className="h-9 rounded-md border px-2 text-sm bg-(--color-card) text-(--color-card-foreground)"
          >
            <option value="All">All</option>
            {policeStations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={onReset}
          className="h-8 px-3 rounded-md text-sm bg-(--color-secondary) text-(--color-secondary-foreground) border"
        >
          Reset filters
        </button>
      </div>
    </section>
  )
}
