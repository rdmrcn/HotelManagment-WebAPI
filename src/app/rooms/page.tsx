import type { Metadata } from "next"
import { RoomsPageView } from "@/components/rooms-page-view"

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Eight room types at Bosfor Hotels in Bebek: Bosphorus-side Deluxe, Suite and Bosfor Suite, and city-side Standard, Queen, King and double rooms. Check how many are left for your dates.",
}

export default function RoomsPage() {
  return <RoomsPageView />
}
