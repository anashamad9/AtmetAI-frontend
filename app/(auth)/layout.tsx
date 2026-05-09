import Link from "next/link"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className="fixed inset-0 z-[90] flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        backgroundColor:
          "var(--color-background-tertiary, color-mix(in oklab, var(--color-sidebar-accent) 72%, var(--color-background)))",
      }}
    >
      <div className="w-full max-w-[400px]">
        <div className="mb-4 flex justify-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-foreground">
            Atmet
          </Link>
        </div>

        {children}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
