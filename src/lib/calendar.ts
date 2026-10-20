import { addDays } from "@/lib/stay"

export function firstOfMonth(iso: string) {
  return `${iso.slice(0, 7)}-01`
}

export function addMonths(firstOfMonthIso: string, months: number) {
  const [year, month] = firstOfMonthIso.split("-").map(Number)
  const date = new Date(year, (month ?? 1) - 1 + months, 1)
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  return `${date.getFullYear()}-${mm}-01`
}

/** Days of one month laid out Monday first. `null` pads the grid. */
export function monthGrid(firstOfMonthIso: string): (string | null)[] {
  const [year, month] = firstOfMonthIso.split("-").map(Number)
  const first = new Date(year, (month ?? 1) - 1, 1)
  const lead = (first.getDay() + 6) % 7
  const length = new Date(year, (month ?? 1), 0).getDate()
  const cells: (string | null)[] = Array.from({ length: lead }, () => null)
  for (let day = 1; day <= length; day += 1) cells.push(addDays(firstOfMonthIso, day - 1))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function monthLabel(firstOfMonthIso: string) {
  const [year, month] = firstOfMonthIso.split("-").map(Number)
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
    new Date(year, (month ?? 1) - 1, 1),
  )
}

export function shortDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ""
  const [year, month, day] = iso.split("-").map(Number)
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }).format(
    new Date(year, (month ?? 1) - 1, day ?? 1),
  )
}

export function longDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, (month ?? 1) - 1, day ?? 1))
}
