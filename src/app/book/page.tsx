import type { Metadata } from "next"
import { Suspense } from "react"
import { BookingDesk } from "@/components/booking-desk"
import { TranslatedIntro } from "@/components/translated-intro"
import { BookingSkeleton } from "@/components/skeletons"

export const metadata: Metadata = {
  title: "Book",
  description: "Choose dates and a room at Bosfor Hotels, see the stay price, pay with the demo card and confirm a booking in this browser.",
}

export default function BookPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <TranslatedIntro page="book" />
      <div className="mt-10">
        <Suspense fallback={<BookingSkeleton />}>
          <BookingDesk />
        </Suspense>
      </div>
    </div>
  )
}
