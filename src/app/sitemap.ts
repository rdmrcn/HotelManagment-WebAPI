import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/house"
import { rooms } from "@/lib/rooms"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/rooms", "/book", "/ask", ...rooms.map((room) => `/rooms/${room.slug}`)]
  return pages.map((path) => ({
    url: `${SITE_URL}${path}/`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/rooms/") ? 0.6 : 0.8,
  }))
}
