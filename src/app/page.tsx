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
import { PhotoGallery } from "@/components/photo-gallery"
import { RoomCard } from "@/components/room-card"
import { SectionHeading } from "@/components/section-heading"
import { SideBadge } from "@/components/side-badge"
import { SideDiagram } from "@/components/side-diagram"
import { StaySearch } from "@/components/stay-search"
import { buttonVariants } from "@/components/ui/button"
import { withBasePath } from "@/lib/asset"
import { formatMoney } from "@/lib/format"
import { amenities, galleryImages, house, mapLinks, nearby, reviews } from "@/lib/house"
import { rooms, roomsOnSide, sideInfo } from "@/lib/rooms"
import { cn } from "cn"

export const metadata = {
  title: { absolute: "Bosfor Hotels · A hillside house above the Bosphorus" },
  description:
    "Bosfor Hotels is a fictional house hotel on a hillside street in Bebek, Istanbul. Bosphorus-side and city-side rooms, terrace breakfast, and live room availability for the next 60 days.",
}

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

const trust = [
  { icon: Star, title: "4.8 out of 5", body: "Sample guest rating" },
  { icon: Coffee, title: "Terrace breakfast", body: "Served until 10:30" },
  { icon: Footprints, title: "4 minutes", body: "Downhill to the waterfront" },
  { icon: Armchair, title: "No payment", body: "Book now, nothing is charged" },
]

function fromRate(side: "bosphorus" | "city") {
  return Math.min(...roomsOnSide(side).map((room) => room.nightlyRate))
}

