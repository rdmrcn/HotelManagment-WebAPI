export type Locale = "en" | "tr"

export const LOCALE_KEY = "bosfor-hotels.lang"

const listeners = new Set<() => void>()

export function parseLocale(value: string | null | undefined): Locale {
  return value === "tr" ? "tr" : "en"
}

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en"
  try {
    return parseLocale(window.localStorage.getItem(LOCALE_KEY))
  } catch {
    return "en"
  }
}

export function getLocaleSnapshot(): Locale {
  return readStoredLocale()
}

export function getServerLocale(): Locale {
  return "en"
}

export function subscribeLocale(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_KEY || event.key === null) listener()
  }
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage)
  }
}

export function setLocale(next: Locale) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(LOCALE_KEY, next)
  } catch {
    // The button still switches this tab; the next visit falls back to English.
  }
  for (const listener of listeners) listener()
}
