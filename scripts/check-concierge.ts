import assert from "node:assert/strict"
import { formatMoney } from "../src/lib/format"
import { getRoom, rooms } from "../src/lib/rooms"
import {
  answerGuest,
  conciergePrompts,
  roomsOnTheCity,
  roomsOnTheWater,
} from "../src/lib/concierge"

const water = roomsOnTheWater()
const city = roomsOnTheCity()

assert.deepEqual(
  water.map((room) => room.slug),
  ["deluxe", "suite", "presidential"],
)
assert.deepEqual(
  city.map((room) => room.slug),
  ["standard", "queen-double", "queen", "king-double", "king"],
)

const queen = getRoom("queen")
const king = getRoom("king")
const queenDouble = getRoom("queen-double")
const kingDouble = getRoom("king-double")
assert.ok(queen && king && queenDouble && kingDouble)
assert.ok(queenDouble.nightlyRate < queen.nightlyRate)
assert.ok(kingDouble.nightlyRate < king.nightlyRate)

function hrefs(question: string) {
  return answerGuest(question).actions.map((action) => action.href)
}

function expectIntent(question: string, intent: string) {
  const reply = answerGuest(question)
  assert.equal(reply.intent, intent, `${question} → ${reply.intent}, not ${intent}\n${reply.text}`)
  assert.ok(reply.actions.length > 0, `${question} has no action`)
  assert.ok(reply.text.length > 0)
  assert.equal(reply.text.includes("Hyatt"), false)
  assert.equal(/chatgpt|openai|gpt-/i.test(reply.text), false)
  assert.equal(/[\w.+-]+@[\w.-]+\.\w+/.test(reply.text), false)
  for (const action of reply.actions) {
    assert.match(action.href, /^\//)
    assert.equal(action.label.trim().length > 0, true)
  }
  return reply
}

const cases: { question: string; intent: string; href: string }[] = [
  { question: "Where do I create an account?", intent: "register", href: "/register" },
  { question: "How do I register?", intent: "register", href: "/register" },
  { question: "How do I sign in?", intent: "sign-in", href: "/sign-in" },
  { question: "How do I log in?", intent: "sign-in", href: "/sign-in" },
  { question: "I want to book", intent: "book", href: "/book" },
  { question: "I want to make a reservation", intent: "book", href: "/book" },
  { question: "What rooms do you have, and what are the nightly prices?", intent: "prices", href: "/rooms" },
  { question: "What is the difference between Queen Room and King Room?", intent: "queen-king", href: "/rooms/queen" },
  { question: "What is Queen Double Room?", intent: "doubles", href: "/rooms/queen-double" },
  { question: "What is King Double Room?", intent: "doubles", href: "/rooms/king-double" },
  { question: "Which rooms have a Bosphorus or sea view?", intent: "sea", href: "/rooms" },
  { question: "Which rooms face the street or buildings?", intent: "city", href: "/rooms" },
  { question: "How is the stay total calculated?", intent: "total", href: "/book" },
  { question: "How do I choose dates?", intent: "dates", href: "/book" },
  { question: "What are check-in and check-out times?", intent: "times", href: "/book" },
  { question: "Is breakfast included?", intent: "breakfast", href: "/" },
  { question: "Where is breakfast?", intent: "breakfast", href: "/" },
  { question: "Where is the hotel?", intent: "location", href: "/" },
  { question: "Do I need an account before I confirm?", intent: "account-required", href: "/register" },
  { question: "Where are my bookings saved?", intent: "storage", href: "/account" },
  { question: "How do I see my booking?", intent: "see-booking", href: "/account" },
  { question: "What does the confirmation code look like?", intent: "confirmation-code", href: "/account" },
  { question: "How do I sign out?", intent: "sign-out", href: "/account" },
  { question: "Can I book a specific room?", intent: "book-room", href: "/book" },
  { question: "What can you help with?", intent: "help", href: "/rooms" },
]

for (const item of cases) {
  const reply = expectIntent(item.question, item.intent)
  assert.ok(
    reply.actions.some((action) => action.href === item.href),
    `${item.question} actions ${hrefs(item.question).join(", ")} missing ${item.href}`,
  )
}

const queenKing = expectIntent("What is the difference between Queen Room and King Room?", "queen-king")
assert.ok(queenKing.actions.some((action) => action.href === "/rooms/king"))
assert.match(queenKing.text, /not the Bosphorus/)
assert.ok(queenKing.text.includes(formatMoney(queen.nightlyRate)))
assert.ok(queenKing.text.includes(formatMoney(king.nightlyRate)))
assert.equal(queenKing.text.includes("Queen Double"), false)

const queenDoubleReply = expectIntent("What is Queen Double Room?", "doubles")
assert.match(queenDoubleReply.text, /under/)
assert.ok(queenDoubleReply.text.includes(formatMoney(queenDouble.nightlyRate)))
assert.match(queenDoubleReply.text, /city-view|does not face the Bosphorus/)

const kingDoubleReply = expectIntent("What is King Double Room?", "doubles")
assert.match(kingDoubleReply.text, /under/)
assert.ok(kingDoubleReply.text.includes(formatMoney(kingDouble.nightlyRate)))

const sea = expectIntent("Which rooms have a Bosphorus or sea view?", "sea")
const seaWater = sea.text.split("Facing the street")[0] ?? ""
for (const room of water) assert.ok(seaWater.includes(room.name), room.name)
for (const room of city) assert.equal(seaWater.includes(room.name), false, room.name)
assert.match(sea.text, /Bosphorus/)

const cityReply = expectIntent("Which rooms face the street or buildings?", "city")
for (const room of city) assert.ok(cityReply.text.includes(room.name))
assert.match(cityReply.text, /On the water: Deluxe Room, Suite Room, Bosfor Suite Room/)

const prices = expectIntent("What rooms do you have, and what are the nightly prices?", "prices")
for (const room of rooms) {
  assert.ok(prices.text.includes(room.name))
  assert.ok(prices.text.includes(formatMoney(room.nightlyRate)))
}
assert.match(prices.text, /taxes included/i)

const total = expectIntent("How is the stay total calculated?", "total")
assert.ok(total.text.includes(formatMoney(king.nightlyRate * 3)))
assert.match(total.text, /multiplied/)

const times = expectIntent("What are check-in and check-out times?", "times")
assert.match(times.text, /15:00/)
assert.match(times.text, /11:00/)

const breakfast = expectIntent("Is breakfast included?", "breakfast")
assert.match(breakfast.text, /^Yes\./)
assert.match(breakfast.text, /terrace until 10:30/)

const code = expectIntent("What does the confirmation code look like?", "confirmation-code")
assert.match(code.text, /BOS-/)

const account = expectIntent("Do I need an account before I confirm?", "account-required")
assert.ok(account.actions.some((action) => action.href === "/sign-in"))
assert.match(account.text, /^Yes\./)

for (const room of rooms) {
  const reply = expectIntent(`Can I book the ${room.name}?`, "book-room")
  assert.equal(reply.actions[0]?.href, `/book?room=${room.slug}`)
}

expectIntent("Can I book the Bosfor Suite?", "book-room")
assert.equal(answerGuest("Can I book the Bosfor Suite?").actions[0]?.href, "/book?room=presidential")
expectIntent("Can I book the Suite Room?", "book-room")
assert.equal(answerGuest("Can I book the Suite Room?").actions[0]?.href, "/book?room=suite")

const outside = expectIntent("Do you have a pool, and what is your email?", "fallback")
assert.match(outside.text, /no email address/i)
assert.match(outside.text, /I can help with/)
assert.equal(/free on|pool is/.test(outside.text), false)

const payment = expectIntent("Can I pay by card?", "fallback")
assert.match(payment.text, /does not take payment/i)

const availability = expectIntent("Is the Deluxe Room available tomorrow?", "fallback")
assert.match(availability.text, /cannot see if Deluxe Room is free/)
assert.equal(availability.actions[0]?.href, "/book?room=deluxe")

for (const prompt of conciergePrompts) {
  const reply = answerGuest(prompt.question)
  assert.notEqual(reply.intent, "fallback", prompt.question)
  assert.ok(reply.actions.length > 0)
}

console.log(`concierge checks passed (${cases.length} scripted questions, ${rooms.length} room links)`)
