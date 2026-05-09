"use client"

import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div
      className="rounded-xl border border-border bg-background p-5 shadow-sm"
      style={{ borderWidth: "0.5px" }}
    >
      <h1 className="text-sm font-semibold text-foreground">Forgot password</h1>
      <p className="mt-1 text-sm text-muted-foreground">Coming soon</p>
      <Link href="/sign-in" className="mt-4 inline-flex text-sm text-primary hover:underline">
        Back to sign in
      </Link>
    </div>
  )
}
