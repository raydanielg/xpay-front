"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "@workspace/ui/components/toast"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("")
  const [sent, setSent] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
    toast.add({ type: "success", title: "Reset code sent!", description: `We've sent a reset code to ${email}.` })
  }

  return (
    <div className={cn("w-full max-w-[380px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700", className)} {...props}>
      {/* Plain Logo */}
      <img
        src="/pay-per-click.png"
        alt="XPay"
        className="mb-6 size-12 rounded-lg object-cover animate-in zoom-in-50 duration-500"
      />

      {!sent ? (
        <>
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Forgot password?
            </h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              No worries, we&apos;ll send you reset instructions
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1.5 text-left">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-colors focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200/50 dark:focus:ring-gray-700/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="size-2 animate-bounce rounded-full bg-current" />
                </span>
              ) : (
                "Send reset code"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <a href="/" className="font-semibold text-gray-900 dark:text-gray-100 hover:underline flex items-center justify-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to sign in
            </a>
          </div>
        </>
      ) : (
        <>
          {/* Sent confirmation */}
          <div className="text-center mb-6 animate-in fade-in zoom-in-50 duration-500">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 animate-in bounce-in duration-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-green-600 dark:text-green-400">
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9 22 2Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Check your email
            </h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              We&apos;ve sent a reset code to{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>
            </p>
          </div>

          <a
            href="/verify-otp"
            className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer flex items-center justify-center active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            Enter code
          </a>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Didn&apos;t receive the email?{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
            >
              Try again
            </button>
          </div>
        </>
      )}
    </div>
  )
}
