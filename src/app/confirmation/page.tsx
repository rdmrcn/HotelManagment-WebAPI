import type { Metadata } from "next"
import { ConfirmationView } from "@/components/confirmation-view"

export const metadata: Metadata = {
  title: "Booking confirmed",
  description: "Your Bosfor Hotels demo booking, with the reference, dates, total and a link to the receipt.",
  robots: { index: false, follow: false },
}

export default function ConfirmationPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <ConfirmationView />
    </div>
  )
}
