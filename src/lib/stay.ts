export function todayISO(now = new Date()) {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function addDays(iso: string, days: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ""
  const [year, month, day] = iso.split("-").map(Number)
  const date = new Date(year, (month ?? 1) - 1, day ?? 1)
  if (Number.isNaN(date.getTime())) return ""
  date.setDate(date.getDate() + days)
  return todayISO(date)
}

export function nightsBetween(checkIn: string, checkOut: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
    return null
  }
  const [startYear, startMonth, startDay] = checkIn.split("-").map(Number)
  const [endYear, endMonth, endDay] = checkOut.split("-").map(Number)
  const start = new Date(startYear, (startMonth ?? 1) - 1, startDay ?? 1)
  const end = new Date(endYear, (endMonth ?? 1) - 1, endDay ?? 1)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
  return Math.round((end.getTime() - start.getTime()) / 86_400_000)
}

export function validateStay(checkIn: string, checkOut: string, today = todayISO()) {
  if (!checkIn || !checkOut) return "Choose a check-in and a check-out."
  const nights = nightsBetween(checkIn, checkOut)
  if (nights === null) return "Those dates could not be read. Use the date fields."
  if (checkIn < today) return "Check-in cannot be in the past."
  if (nights < 1) return "Check-out has to be at least one night after check-in."
  if (nights > 28) return "Online booking stops at 28 nights. Choose a shorter stay."
  return null
}

export function quoteStay(
  nightlyRate: number,
  checkIn: string,
  checkOut: string,
  today = todayISO(),
) {
  const error = validateStay(checkIn, checkOut, today)
  if (error) return { ok: false as const, error }
  const nights = nightsBetween(checkIn, checkOut)
  if (nights === null || nights < 1) {
    return { ok: false as const, error: "Those dates could not be read. Use the date fields." }
  }
  return {
    ok: true as const,
    nights,
    nightlyRate,
    total: nights * nightlyRate,
  }
}
