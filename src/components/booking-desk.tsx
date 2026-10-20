"use client"

import { CalendarClock, CheckCircle2, CreditCard, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { DateRangePicker } from "@/components/date-range-picker"
import { LeftBadge } from "@/components/left-badge"
import { Notice } from "@/components/notice"
import { SideBadge } from "@/components/side-badge"
import { PaymentFields, cardFieldId, demoCard, emptyCard } from "@/components/payment-fields"
import { buttonVariants } from "@/components/ui/button"
import { nextAvailableStay, stayAvailability } from "@/lib/availability"
import { formatMoney, formatStayDate, nightLabel } from "@/lib/format"
import { getRoom, roomCover, rooms, type Room } from "@/lib/rooms"
import { authPath, bookPath } from "@/lib/search"
import { validateCard, type CardErrors, type CardField, type CardInput } from "@/lib/payment"
import { nightsBetween, quoteStay } from "@/lib/stay"
import { useToday } from "@/lib/use-today"
import { cn } from "cn"

const MAX_SLEEPS = Math.max(...rooms.map((item) => item.sleeps))

export function BookingDesk() {
  const searchParams = useSearchParams()
  return <BookingForm key={searchParams.toString()} />
}

function BookingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRoom = searchParams.get("room") ?? ""
  const today = useToday()
  const { status, guest, allBookings, payForBooking } = useAuth()
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "")
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "")
  const [roomSlug, setRoomSlug] = useState(getRoom(initialRoom)?.slug ?? "")
  const [hideSoldOut, setHideSoldOut] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [guestCount, setGuestCount] = useState(2)
  const [card, setCard] = useState<CardInput>(emptyCard)
  const [cardErrors, setCardErrors] = useState<CardErrors>({})
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paidRef, setPaidRef] = useState<string | null>(null)
  const formErrorRef = useRef<HTMLDivElement>(null)

  const paymentErrorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formError) formErrorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [formError])

  useEffect(() => {
    if (paymentError) paymentErrorRef.current?.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [paymentError])

  const ready = today !== "" && status === "ready"
  const room = getRoom(roomSlug)
  const maxGuests = room?.sleeps ?? MAX_SLEEPS
  const guests = Math.min(guestCount, maxGuests)
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

  function updateCard(field: CardField, value: string) {
    setCard((current) => ({ ...current, [field]: value }))
    setCardErrors((current) => ({ ...current, [field]: undefined }))
    setPaymentError(null)
  }

  async function confirmStay() {
    if (submitting) return
    setFormError(null)
    setPaymentError(null)

    if (!ready) {
      setFormError("Still checking this browser. Pay again in a moment.")
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

    const errors = validateCard(card)
    const firstInvalid = (["name", "number", "expiry", "cvc"] as const).find((field) => errors[field])
    if (firstInvalid) {
      setCardErrors(errors)
      document.getElementById(cardFieldId(firstInvalid))?.focus()
      return
    }

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    const result = await payForBooking({ roomSlug: room.slug, checkIn, checkOut, guests, card })
    setSubmitting(false)
    if (!result.ok) {
      setCard((current) => ({ ...current, cvc: "" }))
      if (result.code === "unavailable") {
        setFormError(result.error)
      } else {
        if (result.fields) setCardErrors(result.fields)
        setPaymentError(result.error)
      }
      return
    }
    setCard(emptyCard)
    setPaidRef(result.booking.confirmationCode)
    router.push(`/confirmation?ref=${encodeURIComponent(result.booking.confirmationCode)}`)
  }

  if (paidRef) {
    return (
      <div role="status" className="mx-auto max-w-xl rounded-3xl bg-card p-8 text-center ring-1 ring-foreground/10">
        <CheckCircle2 className="mx-auto size-8 text-primary" aria-hidden />
        <h2 className="mt-3 text-3xl">Payment received</h2>
        <p className="mt-2 text-sm text-muted-foreground">Opening confirmation {paidRef}…</p>
      </div>
    )
  }

  const payLabel = quote?.ok && !selectedBlocked ? `Pay ${formatMoney(quote.total)} and confirm` : "Pay and confirm"
  const confirmLabel = submitting ? "Processing payment…" : guest || !ready ? payLabel : "Sign in to pay"

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
          <div className="grid max-w-xs gap-2">
            <label htmlFor="book-guests" className="text-sm leading-none font-medium">
              Guests
            </label>
            <select
              id="book-guests"
              value={guests}
              onChange={(event) => setGuestCount(Number(event.target.value))}
              className="h-12 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {Array.from({ length: maxGuests }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>
                  {count === 1 ? "1 guest" : `${count} guests`}
                </option>
              ))}
            </select>
            {room ? (
              <p className="text-xs text-muted-foreground">
                {room.name} sleeps up to {room.sleeps}.
              </p>
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

        <section aria-labelledby="payment-heading" className="grid max-w-xl gap-4">
          <h2 id="payment-heading" className="text-2xl">
            <span className="mr-2 text-primary">3.</span>Payment
          </h2>
          {!ready ? (
            <div className="h-64 animate-pulse rounded-2xl bg-muted" role="status">
              <span className="sr-only">Checking this browser for a saved account…</span>
            </div>
          ) : guest ? (
            <>
              <PaymentFields
                card={card}
                errors={cardErrors}
                disabled={submitting}
                onChange={updateCard}
                onFillDemo={() => {
                  setCard(demoCard(guest.name))
                  setCardErrors({})
                  setPaymentError(null)
                }}
              />
              <div ref={paymentErrorRef} aria-live="assertive">
                {paymentError ? <Notice>{paymentError}</Notice> : null}
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
              <p className="flex items-center gap-2 font-medium">
                <CreditCard className="size-4 text-primary" aria-hidden /> Sign in to pay
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Demo checkout. No real charge. Use 4242 4242 4242 4242. You will sign in first, then come back to this
                page with your dates and room.
              </p>
              <Link
                href={authPath("/sign-in", returnTo)}
                className={cn(buttonVariants(), "mt-4 h-11 rounded-full px-5")}
              >
                Sign in to continue
              </Link>
            </div>
          )}
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
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Guests</dt>
            <dd>{guests}</dd>
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
          {guest || !ready ? <Lock className="mr-1.5 size-4" aria-hidden /> : null}
          {confirmLabel}
        </button>
        {formError ? (
          <div ref={formErrorRef} className="mt-4">
            <Notice>{formError}</Notice>
          </div>
        ) : null}
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Demo checkout. No real charge. Use 4242 4242 4242 4242. Bosfor Hotels is fictional, and the booking stays in this
          browser. The room is held only after the payment goes through.
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
            {submitting ? "Paying…" : guest || !ready ? "Pay now" : "Sign in to pay"}
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
