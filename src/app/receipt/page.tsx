import type { Metadata } from "next"
import { ReceiptView } from "@/components/receipt-view"

export const metadata: Metadata = {
  title: "Receipt",
  description: "Printable reservation voucher and receipt for a Bosfor Hotels demo booking.",
  robots: { index: false, follow: false },
}

export default function ReceiptPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16 print:max-w-none print:p-0">
      <ReceiptView />
    </div>
  )
}
