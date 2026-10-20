"use client"

import { SearchX } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { DateRangePicker } from "@/components/date-range-picker"
import { Notice } from "@/components/notice"
import { RoomCard } from "@/components/room-card"
import { Button } from "@/components/ui/button"
import { nightAvailability, stayAvailability, windowMessage } from "@/lib/availability"
import { rooms, sideInfo, type RoomSide } from "@/lib/rooms"
import { validateStay } from "@/lib/stay"
import { useToday } from "@/lib/use-today"
import { cn } from "cn"

type SideFilter = "all" | RoomSide
type Sort = "price-asc" | "price-desc" | "size" | "left"

const sideOptions: { value: SideFilter; label: string }[] = [
  { value: "all", label: "All rooms" },
  { value: "bosphorus", label: sideInfo.bosphorus.label },
  { value: "city", label: sideInfo.city.label },
]

export function RoomsBrowser() {
  const params = useSearchParams()
  const today = useToday()
  const { status, allBookings } = useAuth()
  const [checkIn, setCheckIn] = useState(params.get("checkIn") ?? "")
  const [checkOut, setCheckOut] = useState(params.get("checkOut") ?? "")
  const [side, setSide] = useState<SideFilter>("all")
  const [sort, setSort] = useState<Sort>("price-asc")
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const ready = today !== "" && status === "ready"
  const hasDates = checkIn !== "" && checkOut !== ""
  const dateError = ready && hasDates ? validateStay(checkIn, checkOut, today) : null
  const validDates = ready && hasDates && !dateError
  const windowIssue = validDates ? stayAvailability("standard", checkIn, checkOut, allBookings, today) : null
  const outOfWindow = windowIssue && !windowIssue.ok && windowIssue.reason === "out-of-window"

  const visible = useMemo(() => {
    const list = rooms.filter((room) => side === "all" || room.side === side)
    const leftFor = (slug: string) => {
      if (!ready) return 0
      if (validDates && !outOfWindow) {
        const result = stayAvailability(slug, checkIn, checkOut, allBookings, today)
        if (result.ok) return result.left
        return 0
      }
      return nightAvailability(slug, today, allBookings).left
    }
    const filtered = onlyAvailable && validDates && !outOfWindow ? list.filter((room) => leftFor(room.slug) > 0) : list
    return [...filtered].sort((a, b) => {
      if (sort === "price-desc") return b.nightlyRate - a.nightlyRate
      if (sort === "size") return parseInt(b.size) - parseInt(a.size)
      if (sort === "left") return leftFor(b.slug) - leftFor(a.slug)
      return a.nightlyRate - b.nightlyRate
    })
  }, [side, sort, onlyAvailable, ready, validDates, outOfWindow, checkIn, checkOut, allBookings, today])

  return (
    <div>
      <div className="z-30 -mx-5 border-b border-border bg-background/95 px-5 py-3 backdrop-blur lg:sticky lg:top-20">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-center">
          <DateRangePicker
            idPrefix="rooms"
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(ci, co) => {
              setCheckIn(ci)
              setCheckOut(co)
            }}
          />
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div role="group" aria-label="Filter by side of the house" className="flex flex-wrap gap-1.5">
              {sideOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={side === option.value}
                  onClick={() => setSide(option.value)}
                  className={cn(
                    "h-10 rounded-full px-4 text-sm outline-none ring-1 ring-foreground/15 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    side === option.value
                      ? "bg-foreground text-background ring-foreground"
                      : "bg-background hover:bg-muted",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className="flex h-10 items-center gap-2 text-sm">
              <span className="text-muted-foreground">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="h-10 rounded-full border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="size">Largest first</option>
                <option value="left">Most rooms left</option>
              </select>
            </label>
            <label className={cn("flex h-10 items-center gap-2 text-sm", !validDates && "opacity-50")}>
              <input
                type="checkbox"
                checked={onlyAvailable}
                disabled={!validDates}
                onChange={(event) => setOnlyAvailable(event.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Only available
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3" aria-live="polite">
        {dateError ? <Notice>{dateError}</Notice> : null}
        {outOfWindow ? <Notice tone="info">{windowMessage(today)}</Notice> : null}
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading rooms…</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? "room type" : "room types"}
            {validDates && !outOfWindow ? " · availability for your dates" : " · availability shown for tonight"}
          </p>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 grid place-items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden />
          <h2 className="text-2xl">Nothing free on those dates</h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Every room type is sold out for at least one night in this stay. Try shifting the dates by a day or two, or
            show all rooms to see what each one is doing.
          </p>
          <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={() => setOnlyAvailable(false)}>
            Show all rooms
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((room, index) => (
            <RoomCard
              key={room.slug}
              room={room}
              heading="h2"
              checkIn={validDates && !outOfWindow ? checkIn : ""}
              checkOut={validDates && !outOfWindow ? checkOut : ""}
              priority={index < 3}
            />
          ))}
        </div>
      )}
    </div>
  )
}