export default function HomePage() {
  const sides = [
    { side: "bosphorus" as const, image: "/images/room-deluxe-1.jpg", alt: "Deluxe Room with a king bed, a sofa corner and a wall of glass onto the Bosphorus." },
    { side: "city" as const, image: "/images/room-king-1.jpg", alt: "King Room with a teal headboard and a tall window onto rooftops and a minaret." },
  ]

  return (
    <>
      <section aria-labelledby="hero-title">
        <div className="relative isolate min-h-[34rem] md:min-h-[40rem]">
          <Image
            src={withBasePath("/images/hero-bosphorus.jpg")}
            alt="Terraced stone house on a hillside with sun loungers and olive trees, the Bosphorus, a bridge and a ferry below at golden hour."
            fill
            priority
            className="-z-10 object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071422]/85 via-[#071422]/40 to-[#071422]/25" />
          <div className="mx-auto flex min-h-[34rem] w-full max-w-6xl flex-col justify-end px-5 pt-16 pb-28 md:min-h-[40rem] md:pb-32">
            <p className="text-xs font-medium tracking-[0.18em] text-white/85 uppercase">{house.area}</p>
            <h1 id="hero-title" className="mt-3 max-w-3xl text-5xl leading-[0.98] text-white sm:text-6xl md:text-7xl">
              A hillside house above the Bosphorus
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/90">
              Eight room types on a steep street in Bebek. Five face the street, three look straight down onto the
              strait.
            </p>
          </div>
        </div>
        <div className="relative z-10 mx-auto -mt-20 w-full max-w-6xl px-5">
          <StaySearch />
        </div>
      </section>

      <section aria-label="Why guests choose us" className="mx-auto mt-10 w-full max-w-6xl px-5">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl border border-border bg-card/60 p-5 md:grid-cols-4">
          {trust.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm leading-tight font-medium">{title}</span>
                <span className="block text-xs leading-5 text-muted-foreground">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="house" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="The house"
              title="One hillside, two sides"
              lede="Bosfor Hotels climbs a steep street above the Bebek waterfront, in the Beşiktaş district. The slope splits the house in two."
            />
            <p className="mt-5 max-w-xl text-base leading-7 text-foreground/80">
              Downhill, three rooms open onto the strait: Deluxe, Suite, and the Bosfor Suite. Uphill, five rooms face
              the street, with rooftops, plane trees, and minarets in the window. The waterside rooms cost more because
              they look at the water. The street-side rooms are the quiet bargain.
            </p>
            <Link href="/rooms#sides" className={cn(buttonVariants({ variant: "outline" }), "mt-6 h-11 rounded-full px-5")}>
              Which side is for you?
            </Link>
          </div>
          <SideDiagram className="h-auto w-full rounded-3xl ring-1 ring-foreground/10" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sides.map(({ side, image, alt }) => (
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
                <h3 className="mt-3 text-3xl">{sideInfo[side].label}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/80">{sideInfo[side].blurb}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {roomsOnSide(side)
                    .map((room) => room.name.replace(" Room", ""))
                    .join(" · ")}{" "}
                  · from {formatMoney(fromRate(side))} a night
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="rooms" className="scroll-mt-24 border-y border-border bg-secondary/50 py-20 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading eyebrow="Rooms" title="Eight ways to stay" lede="Prices are per room, per night, taxes included. Rooms left are for tonight; choose dates to see your stay." />
            <Link href="/rooms" className={cn(buttonVariants({ variant: "outline" }), "h-11 w-fit rounded-full px-5")}>
              Compare rooms and dates
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
              <span className="font-serif text-3xl">Not sure which?</span>
              <span className="text-sm leading-6 text-foreground/80">
                Compare all eight by price, size and side of the house, and see what is free on your dates.
              </span>
              <span className="text-sm font-medium text-primary">Compare rooms and dates →</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="amenities" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 md:py-28">
        <SectionHeading eyebrow="Good to know" title="Small things, done properly" />
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.map((item) => {
            const Icon = amenityIcons[item.icon] ?? Coffee
            return (
              <li key={item.title}>
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

      <section id="gallery" className="scroll-mt-24 bg-[#0b2238] py-20 text-white md:py-24">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.18em] text-white/65 uppercase">Gallery</p>
            <h2 className="mt-3 text-4xl leading-[1.05] md:text-5xl">Light on the water, linen on the beds</h2>
            <p className="mt-4 text-base leading-7 text-white/80">Tap any photo to see it larger. Use the arrow keys to move between them.</p>
          </div>
          <PhotoGallery images={galleryImages} layout="grid" className="mt-10" />
        </div>
      </section>

      <section id="reviews" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 md:py-28">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <SectionHeading eyebrow="Guests" title="What guests say" />
          <p className="text-sm text-muted-foreground">Sample reviews written for this demo.</p>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.name} className="flex flex-col rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
              <p className="flex gap-0.5 text-primary" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className="size-4 fill-current" aria-hidden />
                ))}
              </p>
              <blockquote className="mt-4 flex-1 text-base leading-7">“{review.text}”</blockquote>
              <p className="mt-5 text-sm">
                <span className="font-medium">{review.name}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {review.from} · {review.stay}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="location" className="scroll-mt-24 border-t border-border bg-secondary/50 py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Location"
              title="Halfway up the hill in Bebek"
              lede="We sit on a hillside street in Bebek, part of Beşiktaş on the European shore. The waterfront cafés are downhill; Etiler and its shops are uphill."
            />
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {nearby.map((item) => (
                <li key={item.place} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                  <span>{item.place}</span>
                  <span className="shrink-0 text-muted-foreground">{item.time}</span>
                </li>
              ))}
            </ul>
            <a
              href={mapLinks.open}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "mt-6 h-11 rounded-full px-5")}
            >
              Open in OpenStreetMap
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
              alt="Turkish breakfast with simit, cheeses and tea on a linen-covered terrace table above the Bosphorus."
              fill
              className="-z-10 object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div className="absolute inset-0 -z-10 bg-[#071422]/55" />
            <h2 className="max-w-lg text-4xl text-white md:text-5xl">Come for the strait, stay for the quiet</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-white/90">
              Pick your dates, see how many rooms are left, and keep the reservation in this browser.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 w-fit items-center rounded-full bg-background px-6 text-sm font-medium text-foreground"
              >
                Reserve a room
              </Link>
              <Link
                href="/ask"
                className="inline-flex h-12 w-fit items-center rounded-full border border-white/50 px-6 text-sm font-medium text-white"
              >
                Ask the concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
