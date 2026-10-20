import { describe, expect, it } from "vitest"
import {
  BOOKING_WINDOW_DAYS,
  heldUnits,
  isDayFull,
  isWeekendNight,
  lastBookableCheckOut,
  leftLabel,
  leftTone,
  nextAvailableStay,
  nightAvailability,
  roomsLeft,
  stayAvailability,
} from "@/lib/availability"
import { rooms } from "@/lib/rooms"
import { addDays } from "@/lib/stay"

const today = "2026-10-20"

function windowDates() {
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, index) => addDays(today, index))
}

describe("room inventory", () => {
  it("gives cheaper rooms more units", () => {
    const units = Object.fromEntries(rooms.map((room) => [room.slug, room.units]))
    expect(units).toEqual({
      standard: 12,
      "queen-double": 6,
      queen: 10,
      "king-double": 6,
      king: 8,
      deluxe: 5,
      suite: 3,
      presidential: 2,
    })
  })
})

describe("seeded calendar", () => {
  it("is deterministic", () => {
    for (const room of rooms) {
      for (const date of windowDates()) {
        expect(heldUnits(room.slug, date)).toBe(heldUnits(room.slug, date))
      }
    }
    expect(heldUnits("standard", "2026-11-14")).toBe(heldUnits("standard", "2026-11-14"))
  })

  it("never holds more rooms than the house has", () => {
    for (const room of rooms) {
      for (const date of windowDates()) {
        const night = nightAvailability(room.slug, date)
        expect(night.left).toBeGreaterThanOrEqual(0)
        expect(night.left).toBeLessThanOrEqual(room.units)
        expect(night.held + night.left).toBe(room.units)
      }
    }
  })

  it("is busier on weekend nights than on weekday nights", () => {
    const fills = { weekend: [] as number[], weekday: [] as number[] }
    for (let i = 0; i < 365; i += 1) {
      const date = addDays("2026-10-20", i)
      for (const room of rooms) {
        const share = heldUnits(room.slug, date) / room.units
        fills[isWeekendNight(date) ? "weekend" : "weekday"].push(share)
      }
    }
    const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
    expect(mean(fills.weekend)).toBeGreaterThan(mean(fills.weekday) + 0.1)
  })

  it("is busier on public holidays", () => {
    const mean = (dates: string[]) => {
      const shares = dates.flatMap((date) => rooms.map((room) => heldUnits(room.slug, date) / room.units))
      return shares.reduce((sum, value) => sum + value, 0) / shares.length
    }
    const holiday = ["2026-10-29", "2026-12-26", "2026-12-27", "2026-12-28", "2026-12-30"]
    const ordinary = ["2026-11-03", "2026-11-04", "2026-11-10", "2026-11-11", "2026-11-17"]
    expect(mean(holiday)).toBeGreaterThan(mean(ordinary))
  })

  it("has occasional sold-out nights but is mostly bookable", () => {
    let soldOut = 0
    let total = 0
    for (const room of rooms) {
      for (let i = 0; i < 365; i += 1) {
        total += 1
        if (nightAvailability(room.slug, addDays("2026-10-20", i)).left === 0) soldOut += 1
      }
    }
    expect(soldOut / total).toBeGreaterThan(0.02)
    expect(soldOut / total).toBeLessThan(0.2)
  })

  it("gives the small water rooms the tightest stock", () => {
    const bosfor = rooms.find((room) => room.slug === "presidential")
    expect(bosfor?.units).toBeLessThanOrEqual(2)
  })
})

