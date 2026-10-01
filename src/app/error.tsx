"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col justify-center px-5 py-20">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Something went wrong</p>
      <h1 className="mt-3 text-4xl">This page did not load</h1>
      <p className="mt-4 text-base leading-7 text-foreground/80">
        The yalı is still here. Try the page again, or return to the rooms.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button type="button" className="h-11 rounded-full px-5" onClick={() => reset()}>
          Try again
        </Button>
        <Link
          href="/rooms"
          className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium"
        >
          Browse rooms
        </Link>
      </div>
    </div>
  )
}
