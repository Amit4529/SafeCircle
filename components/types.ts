export type CrimeRecord = {
  crime_id: string
  date: string // original value from CSV (YYYY-MM-DD or similar)
  time?: string // original value from CSV, optional
  crime_type: string
  location: string
  police_station: string
  latitude: number
  longitude: number
  dateTime?: Date // derived for filtering and map usage
}
