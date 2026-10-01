"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Notice } from "@/components/notice"
import { PageHeader } from "@/components/page-header"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authPath } from "@/lib/search"
import { normalizeRegistration, normalizeSignIn, type FieldErrors } from "@/lib/validation"

export function AuthForm({
  mode,
  nextPath,
}: {
  mode: "register" | "sign-in"
  nextPath: string
}) {
  const router = useRouter()
  const { status, guest, storageError, register, signIn, signOut } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isRegister = mode === "register"

  async function submitAccount() {
    setFormError(null)

    if (isRegister) {
      const parsed = normalizeRegistration({ name, email, password })
      if (!parsed.ok) {
        setErrors(parsed.errors)
        return
      }
      setErrors({})
      setSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      const result = register(parsed.value)
      setSubmitting(false)
      if (!result.ok) {
        if (result.field) setErrors({ [result.field]: result.error })
        else setFormError(result.error)
        return
      }
      router.push(nextPath)
      return
    }

    const parsed = normalizeSignIn({ email, password })
    if (!parsed.ok) {
      setErrors(parsed.errors)
      return
    }
    setErrors({})
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    const result = signIn(parsed.value)
    setSubmitting(false)
    if (!result.ok) {
      if (result.field) setErrors({ [result.field]: result.error })
      else setFormError(result.error)
      return
    }
    router.push(nextPath)
  }

  if (guest) {
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader
          eyebrow="Account"
          title="You are already signed in"
          lede={`${guest.name} is the guest on this browser. Continue to the stay, or sign out to use a different name.`}
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={nextPath}
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Continue
          </Link>
          <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-xl gap-8">
      <PageHeader
        eyebrow={isRegister ? "Register" : "Sign in"}
        title={isRegister ? "Create your guest account" : "Sign in to your stay"}
        lede={
          isRegister
            ? "Name, email, and a password. They stay in this browser so you can see the booking later. Nothing is sent to a server."
            : "Use the email and password you saved in this browser."
        }
      />
      {status === "loading" ? (
        <p role="status" className="text-sm text-muted-foreground">
          Checking this browser for a saved account…
        </p>
      ) : null}
      {storageError ? <Notice>{storageError}</Notice> : null}
      <form
        method="post"
        action="#account"
        noValidate
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          void submitAccount()
        }}
      >
        {isRegister ? (
          <Field
            id="name"
            label="Name"
            autoComplete="name"
            value={name}
            error={errors.name}
            onChange={(value) => {
              setName(value)
              setErrors((current) => ({ ...current, name: undefined }))
            }}
          />
        ) : null}
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={(value) => {
            setEmail(value)
            setErrors((current) => ({ ...current, email: undefined }))
          }}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={password}
          error={errors.password}
          onChange={(value) => {
            setPassword(value)
            setErrors((current) => ({ ...current, password: undefined }))
          }}
          hint={isRegister ? "At least 8 characters. Stored only in this browser." : undefined}
        />
        {formError ? <Notice>{formError}</Notice> : null}
        <button
          type="button"
          className={cn(buttonVariants(), "h-11 rounded-full")}
          disabled={submitting || Boolean(storageError)}
          onClick={() => {
            void submitAccount()
          }}
        >
          {submitting ? "Saving…" : isRegister ? "Create account" : "Sign in"}
        </button>
      </form>
      <p className="text-sm text-muted-foreground">
        {isRegister ? "Already registered in this browser? " : "No account in this browser yet? "}
        <Link
          href={authPath(isRegister ? "/sign-in" : "/register", nextPath)}
          className="font-medium text-primary"
        >
          {isRegister ? "Sign in" : "Create an account"}
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
  type = "text",
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  type?: string
  autoComplete?: string
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 bg-background px-3 text-foreground"
      />
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
