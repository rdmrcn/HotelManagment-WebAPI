export type RegisterInput = {
  name: string
  email: string
  password: string
}

export type FieldErrors = Partial<Record<keyof RegisterInput, string>>

export function normalizeRegistration(
  input: RegisterInput,
): { ok: true; value: RegisterInput } | { ok: false; errors: FieldErrors } {
  const name = input.name.trim().replace(/\s+/g, " ")
  const email = input.email.trim().toLowerCase()
  const password = input.password
  const errors: FieldErrors = {}

  if (name.length < 2) {
    errors.name = "Enter the name that should appear on the reservation."
  } else if (name.length > 80) {
    errors.name = "Use a name of 80 characters or fewer."
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address."
  } else if (email.length > 120) {
    errors.email = "That email is too long."
  }

  if (password.length < 8) {
    errors.password = "Use at least 8 characters."
  } else if (password.length > 128) {
    errors.password = "Use 128 characters or fewer."
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: { name, email, password } }
}

export function normalizeSignIn(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase()
  const password = input.password
  const errors: { email?: string; password?: string } = {}
  if (!email) errors.email = "Enter your email."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address."
  }
  if (!password) errors.password = "Enter your password."
  if (Object.keys(errors).length > 0) return { ok: false as const, errors }
  return { ok: true as const, value: { email, password } }
}
