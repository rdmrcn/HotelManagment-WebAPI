"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useCopy } from "@/lib/i18n/use-locale"
import { cn } from "cn"

export function MobileBookBar({ href, title, detail }: { href: string; title: string; detail?: string }) {
  const copy = useCopy()
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title}</p>
          {detail ? <p className="truncate text-xs text-muted-foreground">{detail}</p> : null}
        </div>
        <Link href={href} className={cn(buttonVariants(), "h-12 shrink-0 rounded-full px-6 text-base")}>
          {copy.book}
        </Link>
      </div>
    </div>
  )
}
