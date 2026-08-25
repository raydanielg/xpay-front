"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Logout01Icon,
  Cancel01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@workspace/ui/hooks/use-auth"

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [loggingOut, setLoggingOut] = React.useState(false)

  function handleConfirm() {
    setLoggingOut(true)
    logout()
  }

  function handleCancel() {
    router.back()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-rose-500/10">
            <HugeiconsIcon
              icon={Logout01Icon}
              strokeWidth={1.5}
              className="size-8 text-rose-500"
            />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-foreground">
            Log out of XPay?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You'll need to sign in again to access your dashboard. Any unsaved
            changes will be lost.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-rose-600 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
          >
            {loggingOut ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  strokeWidth={2}
                  className="size-4 animate-spin"
                />
                Logging out...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="size-4" />
                Yes, log me out
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted/50 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
