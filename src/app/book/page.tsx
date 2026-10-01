import type { Metadata } from "next"
import { Suspense } from "react"
import { BookingDesk } from "@/components/booking-desk"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Book",
  description: "Choose dates and a room at Aurelia, see the stay price, and confirm a booking in this browser.",
}

export default function BookPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <PageHeader
        eyebrow="Book"
        title="Reserve a room"
        lede="Choose your dates, then a room. The stay price updates before you confirm."
      />
      <div className="mt-10">
        <Suspense
          fallback={
            <p role="status" className="text-sm text-muted-foreground">
              Loading the booking desk…
            </p>
          }
        >
          <BookingDesk />
        </Suspense>
      </div>
    </div>
  )
}
