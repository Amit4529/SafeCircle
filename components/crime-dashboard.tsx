"use client"

import { useMemo, useState } from "react"
import CsvUploader from "./csv-uploader"
import FilterBar, { type Filters } from "./filter-bar"
import CrimeMap from "./crime-map"
import type { CrimeRecord } from "./types"

function includesOrAll(selected: string, value: string) {
  return selected === "All" || (value || "").toLowerCase() === selected.toLowerCase()
}

export default function CrimeDashboard() {
  const [rows, setRows] = useState<CrimeRecord[] | null>(null)

  const [filters, setFilters] = useState<Filters>({
    startDate: "",
    endDate: "",
    crimeType: "All",
    policeStation: "All",
  })

  const crimeTypes = useMemo(() => {
    if (!rows) return []
    const set = new Set<string>()
    rows.forEach((r) => r.crime_type && set.add(r.crime_type))
    return Array.from(set).sort()
  }, [rows])

  const policeStations = useMemo(() => {
    if (!rows) return []
    const set = new Set<string>()
    rows.forEach((r) => r.police_station && set.add(r.police_station))
    return Array.from(set).sort()
  }, [rows])

  const filtered = useMemo(() => {
    if (!rows) return []
    const start = filters.startDate ? new Date(filters.startDate) : null
    const end = filters.endDate ? new Date(filters.endDate) : null
    // Adjust end date to be inclusive end-of-day if only date provided
    if (end && !filters.endDate.includes("T")) end.setHours(23, 59, 59, 999)

    return rows.filter((r) => {
      const dt = r.dateTime ?? (r.date ? new Date(r.date) : undefined)
      if (start && (!dt || dt < start)) return false
      if (end && (!dt || dt > end)) return false
      if (!includesOrAll(filters.crimeType, r.crime_type)) return false
      if (!includesOrAll(filters.policeStation, r.police_station)) return false
      return isFinite(r.latitude) && isFinite(r.longitude)
    })
  }, [rows, filters])

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      crimeType: "All",
      policeStation: "All",
    })
  }

  return (
    <div className="space-y-4">
      {!rows ? (
        <CsvUploader onData={setRows} />
      ) : (
        <>
          <FilterBar
            filters={filters}
            onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
            crimeTypes={crimeTypes}
            policeStations={policeStations}
            onReset={handleReset}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-80">
              Showing {filtered.length} of {rows.length} records
            </p>
            <button
              type="button"
              onClick={() => setRows(null)}
              className="h-8 px-3 rounded-md text-sm bg-(--color-accent) text-(--color-accent-foreground) border"
              aria-label="Load a different CSV"
            >
              Load different CSV
            </button>
          </div>
          <CrimeMap points={filtered} />
          <section className="rounded-md border p-3">
            <h2 className="text-sm font-medium mb-2">Visible crimes</h2>
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-(--color-card)">
                  <tr className="text-left">
                    <th className="py-2 pr-3">Date/Time</th>
                    <th className="py-2 pr-3">Type</th>
                    <th className="py-2 pr-3">Location</th>
                    <th className="py-2 pr-3">Police Station</th>
                    <th className="py-2 pr-3">Lat</th>
                    <th className="py-2 pr-3">Lng</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 2000).map((r, idx) => (
                    <tr key={`${r.crime_id}-${idx}`} className="border-t">
                      <td className="py-2 pr-3">
                        {r.date}
                        {r.time ? ` ${r.time}` : ""}
                      </td>
                      <td className="py-2 pr-3">{r.crime_type}</td>
                      <td className="py-2 pr-3">{r.location}</td>
                      <td className="py-2 pr-3">{r.police_station}</td>
                      <td className="py-2 pr-3">{r.latitude}</td>
                      <td className="py-2 pr-3">{r.longitude}</td>
                    </tr>
                  ))}
                  {filtered.length > 2000 && (
                    <tr>
                      <td colSpan={6} className="py-2 pr-3 opacity-70">
                        Showing first 2000 rows for performance.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
