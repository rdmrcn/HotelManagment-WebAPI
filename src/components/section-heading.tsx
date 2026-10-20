import { Eyebrow } from "@/components/page-header"
import { cn } from "cn"

export function SectionHeading({
  eyebrow,
  title,
  lede,
  className,
  as: Tag = "h2",
}: {
  eyebrow: string
  title: string
  lede?: string
  className?: string
  as?: "h1" | "h2"
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Tag className="mt-3 text-4xl leading-[1.05] md:text-5xl">{title}</Tag>
      {lede ? <p className="mt-4 text-base leading-7 text-foreground/80 md:text-lg md:leading-8">{lede}</p> : null}
    </div>
  )
}
