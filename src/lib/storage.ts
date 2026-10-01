import { getRoom } from "@/lib/rooms"
import { quoteStay } from "@/lib/stay"

const GUESTS_KEY = "aurelia.guests"
const BOOKINGS_KEY = "aurelia.bookings"
const SESSION_KEY = "aurelia.session"

const READ_ERROR =
  "Saved details in this browser could not be read. Allow site data for this page, then try again."
const WRITE_ERROR =
  "This browser could not save your details. Allow site data for this page, then try again."

export type Guest = {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export type PublicGuest = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type Booking = {
  id: string
  confirmationCode: string
  guestId: string
  roomSlug: string
  checkIn: string
  checkOut: string
  nights: number
  nightlyRate: number
  total: number
  createdAt: string
}

export type ActionFailure = { ok: false; error: string; field?: "email" | "password" }

function toPublic(guest: Guest): PublicGuest {
  return {
    id: guest.id,
    name: guest.name,
    email: guest.email,
    createdAt: guest.createdAt,
  }
}

function isGuest(value: unknown): value is Guest {
  if (!value || typeof value !== "object") return false
  const guest = value as Record<string, unknown>
  return (
    typeof guest.id === "string" &&
    typeof guest.name === "string" &&
    typeof guest.email === "string" &&
    typeof guest.password === "string" &&
    typeof guest.createdAt === "string"
  )
}

function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false
  const booking = value as Record<string, unknown>
  return (
    typeof booking.id === "string" &&
    typeof booking.confirmationCode === "string" &&
    typeof booking.guestId === "string" &&
    typeof booking.roomSlug === "string" &&
    typeof booking.checkIn === "string" &&
    typeof booking.checkOut === "string" &&
    typeof booking.nights === "number" &&
    typeof booking.nightlyRate === "number" &&
    typeof booking.total === "number" &&
    typeof booking.createdAt === "string"
  )
}

function readRaw(key: string): { raw: string | null; error: string | null } {
  if (typeof window === "undefined") return { raw: null, error: null }
  try {
    return { raw: window.localStorage.getItem(key), error: null }
  } catch {
    return { raw: null, error: READ_ERROR }
  }
}

function writeRaw(key: string, value: string): { ok: true } | { ok: false; error: string } {
  try {
    window.localStorage.setItem(key, value)
    return { ok: true }
  } catch {
    return { ok: false, error: WRITE_ERROR }
  }
}

function readGuests(): { guests: Guest[]; error: string | null } {
  const { raw, error } = readRaw(GUESTS_KEY)
  if (error) return { guests: [], error }
  if (!raw) return { guests: [], error: null }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { guests: [], error: READ_ERROR }
    return { guests: parsed.filter(isGuest), error: null }
  } catch {
    return { guests: [], error: READ_ERROR }
  }
}

function readBookings(): { bookings: Booking[]; error: string | null } {
  const { raw, error } = readRaw(BOOKINGS_KEY)
  if (error) return { bookings: [], error }
  if (!raw) return { bookings: [], error: null }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { bookings: [], error: READ_ERROR }
    return { bookings: parsed.filter(isBooking), error: null }
  } catch {
    return { bookings: [], error: READ_ERROR }
  }
}

function readSession(): { id: string | null; error: string | null } {
  const { raw, error } = readRaw(SESSION_KEY)
  if (error) return { id: null, error }
  return { id: raw, error: null }
}

function confirmationCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  let code = "AUR-"
  for (const byte of bytes) code += alphabet[byte % alphabet.length]
  return code
}

export function readAuthState(): {
  guest: PublicGuest | null
  bookings: Booking[]
  error: string | null
} {
  const guestsResult = readGuests()
  const bookingsResult = readBookings()
  const session = readSession()
  const error = guestsResult.error ?? bookingsResult.error ?? session.error
  if (error) return { guest: null, bookings: [], error }

  const guest = guestsResult.guests.find((item) => item.id === session.id) ?? null
  if (session.id && !guest) {
    try {
      window.localStorage.removeItem(SESSION_KEY)
    } catch {
      return { guest: null, bookings: [], error: READ_ERROR }
    }
  }

  const bookings = guest
    ? bookingsResult.bookings
        .filter((booking) => booking.guestId === guest.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : []

  return { guest: guest ? toPublic(guest) : null, bookings, error: null }
}

export function registerGuest(input: {
  name: string
  email: string
  password: string
}): { ok: true } | ActionFailure {
  const existing = readGuests()
  if (existing.error) return { ok: false, error: existing.error }
  if (existing.guests.some((guest) => guest.email === input.email)) {
    return {
      ok: false,
      field: "email",
      error: "An account in this browser already uses that email.",
    }
  }

  const guest: Guest = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    password: input.password,
    createdAt: new Date().toISOString(),
  }
  const saved = writeRaw(GUESTS_KEY, JSON.stringify([...existing.guests, guest]))
  if (!saved.ok) return saved
  const session = writeRaw(SESSION_KEY, guest.id)
  if (!session.ok) return session
  return { ok: true }
}

export function signInGuest(input: {
  email: string
  password: string
}): { ok: true } | ActionFailure {
  const existing = readGuests()
  if (existing.error) return { ok: false, error: existing.error }
  const guest = existing.guests.find((item) => item.email === input.email)
  if (!guest) {
    return {
      ok: false,
      field: "email",
      error: "No account in this browser uses that email.",
    }
  }
  if (guest.password !== input.password) {
    return { ok: false, field: "password", error: "The password does not match." }
  }
  const session = writeRaw(SESSION_KEY, guest.id)
  if (!session.ok) return session
  return { ok: true }
}

export function signOutGuest() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    // The next read will surface a storage error if the browser is blocking site data.
  }
}

export function saveBooking(
  guestId: string,
  input: { roomSlug: string; checkIn: string; checkOut: string },
): { ok: true; booking: Booking } | ActionFailure {
  const guestsResult = readGuests()
  const bookingsResult = readBookings()
  const error = guestsResult.error ?? bookingsResult.error
  if (error) return { ok: false, error }
  if (!guestsResult.guests.some((guest) => guest.id === guestId)) {
    return { ok: false, error: "Sign in again before confirming this stay." }
  }

  const room = getRoom(input.roomSlug)
  if (!room) return { ok: false, error: "That room is not in the house." }
  const quote = quoteStay(room.nightlyRate, input.checkIn, input.checkOut)
  if (!quote.ok) return { ok: false, error: quote.error }

  const booking: Booking = {
    id: crypto.randomUUID(),
    confirmationCode: confirmationCode(),
    guestId,
    roomSlug: room.slug,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    nights: quote.nights,
    nightlyRate: quote.nightlyRate,
    total: quote.total,
    createdAt: new Date().toISOString(),
  }
  const saved = writeRaw(BOOKINGS_KEY, JSON.stringify([...bookingsResult.bookings, booking]))
  if (!saved.ok) return saved
  return { ok: true, booking }
}
