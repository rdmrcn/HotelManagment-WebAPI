import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { RoomCard } from "@/components/room-card"
import { rooms } from "@/lib/rooms"

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Standard Room, Queen Double Room, Queen Room, King Double Room, King Room, Deluxe Room, Suite Room, and Bosfor Suite Room at Bosfor Hotels in Bebek.",
}

export default function RoomsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <PageHeader
        eyebrow="Rooms"
        title="Eight rooms"
        lede="Standard Room, Queen Room, King Room, Queen Double Room, and King Double Room face the street and the rooftops. Deluxe Room, Suite Room, and Bosfor Suite Room face the water. Each rate is per room, per night, with taxes included."
      />
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.slug} room={room} />
        ))}
      </div>
    </div>
  )
}
