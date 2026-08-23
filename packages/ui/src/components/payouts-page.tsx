"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Download04Icon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Clock01Icon,
  MoneyBag01Icon,
  BankIcon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Wallet01Icon,
  PlusSignCircleIcon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/toast"

interface Payout {
  id: string
  reference: string
  destination: string
  accountName: string
  accountNumber: string
  amount: string
  rawAmount: number
  fee: string
  status: "COMPLETED" | "PENDING" | "FAILED" | "PROCESSING"
  method: "BANK" | "MOBILE"
  date: string
}

const allPayouts: Payout[] = [
  { id: "1", reference: "PO-AX72M1", destination: "CRDB Bank", accountName: "Ezra Daniel", accountNumber: "0150-2255-8800", amount: "TSh 1,200,000", rawAmount: 1200000, fee: "TSh 5,000", status: "COMPLETED", method: "BANK", date: "23 Aug 2026, 09:00" },
  { id: "2", reference: "PO-AX72M2", destination: "M-Pesa", accountName: "Ezra Daniel", accountNumber: "+255712240240", amount: "TSh 450,000", rawAmount: 450000, fee: "TSh 2,500", status: "COMPLETED", method: "MOBILE", date: "22 Aug 2026, 16:30" },
  { id: "3", reference: "PO-AX72M3", destination: "NMB Bank", accountName: "Ezra Daniel", accountNumber: "0240-1198-3300", amount: "TSh 800,000", rawAmount: 800000, fee: "TSh 4,000", status: "PROCESSING", method: "BANK", date: "22 Aug 2026, 14:15" },
  { id: "4", reference: "PO-AX72M4", destination: "Airtel Money", accountName: "Ezra Daniel", accountNumber: "+255788896493", amount: "TSh 125,000", rawAmount: 125000, fee: "TSh 1,500", status: "PENDING", method: "MOBILE", date: "21 Aug 2026, 11:45" },
  { id: "5", reference: "PO-AX72M5", destination: "CRDB Bank", accountName: "Ezra Daniel", accountNumber: "0150-2255-8800", amount: "TSh 2,500,000", rawAmount: 2500000, fee: "TSh 8,000", status: "COMPLETED", method: "BANK", date: "20 Aug 2026, 10:00" },
  { id: "6", reference: "PO-AX72M6", destination: "Tigo Pesa", accountName: "Ezra Daniel", accountNumber: "+255702582488", amount: "TSh 75,000", rawAmount: 75000, fee: "TSh 1,000", status: "FAILED", method: "MOBILE", date: "19 Aug 2026, 15:20" },
  { id: "7", reference: "PO-AX72M7", destination: "NMB Bank", accountName: "Ezra Daniel", accountNumber: "0240-1198-3300", amount: "TSh 600,000", rawAmount: 600000, fee: "TSh 3,500", status: "COMPLETED", method: "BANK", date: "18 Aug 2026, 08:30" },
]

const statusFilters = ["ALL", "COMPLETED", "PROCESSING", "PENDING", "FAILED"] as const

