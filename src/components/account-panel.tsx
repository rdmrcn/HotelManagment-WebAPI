"use client"

import { CalendarDays, LogOut, Trash2, UserRound } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Notice } from "@/components/notice"
import { PageHeader } from "@/components/page-header"
import { SideBadge } from "@/components/side-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatMoney, formatStayDate, nightLabel } from "@/lib/format"
import { getRoom, roomCover } from "@/lib/rooms"
import { cn } from "cn"

export function AccountPanel() {
  const { status, guest, bookings, storageError, reload, signOut, removeBooking } = useAuth()
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (status === "loading") {
    return (
      <div role="status" className="grid gap-6">
        <div className="h-28 max-w-xl animate-pulse rounded-2xl bg-muted" />
        <div className="h-44 animate-pulse rounded-2xl bg-muted" />
        <span className="sr-only">Checking this browser for a saved account…</span>
      </div>
    )
  }

  if (storageError) {
    return (
      <div className="max-w-xl">
        <PageHeader
          eyebrow="Account"
          title="We could not read saved stays"
          lede="The booking list lives in this browser. Site data may be blocked, or an older save could not be read."
        />
        <div className="mt-6 grid gap-4">
          <Notice>{storageError}</Notice>
          <Button type="button" className="h-11 w-fit rounded-full px-5" onClick={reload}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (!guest) {
    return (
      <div className="max-w-xl">
        <PageHeader
          eyebrow="Account"
          title="Sign in to see your stays"
          lede="Reservations saved in this browser appear here after you sign in. Any email works on this demo; a new email creates the account."
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/sign-in" className={cn(buttonVariants(), "h-11 rounded-full px-5")}>
            Sign in
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-full px-5")}>
            Create an account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:flex-row sm:items-center md:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">Signed in</p>
            <h1 className="truncate text-3xl md:text-4xl">{guest.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{guest.email}</p>
          </div>
        </div>
        <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={signOut}>
          <LogOut aria-hidden /> Sign out
        </Button>
      </div>

      <div className="mt-10 flex items-end justify-between gap-4">
        <h2 className="text-3xl">Your stays</h2>
        <Link href="/book" className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-full px-4")}>
          New booking
        </Link>
      </div>
      {error ? (
        <div className="mt-4">
          <Notice>{error}</Notice>
        </div>
      ) : null}

      {bookings.length === 0 ? (
        <div className="mt-6 max-w-xl rounded-2xl border border-dashed border-border bg-card p-6">
          <CalendarDays className="size-6 text-muted-foreground" aria-hidden />
          <h3 className="mt-3 text-2xl">No stays yet</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            You have no booking on this account. Choose dates and a room, and the confirmation will show up here.
          </p>
          <Link href="/book" className={cn(buttonVariants(), "mt-5 h-11 rounded-full px-5")}>
            Reserve a room
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4">
          {bookings.map((booking) => {
            const room = getRoom(booking.roomSlug)
            return (
              <li key={booking.id} className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row">
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted sm:h-auto sm:min-h-32 sm:w-48 sm:shrink-0">
                  {room ? (
                    <Image src={roomCover(room).src} alt="" fill className="object-cover" sizes="192px" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                      {booking.confirmationCode}
                    </p>
                    {room ? <SideBadge side={room.side} className="h-6 text-[0.7rem]" /> : null}
                  </div>
                  <h3 className="mt-1 text-2xl">{room?.name ?? "Room"}</h3>
                  <p className="mt-2 text-sm leading-6">
                    {formatStayDate(booking.checkIn)} to {formatStayDate(booking.checkOut)}
                    <span className="text-muted-foreground"> · {nightLabel(booking.nights)}</span>
                  </p>
                  <p className="mt-1 text-sm">
                    {formatMoney(booking.nightlyRate)} a night · {formatMoney(booking.total)} total
                  </p>
                  <div className="mt-4">
                    {confirmingId === booking.id ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm">Cancel this stay?</span>
                        <Button
                          type="button"
                          variant="destructive"
                          className="h-9 rounded-full px-4"
                          onClick={() => {
                            const result = removeBooking(booking.id)
                            setConfirmingId(null)
                            setError(result.ok ? null : result.error)
                          }}
                        >
                          Yes, cancel it
                        </Button>
                        <Button type="button" variant="outline" className="h-9 rounded-full px-4" onClick={() => setConfirmingId(null)}>
                          Keep it
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-9 rounded-full px-3 text-muted-foreground"
                        onClick={() => setConfirmingId(booking.id)}
                      >
                        <Trash2 aria-hidden /> Cancel stay
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
