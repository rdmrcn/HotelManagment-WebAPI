import { randomHex } from "@/lib/password"

export const DEMO_CARD = "4242424242424242"
export const DEMO_DECLINE_CARD = "4000000000000002"
export const DEMO_NOTICE = "Demo checkout. No real charge. Use 4242 4242 4242 4242."

export type CardInput = {
  name: string
  number: string
  expiry: string
  cvc: string
}

export type CardField = "name" | "number" | "expiry" | "cvc"
export type CardErrors = Partial<Record<CardField, string>>

/** What is kept after a payment. The card number, expiry and CVC are never part of this. */
export type Payment = {
  status: "paid"
  brand: string
  last4: string
  amount: number
  currency: "EUR"
  paidAt: string
  reference: string
}

export type PaymentFailure = {
  ok: false
  code: "invalid_card" | "declined" | "demo_card_only"
  error: string
  field?: CardField
  fields?: CardErrors
}

export type PaymentResult = { ok: true; payment: Payment } | PaymentFailure

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "")
}

/** Groups digits in fours as the visitor types. */
export function formatCardNumber(value: string) {
  return digitsOnly(value)
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim()
}

/** Inserts the slash as the visitor types: "123" becomes "12/3". */
export function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function luhnValid(value: string) {
  const digits = digitsOnly(value)
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let double = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (double) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    double = !double
  }
  return sum % 10 === 0
}

export function cardBrand(value: string) {
  const digits = digitsOnly(value)
  if (/^4/.test(digits)) return "Visa"
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard"
  if (/^3[47]/.test(digits)) return "Amex"
  return "Card"
}

/**
 * An expiry is good through the last day of its month. Two-digit years are read as 20YY.
 */
export function validateExpiry(value: string, now = new Date()) {
  const match = /^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/.exec(value.trim())
  if (!match) return "Enter the expiry as MM/YY."
  const month = Number(match[1])
  const rawYear = match[2] ?? ""
  const year = rawYear.length === 2 ? 2000 + Number(rawYear) : Number(rawYear)
  if (month < 1 || month > 12) return "The expiry month has to be between 01 and 12."
  const currentMonth = now.getFullYear() * 12 + now.getMonth()
  if (year * 12 + (month - 1) < currentMonth) return "That card has expired. Use a future expiry."
  return null
}

export function validateCvc(value: string, number = "") {
  const digits = digitsOnly(value)
  const length = cardBrand(number) === "Amex" ? 4 : 3
  if (digits.length !== length || digits !== value.trim()) return `The security code is ${length} digits.`
  return null
}

export function validateCard(card: CardInput, now = new Date()): CardErrors {
  const errors: CardErrors = {}
  const name = card.name.trim()
  if (name.length < 2) errors.name = "Enter the name on the card."
  else if (name.length > 80) errors.name = "That name is too long."

  const digits = digitsOnly(card.number)
  if (digits.length === 0) errors.number = "Enter the card number."
  else if (digits.length < 13 || digits.length > 19) errors.number = "A card number has 13 to 19 digits."
  else if (!luhnValid(digits)) errors.number = "That card number is not valid. Check the digits."

  const expiry = validateExpiry(card.expiry, now)
  if (expiry) errors.expiry = expiry
  const cvc = validateCvc(card.cvc, card.number)
  if (cvc) errors.cvc = cvc
  return errors
}

function firstError(errors: CardErrors): { field: CardField; error: string } | null {
  for (const field of ["name", "number", "expiry", "cvc"] as const) {
    const error = errors[field]
    if (error) return { field, error }
  }
  return null
}

/**
 * Stand-in for a payment provider. There is no network call and no secret key: it recognises Stripe's
 * documented test numbers and nothing else. Only the last four digits leave this function.
 */
export async function processPayment(card: CardInput, amount: number, now = new Date()): Promise<PaymentResult> {
  const errors = validateCard(card, now)
  const first = firstError(errors)
  if (first) {
    return { ok: false, code: "invalid_card", error: first.error, field: first.field, fields: errors }
  }

  const digits = digitsOnly(card.number)
  if (digits === DEMO_DECLINE_CARD) {
    return {
      ok: false,
      code: "declined",
      field: "number",
      error: "Your card was declined. No booking was made and nothing was charged. Try a different card.",
    }
  }
  if (digits !== DEMO_CARD) {
    return {
      ok: false,
      code: "demo_card_only",
      field: "number",
      error: "Only the demo card is accepted. Use 4242 4242 4242 4242 with any future expiry and any 3-digit CVC.",
    }
  }

  return {
    ok: true,
    payment: {
      status: "paid",
      brand: cardBrand(digits),
      last4: digits.slice(-4),
      amount,
      currency: "EUR",
      paidAt: now.toISOString(),
      reference: `PAY-${randomHex(4).toUpperCase()}`,
    },
  }
}
