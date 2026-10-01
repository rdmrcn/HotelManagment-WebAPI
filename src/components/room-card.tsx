import Image from "next/image"
import Link from "next/link"
import { formatMoney } from "@/lib/format"
import type { Room } from "@/lib/rooms"

export function RoomCard({
  room,
  heading = "h2",
  coverOnly = false,
}: {
  room: Room
  heading?: "h2" | "h3"
  coverOnly?: boolean
}) {
  const Heading = heading
  const photos = coverOnly ? room.images.slice(0, 1) : room.images
  return (
    <article className="group flex flex-col">
      <Link href={`/rooms/${room.slug}`} className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <div
          className={
            photos.length > 1 ? "grid grid-cols-2 gap-1.5 overflow-hidden rounded-xl" : "contents"
          }
        >
          {photos.map((photo) => (
            <div key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes={
                  photos.length > 1
                    ? "(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                }
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <Heading className="text-2xl">{room.name}</Heading>
          <p className="shrink-0 text-sm text-muted-foreground">
            {formatMoney(room.nightlyRate)} / night
          </p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {room.size} · {room.view}
        </p>
        <p className="mt-3 text-sm leading-6 text-foreground/80">{room.summary}</p>
        <p className="mt-3 text-sm font-medium text-primary">View room</p>
      </Link>
    </article>
  )
}
