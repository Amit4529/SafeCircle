// import CrimeDashboard from "@/components/crime-dashboard"
// import CrimeDashboard from "./src/components/crime-dashboard"
import CrimeDashboard from "../components/crime-dashboard"


// /home/anant/next_js_crime_/components/crime-dashboard.tsx
export default function Page() {
  return (
    <main className="p-6 max-w-7xl mx-auto space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-pretty">Crime Map & Filters</h1>
        <p className="text-sm opacity-80">
          Upload your CSV, then filter by date range, crime type, and police station.
        </p>
      </header>
      <CrimeDashboard />
    </main>
  )
}
