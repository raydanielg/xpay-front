"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InformationCircleIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { useAuth } from "@workspace/ui/hooks/use-auth"

export function VerificationOverviewPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-3xl w-full">
      {/* Top Header & Notice */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          See an overview of your identity and business verification status, and track what needs to
          be completed before your account is fully activated.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-3.5" />
          <span>Watch: which documents you need to get verified</span>
        </a>
      </div>

      {/* 1. Identity Verification */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Identity Verification</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-0 divide-y divide-border/60 text-sm">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Status</span>
              <Badge variant="outline" className="text-xs font-medium bg-muted/60 text-muted-foreground border-border/80 uppercase">
                {user?.isVerified ? "Verified" : "Draft"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <a href="/dashboard/settings/identity">
          <Button
            variant="outline"
            className="w-full justify-center gap-1.5 h-10 rounded-xl border border-border/70 text-xs font-medium hover:bg-muted/40 cursor-pointer"
          >
            <span>Continue identity verification</span>
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
          </Button>
        </a>
      </div>

      {/* 2. Business Verification */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Business Verification</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-0 divide-y divide-border/60 text-sm">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Status</span>
              <Badge variant="outline" className="text-xs font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase">
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

      {/* 3. Business Information */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Business Information</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-0 divide-y divide-border/60 text-sm">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Business Name</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">
                {user?.businessName || "Zerixa Technologies"}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Industry</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">Cybersecurity</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Website</span>
              <a
                href="https://zerixa.co.tz"
                target="_blank"
                rel="noreferrer"
                className="text-foreground font-medium text-xs sm:text-sm hover:underline"
              >
                https://zerixa.co.tz
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Transaction Limits */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Transaction Limits</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-0 divide-y divide-border/60 text-sm">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Collection Range</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">500 – 1,000,000 TZS</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Daily Collection Limit</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">3,000,000 TZS</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Payout Range</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">5,000 – 1,000,000 TZS</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Daily Payout Limit</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">3,000,000 TZS</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
