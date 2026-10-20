"use client"

import { createContext, useContext, useMemo, useSyncExternalStore } from "react"
import type { CardInput } from "@/lib/payment"
import {
  authenticateGuest,
  cancelBooking,
  payAndBook,
  readAuthState,
  signOutGuest,
  storageKeys,
  type ActionFailure,
  type Booking,
  type CheckoutFailure,
  type PublicGuest,
} from "@/lib/storage"

type Snapshot = {
  status: "loading" | "ready"
  guest: PublicGuest | null
  bookings: Booking[]
  /** Every stay saved in this browser. These take rooms out of the calendar. */
  allBookings: Booking[]
  storageError: string | null
}

type AuthResult = { ok: true; created: boolean; guest: PublicGuest } | ActionFailure

type AuthContextValue = Snapshot & {
  reload: () => void
  signIn: (input: { email: string; password: string; name?: string }) => Promise<AuthResult>
  register: (input: { email: string; password: string; name?: string }) => Promise<AuthResult>
  signOut: () => void
  payForBooking: (input: {
    roomSlug: string
    checkIn: string
    checkOut: string
    guests: number
    card: CardInput
  }) => Promise<{ ok: true; booking: Booking } | CheckoutFailure>
  removeBooking: (bookingId: string) => { ok: true } | ActionFailure
}

const serverSnapshot: Snapshot = {
  status: "loading",
  guest: null,
  bookings: [],
  allBookings: [],
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
    allBookings: next.allBookings,
    storageError: next.error,
  }
}

function refresh() {
  snapshot = readSnapshot()
  listeners.forEach((listener) => listener())
}

function onStorage(event: StorageEvent) {
  const keys: string[] = Object.values(storageKeys)
  if (event.key === null || keys.includes(event.key)) refresh()
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener("storage", onStorage)
  }
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

  const value = useMemo<AuthContextValue>(() => {
    async function enter(
      intent: "sign-in" | "register",
      input: { email: string; password: string; name?: string },
    ): Promise<AuthResult> {
      const result = await authenticateGuest({ ...input, intent })
      if (result.ok) refresh()
      return result
    }
    return {
      ...state,
      reload: () => refresh(),
      signIn: (input) => enter("sign-in", input),
      register: (input) => enter("register", input),
      signOut: () => {
        signOutGuest()
        refresh()
      },
      payForBooking: async (input) => {
        if (!state.guest) {
          return { ok: false, code: "unavailable", error: "Sign in again before paying for this stay." }
        }
        const result = await payAndBook(state.guest.id, input)
        refresh()
        return result
      },
      removeBooking: (bookingId) => {
        if (!state.guest) return { ok: false, error: "Sign in again to manage this stay." }
        const result = cancelBooking(state.guest.id, bookingId)
        refresh()
        return result
      },
    }
  }, [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used within AuthProvider")
  return value
}
