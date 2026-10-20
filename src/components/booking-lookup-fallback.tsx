import { SearchX } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { authPath } from "@/lib/search"
import type { BookingLookup } from "@/lib/use-booking-ref"
import { cn } from "cn"

/** Loading, signed-out and not-found states shared by the confirmation and receipt pages. */
export function BookingLookupFallback({ lookup, returnTo }: { lookup: Exclude<BookingLookup, { state: "found" }>; returnTo: string }) {
  if (lookup.state === "loading") {
    return (
      <div role="status" className="mx-auto h-[28rem] max-w-xl animate-pulse rounded-3xl bg-muted">
        <span className="sr-only">Looking for your booking in this browser…</span>
      </div>
    )
  }

  if (lookup.state === "signed-out") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-card p-8 ring-1 ring-foreground/10">
        <h1 className="text-3xl">Sign in to see this booking</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Bookings are saved in this browser and belong to the account that paid for them. Sign in with the same email
          and password you used at checkout.
        </p>
        <Link href={authPath("/sign-in", returnTo)} className={cn(buttonVariants(), "mt-6 h-11 rounded-full px-5")}>
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border bg-card p-8">
      <SearchX className="size-6 text-muted-foreground" aria-hidden />
      <h1 className="mt-3 text-3xl">We could not find that booking</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {lookup.ref ? `No stay with the reference ${lookup.ref} is saved on this account in this browser.` : "This page needs a booking reference."}{" "}
        It may have been cancelled, or it was booked in another browser or with another account.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/account" className={cn(buttonVariants(), "h-11 rounded-full px-5")}>
          Your stays
        </Link>
        <Link href="/book" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full px-5")}>
          Reserve a room
        </Link>
      </div>
    </div>
  )
}
