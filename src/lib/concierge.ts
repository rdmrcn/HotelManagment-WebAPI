import { formatMoney } from "@/lib/format"
import { getRoom, rooms, type Room } from "@/lib/rooms"

export type ConciergeAction = {
  label: string
  href: string
}

export type ConciergeReply = {
  intent: string
  text: string
  actions: ConciergeAction[]
}

export const conciergePrompts: { label: string; question: string }[] = [
  { label: "Create an account", question: "Where do I create an account?" },
  { label: "Nightly prices", question: "What are the nightly prices?" },
  { label: "Sea view", question: "Which rooms have a sea view?" },
  { label: "Book a room", question: "I want to book" },
  { label: "Stay total", question: "How is the stay total calculated?" },
  { label: "Saved bookings", question: "Where are my bookings saved?" },
]

const waterView = /bosphorus|strait|water/i

export function roomsOnTheWater() {
  return rooms.filter((room) => waterView.test(room.view))
}

export function roomsOnTheCity() {
  return rooms.filter((room) => !waterView.test(room.view))
}

function reply(intent: string, text: string, actions: ConciergeAction[]): ConciergeReply {
  return { intent, text, actions }
}

function roomHref(room: Room) {
  return `/rooms/${room.slug}`
}

function bookHref(room?: Room) {
  return room ? `/book?room=${room.slug}` : "/book"
}

function seeRoom(room: Room): ConciergeAction {
  return { label: room.name, href: roomHref(room) }
}

function bookRoom(room: Room): ConciergeAction {
  return { label: `Book ${room.name}`, href: bookHref(room) }
}

function roomBySlug(slug: string) {
  return getRoom(slug) ?? null
}

function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500)
}

function mentionedRooms(text: string) {
  const rules: { slug: string; re: RegExp }[] = [
    { slug: "queen-double", re: /\bqueen[\s-]+doubles?\b|\btwo[\s-]+queens?\b/ },
    { slug: "king-double", re: /\bking[\s-]+doubles?\b|\btwo[\s-]+kings?\b/ },
    { slug: "presidential", re: /\bbosfor[\s-]+suites?\b|\bpresidential(?:[\s-]+suite)?\b/ },
    { slug: "deluxe", re: /\bdeluxe\b/ },
    { slug: "suite", re: /\bsuites?\b/ },
    { slug: "queen", re: /\bqueens?\b/ },
    { slug: "king", re: /\bkings?\b/ },
    { slug: "standard", re: /\bstandards?\b/ },
  ]
  let remaining = text
  const found: Room[] = []
  for (const rule of rules) {
    if (!rule.re.test(remaining)) continue
    const room = roomBySlug(rule.slug)
    if (room) found.push(room)
    remaining = remaining.replace(rule.re, " ")
  }
  return found
}

function isConfirmationCode(text: string) {
  if (/\bconfirmation[\s-]+codes?\b/.test(text)) return true
  if (/\bconfirmation\b/.test(text) && /\b(code|number|format|look)\b/.test(text)) return true
  if (/\bbos\b/.test(text) && /\b(code|confirmation|mean|looks?)\b/.test(text)) return true
  return false
}

function isSignOut(text: string) {
  return /\b(sign[\s-]?out|log[\s-]?out|logout|signout)\b/.test(text)
}

function isAccountRequired(text: string) {
  const account = /\b(account|register|registered|signed in|logged in|sign[\s-]?in)\b/.test(text)
  const gate = /\b(need|needed|needs|required|require|must|without|before)\b/.test(text) || /\bhave to\b/.test(text)
  const action = /\b(confirm|book|booking|reserve|reservation)\b/.test(text)
  return account && gate && action
}

function isRegister(text: string) {
  if (/\b(sign[\s-]?in|log[\s-]?in|login|signin)\b/.test(text) && !/\b(register|sign[\s-]?up|signup|create)\b/.test(text)) {
    return false
  }
  if (/\b(register|signup|sign[\s-]?up)\b/.test(text)) return true
  if (/\b(create|open|make|start)\b.{0,40}\baccount\b/.test(text)) return true
  if (/\baccount\b.{0,40}\b(create|register|open|new)\b/.test(text)) return true
  if (/\b(need|want)\b.{0,24}\baccount\b/.test(text) && !/\b(confirm|book|booking|reserve|reservation)\b/.test(text)) {
    return true
  }
  return false
}

