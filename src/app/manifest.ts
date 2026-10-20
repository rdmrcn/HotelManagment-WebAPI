import type { MetadataRoute } from "next"
import { withBasePath } from "@/lib/asset"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bosfor Hotels",
    short_name: "Bosfor",
    description: "A fictional hillside house hotel above the Bosphorus. Portfolio demo.",
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    background_color: "#f6f1e6",
    theme_color: "#0b2238",
    icons: [
      { src: withBasePath("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: withBasePath("/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
  }
}
