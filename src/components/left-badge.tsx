"use client"

import { Flame } from "lucide-react"
import { leftLabel, leftTone } from "@/lib/availability"
import { useLocale } from "@/lib/i18n/use-locale"
import { useRoomsLeft } from "@/lib/use-availability"
import { cn } from "cn"

function roomsLeftText(left: number, locale: "en" | "tr") {
  if (locale === "en") return leftLabel(left)
  if (left <= 0) return "Dolu"
  if (left === 1) return "Son 1 oda"
  if (left === 2) return "Son 2 oda"
  return `${left} oda kaldı`
}

const tones = {
  plenty: "bg-emerald-50 text-emerald-900 ring-emerald-900/15",
  few: "bg-amber-50 text-amber-900 ring-amber-900/20",
  last: "bg-red-50 text-red-900 ring-red-900/20",
  none: "bg-muted text-muted-foreground ring-foreground/10",
}

/** "N rooms left" for a stay, or tonight when no dates are set. Reserves its height so the card never jumps. */
export function LeftBadge({
  slug,
  checkIn = "",
  checkOut = "",
  className,
  showScope = true,
}: {
  slug: string
  checkIn?: string
  checkOut?: string
  className?: string
  showScope?: boolean
}) {
  const locale = useLocale()
  const state = useRoomsLeft(slug, checkIn, checkOut)

  if (!state.ready) {
    return <span aria-hidden className={cn("inline-block h-7 w-28 animate-pulse rounded-full bg-muted", className)} />
  }
  const tone = leftTone(state.left)
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium ring-1",
        tones[tone],
        className,
      )}
    >
      {tone === "last" ? <Flame className="size-3.5" aria-hidden /> : null}
      <span>{roomsLeftText(state.left, locale)}</span>
      {showScope && state.left > 0 ? (
        <span className="font-normal opacity-75">
          {state.scope === "stay"
            ? locale === "tr"
              ? "tarihleriniz için"
              : "for your dates"
            : locale === "tr"
              ? "bu gece"
              : "tonight"}
        </span>
      ) : null}
    </span>
  )
}
