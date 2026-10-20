import type { Metadata } from "next"
import { Suspense } from "react"
import { BookingDesk } from "@/components/booking-desk"
import { PageHeader } from "@/components/page-header"
import { BookingSkeleton } from "@/components/skeletons"

export const metadata: Metadata = {
  title: "Book",
  description: "Choose dates and a room at Bosfor Hotels, see the stay price, pay with the demo card and confirm a booking in this browser.",
}

export default function BookPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <PageHeader
        eyebrow="Book"
        title="Reserve a room"
        lede="Choose your dates and a room, then pay with the demo card. Each room shows how many are left for your nights, and the total updates before you pay."
      />
      <div className="mt-10">
        <Suspense fallback={<BookingSkeleton />}>
          <BookingDesk />
        </Suspense>
      </div>
    </div>
  )
}
