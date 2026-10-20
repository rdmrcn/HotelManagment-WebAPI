"use client"

import { CreditCard, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DEMO_NOTICE,
  cardBrand,
  formatCardNumber,
  formatExpiry,
  type CardErrors,
  type CardField,
  type CardInput,
} from "@/lib/payment"

export const emptyCard: CardInput = { name: "", number: "", expiry: "", cvc: "" }

export const cardFieldId = (field: CardField) => `card-${field}`

/** An expiry that is always in the future, so the demo card works whenever the page is opened. */
export function demoCard(name: string, now = new Date()): CardInput {
  const year = String((now.getFullYear() + 3) % 100).padStart(2, "0")
  return { name, number: formatCardNumber("4242424242424242"), expiry: `12/${year}`, cvc: "123" }
}

export function PaymentFields({
  card,
  errors,
  disabled,
  onChange,
  onFillDemo,
}: {
  card: CardInput
  errors: CardErrors
  disabled?: boolean
  onChange: (field: CardField, value: string) => void
  onFillDemo: () => void
}) {
  const brand = cardBrand(card.number)
  return (
    <div className="grid gap-4">
      <p
        role="note"
        className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-secondary px-3 py-2.5 text-sm leading-6 text-secondary-foreground"
      >
        <span className="font-medium">{DEMO_NOTICE}</span>
        <button
          type="button"
          onClick={onFillDemo}
          disabled={disabled}
          className="rounded-full px-2.5 py-1 text-xs font-medium text-primary underline underline-offset-4 outline-none hover:bg-background/60 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        >
          Fill the demo card
        </button>
      </p>

      <Field field="name" label="Name on card" error={errors.name}>
        <Input
          id={cardFieldId("name")}
          name="cc-name"
          autoComplete="cc-name"
          value={card.name}
          disabled={disabled}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "card-name-error" : undefined}
          onChange={(event) => onChange("name", event.target.value)}
          className="h-12 bg-background px-3 text-foreground"
        />
      </Field>

      <Field field="number" label="Card number" error={errors.number}>
        <div className="relative">
          <Input
            id={cardFieldId("number")}
            name="cc-number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            value={card.number}
            disabled={disabled}
            aria-invalid={errors.number ? true : undefined}
            aria-describedby={errors.number ? "card-number-error" : undefined}
            onChange={(event) => onChange("number", formatCardNumber(event.target.value))}
            className="h-12 bg-background pr-24 pl-3 text-foreground tabular-nums"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5 text-xs text-muted-foreground"
          >
            <CreditCard className="size-4" />
            {brand === "Card" ? "" : brand}
          </span>
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field field="expiry" label="Expiry (MM/YY)" error={errors.expiry}>
          <Input
            id={cardFieldId("expiry")}
            name="cc-exp"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={card.expiry}
            disabled={disabled}
            aria-invalid={errors.expiry ? true : undefined}
            aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
            onChange={(event) => onChange("expiry", formatExpiry(event.target.value))}
            className="h-12 bg-background px-3 text-foreground tabular-nums"
          />
        </Field>
        <Field field="cvc" label="CVC" error={errors.cvc}>
          <Input
            id={cardFieldId("cvc")}
            name="cc-csc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            value={card.cvc}
            disabled={disabled}
            aria-invalid={errors.cvc ? true : undefined}
            aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
            onChange={(event) => onChange("cvc", event.target.value.replace(/\D/g, ""))}
            className="h-12 bg-background px-3 text-foreground tabular-nums"
          />
        </Field>
      </div>

      <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
        <Lock className="size-3.5 shrink-0" aria-hidden />
        The card number and CVC stay in this form. Only the last four digits are saved with the booking.
      </p>
    </div>
  )
}

function Field({
  field,
  label,
  error,
  children,
}: {
  field: CardField
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={cardFieldId(field)}>{label}</Label>
      {children}
      {error ? (
        <p id={`card-${field}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
