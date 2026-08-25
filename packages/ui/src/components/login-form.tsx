"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "@workspace/ui/components/toast"
import { useAuth } from "@workspace/ui/hooks/use-auth"
import { useOtp } from "@workspace/ui/hooks/use-otp"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const { setPendingOtp } = useOtp()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [trustDevice, setTrustDevice] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await login(email, password, trustDevice)

    setLoading(false)

    if (result.success) {
      if (result.requiresVerification) {
        // User needs to verify phone — set OTP context and redirect
        setPendingOtp({ email, otp: result.otp, purpose: "signup" })
        toast.add({
          type: "info",
          title: "Verification required",
          description: "A verification code has been sent to your phone via SMS. Please verify to continue.",
        })
        setTimeout(() => {
          window.location.href = "/verify-otp"
        }, 1200)
      } else {
        // Normal login success
        toast.add({
          type: "success",
          title: "Welcome back!",
          description: "You have been signed in successfully. A login alert has been sent to your phone.",
        })
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 800)
      }
    } else {
      toast.add({
        type: "error",
        title: "Sign in failed",
        description: result.message,
      })
    }
  }

  return (
    <div className={cn("w-full max-w-[380px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700", className)} {...props}>
      {/* Plain Logo */}
      <img
        src="/pay-per-click.png"
        alt="XPay"
        className="mb-6 size-12 rounded-lg object-cover animate-in zoom-in-50 duration-500"
      />

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Enter your email and password to sign in
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Email */}
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

        {/* Password */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Password
            </label>
            <a href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-colors focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200/50 dark:focus:ring-gray-700/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Trust device */}
        <div className="flex items-center gap-2">
          <input
            id="trust-device"
            type="checkbox"
            checked={trustDevice}
            onChange={(e) => setTrustDevice(e.target.checked)}
            className="size-4 rounded border-gray-300 dark:border-gray-700 text-gray-900 focus:ring-gray-500 cursor-pointer"
          />
          <label htmlFor="trust-device" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
            Trust this device
          </label>
        </div>

        {/* Sign in */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>

        {/* Divider */}
        <div className="relative my-2 flex items-center justify-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          <span className="absolute bg-gray-50 dark:bg-gray-950 px-3 text-xs text-gray-400">
            Or
          </span>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={() => toast.add({ type: "info", title: "Redirecting...", description: "Taking you to Google sign-in." })}
          className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
        >
          <svg className="size-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="font-semibold text-gray-900 dark:text-gray-100 hover:underline">
          Sign up
        </a>
      </div>
    </div>
  )
}
