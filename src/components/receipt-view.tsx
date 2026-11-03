"use client"

import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import { BookingLookupFallback } from "@/components/booking-lookup-fallback"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatIssued, formatMoney, formatStayDate, guestLabel, nightLabel } from "@/lib/format"
import { house } from "@/lib/house"
import { useCopy, useLocale } from "@/lib/i18n/use-locale"
import { sideFace } from "@/lib/i18n/room-face"
import { bedLabel } from "@/lib/i18n/room-face"
import { getRoom } from "@/lib/rooms"
import { useBookingRef } from "@/lib/use-booking-ref"
import { cn } from "cn"

export function ReceiptView() {
  const lookup = useBookingRef()
  const locale = useLocale()
  const copy = useCopy().receipt
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
          <ArrowLeft aria-hidden /> {copy.back}
        </Link>
        <Button type="button" className="h-11 rounded-full px-5" onClick={() => window.print()}>
          <Printer aria-hidden /> {copy.print}
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
              {copy.address}
              <br />
              {copy.area}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">{copy.voucher}</p>
            <h1 id="voucher-title" className="mt-1 text-4xl tracking-wide">
              {booking.confirmationCode}
            </h1>
            <p
              className={cn(
                "mt-2 inline-block rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase",
                payment ? "border-foreground" : "border-border text-muted-foreground",
              )}
            >
              {payment ? copy.paid : copy.notRecorded}
            </p>
          </div>
        </header>

        <section className="grid gap-x-10 gap-y-6 border-b border-border py-6 sm:grid-cols-2" aria-label={copy.stay}>
          <Block label={copy.guest}>
            <p className="font-medium">{guest.name}</p>
            <p className="text-sm text-muted-foreground">{guest.email}</p>
          </Block>
          <Block label={copy.room}>
            <p className="font-medium">{room?.name ?? copy.roomFallback}</p>
            {room ? (
              <p className="text-sm text-muted-foreground">
                {sideFace(room.side, locale).badge} · {bedLabel(room.bed, locale)} · {room.size}
              </p>
            ) : null}
          </Block>
          <Block label={copy.checkIn}>
            <p className="font-medium">{formatStayDate(booking.checkIn, locale)}</p>
            <p className="text-sm text-muted-foreground">
              {copy.from} {house.checkIn}
            </p>
          </Block>
          <Block label={copy.checkOut}>
            <p className="font-medium">{formatStayDate(booking.checkOut, locale)}</p>
            <p className="text-sm text-muted-foreground">
              {copy.by} {house.checkOut}
            </p>
          </Block>
          <Block label={copy.guests}>
            <p className="font-medium">{guestLabel(booking.guests, locale)}</p>
          </Block>
          <Block label={copy.length}>
            <p className="font-medium">{nightLabel(booking.nights, locale)}</p>
          </Block>
        </section>

        <section className="py-6" aria-label={copy.charges}>
          <table className="w-full text-sm">
            <caption className="sr-only">{copy.charges}</caption>
            <tbody>
              <tr>
                <th scope="row" className="py-2 text-left font-normal">
                  {room?.name ?? copy.roomFallback}, {formatMoney(booking.nightlyRate, locale)} × {nightLabel(booking.nights, locale)}
                </th>
                <td className="py-2 text-right">{formatMoney(booking.total, locale)}</td>
              </tr>
              <tr>
                <th scope="row" className="py-2 text-left font-normal text-muted-foreground">
                  {copy.taxes}
                </th>
                <td className="py-2 text-right text-muted-foreground">{copy.included}</td>
              </tr>
              <tr className="border-t-2 border-foreground">
                <th scope="row" className="pt-3 text-left text-base font-semibold">
                  {payment ? copy.totalPaid : copy.total}
                </th>
                <td className="pt-3 text-right font-serif text-3xl leading-none">{formatMoney(booking.total, locale)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="grid gap-x-10 gap-y-4 border-t border-border py-6 sm:grid-cols-2" aria-label={copy.payment}>
          <Block label={copy.method}>
            {payment ? (
              <p className="font-medium">
                {payment.brand} {copy.ending} {payment.last4}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{copy.savedBefore}</p>
            )}
          </Block>
          {payment ? (
            <Block label={copy.reference}>
              <p className="font-medium">{payment.reference}</p>
              <p className="text-sm text-muted-foreground">
                {copy.paidOn} {formatIssued(payment.paidAt, locale)}
              </p>
            </Block>
          ) : null}
        </section>

        <footer className="border-t border-border pt-6 text-xs leading-5 text-muted-foreground">
          <p>
            {copy.show} {booking.confirmationCode} {copy.atDesk} {formatIssued(booking.createdAt, locale)}.
          </p>
          <p className="mt-2 font-medium text-foreground">{copy.demo}</p>
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
