"use client"

import Link from "next/link"
import { SafeLogo } from "./safe-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function AppBar() {
  return (
    <header className="w-full border-b bg-card">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <SafeLogo />
        <nav aria-label="Primary" className="hidden md:flex items-center gap-4">
          <Link className="text-sm hover:underline" href="/home">
            Home
          </Link>
          <Link className="text-sm hover:underline" href="/report">
            Report
          </Link>
          <Link className="text-sm hover:underline" href="/profile">
            Profile
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline" className="md:hidden bg-transparent">
            <Link href="/home">Open App</Link>
          </Button>
          <Avatar>
            <AvatarImage alt="Profile avatar" src="/diverse-profile-avatars.png" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
