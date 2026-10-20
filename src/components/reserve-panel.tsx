"use client"

import { CalendarClock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { DateRangePicker } from "@/components/date-range-picker"
import { LeftBadge } from "@/components/left-badge"
import { Notice } from "@/components/notice"
import { buttonVariants } from "@/components/ui/button"
import { nextAvailableStay } from "@/lib/availability"
import { formatMoney, formatStayDate, nightLabel } from "@/lib/format"
import type { Room } from "@/lib/rooms"
import { bookPath } from "@/lib/search"
import { nightsBetween, quoteStay } from "@/lib/stay"
import { useStayAvailability } from "@/lib/use-availability"
import { useToday } from "@/lib/use-today"
import { cn } from "cn"

export function ReservePanel({ room }: { room: Room }) {
  const router = useRouter()
  const today = useToday()
  const { allBookings } = useAuth()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [attempted, setAttempted] = useState(false)

  const quote = quoteStay(room.nightlyRate, checkIn, checkOut, today || undefined)
  const availability = useStayAvailability(room.slug, checkIn, checkOut)
  const hasDates = checkIn !== "" && checkOut !== ""
  const stayState = availability.ready ? availability.result : null
  const blocking = stayState && !stayState.ok && stayState.reason !== "invalid" ? stayState : null
  const blocked = blocking !== null
  const error = blocking
    ? blocking.message
    : (hasDates || attempted) && !quote.ok
      ? quote.error
      : null
  const suggestion =
    blocking && blocking.reason === "sold-out" && today
      ? nextAvailableStay(room.slug, nightsBetween(checkIn, checkOut) ?? 1, allBookings, checkIn, today)
      : null

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    if (!quote.ok || blocked) return
    router.push(bookPath(checkIn, checkOut, room.slug))
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl bg-card p-5 shadow-[0_20px_50px_-30px_rgba(7,20,34,0.45)] ring-1 ring-foreground/10 lg:sticky lg:top-28"
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-4xl leading-none">
            {formatMoney(room.nightlyRate)}
            <span className="ml-2 font-sans text-sm text-muted-foreground">per night</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Taxes included</p>
        </div>
        <LeftBadge slug={room.slug} checkIn={hasDates ? checkIn : ""} checkOut={hasDates ? checkOut : ""} />
      </div>
      <div className="mt-5">
        <DateRangePicker
          idPrefix={`room-${room.slug}`}
          checkIn={checkIn}
          checkOut={checkOut}
          roomSlug={room.slug}
          months={1}
          onChange={(ci, co) => {
            setCheckIn(ci)
            setCheckOut(co)
          }}
        />
      </div>
      <div className="mt-4 min-h-[4.5rem]" aria-live="polite">
        {error ? (
          <div className="grid gap-2">
            <Notice>{error}</Notice>
            {suggestion ? (
              <button
                type="button"
                onClick={() => {
                  setCheckIn(suggestion.checkIn)
                  setCheckOut(suggestion.checkOut)
                }}
                className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-left text-sm outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <CalendarClock className="size-4 shrink-0" aria-hidden />
                <span>
                  Next free: {formatStayDate(suggestion.checkIn)} to {formatStayDate(suggestion.checkOut)}
                </span>
              </button>
            ) : null}
          </div>
        ) : quote.ok && !blocked ? (
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              {formatMoney(quote.nightlyRate)} × {nightLabel(quote.nights)}
            </span>
            <span className="text-2xl">{formatMoney(quote.total)}</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Choose dates to see the stay total and how many rooms are left.</p>
        )}
      </div>
      <button
        type="submit"
        disabled={blocked}
        className={cn(buttonVariants(), "mt-3 h-12 w-full rounded-full text-base")}
      >
        {hasDates ? "Continue to booking" : "Check dates and book"}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">No payment taken. This is a demo.</p>
    </form>
  )
}
