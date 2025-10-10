"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileTabs() {
  const pathname = usePathname()
  const items = [
    { href: "/home", label: "Home" },
    { href: "/safety", label: "Safety" },
    { href: "/report", label: "Report" },
    { href: "/profile", label: "Profile" },
  ]
  return (
    <nav aria-label="Bottom navigation" className="fixed inset-x-0 bottom-0 border-t bg-card z-40">
      <ul className="mx-auto max-w-5xl grid grid-cols-4">
        {items.map((it) => {
          const active = pathname === it.href
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "block text-center py-3 text-sm",
                  active ? "text-foreground font-medium" : "text-muted-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {it.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
