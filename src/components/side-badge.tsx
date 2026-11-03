"use client"

import { Building2, Waves } from "lucide-react"
import { sideFace } from "@/lib/i18n/room-face"
import { useLocale } from "@/lib/i18n/use-locale"
import type { RoomSide } from "@/lib/rooms"
import { cn } from "cn"

export function SideBadge({ side, className }: { side: RoomSide; className?: string }) {
  const locale = useLocale()
  const Icon = side === "bosphorus" ? Waves : Building2
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium",
        side === "bosphorus" ? "bg-[#0b2238] text-white" : "bg-background/95 text-foreground ring-1 ring-foreground/15",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {sideFace(side, locale).badge}
    </span>
  )
}
