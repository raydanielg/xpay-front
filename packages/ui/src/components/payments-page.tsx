"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  FilterIcon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Clock01Icon,
  RefreshIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
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
  { id: "3", reference: "XP-8X92K3", type: "MOBILE", customer: "Michael Chen", phone: "+255702582488", amount: "TSh 125,000", rawAmount: 125000, fee: "TSh 2,500", status: "PENDING", method: "Mixx by Yas", date: "23 Aug 2026, 12:48" },
  { id: "4", reference: "XP-8X92K4", type: "MOBILE", customer: "Emily Brown", phone: "+255613978254", amount: "TSh 8,000", rawAmount: 8000, fee: "TSh 160", status: "FAILED", method: "Tigo Pesa", date: "23 Aug 2026, 11:20" },
  { id: "5", reference: "XP-8X92K5", type: "BANK", customer: "David Kim", phone: "+255754123698", amount: "TSh 350,000", rawAmount: 350000, fee: "TSh 7,000", status: "COMPLETED", method: "CRDB Bank", date: "22 Aug 2026, 16:45" },
  { id: "6", reference: "XP-8X92K6", type: "MOBILE", customer: "Lisa Garcia", phone: "+255715998852", amount: "TSh 23,000", rawAmount: 23000, fee: "TSh 460", status: "COMPLETED", method: "Halopesa", date: "22 Aug 2026, 15:30" },
  { id: "7", reference: "XP-8X92K7", type: "MOBILE", customer: "Robert Lee", phone: "+255689002211", amount: "TSh 67,000", rawAmount: 67000, fee: "TSh 1,340", status: "REFUNDED", method: "Airtel Money", date: "22 Aug 2026, 14:12" },
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
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL")
  const [methodFilter, setMethodFilter] = React.useState<string>("ALL")
  const [selected, setSelected] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)

  const allMethods = Array.from(new Set(allTransactions.map((t) => t.method))).sort()
  const typeFilters = ["ALL", "MOBILE", "BANK"] as const

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
    const matchesType = typeFilter === "ALL" || tx.type === typeFilter
    const matchesMethod = methodFilter === "ALL" || tx.method === methodFilter
    return matchesSearch && matchesStatus && matchesType && matchesMethod
  })

  const activeFilters = (typeFilter !== "ALL" ? 1 : 0) + (methodFilter !== "ALL" ? 1 : 0)

  function resetFilters() {
    setTypeFilter("ALL")
    setMethodFilter("ALL")
    setStatusFilter("ALL")
    setSearch("")
  }

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

  const rowsPerPageOptions = [8, 25, 50, 100] as const
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(8)
  const [currentPage, setCurrentPage] = React.useState(1)

  const effectiveRowsPerPage = rowsPerPage === 0 ? filtered.length : rowsPerPage
  const totalPages = Math.max(1, Math.ceil(filtered.length / effectiveRowsPerPage))
  const startIndex = (currentPage - 1) * effectiveRowsPerPage
  const paginatedTransactions = filtered.slice(startIndex, startIndex + effectiveRowsPerPage)

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [totalPages, currentPage])

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground">All transactions across your account</p>
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

        {/* Column Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer whitespace-nowrap">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-3.5" />
            <span>Filter</span>
            {activeFilters > 0 && (
              <span className="flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[0.5625rem] font-bold text-primary-foreground leading-none">
                {activeFilters}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment Type
              </DropdownMenuLabel>
              {typeFilters.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`flex items-center justify-between text-xs cursor-pointer ${typeFilter === type ? "font-semibold text-primary" : ""}`}
                >
                  {type === "ALL" ? "All Types" : type}
                  {typeFilter === type && <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment Method
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setMethodFilter("ALL")}
                className={`flex items-center justify-between text-xs cursor-pointer ${methodFilter === "ALL" ? "font-semibold text-primary" : ""}`}
              >
                All Methods
                {methodFilter === "ALL" && <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5 text-primary" />}
              </DropdownMenuItem>
              {allMethods.map((method) => (
                <DropdownMenuItem
                  key={method}
                  onClick={() => setMethodFilter(method)}
                  className={`flex items-center justify-between text-xs cursor-pointer ${methodFilter === method ? "font-semibold text-primary" : ""}`}
                >
                  {method}
                  {methodFilter === method && <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {activeFilters > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400 cursor-pointer"
                >
                  <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-3.5" />
                  Reset all filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
            ) : paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No transactions found</p>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((tx) => {
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

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              Showing {startIndex + 1}–{Math.min(startIndex + effectiveRowsPerPage, filtered.length)} of {filtered.length}
            </span>
            {selected.length > 0 && (
              <span className="font-medium text-foreground">{selected.length} selected</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Rows per page selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Rows</span>
              <div className="flex items-center gap-0.5 rounded-lg bg-muted/30 p-0.5">
                {rowsPerPageOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setRowsPerPage(opt); setCurrentPage(1) }}
                    className={`flex h-7 items-center justify-center rounded-md px-2.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      rowsPerPage === opt
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
                <button
                  onClick={() => { setRowsPerPage(0); setCurrentPage(1) }}
                  className={`flex h-7 items-center justify-center rounded-md px-2.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    rowsPerPage === 0
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                  }
                >
                  All
                </button>
              </div>
            </div>

            {/* Page controls */}
            {rowsPerPage !== 0 && totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
