"use client"

import { CalendarClock, CheckCircle2, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { DateRangePicker } from "@/components/date-range-picker"
import { LeftBadge } from "@/components/left-badge"
import { Notice } from "@/components/notice"
import { SideBadge } from "@/components/side-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { nextAvailableStay, stayAvailability } from "@/lib/availability"
import { formatMoney, formatStayDate, nightLabel } from "@/lib/format"
import { getRoom, roomCover, rooms, type Room } from "@/lib/rooms"
import { authPath, bookPath } from "@/lib/search"
import { nightsBetween, quoteStay } from "@/lib/stay"
import type { Booking } from "@/lib/storage"
import { useToday } from "@/lib/use-today"
import { cn } from "cn"

export function BookingDesk() {
  const searchParams = useSearchParams()
  return <BookingForm key={searchParams.toString()} />
}

function BookingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRoom = searchParams.get("room") ?? ""
  const today = useToday()
  const { status, guest, allBookings, addBooking } = useAuth()
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "")
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "")
  const [roomSlug, setRoomSlug] = useState(getRoom(initialRoom)?.slug ?? "")
  const [hideSoldOut, setHideSoldOut] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<Booking | null>(null)
  const formErrorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formError) formErrorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [formError])

  const ready = today !== "" && status === "ready"
  const room = getRoom(roomSlug)
  const hasDates = checkIn !== "" && checkOut !== ""
  const dateQuote = quoteStay(room?.nightlyRate ?? 0, checkIn, checkOut, today || undefined)
  const dateError = ready && hasDates && !dateQuote.ok ? dateQuote.error : null
  const datesValid = ready && hasDates && dateQuote.ok
  const unknownRoom = initialRoom !== "" && !getRoom(initialRoom)
  const returnTo = bookPath(checkIn, checkOut, roomSlug)

  const perRoom = rooms.map((item) => ({
    room: item,
    result: datesValid ? stayAvailability(item.slug, checkIn, checkOut, allBookings, today) : null,
  }))

  const outOfWindow = perRoom.some(({ result }) => result && !result.ok && result.reason === "out-of-window")
  const windowText = perRoom.find(({ result }) => result && !result.ok && result.reason === "out-of-window")?.result
  const selected = perRoom.find((item) => item.room.slug === roomSlug)
  const selectedBlocked = selected?.result && !selected.result.ok ? selected.result : null
  const quote = room ? quoteStay(room.nightlyRate, checkIn, checkOut, today || undefined) : null
  const nights = quote?.ok ? quote.nights : 0
  const suggestion =
    selectedBlocked && selectedBlocked.reason === "sold-out" && room && today
      ? nextAvailableStay(room.slug, nightsBetween(checkIn, checkOut) ?? 1, allBookings, checkIn, today)
      : null

  const shownRooms = perRoom.filter(
    ({ room: item, result }) => !(hideSoldOut && result && !result.ok && result.reason === "sold-out" && item.slug !== roomSlug),
  )
  const allSoldOut = datesValid && !outOfWindow && perRoom.every(({ result }) => result && !result.ok)

  async function confirmStay() {
    if (submitting) return
    setFormError(null)

    if (!ready) {
      setFormError("Still checking this browser. Confirm again in a moment.")
      return
    }
    if (!dateQuote.ok) {
      setFormError(dateQuote.error)
      return
    }
    if (!room) {
      setFormError("Choose a room.")
      return
    }
    if (selectedBlocked) {
      setFormError(selectedBlocked.message)
      return
    }
    if (!guest) {
      router.push(authPath("/sign-in", returnTo))
      return
    }

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 350))
    const saved = addBooking({ roomSlug: room.slug, checkIn, checkOut })
    setSubmitting(false)
    if (!saved.ok) {
      setFormError(saved.error)
      return
    }
    setConfirmation(saved.booking)
  }

  if (confirmation) {
    return (
      <Confirmation
        booking={confirmation}
        room={getRoom(confirmation.roomSlug)}
        guestName={guest?.name ?? "Guest"}
        onAnother={() => {
          setConfirmation(null)
          setCheckIn("")
          setCheckOut("")
          setRoomSlug("")
        }}
      />
    )
  }

  const confirmLabel = submitting
    ? "Saving your stay…"
    : guest || !ready
      ? "Confirm booking"
      : "Sign in to confirm"

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void confirmStay()
      }}
      className="grid gap-10 pb-28 lg:grid-cols-[minmax(0,1fr)_360px] lg:pb-0"
    >
      <div className="grid gap-10">
        <section aria-labelledby="dates-heading" className="grid gap-4">
          <h2 id="dates-heading" className="text-2xl">
            <span className="mr-2 text-primary">1.</span>Dates
          </h2>
          <DateRangePicker
            idPrefix="book"
            checkIn={checkIn}
            checkOut={checkOut}
            roomSlug={roomSlug || null}
            className="max-w-xl"
            onChange={(ci, co) => {
              setCheckIn(ci)
              setCheckOut(co)
              setFormError(null)
            }}
          />
          <div aria-live="polite" className="grid gap-2">
            {dateError ? <Notice>{dateError}</Notice> : null}
            {outOfWindow && windowText && !windowText.ok ? <Notice tone="info">{windowText.message}</Notice> : null}
            {allSoldOut ? (
              <Notice>Every room type is sold out for at least one night in this stay. Try nearby dates.</Notice>
            ) : null}
          </div>
        </section>

        <section aria-labelledby="room-heading" className="grid gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="room-heading" className="text-2xl">
              <span className="mr-2 text-primary">2.</span>Room
            </h2>
            <label className={cn("flex items-center gap-2 text-sm", !datesValid && "opacity-50")}>
              <input
                type="checkbox"
                checked={hideSoldOut}
                disabled={!datesValid}
                onChange={(event) => setHideSoldOut(event.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Hide sold-out rooms
            </label>
          </div>
          {unknownRoom ? <Notice>That room is not at the hotel. Choose one below.</Notice> : null}
          {!hasDates ? (
            <p className="text-sm text-muted-foreground">
              Add your dates to see exactly how many of each room are left. Until then, counts are for tonight.
            </p>
          ) : null}
          <ul className="grid gap-3">
            {shownRooms.map(({ room: item, result }) => (
              <li key={item.slug}>
                <RoomOption
                  room={item}
                  selected={item.slug === roomSlug}
                  soldOut={Boolean(result && !result.ok && result.reason === "sold-out")}
                  checkIn={datesValid && !outOfWindow ? checkIn : ""}
                  checkOut={datesValid && !outOfWindow ? checkOut : ""}
                  onSelect={() => {
                    setRoomSlug(item.slug)
                    setFormError(null)
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="h-fit rounded-2xl bg-card p-5 ring-1 ring-foreground/10 lg:sticky lg:top-28" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="text-2xl">
          Your stay
        </h2>
        {room ? (
          <div className="mt-4 flex gap-3">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image src={roomCover(room).src} alt="" fill className="object-cover" sizes="96px" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-xl leading-tight">{room.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {room.bed} · {room.view}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No room selected yet.</p>
        )}
        <dl className="mt-4 grid gap-2 text-sm leading-6" aria-live="polite">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Check-in</dt>
            <dd>{checkIn ? formatStayDate(checkIn) : "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Check-out</dt>
            <dd>{checkOut ? formatStayDate(checkOut) : "—"}</dd>
          </div>
          {quote?.ok && !selectedBlocked ? (
            <>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  {formatMoney(quote.nightlyRate)} × {nightLabel(quote.nights)}
                </dt>
                <dd>{formatMoney(quote.total)}</dd>
              </div>
              <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border pt-3">
                <dt>Total, taxes included</dt>
                <dd className="text-3xl">{formatMoney(quote.total)}</dd>
              </div>
            </>
          ) : null}
        </dl>
        {!quote?.ok && !selectedBlocked ? (
          <p className="mt-3 text-sm text-muted-foreground">The total appears once the dates are valid and a room is chosen.</p>
        ) : null}
        {selected && datesValid && !selectedBlocked ? (
          <div className="mt-3">
            <LeftBadge slug={selected.room.slug} checkIn={checkIn} checkOut={checkOut} />
          </div>
        ) : null}
        {selectedBlocked && selectedBlocked.reason === "sold-out" ? (
          <div className="mt-3 grid gap-2">
            <Notice>{selectedBlocked.message}</Notice>
            {suggestion ? (
              <button
                type="button"
                onClick={() => {
                  setCheckIn(suggestion.checkIn)
                  setCheckOut(suggestion.checkOut)
                }}
                className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-left text-sm outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <CalendarClock className="size-4 shrink-0" aria-hidden />
                <span>
                  Next free for {nightLabel(nights || nightsBetween(checkIn, checkOut) || 1)}:{" "}
                  {formatStayDate(suggestion.checkIn)} to {formatStayDate(suggestion.checkOut)}
                </span>
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 border-t border-border pt-5">
          {!ready ? (
            <div className="h-10 animate-pulse rounded-lg bg-muted" role="status">
              <span className="sr-only">Checking this browser for a saved account…</span>
            </div>
          ) : guest ? (
            <p className="text-sm leading-6">
              Signed in as <span className="font-medium">{guest.name}</span>
              <span className="block text-muted-foreground">{guest.email}</span>
            </p>
          ) : (
            <p className="text-sm leading-6">
              You will sign in on the next step, with any email and a password of 6 characters or more.{" "}
              <Link href={authPath("/register", returnTo)} className="font-medium text-primary underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          )}
        </div>

        <button
          type="submit"
          className={cn(buttonVariants(), "mt-5 hidden h-12 w-full rounded-full text-base lg:inline-flex")}
          disabled={submitting || Boolean(selectedBlocked)}
        >
          {guest || !ready ? null : <Lock className="mr-1.5 size-4" aria-hidden />}
          {confirmLabel}
        </button>
        {formError ? (
          <div ref={formErrorRef} className="mt-4">
            <Notice>{formError}</Notice>
          </div>
        ) : null}
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          No payment is taken. Bosfor Hotels is fictional, and the reservation stays in this browser.
        </p>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">
              {room ? room.name : "Choose a room"}
              {quote?.ok ? ` · ${nightLabel(quote.nights)}` : ""}
            </p>
            <p className="text-2xl leading-tight">{quote?.ok && !selectedBlocked ? formatMoney(quote.total) : "—"}</p>
          </div>
          <button
            type="submit"
            className={cn(buttonVariants(), "h-12 shrink-0 rounded-full px-6 text-base")}
            disabled={submitting || Boolean(selectedBlocked)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </form>
  )
}

function RoomOption({
  room,
  selected,
  soldOut,
  checkIn,
  checkOut,
  onSelect,
}: {
  room: Room
  selected: boolean
  soldOut: boolean
  checkIn: string
  checkOut: string
  onSelect: () => void
}) {
  const quote = checkIn && checkOut ? quoteStay(room.nightlyRate, checkIn, checkOut) : null
  const price = (
    <>
      <span className="block text-xl leading-none">{formatMoney(room.nightlyRate)}</span>
      <span className="text-xs text-muted-foreground">per night</span>
    </>
  )
  const total = quote?.ok ? (
    <span className="block text-xs text-muted-foreground">
      {nightLabel(quote.nights)} · {formatMoney(quote.total)}
    </span>
  ) : null
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-disabled={soldOut || undefined}
      onClick={() => {
        if (!soldOut) onSelect()
      }}
      className={cn(
        "grid w-full grid-cols-[5.5rem_minmax(0,1fr)] gap-3 rounded-2xl bg-card p-3 text-left ring-1 ring-foreground/10 outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/60 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4",
        selected && "ring-2 ring-primary",
        soldOut ? "cursor-not-allowed opacity-70" : "hover:shadow-[0_14px_30px_-22px_rgba(7,20,34,0.5)]",
      )}
    >
      <span className="relative aspect-square overflow-hidden rounded-xl bg-muted sm:aspect-[3/2]">
        <Image
          src={roomCover(room).src}
          alt=""
          fill
          className={cn("object-cover", soldOut && "grayscale")}
          sizes="(max-width: 640px) 88px, 144px"
        />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-serif text-xl leading-tight">{room.name}</span>
          <SideBadge side={room.side} className="h-6 text-[0.7rem]" />
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {room.size} · {room.bed} · sleeps {room.sleeps}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          {soldOut ? (
            <span className="inline-flex h-7 items-center rounded-full bg-muted px-2.5 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10">
              Sold out for these dates
            </span>
          ) : (
            <LeftBadge slug={room.slug} checkIn={checkIn} checkOut={checkOut} />
          )}
          {selected ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              <CheckCircle2 className="size-4" aria-hidden /> Selected
            </span>
          ) : null}
        </span>
      </span>
      <span className="col-span-2 flex items-baseline justify-between gap-3 border-t border-border pt-2 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
        <span className="block sm:text-right">{price}</span>
        {total}
      </span>
    </button>
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
    <div className="mx-auto max-w-xl overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10">
      {room ? (
        <div className="relative aspect-[16/8] bg-muted">
          <Image src={roomCover(room).src} alt="" fill className="object-cover" sizes="576px" priority />
        </div>
      ) : null}
      <div className="p-6 md:p-8">
        <p className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-primary uppercase">
          <CheckCircle2 className="size-4" aria-hidden /> Confirmed
        </p>
        <h2 className="mt-3 text-4xl">{booking.confirmationCode}</h2>
        <p className="mt-4 text-base leading-7">
          {guestName}, your {room?.name ?? "room"} is held from {formatStayDate(booking.checkIn)} to{" "}
          {formatStayDate(booking.checkOut)}. Those nights now count against the calendar in this browser.
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
          <div className="flex justify-between gap-4 border-t border-border pt-3 text-base">
            <dt>Stay total</dt>
            <dd>{formatMoney(booking.total)}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/account" className={cn(buttonVariants(), "h-11 rounded-full px-5")}>
            View your booking
          </Link>
          <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={onAnother}>
            Reserve another stay
          </Button>
        </div>
      </div>
    </div>
  )
}
