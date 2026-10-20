import { describe, expect, it } from "vitest"
import { answerGuest, conciergePrompts, roomsOnTheCity, roomsOnTheWater } from "@/lib/concierge"
import { rooms } from "@/lib/rooms"

describe("concierge", () => {
  it("splits the house into the Bosphorus side and the city side", () => {
    expect(roomsOnTheWater().map((room) => room.slug)).toEqual(["deluxe", "suite", "presidential"])
    expect(roomsOnTheCity().map((room) => room.slug)).toEqual([
      "standard",
      "queen-double",
      "queen",
      "king-double",
      "king",
    ])
  })

  it("explains availability and the 60 day calendar", () => {
    const reply = answerGuest("Is the Deluxe Room available next weekend?")
    expect(reply.intent).toBe("availability")
    expect(reply.text).toMatch(/60 days ahead/)
    expect(reply.actions[0]?.href).toBe("/book?room=deluxe")
  })

  it("describes the demo-friendly sign-in rule", () => {
    const reply = answerGuest("How do I sign in?")
    expect(reply.intent).toBe("sign-in")
    expect(reply.text).toMatch(/any email/i)
    expect(reply.text).toMatch(/do not use a real password/i)
  })

  it("places the house on a hillside in Bebek", () => {
    const reply = answerGuest("Where is the hotel?")
    expect(reply.intent).toBe("location")
    expect(reply.text).toMatch(/hillside/)
  })

  it("answers every suggested prompt without falling back", () => {
    for (const prompt of conciergePrompts) {
      const reply = answerGuest(prompt.question)
      expect(reply.intent, prompt.question).not.toBe("fallback")
      expect(reply.actions.length).toBeGreaterThan(0)
    }
  })

  it("only links to pages and rooms that exist", () => {
    const slugs = new Set(rooms.map((room) => room.slug))
    for (const room of rooms) {
      for (const action of answerGuest(`Tell me about the ${room.name}`).actions) {
        expect(action.href.startsWith("/")).toBe(true)
        const match = action.href.match(/^\/rooms\/([a-z-]+)$/)
        if (match) expect(slugs.has(match[1])).toBe(true)
      }
    }
  })
})
