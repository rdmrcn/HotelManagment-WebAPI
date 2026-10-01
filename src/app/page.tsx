import Image from "next/image"
import Link from "next/link"
import { RoomCard } from "@/components/room-card"
import { StaySearch } from "@/components/stay-search"
import { buttonVariants } from "@/components/ui/button"
import { withBasePath } from "@/lib/asset"
import { rooms } from "@/lib/rooms"
import { cn } from "cn"

export const metadata = {
  title: { absolute: "Bosfor Hotels · A house on the Bosphorus" },
  description:
    "Bosfor Hotels is a fictional house hotel on the Bosphorus in Istanbul, on the Bebek waterfront. Six rooms, terrace breakfast, and a private quay on the strait.",
}

const notes = [
  {
    title: "Arrival",
    body: "Check-in from 15:00. Check-out by 11:00. If you arrive early, bags can wait in the hall by the garden.",
  },
  {
    title: "Breakfast",
    body: "Served on the terrace until 10:30. Simit, white cheeses, honey, tomatoes, and tea in tulip glasses.",
  },
  {
    title: "The house",
    body: "Six room types on the water, no conference floor. Evenings end on the quay, when the strait goes dark.",
  },
]

export default function HomePage() {
  return (
    <>
      <section className="relative">
        <div className="relative min-h-[78vh] md:min-h-[calc(100vh-4rem)]">
          <Image
            src={withBasePath("/images/hero-bosphorus.jpg")}
            alt="Wooden waterfront yalı with cream shutters and a stone quay on the Bosphorus at dusk."
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071422]/80 via-[#071422]/35 to-[#071422]/20" />
          <div className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-end px-5 pb-28 md:min-h-[calc(100vh-4rem)] md:pb-32">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">Bebek, Istanbul</p>
            <h1 className="mt-3 max-w-3xl text-6xl text-white md:text-8xl">Bosfor Hotels</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/90">
              Six rooms on the Bosphorus. Breakfast facing the strait, walnut shutters open to the water, and a house that stays quiet in the afternoon.
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
            src={withBasePath("/images/waterside-garden.jpg")}
            alt="Stone garden path, lavender, and a linen-dressed table beside a wooden yalı on the Bosphorus."
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">The house</p>
          <h2 className="mt-3 text-4xl md:text-5xl">A wooden house on the European shore</h2>
          <p className="mt-5 text-base leading-7 text-foreground/80">
            Bosfor Hotels is a fictional house hotel on the Bosphorus in Istanbul — Bosfor for the strait, the Boğaz. The rooms look either into the garden or out across the water to the Asian hills. The quay is private; Bebek village is a short walk along Cevdet Paşa.
          </p>
          <p className="mt-4 text-base leading-7 text-foreground/80">
            There is tea on the terrace in the morning, brass lamps after dark, and six room types. That is the whole of it.
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
            <RoomCard key={room.slug} room={room} heading="h3" coverOnly />
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
              src={withBasePath("/images/breakfast-terrace.jpg")}
              alt="Turkish breakfast on a linen-dressed table beside a wooden yalı and the Bosphorus."
              fill
              className="object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-[#071422]/45" />
            <div className="relative flex min-h-[420px] flex-col justify-end p-6 md:p-12">
              <h2 className="max-w-lg text-4xl text-white md:text-5xl">Come for the strait, stay for the quiet</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-white/90">
                Choose your dates, compare the six rooms, and keep the reservation in this browser.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/book"
                  className="inline-flex h-11 w-fit items-center rounded-full bg-background px-5 text-sm font-medium text-foreground"
                >
                  Reserve a room
                </Link>
                <Link
                  href="/ask"
                  className="inline-flex h-11 w-fit items-center rounded-full border border-white/40 px-5 text-sm font-medium text-white"
                >
                  Ask about a stay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
