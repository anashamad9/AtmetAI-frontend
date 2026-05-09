"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SignInErrors = {
  email?: string
  password?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [errors, setErrors] = useState<SignInErrors>({})
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => {
      setToast((previous) => (previous === message ? null : previous))
    }, 2800)
  }

  const validate = (): SignInErrors => {
    const nextErrors: SignInErrors = {}

    if (!email.trim()) {
      nextErrors.email = "Email is required"
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      nextErrors.password = "Password is required"
    }

    return nextErrors
  }

  const handleResendVerification = async () => {
    if (isResendingVerification) return

    setIsResendingVerification(true)

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      if (!response.ok) {
        showToast("Something went wrong. Please try again.")
        return
      }

      showToast("Verification email sent")
    } catch {
      showToast("Something went wrong. Please try again.")
    } finally {
      setIsResendingVerification(false)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const payload = (await response.json()) as {
        success?: boolean
        error?: string
        token?: string
        user?: {
          id: string
          name: string
          email: string
          role: string
        }
      }

      if (!response.ok) {
        if (payload.error === "invalid_credentials") {
          setErrors({ password: "Incorrect email or password" })
          return
        }

        if (payload.error === "unverified_email") {
          setErrors({
            email: "Please verify your email first.",
          })
          return
        }

        showToast("Something went wrong. Please try again.")
        return
      }

      if (!payload.success || !payload.token || !payload.user) {
        showToast("Something went wrong. Please try again.")
        return
      }

      localStorage.setItem("atmet_token", payload.token)
      localStorage.setItem("atmet_user", JSON.stringify(payload.user))
      router.push("/onboarding")
    } catch {
      showToast("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div
        className="rounded-xl border border-border bg-background p-5 shadow-sm"
        style={{ borderWidth: "0.5px" }}
      >
        <h1 className="text-sm font-semibold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your workspace</p>

        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            void handleSubmit()
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="auth-signin-email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              id="auth-signin-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setErrors((previous) => ({ ...previous, email: undefined }))
              }}
              placeholder="amir@company.com"
              className="h-7"
              disabled={isSubmitting}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">
                {errors.email}{" "}
                {errors.email.startsWith("Please verify your email first") ? (
                  <button
                    type="button"
                    onClick={() => {
                      void handleResendVerification()
                    }}
                    className="underline"
                    disabled={isResendingVerification || isSubmitting}
                  >
                    Resend verification email?
                  </button>
                ) : null}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth-signin-password" className="text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="auth-signin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrors((previous) => ({ ...previous, password: undefined }))
                }}
                placeholder="Enter your password"
                className="h-7 pr-8"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-muted-foreground hover:underline">
                Forgot password?
              </Link>
            </div>
            {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
          </div>

          <Button
            type="submit"
            size="sm"
            className="mt-1 h-7 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Sign in
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {toast ? (
        <div className="fixed right-4 bottom-4 z-[120] rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground shadow-lg">
          {toast}
        </div>
      ) : null}
    </>
  )
}
