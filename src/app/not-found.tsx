"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useCopy } from "@/lib/i18n/use-locale"
import { cn } from "cn"

export default function NotFound() {
  const copy = useCopy().notFound
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col justify-center px-5 py-20">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">404</p>
      <h1 className="mt-3 text-4xl">{copy.title}</h1>
      <p className="mt-4 text-base leading-7 text-foreground/80">{copy.body}</p>
      <Link href="/rooms" className={cn(buttonVariants(), "mt-8 h-11 w-fit rounded-full px-5")}>
        {copy.browse}
      </Link>
    </div>
  )
}
