"use client"

import Link from "next/link"
import { AmenityIcon } from "@/components/amenity-icon"
import { LeftBadge } from "@/components/left-badge"
import { MobileBookBar } from "@/components/mobile-book-bar"
import { PhotoGallery } from "@/components/photo-gallery"
import { ReservePanel } from "@/components/reserve-panel"
import { SideBadge } from "@/components/side-badge"
import { formatMoney } from "@/lib/format"
import { useCopy, useLocale } from "@/lib/i18n/use-locale"
import { roomFace, sideFace } from "@/lib/i18n/room-face"
import { getRoom, rooms } from "@/lib/rooms"

export function RoomView({ slug }: { slug: string }) {
  const locale = useLocale()
  const copy = useCopy().roomPage
  const room = getRoom(slug)
  if (!room) return null
  const face = roomFace(room, locale)
  const side = sideFace(room.side, locale)
  const others = rooms.filter((item) => item.slug !== room.slug)
  const images = room.images.map((image, index) => ({ ...image, alt: face.alts[index] ?? image.alt }))

  return (
    <article className="pb-24 md:pb-0">
      <PhotoGallery images={images} layout="pair" priorityFirst />
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-14">
        <div>
          <nav aria-label={copy.breadcrumb} className="text-sm text-muted-foreground">
            <Link href="/rooms" className="hover:text-foreground">
              {copy.rooms}
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
            {room.size} · {face.bed} · {locale === "tr" ? `${room.sleeps} kişi` : `sleeps ${room.sleeps}`} · {face.view}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/80">{face.description}</p>

          <div className="mt-8 rounded-2xl bg-secondary/70 p-5">
            <p className="font-medium">{side.label}</p>
            <p className="mt-1 text-sm leading-6 text-foreground/80">
              {room.side === "bosphorus" ? copy.downhill : copy.uphill}{" "}
              <Link href="/rooms#sides" className="font-medium text-primary underline-offset-4 hover:underline">
                {copy.compare}
              </Link>
            </p>
          </div>

          <h2 className="mt-12 text-3xl">{copy.inRoom}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {room.amenities.map((amenity, index) => (
              <li key={amenity} className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-sm ring-1 ring-foreground/10">
                <AmenityIcon label={amenity} className="size-5 shrink-0 text-primary" />
                {face.amenities[index]}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ReservePanel room={room} />
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-5 pb-20">
        <h2 className="text-3xl">{copy.other}</h2>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {others.map((item) => (
            <li key={item.slug}>
              <Link href={`/rooms/${item.slug}`} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-primary">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{sideFace(item.side, locale).badge}</span>
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {formatMoney(item.nightlyRate, locale)} {copy.perNight}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <MobileBookBar
        href={`/book?room=${room.slug}`}
        title={room.name}
        detail={`${formatMoney(room.nightlyRate, locale)} ${copy.perNight}`}
      />
    </article>
  )
}
