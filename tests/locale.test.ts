// @vitest-environment jsdom
import { createElement } from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { beforeEach, describe, expect, it } from "vitest"
import { LanguageToggle } from "@/components/language-toggle"
import { answerGuest } from "@/lib/concierge"
import { turkishPrompts } from "@/lib/i18n/concierge-tr"
import { LOCALE_KEY, setLocale } from "@/lib/i18n/locale"
import { useCopy } from "@/lib/i18n/use-locale"
import { whatsappUrl } from "@/lib/contact"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function Probe() {
  const copy = useCopy()
  return createElement(
    "div",
    null,
    createElement(LanguageToggle),
    createElement("p", { "data-rooms": "true" }, copy.nav.rooms),
    createElement("p", { "data-book": "true" }, copy.book),
  )
}

describe("language switch", () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    window.localStorage.clear()
    setLocale("en")
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
  })

  it("starts in English, switches to Turkish, and remembers the choice", async () => {
    await act(async () => {
      root.render(createElement(Probe))
    })
    expect(container.querySelector("[data-rooms]")?.textContent).toBe("Rooms")
    expect(container.querySelector("[data-book]")?.textContent).toBe("Book")
    expect(container.querySelector('[data-locale-option="en"]')?.getAttribute("aria-pressed")).toBe("true")

    const turkish = container.querySelector('[data-locale-option="tr"]')
    expect(turkish).toBeInstanceOf(HTMLButtonElement)
    await act(async () => {
      turkish?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })

    expect(window.localStorage.getItem(LOCALE_KEY)).toBe("tr")
    expect(container.querySelector("[data-rooms]")?.textContent).toBe("Odalar")
    expect(container.querySelector("[data-book]")?.textContent).toBe("Rezerve et")
    expect(container.querySelector('[data-locale-option="tr"]')?.getAttribute("aria-pressed")).toBe("true")

    await act(async () => {
      root.unmount()
    })
    container.remove()
    root = createRoot(container)
    document.body.appendChild(container)
    await act(async () => {
      root.render(createElement(Probe))
    })
    expect(container.querySelector("[data-rooms]")?.textContent).toBe("Odalar")
  })
})

describe("concierge language", () => {
  it("keeps an English question in English unless Turkish is requested", () => {
    const english = answerGuest("What are the nightly rates?")
    const turkish = answerGuest("What are the nightly rates?", "tr")
    expect(english.text).toMatch(/night/)
    expect(turkish.text).not.toBe(english.text)
    expect(turkish.text).toMatch(/gece/)
  })

  it("answers every Turkish prompt instead of falling back", () => {
    for (const prompt of turkishPrompts) {
      const reply = answerGuest(prompt.question, "tr")
      expect(reply.intent, prompt.question).not.toBe("fallback")
      expect(reply.text, prompt.question).not.toMatch(/I can help with/)
      expect(reply.text.length).toBeGreaterThan(20)
    }
  })
})

describe("WhatsApp greeting", () => {
  it("prefills the greeting in the active language", () => {
    expect(decodeURIComponent(whatsappUrl("en"))).toContain("Hello, I would like to ask about a stay at Bosfor Hotels.")
    expect(decodeURIComponent(whatsappUrl("tr"))).toContain("Merhaba, Bosfor Hotels'te bir konaklama hakkında bilgi almak istiyorum.")
    expect(whatsappUrl("tr")).toContain("https://wa.me/905550000000?text=")
  })
})
