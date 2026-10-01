"use client"

import { createContext, useContext, useMemo, useSyncExternalStore } from "react"
import {
  readAuthState,
  registerGuest,
  saveBooking,
  signInGuest,
  signOutGuest,
  type Booking,
  type PublicGuest,
} from "@/lib/storage"

type Snapshot = {
  status: "loading" | "ready"
  guest: PublicGuest | null
  bookings: Booking[]
  storageError: string | null
}

type AuthContextValue = Snapshot & {
  reload: () => void
  register: (input: { name: string; email: string; password: string }) =>
    | { ok: true }
    | { ok: false; error: string; field?: "email" | "password" }
  signIn: (input: { email: string; password: string }) =>
    | { ok: true }
    | { ok: false; error: string; field?: "email" | "password" }
  signOut: () => void
  addBooking: (input: { roomSlug: string; checkIn: string; checkOut: string }) =>
    | { ok: true; booking: Booking }
    | { ok: false; error: string }
}

const serverSnapshot: Snapshot = {
  status: "ready",
  guest: null,
  bookings: [],
  storageError: null,
}

let snapshot: Snapshot | null = null
const listeners = new Set<() => void>()

function readSnapshot(): Snapshot {
  const next = readAuthState()
  return {
    status: "ready",
    guest: next.guest,
    bookings: next.bookings,
    storageError: next.error,
  }
}

function refresh() {
  snapshot = readSnapshot()
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  snapshot ??= readSnapshot()
  return snapshot
}

function getServerSnapshot() {
  return serverSnapshot
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      reload: () => refresh(),
      register: (input) => {
        const result = registerGuest(input)
        if (!result.ok) return result
        refresh()
        return { ok: true }
      },
      signIn: (input) => {
        const result = signInGuest(input)
        if (!result.ok) return result
        refresh()
        return { ok: true }
      },
      signOut: () => {
        signOutGuest()
        refresh()
      },
      addBooking: (input) => {
        if (!state.guest) return { ok: false, error: "Sign in again before confirming this stay." }
        const result = saveBooking(state.guest.id, input)
        if (!result.ok) return result
        refresh()
        return result
      },
    }),
    [state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used within AuthProvider")
  return value
}
