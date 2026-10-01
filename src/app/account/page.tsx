import type { Metadata } from "next"
import { AccountPanel } from "@/components/account-panel"

export const metadata: Metadata = {
  title: "Account",
  description: "See bookings saved for your Bosfor Hotels guest account in this browser.",
}

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <AccountPanel />
    </div>
  )
}