describe("stay availability", () => {
  const stays = [{ roomSlug: "presidential", checkIn: "2026-11-01", checkOut: "2026-11-04" }]

  it("counts the guest's own stays against availability", () => {
    const base = nightAvailability("standard", "2026-11-02")
    const withMine = nightAvailability("standard", "2026-11-02", [
      { roomSlug: "standard", checkIn: "2026-11-01", checkOut: "2026-11-03" },
    ])
    expect(withMine.left).toBe(Math.max(0, base.left - 1))
    expect(withMine.mine).toBe(1)
    const checkOutNight = nightAvailability("standard", "2026-11-03", [
      { roomSlug: "standard", checkIn: "2026-11-01", checkOut: "2026-11-03" },
    ])
    expect(checkOutNight.mine).toBe(0)
  })

  it("sells out once the remaining units are booked by this browser", () => {
    const night = nightAvailability("presidential", "2026-11-02")
    const filler = Array.from({ length: night.left }, () => ({
      roomSlug: "presidential",
      checkIn: "2026-11-02",
      checkOut: "2026-11-03",
    }))
    const result = stayAvailability("presidential", "2026-11-02", "2026-11-03", filler, today)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe("sold-out")
      expect(result.soldOutDates).toEqual(["2026-11-02"])
    }
    expect(isDayFull("2026-11-02", "presidential", filler)).toBe(true)
  })

  it("checks every night in the range", () => {
    let found = false
    for (const room of rooms) {
      for (const start of windowDates().slice(0, 50)) {
        const middle = addDays(start, 1)
        if (nightAvailability(room.slug, middle).left !== 0) continue
        if (nightAvailability(room.slug, start).left === 0) continue
        const result = stayAvailability(room.slug, start, addDays(start, 3), [], today)
        expect(result.ok).toBe(false)
        if (!result.ok) expect(result.soldOutDates).toContain(middle)
        found = true
        break
      }
      if (found) break
    }
    expect(found).toBe(true)
  })

  it("accepts a free stay and reports the tightest night", () => {
    const next = nextAvailableStay("standard", 2, stays, today, today)
    expect(next).not.toBeNull()
    if (!next) return
    const result = stayAvailability("standard", next.checkIn, next.checkOut, stays, today)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.nights).toHaveLength(2)
      expect(result.left).toBe(Math.min(...result.nights.map((night) => night.left)))
    }
  })

  it("rejects dates beyond the 60 day window with a friendly message", () => {
    const lastOut = lastBookableCheckOut(today)
    expect(lastOut).toBe(addDays(today, 60))
    const ok = stayAvailability("standard", addDays(lastOut, -1), lastOut, [], today)
    expect(ok.ok || (!ok.ok && ok.reason === "sold-out")).toBe(true)
    const far = stayAvailability("standard", addDays(today, 70), addDays(today, 72), [], today)
    expect(far.ok).toBe(false)
    if (!far.ok) {
      expect(far.reason).toBe("out-of-window")
      expect(far.message).toMatch(/60 days ahead/)
    }
  })

  it("rejects past dates, reversed dates and unknown rooms", () => {
    expect(stayAvailability("standard", "2026-10-01", "2026-10-03", [], today).ok).toBe(false)
    expect(stayAvailability("standard", "2026-11-05", "2026-11-04", [], today).ok).toBe(false)
    expect(stayAvailability("nope", "2026-11-05", "2026-11-06", [], today).ok).toBe(false)
  })
})

describe("labels", () => {
  it("shows urgency at two rooms or fewer", () => {
    expect(leftLabel(0)).toBe("Sold out")
    expect(leftLabel(1)).toBe("Only 1 left")
    expect(leftLabel(2)).toBe("Only 2 left")
    expect(leftLabel(7)).toBe("7 rooms left")
    expect(leftTone(2)).toBe("last")
    expect(leftTone(4)).toBe("few")
    expect(leftTone(9)).toBe("plenty")
    expect(leftTone(0)).toBe("none")
  })

  it("uses tonight when no dates are chosen", () => {
    const tonight = roomsLeft("standard", "", "", [], today)
    expect(tonight.scope).toBe("tonight")
    const stay = roomsLeft("standard", "2026-11-02", "2026-11-04", [], today)
    expect(stay.scope).toBe("stay")
    expect(stay.left).toBe(
      Math.min(nightAvailability("standard", "2026-11-02").left, nightAvailability("standard", "2026-11-03").left),
    )
  })
})
