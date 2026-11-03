"use client"

import { PageHeader } from "@/components/page-header"
import { useCopy } from "@/lib/i18n/use-locale"

export function TranslatedIntro({
  page,
}: {
  page: "contact" | "book" | "ask"
}) {
  const copy = useCopy()
  const block = page === "contact" ? copy.contactPage : page === "book" ? copy.bookPage : copy.askPage
  return <PageHeader eyebrow={block.eyebrow} title={block.title} lede={block.lede} />
}
