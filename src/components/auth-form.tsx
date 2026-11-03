"use client"

import { Eye, EyeOff, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Notice } from "@/components/notice"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { localizeMessage } from "@/lib/i18n/errors"
import { useCopy, useLocale } from "@/lib/i18n/use-locale"
import { authPath, safeNext } from "@/lib/search"
import { normalizeRegistration, normalizeSignIn, type FieldErrors } from "@/lib/validation"
import { cn } from "cn"

export function AuthForm({ mode }: { mode: "register" | "sign-in" }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = safeNext(searchParams.get("next") ?? "")
  const { status, guest, storageError, register, signIn, signOut } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isRegister = mode === "register"
  const locale = useLocale()
  const copy = useCopy().auth
  const showError = (message?: string) => (message ? localizeMessage(message, locale) : undefined)

  async function submitAccount() {
    if (submitting) return
    setFormError(null)

    const parsed = isRegister
      ? normalizeRegistration({ name, email, password })
      : normalizeSignIn({ email, password })
    if (!parsed.ok) {
      setErrors(parsed.errors)
      return
    }
    setErrors({})
    setSubmitting(true)
    const result = isRegister
      ? await register({ ...parsed.value, name: "name" in parsed.value ? parsed.value.name : undefined })
      : await signIn(parsed.value)
    setSubmitting(false)
    if (!result.ok) {
      if (result.field) setErrors({ [result.field]: result.error })
      else setFormError(result.error)
      return
    }
    router.push(nextPath)
  }

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-md" role="status" aria-live="polite">
        <div className="h-[28rem] animate-pulse rounded-3xl bg-muted" />
        <span className="sr-only">{copy.checking}</span>
      </div>
    )
  }

  if (guest) {
    return (
      <div className="mx-auto w-full max-w-md rounded-3xl bg-card p-6 ring-1 ring-foreground/10 md:p-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">{copy.signedIn}</p>
        <h1 className="mt-3 text-4xl">
          {copy.welcome} {guest.name}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {guest.email} {copy.continueBody}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={nextPath} className={cn(buttonVariants(), "h-11 rounded-full px-5")}>
            {copy.continue}
          </Link>
          <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={signOut}>
            {copy.signOut}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-card p-6 ring-1 ring-foreground/10 md:p-8">
      <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {isRegister ? copy.registerEyebrow : copy.signInEyebrow}
      </p>
      <h1 className="mt-3 text-4xl">{isRegister ? copy.registerTitle : copy.signInTitle}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{isRegister ? copy.registerLede : copy.signInLede}</p>

      <p className="mt-5 flex gap-2 rounded-xl bg-secondary px-3 py-2.5 text-sm leading-5 text-secondary-foreground">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-medium">{copy.demo}</strong> {copy.demoBody}
        </span>
      </p>

      {storageError ? (
        <div className="mt-5">
          <Notice>{localizeMessage(storageError, locale)}</Notice>
        </div>
      ) : null}

      <form
        noValidate
        className="mt-6 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          void submitAccount()
        }}
      >
        {isRegister ? (
          <Field
            id="name"
            label={copy.name}
            autoComplete="name"
            value={name}
            error={showError(errors.name)}
            onChange={(value) => {
              setName(value)
              setErrors((current) => ({ ...current, name: undefined }))
            }}
          />
        ) : null}
        <Field
          id="email"
          label={copy.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          error={showError(errors.email)}
          onChange={(value) => {
            setEmail(value)
            setErrors((current) => ({ ...current, email: undefined }))
          }}
        />
        <Field
          id="password"
          label={copy.password}
          type={showPassword ? "text" : "password"}
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={password}
          error={showError(errors.password)}
          hint={copy.hint}
          onChange={(value) => {
            setPassword(value)
            setErrors((current) => ({ ...current, password: undefined }))
          }}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? copy.hide : copy.show}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />
        {formError ? <Notice>{localizeMessage(formError, locale)}</Notice> : null}
        <button
          type="submit"
          className={cn(buttonVariants(), "mt-1 h-12 rounded-full text-base")}
          disabled={submitting || Boolean(storageError)}
        >
          {submitting ? copy.moment : isRegister ? copy.create : copy.signIn}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        {isRegister ? `${copy.haveAccount} ` : `${copy.addName} `}
        <Link
          href={authPath(isRegister ? "/sign-in" : "/register", nextPath)}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {isRegister ? copy.signIn : copy.create}
        </Link>
      </p>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  trailing,
  type = "text",
  ...rest
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  trailing?: React.ReactNode
  type?: string
  autoComplete?: string
  placeholder?: string
  inputMode?: "email"
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={cn("h-12 bg-background px-3 text-foreground", trailing && "pr-12")}
          {...rest}
        />
        {trailing}
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
