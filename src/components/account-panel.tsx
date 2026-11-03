"use client"

import { CalendarDays, FileText, LogOut, Trash2, UserRound } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Notice } from "@/components/notice"
import { PageHeader } from "@/components/page-header"
import { SideBadge } from "@/components/side-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatMoney, formatStayDate, guestLabel, nightLabel } from "@/lib/format"
import { localizeMessage } from "@/lib/i18n/errors"
import { useCopy, useLocale } from "@/lib/i18n/use-locale"
import { getRoom, roomCover } from "@/lib/rooms"
import { cn } from "cn"

export function AccountPanel() {
  const { status, guest, bookings, storageError, reload, signOut, removeBooking } = useAuth()
  const locale = useLocale()
  const copy = useCopy().accountPanel
  const roomWord = useCopy().receipt.roomFallback
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (status === "loading") {
    return (
      <div role="status" className="grid gap-6">
        <div className="h-28 max-w-xl animate-pulse rounded-2xl bg-muted" />
        <div className="h-44 animate-pulse rounded-2xl bg-muted" />
        <span className="sr-only">{copy.checking}</span>
      </div>
    )
  }

  if (storageError) {
    return (
      <div className="max-w-xl">
        <PageHeader
          eyebrow={copy.eyebrow}
          title={copy.unreadableTitle}
          lede={copy.unreadableLede}
        />
        <div className="mt-6 grid gap-4">
          <Notice>{localizeMessage(storageError, locale)}</Notice>
          <Button type="button" className="h-11 w-fit rounded-full px-5" onClick={reload}>
            {copy.tryAgain}
          </Button>
        </div>
      </div>
    )
  }

  if (!guest) {
    return (
      <div className="max-w-xl">
        <PageHeader
          eyebrow={copy.eyebrow}
          title={copy.signedOutTitle}
          lede={copy.signedOutLede}
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/sign-in" className={cn(buttonVariants(), "h-11 rounded-full px-5")}>
            {copy.signIn}
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full px-5")}>
            {copy.create}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:flex-row sm:items-center md:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">{copy.signedIn}</p>
            <h1 className="truncate text-3xl md:text-4xl">{guest.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{guest.email}</p>
          </div>
        </div>
        <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={signOut}>
          <LogOut aria-hidden /> {copy.signOut}
        </Button>
      </div>

      <div className="mt-10 flex items-end justify-between gap-4">
        <h2 className="text-3xl">{copy.stays}</h2>
        <Link href="/book" className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-full px-4")}>
          {copy.newBooking}
        </Link>
      </div>
      {error ? (
        <div className="mt-4">
          <Notice>{localizeMessage(error, locale)}</Notice>
        </div>
      ) : null}

      {bookings.length === 0 ? (
        <div className="mt-6 max-w-xl rounded-2xl border border-dashed border-border bg-card p-6">
          <CalendarDays className="size-6 text-muted-foreground" aria-hidden />
          <h3 className="mt-3 text-2xl">{copy.emptyTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.emptyBody}</p>
          <Link href="/book" className={cn(buttonVariants(), "mt-5 h-11 rounded-full px-5")}>
            {copy.reserve}
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4">
          {bookings.map((booking) => {
            const room = getRoom(booking.roomSlug)
            return (
              <li key={booking.id} className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row">
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted sm:h-auto sm:min-h-32 sm:w-48 sm:shrink-0">
                  {room ? (
                    <Image src={roomCover(room).src} alt="" fill className="object-cover" sizes="192px" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                      {booking.confirmationCode}
                    </p>
                    {room ? <SideBadge side={room.side} className="h-6 text-[0.7rem]" /> : null}
                  </div>
                  <h3 className="mt-1 text-2xl">{room?.name ?? roomWord}</h3>
                  <p className="mt-2 text-sm leading-6">
                    {formatStayDate(booking.checkIn, locale)} {copy.to} {formatStayDate(booking.checkOut, locale)}
                    <span className="text-muted-foreground"> · {nightLabel(booking.nights, locale)}</span>
                  </p>
                  <p className="mt-1 text-sm">
                    {formatMoney(booking.nightlyRate, locale)} {copy.aNight} · {formatMoney(booking.total, locale)} {copy.total}
                    <span className="text-muted-foreground"> · {guestLabel(booking.guests, locale)}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {booking.payment
                      ? `${copy.paidWith} ${booking.payment.brand} ${copy.ending} ${booking.payment.last4}`
                      : copy.notRecorded}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/receipt?ref=${encodeURIComponent(booking.confirmationCode)}`}
                      className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-full px-4")}
                    >
                      <FileText aria-hidden /> {copy.receipt}
                    </Link>
                    {confirmingId === booking.id ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm">{copy.cancelAsk}</span>
                        <Button
                          type="button"
                          variant="destructive"
                          className="h-9 rounded-full px-4"
                          onClick={() => {
                            const result = removeBooking(booking.id)
                            setConfirmingId(null)
                            setError(result.ok ? null : result.error)
                          }}
                        >
                          {copy.cancelYes}
                        </Button>
                        <Button type="button" variant="outline" className="h-9 rounded-full px-4" onClick={() => setConfirmingId(null)}>
                          {copy.keep}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-9 rounded-full px-3 text-muted-foreground"
                        onClick={() => setConfirmingId(booking.id)}
                      >
                        <Trash2 aria-hidden /> {copy.cancel}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
