import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"
import { firstParam, safeNext } from "@/lib/search"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a guest account for Aurelia. Your details stay in this browser.",
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const params = await searchParams
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <AuthForm mode="register" nextPath={safeNext(firstParam(params.next))} />
    </div>
  )
}