function StatusBadge({ status }: { status: Payout["status"] }) {
  const config = {
    COMPLETED: { icon: CheckmarkCircle01Icon, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    PROCESSING: { icon: Clock01Icon, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    PENDING: { icon: Clock01Icon, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    FAILED: { icon: CancelCircleIcon, className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
  }
  const { icon, className } = config[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider ${className}`}>
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3" />
      {status}
    </span>
  )
}

export function PayoutsPage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [selected, setSelected] = React.useState<string[]>([])
  const [showRequestModal, setShowRequestModal] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const filtered = allPayouts.filter((p) => {
    const matchesSearch =
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase()) ||
      p.accountName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const allSelected = selected.length === filtered.length && filtered.length > 0
  const someSelected = selected.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) setSelected([])
    else setSelected(filtered.map((p) => p.id))
  }

  function toggleOne(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function copyRef(ref: string) {
    navigator.clipboard.writeText(ref)
    toast.add({ type: "success", title: "Copied", description: `${ref} copied to clipboard.` })
  }

  function exportCSV() {
    toast.add({ type: "loading", title: "Exporting payouts..." })
    setTimeout(() => {
      toast.add({ type: "success", title: "Export complete", description: "CSV file downloaded successfully." })
    }, 1200)
  }

  function requestPayout() {
    setShowRequestModal(false)
    toast.add({ type: "loading", title: "Processing payout request..." })
    setTimeout(() => {
      toast.add({ type: "success", title: "Payout requested", description: "Your payout is being processed." })
    }, 1500)
  }

  const totalPaidOut = allPayouts.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + p.rawAmount, 0)
  const totalFees = allPayouts.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + Math.round(p.rawAmount * 0.005), 0)
  const pendingAmount = allPayouts.filter((p) => p.status === "PENDING" || p.status === "PROCESSING").reduce((sum, p) => sum + p.rawAmount, 0)
  const completedCount = allPayouts.filter((p) => p.status === "COMPLETED").length

  const stats = [
    { label: "Total Paid Out", value: `TSh ${totalPaidOut.toLocaleString()}`, icon: ArrowUpRight01Icon, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Pending Amount", value: `TSh ${pendingAmount.toLocaleString()}`, icon: Clock01Icon, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    { label: "Total Fees", value: `TSh ${totalFees.toLocaleString()}`, icon: Wallet01Icon, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
    { label: "Completed", value: completedCount, icon: CheckmarkCircle01Icon, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  ]

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Payouts</h1>
          <p className="text-sm text-muted-foreground">Withdraw funds to your bank or mobile money account</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportCSV}
            variant="outline"
            className="h-9 gap-2 rounded-lg px-3 text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
            Export
          </Button>
          <Button
            onClick={() => setShowRequestModal(true)}
            className="h-9 gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={PlusSignCircleIcon} strokeWidth={2} className="size-3.5" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
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
            placeholder="Search by reference, destination, or account name..."
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
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
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
              <th className="px-4 py-3">DESTINATION</th>
              <th className="px-4 py-3">ACCOUNT NAME</th>
              <th className="px-4 py-3">ACCOUNT NO.</th>
              <th className="px-4 py-3">AMOUNT</th>
              <th className="px-4 py-3">FEE</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3.5"><div className="size-4 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-28 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-16 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-28 animate-pulse rounded bg-muted" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No payouts found</p>
                </td>
              </tr>
            ) : (
              filtered.map((payout) => {
                const isSelected = selected.includes(payout.id)
                return (
                  <tr key={payout.id} className={`group transition-colors hover:bg-muted/40 ${isSelected ? "bg-muted/50" : ""}`}>
                    <td className="px-4 py-3.5">
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleOne(payout.id)} aria-label={`Select ${payout.reference}`} />
                    </td>
                    <td className="px-4 py-3.5 font-mono font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span>{payout.reference}</span>
                        <button onClick={() => copyRef(payout.reference)} className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary cursor-pointer" title="Copy reference">
                          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-md bg-muted">
                          <HugeiconsIcon icon={payout.method === "BANK" ? BankIcon : MoneyBag01Icon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-foreground">{payout.destination}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-foreground">{payout.accountName}</td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">{payout.accountNumber}</td>
                    <td className="px-4 py-3.5 font-semibold tabular-nums text-foreground">{payout.amount}</td>
                    <td className="px-4 py-3.5 tabular-nums text-muted-foreground">{payout.fee}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={payout.status} /></td>
                    <td className="px-4 py-3.5 text-muted-foreground">{payout.date}</td>
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
          <span>Showing {filtered.length} of {allPayouts.length} payouts</span>
          {selected.length > 0 && (
            <span className="font-medium text-foreground">{selected.length} selected</span>
          )}
        </div>
      )}

      {/* Request Payout Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowRequestModal(false)}>
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Request Payout</h2>
              <p className="text-sm text-muted-foreground">Withdraw funds to your account</p>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); requestPayout() }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Destination</label>
                <select className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30" defaultValue="CRDB Bank">
                  <option>CRDB Bank - 0150-2255-8800</option>
                  <option>NMB Bank - 0240-1198-3300</option>
                  <option>M-Pesa - +255712240240</option>
                  <option>Airtel Money - +255788896493</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Amount (TSh)</label>
                <Input type="number" placeholder="0" required className="h-9 text-sm" />
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Available Balance</span><span className="font-medium text-foreground">TSh 2,585</span></div>
                <div className="mt-1 flex justify-between"><span>Payout Fee</span><span className="font-medium">TSh 5,000</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowRequestModal(false)} className="flex-1 h-9 text-xs font-medium cursor-pointer">Cancel</Button>
                <Button type="submit" className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium cursor-pointer">Request Payout</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
