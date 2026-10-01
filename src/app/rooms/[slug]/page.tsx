import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ReservePanel } from "@/components/reserve-panel"
import { formatMoney } from "@/lib/format"
import { getRoom, rooms } from "@/lib/rooms"

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
    description: room.summary,
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params
  const room = getRoom(slug)
  if (!room) notFound()

  const others = rooms.filter((item) => item.slug !== room.slug)

  return (
    <article>
      <div className="grid gap-2 md:grid-cols-2">
        {room.images.map((photo, index) => (
          <div key={photo.src} className="relative min-h-[42vh] bg-muted md:min-h-[56vh]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {room.size} · {room.bed} · {room.view}
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl">{room.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/80">{room.description}</p>
          <h2 className="mt-10 text-2xl">In the room</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {room.amenities.map((amenity) => (
              <li key={amenity} className="rounded-xl bg-card px-3 py-2 text-sm ring-1 ring-foreground/10">
                {amenity}
              </li>
            ))}
          </ul>
        </div>
        <ReservePanel room={room} />
      </div>
      <div className="mx-auto w-full max-w-6xl px-5 pb-16">
        <h2 className="text-2xl">Other rooms</h2>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {others.map((item) => (
            <li key={item.slug}>
              <Link href={`/rooms/${item.slug}`} className="flex items-baseline justify-between gap-4 py-3 text-sm hover:text-primary">
                <span>{item.name}</span>
                <span className="text-muted-foreground">{formatMoney(item.nightlyRate)} / night</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
