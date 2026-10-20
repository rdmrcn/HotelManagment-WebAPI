"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DateRangePicker } from "@/components/date-range-picker"
import { Notice } from "@/components/notice"
import { buttonVariants } from "@/components/ui/button"
import { lastBookableCheckOut, windowMessage } from "@/lib/availability"
import { formatMoney } from "@/lib/format"
import { lowestNightlyRate } from "@/lib/rooms"
import { validateStay } from "@/lib/stay"
import { useToday } from "@/lib/use-today"
import { cn } from "cn"

export function StaySearch() {
  const router = useRouter()
  const today = useToday()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [error, setError] = useState<string | null>(null)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!checkIn && !checkOut) {
      router.push("/rooms")
      return
    }
    const message = validateStay(checkIn, checkOut, today || undefined)
    if (message) {
      setError(message)
      return
    }
    if (today && checkOut > lastBookableCheckOut(today)) {
      setError(windowMessage(today))
      return
    }
    router.push(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}`)
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Search availability"
      className="rounded-3xl bg-background p-4 text-foreground shadow-[0_30px_70px_-34px_rgba(7,20,34,0.7)] ring-1 ring-foreground/10 md:p-5"
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <DateRangePicker
          idPrefix="home"
          checkIn={checkIn}
          checkOut={checkOut}
          className="md:max-w-xl"
          onChange={(ci, co) => {
            setCheckIn(ci)
            setCheckOut(co)
            setError(null)
          }}
        />
        <button type="submit" className={cn(buttonVariants(), "h-14 rounded-full px-8 text-base")}>
          <Search aria-hidden /> Check availability
        </button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Eight room types from {formatMoney(lowestNightlyRate())} a night, taxes included. See how many are left for your
        dates.
      </p>
      {error ? (
        <div className="mt-3">
          <Notice>{error}</Notice>
        </div>
      ) : null}
    </form>
  )
}
