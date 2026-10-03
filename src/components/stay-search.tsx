"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DateRangeFields } from "@/components/date-range-fields"
import { Notice } from "@/components/notice"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { formatMoney } from "@/lib/format"
import { lowestNightlyRate } from "@/lib/rooms"
import { bookPath } from "@/lib/search"
import { validateStay } from "@/lib/stay"

export function StaySearch() {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [error, setError] = useState<string | null>(null)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = validateStay(checkIn, checkOut)
    if (message) {
      setError(message)
      return
    }
    router.push(bookPath(checkIn, checkOut, ""))
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl bg-background p-4 text-foreground shadow-[0_24px_60px_-32px_rgba(7,20,34,0.55)] ring-1 ring-foreground/10 md:p-5"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <DateRangeFields
          idPrefix="home"
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckIn={(value) => {
            setCheckIn(value)
            setError(null)
          }}
          onCheckOut={(value) => {
            setCheckOut(value)
            setError(null)
          }}
        />
        <button type="submit" className={cn(buttonVariants(), "h-11 rounded-full px-6")}>
          See stay prices
        </button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Eight rooms, from {formatMoney(lowestNightlyRate())} a night. Taxes included.
      </p>
      {error ? (
        <div className="mt-3">
          <Notice>{error}</Notice>
        </div>
      ) : null}
    </form>
  )
}
