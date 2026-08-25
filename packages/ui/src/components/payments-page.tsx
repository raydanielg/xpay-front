"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Copy01Icon,
  Loading03Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Clock01Icon,
  RefreshIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
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
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatCurrency(amount: number, currency = "TSh") {
  return `${currency} ${amount.toLocaleString()}`
}

export function PaymentsPage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL")
  const [methodFilter, setMethodFilter] = React.useState<string>("ALL")
  const [loading, setLoading] = React.useState(true)
  const [payments, setPayments] = React.useState<ApiPayment[]>([])
  const [total, setTotal] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(1)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(8)

  const statusTabs = ["ALL", "COMPLETED", "PENDING", "FAILED", "REFUNDED"] as const
  const typeFilters = ["ALL", "MOBILE", "BANK"] as const

  React.useEffect(() => {
    let cancelled = false
    async function fetchPayments() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("page", String(currentPage))
        params.set("limit", String(rowsPerPage))
        if (statusFilter !== "ALL") params.set("status", statusFilter.toLowerCase())

        const res = await api.get<ApiPayment[]>(`/payments?${params.toString()}`)
        if (!cancelled && res.success && res.data) {
          setPayments(Array.isArray(res.data) ? res.data : [])
          setTotal(res.meta?.total || 0)
          setTotalPages(res.meta?.totalPages || 1)
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchPayments()
    return () => { cancelled = true }
  }, [currentPage, rowsPerPage, statusFilter])

  const filtered = payments.filter((tx) => {
    const q = search.toLowerCase()
    const matchesSearch =
      tx.reference?.toLowerCase().includes(q) ||
      tx.customerName?.toLowerCase().includes(q) ||
      tx.customerEmail?.toLowerCase().includes(q) ||
      tx.customerPhone?.includes(search)
    const matchesType = typeFilter === "ALL" || tx.type?.toUpperCase() === typeFilter
    const matchesMethod = methodFilter === "ALL" || tx.method === methodFilter
    return matchesSearch && matchesType && matchesMethod
  })

  const allMethods = Array.from(new Set(payments.map((t) => t.method).filter(Boolean))).sort()
  const activeFilters = (typeFilter !== "ALL" ? 1 : 0) + (methodFilter !== "ALL" ? 1 : 0)

  function resetFilters() {
    setTypeFilter("ALL")
    setMethodFilter("ALL")
    setStatusFilter("ALL")
    setSearch("")
  }

  function copyRef(ref: string) {
    navigator.clipboard.writeText(ref)
    toast.add({ type: "success", title: "Copied", description: `${ref} copied to clipboard.` })
  }

  function formatStatus(status: string) {
    const s = status?.toUpperCase()
    if (s === "COMPLETED" || s === "SUCCESSFUL") {
      return (
        <Badge variant="outline" className="text-[0.625rem] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
          COMPLETED
        </Badge>
      )
    }
    if (s === "PENDING") {
      return (
        <Badge variant="outline" className="text-[0.625rem] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
          <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3 mr-1" />
          PENDING
        </Badge>
      )
    }
    if (s === "REFUNDED") {
      return (
        <Badge variant="outline" className="text-[0.625rem] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-3 mr-1" />
          REFUNDED
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-[0.625rem] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">
        <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} className="size-3 mr-1" />
        FAILED
      </Badge>
    )
  }

  const rowsPerPageOptions = [8, 25, 50, 100] as const

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">Payments</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          All transactions across your account — collections, refunds, and payouts in real time.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ref, customer, phone..."
            className="pl-9 h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setStatusFilter(tab); setCurrentPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}

          {/* Advanced Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer whitespace-nowrap">
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
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 py-12 text-center text-xs text-muted-foreground">
          No payments found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-muted-foreground font-semibold">
                  <th className="py-3 px-4 font-medium">Reference</th>
                  <th className="py-3 px-4 font-medium">Type</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Method</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span>{tx.reference?.slice(0, 12)}...</span>
                        <button
                          type="button"
                          onClick={() => copyRef(tx.reference)}
                          className="opacity-50 hover:opacity-100 cursor-pointer"
                        >
                          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground capitalize">
                      {tx.type || tx.method || "Mobile"}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {tx.customerName || tx.customerEmail || "Guest"}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground capitalize">
                      {tx.method || "—"}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="py-3 px-4">
                      {formatStatus(tx.status)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {total > 0
                ? `Showing ${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, total)} of ${total}`
                : "No results"}
            </span>
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
              </div>
            </div>

            {/* Page controls */}
            {totalPages > 1 && (
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
