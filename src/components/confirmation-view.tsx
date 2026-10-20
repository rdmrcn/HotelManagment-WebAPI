"use client"

import { CheckCircle2, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BookingLookupFallback } from "@/components/booking-lookup-fallback"
import { SideBadge } from "@/components/side-badge"
import { buttonVariants } from "@/components/ui/button"
import { formatMoney, formatStayDate, nightLabel } from "@/lib/format"
import { getRoom, roomCover } from "@/lib/rooms"
import { useBookingRef } from "@/lib/use-booking-ref"
import { cn } from "cn"

export function ConfirmationView() {
  const lookup = useBookingRef()
  if (lookup.state !== "found") {
    return <BookingLookupFallback lookup={lookup} returnTo={`/confirmation?ref=${lookup.state === "loading" ? "" : lookup.ref}`} />
  }

  const { booking, guest } = lookup
  const room = getRoom(booking.roomSlug)
  const payment = booking.payment
  const receiptHref = `/receipt?ref=${encodeURIComponent(booking.confirmationCode)}`

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10">
      {room ? (
        <div className="relative aspect-[16/8] bg-muted">
          <Image src={roomCover(room).src} alt="" fill className="object-cover" sizes="672px" priority />
        </div>
      ) : null}
      <div className="p-6 md:p-8">
        <p className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-primary uppercase">
          <CheckCircle2 className="size-4" aria-hidden /> {payment ? "Payment received · Booking confirmed" : "Booking confirmed"}
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl">{booking.confirmationCode}</h1>
        <p className="mt-4 text-base leading-7">
          {guest.name}, your {room?.name ?? "room"} is held from {formatStayDate(booking.checkIn)} to{" "}
          {formatStayDate(booking.checkOut)}. Keep this reference for check-in.
        </p>

        <dl className="mt-6 grid gap-3 text-sm">
          <Row label="Reference" value={booking.confirmationCode} />
          <Row
            label="Room"
            value={
              <span className="inline-flex flex-wrap items-center justify-end gap-2">
                {room?.name ?? "Room"}
                {room ? <SideBadge side={room.side} className="h-6 text-[0.7rem]" /> : null}
              </span>
            }
          />
          <Row label="Check-in" value={`${formatStayDate(booking.checkIn)}, from 15:00`} />
          <Row label="Check-out" value={`${formatStayDate(booking.checkOut)}, by 11:00`} />
          <Row label="Guests" value={String(booking.guests)} />
          <Row label="Nightly rate" value={`${formatMoney(booking.nightlyRate)} × ${nightLabel(booking.nights)}`} />
          <div className="flex justify-between gap-4 border-t border-border pt-3 text-base">
            <dt>Total paid</dt>
            <dd className="text-2xl leading-none">{formatMoney(booking.total)}</dd>
          </div>
          <Row
            label="Paid with"
            value={payment ? `${payment.brand} ending ${payment.last4}` : "Not recorded (saved before demo checkout)"}
          />
        </dl>

        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Demo checkout: no real charge was made. Bosfor Hotels is fictional and this booking lives in this browser.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={receiptHref} className={cn(buttonVariants(), "h-11 rounded-full px-5")}>
            <FileText aria-hidden /> View receipt
          </Link>
          <Link href="/account" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full px-5")}>
            Your stays
          </Link>
          <Link href="/book" className={cn(buttonVariants({ variant: "ghost" }), "h-11 rounded-full px-5")}>
            Reserve another stay
          </Link>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  )
}
