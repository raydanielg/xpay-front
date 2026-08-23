"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Download04Icon,
  FilterIcon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Clock01Icon,
  RefreshIcon,
  CreditCardIcon,
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/toast"

interface Transaction {
  id: string
  reference: string
  type: "MOBILE" | "CARD" | "BANK"
  customer: string
  phone: string
  amount: string
  rawAmount: number
  fee: string
  status: "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED"
  method: string
  date: string
}

const allTransactions: Transaction[] = [
  { id: "1", reference: "XP-8X92K1", type: "MOBILE", customer: "John Doe", phone: "+255712240240", amount: "TSh 45,000", rawAmount: 45000, fee: "TSh 900", status: "COMPLETED", method: "M-Pesa", date: "23 Aug 2026, 14:32" },
  { id: "2", reference: "XP-8X92K2", type: "MOBILE", customer: "Sarah Wilson", phone: "+255788896493", amount: "TSh 12,500", rawAmount: 12500, fee: "TSh 250", status: "COMPLETED", method: "Airtel Money", date: "23 Aug 2026, 13:15" },
  { id: "3", reference: "XP-8X92K3", type: "CARD", customer: "Michael Chen", phone: "+255702582488", amount: "TSh 125,000", rawAmount: 125000, fee: "TSh 2,500", status: "PENDING", method: "Visa", date: "23 Aug 2026, 12:48" },
  { id: "4", reference: "XP-8X92K4", type: "MOBILE", customer: "Emily Brown", phone: "+255613978254", amount: "TSh 8,000", rawAmount: 8000, fee: "TSh 160", status: "FAILED", method: "Tigo Pesa", date: "23 Aug 2026, 11:20" },
  { id: "5", reference: "XP-8X92K5", type: "BANK", customer: "David Kim", phone: "+255754123698", amount: "TSh 350,000", rawAmount: 350000, fee: "TSh 7,000", status: "COMPLETED", method: "CRDB Bank", date: "22 Aug 2026, 16:45" },
  { id: "6", reference: "XP-8X92K6", type: "MOBILE", customer: "Lisa Garcia", phone: "+255715998852", amount: "TSh 23,000", rawAmount: 23000, fee: "TSh 460", status: "COMPLETED", method: "Halopesa", date: "22 Aug 2026, 15:30" },
  { id: "7", reference: "XP-8X92K7", type: "CARD", customer: "Robert Lee", phone: "+255689002211", amount: "TSh 67,000", rawAmount: 67000, fee: "TSh 1,340", status: "REFUNDED", method: "Mastercard", date: "22 Aug 2026, 14:12" },
  { id: "8", reference: "XP-8X92K8", type: "MOBILE", customer: "Maria Santos", phone: "+255779456123", amount: "TSh 5,000", rawAmount: 5000, fee: "TSh 100", status: "COMPLETED", method: "M-Pesa", date: "22 Aug 2026, 10:05" },
  { id: "9", reference: "XP-8X92K9", type: "BANK", customer: "James Taylor", phone: "+255733884455", amount: "TSh 180,000", rawAmount: 180000, fee: "TSh 3,600", status: "PENDING", method: "NMB Bank", date: "21 Aug 2026, 17:50" },
  { id: "10", reference: "XP-8X92KA", type: "MOBILE", customer: "Patricia Moore", phone: "+255691223344", amount: "TSh 15,000", rawAmount: 15000, fee: "TSh 300", status: "COMPLETED", method: "Airtel Money", date: "21 Aug 2026, 09:15" },
]