function isSignIn(text: string) {
  return /\b(sign[\s-]?in|log[\s-]?in|login|signin)\b/.test(text)
}

function isBreakfast(text: string) {
  return /\bbreakfast\b/.test(text)
}

function isTimes(text: string) {
  if (/\b(choose|pick|select|set)\b/.test(text) && /\bdates?\b/.test(text) && !/\btime/.test(text)) return false
  const checkIn = /\bcheck[\s-]?in\b/.test(text)
  const checkOut = /\bcheck[\s-]?out\b|\bcheckout\b/.test(text)
  if (checkIn && checkOut) return true
  if ((checkIn || checkOut) && /\b(time|times|when|hour|oclock)\b/.test(text)) return true
  if (/\b(arrival|arrive)\b/.test(text) && /\b(time|times|when|early)\b/.test(text)) return true
  return false
}

function isTotal(text: string) {
  if (/\b(stay total|calculated|calculation)\b/.test(text)) return true
  if (/\btotal\b/.test(text) && /\b(stay|night|nights|price|cost|rate|much)\b/.test(text)) return true
  if (/\bhow much\b/.test(text) && /\b(nights?|stay|total)\b/.test(text)) return true
  if (/\bmultipl/.test(text)) return true
  return false
}

function isDates(text: string) {
  if (/\bdates?\b/.test(text) && /\b(choose|pick|select|set|change|how)\b/.test(text)) return true
  if (/\b(choose|pick|select|set)\b/.test(text) && /\b(check[\s-]?in|nights?)\b/.test(text)) return true
  return false
}

function isAvailability(text: string) {
  return /\b(available|availability|vacant|vacancy|sold out|fully booked)\b/.test(text)
}

function isLocation(text: string) {
  if (/\b(address|located|location|directions)\b/.test(text)) return true
  if (/\bwhere\b/.test(text) && /\b(hotel|house|bosfor|istanbul|bebek|you)\b/.test(text)) return true
  if (/\bhow do i get\b/.test(text)) return true
  return false
}

function isSea(text: string) {
  if (/\b(bosphorus|bosporus|bosphorous|waterfront)\b/.test(text)) return true
  if (/\bsea[\s-]?view\b/.test(text) || /\bwater[\s-]?view\b/.test(text)) return true
  if (/\bstrait\b/.test(text) && /\b(room|rooms|view|face|facing)\b/.test(text)) return true
  if (/\b(sea|water)\b/.test(text) && /\b(room|rooms|view|face|facing|overlook)\b/.test(text)) return true
  return false
}

function isCity(text: string) {
  if (isSea(text)) return false
  const cue = /\b(street|buildings?|rooftops?|city[\s-]?view|city[\s-]?side)\b/.test(text)
  if (!cue) return false
  return /\b(room|rooms|face|facing|overlook|view|which|what)\b/.test(text)
}

function isStorage(text: string) {
  if (/\blocalstorage\b/.test(text)) return true
  const stays = /\b(booking|bookings|reservation|reservations|stay|stays)\b/.test(text)
  const place = /\b(saved|stored|storage|browser|server|kept|device)\b/.test(text)
  if (place && stays) return true
  if (place && /\b(account|accounts|data|password)\b/.test(text) && !/\b(create|register|sign[\s-]?up|new)\b/.test(text)) {
    return true
  }
  if (/\bwhere\b/.test(text) && stays && !/\b(see|view|find|show)\b/.test(text) && !/\b(hotel|house)\b/.test(text)) {
    return true
  }
  return false
}

function isSeeBooking(text: string) {
  const thing = /\b(booking|bookings|reservation|reservations|stay|stays)\b/.test(text)
  const see =
    /\b(see|view|find|show)\b/.test(text) ||
    /\blook up\b/.test(text) ||
    (/\bcheck\b/.test(text) && !/\bcheck[\s-]?in\b/.test(text) && !/\bcheck[\s-]?out\b/.test(text))
  return thing && see
}

function isQueenKing(text: string, mentioned: Room[]) {
  if (/\b(book|reserve|reservation)\b/.test(text)) return false
  const slugs = new Set(mentioned.map((room) => room.slug))
  const pair = slugs.has("queen") && slugs.has("king")
  if (!pair) return false
  return /\b(difference|compare|comparison|versus|vs|between|or)\b/.test(text)
}

