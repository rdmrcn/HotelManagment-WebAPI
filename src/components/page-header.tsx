import { cn } from "cn"

export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5", className)}>{children}</div>
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  )
}

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede: string
}) {
  return (
    <header className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 text-4xl md:text-5xl">{title}</h1>
      <p className="mt-4 text-lg leading-8 text-foreground/80">{lede}</p>
    </header>
  )
}
