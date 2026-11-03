"use client"

import {
  Armchair,
  Coffee,
  ConciergeBell,
  Footprints,
  Luggage,
  ShowerHead,
  Snowflake,
  Star,
  TreePine,
  Wifi,
  type LucideIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { MapEmbed } from "@/components/map-embed"
import { MobileBookBar } from "@/components/mobile-book-bar"
import { PhotoGallery } from "@/components/photo-gallery"
import { RoomCard } from "@/components/room-card"
import { SectionHeading } from "@/components/section-heading"
import { SideBadge } from "@/components/side-badge"
import { SideDiagram } from "@/components/side-diagram"
import { StaySearch } from "@/components/stay-search"
import { buttonVariants } from "@/components/ui/button"
import { withBasePath } from "@/lib/asset"
import { formatMoney } from "@/lib/format"
import { galleryImages, house, mapLinks, nearby, reviews } from "@/lib/house"
import { amenityFace, galleryAlt, nearbyFace, reviewFace, sidePhotoAlt } from "@/lib/i18n/house-face"
import { sideFace } from "@/lib/i18n/room-face"
import { useCopy, useLocale } from "@/lib/i18n/use-locale"
import { rooms, roomsOnSide } from "@/lib/rooms"
import { cn } from "cn"

const amenityIcons: Record<string, LucideIcon> = {
  breakfast: Coffee,
  garden: TreePine,
  shower: ShowerHead,
  wifi: Wifi,
  concierge: ConciergeBell,
  luggage: Luggage,
  air: Snowflake,
  walk: Footprints,
}

const trustIcons = [Star, Coffee, Footprints, Armchair]

function fromRate(side: "bosphorus" | "city") {
  return Math.min(...roomsOnSide(side).map((room) => room.nightlyRate))
}

export function HomeView() {
  const locale = useLocale()
  const copy = useCopy()
  const home = copy.home
  const gallery = galleryImages.map((image, index) => ({ ...image, alt: galleryAlt(index, locale) }))
  const sides = [
    { side: "bosphorus" as const, image: "/images/room-deluxe-1.jpg", alt: sidePhotoAlt("bosphorus", locale, "Deluxe Room with a king bed, a sofa corner and a wall of glass onto the Bosphorus.") },
    { side: "city" as const, image: "/images/room-king-1.jpg", alt: sidePhotoAlt("city", locale, "King Room with a teal headboard and a tall window onto rooftops and a minaret.") },
  ]

  return (
    <>
      <section aria-labelledby="hero-title">
        <div className="relative isolate min-h-[34rem] md:min-h-[40rem]">
          <Image
            src={withBasePath("/images/hero-bosphorus.jpg")}
            alt={home.heroAlt}
            fill
            priority
            className="-z-10 object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071422]/85 via-[#071422]/40 to-[#071422]/25" />
          <div className="mx-auto flex min-h-[34rem] w-full max-w-6xl flex-col justify-end px-5 pt-16 pb-28 md:min-h-[40rem] md:pb-32">
            <p className="text-xs font-medium tracking-[0.18em] text-white/85 uppercase">{house.area}</p>
            <h1 id="hero-title" className="mt-3 max-w-3xl text-5xl leading-[0.98] text-white sm:text-6xl md:text-7xl">
              {home.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/90">{home.heroLede}</p>
          </div>
        </div>
        <div className="relative z-10 mx-auto -mt-20 w-full max-w-6xl px-5">
          <StaySearch />
        </div>
      </section>

      <section aria-label={home.why} className="mx-auto mt-10 w-full max-w-6xl px-5">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl border border-border bg-card/60 p-5 md:grid-cols-4">
          {home.trust.map((item, index) => {
            const Icon = trustIcons[index] ?? Star
            return (
              <li key={item.title} className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm leading-tight font-medium">{item.title}</span>
                  <span className="block text-xs leading-5 text-muted-foreground">{item.body}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="house" className="mx-auto w-full max-w-6xl scroll-mt-32 px-5 py-20 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={home.houseEyebrow} title={home.houseTitle} lede={home.houseLede} />
            <p className="mt-5 max-w-xl text-base leading-7 text-foreground/80">{home.houseBody}</p>
            <Link href="/rooms#sides" className={cn(buttonVariants({ variant: "outline" }), "mt-6 h-11 rounded-full px-5")}>
              {home.whichSide}
            </Link>
          </div>
          <SideDiagram className="h-auto w-full rounded-3xl ring-1 ring-foreground/10" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sides.map(({ side, image, alt }) => {
            const info = sideFace(side, locale)
            const rate = formatMoney(fromRate(side), locale)
            return (
              <article key={side} className="group overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
                <div className="relative aspect-[16/10] bg-muted">
                  <Image
                    src={withBasePath(image)}
                    alt={alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <SideBadge side={side} />
                  <h3 className="mt-3 text-3xl">{info.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/80">{info.blurb}</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {roomsOnSide(side)
                      .map((room) => room.name.replace(" Room", ""))
                      .join(" · ")}{" "}
                    · {locale === "tr" ? `gecelik ${rate} ve üzeri` : `from ${rate} a night`}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section id="rooms" className="scroll-mt-32 border-y border-border bg-secondary/50 py-20 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading eyebrow={home.roomsEyebrow} title={home.roomsTitle} lede={home.roomsLede} />
            <Link href="/rooms" className={cn(buttonVariants({ variant: "outline" }), "h-11 w-fit rounded-full px-5")}>
              {home.compare}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.slug} room={room} heading="h3" />
            ))}
            <Link
              href="/rooms"
              className="hidden min-h-48 flex-col justify-center gap-3 rounded-2xl border border-dashed border-foreground/25 p-8 text-left outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 lg:flex"
            >
              <span className="font-serif text-3xl">{home.notSure}</span>
              <span className="text-sm leading-6 text-foreground/80">{home.notSureBody}</span>
              <span className="text-sm font-medium text-primary">{home.compareLink}</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="amenities" className="mx-auto w-full max-w-6xl scroll-mt-32 px-5 py-20 md:py-28">
        <SectionHeading eyebrow={home.knowEyebrow} title={home.knowTitle} />
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {["breakfast", "garden", "shower", "wifi", "concierge", "luggage", "air", "walk"].map((icon) => {
            const item = amenityFace(icon, locale)
            const Icon = amenityIcons[icon] ?? Coffee
            return (
              <li key={icon}>
                <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/75">{item.body}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="gallery" className="scroll-mt-32 bg-[#0b2238] py-20 text-white md:py-24">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.18em] text-white/65 uppercase">{home.galleryEyebrow}</p>
            <h2 className="mt-3 text-4xl leading-[1.05] md:text-5xl">{home.galleryTitle}</h2>
            <p className="mt-4 text-base leading-7 text-white/80">{home.galleryLede}</p>
          </div>
          <PhotoGallery images={gallery} layout="grid" className="mt-10" />
        </div>
      </section>

      <section id="reviews" className="mx-auto w-full max-w-6xl scroll-mt-32 px-5 py-20 md:py-28">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <SectionHeading eyebrow={home.guestsEyebrow} title={home.guestsTitle} />
          <p className="text-sm text-muted-foreground">{home.sampleReviews}</p>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => {
            const item = reviewFace(index, locale)
            return (
              <li key={review.name} className="flex flex-col rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
                <p className="flex gap-0.5 text-primary" role="img" aria-label={home.stars}>
                  {Array.from({ length: 5 }, (_, star) => (
                    <Star key={star} className="size-4 fill-current" aria-hidden />
                  ))}
                </p>
                <blockquote className="mt-4 flex-1 text-base leading-7">“{item.text}”</blockquote>
                <p className="mt-5 text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {item.from} · {item.stay}
                  </span>
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="location" className="scroll-mt-32 border-t border-border bg-secondary/50 py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={home.locationEyebrow} title={home.locationTitle} lede={home.locationLede} />
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {nearby.map((item, index) => {
                const place = nearbyFace(index, locale)
                return (
                  <li key={item.place} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                    <span>{place.place}</span>
                    <span className="shrink-0 text-muted-foreground">{place.time}</span>
                  </li>
                )
              })}
            </ul>
            <a
              href={mapLinks.open}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "mt-6 h-11 rounded-full px-5")}
            >
              {home.openMap}
            </a>
          </div>
          <MapEmbed />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="relative isolate overflow-hidden rounded-3xl">
          <div className="relative flex min-h-[26rem] flex-col justify-end p-6 md:p-12">
            <Image
              src={withBasePath("/images/breakfast-terrace.jpg")}
              alt={home.breakfastAlt}
              fill
              className="-z-10 object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div className="absolute inset-0 -z-10 bg-[#071422]/55" />
            <h2 className="max-w-lg text-4xl text-white md:text-5xl">{home.closingTitle}</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-white/90">{home.closingBody}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="inline-flex h-12 w-fit items-center rounded-full bg-background px-6 text-sm font-medium text-foreground">
                {home.reserve}
              </Link>
              <Link href="/ask" className="inline-flex h-12 w-fit items-center rounded-full border border-white/50 px-6 text-sm font-medium text-white">
                {home.ask}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <MobileBookBar
        href="/book"
        title={home.bookBarTitle}
        detail={`${locale === "tr" ? "Gecelik" : "From"} ${formatMoney(Math.min(...rooms.map((room) => room.nightlyRate)), locale)}`}
      />
    </>
  )
}
