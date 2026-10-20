import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { RoomsBrowser } from "@/components/rooms-browser"
import { SectionHeading } from "@/components/section-heading"
import { SideBadge } from "@/components/side-badge"
import { SideDiagram } from "@/components/side-diagram"
import { formatMoney } from "@/lib/format"
import { roomsOnSide, sideInfo, type RoomSide } from "@/lib/rooms"

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Eight room types at Bosfor Hotels in Bebek: Bosphorus-side Deluxe, Suite and Bosfor Suite, and city-side Standard, Queen, King and double rooms. Check how many are left for your dates.",
}

const sideCopy: Record<RoomSide, { good: string; trade: string }> = {
  bosphorus: {
    good: "Floor-to-ceiling glass, balconies or a private terrace, and the strait, the bridge and the ferries in the window. Sunsets from the bed.",
    trade: "Higher rates and fewer rooms, so these sell out first on weekends and holidays.",
  },
  city: {
    good: "Rooftops, plane trees and minarets from a tall window, on the street side of the house. Plenty of room types, from a double bed to two kings.",
    trade: "No water in the view. The street is a hillside street, so expect the occasional passing car.",
  },
}

export default function RoomsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <PageHeader
        eyebrow="Rooms"
        title="Eight rooms, two sides of the hill"
        lede="Three rooms face the Bosphorus and five face the street. Pick your dates to see how many of each are left. Not sure which side suits you? Read the short guide below."
      />
      <div className="mt-8">
        <RoomsBrowser />
      </div>

      <section id="sides" className="mt-20 scroll-mt-28 border-t border-border pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Which side?"
            title="Water or street: how the house is laid out"
            lede="Bosfor Hotels is built into a steep street above the Bebek waterfront. The downhill rooms look over the roofs of Bebek onto the Bosphorus. The uphill rooms face the street at the top of the slope. Both sides share the garden, the terrace and the breakfast."
          />
          <SideDiagram className="h-auto w-full rounded-3xl ring-1 ring-foreground/10" />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {(["bosphorus", "city"] as const).map((side) => {
            const list = roomsOnSide(side)
            const from = Math.min(...list.map((room) => room.nightlyRate))
            return (
              <article key={side} className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
                <SideBadge side={side} />
                <h3 className="mt-3 text-3xl">{sideInfo[side].label}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/80">{sideCopy[side].good}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{sideCopy[side].trade}</p>
                <ul className="mt-5 divide-y divide-border border-y border-border text-sm">
                  {list.map((room) => (
                    <li key={room.slug}>
                      <Link href={`/rooms/${room.slug}`} className="flex items-baseline justify-between gap-4 py-2.5 hover:text-primary">
                        <span>{room.name}</span>
                        <span className="text-muted-foreground">{formatMoney(room.nightlyRate)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  {list.reduce((sum, room) => sum + room.units, 0)} rooms in total, from {formatMoney(from)} a night.
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