function isDoubles(text: string, mentioned: Room[]) {
  if (mentioned.length === 1 && /\b(book|reserve|reservation)\b/.test(text)) return false
  const hasDouble = mentioned.some((room) => room.slug === "queen-double" || room.slug === "king-double")
  if (hasDouble && !/\b(book|reserve|reservation)\b/.test(text)) return true
  if (/\bdouble rooms?\b/.test(text) || /\btwo beds?\b/.test(text) || (/\bdoubles?\b/.test(text) && /\b(cheaper|city)\b/.test(text))) {
    return !/\b(book|reserve|reservation)\b/.test(text)
  }
  return false
}

function wantsBooking(text: string) {
  return /\b(book|booking|reserve|reservation)\b/.test(text) || /\bwant\b/.test(text) || /\bstay in\b/.test(text)
}

function isSpecificRoom(text: string, mentioned: Room[]) {
  if (mentioned.length > 0) return false
  return /\b(specific|particular|certain|named)\b/.test(text) && /\broom/.test(text)
}

function isPrices(text: string) {
  if (/\b(price|prices|priced|rate|rates|nightly|how much)\b/.test(text)) return true
  if (/\b(what|which)\s+rooms\b/.test(text)) return true
  if (/\brooms do you\b/.test(text) || /\broom types\b/.test(text)) return true
  return false
}

function isBook(text: string) {
  return /\b(book|booking|reserve|reservation)\b/.test(text)
}

function isHelp(text: string) {
  if (/^(help|hello|hi|hey|good morning|good afternoon|good evening)$/.test(text)) return true
  if (/\bwhat can you (help|do|answer)\b/.test(text)) return true
  if (/\bhow can you help\b/.test(text)) return true
  if (/\bwhat do you (do|help)\b/.test(text)) return true
  if (/\bwhat can i ask\b/.test(text)) return true
  return false
}

function unknownRoomName(text: string, mentioned: Room[]) {
  if (mentioned.length > 0) return null
  const match = text.match(/\b(?:the|a)\s+([a-z0-9]+(?:[\s-][a-z0-9]+){0,3})\s+rooms?\b/)
  if (!match) return null
  const name = match[1]
  if (
    /^(specific|particular|certain|same|other|another|different|new|one|any|cheaper|larger|smaller|quiet|best|double|single|sea|water|city|street|bosphorus)$/.test(
      name,
    )
  ) {
    return null
  }
  if (/^(sea|water|city|bosphorus|bosporus)\b/.test(name)) return null
  return name
}

function countWord(count: number) {
  return ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"][count] ?? String(count)
}

function helpActions(): ConciergeAction[] {
  return [
    { label: "See the rooms", href: "/rooms" },
    { label: "Reserve a room", href: "/book" },
    { label: "Create an account", href: "/register" },
  ]
}

export function conciergeWelcome(): ConciergeReply {
  return reply(
    "help",
    "Good day. I am the concierge for Bosfor Hotels. Ask about a room, the view, breakfast, or how to book, and I will point you to the next page. I answer from this site, in this browser.",
    [
      { label: "See the rooms", href: "/rooms" },
      { label: "Reserve a room", href: "/book" },
    ],
  )
}

function helpReply(): ConciergeReply {
  return reply(
    "help",
    "I can help with the eight rooms and nightly prices, which rooms face the Bosphorus, dates and the stay total, check-in, breakfast, and the house in Bebek. I can also open registration, sign-in, booking, or the stays saved in this browser.",
    helpActions(),
  )
}

