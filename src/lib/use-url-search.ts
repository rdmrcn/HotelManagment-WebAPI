"use client"

import { useSyncExternalStore } from "react"

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange)
  return () => window.removeEventListener("popstate", onChange)
}

/**
 * The current query string. Empty during static render so the page can ship
 * real content in its HTML (useSearchParams would force a Suspense fallback).
 */
export function useUrlSearch() {
  return useSyncExternalStore(subscribe, () => window.location.search, () => "")
}
