import type { Metadata } from "next"
import { ChatDesk } from "@/components/chat-desk"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Ask",
  description:
    "Talk with the Bosfor Hotels concierge about rooms, prices, dates, breakfast, and how to book. Answers stay in this browser.",
}

export default function AskPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-5 pt-10 pb-8 md:pt-14">
      <PageHeader
        eyebrow="Concierge"
        title="Ask the house"
        lede="A short conversation about the rooms, the view, dates, and how to book. It stays in this browser. It does not check availability, take payment, or write the reservation for you."
      />
      <div
        id="ask"
        className="mt-8 h-[clamp(28rem,calc(100dvh-18rem),40rem)] overflow-hidden rounded-3xl border border-border bg-card"
      >
        <ChatDesk />
      </div>
    </div>
  )
}