function fallbackReply(text: string, mentioned: Room[] = []): ConciergeReply {
  const scope =
    "I can help with the rooms and nightly prices, sea view and street side, dates and the stay total, check-in, breakfast, and how to register, sign in, or see a saved stay."
  const limits = "I cannot check availability, take payment, or give an email address."

  if (/\b(pay|payment|card|credit|visa|mastercard|invoice|refund)\b/.test(text)) {
    return reply(
      "fallback",
      `This site does not take payment or refunds. Confirming a stay only saves it in this browser. ${scope}`,
      [
        { label: "Reserve a room", href: "/book" },
        { label: "Your account", href: "/account" },
      ],
    )
  }
  if (/\b(e-?mail|phone|telephone|whatsapp)\b/.test(text)) {
    return reply("fallback", `There is no email address or phone number on this site. ${scope}`, [
      { label: "Create an account", href: "/register" },
      { label: "Reserve a room", href: "/book" },
    ])
  }
  if (/\b(cancel|cancell|change|modify)\b/.test(text)) {
    return reply(
      "fallback",
      `This desk cannot change or cancel a stay. ${limits} Saved stays are listed on your account in this browser.`,
      [{ label: "Your account", href: "/account" }],
    )
  }
  if (isAvailability(text)) {
    const room = mentioned.length === 1 ? mentioned[0] : null
    const which = room ? room.name : "a room"
    return reply(
      "fallback",
      `I cannot see if ${which} is free. Choose your dates on Book and the stay is saved in this browser. I do not hold a room.`,
      [room ? bookRoom(room) : { label: "Reserve a room", href: "/book" }],
    )
  }
  if (/\broom/.test(text) || mentioned.length > 0) {
    return reply("fallback", `${scope} ${limits}`, [
      { label: "See the rooms", href: "/rooms" },
      { label: "Reserve a room", href: "/book" },
    ])
  }
  return reply("fallback", `${scope} ${limits}`, helpActions())
}

function pricesReply(): ConciergeReply {
  const lines = rooms.map((room) => `${room.name} — ${formatMoney(room.nightlyRate)} — ${room.view}`)
  return reply(
    "prices",
    `The house has ${rooms.length} rooms. Rates are per room, per night, taxes included.\n${lines.join("\n")}`,
    [{ label: "See all rooms", href: "/rooms" }],
  )
}

function queenKingReply(): ConciergeReply {
  const queen = roomBySlug("queen")
  const king = roomBySlug("king")
  if (!queen || !king) return pricesReply()
  const larger = king.nightlyRate > queen.nightlyRate ? king : queen
  return reply(
    "queen-king",
    `${queen.name}: ${queen.bed.toLowerCase()}, ${queen.size}, ${queen.view.toLowerCase()}, ${formatMoney(queen.nightlyRate)} a night. ${king.name}: ${king.bed.toLowerCase()}, ${king.size}, ${king.view.toLowerCase()}, ${formatMoney(king.nightlyRate)} a night. ${larger.name} is the larger room and costs more. Both face the city, not the Bosphorus.`,
    [seeRoom(queen), seeRoom(king)],
  )
}

function doublesReply(mentioned: Room[]): ConciergeReply {
  const queenDouble = roomBySlug("queen-double")
  const kingDouble = roomBySlug("king-double")
  const queen = roomBySlug("queen")
  const king = roomBySlug("king")
  if (!queenDouble || !kingDouble || !queen || !king) return pricesReply()
  const focus = mentioned.filter((room) => room.slug === "queen-double" || room.slug === "king-double")
  const subjects = focus.length > 0 ? focus : [queenDouble, kingDouble]
  const sentences = subjects.map((room) => {
    const single = room.slug === "queen-double" ? queen : king
    const relation =
      room.nightlyRate < single.nightlyRate
        ? `under ${single.name} at ${formatMoney(single.nightlyRate)}`
        : `next to ${single.name} at ${formatMoney(single.nightlyRate)}`
    return `${room.name} is ${room.bed.toLowerCase()}, ${room.size}, ${room.view.toLowerCase()}, at ${formatMoney(room.nightlyRate)} a night — ${relation}.`
  })
  const tail =
    subjects.length > 1
      ? "Both are city-view doubles. Neither faces the Bosphorus."
      : "It is a city-view double. It does not face the Bosphorus."
  const actions =
    subjects.length === 1
      ? [seeRoom(subjects[0]), bookRoom(subjects[0])]
      : subjects.map((room) => seeRoom(room))
  return reply("doubles", `${sentences.join(" ")} ${tail}`, actions)
}

function seaReply(): ConciergeReply {
  const water = roomsOnTheWater()
  const city = roomsOnTheCity()
  return reply(
    "sea",
    `${countWord(water.length)} ${water.length === 1 ? "room faces" : "rooms face"} the Bosphorus: ${water
      .map((room) => `${room.name} (${formatMoney(room.nightlyRate)}, ${room.view})`)
      .join("; ")}. Facing the street or buildings: ${city.map((room) => room.name).join(", ")}.`,
    [{ label: "See the rooms", href: "/rooms" }],
  )
}

