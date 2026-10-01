import { formatMoney } from "@/lib/format"
import { rooms } from "@/lib/rooms"

export type AssistantTopic = "rooms" | "dates" | "booking" | "storage"

export type AssistantReply = {
  matched: boolean
  topics: AssistantTopic[]
  text: string
}

const helpText = [
  "I can help with four things.",
  "I can list the six rooms and their nightly prices.",
  "I can explain how to choose dates and how the stay total is calculated.",
  "I can explain how to register, sign in, and confirm a booking.",
  "I can tell you that accounts and bookings stay in this browser.",
].join(" ")

function roomsText() {
  const lines = rooms.map((room) => `${room.name}, ${formatMoney(room.nightlyRate)} a night.`)
  return `Bebek Yalı has six room types. Each rate is per room, per night, and taxes are included. ${lines.join(" ")}`
}

function datesText() {
  const king = rooms.find((room) => room.slug === "king")
  const nightly = king?.nightlyRate ?? 385
  const nights = 3
  return [
    "Choose a check-in and a check-out on Book, or on a room page.",
    "Check-in cannot be in the past, and check-out has to be at least one night later.",
    "A stay booked here can run up to 28 nights.",
    `The stay total is the nightly rate multiplied by the number of nights.`,
    `A ${king?.name ?? "King"} room at ${formatMoney(nightly)} for ${nights} nights comes to ${formatMoney(nightly * nights)}.`,
  ].join(" ")
}

function bookingText() {
  return [
    "Create an account with your name, email, and a password, or sign in if this browser already has one.",
    "Then open Book, choose the dates and a room, and press Confirm booking.",
    "The yalı gives you a confirmation code that starts with BYL-.",
    "If you are not signed in, Confirm booking asks you to create an account or sign in first.",
  ].join(" ")
}

function storageText() {
  return "Accounts and bookings stay in this browser. Nothing is sent to a server. Another browser, or clearing this site's saved data, will not have the account or the stays."
}

const answers: Record<AssistantTopic, () => string> = {
  rooms: roomsText,
  dates: datesText,
  booking: bookingText,
  storage: storageText,
}

const patterns: Record<AssistantTopic, RegExp[]> = {
  rooms: [
    /\brooms?\b/,
    /\bprices?\b/,
    /\brates?\b/,
    /\bnightly\b/,
    /\bhow much\b/,
    /\bcosts?\b/,
    /\bstandard\b/,
    /\bqueen\b/,
    /\bking\b/,
    /\bdeluxe\b/,
    /\bsuites?\b/,
    /\bpresidential\b/,
    /\byal[iı]s?\b/,
  ],
  dates: [
    /\bdates?\b/,
    /\bcheck[\s-]?in\b/,
    /\bcheck[\s-]?out\b/,
    /\bnights?\b/,
    /\bstay total\b/,
    /\bcalculated\b/,
    /\bcalculation\b/,
    /\bmultiply\b/,
    /\btotal\b/,
  ],
  booking: [
    /\bregister\b/,
    /\bregistration\b/,
    /\bsign[\s-]?up\b/,
    /\bsign[\s-]?in\b/,
    /\blog[\s-]?in\b/,
    /\baccount\b/,
    /\bconfirm\b/,
    /\bbook(?:ing|ings)?\b/,
    /\breserv(?:e|ation|ations)\b/,
  ],
  storage: [
    /\bthis browser\b/,
    /\bbrowser\b/,
    /\bsaved\b/,
    /\bstored\b/,
    /\bstorage\b/,
    /\blocalstorage\b/,
    /\bserver\b/,
    /\bclear(?:ed|ing)?\b/,
  ],
}

function normalize(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim()
}

function scoreTopic(text: string, topic: AssistantTopic) {
  return patterns[topic].reduce((total, pattern) => total + (pattern.test(text) ? 1 : 0), 0)
}

export function answerCommand(input: string): AssistantReply {
  const text = normalize(input)
  if (!text) {
    return { matched: false, topics: [], text: helpText }
  }

  const scores = {
    rooms: scoreTopic(text, "rooms"),
    dates: scoreTopic(text, "dates"),
    booking: scoreTopic(text, "booking"),
    storage: scoreTopic(text, "storage"),
  }

  if (/\bwhere\b/.test(text) && /\b(account|booking|bookings|stay|stays|reservation|data|password)\b/.test(text)) {
    scores.storage += 1
  }

  const ranked = (Object.keys(scores) as AssistantTopic[])
    .filter((topic) => scores[topic] > 0)
    .sort((left, right) => scores[right] - scores[left])

  if (ranked.length === 0) {
    return { matched: false, topics: [], text: helpText }
  }

  const topics = ranked.slice(0, 2)
  return {
    matched: true,
    topics,
    text: topics.map((topic) => answers[topic]()).join(" "),
  }
}
