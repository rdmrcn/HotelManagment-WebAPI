"use client"

import { useSyncExternalStore } from "react"
import { copyFor, type Copy } from "@/lib/i18n/copy"
import { getLocaleSnapshot, getServerLocale, subscribeLocale, type Locale } from "@/lib/i18n/locale"

export function useLocale(): Locale {
  return useSyncExternalStore(subscribeLocale, getLocaleSnapshot, getServerLocale)
}

export function useCopy(): Copy {
  return copyFor(useLocale())
}
