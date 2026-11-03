"use client"

import { Menu, UserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { ContactStrip } from "@/components/contact-strip"
import { LanguageToggle } from "@/components/language-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCopy } from "@/lib/i18n/use-locale"
import { cn } from "cn"

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false
  const clean = pathname.replace(/\/+$/, "") || "/"
  return clean === href || clean.startsWith(`${href}/`)
}

export function SkipLink() {
  const copy = useCopy()
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-background focus:px-4 focus:py-2"
    >
      {copy.skip}
    </a>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const { status, guest } = useAuth()
  const copy = useCopy()
  const [open, setOpen] = useState(false)
  const signedIn = status === "ready" && Boolean(guest)
  const accountHref = signedIn ? "/account" : "/sign-in"
  const accountLabel = signedIn ? (guest?.name.split(" ")[0] ?? copy.account.account) : copy.account.signIn
  const clean = pathname.replace(/\/+$/, "") || "/"
  const booking = clean === "/book"
  const roomSlug = clean.match(/^\/rooms\/([a-z0-9-]+)$/)?.[1]
  const bookHref = roomSlug ? `/book?room=${roomSlug}` : "/book"
  const links = [
    { href: "/rooms", label: copy.nav.rooms },
    { href: "/#house", label: copy.nav.house },
    { href: "/#gallery", label: copy.nav.gallery },
    { href: "/#location", label: copy.nav.location },
    { href: "/ask", label: copy.nav.ask },
    { href: "/contact", label: copy.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur print:hidden">
      <ContactStrip />
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 md:h-20">
        <Link
          href="/"
          className="font-serif text-[1.7rem] leading-none font-medium tracking-tight whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-4xl md:text-[2.6rem]"
        >
          Bosfor Hotels
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label={copy.nav.primary}>
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
          <LanguageToggle />
          <Link
            href={accountHref}
            className={cn(buttonVariants({ variant: "ghost" }), "hidden h-10 gap-2 rounded-full px-3 text-sm sm:inline-flex")}
            aria-busy={status === "loading"}
          >
            <UserRound aria-hidden />
            <span className="max-w-24 truncate">{status === "loading" ? copy.account.loading : accountLabel}</span>
          </Link>
          {booking ? null : (
            <Link href={bookHref} className={cn(buttonVariants(), "h-10 rounded-full px-3 text-sm sm:px-4 md:px-5")}>
              <span className="sm:hidden">{copy.book}</span>
              <span className="hidden sm:inline">{copy.bookNow}</span>
            </Link>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="outline" size="icon" className="size-10 rounded-full lg:hidden" aria-label={copy.account.openMenu} />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <SheetHeader>
                <SheetTitle className="font-serif text-3xl">Bosfor Hotels</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label={copy.nav.mobile}>
                {links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-lg">
                    {link.label}
                  </Link>
                ))}
                <Link href={accountHref} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-lg">
                  {status === "loading" ? copy.account.loading : signedIn ? `${copy.account.account} · ${accountLabel}` : copy.account.signIn}
                </Link>
                <Link href={bookHref} onClick={() => setOpen(false)} className={cn(buttonVariants(), "mt-4 h-12 rounded-full text-base")}>
                  {copy.bookNow}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
