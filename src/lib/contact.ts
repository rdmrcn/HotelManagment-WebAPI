import type { Locale } from "@/lib/i18n/locale"

export const contact = {
  email: "stay@bosforhotels.example",
  phoneDisplay: "+90 555 000 00 00",
  phoneTel: "+905550000000",
  whatsappNumber: "905550000000",
} as const

export function whatsappGreeting(locale: Locale) {
  return locale === "tr"
    ? "Merhaba, Bosfor Hotels'te bir konaklama hakkında bilgi almak istiyorum."
    : "Hello, I would like to ask about a stay at Bosfor Hotels."
}

export function whatsappUrl(locale: Locale) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(whatsappGreeting(locale))}`
}