function cityReply(): ConciergeReply {
  const city = roomsOnTheCity()
  const water = roomsOnTheWater()
  return reply(
    "city",
    `Facing the street, rooftops, or buildings: ${city
      .map((room) => `${room.name} (${room.view}, ${formatMoney(room.nightlyRate)})`)
      .join("; ")}. On the water: ${water.map((room) => room.name).join(", ")}.`,
    [{ label: "See the rooms", href: "/rooms" }],
  )
}

function totalReply(): ConciergeReply {
  const room = roomBySlug("king") ?? rooms[0]
  const nights = 3
  return reply(
    "total",
    `The stay total is the nightly rate multiplied by the number of nights. Taxes are already in the rate. ${room.name} at ${formatMoney(room.nightlyRate)} for ${nights} nights is ${formatMoney(room.nightlyRate * nights)}. Check-in cannot be in the past, check-out is at least one night later, and a stay here stops at 28 nights.`,
    [{ label: "Choose dates", href: "/book" }],
  )
}

function datesReply(): ConciergeReply {
  return reply(
    "dates",
    "Choose a check-in and a check-out on Book, or on a room page. Check-in cannot be in the past, and check-out has to be at least one night later. A stay booked here can run up to 28 nights.",
    [{ label: "Choose dates", href: "/book" }],
  )
}

function timesReply(): ConciergeReply {
  return reply(
    "times",
    "Check-in is from 15:00. Check-out is by 11:00. If you arrive early, bags can wait in the hall by the garden.",
    [{ label: "Reserve a room", href: "/book" }],
  )
}

function breakfastReply(): ConciergeReply {
  const suite = roomBySlug("presidential")
  const suiteName = suite?.name ?? "Bosfor Suite Room"
  return reply(
    "breakfast",
    `Yes. Breakfast is served on the terrace until 10:30: simit, white cheeses, honey, tomatoes, and tea in tulip glasses. ${suiteName} can have breakfast brought out on request.`,
    [{ label: "The house", href: "/" }],
  )
}

function locationReply(): ConciergeReply {
  return reply(
    "location",
    "Bosfor Hotels is on Cevdet Paşa Caddesi in Bebek, on the European shore of the Bosphorus in Istanbul. The quay is private. Bebek village is a short walk.",
    [{ label: "The house", href: "/" }],
  )
}

function bookNamedReply(room: Room): ConciergeReply {
  return reply(
    "book-room",
    `Yes. ${room.name} is ${formatMoney(room.nightlyRate)} a night, ${room.view.toLowerCase()}. I will open Book with that room selected. Add your dates, then confirm.`,
    [bookRoom(room), seeRoom(room)],
  )
}

function specificRoomReply(): ConciergeReply {
  const first = rooms[0]
  const last = rooms[rooms.length - 1]
  return reply(
    "book-room",
    `Yes. Name a room — ${first?.name ?? "Standard Room"} through ${last?.name ?? "Bosfor Suite Room"} — or open Book and choose it there.`,
    [{ label: "Choose a room", href: "/book" }],
  )
}

function roomDetailReply(room: Room): ConciergeReply {
  return reply(
    "room",
    `${room.name} is ${room.bed.toLowerCase()}, ${room.size}, ${room.view.toLowerCase()}, ${formatMoney(room.nightlyRate)} a night. ${room.summary}`,
    [seeRoom(room), bookRoom(room)],
  )
}

