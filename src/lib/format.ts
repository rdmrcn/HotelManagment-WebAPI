import type { Locale } from "@/lib/i18n/locale"

function moneyTag(locale: Locale) {
  return locale === "tr" ? "tr-TR" : "en-IE"
}

function dateTag(locale: Locale) {
  return locale === "tr" ? "tr-TR" : "en-GB"
}

export function formatMoney(amount: number, locale: Locale = "en") {
  return new Intl.NumberFormat(moneyTag(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatStayDate(iso: string, locale: Locale = "en") {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
  const [year, month, day] = iso.split("-").map(Number)
  const date = new Date(year, (month ?? 1) - 1, day ?? 1)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(dateTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatIssued(iso: string, locale: Locale = "en") {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(dateTag(locale), { dateStyle: "long", timeStyle: "short" }).format(date)
}

export function nightLabel(nights: number, locale: Locale = "en") {
  if (locale === "tr") return nights === 1 ? "1 gece" : `${nights} gece`
  return nights === 1 ? "1 night" : `${nights} nights`
}

export function guestLabel(count: number, locale: Locale = "en") {
  if (locale === "tr") return count === 1 ? "1 misafir" : `${count} misafir`
  return count === 1 ? "1 guest" : `${count} guests`
}
