"use client"

import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { RoomsBrowser } from "@/components/rooms-browser"
import { SectionHeading } from "@/components/section-heading"
import { SideBadge } from "@/components/side-badge"
import { SideDiagram } from "@/components/side-diagram"
import { formatMoney } from "@/lib/format"
import { useCopy, useLocale } from "@/lib/i18n/use-locale"
import { sideFace } from "@/lib/i18n/room-face"
import { roomsOnSide, type RoomSide } from "@/lib/rooms"

export function RoomsPageView() {
  const locale = useLocale()
  const page = useCopy().roomsPage
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <PageHeader eyebrow={page.eyebrow} title={page.title} lede={page.lede} />
      <div className="mt-8">
        <RoomsBrowser />
      </div>

      <section id="sides" className="mt-20 scroll-mt-32 border-t border-border pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading eyebrow={page.sideEyebrow} title={page.sideTitle} lede={page.sideLede} />
          <SideDiagram className="h-auto w-full rounded-3xl ring-1 ring-foreground/10" />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {(["bosphorus", "city"] as const).map((side: RoomSide) => {
            const list = roomsOnSide(side)
            const from = Math.min(...list.map((room) => room.nightlyRate))
            const info = sideFace(side, locale)
            const total = list.reduce((sum, room) => sum + room.units, 0)
            const money = formatMoney(from, locale)
            return (
              <article key={side} className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
                <SideBadge side={side} />
                <h3 className="mt-3 text-3xl">{info.label}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/80">{page.good[side]}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{page.trade[side]}</p>
                <ul className="mt-5 divide-y divide-border border-y border-border text-sm">
                  {list.map((room) => (
                    <li key={room.slug}>
                      <Link href={`/rooms/${room.slug}`} className="flex items-baseline justify-between gap-4 py-2.5 hover:text-primary">
                        <span>{room.name}</span>
                        <span className="text-muted-foreground">{formatMoney(room.nightlyRate, locale)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  {locale === "tr"
                    ? `Toplam ${total} oda, gecelik ${money} ve üzeri.`
                    : `${total} rooms in total, from ${money} a night.`}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
