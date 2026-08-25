"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "@workspace/ui/components/toast"
import { useAuth } from "@workspace/ui/hooks/use-auth"
import { useOtp } from "@workspace/ui/hooks/use-otp"

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { changePassword, resetPassword } = useAuth()
  const { pendingOtp, setPendingOtp } = useOtp()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const isResetMode = pendingOtp?.purpose === "forgot-password" && pendingOtp?.resetToken

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      toast.add({ type: "warning", title: "Password too short", description: "Password must be at least 8 characters." })
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      toast.add({ type: "error", title: "Passwords don't match", description: "Please make sure both passwords are the same." })
      return
    }
    setError("")
    setLoading(true)

    let result
    if (isResetMode && pendingOtp?.resetToken) {
      result = await resetPassword(pendingOtp.resetToken, password)
    } else {
      result = await changePassword(password, password)
    }

    setLoading(false)

    if (result.success) {
      setPendingOtp(null)
      toast.add({
        type: "success",
        title: "Password reset!",
        description: "Your password has been reset successfully. A confirmation SMS has been sent to your phone. You can now sign in.",
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 800)
    } else {
      toast.add({ type: "error", title: "Failed", description: result.message })
    }
  }

  const strength = React.useMemo(() => {
    let score = 0
    if (password.length >= 8) score++
    if (password.match(/[A-Z]/)) score++
    if (password.match(/[0-9]/)) score++
    if (password.match(/[^a-zA-Z0-9]/)) score++
    return score
  }, [password])

  const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

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
          Set new password
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Enter your new password below
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* New Password */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              required
              minLength={8}
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
          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < strength ? strengthColors[strength] : "bg-gray-200 dark:bg-gray-800"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {strengthLabels[strength]}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full h-10 rounded-lg border bg-white dark:bg-gray-950 px-3.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-400 focus:ring-red-200/50 dark:focus:ring-red-700/50"
                  : "border-gray-200 dark:border-gray-800 focus:border-gray-400 focus:ring-gray-200/50 dark:focus:ring-gray-700/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
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
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Resetting...
            </span>
          ) : (
            "Reset password"
          )}
        </button>
      </form>

      {/* Back */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <a href="/" className="font-semibold text-gray-900 dark:text-gray-100 hover:underline flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to sign in
        </a>
      </div>
    </div>
  )
}
