"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type QuickActionsProps = {
  onShareLocation?: () => void
  onCallContact?: () => void
}

export function QuickActions({ onShareLocation, onCallContact }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="rounded-lg shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Share My Location</p>
            <p className="text-sm text-muted-foreground">Send your live location</p>
          </div>
          <Button onClick={onShareLocation} variant="default">
            Share
          </Button>
        </CardContent>
      </Card>
      <Card className="rounded-lg shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Call Emergency Contact</p>
            <p className="text-sm text-muted-foreground">Dial your primary contact</p>
          </div>
          <Button onClick={onCallContact} variant="outline">
            Call
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
