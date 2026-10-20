import { Info } from "lucide-react"
import Link from "next/link"
import { AUTHOR, REPO_URL, house } from "@/lib/house"

const explore = [
  { href: "/rooms", label: "Rooms" },
  { href: "/book", label: "Book a stay" },
  { href: "/#house", label: "The house" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#location", label: "Location" },
  { href: "/account", label: "Your account" },
]

function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-[#0b2238] text-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-14 pb-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-serif text-4xl text-white">Bosfor Hotels</p>
          <p className="mt-4 max-w-sm text-sm leading-6">
            A house hotel on a hillside street in Bebek, with eight room types. Half of them look over the
            Bosphorus, the rest look at the street.
          </p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-medium tracking-[0.18em] text-white/60 uppercase">Visit</h2>
          <address className="mt-4 text-sm leading-6 not-italic">
            Hillside street above the waterfront
            <br />
            {house.area}
          </address>
          <p className="mt-3 text-sm leading-6">
            Check-in from {house.checkIn}
            <br />
            Check-out by {house.checkOut}
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="font-sans text-xs font-medium tracking-[0.18em] text-white/60 uppercase">Explore</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {explore.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-sans text-xs font-medium tracking-[0.18em] text-white/60 uppercase">Contact and policies</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6">
            <li>
              Questions? <Link href="/ask" className="text-white underline underline-offset-4">Ask the concierge</Link>
            </li>
            <li>Rates are per room, per night, taxes included.</li>
            <li>No payment is taken. Bookings are saved in your browser only.</li>
            <li>Cancel any saved stay from your account.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-6 pb-24 text-sm md:pb-6">
          <p className="flex items-start gap-2 leading-6 text-white/90">
            <Info className="mt-1 size-4 shrink-0" aria-hidden />
            <span>
              <strong className="font-medium">Demo project, fictional brand.</strong> Bosfor Hotels is not a real
              hotel. Nothing here is for sale, and no data leaves your browser.
            </span>
          </p>
          <div className="flex flex-col gap-2 text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} Designed and built by{" "}
              <a
                href={AUTHOR.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline underline-offset-4"
              >
                {AUTHOR.name}
              </a>
              .
            </p>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white hover:underline"
            >
              <GithubMark /> Source on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
