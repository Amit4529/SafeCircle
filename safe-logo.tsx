"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

type SafeLogoProps = {
  className?: string
}

export function SafeLogo({ className }: SafeLogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <div
        aria-hidden="true"
        className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold"
      >
        {/* Simple shield-like glyph */}
        <span className="sr-only">SafeCircle</span>
        <span aria-hidden="true" className="text-xs">
          S
        </span>
      </div>
      <span className="font-semibold tracking-tight">SafeCircle</span>
    </Link>
  )
}
