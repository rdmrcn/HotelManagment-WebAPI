import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthForm } from "@/components/auth-form"
import { AuthSkeleton } from "@/components/skeletons"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to see bookings saved for Bosfor Hotels in this browser.",
}

export default function SignInPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-20">
      <Suspense fallback={<AuthSkeleton />}>
        <AuthForm mode="sign-in" />
      </Suspense>
    </div>
  )
}
