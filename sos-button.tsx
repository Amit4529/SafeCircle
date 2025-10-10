"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SOSButtonProps = {
  onClick?: () => void
  className?: string
}

export function SOSButton({ onClick, className }: SOSButtonProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Button
        aria-label="Send SOS alert"
        onClick={onClick}
        className="h-40 w-40 rounded-full bg-accent text-accent-foreground text-3xl font-extrabold shadow-lg hover:opacity-95 focus-visible:ring-4"
      >
        SOS
      </Button>
    </div>
  )
}
