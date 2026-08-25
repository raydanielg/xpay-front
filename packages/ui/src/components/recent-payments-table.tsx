"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  ArrowRight01Icon,
  HelpCircleIcon,
  Message01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"

interface ApiPayment {
  id: string
  reference: string
  amount: number
  currency: string
  status: string
  method: string
  customerEmail: string | null
  customerName: string | null
  customerPhone: string | null
  type: string
  createdAt: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

function formatCurrency(amount: number, currency = "TSh") {
  return `${currency} ${amount.toLocaleString()}`
}

function shortRef(ref: string) {
  if (!ref) return "—"
  return ref.length > 10 ? ref.slice(0, 8) + "..." : ref
}

export function RecentPaymentsTable() {
  const [selected, setSelected] = React.useState<string[]>([])
  const [payments, setPayments] = React.useState<ApiPayment[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    async function fetchPayments() {
      try {
        const res = await api.get<ApiPayment[]>("/payments?page=1&limit=5")
        if (!cancelled && res.success && res.data) {
          setPayments(Array.isArray(res.data) ? res.data : [])
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchPayments()
    return () => { cancelled = true }
  }, [])

  const allSelected = payments.length > 0 && selected.length === payments.length
  const someSelected = selected.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) {
      setSelected([])
    } else {
      setSelected(payments.map((p) => p.id))
    }
  }

  function toggleOne(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  function copyReference(ref: string) {
    navigator.clipboard.writeText(ref)
    toast.add({
      type: "success",
      title: "Copied Reference",
      description: `${ref} copied to clipboard.`,
    })
  }

  function statusBadge(status: string) {
    const upper = status.toUpperCase()
    if (upper === "COMPLETED" || upper === "COMPLETED") {
      return <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">{upper}</span>
    }
    if (upper === "FAILED") {
      return <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-rose-600 dark:text-rose-400 border border-rose-500/20">{upper}</span>
    }
    if (upper === "PENDING") {
      return <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-amber-600 dark:text-amber-400 border border-amber-500/20">{upper}</span>
    }
    return <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-muted-foreground border">{upper}</span>
  }

  return (
    <div className="relative space-y-4 px-4 pb-20 pt-2 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Recent Payments</h2>
        <a
          href="/dashboard/payments"
          className="inline-flex h-8 items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium text-xs px-3 rounded-lg cursor-pointer"
        >
          <span>View all</span>
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />
        </a>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl bg-muted/20">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="border-b bg-muted/40 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3">REFERENCE</th>
              <th className="px-4 py-3">TYPE</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">PHONE</th>
              <th className="px-4 py-3">AMOUNT</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">DATE</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y text-xs">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3.5"><div className="size-4 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 w-14 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-28 animate-pulse rounded bg-muted" /></td>
                </tr>
              ))
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50">
                      <HugeiconsIcon icon={CreditCardIcon} strokeWidth={1.5} className="size-7 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">No payments yet</p>
                      <p className="text-xs text-muted-foreground">Payments will appear here once customers start paying.</p>
                    </div>
                    <a
                      href="/dashboard/payment-links"
                      className="mt-1 inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <span>Create Payment Link</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />
                    </a>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const isSelected = selected.includes(payment.id)
                const customerName = payment.customerName || payment.customerEmail || "Guest"
                return (
                  <tr
                    key={payment.id}
                    className={`group transition-colors hover:bg-muted/40 ${
                      isSelected ? "bg-muted/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(payment.id)}
                        aria-label={`Select ${payment.reference}`}
                      />
                    </td>

                    {/* Reference */}
                    <td className="px-4 py-3.5 font-mono text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <span>{shortRef(payment.reference)}</span>
                        <button
                          type="button"
                          onClick={() => copyReference(payment.reference)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary cursor-pointer"
                          title="Copy full reference"
                        >
                          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                        </button>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <Badge variant="outline" className="text-[0.625rem] font-medium tracking-wider text-muted-foreground">
                        {payment.method || payment.type || "MOBILE"}
                      </Badge>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5 text-foreground font-medium">
                      {customerName}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 text-muted-foreground font-mono">
                      {payment.customerPhone || "—"}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 font-semibold text-foreground">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {statusBadge(payment.status)}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Help Widget in bottom right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() =>
            toast.add({
              type: "info",
              title: "Customer Support",
              description: "Live chat assistant is ready. How can we help you today?",
            })
          }
          className="group flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-white shadow-lg transition-all hover:bg-emerald-700 hover:scale-105 active:scale-95 cursor-pointer dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-white/20">
            <HugeiconsIcon icon={Message01Icon} strokeWidth={2} className="size-3.5" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-semibold">Need Help?</div>
            <div className="text-[0.625rem] text-emerald-100">Ask me</div>
          </div>
        </button>
      </div>
    </div>
  )
}
