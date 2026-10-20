import { describe, expect, it } from "vitest"
import {
  DEMO_CARD,
  DEMO_DECLINE_CARD,
  cardBrand,
  formatCardNumber,
  formatExpiry,
  luhnValid,
  processPayment,
  validateCard,
  validateCvc,
  validateExpiry,
  type CardInput,
} from "@/lib/payment"

const now = new Date(2026, 9, 20, 12, 0, 0)
const good: CardInput = { name: "Ada Lovelace", number: "4242 4242 4242 4242", expiry: "12/29", cvc: "123" }

describe("Luhn check", () => {
  it("accepts well-known test numbers", () => {
    for (const number of [DEMO_CARD, DEMO_DECLINE_CARD, "5555555555554444", "378282246310005", "4000 0566 5566 5556"]) {
      expect(luhnValid(number), number).toBe(true)
    }
  })

  it("rejects a number with one wrong digit, wrong length or no digits", () => {
    expect(luhnValid("4242 4242 4242 4241")).toBe(false)
    expect(luhnValid("1234 5678 9012 3456")).toBe(false)
    expect(luhnValid("4242")).toBe(false)
    expect(luhnValid("")).toBe(false)
    expect(luhnValid("abcd efgh ijkl mnop")).toBe(false)
  })
})

describe("card field helpers", () => {
  it("groups digits and the expiry slash while typing", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242")
    expect(formatCardNumber("42a42-4")).toBe("4242 4")
    expect(formatExpiry("1")).toBe("1")
    expect(formatExpiry("123")).toBe("12/3")
    expect(formatExpiry("1229")).toBe("12/29")
  })

  it("names the card brand", () => {
    expect(cardBrand("4242")).toBe("Visa")
    expect(cardBrand("5555")).toBe("Mastercard")
    expect(cardBrand("3782")).toBe("Amex")
    expect(cardBrand("9")).toBe("Card")
  })

  it("accepts a future expiry and the current month, rejects the past and bad input", () => {
    expect(validateExpiry("12/29", now)).toBeNull()
    expect(validateExpiry("10/26", now)).toBeNull()
    expect(validateExpiry("09/26", now)).toMatch(/expired/)
    expect(validateExpiry("12/25", now)).toMatch(/expired/)
    expect(validateExpiry("13/29", now)).toMatch(/between 01 and 12/)
    expect(validateExpiry("00/29", now)).toMatch(/between 01 and 12/)
    expect(validateExpiry("1229", now)).toMatch(/MM\/YY/)
    expect(validateExpiry("", now)).toMatch(/MM\/YY/)
  })

  it("wants a 3-digit CVC", () => {
    expect(validateCvc("123", DEMO_CARD)).toBeNull()
    expect(validateCvc("12", DEMO_CARD)).not.toBeNull()
    expect(validateCvc("1234", DEMO_CARD)).not.toBeNull()
    expect(validateCvc("12a", DEMO_CARD)).not.toBeNull()
  })

  it("reports every invalid field at once", () => {
    expect(validateCard(good, now)).toEqual({})
    const errors = validateCard({ name: "", number: "4242 4242 4242 4241", expiry: "01/20", cvc: "1" }, now)
    expect(Object.keys(errors).sort()).toEqual(["cvc", "expiry", "name", "number"])
    expect(errors.number).toMatch(/not valid/)
  })
})

describe("processPayment", () => {
  it("approves the 4242 demo card and keeps only the last four digits", async () => {
    const result = await processPayment(good, 1530, now)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.payment).toMatchObject({ status: "paid", brand: "Visa", last4: "4242", amount: 1530, currency: "EUR" })
    expect(result.payment.reference).toMatch(/^PAY-[0-9A-F]{8}$/)
    const serialised = JSON.stringify(result)
    expect(serialised).not.toContain("4242424242424242")
    expect(serialised).not.toContain("4242 4242")
    expect(serialised).not.toContain('"cvc"')
  })

  it("declines 4000 0000 0000 0002 with a clear message", async () => {
    const result = await processPayment({ ...good, number: "4000 0000 0000 0002" }, 1530, now)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe("declined")
    expect(result.error).toMatch(/declined/i)
    expect(result.error).toMatch(/nothing was charged/i)
  })

  it("accepts any 3-digit CVC and any future expiry for the demo card", async () => {
    for (const [expiry, cvc] of [["10/26", "000"], ["01/45", "999"]] as const) {
      const result = await processPayment({ ...good, expiry, cvc }, 100, now)
      expect(result.ok, `${expiry} ${cvc}`).toBe(true)
    }
  })

  it("says only the demo card is accepted for any other number that passes Luhn", async () => {
    for (const number of ["5555 5555 5555 4444", "4000 0566 5566 5556", "3782 822463 10005"]) {
      const result = await processPayment({ ...good, number, cvc: number.startsWith("3782") ? "1234" : "123" }, 100, now)
      expect(result.ok, number).toBe(false)
      if (!result.ok) {
        expect(result.code).toBe("demo_card_only")
        expect(result.error).toMatch(/only the demo card is accepted/i)
      }
    }
  })

  it("rejects numbers that fail Luhn or expiry before any card logic", async () => {
    const badNumber = await processPayment({ ...good, number: "4242 4242 4242 4241" }, 100, now)
    expect(badNumber).toMatchObject({ ok: false, code: "invalid_card", field: "number" })
    const expired = await processPayment({ ...good, expiry: "01/24" }, 100, now)
    expect(expired).toMatchObject({ ok: false, code: "invalid_card", field: "expiry" })
    const badCvc = await processPayment({ ...good, cvc: "12" }, 100, now)
    expect(badCvc).toMatchObject({ ok: false, code: "invalid_card", field: "cvc" })
  })
})
