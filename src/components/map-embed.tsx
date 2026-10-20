"use client"

import { MapPin } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { mapLinks } from "@/lib/house"

/** Loads the map only on request, so the page stays fast and no third party sees the visit until asked. */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary ring-1 ring-foreground/10 md:aspect-auto md:h-full md:min-h-80">
      {loaded ? (
        <iframe
          title="Map of Bebek, Istanbul, with the hotel marked"
          src={mapLinks.embed}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,#e9dcc0,transparent_60%),linear-gradient(#efe6d2,#e4d6b8)] p-6 text-center">
          <div className="grid justify-items-center gap-3">
            <MapPin className="size-8 text-primary" aria-hidden />
            <p className="max-w-xs text-sm leading-6 text-foreground/80">
              The map comes from OpenStreetMap. It loads when you ask, and not before.
            </p>
            <Button type="button" className="h-11 rounded-full px-5" onClick={() => setLoaded(true)}>
              Show the map
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
