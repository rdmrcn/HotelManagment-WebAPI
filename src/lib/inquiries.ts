import type { Locale } from "@/lib/i18n/locale"
import { randomId } from "@/lib/password"

const KEY = "bosfor-hotels.inquiries"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type Inquiry = {
  id: string
  name: string
  email: string
  message: string
  checkIn: string
  checkOut: string
  createdAt: string
}

export type InquiryInput = {
  name: string
  email: string
  message: string
  checkIn?: string
  checkOut?: string
}

export type InquiryField = "name" | "email" | "message" | "dates"

const text = {
  en: {
    name: "Enter your name.",
    nameLong: "Use a name of 80 characters or fewer.",
    email: "Enter a valid email address.",
    message: "Write a short message.",
    messageLong: "Use 2,000 characters or fewer.",
    oneDate: "Add both dates, or leave them blank.",
    order: "Check-out has to be after check-in.",
    read: "Saved messages in this browser could not be read. Allow site data, then try again.",
    write: "This browser could not save your message. Allow site data, then try again.",
  },
  tr: {
    name: "Adınızı yazın.",
    nameLong: "Ad 80 karakteri geçmesin.",
    email: "Geçerli bir e-posta yazın.",
    message: "Kısa bir mesaj yazın.",
    messageLong: "Mesaj 2.000 karakteri geçmesin.",
    oneDate: "İki tarihi de ekleyin ya da ikisini de boş bırakın.",
    order: "Çıkış tarihi girişten sonra olmalı.",
    read: "Bu tarayıcıdaki kayıtlı mesajlar okunamadı. Site verisine izin verip yeniden deneyin.",
    write: "Bu tarayıcı mesajı kaydedemedi. Site verisine izin verip yeniden deneyin.",
  },
} as const

function isInquiry(value: unknown): value is Inquiry {
  if (!value || typeof value !== "object") return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.email === "string" &&
    typeof item.message === "string" &&
    typeof item.checkIn === "string" &&
    typeof item.checkOut === "string" &&
    typeof item.createdAt === "string"
  )
}

export function listInquiries(): Inquiry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isInquiry)
  } catch {
    return []
  }
}

export function validateInquiry(input: InquiryInput, locale: Locale = "en") {
  const copy = text[locale]
  const name = input.name.trim().replace(/\s+/g, " ")
  const email = input.email.trim().toLowerCase()
  const message = input.message.trim()
  const checkIn = (input.checkIn ?? "").trim()
  const checkOut = (input.checkOut ?? "").trim()

  if (name.length < 2) return { ok: false as const, field: "name" as const, error: copy.name }
  if (name.length > 80) return { ok: false as const, field: "name" as const, error: copy.nameLong }
  if (!EMAIL_PATTERN.test(email) || email.length > 120) {
    return { ok: false as const, field: "email" as const, error: copy.email }
  }
  if (message.length < 2) return { ok: false as const, field: "message" as const, error: copy.message }
  if (message.length > 2000) return { ok: false as const, field: "message" as const, error: copy.messageLong }
  if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
    return { ok: false as const, field: "dates" as const, error: copy.oneDate }
  }
  if (checkIn && checkOut && checkOut <= checkIn) {
    return { ok: false as const, field: "dates" as const, error: copy.order }
  }
  return { ok: true as const, value: { name, email, message, checkIn, checkOut } }
}

export function saveInquiry(
  input: InquiryInput,
  locale: Locale = "en",
): { ok: true; inquiry: Inquiry } | { ok: false; field?: InquiryField; error: string } {
  const parsed = validateInquiry(input, locale)
  if (!parsed.ok) return parsed
  if (typeof window === "undefined") return { ok: false, error: text[locale].write }

  let existing: Inquiry[]
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) existing = []
    else {
      const parsedRaw: unknown = JSON.parse(raw)
      if (!Array.isArray(parsedRaw)) return { ok: false, error: text[locale].read }
      existing = parsedRaw.filter(isInquiry)
    }
  } catch {
    return { ok: false, error: text[locale].read }
  }

  const inquiry: Inquiry = {
    id: randomId(),
    ...parsed.value,
    createdAt: new Date().toISOString(),
  }
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...existing, inquiry]))
  } catch {
    return { ok: false, error: text[locale].write }
  }
  return { ok: true, inquiry }
}
