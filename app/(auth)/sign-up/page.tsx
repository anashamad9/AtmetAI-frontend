"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SignUpErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

type PasswordStrength = {
  label: "Weak" | "Fair" | "Strong"
  widthClass: string
  barClass: string
  labelClass: string
}

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
])

function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) {
    return {
      label: "Weak",
      widthClass: "w-1/3",
      barClass: "bg-destructive",
      labelClass: "text-destructive",
    }
  }

  let typeCount = 0
  if (/[a-z]/.test(password)) typeCount += 1
  if (/[A-Z]/.test(password)) typeCount += 1
  if (/[0-9]/.test(password)) typeCount += 1
  if (/[^A-Za-z0-9]/.test(password)) typeCount += 1

  if (typeCount >= 2) {
    return {
      label: "Strong",
      widthClass: "w-full",
      barClass: "bg-emerald-500",
      labelClass: "text-emerald-600",
    }
  }

  return {
    label: "Fair",
    widthClass: "w-2/3",
    barClass: "bg-amber-500",
    labelClass: "text-amber-600",
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function extractDomain(email: string) {
  const [, domain = ""] = email.trim().toLowerCase().split("@")
  return domain
}

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [allowPersonalEmail, setAllowPersonalEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<SignUpErrors>({})
  const [emailTaken, setEmailTaken] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const passwordStrength = getPasswordStrength(password)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => {
      setToast((previous) => (previous === message ? null : previous))
    }, 2800)
  }

  const validate = (allowPersonal: boolean): SignUpErrors => {
    const nextErrors: SignUpErrors = {}

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = "Full name must be at least 2 characters"
    }

    if (!email.trim()) {
      nextErrors.email = "Work email is required"
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Please enter a valid email address"
    } else if (!allowPersonal && PERSONAL_EMAIL_DOMAINS.has(extractDomain(email))) {
      nextErrors.email = "Please use your work email"
    }

    if (!password) {
      nextErrors.password = "Password is required"
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters"
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password"
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords don't match"
    }

    return nextErrors
  }

  const submitSignUp = async (allowPersonalOverride = false) => {
    if (isSubmitting) return

    const effectiveAllowPersonal = allowPersonalEmail || allowPersonalOverride
    if (allowPersonalOverride) {
      setAllowPersonalEmail(true)
    }

    const validationErrors = validate(effectiveAllowPersonal)
    setEmailTaken(false)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const payload = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok) {
        if (payload.error === "email_taken") {
          setEmailTaken(true)
          setErrors((previous) => ({
            ...previous,
            email: "An account with this email already exists.",
          }))
          return
        }

        showToast("Something went wrong. Please try again.")
        return
      }

      if (!payload.success) {
        showToast("Something went wrong. Please try again.")
        return
      }

      sessionStorage.setItem("pendingVerification", email.trim().toLowerCase())
      router.push("/verify-email")
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
        <h1 className="text-sm font-semibold text-foreground">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start automating in minutes</p>

        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            void submitSignUp(false)
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="auth-full-name" className="text-muted-foreground">
              Full name
            </Label>
            <Input
              id="auth-full-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setErrors((previous) => ({ ...previous, name: undefined }))
              }}
              placeholder="Amir Haddad"
              className="h-7"
              disabled={isSubmitting}
            />
            {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth-email" className="text-muted-foreground">
              Work email
            </Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setEmailTaken(false)
                setErrors((previous) => ({ ...previous, email: undefined }))
              }}
              placeholder="amir@company.com"
              className="h-7"
              disabled={isSubmitting}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">
                {errors.email}{" "}
                {emailTaken ? (
                  <Link href="/sign-in" className="underline">
                    Sign in?
                  </Link>
                ) : null}
              </p>
            ) : null}
            {errors.email === "Please use your work email" ? (
              <button
                type="button"
                className="text-xs text-muted-foreground underline"
                onClick={() => {
                  void submitSignUp(true)
                }}
                disabled={isSubmitting}
              >
                Sign up with personal email instead
              </button>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth-password" className="text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrors((previous) => ({ ...previous, password: undefined }))
                }}
                placeholder="Create a password"
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
            <div className="space-y-1">
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full ${passwordStrength.widthClass} ${passwordStrength.barClass}`} />
              </div>
              <p className={`text-xs ${passwordStrength.labelClass}`}>
                {passwordStrength.label}
              </p>
            </div>
            {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth-confirm-password" className="text-muted-foreground">
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="auth-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  setErrors((previous) => ({ ...previous, confirmPassword: undefined }))
                }}
                onBlur={() => {
                  if (confirmPassword && confirmPassword !== password) {
                    setErrors((previous) => ({
                      ...previous,
                      confirmPassword: "Passwords don't match",
                    }))
                  }
                }}
                placeholder="Confirm your password"
                className="h-7 pr-8"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            size="sm"
            className="mt-1 h-7 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Create account
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground hover:underline">
              Sign in
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
