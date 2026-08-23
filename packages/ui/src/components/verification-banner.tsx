"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  FingerPrintIcon,
  SmartPhone01Icon,
  Store01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/toast"

export function VerificationBanner({
  userName = "Ezra Daniel",
  companyName = "XPay",
}: {
  userName?: string
  companyName?: string
}) {
  const [identityOpen, setIdentityOpen] = React.useState(true)
  const [businessOpen, setBusinessOpen] = React.useState(false)

  return (
    <div className="space-y-4 px-4 pt-4 lg:px-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Hello, {userName}. Welcome to {companyName}.
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          To keep your account secure and enable payments, we need to verify a few things. This helps protect your funds and unlocks the full {companyName} experience.{" "}
          <button
            type="button"
            onClick={() =>
              toast.add({
                type: "info",
                title: "Requirements",
                description: "You need a National ID (NIDA) or Passport and business TIN.",
              })
            }
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary transition-colors cursor-pointer"
          >
            See what you&apos;ll need.
          </button>
        </p>
      </div>

      {/* Verification Accordion Container */}
      <div className="space-y-2">
        {/* Identity Verification Accordion */}
        <div className="rounded-xl bg-muted/30 transition-all">
          {/* Accordion Header */}
          <button
            type="button"
            onClick={() => setIdentityOpen(!identityOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 rounded-xl cursor-pointer"
          >
            <span className="text-muted-foreground font-normal">Identity Verification</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>1/2</span>
              <HugeiconsIcon
                icon={identityOpen ? ArrowUp01Icon : ArrowDown01Icon}
                strokeWidth={2}
                className="size-3.5 transition-transform"
              />
            </div>
          </button>

          {/* Accordion Body */}
          {identityOpen && (
            <div className="divide-y border-t border-muted/60">
              {/* Item 1: Email & Phone */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Verify email & phone</h4>
                    <p className="text-xs text-muted-foreground">
                      Confirm your email address and phone number.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Completed</span>
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    strokeWidth={2}
                    className="size-4 fill-emerald-600/10 dark:fill-emerald-400/20"
                  />
                </div>
              </div>

              {/* Item 2: Identity ID */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={FingerPrintIcon} strokeWidth={2} className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Verify your identity</h4>
                    <p className="text-xs text-muted-foreground">
                      Submit your ID to start accepting payments and payouts.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.add({
                      type: "info",
                      title: "Identity Verification",
                      description: "Upload form opened. Please prepare your NIDA or Passport.",
                    })
                  }
                  className="self-end sm:self-auto h-7 px-3 text-xs font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Start
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Business Verification Accordion */}
        <div className="rounded-xl bg-muted/30 transition-all">
          {/* Accordion Header */}
          <button
            type="button"
            onClick={() => setBusinessOpen(!businessOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-normal text-muted-foreground">Business Verification</span>
              <HugeiconsIcon
                icon={CheckmarkCircle01Icon}
                strokeWidth={2}
                className="size-4 text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>4/4</span>
              <HugeiconsIcon
                icon={businessOpen ? ArrowUp01Icon : ArrowDown01Icon}
                strokeWidth={2}
                className="size-3.5 transition-transform"
              />
            </div>
          </button>

          {/* Accordion Body */}
          {businessOpen && (
            <div className="divide-y border-t border-muted/60">
              {/* Business Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Business name</h4>
                    <p className="text-xs text-muted-foreground">
                      Your registered business name has been verified.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Completed</span>
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    strokeWidth={2}
                    className="size-4 fill-emerald-600/10 dark:fill-emerald-400/20"
                  />
                </div>
              </div>

              {/* Business Address */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Business address</h4>
                    <p className="text-xs text-muted-foreground">
                      Your business physical address is confirmed.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Completed</span>
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    strokeWidth={2}
                    className="size-4 fill-emerald-600/10 dark:fill-emerald-400/20"
                  />
                </div>
              </div>

              {/* TIN Number */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">TIN number</h4>
                    <p className="text-xs text-muted-foreground">
                      Your Tax Identification Number has been verified.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Completed</span>
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    strokeWidth={2}
                    className="size-4 fill-emerald-600/10 dark:fill-emerald-400/20"
                  />
                </div>
              </div>

              {/* Business License */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Business license</h4>
                    <p className="text-xs text-muted-foreground">
                      Your business license has been verified.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Completed</span>
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    strokeWidth={2}
                    className="size-4 fill-emerald-600/10 dark:fill-emerald-400/20"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
