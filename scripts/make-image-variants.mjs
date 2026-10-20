import { readdir, mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const WIDTHS = [384, 750, 1080, 1600]
const source = path.resolve("public/images")
const target = path.join(source, "w")

await mkdir(target, { recursive: true })
const files = (await readdir(source)).filter((name) => name.endsWith(".jpg"))

for (const file of files) {
  const base = path.basename(file, ".jpg")
  for (const width of WIDTHS) {
    await sharp(path.join(source, file))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 70, effort: 5 })
      .toFile(path.join(target, `${base}-${width}.webp`))
  }
}

console.log(`${files.length} photos, ${files.length * WIDTHS.length} variants in public/images/w`)
