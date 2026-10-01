import { cn } from "cn"

export function Notice({
  tone = "error",
  children,
}: {
  tone?: "error" | "info"
  children: React.ReactNode
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl px-3 py-2 text-sm leading-6",
        tone === "error"
          ? "bg-destructive/10 text-destructive"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {children}
    </p>
  )
}
