"use client"

import Link from "next/link"
import { Send, X } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  answerGuest,
  conciergePrompts,
  conciergeWelcome,
  type ConciergeAction,
} from "@/lib/concierge"
import { cn } from "cn"

type ChatMessage = {
  id: string
  role: "guest" | "concierge"
  text: string
  actions?: ConciergeAction[]
}

export function ChatDesk({
  variant = "page",
  active = false,
  onClose,
  onNavigate,
}: {
  variant?: "page" | "panel"
  active?: boolean
  onClose?: () => void
  onNavigate?: () => void
}) {
  const titleId = useId()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const welcome = conciergeWelcome()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "concierge", text: welcome.text, actions: welcome.actions },
  ])
  const [draft, setDraft] = useState("")
  const panel = variant === "panel"

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollTop = scroller.scrollHeight
  }, [messages])

  useEffect(() => {
    if (active) inputRef.current?.focus()
  }, [active])

  function send(raw: string) {
    const question = raw.trim()
    if (!question) return
    const answer = answerGuest(question)
    nextId.current += 1
    const guestId = `guest-${nextId.current}`
    nextId.current += 1
    const replyId = `concierge-${nextId.current}`
    setMessages((current) => [
      ...current,
      { id: guestId, role: "guest", text: question },
      { id: replyId, role: "concierge", text: answer.text, actions: answer.actions },
    ])
    setDraft("")
  }

  return (
    <section
      role={panel ? "dialog" : "region"}
      aria-modal={panel ? true : undefined}
      aria-labelledby={titleId}
      className="flex h-full min-h-0 flex-col"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
        <div>
          <h2 id={titleId} className={cn("leading-none", panel ? "text-2xl" : "text-3xl")}>
            Concierge
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Bosfor Hotels · English · this browser</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the concierge"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-muted"
          >
            <X />
          </button>
        ) : null}
      </div>

      <div ref={scrollerRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-5" role="log" aria-live="polite" aria-relevant="additions">
        {messages.map((message) =>
          message.role === "guest" ? (
            <p
              key={message.id}
              className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm leading-6 text-primary-foreground"
            >
              {message.text}
            </p>
          ) : (
            <div key={message.id} className="mr-auto max-w-[92%]">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">Concierge</p>
              <div className="mt-1 rounded-2xl rounded-tl-md bg-background px-3.5 py-3 text-sm leading-6 text-foreground ring-1 ring-foreground/10">
                <p className="whitespace-pre-line">{message.text}</p>
              </div>
              {message.actions && message.actions.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.actions.map((action, index) => (
                    <Link
                      key={`${message.id}-${action.href}-${action.label}`}
                      href={action.href}
                      onClick={onNavigate}
                      className={cn(
                        buttonVariants({ variant: index === 0 ? "default" : "outline", size: "sm" }),
                        "h-11 rounded-full px-3.5",
                      )}
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ),
        )}
      </div>

      <div className="border-t border-border">
        <div
          className={cn(
            "flex gap-2 px-4 py-3",
            panel ? "overflow-x-auto" : "flex-wrap",
          )}
        >
          {conciergePrompts.map((prompt) => (
            <button
              key={prompt.question}
              type="button"
              className="inline-flex h-11 shrink-0 items-center rounded-full border border-border bg-background px-3.5 text-left text-sm text-foreground hover:bg-muted"
              onClick={() => send(prompt.question)}
            >
              {prompt.label}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          onSubmit={(event) => {
            event.preventDefault()
            send(draft)
          }}
        >
          <Label htmlFor={inputId} className="sr-only">
            Message the concierge
          </Label>
          <Input
            ref={inputRef}
            id={inputId}
            name="message"
            value={draft}
            maxLength={400}
            autoComplete="off"
            placeholder="Rooms, dates, breakfast, or a booking"
            className="h-11 flex-1 bg-background px-3 text-base text-foreground"
            onChange={(event) => setDraft(event.target.value)}
          />
          <Button type="submit" className="h-11 rounded-full px-4" disabled={!draft.trim()}>
            <Send />
            Send
          </Button>
        </form>
      </div>
    </section>
  )
}
