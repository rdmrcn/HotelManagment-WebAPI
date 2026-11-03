"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { documentTitle } from "@/lib/i18n/title"
import { useLocale } from "@/lib/i18n/use-locale"

export function LocaleEffects() {
  const locale = useLocale()
  const pathname = usePathname()
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = documentTitle(pathname, locale)
  }, [locale, pathname])
  return null
}
