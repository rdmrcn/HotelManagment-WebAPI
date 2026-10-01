import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to see bookings saved for Bebek Yalı in this browser.",
}

export default function SignInPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <Suspense
        fallback={
          <p role="status" className="text-sm text-muted-foreground">
            Checking this browser for a saved account…
          </p>
        }
      >
        <AuthForm mode="sign-in" />
      </Suspense>
    </div>
  )
}
