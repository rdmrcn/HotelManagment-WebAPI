import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { TranslatedIntro } from "@/components/translated-intro"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to Bosfor Hotels. The address stay@bosforhotels.example and the phone +90 555 000 00 00 are fictional. Messages stay in your browser.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 pb-28 md:py-16">
      <TranslatedIntro page="contact" />
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  )
}
