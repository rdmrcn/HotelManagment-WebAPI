"use client"

import { CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { Notice } from "@/components/notice"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveInquiry, type Inquiry, type InquiryField } from "@/lib/inquiries"
import { formatStayDate } from "@/lib/format"
import { useCopy } from "@/lib/i18n/use-locale"
import { useLocale } from "@/lib/i18n/use-locale"
import { cn } from "cn"

export function ContactForm() {
  const locale = useLocale()
  const copy = useCopy().contactPage
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [field, setField] = useState<InquiryField | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<Inquiry | null>(null)

  if (saved) {
    const dates =
      saved.checkIn && saved.checkOut
        ? `${formatStayDate(saved.checkIn, locale)} – ${formatStayDate(saved.checkOut, locale)}`
        : null
    return (
      <div role="status" className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10 md:p-8">
        <CheckCircle2 className="size-8 text-primary" aria-hidden />
        <h2 className="mt-3 text-3xl">{copy.successTitle}</h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-foreground/80">{copy.successBody}</p>
        <div className="mt-6 rounded-2xl bg-secondary/70 p-4 text-sm leading-6">
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">{copy.yourNote}</p>
          <p className="mt-2 font-medium">{saved.name}</p>
          <p className="text-muted-foreground">{saved.email}</p>
          {dates ? <p className="mt-1">{dates}</p> : null}
          <p className="mt-2 whitespace-pre-line">{saved.message}</p>
        </div>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }), "mt-6 h-11 rounded-full px-5")}
          onClick={() => {
            setSaved(null)
            setName("")
            setEmail("")
            setMessage("")
            setCheckIn("")
            setCheckOut("")
            setError(null)
            setField(null)
          }}
        >
          {copy.another}
        </button>
      </div>
    )
  }

  return (
    <form
      noValidate
      className="grid max-w-xl gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (saving) return
        setSaving(true)
        const result = saveInquiry({ name, email, message, checkIn, checkOut }, locale)
        setSaving(false)
        if (!result.ok) {
          setError(result.error)
          setField(result.field ?? null)
          return
        }
        setSaved(result.inquiry)
      }}
    >
      <Field id="contact-name" label={copy.name} error={field === "name" ? error : null}>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            setField(null)
            setError(null)
          }}
          className="h-12 bg-background px-3"
        />
      </Field>
      <Field id="contact-email" label={copy.email} error={field === "email" ? error : null}>
        <Input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setField(null)
            setError(null)
          }}
          className="h-12 bg-background px-3"
        />
      </Field>
      <Field id="contact-message" label={copy.message} error={field === "message" ? error : null}>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value)
            setField(null)
            setError(null)
          }}
          className="w-full rounded-lg border border-input bg-background px-3 py-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </Field>
      <fieldset className="grid gap-3">
        <legend className="text-sm font-medium">{copy.dates}</legend>
        <p className="text-sm text-muted-foreground">{copy.datesHint}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="contact-check-in" label={copy.checkIn}>
            <Input
              id="contact-check-in"
              name="checkIn"
              type="date"
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value)
                setField(null)
                setError(null)
              }}
              className="h-12 bg-background px-3"
            />
          </Field>
          <Field id="contact-check-out" label={copy.checkOut}>
            <Input
              id="contact-check-out"
              name="checkOut"
              type="date"
              value={checkOut}
              onChange={(event) => {
                setCheckOut(event.target.value)
                setField(null)
                setError(null)
              }}
              className="h-12 bg-background px-3"
            />
          </Field>
        </div>
        {field === "dates" && error ? <Notice>{error}</Notice> : null}
        {error && !field ? <Notice>{error}</Notice> : null}
      </fieldset>
      <button type="submit" className={cn(buttonVariants(), "h-12 w-fit rounded-full px-6 text-base")} disabled={saving}>
        {saving ? copy.sending : copy.submit}
      </button>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string | null
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
