import Image from "next/image"
import Link from "next/link"
import { RoomCard } from "@/components/room-card"
import { StaySearch } from "@/components/stay-search"
import { buttonVariants } from "@/components/ui/button"
import { withBasePath } from "@/lib/asset"
import { rooms } from "@/lib/rooms"
import { cn } from "cn"

export const metadata = {
  title: { absolute: "Aurelia · A house above the harbor" },
  description:
    "Aurelia is a fictional boutique hotel at Cala Vespera. Six rooms, terrace breakfast, and a quiet courtyard above the water.",
}

const notes = [
  {
    title: "Arrival",
    body: "Check-in from 15:00. Check-out by 11:00. If you arrive early, bags can wait in the courtyard.",
  },
  {
    title: "Breakfast",
    body: "Served on the terrace until 10:30. Bread from the ground-floor bakery, citrus, and coffee in ceramic cups.",
  },
  {
    title: "The house",
    body: "28 rooms, one harbor, no conference floor. The courtyard fountain runs through the afternoon.",
  },
]

export default function HomePage() {
  return (
    <>
      <section className="relative">
        <div className="relative min-h-[78vh] md:min-h-[calc(100vh-4rem)]">
          <Image
            src={withBasePath("/images/hero-harbor.jpg")}
            alt="Limestone hotel with shuttered windows above a small harbor at dusk."
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/80 via-[#1a1410]/35 to-[#1a1410]/20" />
          <div className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-end px-5 pb-28 md:min-h-[calc(100vh-4rem)] md:pb-32">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">Cala Vespera</p>
            <h1 className="mt-3 max-w-3xl text-6xl text-white md:text-8xl">Aurelia</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/90">
              A 28-room house above the harbor. Breakfast on the terrace, shutters open to the water, and rooms that stay quiet in the afternoon.
            </p>
          </div>
        </div>
        <div className="relative z-10 mx-auto -mt-16 w-full max-w-6xl px-5">
          <StaySearch />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={withBasePath("/images/courtyard.jpg")}
            alt="Stone courtyard with a fountain, terracotta pots, and a table set under warm light."
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">The house</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Built around a courtyard, facing the water</h2>
          <p className="mt-5 text-base leading-7 text-foreground/80">
            Aurelia sits on a low cliff at Cala Vespera, a harbor town that exists only here. The rooms look either into the courtyard or out toward the boats. Evenings end on the terrace, when the water takes the color of the stone.
          </p>
          <p className="mt-4 text-base leading-7 text-foreground/80">
            There is a bakery on the ground floor, a fountain that keeps the afternoon cool, and 28 rooms. That is the whole of it.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 md:pb-28">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Rooms</p>
            <h2 className="mt-3 text-4xl">Six ways to stay</h2>
          </div>
          <Link href="/rooms" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full px-5")}>
            All rooms
          </Link>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.slug} room={room} heading="h3" />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
          {notes.map((note) => (
            <div key={note.title}>
              <h2 className="text-2xl">{note.title}</h2>
              <p className="mt-3 text-sm leading-6 text-foreground/80">{note.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="relative min-h-[420px]">
            <Image
              src={withBasePath("/images/terrace-breakfast.jpg")}
              alt="Breakfast on a stone terrace above the sea."
              fill
              className="object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-[#1a1410]/45" />
            <div className="relative flex min-h-[420px] flex-col justify-end p-6 md:p-12">
              <h2 className="max-w-lg text-4xl text-white md:text-5xl">Come for the terrace, stay for the quiet</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-white/90">
                Choose your dates, compare the six rooms, and keep the reservation in this browser.
              </p>
              <Link
                href="/book"
                className="mt-6 inline-flex h-11 w-fit items-center rounded-full bg-background px-5 text-sm font-medium text-foreground"
              >
                Reserve a room
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
