"use client"

import { useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { answerCommand, type AssistantReply } from "@/lib/assistant"
import { cn } from "cn"

const prompts = [
  "What are the nightly prices?",
  "How is the stay total calculated?",
  "How do I confirm a booking?",
  "Where are bookings saved?",
]

export function CommandDesk() {
  const [question, setQuestion] = useState("")
  const [asked, setAsked] = useState<string | null>(null)
  const [reply, setReply] = useState<AssistantReply | null>(null)

  function ask(nextQuestion: string) {
    const trimmed = nextQuestion.trim()
    setQuestion(trimmed)
    setAsked(trimmed)
    setReply(answerCommand(trimmed))
  }

  return (
    <div className="grid gap-8">
      <form
        method="post"
        action="#ask"
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          ask(question)
        }}
      >
        <Label htmlFor="command">Ask about the house</Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="command"
            name="command"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Nightly prices, dates, booking, or where a stay is saved"
            className="h-11 flex-1 bg-card px-3 text-base text-foreground md:text-sm"
            autoComplete="off"
          />
          <button type="submit" className={cn(buttonVariants(), "h-11 rounded-full px-5")}>
            Ask
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="rounded-full border border-border bg-card px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
            onClick={() => ask(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="min-h-24 rounded-2xl bg-card p-5 ring-1 ring-foreground/10" aria-live="polite">
        {reply && asked ? (
          <>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{asked}</p>
            <p className="mt-3 text-base leading-7">{reply.text}</p>
          </>
        ) : (
          <p className="text-base leading-7 text-muted-foreground">
            Ask about the six rooms and their prices, how dates turn into a stay total, how to register and confirm, or where an account is kept.
          </p>
        )}
      </div>
    </div>
  )
}
