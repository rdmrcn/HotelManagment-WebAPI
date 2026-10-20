"use client"

import { useSyncExternalStore } from "react"
import { todayISO } from "@/lib/stay"

const subscribeNever = () => () => {}

/** Today's date in the visitor's time zone. Empty during static render, so nothing date-dependent is baked into the HTML. */
export function useToday() {
  return useSyncExternalStore(subscribeNever, () => todayISO(), () => "")
}
