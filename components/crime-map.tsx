"use client"

import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet"
import type { CrimeRecord } from "./types"
import { useEffect } from "react"

function FitBounds({ points }: { points: CrimeRecord[] }) {
  const map = useMap()
  useEffect(() => {
    if (!points.length) {
      // Default world view if no points
      map.setView([20, 0], 2)
      return
    }
    const valid = points.filter((p) => isFinite(p.latitude) && isFinite(p.longitude))
    if (!valid.length) return
    const bounds = valid.reduce(
      (acc, p) => {
        acc.minLat = Math.min(acc.minLat, p.latitude)
        acc.maxLat = Math.max(acc.maxLat, p.latitude)
        acc.minLng = Math.min(acc.minLng, p.longitude)
        acc.maxLng = Math.max(acc.maxLng, p.longitude)
        return acc
      },
      { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 },
    )
    const southWest: [number, number] = [bounds.minLat, bounds.minLng]
    const northEast: [number, number] = [bounds.maxLat, bounds.maxLng]
    map.fitBounds([southWest, northEast], { padding: [30, 30] })
  }, [points, map])
  return null
}

export default function CrimeMap({ points }: { points: CrimeRecord[] }) {
  return (
    <div className="rounded-md border overflow-hidden">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "520px", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {points.map((p) => (
          <CircleMarker
            key={`${p.crime_id}-${p.latitude}-${p.longitude}`}
            center={[p.latitude, p.longitude]}
            radius={5}
            pathOptions={{ color: "rgb(0, 122, 255)", fillColor: "rgb(0, 122, 255)", fillOpacity: 0.7 }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
              <div className="text-xs">
                <div>
                  <strong>{p.crime_type || "Crime"}</strong>
                </div>
                <div>
                  {p.date}
                  {p.time ? ` ${p.time}` : ""}
                </div>
                <div>{p.location}</div>
                <div className="opacity-80">{p.police_station}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
