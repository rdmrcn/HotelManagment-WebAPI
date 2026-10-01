import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a guest account for Bosfor Hotels. Your details stay in this browser.",
}

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <Suspense
        fallback={
          <p role="status" className="text-sm text-muted-foreground">
            Checking this browser for a saved account…
          </p>
        }
      >
        <AuthForm mode="register" />
      </Suspense>
    </div>
  )
}
