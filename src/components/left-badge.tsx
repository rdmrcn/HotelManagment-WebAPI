"use client"

import { Flame } from "lucide-react"
import { leftLabel, leftTone } from "@/lib/availability"
import { useRoomsLeft } from "@/lib/use-availability"
import { cn } from "cn"

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
      <span>{leftLabel(state.left)}</span>
      {showScope && state.left > 0 ? (
        <span className="font-normal opacity-75">{state.scope === "stay" ? "for your dates" : "tonight"}</span>
      ) : null}
    </span>
  )
}
