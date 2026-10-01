"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DateRangeFields } from "@/components/date-range-fields"
import { Notice } from "@/components/notice"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { formatMoney, nightLabel } from "@/lib/format"
import type { Room } from "@/lib/rooms"
import { bookPath } from "@/lib/search"
import { quoteStay } from "@/lib/stay"

export function ReservePanel({ room }: { room: Room }) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [attempted, setAttempted] = useState(false)

  const quote = quoteStay(room.nightlyRate, checkIn, checkOut)
  const error = (attempted || (checkIn !== "" && checkOut !== "")) && !quote.ok ? quote.error : null

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    const result = quoteStay(room.nightlyRate, checkIn, checkOut)
    if (!result.ok) return
    router.push(bookPath(checkIn, checkOut, room.slug))
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 lg:sticky lg:top-24"
    >
      <p className="text-sm text-muted-foreground">Nightly rate</p>
      <p className="mt-1 text-4xl">
        {formatMoney(room.nightlyRate)}
        <span className="ml-2 font-sans text-base text-muted-foreground">a night</span>
      </p>
      <div className="mt-5">
        <DateRangeFields
          idPrefix={`room-${room.slug}`}
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckIn={setCheckIn}
          onCheckOut={setCheckOut}
        />
      </div>
      <div className="mt-4 min-h-12" aria-live="polite">
        {quote.ok ? (
          <p className="text-sm leading-6">
            {nightLabel(quote.nights)} · stay total {formatMoney(quote.total)}
          </p>
        ) : error ? (
          <Notice>{error}</Notice>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add dates to see the price for this room.
          </p>
        )}
      </div>
      <button type="submit" className={cn(buttonVariants(), "mt-4 h-11 w-full rounded-full")}>
        Continue to booking
      </button>
    </form>
  )
}
