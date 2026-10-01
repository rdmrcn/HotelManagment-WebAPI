"use client"

import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Notice } from "@/components/notice"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { formatMoney, formatStayDate, nightLabel } from "@/lib/format"
import { getRoom, roomCover } from "@/lib/rooms"

export function AccountPanel() {
  const { status, guest, bookings, storageError, reload, signOut } = useAuth()

  if (status === "loading") {
    return (
      <div className="max-w-xl" role="status">
        <PageHeader
          eyebrow="Account"
          title="Checking this browser"
          lede="Looking for a guest account and any stays saved on this device."
        />
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
          title="Sign in to see your booking"
          lede="Reservations saved in this browser appear here after you register or sign in."
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium"
          >
            Create an account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeader
          eyebrow="Account"
          title={guest.name}
          lede={`${guest.email}. Stays below are saved in this browser.`}
        />
        <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={signOut}>
          Sign out
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-10 max-w-xl rounded-2xl border border-dashed border-border bg-card p-6">
          <h2 className="text-2xl">No stays yet</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            You have no booking on this account. Choose dates and a room, and the confirmation will show up here.
          </p>
          <Link
            href="/book"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Reserve a room
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4">
          {bookings.map((booking) => {
            const room = getRoom(booking.roomSlug)
            return (
              <li key={booking.id} className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row">
                <div className="relative h-36 w-full overflow-hidden rounded-xl bg-muted sm:h-auto sm:w-40 sm:shrink-0">
                  {room ? (
                    <Image src={roomCover(room).src} alt="" fill className="object-cover" sizes="160px" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {booking.confirmationCode}
                  </p>
                  <h2 className="mt-1 text-2xl">{room?.name ?? "Room"}</h2>
                  <p className="mt-2 text-sm leading-6">
                    {formatStayDate(booking.checkIn)} to {formatStayDate(booking.checkOut)}
                    <span className="text-muted-foreground"> · {nightLabel(booking.nights)}</span>
                  </p>
                  <p className="mt-2 text-sm">
                    {formatMoney(booking.nightlyRate)} a night · {formatMoney(booking.total)} total
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
