"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Store01Icon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  ArrowRight01Icon,
  Edit02Icon,
  File01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { useAuth } from "@workspace/ui/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"

export function BusinessOverviewPage() {
  const { user } = useAuth()
  const [settings, setSettings] = React.useState({
    businessName: "Zerixa Technologies",
    supportEmail: "support@zerixa.co.tz",
    website: "https://zerixa.co.tz",
    currency: "TZS",
    industry: "Cybersecurity",
  })

  React.useEffect(() => {
    let cancelled = false
    async function loadSettings() {
      try {
        const res = await api.get<{
          businessName?: string
          supportEmail?: string
          currency?: string
        }>("/settings")
        if (!cancelled && res.success && res.data) {
          setSettings((prev) => ({
            ...prev,
            businessName: res.data?.businessName || user?.businessName || prev.businessName,
            supportEmail: res.data?.supportEmail || prev.supportEmail,
            currency: res.data?.currency || prev.currency,
          }))
        }
      } catch {
        // silent
      }
    }
    loadSettings()
    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-3xl w-full">
      {/* Top Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-foreground">Business Overview</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Overview of your verified business profile, legal status, and compliance documentation.
        </p>
      </div>

      {/* 1. Business Verification Status Card */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Verification Status</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-0 divide-y divide-border/60 text-sm">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">KYC & Business Status</span>
              <Badge variant="outline" className="text-xs font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
                Verified
              </Badge>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Business Type</span>
              <Badge variant="outline" className="text-xs font-normal bg-muted/40 text-foreground border-border/60">
                Sole Proprietor
              </Badge>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Verified At</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">4 March 2026</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Business Summary Card */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted-foreground">Business Information</h2>
          <a href="/dashboard/settings/business/information">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 cursor-pointer">
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
              <span>Edit Details</span>
            </Button>
          </a>
        </div>

        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-0 divide-y divide-border/60 text-sm">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Business Name</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">{settings.businessName}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Industry</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">{settings.industry}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Support Email</span>
              <span className="text-foreground font-mono font-medium text-xs sm:text-sm">{settings.supportEmail}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Website</span>
              <a
                href={settings.website}
                target="_blank"
                rel="noreferrer"
                className="text-foreground font-medium text-xs sm:text-sm hover:underline"
              >
                {settings.website}
              </a>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Settlement Currency</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">{settings.currency}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Verification Documents Quick Link */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Compliance Documentation</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none bg-muted/20">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-foreground">Verification Documents</span>
                <span className="text-[11px] text-muted-foreground">BRELA certificate, TRA TIN certificate & business license</span>
              </div>
            </div>
            <a href="/dashboard/settings/business/documents">
              <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs cursor-pointer">
                <span>View Documents</span>
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