const statusFilters = ["ALL", "COMPLETED", "PENDING", "FAILED", "REFUNDED"] as const

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const config = {
    COMPLETED: { icon: CheckmarkCircle01Icon, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    PENDING: { icon: Clock01Icon, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    FAILED: { icon: CancelCircleIcon, className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
    REFUNDED: { icon: RefreshIcon, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  }
  const { icon, className } = config[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider ${className}`}>
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3" />
      {status}
    </span>
  )
}

function TypeBadge({ type }: { type: Transaction["type"] }) {
  const colors = {
    MOBILE: "text-green-600 dark:text-green-400 border-green-500/20 bg-green-500/5",
    CARD: "text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/5",
    BANK: "text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/5",
  }
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider ${colors[type]}`}>
      {type}
    </span>
  )
}

export function PaymentsPage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [selected, setSelected] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const filtered = allTransactions.filter((tx) => {
    const matchesSearch =
      tx.reference.toLowerCase().includes(search.toLowerCase()) ||
      tx.customer.toLowerCase().includes(search.toLowerCase()) ||
      tx.phone.includes(search)
    const matchesStatus = statusFilter === "ALL" || tx.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const allSelected = selected.length === filtered.length && filtered.length > 0
  const someSelected = selected.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) setSelected([])
    else setSelected(filtered.map((t) => t.id))
  }

  function toggleOne(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function copyRef(ref: string) {
    navigator.clipboard.writeText(ref)
    toast.add({ type: "success", title: "Copied", description: `${ref} copied to clipboard.` })
  }

  function exportCSV() {
    toast.add({ type: "loading", title: "Exporting transactions..." })
    setTimeout(() => {
      toast.add({ type: "success", title: "Export complete", description: "CSV file downloaded successfully." })
    }, 1200)
  }

  const totalRevenue = allTransactions.filter((t) => t.status === "COMPLETED").reduce((sum, t) => sum + t.rawAmount, 0)
  const totalFees = allTransactions.filter((t) => t.status === "COMPLETED").reduce((sum, t) => sum + Math.round(t.rawAmount * 0.02), 0)
  const successCount = allTransactions.filter((t) => t.status === "COMPLETED").length
  const pendingCount = allTransactions.filter((t) => t.status === "PENDING").length
  const failedCount = allTransactions.filter((t) => t.status === "FAILED").length

  const stats = [
    { label: "Total Revenue", value: `TSh ${totalRevenue.toLocaleString()}`, icon: ArrowUpRight01Icon, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Fees Collected", value: `TSh ${totalFees.toLocaleString()}`, icon: CreditCardIcon, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
    { label: "Successful", value: successCount, icon: CheckmarkCircle01Icon, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Pending", value: pendingCount, icon: Clock01Icon, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    { label: "Failed", value: failedCount, icon: CancelCircleIcon, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" },
  ]

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">All transactions across your account</p>
        </div>
        <Button
          onClick={exportCSV}
          className="h-9 gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
        >
          <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-muted/30 p-4">
                <div className="mb-2 size-8 animate-pulse rounded-lg bg-muted" />
                <div className="mb-2 h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
              </div>
            ))
          : stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-muted/30 p-4">
                <div className={`mb-2 flex size-8 items-center justify-center rounded-lg ${stat.bg}`}>
                  <HugeiconsIcon icon={stat.icon} strokeWidth={2} className={`size-4 ${stat.color}`} />
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{stat.value}</p>
              </div>
            ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by reference, customer, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-muted/30 p-1">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {filter !== "ALL" && <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-3" />}
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-muted/20">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/40 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3">
                <Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleAll} aria-label="Select all" />
              </th>
              <th className="px-4 py-3">REFERENCE</th>
              <th className="px-4 py-3">TYPE</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">METHOD</th>
              <th className="px-4 py-3">AMOUNT</th>
              <th className="px-4 py-3">FEE</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3.5"><div className="size-4 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 w-14 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-16 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-16 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-28 animate-pulse rounded bg-muted" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No transactions found</p>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isSelected = selected.includes(tx.id)
                return (
                  <tr key={tx.id} className={`group transition-colors hover:bg-muted/40 ${isSelected ? "bg-muted/50" : ""}`}>
                    <td className="px-4 py-3.5">
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleOne(tx.id)} aria-label={`Select ${tx.reference}`} />
                    </td>
                    <td className="px-4 py-3.5 font-mono font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span>{tx.reference}</span>
                        <button onClick={() => copyRef(tx.reference)} className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary cursor-pointer" title="Copy reference">
                          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><TypeBadge type={tx.type} /></td>
                    <td className="px-4 py-3.5 font-medium text-foreground">{tx.customer}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{tx.method}</td>
                    <td className="px-4 py-3.5 font-semibold tabular-nums text-foreground">{tx.amount}</td>
                    <td className="px-4 py-3.5 tabular-nums text-muted-foreground">{tx.fee}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={tx.status} /></td>
                    <td className="px-4 py-3.5 text-muted-foreground">{tx.date}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {allTransactions.length} transactions</span>
          {selected.length > 0 && (
            <span className="font-medium text-foreground">{selected.length} selected</span>
          )}
        </div>
      )}
    </div>
  )
}
