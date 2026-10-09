"use client"

import { MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ChatDesk } from "@/components/chat-desk"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

function onAskPage(pathname: string) {
  return pathname.replace(/\/+$/, "") === "/ask"
}

export function ChatLauncher() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus()
    wasOpen.current = open
  }, [open])

  if (onAskPage(pathname)) return null

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-50 bg-[#071422]/30" onClick={() => setOpen(false)} />
      ) : null}
      <div
        className={cn(
          "fixed z-[60] right-4 bottom-24 left-4 h-[min(34rem,calc(100dvh-8rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl sm:left-auto sm:w-[24.5rem]",
          open ? "flex" : "hidden",
        )}
      >
        <ChatDesk
          variant="panel"
          active={open}
          onClose={() => setOpen(false)}
          onNavigate={() => setOpen(false)}
        />
      </div>
      <Button
        ref={triggerRef}
        type="button"
        className="fixed right-4 bottom-5 z-[60] h-14 rounded-full px-5 shadow-lg"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <MessageCircle />
        {open ? "Close" : "Ask"}
      </Button>
    </>
  )
}
