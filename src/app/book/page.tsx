import type { Metadata } from "next"
import { BookingDesk } from "@/components/booking-desk"
import { PageHeader } from "@/components/page-header"
import { firstParam } from "@/lib/search"

export const metadata: Metadata = {
  title: "Book",
  description: "Choose dates and a room at Aurelia, see the stay price, and confirm a booking in this browser.",
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string | string[]; checkOut?: string | string[]; room?: string | string[] }>
}) {
  const params = await searchParams

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <PageHeader
        eyebrow="Book"
        title="Reserve a room"
        lede="Choose your dates, then a room. The stay price updates before you confirm."
      />
      <div className="mt-10">
        <BookingDesk
          initialCheckIn={firstParam(params.checkIn)}
          initialCheckOut={firstParam(params.checkOut)}
          initialRoom={firstParam(params.room)}
        />
      </div>
    </div>
  )
}
