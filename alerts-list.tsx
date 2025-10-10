"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AlertItem = {
  id: string
  title: string
  distance: string
  time: string
}

const sampleAlerts: AlertItem[] = [
  { id: "1", title: "Fire reported near 5th Ave", distance: "0.5 mi", time: "2 min ago" },
  { id: "2", title: "Police activity on Maple St", distance: "1.2 mi", time: "10 min ago" },
  { id: "3", title: "Road accident at Pine Blvd", distance: "2.0 mi", time: "25 min ago" },
]

export function AlertsList() {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Nearby Alerts</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {sampleAlerts.map((a) => (
          <div key={a.id} className="flex items-start justify-between border rounded-md p-3">
            <div>
              <p className="font-medium">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.time}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary">{a.distance}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
