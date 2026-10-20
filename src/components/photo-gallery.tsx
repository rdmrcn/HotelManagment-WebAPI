"use client"

import Image from "next/image"
import { useState } from "react"
import { Lightbox, type LightboxImage } from "@/components/lightbox"
import { cn } from "cn"

/** Grid of photos that open in a lightbox. `layout` picks the shape of the grid. */
export function PhotoGallery({
  images,
  layout = "mosaic",
  priorityFirst = false,
  className,
}: {
  images: LightboxImage[]
  layout?: "mosaic" | "pair" | "grid"
  priorityFirst?: boolean
  className?: string
}) {
  const [index, setIndex] = useState<number | null>(null)

  return (
    <>
      <div
        className={cn(
          layout === "mosaic" && "grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2 md:gap-3",
          layout === "pair" && "grid gap-2 md:grid-cols-2",
          layout === "grid" && "grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3",
          className,
        )}
      >
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open photo: ${image.alt}`}
            className={cn(
              "group relative overflow-hidden bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
              layout === "mosaic" &&
                cn(
                  "aspect-[4/3] rounded-xl md:aspect-auto md:min-h-48",
                  i === 0 && "col-span-2 md:row-span-2",
                  i === 3 && "md:col-span-2",
                ),
              layout === "grid" && "aspect-[4/3] rounded-xl",
              layout === "pair" && "min-h-[42vh] md:min-h-[56vh]",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priorityFirst && i < 2}
              sizes={
                layout === "pair"
                  ? "(max-width: 768px) 100vw, 50vw"
                  : layout === "grid"
                    ? "(max-width: 768px) 50vw, 33vw"
                    : i === 0
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
              }
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
      <Lightbox images={images} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </>
  )
}
