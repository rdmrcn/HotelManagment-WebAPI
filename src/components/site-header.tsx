"use client"

import { Menu, UserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "cn"

const links = [
  { href: "/rooms", label: "Rooms" },
  { href: "/#house", label: "The house" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#location", label: "Location" },
  { href: "/ask", label: "Ask" },
]

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false
  const clean = pathname.replace(/\/+$/, "") || "/"
  return clean === href || clean.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const { status, guest } = useAuth()
  const [open, setOpen] = useState(false)
  const signedIn = status === "ready" && Boolean(guest)
  const accountHref = signedIn ? "/account" : "/sign-in"
  const accountLabel = signedIn ? (guest?.name.split(" ")[0] ?? "Account") : "Sign in"
  const booking = pathname.replace(/\/+$/, "") === "/book"

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 md:h-20">
        <Link
          href="/"
          className="font-serif text-[1.9rem] leading-none font-medium tracking-tight whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-4xl md:text-[2.6rem]"
        >
          Bosfor Hotels
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
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
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={accountHref}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hidden h-10 gap-2 rounded-full px-3 text-sm sm:inline-flex",
            )}
            aria-busy={status === "loading"}
          >
            <UserRound aria-hidden />
            <span className="max-w-24 truncate">{status === "loading" ? "Account" : accountLabel}</span>
          </Link>
          {booking ? null : (
            <Link href="/book" className={cn(buttonVariants(), "h-10 rounded-full px-4 text-sm md:px-5")}>
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">Book now</span>
            </Link>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="size-10 rounded-full lg:hidden" aria-label="Open the menu" />
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
                  href={accountHref}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-lg"
                >
                  {status === "loading" ? "Account" : signedIn ? `Account · ${accountLabel}` : "Sign in"}
                </Link>
                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), "mt-4 h-12 rounded-full text-base")}
                >
                  Book now
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
