import { formatStayDate } from "@/lib/format"
import { getRoom, rooms } from "@/lib/rooms"
import { addDays, nightsBetween, todayISO, validateStay } from "@/lib/stay"

/** Calendar the house sells ahead of today. */
export const BOOKING_WINDOW_DAYS = 60

export type StayLike = { roomSlug: string; checkIn: string; checkOut: string }

export type NightAvailability = {
  date: string
  total: number
  /** Rooms taken by the seeded house calendar. */
  held: number
  /** Rooms taken by stays saved in this browser. */
  mine: number
  left: number
}

export type StayAvailability =
  | { ok: true; nights: NightAvailability[]; left: number }
  | {
      ok: false
      reason: "invalid" | "out-of-window" | "sold-out"
      message: string
      soldOutDates: string[]
    }

// Fixed-date Turkish public holidays plus religious holidays and year-end for 2026-2028.
const holidays: Record<string, string> = {}

function holidayRange(start: string, days: number, name: string) {
  for (let i = 0; i < days; i += 1) holidays[addDays(start, i)] = name
}

for (const year of [2026, 2027, 2028]) {
  holidays[`${year}-01-01`] = "New Year"
  holidays[`${year}-04-23`] = "National Sovereignty Day"
  holidays[`${year}-05-01`] = "Labour Day"
  holidays[`${year}-05-19`] = "Youth and Sports Day"
  holidays[`${year}-07-15`] = "Democracy Day"
  holidays[`${year}-08-30`] = "Victory Day"
  holidays[`${year}-10-29`] = "Republic Day"
  holidayRange(`${year}-12-24`, 9, "Year-end")
}
holidayRange("2026-03-19", 4, "Ramadan Bayram")
holidayRange("2026-05-26", 5, "Kurban Bayram")
holidayRange("2027-03-08", 4, "Ramadan Bayram")
holidayRange("2027-05-15", 5, "Kurban Bayram")
holidayRange("2028-02-25", 4, "Ramadan Bayram")
holidayRange("2028-05-04", 5, "Kurban Bayram")

export function holidayName(date: string): string | null {
  return holidays[date] ?? null
}

function weekday(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1).getDay()
}

export function isWeekendNight(date: string) {
  const day = weekday(date)
  return day === 5 || day === 6
}

function hashString(value: string) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const dayLift = [0.03, -0.04, -0.06, -0.04, 0.04, 0.2, 0.26]

/** Cheaper rooms fill faster. The water rooms stay scarce and a little emptier. */
const popularity: Record<string, number> = {
  standard: 0.06,
  "queen-double": 0.03,
  queen: 0.04,
  "king-double": 0,
  king: 0,
  deluxe: -0.04,
  suite: -0.07,
  presidential: -0.1,
}

function seasonLift(date: string) {
  const month = Number(date.slice(5, 7))
  if (month >= 6 && month <= 9) return 0.1
  if (month === 5 || month === 10) return 0.04
  if (month === 1 || month === 2) return -0.08
  return 0
}

/** Rooms of this type taken on this night in the seeded house calendar. Same answer on every visit. */
export function heldUnits(slug: string, date: string) {
  const room = getRoom(slug)
  if (!room) return 0
  const random = seeded(hashString(`bosfor|${slug}|${date}`))
  const noise = random() - 0.5
  const rush = random()
  const peak = holidayName(date) !== null
  const weekend = isWeekendNight(date)

  let demand =
    0.44 +
    dayLift[weekday(date)] +
    (peak ? 0.24 : 0) +
    seasonLift(date) +
    (popularity[slug] ?? 0) +
    noise * 0.34
  demand = Math.min(1, Math.max(0.06, demand))

  const soldOutChance = 0.03 + (weekend ? 0.03 : 0) + (peak ? 0.1 : 0)
  if (rush < soldOutChance) return room.units
  return Math.min(room.units, Math.round(demand * room.units))
}

function mineOn(slug: string, date: string, stays: readonly StayLike[]) {
  let count = 0
  for (const stay of stays) {
    if (stay.roomSlug === slug && stay.checkIn <= date && date < stay.checkOut) count += 1
  }
  return count
}

