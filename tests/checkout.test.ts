// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { nightAvailability, stayAvailability } from "@/lib/availability"
import type { CardInput } from "@/lib/payment"
import { addDays, todayISO } from "@/lib/stay"
import { authenticateGuest, payAndBook, readAuthState, storageKeys, type Booking } from "@/lib/storage"

const demoCard: CardInput = { name: "Ada Lovelace", number: "4242 4242 4242 4242", expiry: "12/45", cvc: "123" }

async function signedInGuest() {
  const result = await authenticateGuest({ email: "ada@example.com", password: "first-pass", intent: "register" })
  if (!result.ok) throw new Error("sign in failed")
  return result.guest
}

/** First stay of `nights` nights the seeded calendar can take, so the tests do not depend on the date they run. */
function freeStay(slug: string, bookings: Booking[] = [], nights = 2) {
  const today = todayISO()
  for (let offset = 2; offset < 50; offset += 1) {
    const checkIn = addDays(today, offset)
    const checkOut = addDays(checkIn, nights)
    if (stayAvailability(slug, checkIn, checkOut, bookings, today).ok) return { checkIn, checkOut }
  }
  throw new Error("no free stay found")
}

function leftOn(slug: string, date: string) {
  return nightAvailability(slug, date, readAuthState().allBookings).left
}

beforeEach(() => {
  window.localStorage.clear()
})

describe("demo checkout", () => {
  it("books after the 4242 card pays, saves only the last four digits, and uses up one room", async () => {
    const guest = await signedInGuest()
    const stay = freeStay("suite")
    const before = leftOn("suite", stay.checkIn)

    const result = await payAndBook(guest.id, { roomSlug: "suite", ...stay, guests: 2, card: demoCard })
    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.booking.guests).toBe(2)
    expect(result.booking.payment).toMatchObject({ status: "paid", brand: "Visa", last4: "4242", amount: result.booking.total })
    expect(readAuthState().bookings).toHaveLength(1)
    expect(leftOn("suite", stay.checkIn)).toBe(before - 1)

    const raw = window.localStorage.getItem(storageKeys.bookings) ?? ""
    expect(raw).toContain('"last4":"4242"')
    expect(raw).not.toContain("4242424242424242")
    expect(raw).not.toContain("4242 4242")
    expect(raw).not.toContain("12/45")
    expect(raw).not.toContain('"cvc"')
    expect(raw).not.toContain("Lovelace")
    for (const key of Object.values(storageKeys)) {
      const value = window.localStorage.getItem(key) ?? ""
      expect(value).not.toContain("4242424242424242")
    }
  })

  it("declines 4000 0000 0000 0002, creates no booking and leaves availability alone", async () => {
    const guest = await signedInGuest()
    const stay = freeStay("suite")
    const before = leftOn("suite", stay.checkIn)

    const result = await payAndBook(guest.id, {
      roomSlug: "suite",
      ...stay,
      guests: 2,
      card: { ...demoCard, number: "4000 0000 0000 0002" },
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe("declined")
    expect(result.error).toMatch(/declined/i)

    expect(readAuthState().bookings).toHaveLength(0)
    expect(window.localStorage.getItem(storageKeys.bookings)).toBeNull()
    expect(leftOn("suite", stay.checkIn)).toBe(before)
    expect(leftOn("suite", addDays(stay.checkIn, 1))).toBe(nightAvailability("suite", addDays(stay.checkIn, 1), []).left)
  })

  it("books nothing for another card that passes Luhn", async () => {
    const guest = await signedInGuest()
    const stay = freeStay("standard")
    const before = leftOn("standard", stay.checkIn)
    const result = await payAndBook(guest.id, {
      roomSlug: "standard",
      ...stay,
      guests: 1,
      card: { ...demoCard, number: "5555 5555 5555 4444" },
    })
    expect(result).toMatchObject({ ok: false, code: "demo_card_only" })
    expect(readAuthState().bookings).toHaveLength(0)
    expect(leftOn("standard", stay.checkIn)).toBe(before)
  })

  it("books nothing when the card is invalid", async () => {
    const guest = await signedInGuest()
    const stay = freeStay("standard")
    const result = await payAndBook(guest.id, {
      roomSlug: "standard",
      ...stay,
      guests: 1,
      card: { ...demoCard, number: "4242 4242 4242 4241" },
    })
    expect(result).toMatchObject({ ok: false, code: "invalid_card" })
    expect(readAuthState().bookings).toHaveLength(0)
  })

  it("does not take payment for nights that are gone, or for too many guests", async () => {
    const guest = await signedInGuest()
    const stay = freeStay("standard")
    const tooMany = await payAndBook(guest.id, { roomSlug: "standard", ...stay, guests: 9, card: demoCard })
    expect(tooMany).toMatchObject({ ok: false, code: "unavailable" })
    const outside = await payAndBook(guest.id, {
      roomSlug: "standard",
      checkIn: addDays(todayISO(), 200),
      checkOut: addDays(todayISO(), 202),
      guests: 1,
      card: demoCard,
    })
    expect(outside).toMatchObject({ ok: false, code: "unavailable" })
    expect(readAuthState().bookings).toHaveLength(0)
  })

  it("requires a signed-in guest", async () => {
    const stay = freeStay("standard")
    const result = await payAndBook("missing", { roomSlug: "standard", ...stay, guests: 1, card: demoCard })
    expect(result).toMatchObject({ ok: false, code: "unavailable" })
    expect(window.localStorage.getItem(storageKeys.bookings)).toBeNull()
  })

  it("keeps stays saved before checkout existed, with one guest and no payment", async () => {
    const guest = await signedInGuest()
    window.localStorage.setItem(
      storageKeys.bookings,
      JSON.stringify([
        {
          id: "old",
          confirmationCode: "BOS-OLDX",
          guestId: guest.id,
          roomSlug: "standard",
          checkIn: "2026-12-01",
          checkOut: "2026-12-03",
          nights: 2,
          nightlyRate: 220,
          total: 440,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ]),
    )
    const [booking] = readAuthState().bookings
    expect(booking).toMatchObject({ confirmationCode: "BOS-OLDX", guests: 1, payment: null })
  })
})
