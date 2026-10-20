import { stayAvailability } from "@/lib/availability"
import { hashPassword, newSalt, randomId, verifyPassword } from "@/lib/password"
import { processPayment, type CardInput, type Payment, type PaymentFailure } from "@/lib/payment"
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
  guests: number
  nights: number
  nightlyRate: number
  total: number
  /** Null for stays saved before demo checkout existed. Holds the last four digits only. */
  payment: Payment | null
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

function isPayment(value: unknown): value is Payment {
  if (!value || typeof value !== "object") return false
  const payment = value as Record<string, unknown>
  return (
    payment.status === "paid" &&
    typeof payment.brand === "string" &&
    typeof payment.last4 === "string" &&
    /^\d{4}$/.test(payment.last4) &&
    typeof payment.amount === "number" &&
    payment.currency === "EUR" &&
    typeof payment.paidAt === "string" &&
    typeof payment.reference === "string"
  )
}

function toBooking(value: unknown): Booking | null {
  if (!value || typeof value !== "object") return null
  const booking = value as Record<string, unknown>
  if (
    typeof booking.id !== "string" ||
    typeof booking.confirmationCode !== "string" ||
    typeof booking.guestId !== "string" ||
    typeof booking.roomSlug !== "string" ||
    typeof booking.checkIn !== "string" ||
    typeof booking.checkOut !== "string" ||
    typeof booking.nights !== "number" ||
    typeof booking.nightlyRate !== "number" ||
    typeof booking.total !== "number" ||
    typeof booking.createdAt !== "string"
  ) {
    return null
  }
  const guests = typeof booking.guests === "number" && booking.guests >= 1 ? Math.floor(booking.guests) : 1
  return {
    id: booking.id,
    confirmationCode: booking.confirmationCode,
    guestId: booking.guestId,
    roomSlug: booking.roomSlug,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests,
    nights: booking.nights,
    nightlyRate: booking.nightlyRate,
    total: booking.total,
    payment: isPayment(booking.payment) ? booking.payment : null,
    createdAt: booking.createdAt,
  }
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
    const bookings = parsed.map(toBooking).filter((booking): booking is Booking => booking !== null)
    return { bookings, error: null }
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

export type BookingInput = { roomSlug: string; checkIn: string; checkOut: string; guests?: number }

/** Everything that has to be true before a stay can be held, without writing anything. */
function checkBooking(guestId: string, input: BookingInput, today?: string) {
  const guestsResult = readGuests()
  const bookingsResult = readBookings()
  const error = guestsResult.error ?? bookingsResult.error
  if (error) return { ok: false as const, error }
  if (!guestsResult.guests.some((guest) => guest.id === guestId)) {
    return { ok: false as const, error: "Sign in again before confirming this stay." }
  }

  const room = getRoom(input.roomSlug)
  if (!room) return { ok: false as const, error: "That room is not at the hotel." }
  const guests = input.guests ?? 1
  if (!Number.isInteger(guests) || guests < 1 || guests > room.sleeps) {
    return { ok: false as const, error: `${room.name} sleeps ${room.sleeps}. Choose between 1 and ${room.sleeps} guests.` }
  }
  const quote = quoteStay(room.nightlyRate, input.checkIn, input.checkOut, today)
  if (!quote.ok) return { ok: false as const, error: quote.error }

  const availability = stayAvailability(room.slug, input.checkIn, input.checkOut, bookingsResult.bookings, today)
  if (!availability.ok) return { ok: false as const, error: availability.message }
  return { ok: true as const, room, quote, guests, bookings: bookingsResult.bookings }
}

/** Holds the nights. Callers that take money go through `payAndBook` instead. */
export function saveBooking(
  guestId: string,
  input: BookingInput,
  today?: string,
  payment: Payment | null = null,
): { ok: true; booking: Booking } | ActionFailure {
  const checked = checkBooking(guestId, input, today)
  if (!checked.ok) return checked

  const booking: Booking = {
    id: randomId(),
    confirmationCode: confirmationCode(),
    guestId,
    roomSlug: checked.room.slug,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: checked.guests,
    nights: checked.quote.nights,
    nightlyRate: checked.quote.nightlyRate,
    total: checked.quote.total,
    payment,
    createdAt: new Date().toISOString(),
  }
  const saved = writeRaw(BOOKINGS_KEY, JSON.stringify([...checked.bookings, booking]))
  if (!saved.ok) return saved
  return { ok: true, booking }
}

export type CheckoutFailure =
  | PaymentFailure
  | { ok: false; code: "unavailable"; error: string; field?: undefined; fields?: undefined }

/**
 * Demo checkout. The stay is checked first so nobody pays for nights that are gone, the card is run next,
 * and the booking is written only if the payment succeeded. A failed payment writes nothing, so the
 * calendar is untouched. The card number and CVC are never stored; the booking keeps the last four digits.
 */
export async function payAndBook(
  guestId: string,
  input: BookingInput & { card: CardInput },
  today?: string,
  now = new Date(),
): Promise<{ ok: true; booking: Booking } | CheckoutFailure> {
  const { card, ...stay } = input
  const checked = checkBooking(guestId, stay, today)
  if (!checked.ok) return { ok: false, code: "unavailable", error: checked.error }

  const charge = await processPayment(card, checked.quote.total, now)
  if (!charge.ok) return charge

  const saved = saveBooking(guestId, stay, today, charge.payment)
  if (!saved.ok) {
    return {
      ok: false,
      code: "unavailable",
      error: `${saved.error} Nothing was charged and no booking was made.`,
    }
  }
  return saved
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
