const WIDTHS = [384, 750, 1080, 1600]
const PHOTO = /^(.*\/images)\/([a-z0-9-]+)\.jpg$/

/**
 * Static export has no image optimizer, so photos are pre-sized to WebP
 * variants in public/images/w (see scripts/make-image-variants.mjs).
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  const match = PHOTO.exec(src)
  if (!match) return src
  const variant = WIDTHS.find((candidate) => candidate >= width) ?? WIDTHS[WIDTHS.length - 1]
  return `${match[1]}/w/${match[2]}-${variant}.webp`
}
