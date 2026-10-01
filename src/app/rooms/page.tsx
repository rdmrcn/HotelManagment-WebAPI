import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { RoomCard } from "@/components/room-card"
import { rooms } from "@/lib/rooms"

export const metadata: Metadata = {
  title: "Rooms",
  description: "Standard, Queen, King, Deluxe, Suite, and Bosfor Suite at Bosfor Hotels on the Bebek waterfront in Istanbul.",
}

export default function RoomsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <PageHeader
        eyebrow="Rooms"
        title="Six rooms on the strait"
        lede="From a garden double to the water-floor terrace. Each rate is per room, per night, with taxes included."
      />
      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.slug} room={room} />
        ))}
      </div>
    </div>
  )
}
