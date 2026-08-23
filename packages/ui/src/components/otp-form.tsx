"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "@workspace/ui/components/toast"

export function OtpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [code, setCode] = React.useState(["", "", "", "", "", ""])
  const [loading, setLoading] = React.useState(false)
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

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
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    toast.add({ type: "success", title: "Email verified!", description: "Your email has been verified successfully." })
  }

  function handleResend() {
    toast.add({ type: "info", title: "Code resent!", description: "A new verification code has been sent to your email." })
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
          Verify your email
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Enter the 6-digit code sent to your email
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
            <span className="flex items-center justify-center gap-1.5">
              <span className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-current" />
            </span>
          ) : (
            "Verify code"
          )}
        </button>
      </form>

      {/* Resend */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Didn&apos;t get the code?{" "}
        <button type="button" onClick={handleResend} className="font-semibold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">
          Resend code
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
