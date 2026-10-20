"use client"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef } from "react"

export type LightboxImage = { src: string; alt: string; caption?: string }

export function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: LightboxImage[]
  index: number | null
  onIndex: (index: number) => void
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const open = index !== null
  const count = images.length

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onIndex((index + delta + count) % count)
    },
    [index, count, onIndex],
  )

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, step])

  const image = index === null ? null : images[index]

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-[#050d16]/90"
    >
      {image ? (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-4 md:p-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white outline-none hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-white/60"
          >
            <X className="size-5" />
          </button>
          <div className="relative h-full w-full max-w-6xl flex-1">
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <div className="flex w-full max-w-6xl items-center justify-between gap-4 text-white">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-white/60"
            >
              <ChevronLeft className="size-5" />
            </button>
            <p className="min-w-0 text-center text-sm leading-6 text-white/85" aria-live="polite">
              <span className="mr-2 text-white/60">
                {(index ?? 0) + 1} / {count}
              </span>
              {image.caption ?? image.alt}
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-white/60"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
