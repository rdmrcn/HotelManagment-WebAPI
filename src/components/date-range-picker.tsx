"use client"

import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { BOOKING_WINDOW_DAYS, isDayFull, lastBookableCheckIn, lastBookableCheckOut } from "@/lib/availability"
import { addMonths, firstOfMonth, longDate, monthGrid, monthLabel, shortDate } from "@/lib/calendar"
import { formatStayDate, nightLabel } from "@/lib/format"
import { useLocale } from "@/lib/i18n/use-locale"
import { useCopy } from "@/lib/i18n/use-locale"
import { addDays } from "@/lib/stay"
import { useToday } from "@/lib/use-today"
import { cn } from "cn"

const MAX_NIGHTS = 28

type DayReason = "" | "past" | "beyond" | "over28" | "afterSold" | "checkoutOnly" | "soldOut"

type Props = {
  idPrefix: string
  checkIn: string
  checkOut: string
  onChange: (checkIn: string, checkOut: string) => void
  /** Grey out nights this room type has sold out. Without it, only nights where the whole house is full are blocked. */
  roomSlug?: string | null
  months?: 1 | 2
  className?: string
  tone?: "light" | "plain"
}

export function DateRangePicker({
  idPrefix,
  checkIn,
  checkOut,
  onChange,
  roomSlug = null,
  months = 2,
  className,
  tone = "light",
}: Props) {
  const today = useToday()
  const locale = useLocale()
  const dates = useCopy().dates
  const { allBookings } = useAuth()
  const [open, setOpen] = useState(false)
  const [picking, setPicking] = useState<"in" | "out">("in")
  const [visibleMonth, setVisibleMonth] = useState("")
  const [activeDate, setActiveDate] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const pendingFocus = useRef<string | null>(null)

  const lastIn = today ? lastBookableCheckIn(today) : ""
  const lastOut = today ? lastBookableCheckOut(today) : ""
  const minMonth = today ? firstOfMonth(today) : ""
  const maxMonth = lastOut ? firstOfMonth(lastOut) : ""

  const firstSoldOut = useMemo(() => {
    if (!today || !checkIn || picking !== "out") return ""
    for (let i = 0; i < MAX_NIGHTS; i += 1) {
      const night = addDays(checkIn, i)
      if (night > lastIn) break
      if (isDayFull(night, roomSlug, allBookings)) return night
    }
    return ""
  }, [today, checkIn, picking, roomSlug, allBookings, lastIn])

  function dayState(date: string): { disabled: boolean; reason: DayReason } {
    if (!today) return { disabled: true, reason: "" }
    if (date < today) return { disabled: true, reason: "past" }
    if (date > lastOut) return { disabled: true, reason: "beyond" }
    const choosingOut = picking === "out" && checkIn !== "" && date > checkIn
    if (choosingOut) {
      if (date > addDays(checkIn, MAX_NIGHTS)) return { disabled: true, reason: "over28" }
      if (firstSoldOut && date > firstSoldOut) return { disabled: true, reason: "afterSold" }
      return { disabled: false, reason: "" }
    }
    if (date > lastIn) return { disabled: true, reason: "checkoutOnly" }
    if (isDayFull(date, roomSlug, allBookings)) return { disabled: true, reason: "soldOut" }
    return { disabled: false, reason: "" }
  }

  function reasonText(reason: DayReason) {
    if (reason === "beyond") {
      return locale === "tr"
        ? `${BOOKING_WINDOW_DAYS} günlük takvimin dışında`
        : `beyond the ${BOOKING_WINDOW_DAYS} day calendar`
    }
    if (!reason) return ""
    return dates[reason]
  }

  function openPicker(which: "in" | "out") {
    if (!today) return
    const nextPicking = which === "out" && checkIn ? "out" : "in"
    setPicking(nextPicking)
    const anchor = (nextPicking === "out" ? checkOut || checkIn : checkIn) || today
    const month = firstOfMonth(anchor < today ? today : anchor)
    const lastStart = months === 2 ? addMonths(maxMonth, -1) : maxMonth
    setVisibleMonth(month > lastStart ? lastStart : month)
    setActiveDate(anchor < today ? today : anchor)
    pendingFocus.current = anchor < today ? today : anchor
    setOpen(true)
  }

  function close(returnFocus = true) {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    function onPointer(event: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("mousedown", onPointer)
    document.addEventListener("touchstart", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("touchstart", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open || !pendingFocus.current) return
    const target = popoverRef.current?.querySelector<HTMLElement>(`[data-date="${pendingFocus.current}"]`)
    if (target) {
      target.focus()
      pendingFocus.current = null
    }
  })

  function choose(date: string) {
    if (dayState(date).disabled) return
    if (picking === "out" && checkIn && date > checkIn) {
      onChange(checkIn, date)
      close()
      return
    }
    onChange(date, "")
    setPicking("out")
    setActiveDate(date)
  }

  function moveFocus(from: string, delta: number) {
    let next = addDays(from, delta)
    if (next < today) next = today
    if (next > lastOut) next = lastOut
    setActiveDate(next)
    pendingFocus.current = next
    const nextMonth = firstOfMonth(next)
    const lastShown = addMonths(visibleMonth, months - 1)
    if (nextMonth < visibleMonth) setVisibleMonth(nextMonth)
    else if (nextMonth > lastShown) setVisibleMonth(addMonths(visibleMonth, 1))
  }

  function onDayKey(event: React.KeyboardEvent, date: string) {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    const delta = moves[event.key]
    if (delta === undefined) return
    event.preventDefault()
    moveFocus(date, delta)
  }

  const nights = checkIn && checkOut ? Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000) : 0
  const shown = Array.from({ length: months }, (_, index) => addMonths(visibleMonth || minMonth || "2026-01-01", index))

  const fieldBase =
    "flex h-14 w-full min-w-0 flex-col justify-center rounded-xl px-3.5 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
  const fieldTone =
    tone === "light" ? "bg-background ring-1 ring-foreground/15 hover:ring-foreground/30" : "bg-background ring-1 ring-input hover:ring-foreground/30"

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          ref={(node) => {
            if (picking === "in" || !checkIn) triggerRef.current = node
          }}
          id={`${idPrefix}-check-in`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => (open && picking === "in" ? close(false) : openPicker("in"))}
          className={cn(fieldBase, fieldTone, open && picking === "in" && "ring-2 ring-primary")}
        >
          <span className="text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">{dates.checkIn}</span>
          <span className={cn("mt-0.5 flex items-center gap-2 text-sm", !checkIn && "text-muted-foreground")}>
            <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{checkIn ? shortDate(checkIn, locale) : dates.add}</span>
          </span>
        </button>
        <button
          type="button"
          ref={(node) => {
            if (picking === "out" && checkIn) triggerRef.current = node
          }}
          id={`${idPrefix}-check-out`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => (open && picking === "out" ? close(false) : openPicker("out"))}
          className={cn(fieldBase, fieldTone, open && picking === "out" && "ring-2 ring-primary")}
        >
          <span className="text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">{dates.checkOut}</span>
          <span className={cn("mt-0.5 flex items-center gap-2 text-sm", !checkOut && "text-muted-foreground")}>
            <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{checkOut ? shortDate(checkOut, locale) : dates.add}</span>
          </span>
        </button>
      </div>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-[#071422]/40 md:hidden" aria-hidden onClick={() => close(false)} />
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={dates.dialog}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-card p-4 text-foreground shadow-2xl ring-1 ring-foreground/10 md:absolute md:inset-x-auto md:top-full md:bottom-auto md:left-0 md:mt-2 md:max-h-none md:rounded-2xl md:p-5",
              months === 2 ? "md:w-[43rem]" : "md:w-[21.5rem]",
            )}
          >
            <div className="flex items-center justify-between gap-3 pb-3">
              <p className="text-sm font-medium" aria-live="polite">
                {picking === "in" || !checkIn ? dates.chooseIn : dates.chooseOut}
              </p>
              <button
                type="button"
                aria-label={dates.close}
                onClick={() => close()}
                className="grid size-9 place-items-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="relative">
              <div className={cn("grid gap-6", months === 2 && "md:grid-cols-2 md:gap-8")}>
                {shown.map((month, index) => (
                  <div key={month} className={cn(index > 0 && "hidden md:block")}>
                    <div className="mb-2 flex h-9 items-center justify-between">
                      {index === 0 ? (
                        <button
                          type="button"
                          aria-label={dates.previous}
                          disabled={!minMonth || month <= minMonth}
                          onClick={() => setVisibleMonth(addMonths(month, -1))}
                          className="grid size-9 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                      ) : (
                        <span className="size-9" />
                      )}
                      <p className="font-serif text-xl">{monthLabel(month, locale)}</p>
                      {index === (months === 2 ? 1 : 0) || (index === 0 && months === 2) ? (
                        <button
                          type="button"
                          aria-label={dates.next}
                          disabled={!maxMonth || addMonths(visibleMonth, months - 1) >= maxMonth}
                          onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
                          className={cn(
                            "grid size-9 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-30 disabled:hover:bg-transparent",
                            months === 2 && index === 0 && "md:invisible",
                          )}
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      ) : (
                        <span className="size-9" />
                      )}
                    </div>
                    <div role="grid" aria-label={monthLabel(month, locale)} className="grid grid-cols-7 gap-y-1">
                      {dates.weekdays.map((day) => (
                        <div
                          key={day}
                          role="columnheader"
                          className="py-1 text-center text-xs font-medium text-muted-foreground"
                        >
                          {day}
                        </div>
                      ))}
                      {monthGrid(month).map((date, cell) => {
                        if (!date) return <div key={`${month}-${cell}`} role="gridcell" aria-hidden />
                        const state = dayState(date)
                        const isStart = date === checkIn
                        const isEnd = date === checkOut
                        const inRange = checkIn && checkOut && date > checkIn && date < checkOut
                        const soldOut = state.reason === "soldOut"
                        const label = `${longDate(date, locale)}${state.disabled ? `, ${dates.unavailable}: ${reasonText(state.reason)}` : ""}${
                          isStart ? `, ${dates.checkInMark}` : ""
                        }${isEnd ? `, ${dates.checkOutMark}` : ""}`
                        return (
                          <div
                            key={date}
                            role="gridcell"
                            className={cn(
                              "flex justify-center",
                              inRange && "bg-primary/10",
                              isStart && checkOut && "rounded-l-full bg-primary/10",
                              isEnd && "rounded-r-full bg-primary/10",
                            )}
                          >
                            <button
                              type="button"
                              data-date={date}
                              aria-label={label}
                              aria-disabled={state.disabled || undefined}
                              aria-pressed={isStart || isEnd}
                              tabIndex={date === activeDate ? 0 : -1}
                              onClick={() => choose(date)}
                              onKeyDown={(event) => onDayKey(event, date)}
                              onFocus={() => setActiveDate(date)}
                              className={cn(
                                "relative grid size-10 place-items-center rounded-full text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60",
                                !state.disabled && "hover:bg-primary/15",
                                state.disabled && "cursor-not-allowed text-muted-foreground/45",
                                soldOut && "line-through decoration-muted-foreground/70",
                                (isStart || isEnd) && "bg-primary font-medium text-primary-foreground hover:bg-primary",
                                date === today && !isStart && !isEnd && "ring-1 ring-primary/60",
                              )}
                            >
                              {Number(date.slice(8))}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                {roomSlug ? `${dates.struck} ` : ""}
                {dates.opens} {BOOKING_WINDOW_DAYS} {dates.daysAhead}
                {lastIn ? `, ${dates.through} ${formatStayDate(lastIn, locale)}` : ""}.
                {nights > 0 ? ` ${nightLabel(nights, locale)} ${dates.selected}.` : ""}
              </p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onChange("", "")
                    setPicking("in")
                  }}
                  className="h-10 rounded-full px-4 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {dates.clear}
                </button>
                <button
                  type="button"
                  onClick={() => close()}
                  className="h-10 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {dates.done}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
