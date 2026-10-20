"use client"

import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import { BookingLookupFallback } from "@/components/booking-lookup-fallback"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatMoney, formatStayDate, nightLabel } from "@/lib/format"
import { house } from "@/lib/house"
import { getRoom, sideInfo } from "@/lib/rooms"
import { useBookingRef } from "@/lib/use-booking-ref"
import { cn } from "cn"

function formatIssued(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short" }).format(date)
}

export function ReceiptView() {
  const lookup = useBookingRef()
  if (lookup.state !== "found") {
    return <BookingLookupFallback lookup={lookup} returnTo={`/receipt?ref=${lookup.state === "loading" ? "" : lookup.ref}`} />
  }

  const { booking, guest } = lookup
  const room = getRoom(booking.roomSlug)
  const payment = booking.payment
  const confirmationHref = `/confirmation?ref=${encodeURIComponent(booking.confirmationCode)}`

  return (
    <div>
      <div className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={confirmationHref} className={cn(buttonVariants({ variant: "ghost" }), "h-10 rounded-full px-3")}>
          <ArrowLeft aria-hidden /> Back to confirmation
        </Link>
        <Button type="button" className="h-11 rounded-full px-5" onClick={() => window.print()}>
          <Printer aria-hidden /> Print or save as PDF
        </Button>
      </div>

      <article
        aria-labelledby="voucher-title"
        className="mx-auto max-w-3xl rounded-2xl bg-card p-6 ring-1 ring-foreground/10 md:p-10 print:max-w-none print:rounded-none print:bg-white print:p-0 print:shadow-none print:ring-0"
      >
        <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-foreground pb-6">
          <div>
            <p className="font-serif text-3xl leading-none">{house.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Hillside street above the waterfront
              <br />
              Bebek, Beşiktaş, Istanbul
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">Reservation voucher</p>
            <h1 id="voucher-title" className="mt-1 text-4xl tracking-wide">
              {booking.confirmationCode}
            </h1>
            <p
              className={cn(
                "mt-2 inline-block rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase",
                payment ? "border-foreground" : "border-border text-muted-foreground",
              )}
            >
              {payment ? "Paid" : "Payment not recorded"}
            </p>
          </div>
        </header>

        <section className="grid gap-x-10 gap-y-6 border-b border-border py-6 sm:grid-cols-2" aria-label="Stay details">
          <Block label="Guest">
            <p className="font-medium">{guest.name}</p>
            <p className="text-sm text-muted-foreground">{guest.email}</p>
          </Block>
          <Block label="Room">
            <p className="font-medium">{room?.name ?? "Room"}</p>
            {room ? (
              <p className="text-sm text-muted-foreground">
                {sideInfo[room.side].badge} · {room.bed} · {room.size}
              </p>
            ) : null}
          </Block>
          <Block label="Check-in">
            <p className="font-medium">{formatStayDate(booking.checkIn)}</p>
            <p className="text-sm text-muted-foreground">From {house.checkIn}</p>
          </Block>
          <Block label="Check-out">
            <p className="font-medium">{formatStayDate(booking.checkOut)}</p>
            <p className="text-sm text-muted-foreground">By {house.checkOut}</p>
          </Block>
          <Block label="Guests">
            <p className="font-medium">{booking.guests === 1 ? "1 guest" : `${booking.guests} guests`}</p>
          </Block>
          <Block label="Length of stay">
            <p className="font-medium">{nightLabel(booking.nights)}</p>
          </Block>
        </section>

        <section className="py-6" aria-label="Charges">
          <table className="w-full text-sm">
            <caption className="sr-only">Charges</caption>
            <tbody>
              <tr>
                <th scope="row" className="py-2 text-left font-normal">
                  {room?.name ?? "Room"}, {formatMoney(booking.nightlyRate)} × {nightLabel(booking.nights)}
                </th>
                <td className="py-2 text-right">{formatMoney(booking.total)}</td>
              </tr>
              <tr>
                <th scope="row" className="py-2 text-left font-normal text-muted-foreground">
                  Taxes
                </th>
                <td className="py-2 text-right text-muted-foreground">Included</td>
              </tr>
              <tr className="border-t-2 border-foreground">
                <th scope="row" className="pt-3 text-left text-base font-semibold">
                  Total {payment ? "paid" : ""}
                </th>
                <td className="pt-3 text-right font-serif text-3xl leading-none">{formatMoney(booking.total)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="grid gap-x-10 gap-y-4 border-t border-border py-6 sm:grid-cols-2" aria-label="Payment">
          <Block label="Payment method">
            {payment ? (
              <p className="font-medium">
                {payment.brand} ending {payment.last4}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Saved before demo checkout existed.</p>
            )}
          </Block>
          {payment ? (
            <Block label="Payment reference">
              <p className="font-medium">{payment.reference}</p>
              <p className="text-sm text-muted-foreground">Paid {formatIssued(payment.paidAt)}</p>
            </Block>
          ) : null}
        </section>

        <footer className="border-t border-border pt-6 text-xs leading-5 text-muted-foreground">
          <p>
            Show this voucher or the reference {booking.confirmationCode} at the front desk. Issued{" "}
            {formatIssued(booking.createdAt)}.
          </p>
          <p className="mt-2 font-medium text-foreground">
            Demo voucher. Bosfor Hotels is a fictional brand, no real charge was made and this is not a valid
            reservation.
          </p>
        </footer>
      </article>
    </div>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}
