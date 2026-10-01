import Link from "next/link"

const links = [
  { href: "/", label: "The house" },
  { href: "/rooms", label: "Rooms" },
  { href: "/book", label: "Book" },
  { href: "/account", label: "Account" },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl">Aurelia</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            A fictional 28-room house above the harbor at Cala Vespera. Breakfast on the terrace, and rooms that stay quiet in the afternoon.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Visit</p>
          <p className="mt-3 text-sm leading-6">
            14 Via della Cala
            <br />
            Cala Vespera
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Check-in from 15:00
            <br />
            Check-out by 11:00
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground text-muted-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-serif text-lg">Reha Demircan</p>
            <p className="mt-1 text-sm text-muted-foreground">© {year} Reha Demircan. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
