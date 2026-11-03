import { copyFor } from "@/lib/i18n/copy"
import type { Locale } from "@/lib/i18n/locale"
import { getRoom } from "@/lib/rooms"

export function documentTitle(pathname: string, locale: Locale) {
  const clean = pathname.replace(/\/+$/, "") || "/"
  const copy = copyFor(locale)
  if (clean === "/") return copy.meta.homeTitle
  let name: string = copy.meta.notFound
  if (clean === "/rooms") name = copy.meta.rooms
  else if (clean === "/book") name = copy.meta.book
  else if (clean === "/ask") name = copy.meta.ask
  else if (clean === "/contact") name = copy.meta.contact
  else if (clean === "/sign-in") name = copy.meta.signIn
  else if (clean === "/register") name = copy.meta.register
  else if (clean === "/account") name = copy.meta.account
  else if (clean === "/confirmation") name = copy.meta.confirmation
  else if (clean === "/receipt") name = copy.meta.receipt
  else if (clean.startsWith("/rooms/")) {
    name = getRoom(clean.slice("/rooms/".length))?.name ?? copy.meta.room
  }
  return `${name} · Bosfor Hotels`
}
