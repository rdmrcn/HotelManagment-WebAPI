"use client"

import { CheckCircle2, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BookingLookupFallback } from "@/components/booking-lookup-fallback"
import { SideBadge } from "@/components/side-badge"
import { buttonVariants } from "@/components/ui/button"
import { formatMoney, formatStayDate, nightLabel } from "@/lib/format"
import { useCopy, useLocale } from "@/lib/i18n/use-locale"
import { getRoom, roomCover } from "@/lib/rooms"
import { useBookingRef } from "@/lib/use-booking-ref"
import { cn } from "cn"

export function ConfirmationView() {
  const lookup = useBookingRef()
  const locale = useLocale()
  const copy = useCopy().confirmation
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
          <CheckCircle2 className="size-4" aria-hidden /> {payment ? copy.paid : copy.confirmed}
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl">{booking.confirmationCode}</h1>
        <p className="mt-4 text-base leading-7">
          {guest.name}
          {copy.your ? `, ${copy.your} ` : ", "}
          {room?.name ?? copy.roomFallback} {copy.held} {formatStayDate(booking.checkIn, locale)} {copy.to}{" "}
          {formatStayDate(booking.checkOut, locale)}. {copy.keepRef}
        </p>

        <dl className="mt-6 grid gap-3 text-sm">
          <Row label={copy.reference} value={booking.confirmationCode} />
          <Row
            label={copy.room}
            value={
              <span className="inline-flex flex-wrap items-center justify-end gap-2">
                {room?.name ?? copy.roomFallback}
                {room ? <SideBadge side={room.side} className="h-6 text-[0.7rem]" /> : null}
              </span>
            }
          />
          <Row label={copy.checkIn} value={`${formatStayDate(booking.checkIn, locale)}, ${copy.from}`} />
          <Row label={copy.checkOut} value={`${formatStayDate(booking.checkOut, locale)}, ${copy.by}`} />
          <Row label={copy.guests} value={String(booking.guests)} />
          <Row label={copy.nightly} value={`${formatMoney(booking.nightlyRate, locale)} × ${nightLabel(booking.nights, locale)}`} />
          <div className="flex justify-between gap-4 border-t border-border pt-3 text-base">
            <dt>{copy.totalPaid}</dt>
            <dd className="text-2xl leading-none">{formatMoney(booking.total, locale)}</dd>
          </div>
          <Row
            label={copy.paidWith}
            value={payment ? `${payment.brand} ${copy.ending} ${payment.last4}` : copy.notRecorded}
          />
        </dl>

        <p className="mt-4 text-xs leading-5 text-muted-foreground">{copy.demo}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={receiptHref} className={cn(buttonVariants(), "h-11 rounded-full px-5")}>
            <FileText aria-hidden /> {copy.receipt}
          </Link>
          <Link href="/account" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full px-5")}>
            {copy.stays}
          </Link>
          <Link href="/book" className={cn(buttonVariants({ variant: "ghost" }), "h-11 rounded-full px-5")}>
            {copy.another}
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
