"use client"

import { Mail, Phone } from "lucide-react"
import { contact, whatsappUrl } from "@/lib/contact"
import { useCopy } from "@/lib/i18n/use-locale"
import { useLocale } from "@/lib/i18n/use-locale"

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden fill="currentColor">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.4L1 22.2l6-1.6A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.6.9.9-3.5-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9 14 14 0 0 0 1.5.6 3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  )
}

export function ContactStrip() {
  const locale = useLocale()
  const copy = useCopy()
  return (
    <div className="border-b border-border/70 bg-secondary/70">
      <div
        className="mx-auto flex w-full max-w-6xl items-center gap-x-4 gap-y-1 overflow-x-auto px-5 py-2 text-sm whitespace-nowrap"
        aria-label={copy.contactStrip.label}
      >
        <a href={`tel:${contact.phoneTel}`} className="inline-flex items-center gap-1.5 hover:text-primary">
          <Phone className="size-3.5" aria-hidden />
          <span className="sr-only">{copy.contactStrip.phone}</span>
          {contact.phoneDisplay}
        </a>
        <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 hover:text-primary">
          <Mail className="size-3.5" aria-hidden />
          <span className="sr-only">{copy.contactStrip.email}</span>
          {contact.email}
        </a>
        <a
          href={whatsappUrl(locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#128C7E] px-3 py-1 text-xs font-medium text-white hover:bg-[#0f7569]"
        >
          <WhatsAppMark />
          {copy.contactStrip.whatsapp}
        </a>
      </div>
    </div>
  )
}
