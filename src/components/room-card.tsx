import Image from "next/image"
import Link from "next/link"
import { BedDouble, Building2, Ruler, Users, Waves } from "lucide-react"
import { LeftBadge } from "@/components/left-badge"
import { SideBadge } from "@/components/side-badge"
import { buttonVariants } from "@/components/ui/button"
import { formatMoney } from "@/lib/format"
import type { Room } from "@/lib/rooms"
import { bookPath } from "@/lib/search"
import { cn } from "cn"

function highlights(room: Room) {
  return [
    { Icon: BedDouble, text: room.bed },
    { Icon: room.side === "bosphorus" ? Waves : Building2, text: room.view },
    { Icon: Users, text: `Sleeps ${room.sleeps}` },
    { Icon: Ruler, text: room.size },
  ]
}

export function RoomCard({
  room,
  heading = "h2",
  checkIn = "",
  checkOut = "",
  priority = false,
}: {
  room: Room
  heading?: "h2" | "h3"
  checkIn?: string
  checkOut?: string
  priority?: boolean
}) {
  const Heading = heading
  const href = `/rooms/${room.slug}`
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(7,20,34,0.5)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link href={href} tabIndex={-1} aria-hidden className="absolute inset-0">
          <Image
            src={room.images[0].src}
            alt=""
            fill
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <SideBadge side={room.side} className="shadow-sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <Heading className="text-2xl leading-tight">
            <Link href={href} className="outline-none after:absolute after:inset-0 hover:text-primary focus-visible:underline">
              {room.name}
            </Link>
          </Heading>
          <div className="shrink-0 text-right">
            <p className="text-xl leading-none font-medium">{formatMoney(room.nightlyRate)}</p>
            <p className="mt-1 text-xs text-muted-foreground">per night</p>
          </div>
        </div>
        <p className="mt-2 text-sm leading-6 text-foreground/80">{room.summary}</p>
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-muted-foreground">
          {highlights(room).map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{text}</span>
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-auto flex items-center justify-between gap-3 pt-5">
          <LeftBadge slug={room.slug} checkIn={checkIn} checkOut={checkOut} />
          <Link
            href={bookPath(checkIn, checkOut, room.slug)}
            className={cn(buttonVariants(), "h-10 rounded-full px-5")}
          >
            Book
          </Link>
        </div>
      </div>
    </article>
  )
}
