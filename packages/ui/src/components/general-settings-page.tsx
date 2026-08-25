"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings02Icon,
  CheckmarkCircle01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"

export function GeneralSettingsPage() {
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [currency, setCurrency] = React.useState("TZS")
  const [language, setLanguage] = React.useState("en")
  const [notifications, setNotifications] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    async function loadSettings() {
      try {
        const res = await api.get<{ currency?: string; notifications?: boolean }>("/settings")
        if (!cancelled && res.success && res.data) {
          if (res.data.currency) setCurrency(res.data.currency)
          if (res.data.notifications !== undefined) setNotifications(res.data.notifications)
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadSettings()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.patch("/settings", {
        currency,
        notifications,
      })
      if (res.success) {
        toast.add({
          type: "success",
          title: "Preferences Saved",
          description: "Your general preferences have been updated.",
        })
      } else {
        toast.add({
          type: "error",
          title: "Save Failed",
          description: res.message || "Could not save preferences.",
        })
      }
    } catch {
      toast.add({ type: "error", title: "Network error" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-2xl w-full">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-foreground">General Preferences</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Configure language, default reporting currency, and system notification preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <Card className="rounded-xl border border-border/70 shadow-none">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Default Display Currency</label>
              <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TZS">TZS (Tanzanian Shilling)</SelectItem>
                  <SelectItem value="USD">USD (United States Dollar)</SelectItem>
                  <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                  <SelectItem value="UGX">UGX (Ugandan Shilling)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Platform Language</label>
              <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US/UK)</SelectItem>
                  <SelectItem value="sw">Kiswahili</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-foreground">Payment & Payout Alerts</span>
                <span className="text-[11px] text-muted-foreground">
                  Receive SMS & Email notifications on successful payouts.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="size-4 rounded accent-primary cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving} className="gap-2 h-10 px-6 cursor-pointer">
            {saving ? (
              <>
                <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
