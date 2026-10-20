"use client"

import { useMemo } from "react"
import { useAuth } from "@/components/auth-provider"
import { roomsLeft, stayAvailability, type StayAvailability } from "@/lib/availability"
import { useToday } from "@/lib/use-today"

/** Rooms left for a stay, or tonight when no dates are chosen. `ready` is false until the browser has loaded its own bookings. */
export function useRoomsLeft(slug: string, checkIn = "", checkOut = "") {
  const today = useToday()
  const { status, allBookings } = useAuth()
  return useMemo(() => {
    if (!today || status !== "ready") return { ready: false as const }
    const result = roomsLeft(slug, checkIn, checkOut, allBookings, today)
    return { ready: true as const, ...result }
  }, [today, status, allBookings, slug, checkIn, checkOut])
}

export function useStayAvailability(
  slug: string,
  checkIn: string,
  checkOut: string,
): { ready: false } | { ready: true; result: StayAvailability } {
  const today = useToday()
  const { status, allBookings } = useAuth()
  return useMemo(() => {
    if (!today || status !== "ready") return { ready: false as const }
    return {
      ready: true as const,
      result: stayAvailability(slug, checkIn, checkOut, allBookings, today),
    }
  }, [today, status, allBookings, slug, checkIn, checkOut])
}
