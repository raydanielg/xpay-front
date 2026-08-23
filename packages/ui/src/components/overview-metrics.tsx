"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ViewIcon,
  ViewOffSlashIcon,
  Copy01Icon,
  LockKeyIcon,
  ArrowUpRight01Icon,
  Folder01Icon,
  ArrowDownRight01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { toast } from "@workspace/ui/components/toast"

export function OverviewMetrics() {
  const [showBalance, setShowBalance] = React.useState(true)

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    toast.add({
      type: "success",
      title: "Copied",
      description: `${label} copied to clipboard.`,
    })
  }

  return (
    <div className="space-y-4 px-4 pt-2 lg:px-6">
      {/* Overview Title + Visibility Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Overview</h2>
        <button
          type="button"
          onClick={() => setShowBalance(!showBalance)}
          className="flex size-8 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          aria-label={showBalance ? "Hide balance" : "Show balance"}
          title={showBalance ? "Hide balance" : "Show balance"}
        >
          <HugeiconsIcon
            icon={showBalance ? ViewIcon : ViewOffSlashIcon}
            strokeWidth={2}
            className="size-4"
          />
        </button>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Available Balance */}
        <div className="group relative rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Available Balance</span>
            <button
              type="button"
              onClick={() => copyToClipboard("2585", "Available Balance")}
              className="opacity-60 transition-opacity hover:opacity-100 cursor-pointer"
              title="Copy balance"
            >
              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
            </button>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {showBalance ? "TSh 2,585" : "••••••••"}
          </div>
        </div>

        {/* Total Balance */}
        <div className="group relative rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Balance</span>
            <button
              type="button"
              onClick={() => copyToClipboard("2585", "Total Balance")}
              className="opacity-60 transition-opacity hover:opacity-100 cursor-pointer"
              title="Copy balance"
            >
              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
            </button>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {showBalance ? "TSh 2,585" : "••••••••"}
          </div>
        </div>

        {/* Payments This Week */}
        <div className="group relative rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Payments This Week</span>
            <HugeiconsIcon icon={LockKeyIcon} strokeWidth={2} className="size-3.5 opacity-50" />
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {showBalance ? "TSh 0" : "••••••••"}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
            <HugeiconsIcon icon={ArrowDownRight01Icon} strokeWidth={2} className="size-3" />
            <span>0.0% vs last week</span>
          </div>
        </div>

        {/* Transactions */}
        <div className="group relative rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Transactions</span>
            <HugeiconsIcon icon={LockKeyIcon} strokeWidth={2} className="size-3.5 opacity-50" />
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {showBalance ? "0" : "••"}
          </div>
          <div className="mt-1 text-[0.6875rem] text-muted-foreground">
            this week
          </div>
        </div>
      </div>

      {/* Feature Action Cards (Payment Pages & Content Delivery) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Payment Pages */}
        <div
          onClick={() =>
            toast.add({
              type: "info",
              title: "Payment Pages",
              description: "Opening payment pages manager...",
            })
          }
          className="group relative flex cursor-pointer items-start justify-between rounded-xl bg-muted/30 p-4 transition-all hover:bg-muted/50"
        >
          <div className="space-y-1">
            <Badge variant="outline" className="text-[0.625rem] font-semibold tracking-wider text-muted-foreground uppercase">
              SELL
            </Badge>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Payment Pages
            </h3>
            <p className="text-xs text-muted-foreground">
              Create pages to sell products & services
            </p>
          </div>
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
          />
        </div>

        {/* Content Delivery */}
        <div
          onClick={() =>
            toast.add({
              type: "info",
              title: "Content Delivery",
              description: "Opening content delivery manager...",
            })
          }
          className="group relative flex cursor-pointer items-start justify-between rounded-xl bg-muted/30 p-4 transition-all hover:bg-muted/50"
        >
          <div className="space-y-1">
            <Badge variant="outline" className="text-[0.625rem] font-semibold tracking-wider text-muted-foreground uppercase">
              DELIVER
            </Badge>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Content Delivery
            </h3>
            <p className="text-xs text-muted-foreground">
              Track digital product fulfillment
            </p>
          </div>
          <HugeiconsIcon
            icon={Folder01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
          />
        </div>
      </div>
    </div>
  )
}
