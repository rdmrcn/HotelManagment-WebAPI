"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "cn"

const links = [
  { href: "/", label: "The house" },
  { href: "/rooms", label: "Rooms" },
  { href: "/book", label: "Book" },
  { href: "/ask", label: "Ask" },
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const { status, guest } = useAuth()
  const [open, setOpen] = useState(false)
  const accountHref = status === "ready" && guest ? "/account" : "/sign-in"
  const accountLabel = status === "ready" && guest ? "Account" : "Sign in"

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="font-serif text-[1.85rem] leading-none tracking-tight whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-4xl"
        >
          Bosfor Hotels
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive(pathname, link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            className={cn(
              "text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive(pathname, accountHref) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            aria-busy={status === "loading"}
          >
            {status === "loading" ? "Sign in" : accountLabel}
          </Link>
        </nav>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open the menu"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <SheetHeader>
              <SheetTitle className="font-serif text-3xl">Bosfor Hotels</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-lg"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={status === "loading" ? "/sign-in" : accountHref}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-lg"
              >
                {status === "loading" ? "Sign in" : accountLabel}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
