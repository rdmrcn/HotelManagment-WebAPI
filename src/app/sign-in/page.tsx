import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"
import { firstParam, safeNext } from "@/lib/search"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to see bookings saved for Aurelia in this browser.",
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const params = await searchParams
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <AuthForm mode="sign-in" nextPath={safeNext(firstParam(params.next))} />
    </div>
  )
}
