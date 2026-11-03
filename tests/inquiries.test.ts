// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { listInquiries, saveInquiry } from "@/lib/inquiries"

const valid = {
  name: "Ada Yilmaz",
  email: "ada@example.com",
  message: "Is the suite free next weekend?",
}

beforeEach(() => {
  window.localStorage.clear()
})

describe("contact inquiries", () => {
  it("saves an inquiry in localStorage and lists it back", () => {
    const saved = saveInquiry({ ...valid, checkIn: "2026-06-01", checkOut: "2026-06-04" })
    expect(saved.ok).toBe(true)
    if (!saved.ok) return
    const listed = listInquiries()
    expect(listed).toHaveLength(1)
    expect(listed[0]).toMatchObject({
      name: "Ada Yilmaz",
      email: "ada@example.com",
      message: "Is the suite free next weekend?",
      checkIn: "2026-06-01",
      checkOut: "2026-06-04",
    })
    expect(window.localStorage.getItem("bosfor-hotels.inquiries")).toContain(saved.inquiry.id)
  })

  it("allows blank dates and rejects a single date, a bad email, or an empty message", () => {
    const open = saveInquiry(valid)
    expect(open.ok).toBe(true)

    const badEmail = saveInquiry({ ...valid, email: "not-an-email" })
    expect(badEmail.ok).toBe(false)
    if (!badEmail.ok) expect(badEmail.error).toMatch(/valid email/)

    const blank = saveInquiry({ ...valid, message: " " })
    expect(blank.ok).toBe(false)
    if (!blank.ok) expect(blank.error).toMatch(/short message/)

    const oneDate = saveInquiry({ ...valid, checkIn: "2026-06-01" })
    expect(oneDate.ok).toBe(false)
    if (!oneDate.ok) expect(oneDate.error).toMatch(/both dates/)

    const backwards = saveInquiry({ ...valid, checkIn: "2026-06-04", checkOut: "2026-06-01" })
    expect(backwards.ok).toBe(false)
    if (!backwards.ok) expect(backwards.error).toMatch(/after check-in/)

    expect(listInquiries()).toHaveLength(1)
  })

  it("returns Turkish errors when the page language is Turkish", () => {
    const bad = saveInquiry({ ...valid, email: "nope" }, "tr")
    expect(bad.ok).toBe(false)
    if (!bad.ok) expect(bad.error).toBe("Geçerli bir e-posta yazın.")
  })
})
