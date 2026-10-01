export function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

export function safeNext(value: string) {
  if (!value || value.length > 500) return "/account"
  if (!value.startsWith("/") || value.startsWith("//")) return "/account"
  if (value.includes("\\") || value.includes("://")) return "/account"
  const path = value.split("?")[0]
  if (path === "/register" || path === "/sign-in") return "/account"
  return value
}

export function bookPath(checkIn: string, checkOut: string, room: string) {
  const params = new URLSearchParams()
  if (checkIn) params.set("checkIn", checkIn)
  if (checkOut) params.set("checkOut", checkOut)
  if (room) params.set("room", room)
  const query = params.toString()
  return query ? `/book?${query}` : "/book"
}

export function authPath(path: "/register" | "/sign-in", nextPath: string) {
  return `${path}?next=${encodeURIComponent(nextPath)}`
}
