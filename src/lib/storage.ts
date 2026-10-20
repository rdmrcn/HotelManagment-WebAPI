import { stayAvailability } from "@/lib/availability"
import { hashPassword, newSalt, randomId, verifyPassword } from "@/lib/password"
import { getRoom } from "@/lib/rooms"
import { quoteStay } from "@/lib/stay"

const GUESTS_KEY = "bosfor-hotels.guests"
const BOOKINGS_KEY = "bosfor-hotels.bookings"
const SESSION_KEY = "bosfor-hotels.session"

const READ_ERROR =
  "Saved details in this browser could not be read. Allow site data for this page, then try again."
const WRITE_ERROR =
  "This browser could not save your details. Allow site data for this page, then try again."

export type Guest = {
  id: string
  name: string
  email: string
  salt: string
  passwordHash: string
  createdAt: string
}

/** Accounts saved before passwords were hashed. They are upgraded the next time that guest signs in. */
type LegacyGuest = {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

type StoredGuest = Guest | LegacyGuest

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

function toPublic(guest: StoredGuest): PublicGuest {
  return {
    id: guest.id,
    name: guest.name,
    email: guest.email,
    createdAt: guest.createdAt,
  }
}

function isStoredGuest(value: unknown): value is StoredGuest {
  if (!value || typeof value !== "object") return false
  const guest = value as Record<string, unknown>
  const base =
    typeof guest.id === "string" &&
    typeof guest.name === "string" &&
    typeof guest.email === "string" &&
    typeof guest.createdAt === "string"
  if (!base) return false
  const hashed = typeof guest.salt === "string" && typeof guest.passwordHash === "string"
  return hashed || typeof guest.password === "string"
}

function isHashed(guest: StoredGuest): guest is Guest {
  return "passwordHash" in guest
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

function readGuests(): { guests: StoredGuest[]; error: string | null } {
  const { raw, error } = readRaw(GUESTS_KEY)
  if (error) return { guests: [], error }
  if (!raw) return { guests: [], error: null }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { guests: [], error: READ_ERROR }
    return { guests: parsed.filter(isStoredGuest), error: null }
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
  globalThis.crypto.getRandomValues(bytes)
  let code = "BOS-"
  for (const byte of bytes) code += alphabet[byte % alphabet.length]
  return code
}

export function readAuthState(): {
  guest: PublicGuest | null
  bookings: Booking[]
  allBookings: Booking[]
  error: string | null
} {
  const guestsResult = readGuests()
  const bookingsResult = readBookings()
  const session = readSession()
  const error = guestsResult.error ?? bookingsResult.error ?? session.error
  if (error) return { guest: null, bookings: [], allBookings: [], error }

  const guest = guestsResult.guests.find((item) => item.id === session.id) ?? null
  if (session.id && !guest) {
    try {
      window.localStorage.removeItem(SESSION_KEY)
    } catch {
      return { guest: null, bookings: [], allBookings: [], error: READ_ERROR }
    }
  }

  const bookings = guest
    ? bookingsResult.bookings
        .filter((booking) => booking.guestId === guest.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : []

  return {
    guest: guest ? toPublic(guest) : null,
    bookings,
    allBookings: bookingsResult.bookings,
    error: null,
  }
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? ""
  const words = local
    .replace(/[._+-]+/g, " ")
    .replace(/\d+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return "Guest"
  return words
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export type AuthSuccess = { ok: true; created: boolean; guest: PublicGuest }

/**
 * One door for sign-in and registration. An unknown email creates the account and signs in; a known
 * email must use the password it was created with.
 */
export async function authenticateGuest(input: {
  email: string
  password: string
  name?: string
  intent: "sign-in" | "register"
}): Promise<AuthSuccess | ActionFailure> {
  const email = input.email.trim().toLowerCase()
  const existing = readGuests()
  if (existing.error) return { ok: false, error: existing.error }
  const known = existing.guests.find((item) => item.email === email)

  if (known) {
    if (isHashed(known)) {
      const matches = await verifyPassword(input.password, known.salt, known.passwordHash)
      if (!matches) return { ok: false, field: "password", error: wrongPasswordMessage(input.intent) }
    } else if (known.password !== input.password) {
      return { ok: false, field: "password", error: wrongPasswordMessage(input.intent) }
    }

    let guest: StoredGuest = known
    if (!isHashed(known)) {
      const salt = newSalt()
      guest = {
        id: known.id,
        name: known.name,
        email: known.email,
        createdAt: known.createdAt,
        salt,
        passwordHash: await hashPassword(input.password, salt),
      }
      const upgraded = writeRaw(
        GUESTS_KEY,
        JSON.stringify(existing.guests.map((item) => (item.id === known.id ? guest : item))),
      )
      if (!upgraded.ok) return upgraded
    }
    const session = writeRaw(SESSION_KEY, guest.id)
    if (!session.ok) return session
    return { ok: true, created: false, guest: toPublic(guest) }
  }

  const salt = newSalt()
  const guest: Guest = {
    id: randomId(),
    name: input.name?.trim() || nameFromEmail(email),
    email,
    salt,
    passwordHash: await hashPassword(input.password, salt),
    createdAt: new Date().toISOString(),
  }
  // Another tab may have created accounts while the hash was computing.
  const latest = readGuests()
  if (latest.error) return { ok: false, error: latest.error }
  const saved = writeRaw(GUESTS_KEY, JSON.stringify([...latest.guests, guest]))
  if (!saved.ok) return saved
  const session = writeRaw(SESSION_KEY, guest.id)
  if (!session.ok) return session
  return { ok: true, created: true, guest: toPublic(guest) }
}

function wrongPasswordMessage(intent: "sign-in" | "register") {
  return intent === "register"
    ? "That email already has an account here, and the password does not match it. Use the original password, or try another email."
    : "That password does not match this email. Use the password you first signed in with, or try a different email."
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
  today?: string,
): { ok: true; booking: Booking } | ActionFailure {
  const guestsResult = readGuests()
  const bookingsResult = readBookings()
  const error = guestsResult.error ?? bookingsResult.error
  if (error) return { ok: false, error }
  if (!guestsResult.guests.some((guest) => guest.id === guestId)) {
    return { ok: false, error: "Sign in again before confirming this stay." }
  }

  const room = getRoom(input.roomSlug)
  if (!room) return { ok: false, error: "That room is not at the hotel." }
  const quote = quoteStay(room.nightlyRate, input.checkIn, input.checkOut, today)
  if (!quote.ok) return { ok: false, error: quote.error }

  const availability = stayAvailability(
    room.slug,
    input.checkIn,
    input.checkOut,
    bookingsResult.bookings,
    today,
  )
  if (!availability.ok) return { ok: false, error: availability.message }

  const booking: Booking = {
    id: randomId(),
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

export function cancelBooking(guestId: string, bookingId: string): { ok: true } | ActionFailure {
  const bookingsResult = readBookings()
  if (bookingsResult.error) return { ok: false, error: bookingsResult.error }
  const remaining = bookingsResult.bookings.filter(
    (booking) => !(booking.id === bookingId && booking.guestId === guestId),
  )
  if (remaining.length === bookingsResult.bookings.length) {
    return { ok: false, error: "That stay could not be found on this account." }
  }
  return writeRaw(BOOKINGS_KEY, JSON.stringify(remaining))
}

export const storageKeys = { guests: GUESTS_KEY, bookings: BOOKINGS_KEY, session: SESSION_KEY }
