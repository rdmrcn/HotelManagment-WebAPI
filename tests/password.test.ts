import { createHash } from "node:crypto"
import { describe, expect, it } from "vitest"
import { hashPassword, newSalt, sha256Fallback, verifyPassword } from "@/lib/password"

describe("password hashing", () => {
  it("hashes with salted SHA-256 and verifies", async () => {
    const salt = newSalt()
    const hash = await hashPassword("secret-pass", salt)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
    expect(hash).toBe(createHash("sha256").update(`${salt}:secret-pass`).digest("hex"))
    expect(await verifyPassword("secret-pass", salt, hash)).toBe(true)
    expect(await verifyPassword("other-pass", salt, hash)).toBe(false)
  })

  it("gives different hashes for the same password with different salts", async () => {
    const a = await hashPassword("same-password", newSalt())
    const b = await hashPassword("same-password", newSalt())
    expect(a).not.toBe(b)
  })

  it("keeps the pure-JS fallback identical to the platform SHA-256", () => {
    const encoder = new TextEncoder()
    for (const text of ["", "abc", "x".repeat(55), "x".repeat(56), "x".repeat(64), "Bosfor çay ☕".repeat(20)]) {
      const expected = createHash("sha256").update(text).digest("hex")
      const actual = Buffer.from(sha256Fallback(encoder.encode(text))).toString("hex")
      expect(actual).toBe(expected)
    }
  })
})