export function nightAvailability(
  slug: string,
  date: string,
  stays: readonly StayLike[] = [],
): NightAvailability {
  const total = getRoom(slug)?.units ?? 0
  const held = heldUnits(slug, date)
  const mine = mineOn(slug, date, stays)
  return { date, total, held, mine, left: Math.max(0, total - held - mine) }
}

export function lastBookableCheckOut(today = todayISO()) {
  return addDays(today, BOOKING_WINDOW_DAYS)
}

export function lastBookableCheckIn(today = todayISO()) {
  return addDays(today, BOOKING_WINDOW_DAYS - 1)
}

export function windowMessage(today = todayISO()) {
  return `Our calendar opens ${BOOKING_WINDOW_DAYS} days ahead, so the last night you can book is ${formatStayDate(lastBookableCheckIn(today))}. Pick dates before then.`
}

export function stayAvailability(
  slug: string,
  checkIn: string,
  checkOut: string,
  stays: readonly StayLike[] = [],
  today = todayISO(),
): StayAvailability {
  const room = getRoom(slug)
  if (!room) {
    return { ok: false, reason: "invalid", message: "That room is not at the hotel.", soldOutDates: [] }
  }
  const invalid = validateStay(checkIn, checkOut, today)
  if (invalid) return { ok: false, reason: "invalid", message: invalid, soldOutDates: [] }
  if (checkOut > lastBookableCheckOut(today)) {
    return { ok: false, reason: "out-of-window", message: windowMessage(today), soldOutDates: [] }
  }

  const count = nightsBetween(checkIn, checkOut) ?? 0
  const nights: NightAvailability[] = []
  for (let i = 0; i < count; i += 1) {
    nights.push(nightAvailability(slug, addDays(checkIn, i), stays))
  }
  const soldOutDates = nights.filter((night) => night.left === 0).map((night) => night.date)
  if (soldOutDates.length > 0) {
    const first = formatStayDate(soldOutDates[0])
    const message =
      soldOutDates.length === 1
        ? `${room.name} is sold out on ${first}.`
        : `${room.name} is sold out on ${soldOutDates.length} of these nights, starting ${first}.`
    return { ok: false, reason: "sold-out", message, soldOutDates }
  }
  return { ok: true, nights, left: Math.min(...nights.map((night) => night.left)) }
}

/** Fewest rooms left across the window, or tonight when no dates are chosen. */
export function roomsLeft(
  slug: string,
  checkIn: string,
  checkOut: string,
  stays: readonly StayLike[] = [],
  today = todayISO(),
) {
  if (checkIn && checkOut && !validateStay(checkIn, checkOut, today)) {
    const count = nightsBetween(checkIn, checkOut) ?? 1
    let least = Infinity
    for (let i = 0; i < count; i += 1) {
      least = Math.min(least, nightAvailability(slug, addDays(checkIn, i), stays).left)
    }
    return { left: Number.isFinite(least) ? least : 0, scope: "stay" as const }
  }
  return { left: nightAvailability(slug, today, stays).left, scope: "tonight" as const }
}

export function isDayFull(
  date: string,
  slug: string | null,
  stays: readonly StayLike[] = [],
) {
  if (slug) return nightAvailability(slug, date, stays).left === 0
  return rooms.every((room) => nightAvailability(room.slug, date, stays).left === 0)
}

/** First stay of the same length, from `from`, with a free room on every night. */
export function nextAvailableStay(
  slug: string,
  nightCount: number,
  stays: readonly StayLike[] = [],
  from: string,
  today = todayISO(),
) {
  const start = from < today ? today : from
  for (let offset = 0; offset < BOOKING_WINDOW_DAYS; offset += 1) {
    const checkIn = addDays(start, offset)
    const checkOut = addDays(checkIn, nightCount)
    if (checkOut > lastBookableCheckOut(today)) return null
    if (stayAvailability(slug, checkIn, checkOut, stays, today).ok) return { checkIn, checkOut }
  }
  return null
}

export type LeftTone = "plenty" | "few" | "last" | "none"

export function leftTone(left: number): LeftTone {
  if (left <= 0) return "none"
  if (left <= 2) return "last"
  if (left <= 4) return "few"
  return "plenty"
}

export function leftLabel(left: number) {
  if (left <= 0) return "Sold out"
  if (left === 1) return "Only 1 left"
  if (left === 2) return "Only 2 left"
  return `${left} rooms left`
}
