import type { Metadata } from "next"
import { ChatDesk } from "@/components/chat-desk"
import { TranslatedIntro } from "@/components/translated-intro"

export const metadata: Metadata = {
  title: "Ask",
  description:
    "Talk with the Bosfor Hotels concierge about rooms, prices, dates, breakfast, and how to book. Answers stay in this browser.",
}

export default function AskPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-5 pt-10 pb-8 md:pt-14">
      <TranslatedIntro page="ask" />
      <div
        id="ask"
        className="mt-8 h-[clamp(28rem,calc(100dvh-18rem),40rem)] overflow-hidden rounded-3xl border border-border bg-card"
      >
        <ChatDesk />
      </div>
    </div>
  )
}
