"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { DateRangeFields } from "@/components/date-range-fields"
import { Notice } from "@/components/notice"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatMoney, formatStayDate, nightLabel } from "@/lib/format"
import { getRoom, rooms, type Room } from "@/lib/rooms"
import { authPath, bookPath } from "@/lib/search"
import { quoteStay } from "@/lib/stay"
import type { Booking } from "@/lib/storage"
import { cn } from "cn"

export function BookingDesk({
  initialCheckIn,
  initialCheckOut,
  initialRoom,
}: {
  initialCheckIn: string
  initialCheckOut: string
  initialRoom: string
}) {
  const { status, guest, addBooking } = useAuth()
  const [checkIn, setCheckIn] = useState(initialCheckIn)
  const [checkOut, setCheckOut] = useState(initialCheckOut)
  const [roomSlug, setRoomSlug] = useState(getRoom(initialRoom)?.slug ?? "")
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<Booking | null>(null)
  const formErrorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!formError) return
    formErrorRef.current?.scrollIntoView({ block: "nearest" })
  }, [formError])

  const room = getRoom(roomSlug)
  const quote = room ? quoteStay(room.nightlyRate, checkIn, checkOut) : null
  const dateMessage =
    checkIn && checkOut ? quoteStay(room?.nightlyRate ?? 0, checkIn, checkOut) : null
  const unknownRoom = initialRoom !== "" && !getRoom(initialRoom) && !roomSlug
  const returnTo = bookPath(checkIn, checkOut, roomSlug)

  async function confirmStay() {
    setAttempted(true)
    setFormError(null)

    if (status === "loading") {
      setFormError("Still checking this browser. Confirm again in a moment.")
      return
    }
    const dated = quoteStay(room?.nightlyRate ?? 0, checkIn, checkOut)
    if (!dated.ok) {
      setFormError(dated.error)
      return
    }
    if (!room) {
      setFormError("Choose a room.")
      return
    }
    if (!guest) {
      setFormError("Create an account or sign in before confirming.")
      return
    }

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    const saved = addBooking({ roomSlug: room.slug, checkIn, checkOut })
    setSubmitting(false)
    if (!saved.ok) {
      setFormError(saved.error)
      return
    }
    setConfirmation(saved.booking)
  }

  if (confirmation) {
    const bookedRoom = getRoom(confirmation.roomSlug)
    return (
      <Confirmation
        booking={confirmation}
        room={bookedRoom}
        guestName={guest?.name ?? "Guest"}
        onAnother={() => setConfirmation(null)}
      />
    )
  }

  const showDateError =
    (attempted || (checkIn !== "" && checkOut !== "")) && dateMessage && !dateMessage.ok
      ? dateMessage.error
      : null

  return (
    <form
      method="post"
      action="#book"
      onSubmit={(event) => {
        event.preventDefault()
        void confirmStay()
      }}
      noValidate
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      <div className="grid gap-8">
        <section className="grid gap-4">
          <h2 className="text-2xl">Dates</h2>
          <DateRangeFields
            idPrefix="book"
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckIn={(value) => {
              setCheckIn(value)
              setFormError(null)
            }}
            onCheckOut={(value) => {
              setCheckOut(value)
              setFormError(null)
            }}
          />
          {showDateError ? <Notice>{showDateError}</Notice> : null}
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl">Room</h2>
          {unknownRoom ? <Notice>That room is not in the house. Choose one below.</Notice> : null}
          <div className="grid gap-3">
            {rooms.map((item) => {
              const selected = item.slug === roomSlug
              const itemQuote =
                checkIn && checkOut ? quoteStay(item.nightlyRate, checkIn, checkOut) : null
              return (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setRoomSlug(item.slug)
                    setFormError(null)
                  }}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl bg-card p-3 text-left ring-1 ring-foreground/10 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected && "ring-2 ring-primary",
                  )}
                >
                  <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={item.image} alt="" fill className="object-cover" sizes="112px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-serif text-xl">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatMoney(item.nightlyRate)} / night
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {item.size} · {item.bed}
                    </span>
                    <span className="mt-1 block text-sm">
                      {itemQuote?.ok
                        ? `${nightLabel(itemQuote.nights)} · ${formatMoney(itemQuote.total)}`
                        : "Add valid dates to see the stay price."}
                    </span>
                    {selected ? <span className="mt-1 block text-sm font-medium text-primary">Selected</span> : null}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl bg-card p-5 ring-1 ring-foreground/10 lg:sticky lg:top-24">
        <h2 className="text-2xl">Stay price</h2>
        <div className="mt-4 grid gap-2 text-sm leading-6" aria-live="polite">
          <p>{room ? room.name : "No room selected"}</p>
          <p className="text-muted-foreground">
            {checkIn && checkOut
              ? `${formatStayDate(checkIn)} to ${formatStayDate(checkOut)}`
              : "Dates not chosen yet"}
          </p>
          {quote?.ok ? (
            <>
              <p>
                {formatMoney(quote.nightlyRate)} × {nightLabel(quote.nights)}
              </p>
              <p className="text-3xl">{formatMoney(quote.total)}</p>
            </>
          ) : (
            <p className="text-muted-foreground">
              The total appears when the dates are valid and a room is selected.
            </p>
          )}
        </div>

        <div className="mt-5 border-t border-border pt-5">
          {status === "loading" ? (
            <p role="status" className="text-sm text-muted-foreground">
              Checking this browser for a saved account…
            </p>
          ) : null}
          {guest ? (
            <p className="text-sm leading-6">
              Signed in as <span className="font-medium">{guest.name}</span>
              <span className="block text-muted-foreground">{guest.email}</span>
            </p>
          ) : (
            <div className="mt-3 grid gap-3">
              <p className="text-sm leading-6">
                Create an account to hold this stay. It is saved only in this browser.
              </p>
              <Link href={authPath("/register", returnTo)} className="text-sm font-medium text-primary">
                Create an account
              </Link>
              <Link href={authPath("/sign-in", returnTo)} className="text-sm text-muted-foreground">
                Sign in
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className={cn(buttonVariants(), "mt-5 h-11 w-full rounded-full")}
          disabled={submitting}
          onClick={() => {
            void confirmStay()
          }}
        >
          {submitting ? "Saving your stay…" : "Confirm booking"}
        </button>
        {formError ? (
          <div ref={formErrorRef} className="mt-4">
            <Notice>{formError}</Notice>
          </div>
        ) : null}
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Rates are per room, per night, taxes included. Aurelia is fictional, and the reservation stays in this browser.
        </p>
      </aside>
    </form>
  )
}

function Confirmation({
  booking,
  room,
  guestName,
  onAnother,
}: {
  booking: Booking
  room: Room | undefined
  guestName: string
  onAnother: () => void
}) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-card p-6 ring-1 ring-foreground/10 md:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Confirmed</p>
      <h2 className="mt-3 text-4xl">{booking.confirmationCode}</h2>
      <p className="mt-4 text-base leading-7">
        {guestName}, your {room?.name ?? "room"} is held from {formatStayDate(booking.checkIn)} to{" "}
        {formatStayDate(booking.checkOut)}.
      </p>
      <dl className="mt-6 grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Nights</dt>
          <dd>{nightLabel(booking.nights)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Nightly rate</dt>
          <dd>{formatMoney(booking.nightlyRate)}</dd>
        </div>
        <div className="flex justify-between gap-4 text-base">
          <dt>Stay total</dt>
          <dd>{formatMoney(booking.total)}</dd>
        </div>
      </dl>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/account"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          View your booking
        </Link>
        <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={onAnother}>
          Reserve another stay
        </Button>
      </div>
    </div>
  )
}
