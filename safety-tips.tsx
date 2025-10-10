"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SafetyTips() {
  const tips = [
    "Share your trip with a trusted contact and enable location sharing.",
    "Avoid poorly lit or isolated areas when possible.",
    "Keep emergency numbers handy and your phone charged.",
    "Trust your instincts—leave situations that feel unsafe.",
  ]
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Safety Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
