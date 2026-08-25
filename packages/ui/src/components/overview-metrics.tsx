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
import { api } from "@workspace/ui/lib/api"
import { useAuth } from "@workspace/ui/hooks/use-auth"

type AnalyticsData = {
  payments: {
    total: number
    completed: number
    pending: number
    failed: number
    totalAmount: number
  }
  payouts: {
    total: number
    completed: number
    totalAmount: number
  }
  links: {
    activePaymentLinks: number
    activePaymentPages: number
  }
  recentPayments: Array<{
    id: string
    amount: number
    currency: string
    status: string
    method: string
    customerEmail: string | null
    customerName: string | null
    createdAt: string
  }>
  dailyBreakdown: Array<{ date: string; amount: number }>
}

function formatCurrency(amount: number, currency = "TSh") {
  return `${currency} ${amount.toLocaleString()}`
}

export function OverviewMetrics() {
  const { user } = useAuth()
  const [showBalance, setShowBalance] = React.useState(false)
  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)

  const firstName = user?.firstName || "there"
  const greeting = `Welcome back, ${firstName}`

  React.useEffect(() => {
    let cancelled = false
    async function fetchAnalytics() {
      try {
        const res = await api.get<AnalyticsData>("/analytics")
        if (!cancelled && res.success && res.data) {
          setData(res.data)
        }
      } catch {
        // silent fail — dashboard shows zeros
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAnalytics()
    return () => { cancelled = true }
  }, [])

  const availableBalance = data ? data.payments.totalAmount - data.payouts.totalAmount : 0
  const totalBalance = data ? data.payments.totalAmount : 0
  const paymentsThisWeek = data ? data.payments.totalAmount : 0
  const transactionCount = data ? data.payments.total : 0

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
      {/* Welcome Title + Visibility Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{greeting}</h2>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your payments, track transactions, and grow your business — all in one place. Enjoy using XPay today.
          </p>
        </div>
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
              onClick={() => copyToClipboard(String(availableBalance), "Available Balance")}
              className="opacity-60 transition-opacity hover:opacity-100 cursor-pointer"
              title="Copy balance"
            >
              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
            </button>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {loading ? (
              <div className="h-7 w-28 animate-pulse rounded bg-muted" />
            ) : showBalance ? (
              formatCurrency(availableBalance)
            ) : (
              "••••••••"
            )}
          </div>
        </div>

        {/* Total Balance */}
        <div className="group relative rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Balance</span>
            <button
              type="button"
              onClick={() => copyToClipboard(String(totalBalance), "Total Balance")}
              className="opacity-60 transition-opacity hover:opacity-100 cursor-pointer"
              title="Copy balance"
            >
              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
            </button>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {loading ? (
              <div className="h-7 w-28 animate-pulse rounded bg-muted" />
            ) : showBalance ? (
              formatCurrency(totalBalance)
            ) : (
              "••••••••"
            )}
          </div>
        </div>

        {/* Payments This Week */}
        <div className="group relative rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Payments</span>
            <HugeiconsIcon icon={LockKeyIcon} strokeWidth={2} className="size-3.5 opacity-50" />
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {loading ? (
              <div className="h-7 w-28 animate-pulse rounded bg-muted" />
            ) : showBalance ? (
              formatCurrency(paymentsThisWeek)
            ) : (
              "••••••••"
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
            <HugeiconsIcon icon={ArrowDownRight01Icon} strokeWidth={2} className="size-3" />
            <span>{data ? data.payments.completed : 0} completed</span>
          </div>
        </div>

        {/* Transactions */}
        <div className="group relative rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Transactions</span>
            <HugeiconsIcon icon={LockKeyIcon} strokeWidth={2} className="size-3.5 opacity-50" />
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {loading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-muted" />
            ) : showBalance ? (
              String(transactionCount)
            ) : (
              "••"
            )}
          </div>
          <div className="mt-1 text-[0.6875rem] text-muted-foreground">
            {data ? `${data.payments.pending} pending` : "—"}
          </div>
        </div>
      </div>

      {/* Feature Action Cards (Payment Pages & Content Delivery) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Payment Pages */}
        <a
          href="/dashboard/payment-pages"
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
              {data ? `${data.links.activePaymentPages} active pages` : "Create pages to sell products & services"}
            </p>
          </div>
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
          />
        </a>

        {/* Payment Links */}
        <a
          href="/dashboard/payment-links"
          className="group relative flex cursor-pointer items-start justify-between rounded-xl bg-muted/30 p-4 transition-all hover:bg-muted/50"
        >
          <div className="space-y-1">
            <Badge variant="outline" className="text-[0.625rem] font-semibold tracking-wider text-muted-foreground uppercase">
              DELIVER
            </Badge>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Payment Links
            </h3>
            <p className="text-xs text-muted-foreground">
              {data ? `${data.links.activePaymentLinks} active links` : "Create payment links for customers"}
            </p>
          </div>
          <HugeiconsIcon
            icon={Folder01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
          />
        </a>
      </div>
    </div>
  )
}
