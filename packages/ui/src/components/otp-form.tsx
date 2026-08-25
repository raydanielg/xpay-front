"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "@workspace/ui/components/toast"
import { useAuth } from "@workspace/ui/hooks/use-auth"
import { useOtp } from "@workspace/ui/hooks/use-otp"

export function OtpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { verifyOtp, forgotPassword } = useAuth()
  const { pendingOtp, setPendingOtp } = useOtp()
  const [code, setCode] = React.useState(["", "", "", "", "", ""])
  const [loading, setLoading] = React.useState(false)
  const [resending, setResending] = React.useState(false)
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

  const email = pendingOtp?.email || ""
  const purpose = pendingOtp?.purpose || "signup"

  React.useEffect(() => {
    if (pendingOtp?.otp && pendingOtp.otp.length === 6) {
      setCode(pendingOtp.otp.split(""))
    }
  }, [pendingOtp])

  function handleChange(index: number, value: string) {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\s/g, "").slice(0, 6)
    if (pasted.length === 6) {
      const newCode = pasted.split("")
      setCode(newCode)
      inputsRef.current[5]?.focus()
    }
  }

  const isComplete = code.every((c) => c !== "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isComplete) return
    if (!email) {
      toast.add({ type: "error", title: "Session expired", description: "Please start the verification process again from signup or login." })
      setTimeout(() => {
        window.location.href = "/"
      }, 1500)
      return
    }
    setLoading(true)

    const otpString = code.join("")
    const result = await verifyOtp(email, otpString)

    setLoading(false)

    if (result.success) {
      toast.add({ type: "success", title: "Verified!", description: result.message })

      if (result.resetToken) {
        // Forgot-password flow: pass resetToken to change-password page via OTP context
        setPendingOtp({ email, purpose: "forgot-password", resetToken: result.resetToken })
        setTimeout(() => {
          window.location.href = "/change-password"
        }, 800)
      } else {
        // Signup flow: go to dashboard
        setPendingOtp(null)
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 800)
      }
    } else {
      toast.add({ type: "error", title: "Verification failed", description: result.message })
    }
  }

  async function handleResend() {
    if (!email) {
      toast.add({ type: "error", title: "Session expired", description: "Please start the verification process again." })
      setTimeout(() => {
        window.location.href = "/"
      }, 1500)
      return
    }
    setResending(true)
    // Use forgotPassword for both flows — it generates a new OTP and sends via SMS
    const result = await forgotPassword(email)
    setResending(false)
    if (result.success) {
      toast.add({ type: "info", title: "Code resent!", description: "A new verification code has been sent to your phone via SMS." })
    } else {
      toast.add({ type: "error", title: "Resend failed", description: result.message })
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
          Verify your account
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Enter the 6-digit code sent to your phone
        </p>
      </div>

      {/* OTP Inputs */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputsRef.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="size-12 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-center text-lg font-semibold text-gray-900 dark:text-gray-100 transition-all focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200/50 dark:focus:ring-gray-700/50 animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!isComplete || loading}
          className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify code"
          )}
        </button>
      </form>

      {/* Resend */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Didn&apos;t get the code?{" "}
        <button type="button" onClick={handleResend} disabled={resending} className="font-semibold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5">
          {resending ? (
            <>
              <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Resending...
            </>
          ) : (
            "Resend code"
          )}
        </button>
      </div>

      {/* Back */}
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <a href="/forgot-password" className="font-semibold text-gray-900 dark:text-gray-100 hover:underline flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back
        </a>
      </div>
    </div>
  )
}
