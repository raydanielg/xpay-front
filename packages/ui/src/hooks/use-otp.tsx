"use client"

import * as React from "react"

type PendingOtpData = {
  email: string
  otp?: string
  purpose: "signup" | "forgot-password"
  resetToken?: string
}

const STORAGE_KEY = "xpay_pending_otp"

const OtpContext = React.createContext<{
  pendingOtp: PendingOtpData | null
  setPendingOtp: (data: PendingOtpData | null) => void
} | null>(null)

export function OtpProvider({ children }: { children: React.ReactNode }) {
  const [pendingOtp, setPendingOtpState] = React.useState<PendingOtpData | null>(null)

  // Load from sessionStorage on mount (survives page reloads)
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as PendingOtpData
        setPendingOtpState(parsed)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const setPendingOtp = React.useCallback((data: PendingOtpData | null) => {
    setPendingOtpState(data)
    try {
      if (data) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const value = React.useMemo(
    () => ({ pendingOtp, setPendingOtp }),
    [pendingOtp, setPendingOtp]
  )

  return <OtpContext.Provider value={value}>{children}</OtpContext.Provider>
}

export function useOtp() {
  const ctx = React.useContext(OtpContext)
  if (!ctx) {
    throw new Error("useOtp must be used within OtpProvider")
  }
  return ctx
}
