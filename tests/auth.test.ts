// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { addDays, todayISO } from "@/lib/stay"
import {
  authenticateGuest,
  cancelBooking,
  readAuthState,
  saveBooking,
  signOutGuest,
  storageKeys,
} from "@/lib/storage"
import { normalizeRegistration, normalizeSignIn } from "@/lib/validation"

beforeEach(() => {
  window.localStorage.clear()
})

describe("validation", () => {
  it("accepts any well-formed email and a six character password", () => {
    const parsed = normalizeSignIn({ email: "  Random@Gmail.com ", password: "abcdef" })
    expect(parsed).toEqual({ ok: true, value: { email: "random@gmail.com", password: "abcdef" } })
  })

  it("rejects malformed emails and short passwords", () => {
    const bad = normalizeSignIn({ email: "not-an-email", password: "abc" })
    expect(bad.ok).toBe(false)
    if (!bad.ok) {
      expect(bad.errors.email).toMatch(/valid email/)
      expect(bad.errors.password).toMatch(/at least 6/)
    }
    expect(normalizeSignIn({ email: "a@b", password: "abcdef" }).ok).toBe(false)
    expect(normalizeRegistration({ name: "", email: "a@b.co", password: "abcdef" }).ok).toBe(true)
  })
})

describe("sign in and register", () => {
  it("creates an account for an unknown email and signs in", async () => {
    const result = await authenticateGuest({
      email: "random@gmail.com",
      password: "anything1",
      intent: "sign-in",
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.created).toBe(true)
      expect(result.guest.name).toBe("Random")
    }
    expect(readAuthState().guest?.email).toBe("random@gmail.com")
  })

  it("requires the same password for a known email", async () => {
    await authenticateGuest({ email: "ada@example.com", password: "first-pass", intent: "register", name: "Ada L" })
    signOutGuest()
    expect(readAuthState().guest).toBeNull()

    const wrong = await authenticateGuest({ email: "ada@example.com", password: "second-pass", intent: "sign-in" })
    expect(wrong.ok).toBe(false)
    if (!wrong.ok) expect(wrong.field).toBe("password")
    expect(readAuthState().guest).toBeNull()

    const right = await authenticateGuest({ email: "ADA@example.com", password: "first-pass", intent: "sign-in" })
    expect(right.ok && !right.created).toBe(true)
    expect(readAuthState().guest?.name).toBe("Ada L")
  })

  it("treats registering a known email with the same password as a sign-in", async () => {
    await authenticateGuest({ email: "ada@example.com", password: "first-pass", intent: "register" })
    signOutGuest()
    const again = await authenticateGuest({ email: "ada@example.com", password: "first-pass", intent: "register" })
    expect(again.ok && !again.created).toBe(true)
    const clash = await authenticateGuest({ email: "ada@example.com", password: "nope-nope", intent: "register" })
    expect(clash.ok).toBe(false)
  })

  it("never stores the password in plain text", async () => {
    await authenticateGuest({ email: "ada@example.com", password: "plain-text-check", intent: "register" })
    const raw = window.localStorage.getItem(storageKeys.guests) ?? ""
    expect(raw).not.toContain("plain-text-check")
    expect(raw).toMatch(/"passwordHash":"[0-9a-f]{64}"/)
    expect(raw).toMatch(/"salt":"[0-9a-f]{32}"/)
  })

  it("keeps the session until sign-out", async () => {
    await authenticateGuest({ email: "ada@example.com", password: "first-pass", intent: "register" })
    expect(readAuthState().guest?.email).toBe("ada@example.com")
    signOutGuest()
    expect(readAuthState().guest).toBeNull()
  })

  it("upgrades a legacy plain-text account on sign-in", async () => {
    window.localStorage.setItem(
      storageKeys.guests,
      JSON.stringify([
        { id: "g1", name: "Old Guest", email: "old@example.com", password: "legacy-pass", createdAt: "2026-01-01T00:00:00.000Z" },
      ]),
    )
    const wrong = await authenticateGuest({ email: "old@example.com", password: "bad-pass", intent: "sign-in" })
    expect(wrong.ok).toBe(false)
    const right = await authenticateGuest({ email: "old@example.com", password: "legacy-pass", intent: "sign-in" })
    expect(right.ok).toBe(true)
    const raw = window.localStorage.getItem(storageKeys.guests) ?? ""
    expect(raw).not.toContain("legacy-pass")
    expect(raw).toContain("passwordHash")
  })
})

describe("saving a booking", () => {
  it("saves a stay for the signed-in guest and lists it", async () => {
    const result = await authenticateGuest({ email: "ada@example.com", password: "first-pass", intent: "register" })
    if (!result.ok) throw new Error("sign in failed")
    const today = todayISO()
    const checkIn = addDays(today, 3)
    const saved = saveBooking(result.guest.id, { roomSlug: "standard", checkIn, checkOut: addDays(checkIn, 2) })
    // A seeded sold-out night is possible, so only check the shape of whichever outcome we got.
    if (saved.ok) {
      expect(saved.booking.confirmationCode).toMatch(/^BOS-[A-Z2-9]{4}$/)
      expect(readAuthState().bookings).toHaveLength(1)
    } else {
      expect(saved.error).toMatch(/sold out/)
    }
  })

  it("refuses to save without a known guest", () => {
    const checkIn = addDays(todayISO(), 3)
    const saved = saveBooking("missing", { roomSlug: "standard", checkIn, checkOut: addDays(checkIn, 1) })
    expect(saved.ok).toBe(false)
  })
})

describe("cancelling a booking", () => {
  it("removes only the guest's own stay", async () => {
    const result = await authenticateGuest({ email: "ada@example.com", password: "first-pass", intent: "register" })
    if (!result.ok) throw new Error("sign in failed")
    // Search for a stay the seeded calendar can accept.
    const today = todayISO()
    let saved: ReturnType<typeof saveBooking> = { ok: false, error: "none" }
    for (let offset = 2; offset < 40 && !saved.ok; offset += 1) {
      const checkIn = addDays(today, offset)
      saved = saveBooking(result.guest.id, { roomSlug: "standard", checkIn, checkOut: addDays(checkIn, 1) })
    }
    expect(saved.ok).toBe(true)
    if (!saved.ok) return
    expect(cancelBooking("someone-else", saved.booking.id).ok).toBe(false)
    expect(readAuthState().bookings).toHaveLength(1)
    expect(cancelBooking(result.guest.id, saved.booking.id).ok).toBe(true)
    expect(readAuthState().bookings).toHaveLength(0)
  })

  it("never double-books a room once this browser has taken the last unit", async () => {
    const result = await authenticateGuest({ email: "ada@example.com", password: "first-pass", intent: "register" })
    if (!result.ok) throw new Error("sign in failed")
    const today = todayISO()
    const checkIn = addDays(today, 5)
    const checkOut = addDays(checkIn, 1)
    let guard = 0
    while (guard < 20) {
      guard += 1
      const saved = saveBooking(result.guest.id, { roomSlug: "presidential", checkIn, checkOut })
      if (!saved.ok) {
        expect(saved.error).toMatch(/sold out/)
        break
      }
    }
    expect(guard).toBeLessThanOrEqual(3)
    expect(readAuthState().allBookings.length).toBeLessThanOrEqual(2)
  })
})
