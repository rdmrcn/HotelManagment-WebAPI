"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addDays, todayISO } from "@/lib/stay"

export function DateRangeFields({
  checkIn,
  checkOut,
  onCheckIn,
  onCheckOut,
  idPrefix = "stay",
}: {
  checkIn: string
  checkOut: string
  onCheckIn: (value: string) => void
  onCheckOut: (value: string) => void
  idPrefix?: string
}) {
  const today = todayISO()
  const checkOutMin = checkIn ? addDays(checkIn, 1) : today

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-check-in`}>Check-in</Label>
        <Input
          id={`${idPrefix}-check-in`}
          type="date"
          value={checkIn}
          min={today}
          onChange={(event) => onCheckIn(event.target.value)}
          className="h-11 bg-background px-3 text-foreground"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-check-out`}>Check-out</Label>
        <Input
          id={`${idPrefix}-check-out`}
          type="date"
          value={checkOut}
          min={checkOutMin || today}
          onChange={(event) => onCheckOut(event.target.value)}
          className="h-11 bg-background px-3 text-foreground"
        />
      </div>
    </div>
  )
}