export function answerGuest(input: string): ConciergeReply {
  const text = normalize(input)
  if (!text) {
    if (input.trim()) {
      return reply(
        "fallback",
        "I answer in English. Ask about the rooms, a price, dates, or how to book.",
        helpActions(),
      )
    }
    return conciergeWelcome()
  }

  if (isConfirmationCode(text)) {
    return reply(
      "confirmation-code",
      "A confirmation code starts with BOS- and then four letters or numbers, for example BOS-K7QM. It appears when you confirm, and again on your account.",
      [{ label: "See your booking", href: "/account" }],
    )
  }
  if (isSignOut(text)) {
    return reply(
      "sign-out",
      "Open your account and press Sign out. That ends the session in this browser. Stays already saved remain on this device.",
      [{ label: "Your account", href: "/account" }],
    )
  }
  if (isAccountRequired(text)) {
    return reply(
      "account-required",
      "Yes. You need an account before you confirm. Confirm booking asks you to create one or sign in first, then the stay is saved in this browser.",
      [
        { label: "Create an account", href: "/register" },
        { label: "Sign in", href: "/sign-in" },
      ],
    )
  }
  if (isRegister(text)) {
    return reply(
      "register",
      "Create an account with your name, email, and a password. The account stays in this browser.",
      [{ label: "Create an account", href: "/register" }],
    )
  }
  if (isSignIn(text)) {
    return reply(
      "sign-in",
      "Sign in with the email and password you already saved in this browser.",
      [{ label: "Sign in", href: "/sign-in" }],
    )
  }
  if (isBreakfast(text)) return breakfastReply()
  if (isTimes(text)) return timesReply()
  if (isTotal(text)) return totalReply()
  if (isDates(text)) return datesReply()
  if (isLocation(text)) return locationReply()
  if (isSea(text)) return seaReply()
  if (isCity(text)) return cityReply()
  if (isStorage(text)) {
    return reply(
      "storage",
      "Bookings are saved in this browser, with your account. Nothing is sent to a server. Another browser, or clearing this site's data, will not have them.",
      [{ label: "Your account", href: "/account" }],
    )
  }
  if (isSeeBooking(text)) {
    return reply(
      "see-booking",
      "Open your account. Stays saved in this browser are listed there, each with its confirmation code.",
      [{ label: "See your booking", href: "/account" }],
    )
  }

  const mentioned = mentionedRooms(text)
  if (isQueenKing(text, mentioned)) return queenKingReply()
  if (isDoubles(text, mentioned)) return doublesReply(mentioned)
  if (mentioned.length >= 2 && (/\b(difference|compare|comparison|versus|vs)\b/.test(text) || /\bbetween\b/.test(text))) {
    const [left, right] = mentioned
    return reply(
      "room",
      `${left.name}: ${left.bed.toLowerCase()}, ${left.size}, ${left.view.toLowerCase()}, ${formatMoney(left.nightlyRate)} a night. ${right.name}: ${right.bed.toLowerCase()}, ${right.size}, ${right.view.toLowerCase()}, ${formatMoney(right.nightlyRate)} a night.`,
      [seeRoom(left), seeRoom(right)],
    )
  }
  if (isAvailability(text)) return fallbackReply(text, mentioned)
  if (mentioned.length === 1 && /\b(price|prices|rate|rates|cost|costs|how much|nightly)\b/.test(text)) {
    return roomDetailReply(mentioned[0])
  }
  if (
    mentioned.length === 1 &&
    /\b(what is|whats|tell me|describe|how big)\b/.test(text) &&
    !wantsBooking(text)
  ) {
    return roomDetailReply(mentioned[0])
  }
  if (mentioned.length === 1 && wantsBooking(text)) return bookNamedReply(mentioned[0])
  if (mentioned.length > 1 && wantsBooking(text)) {
    return reply(
      "book",
      `Book holds one room at a time. Open Book and choose ${mentioned.map((room) => room.name).join(" or ")}.`,
      [{ label: "Reserve a room", href: "/book" }, ...mentioned.slice(0, 2).map((room) => seeRoom(room))],
    )
  }
  if (isSpecificRoom(text, mentioned)) return specificRoomReply()
  const unknown = unknownRoomName(text, mentioned)
  if (unknown && (wantsBooking(text) || /\broom\b/.test(text))) {
    return reply(
      "fallback",
      `There is no ${unknown} room at the house. The rooms are ${rooms.map((room) => room.name).join(", ")}.`,
      [{ label: "See the rooms", href: "/rooms" }],
    )
  }
  if (isPrices(text)) return pricesReply()
  if (isBook(text)) {
    return reply(
      "book",
      "Open Book, choose your dates and a room, then press Confirm booking. You need an account in this browser before the stay can be saved.",
      [{ label: "Reserve a room", href: "/book" }],
    )
  }
  if (/\b(pay|payment|card|credit|visa|mastercard|invoice|refund|e-?mail|phone|telephone|whatsapp|cancel|cancell|change|modify)\b/.test(text)) {
    return fallbackReply(text, mentioned)
  }
  if (isHelp(text)) return helpReply()
  return fallbackReply(text, mentioned)
}
