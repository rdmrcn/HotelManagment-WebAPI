import type { Metadata } from "next"
import { CommandDesk } from "@/components/command-desk"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Ask",
  description:
    "Ask Bosfor Hotels about the eight room prices, how a stay total is calculated, how to book, and where an account is saved.",
}

export default function AskPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 md:py-20">
      <PageHeader
        eyebrow="Ask"
        title="Questions the hotel can answer"
        lede="A short list of commands about rooms, dates, booking, and where a stay is saved. It does not leave this browser, and it does not write a reservation for you."
      />
      <div id="ask" className="mt-10">
        <CommandDesk />
      </div>
    </div>
  )
}
