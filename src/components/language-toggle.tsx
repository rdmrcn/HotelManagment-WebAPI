"use client"

import { copyFor } from "@/lib/i18n/copy"
import { setLocale, type Locale } from "@/lib/i18n/locale"
import { useLocale } from "@/lib/i18n/use-locale"
import { cn } from "cn"

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale()
  const copy = copyFor(locale)
  return (
    <div
      role="group"
      aria-label={copy.language.group}
      className={cn("inline-flex h-10 items-center rounded-full bg-secondary p-1 text-sm font-medium", className)}
    >
      {(["tr", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          data-locale-option={option}
          aria-pressed={locale === option}
          onClick={() => setLocale(option satisfies Locale)}
          className={cn(
            "h-8 rounded-full px-2.5 tracking-wide outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            locale === option ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option === "tr" ? "TR" : "EN"}
        </button>
      ))}
    </div>
  )
}
