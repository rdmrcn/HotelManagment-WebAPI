"use client"

import { useAuth } from "@/components/auth-provider"
import type { Booking, PublicGuest } from "@/lib/storage"
import { useUrlSearch } from "@/lib/use-url-search"

export type BookingLookup =
  | { state: "loading" }
  | { state: "signed-out"; ref: string }
  | { state: "missing"; ref: string }
  | { state: "found"; ref: string; booking: Booking; guest: PublicGuest }

/** Finds the signed-in guest's booking for `?ref=BOS-XXXX`. Stays belong to the account that paid for them. */
export function useBookingRef(): BookingLookup {
  const search = useUrlSearch()
  const { status, guest, bookings } = useAuth()
  const ref = (new URLSearchParams(search).get("ref") ?? "").trim().toUpperCase()

  if (status !== "ready") return { state: "loading" }
  if (!guest) return { state: "signed-out", ref }
  const booking = ref ? bookings.find((item) => item.confirmationCode === ref) : undefined
  if (!booking) return { state: "missing", ref }
  return { state: "found", ref, booking, guest }
}
