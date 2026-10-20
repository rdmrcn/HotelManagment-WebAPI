import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AmenityIcon } from "@/components/amenity-icon"
import { LeftBadge } from "@/components/left-badge"
import { PhotoGallery } from "@/components/photo-gallery"
import { ReservePanel } from "@/components/reserve-panel"
import { SideBadge } from "@/components/side-badge"
import { formatMoney } from "@/lib/format"
import { getRoom, rooms, sideInfo } from "@/lib/rooms"

type RoomPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }))
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params
  const room = getRoom(slug)
  if (!room) return { title: "Room" }
  return {
    title: room.name,
    description: `${room.name} at Bosfor Hotels: ${room.bed.toLowerCase()}, ${room.size}, ${room.view.toLowerCase()}, ${formatMoney(room.nightlyRate)} a night. ${room.summary}`,
    openGraph: { images: [{ url: room.images[0].src, width: 1600, height: 1200, alt: room.images[0].alt }] },
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params
  const room = getRoom(slug)
  if (!room) notFound()

  const others = rooms.filter((item) => item.slug !== room.slug)
  const side = sideInfo[room.side]

  return (
    <article>
      <PhotoGallery images={room.images} layout="pair" priorityFirst />
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-14">
        <div>
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/rooms" className="hover:text-foreground">
              Rooms
            </Link>
            <span aria-hidden> / </span>
            <span aria-current="page">{room.name}</span>
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SideBadge side={room.side} />
            <LeftBadge slug={room.slug} />
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl">{room.name}</h1>
          <p className="mt-3 text-sm tracking-[0.12em] text-muted-foreground uppercase">
            {room.size} · {room.bed} · sleeps {room.sleeps} · {room.view}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/80">{room.description}</p>

          <div className="mt-8 rounded-2xl bg-secondary/70 p-5">
            <p className="font-medium">{side.label}</p>
            <p className="mt-1 text-sm leading-6 text-foreground/80">
              {room.side === "bosphorus"
                ? "This room is on the downhill side of the house, facing the Bosphorus. "
                : "This room is on the uphill side of the house, facing the street and the rooftops. It does not look at the water. "}
              <Link href="/rooms#sides" className="font-medium text-primary underline-offset-4 hover:underline">
                Compare the two sides
              </Link>
            </p>
          </div>

          <h2 className="mt-12 text-3xl">In the room</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {room.amenities.map((amenity) => (
              <li key={amenity} className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-sm ring-1 ring-foreground/10">
                <AmenityIcon label={amenity} className="size-5 shrink-0 text-primary" />
                {amenity}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ReservePanel room={room} />
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-5 pb-20">
        <h2 className="text-3xl">Other rooms</h2>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {others.map((item) => (
            <li key={item.slug}>
              <Link href={`/rooms/${item.slug}`} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-primary">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{sideInfo[item.side].badge}</span>
                </span>
                <span className="shrink-0 text-muted-foreground">{formatMoney(item.nightlyRate)} / night</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
