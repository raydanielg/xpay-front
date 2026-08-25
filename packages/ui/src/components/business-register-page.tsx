"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreditCardIcon,
  MoneyBag01Icon,
  CodeIcon,
  ChartHistogramIcon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Building01Icon,
  File01Icon,
  IdentityCardIcon,
  Store01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"

export function BusinessRegisterPage() {
  return (
    <div className="flex flex-col gap-8 px-4 py-6 lg:px-6 max-w-4xl w-full">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit text-xs font-semibold bg-primary/10 text-primary border-primary/20">
          Merchant Onboarding
        </Badge>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Register your business on XPay to unlock payments, payouts, and API access.
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Complete your merchant profile to accept digital payments from mobile wallets and bank accounts in Tanzania.
        </p>
      </div>

      {/* What is a Business Card */}
      <Card className="rounded-2xl border border-border/80 bg-muted/20 shadow-none overflow-hidden">
        <CardContent className="p-5 sm:p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">What is an XPay Business?</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            An XPay Business is your verified merchant account. It links your personal identity to your business entity so you can legally accept payments, issue receipts, and manage funds in Tanzania.
          </p>
        </CardContent>
      </Card>

      {/* Section 1: What you unlock */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">What you unlock</h2>
          <p className="text-xs text-muted-foreground">Capabilities activated upon business verification.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* 1. Accept Payments */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-4 flex items-start gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Accept payments</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Collect M-Pesa, Airtel Money, and Tigo Pesa payments from your customers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Send Payouts */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-4 flex items-start gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <HugeiconsIcon icon={MoneyBag01Icon} strokeWidth={2} className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Send payouts</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Disburse funds to mobile wallets and bank accounts instantly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Developer API access */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-4 flex items-start gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                <HugeiconsIcon icon={CodeIcon} strokeWidth={2} className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Developer API access</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  API keys and webhooks are only available with business verification.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Higher transaction limits */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-4 flex items-start gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <HugeiconsIcon icon={ChartHistogramIcon} strokeWidth={2} className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Higher transaction limits</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Increase your daily collection and payout limits by verifying your business.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 2: How it works */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">How it works</h2>
          <p className="text-xs text-muted-foreground">Three simple steps to complete business verification.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Step 1 */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none bg-muted/10">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                1
              </div>
              <h3 className="text-sm font-semibold text-foreground">Add business information</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tell us about your business — name, address, industry, and type.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none bg-muted/10">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-semibold text-foreground">Upload verification documents</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submit the required documents for your business type (ID, licence, tax certificate).
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none bg-muted/10">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                3
              </div>
              <h3 className="text-sm font-semibold text-foreground">Request Verification</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our team reviews your submission, usually within a few hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 3: Supported business types */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Supported business types</h2>
          <p className="text-xs text-muted-foreground">Select the category that best matches your legal structure.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Sole Proprietor */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-4 text-primary" />
                <span>Sole Proprietor</span>
              </div>
              <Badge variant="outline" className="w-fit text-[11px] font-normal bg-muted/40 border-border/70">
                National ID + TIN
              </Badge>
            </CardContent>
          </Card>

          {/* Registered Company */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                <HugeiconsIcon icon={Building01Icon} strokeWidth={2} className="size-4 text-primary" />
                <span>Registered Company</span>
              </div>
              <Badge variant="outline" className="w-fit text-[11px] font-normal bg-muted/40 border-border/70">
                BRELA + Licence + TIN
              </Badge>
            </CardContent>
          </Card>

          {/* NGO / Non-Profit */}
          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                <HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-4 text-primary" />
                <span>NGO / Non-Profit</span>
              </div>
              <Badge variant="outline" className="w-fit text-[11px] font-normal bg-muted/40 border-border/70">
                Registration Doc
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-primary/20 bg-primary/5">
        <div className="flex flex-col gap-0.5 text-center sm:text-left">
          <span className="text-sm font-semibold text-foreground">Ready to get started?</span>
          <span className="text-xs text-muted-foreground">Fill in your business details to start accepting payments immediately.</span>
        </div>
        <a href="/dashboard/settings/business/information">
          <Button className="h-10 px-6 gap-2 text-xs font-medium cursor-pointer shadow-sm">
            <span>Register Business</span>
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
          </Button>
        </a>
      </div>
    </div>
  )
}
