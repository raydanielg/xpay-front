"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InternetIcon,
  CreditCardIcon,
  GridIcon,
  ShoppingBag01Icon,
  Tag01Icon,
  Image02Icon,
  Settings02Icon,
  UserCircle02Icon,
  DatabaseIcon,
  File01Icon,
  ReceiptIcon,
  DeliveryBoxIcon,
  PlusIcon,
  Loading03Icon,
  UserAccountIcon,
  FilterIcon,
  Comment01Icon,
  SentIcon,
  More01Icon,
  MoreVerticalIcon,
  Tick02Icon as TickIconAlt,
  Cabinet01Icon,
  Folder01Icon,
  CloudIcon,
  HardDriveIcon as HardDriveIconAlt,
  ArchiveIcon,
  FileLockIcon,
  Calendar03Icon,
  ReceiptTextIcon,
  Search01Icon,
  Edit02Icon,
  TrashIcon,
  Copy01Icon,
  Globe02Icon,
  CheckmarkCircle01Icon,
  Upload04Icon,
  Download04Icon,
  Coins01Icon,
  Clock01Icon,
  CancelCircleIcon,
  RefreshIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Tick02Icon,
  Settings02Icon as Settings02IconAlt,
  BellRingIcon,
  UserCircle02Icon as UserCircle02IconAlt,
  EyeIcon,
  SmartPhone01Icon,
  Mail02Icon,
  GiftIcon,
  Progress02Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@workspace/ui/components/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { toast } from "@workspace/ui/components/toast"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import type { DateRange } from "react-day-picker"
import { api } from "@workspace/ui/lib/api"
import { PageHeader, EmptyState, StatCard } from "@workspace/ui/components/page-utils"

// ===================== PAGES =====================
export function PaymentPages_Pages() {
  const [pages, setPages] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")

  async function fetchPages() {
    try {
      const res = await api.get<any[]>("/payment-pages")
      if (res.success && res.data) setPages(res.data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }
  React.useEffect(() => { fetchPages() }, [])

  async function toggleActive(id: string, active: boolean) {
    try {
      const res = await api.patch(`/payment-pages/${id}`, { isActive: !active })
      if (res.success) {
        setPages((p) => p.map((pg) => pg.id === id ? { ...pg, isActive: !active } : pg))
        toast.add({ type: "success", title: !active ? "Page activated" : "Page deactivated" })
      }
    } catch { toast.add({ type: "error", title: "Failed" }) }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}?`)) return
    try {
      const res = await api.delete(`/payment-pages/${id}`)
      if (res.success) {
        setPages((p) => p.filter((pg) => pg.id !== id))
        toast.add({ type: "success", title: "Page deleted" })
      }
    } catch { toast.add({ type: "error", title: "Failed" }) }
  }

  function copyUrl(slug: string) {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    const url = `${base}/pay/${slug}`
    navigator.clipboard.writeText(url)
    toast.add({ type: "success", title: "URL copied", description: `${base}/pay/${slug}` })
  }

  const filtered = pages.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      <PageHeader
        title="Pages"
        description="Create and manage your hosted payment pages."
        action={<a href="/dashboard/payment-pages/pages/new"><Button className="gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer shrink-0"><HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" /><span>New Page</span></Button></a>}
      />

      <div className="relative w-full max-w-sm">
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..." className="pl-9" />
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={InternetIcon} title="No payment pages yet" description="Create your first payment page to start accepting payments." action={<a href="/dashboard/payment-pages/pages/new"><Button className="gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer mt-2"><HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" /><span>New Page</span></Button></a>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pg) => (
            <Card key={pg.id} className="group">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">{pg.name}</span>
                    <button onClick={() => copyUrl(pg.slug)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors" title="Copy URL">
                      <span className="truncate">/pay/{pg.slug}</span>
                      <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3 shrink-0" />
                    </button>
                    {pg.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{pg.description}</p>}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge variant="outline" className={`text-xs ${pg.isActive ? "bg-primary/10 text-primary border-primary/20" : ""}`}>{pg.isActive ? "Active" : "Inactive"}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <a href={`/dashboard/payment-pages/pages/${pg.id}`} title="Edit page">
                      <Button variant="ghost" size="icon-sm">
                        <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-4" />
                      </Button>
                    </a>
                    <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(pg.id, pg.isActive)} title={pg.isActive ? "Deactivate" : "Activate"}>
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className={`size-4 ${pg.isActive ? "text-primary" : "text-muted-foreground"}`} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(pg.id, pg.name)} title="Delete">
                      <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ===================== PAYMENTS (Payment Pages > Payments) =====================
interface PagePayment {
  id: string
  reference: string
  amount: number
  currency: string
  status: string
  method?: string
  channel?: string
  customerEmail?: string | null
  customerName?: string | null
  customerPhone?: string | null
  type?: string
  pageName?: string
  createdAt: string
}

export function PaymentPages_Payments() {
  const [payments, setPayments] = React.useState<PagePayment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [methodFilter, setMethodFilter] = React.useState<string>("ALL")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(8)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  const statusTabs = ["ALL", "COMPLETED", "PENDING", "FAILED", "REFUNDED"] as const

  async function fetchPayments() {
    setLoading(true)
    try {
      const res = await api.get<PagePayment[]>("/payments")
      if (res.success && res.data) {
        setPayments(Array.isArray(res.data) ? res.data : [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPayments()
  }, [])

  function copyRef(ref: string) {
    navigator.clipboard.writeText(ref)
    setCopiedKey(ref)
    setTimeout(() => setCopiedKey(null), 2000)
    toast.add({ type: "success", title: "Copied", description: `${ref} copied to clipboard.` })
  }

  // Calculate KPI metrics
  const completedPayments = payments.filter(
    (p) => p.status?.toUpperCase() === "COMPLETED" || p.status?.toUpperCase() === "SUCCESSFUL"
  )
  const pendingPayments = payments.filter((p) => p.status?.toUpperCase() === "PENDING")
  const failedPayments = payments.filter(
    (p) => p.status?.toUpperCase() === "FAILED" || p.status?.toUpperCase() === "REFUNDED"
  )
  const totalRevenue = completedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

  // Unique methods for filter dropdown
  const allMethods = Array.from(
    new Set(payments.map((p) => p.method || p.channel).filter(Boolean))
  ).sort() as string[]

  const filtered = payments.filter((tx) => {
    const q = search.toLowerCase()
    const matchesSearch =
      tx.reference?.toLowerCase().includes(q) ||
      tx.customerName?.toLowerCase().includes(q) ||
      tx.customerEmail?.toLowerCase().includes(q) ||
      tx.customerPhone?.includes(search) ||
      String(tx.amount).includes(search)

    const s = tx.status?.toUpperCase()
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "COMPLETED" && (s === "COMPLETED" || s === "SUCCESSFUL")) ||
      s === statusFilter

    const m = tx.method || tx.channel || ""
    const matchesMethod = methodFilter === "ALL" || m === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  function formatStatusBadge(status: string) {
    const s = status?.toUpperCase()
    if (s === "COMPLETED" || s === "SUCCESSFUL") {
      return (
        <Badge
          variant="outline"
          className="text-[0.625rem] font-semibold bg-primary/10 text-primary border-primary/20"
        >
          <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
          COMPLETED
        </Badge>
      )
    }
    if (s === "PENDING") {
      return (
        <Badge
          variant="outline"
          className="text-[0.625rem] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        >
          <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3 mr-1" />
          PENDING
        </Badge>
      )
    }
    if (s === "REFUNDED") {
      return (
        <Badge
          variant="outline"
          className="text-[0.625rem] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        >
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-3 mr-1" />
          REFUNDED
        </Badge>
      )
    }
    return (
      <Badge
        variant="outline"
        className="text-[0.625rem] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      >
        <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} className="size-3 mr-1" />
        FAILED
      </Badge>
    )
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">
            All transactions and customer payments received across your hosted payment pages.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchPayments()
            toast.add({ type: "success", title: "Refreshed", description: "Payment list is up to date." })
          }}
          className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer shrink-0"
        >
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="group relative rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Total Revenue</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Coins01Icon} strokeWidth={2} className="size-3.5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {loading ? (
              <div className="h-7 w-28 animate-pulse rounded bg-muted" />
            ) : (
              `TSh ${totalRevenue.toLocaleString()}`
            )}
          </div>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">
            {completedPayments.length} successful transactions
          </p>
        </div>

        {/* Successful Payments */}
        <div className="group relative rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Successful</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {loading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-muted" />
            ) : (
              completedPayments.length
            )}
          </div>
          <p className="mt-1 text-[0.6875rem] text-primary font-medium">
            {payments.length > 0
              ? `${Math.round((completedPayments.length / payments.length) * 100)}% success rate`
              : "No payments yet"}
          </p>
        </div>

        {/* Pending Payments */}
        <div className="group relative rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-amber-500/40 hover:shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Pending</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3.5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {loading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-muted" />
            ) : (
              pendingPayments.length
            )}
          </div>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">Awaiting customer confirmation</p>
        </div>

        {/* Failed / Refunded */}
        <div className="group relative rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-rose-500/40 hover:shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Failed / Refunded</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
              <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} className="size-3.5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {loading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-muted" />
            ) : (
              failedPayments.length
            )}
          </div>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">Declined or cancelled</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search by ref, customer, phone..."
            className="pl-9 h-9 text-xs bg-card border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setStatusFilter(tab)
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}

          {/* Method Filter Dropdown */}
          {allMethods.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer whitespace-nowrap">
                <span>Method</span>
                {methodFilter !== "ALL" && (
                  <span className="flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[0.5625rem] font-bold text-primary-foreground leading-none">
                    1
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Payment Method
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      setMethodFilter("ALL")
                      setCurrentPage(1)
                    }}
                    className={`flex items-center justify-between text-xs cursor-pointer ${
                      methodFilter === "ALL" ? "font-semibold text-primary" : ""
                    }`}
                  >
                    <span>All Methods</span>
                    {methodFilter === "ALL" && (
                      <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                  {allMethods.map((method) => (
                    <DropdownMenuItem
                      key={method}
                      onClick={() => {
                        setMethodFilter(method)
                        setCurrentPage(1)
                      }}
                      className={`flex items-center justify-between text-xs cursor-pointer ${
                        methodFilter === method ? "font-semibold text-primary" : ""
                      }`}
                    >
                      <span>{method}</span>
                      {methodFilter === method && (
                        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-border/60 bg-card">
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={1.5}
            className="size-8 animate-spin text-muted-foreground"
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 py-16 text-center text-xs text-muted-foreground">
          No payments found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4 font-medium">Reference</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Method</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {paginated.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/20 transition-colors group">
                    {/* Reference */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-foreground">
                        <span className="truncate max-w-[140px]">{tx.reference}</span>
                        <button
                          type="button"
                          onClick={() => copyRef(tx.reference)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity cursor-pointer"
                          title="Copy reference"
                        >
                          <HugeiconsIcon
                            icon={copiedKey === tx.reference ? Tick02Icon : Copy01Icon}
                            strokeWidth={2}
                            className={`size-3.5 ${copiedKey === tx.reference ? "text-primary" : ""}`}
                          />
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {tx.customerName || "—"}
                        </span>
                        <span className="text-[0.6875rem] text-muted-foreground">
                          {tx.customerEmail || tx.customerPhone || "Guest checkout"}
                        </span>
                      </div>
                    </td>

                    {/* Method */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground uppercase">
                        {tx.method || tx.channel || "MOBILE"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-semibold tabular-nums text-foreground">
                      {tx.currency || "TZS"} {Number(tx.amount || 0).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{formatStatusBadge(tx.status)}</td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>
                Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span> ({filtered.length} payments)
              </span>
              <div className="flex items-center gap-1.5">
                <span>Rows:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="rounded border border-border/70 bg-card px-1.5 py-0.5 text-xs text-foreground cursor-pointer focus:outline-none"
                >
                  <option value={8}>8</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-8 items-center gap-1 rounded-lg border border-border/70 bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
                Prev
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-8 items-center gap-1 rounded-lg border border-border/70 bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===================== CATALOG =====================
export function PaymentPages_Catalog() {
  const [products, setProducts] = React.useState<ApiProduct[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")

  async function fetchCatalog() {
    setLoading(true)
    try {
      const res = await api.get<ApiProduct[]>("/products")
      if (res.success && res.data) {
        setProducts(Array.isArray(res.data) ? res.data : [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchCatalog()
  }, [])

  const uniqueCategories = [
    "ALL",
    ...Array.from(new Set(products.map((p) => p.category || "General"))).filter(Boolean),
  ]

  const filtered = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
    const matchesCat = categoryFilter === "ALL" || (item.category || "General") === categoryFilter
    return matchesSearch && matchesCat
  })

  const activeProducts = products.filter((p) => p.status?.toLowerCase() === "active")

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Organize and browse all your live products, packages, and digital services from the database.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchCatalog()
              toast.add({ type: "success", title: "Refreshed" })
            }}
            className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer shrink-0"
          >
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <a href="/dashboard/payment-pages/products">
            <Button
              className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer shrink-0"
            >
              <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
              <span>Manage Products</span>
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Total Products</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={2} className="size-3.5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {loading ? <div className="h-7 w-16 animate-pulse rounded bg-muted" /> : products.length}
          </div>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">Across all categories</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-blue-500/40 hover:shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Categories</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="size-3.5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {loading ? <div className="h-7 w-16 animate-pulse rounded bg-muted" /> : uniqueCategories.length - 1}
          </div>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">Active item classifications</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Active Items</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {loading ? <div className="h-7 w-16 animate-pulse rounded bg-muted" /> : activeProducts.length}
          </div>
          <p className="mt-1 text-[0.6875rem] text-primary font-medium">Ready for checkout</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-amber-500/40 hover:shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Stock Items</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <HugeiconsIcon icon={Coins01Icon} strokeWidth={2} className="size-3.5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {loading ? <div className="h-7 w-16 animate-pulse rounded bg-muted" /> : products.filter((p) => p.stock !== "Out of Stock").length}
          </div>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">In stock or unlimited</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog items..."
            className="pl-9 h-9 text-xs bg-card border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat === "ALL" ? "All Items" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-border/60 bg-card">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 py-16 text-center text-xs text-muted-foreground space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted/40">
            <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={2} className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No catalog items found</p>
          <p className="text-xs text-muted-foreground">Add products to see them organized in your catalog.</p>
          <a href="/dashboard/payment-pages/products">
            <Button className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer mt-2">
              <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
              <span>Add Product</span>
            </Button>
          </a>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4 font-medium">Item Name</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium">Availability</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      <div>
                        <span>{item.name}</span>
                        {item.description && (
                          <p className="text-[0.6875rem] text-muted-foreground truncate max-w-xs">{item.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center rounded-md bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                        {item.category || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold tabular-nums text-foreground">
                      {item.currency || "TZS"} {Number(item.price || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{item.stock || "Unlimited"}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[0.625rem] font-semibold ${
                          item.status?.toLowerCase() === "active"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        {item.status?.toUpperCase() || "ACTIVE"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ===================== PRODUCTS =====================
interface ApiProduct {
  id: string
  name: string
  price: number
  currency: string
  category: string
  description: string | null
  stock: string
  status: string
  createdAt: string
  updatedAt?: string
}

export function PaymentPages_Products() {
  const [products, setProducts] = React.useState<ApiProduct[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<ApiProduct | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [productToDelete, setProductToDelete] = React.useState<ApiProduct | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Form state
  const [formName, setFormName] = React.useState("")
  const [formPrice, setFormPrice] = React.useState("")
  const [formCurrency, setFormCurrency] = React.useState("TZS")
  const [formCategory, setFormCategory] = React.useState("General")
  const [formStock, setFormStock] = React.useState("Unlimited")
  const [formStatus, setFormStatus] = React.useState("Active")
  const [formDescription, setFormDescription] = React.useState("")

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await api.get<ApiProduct[]>("/products")
      if (res.success && res.data) {
        setProducts(Array.isArray(res.data) ? res.data : [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchProducts()
  }, [])

  function exportToExcel() {
    if (filtered.length === 0) {
      toast.add({ type: "error", title: "No products", description: "No products to export." })
      return
    }
    const headers = ["ID", "Name", "Category", "Price", "Currency", "Stock", "Status", "Description", "Created At"]
    const rows = filtered.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${(p.category || "General").replace(/"/g, '""')}"`,
      p.price,
      p.currency || "TZS",
      `"${(p.stock || "Unlimited").replace(/"/g, '""')}"`,
      p.status || "Active",
      `"${(p.description || "").replace(/"/g, '""')}"`,
      p.createdAt ? new Date(p.createdAt).toISOString() : "",
    ])
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `products_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.add({ type: "success", title: "Exported to Excel (CSV)", description: `Exported ${filtered.length} products.` })
  }

  function openCreateDrawer() {
    setEditingProduct(null)
    setFormName("")
    setFormPrice("")
    setFormCurrency("TZS")
    setFormCategory("General")
    setFormStock("Unlimited")
    setFormStatus("Active")
    setFormDescription("")
    setDrawerOpen(true)
  }

  function openEditDrawer(product: ApiProduct) {
    setEditingProduct(product)
    setFormName(product.name)
    setFormPrice(String(product.price))
    setFormCurrency(product.currency || "TZS")
    setFormCategory(product.category || "General")
    setFormStock(product.stock || "Unlimited")
    setFormStatus(product.status || "Active")
    setFormDescription(product.description || "")
    setDrawerOpen(true)
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim() || !formPrice) return
    setIsSubmitting(true)

    const payload = {
      name: formName.trim(),
      price: Number(formPrice),
      currency: formCurrency,
      category: formCategory.trim() || "General",
      stock: formStock.trim() || "Unlimited",
      status: formStatus,
      description: formDescription.trim() || undefined,
    }

    try {
      if (editingProduct) {
        // Edit existing product
        const res = await api.patch<ApiProduct>(`/products/${editingProduct.id}`, payload)
        if (res.success && res.data) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? (res.data as ApiProduct) : p))
          )
          setDrawerOpen(false)
          setEditingProduct(null)
          toast.add({ type: "success", title: "Product Updated", description: `${payload.name} has been updated.` })
        } else {
          toast.add({ type: "error", title: "Update Failed", description: res.message || "Please try again." })
        }
      } else {
        // Create new product
        const res = await api.post<ApiProduct>("/products", payload)
        if (res.success && res.data) {
          setProducts([res.data, ...products])
          setDrawerOpen(false)
          toast.add({ type: "success", title: "Product Created", description: `${payload.name} is now available.` })
        } else {
          toast.add({ type: "error", title: "Creation Failed", description: res.message || "Please try again." })
        }
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  function promptDelete(product: ApiProduct) {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      const res = await api.delete(`/products/${productToDelete.id}`)
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
        setDeleteDialogOpen(false)
        setProductToDelete(null)
        toast.add({ type: "success", title: "Product Deleted", description: `${productToDelete.name} has been removed.` })
      } else {
        toast.add({ type: "error", title: "Delete Failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Could not delete product." })
    } finally {
      setIsDeleting(false)
    }
  }

  const categories = ["ALL", ...Array.from(new Set(products.map((p) => p.category || "General"))).filter(Boolean)]

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      String(p.price).includes(search)

    const matchesStatus =
      statusFilter === "ALL" || (p.status || "Active").toUpperCase() === statusFilter.toUpperCase()

    const matchesCat = categoryFilter === "ALL" || (p.category || "General") === categoryFilter

    return matchesSearch && matchesStatus && matchesCat
  })

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage individual items, digital goods, and services available on your hosted checkout pages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export by Excel Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer shrink-0 hover:bg-muted"
            title="Export to Excel (CSV)"
          >
            <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
            <span>Export by Excel</span>
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchProducts()
              toast.add({ type: "success", title: "Refreshed" })
            }}
            className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer shrink-0"
          >
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          {/* New Product Drawer Trigger */}
          <Button
            onClick={openCreateDrawer}
            className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer shrink-0"
          >
            <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
            <span>New Product</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, category, price..."
            className="pl-9 h-9 text-xs bg-card border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {/* Status Tabs */}
          {["ALL", "ACTIVE", "INACTIVE"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}

          {/* Category Filter Dropdown */}
          {categories.length > 2 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer whitespace-nowrap">
                <span>{categoryFilter === "ALL" ? "Category" : categoryFilter}</span>
                {categoryFilter !== "ALL" && (
                  <span className="flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[0.5625rem] font-bold text-primary-foreground leading-none">
                    1
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Filter Category
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`flex items-center justify-between text-xs cursor-pointer ${
                        categoryFilter === cat ? "font-semibold text-primary" : ""
                      }`}
                    >
                      <span>{cat === "ALL" ? "All Categories" : cat}</span>
                      {categoryFilter === cat && (
                        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-border/60 bg-card">
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={1.5}
            className="size-8 animate-spin text-muted-foreground"
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 py-16 text-center text-xs text-muted-foreground space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted/40">
            <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={2} className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No products found</p>
          <p className="text-xs text-muted-foreground">Create your first product to link it to checkout pages.</p>
          <Button
            onClick={openCreateDrawer}
            className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
            <span>New Product</span>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4 font-medium">Product Name</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium">Availability</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Created</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors group">
                    {/* Name + Description */}
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      <div>
                        <span>{p.name}</span>
                        {p.description && (
                          <p className="text-[0.6875rem] text-muted-foreground truncate max-w-xs">{p.description}</p>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center rounded-md bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                        {p.category || "General"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-semibold tabular-nums text-foreground">
                      {p.currency || "TZS"} {Number(p.price || 0).toLocaleString()}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 text-muted-foreground">{p.stock || "Unlimited"}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[0.625rem] font-semibold ${
                          p.status?.toLowerCase() === "active"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        {p.status?.toUpperCase() || "ACTIVE"}
                      </Badge>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditDrawer(p)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Edit product"
                        >
                          <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => promptDelete(p)}
                          className="text-muted-foreground hover:text-destructive cursor-pointer"
                          title="Delete product"
                        >
                          <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Drawer (Sheet) - for Add and Edit */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-s border-border bg-card p-0 shadow-2xl flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <SheetHeader className="p-6 pb-4 border-b border-border/60">
            <SheetTitle className="text-base font-semibold">
              {editingProduct ? "Edit Product" : "New Product"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editingProduct
                ? "Update product pricing, category, and inventory details."
                : "Create a product or service to attach to your checkout payment pages."}
            </SheetDescription>
          </SheetHeader>

          {/* Drawer Form Body */}
          <form
            id="product-drawer-form"
            onSubmit={handleSaveProduct}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Product Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Annual VIP Pass, Coffee Mug..."
                required
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>

            {/* Price & Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Price & Currency</label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={formCurrency} onValueChange={(v) => v && setFormCurrency(v)}>
                  <SelectTrigger className="w-full h-9 text-xs bg-card border-border/80 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TZS">TZS</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="KES">KES</SelectItem>
                    <SelectItem value="UGX">UGX</SelectItem>
                  </SelectContent>
                </Select>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="50000"
                    required
                    min="0"
                    className="h-9 text-xs bg-card border-border/80 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Category</label>
              <Input
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. Subscriptions, Digital, Merchandise"
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>

            {/* Stock / Availability */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Stock / Availability</label>
              <Select value={formStock} onValueChange={(v) => v && setFormStock(v)}>
                <SelectTrigger className="w-full h-9 text-xs bg-card border-border/80 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unlimited">Unlimited</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Limited Quantity">Limited Quantity</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <Select value={formStatus} onValueChange={(v) => v && setFormStatus(v)}>
                <SelectTrigger className="w-full h-9 text-xs bg-card border-border/80 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active (Visible)</SelectItem>
                  <SelectItem value="Inactive">Inactive (Hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description (Optional)</label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Product summary shown to buyer..."
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>
          </form>

          {/* Drawer Footer */}
          <SheetFooter className="p-6 pt-4 border-t border-border/60 flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setDrawerOpen(false)}
              className="flex-1 h-9 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="product-drawer-form"
              disabled={isSubmitting}
              className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium cursor-pointer relative"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce" />
                </div>
              ) : editingProduct ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground">Delete Product</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure you want to delete <span className="font-semibold text-foreground">{productToDelete?.name}</span>? This action cannot be undone and will remove it from any linked checkout pages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row gap-2.5 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => {
                setDeleteDialogOpen(false)
                setProductToDelete(null)
              }}
              className="h-9 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-medium cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===================== CATEGORIES =====================
interface ApiCategory {
  id: string
  name: string
  description: string | null
  status: string
  createdAt: string
  updatedAt?: string
}

export function PaymentPages_Categories() {
  const [categories, setCategories] = React.useState<ApiCategory[]>([])
  const [products, setProducts] = React.useState<ApiProduct[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")

  // Drawer state
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<ApiCategory | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [categoryToDelete, setCategoryToDelete] = React.useState<ApiCategory | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Form state
  const [formName, setFormName] = React.useState("")
  const [formStatus, setFormStatus] = React.useState("Active")
  const [formDescription, setFormDescription] = React.useState("")

  async function fetchCategoryData() {
    setLoading(true)
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get<ApiCategory[]>("/categories"),
        api.get<ApiProduct[]>("/products"),
      ])
      if (catRes.success && catRes.data) {
        setCategories(Array.isArray(catRes.data) ? catRes.data : [])
      }
      if (prodRes.success && prodRes.data) {
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchCategoryData()
  }, [])

  function exportToExcel() {
    if (filtered.length === 0) {
      toast.add({ type: "error", title: "No categories", description: "No categories to export." })
      return
    }
    const headers = ["ID", "Category Name", "Description", "Products Count", "Status", "Created At"]
    const rows = filtered.map((c) => {
      const pCount = products.filter(
        (p) => p.category?.trim().toLowerCase() === c.name?.trim().toLowerCase()
      ).length
      return [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${(c.description || "").replace(/"/g, '""')}"`,
        pCount,
        c.status || "Active",
        c.createdAt ? new Date(c.createdAt).toISOString() : "",
      ]
    })
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `categories_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.add({
      type: "success",
      title: "Exported to Excel (CSV)",
      description: `Exported ${filtered.length} categories.`,
    })
  }

  function openCreateDrawer() {
    setEditingCategory(null)
    setFormName("")
    setFormStatus("Active")
    setFormDescription("")
    setDrawerOpen(true)
  }

  function openEditDrawer(category: ApiCategory) {
    setEditingCategory(category)
    setFormName(category.name)
    setFormStatus(category.status || "Active")
    setFormDescription(category.description || "")
    setDrawerOpen(true)
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) return
    setIsSubmitting(true)

    const payload = {
      name: formName.trim(),
      status: formStatus,
      description: formDescription.trim() || undefined,
    }

    try {
      if (editingCategory) {
        // Edit existing category
        const res = await api.patch<ApiCategory>(`/categories/${editingCategory.id}`, payload)
        if (res.success && res.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? (res.data as ApiCategory) : c))
          )
          setDrawerOpen(false)
          setEditingCategory(null)
          toast.add({
            type: "success",
            title: "Category Updated",
            description: `${payload.name} has been updated.`,
          })
        } else {
          toast.add({ type: "error", title: "Update Failed", description: res.message || "Please try again." })
        }
      } else {
        // Create new category
        const res = await api.post<ApiCategory>("/categories", payload)
        if (res.success && res.data) {
          setCategories([res.data, ...categories])
          setDrawerOpen(false)
          toast.add({
            type: "success",
            title: "Category Created",
            description: `${payload.name} category is ready.`,
          })
        } else {
          toast.add({ type: "error", title: "Creation Failed", description: res.message || "Please try again." })
        }
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  function promptDelete(category: ApiCategory) {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) return
    setIsDeleting(true)
    try {
      const res = await api.delete(`/categories/${categoryToDelete.id}`)
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id))
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
        toast.add({
          type: "success",
          title: "Category Deleted",
          description: `${categoryToDelete.name} has been removed.`,
        })
      } else {
        toast.add({ type: "error", title: "Delete Failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Could not delete category." })
    } finally {
      setIsDeleting(false)
    }
  }

  const filtered = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus =
      statusFilter === "ALL" || (c.status || "Active").toUpperCase() === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Group and organize your checkout products and services into distinct classifications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer shrink-0 hover:bg-muted"
            title="Export to Excel (CSV)"
          >
            <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
            <span>Export by Excel</span>
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchCategoryData()
              toast.add({ type: "success", title: "Refreshed" })
            }}
            className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer shrink-0"
          >
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          {/* New Category Button */}
          <Button
            onClick={openCreateDrawer}
            className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer shrink-0"
          >
            <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
            <span>New Category</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, description..."
            className="pl-9 h-9 text-xs bg-card border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["ALL", "ACTIVE", "INACTIVE"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-border/60 bg-card">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 py-16 text-center text-xs text-muted-foreground space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted/40">
            <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No categories found</p>
          <p className="text-xs text-muted-foreground">Create your first category to organize products.</p>
          <Button
            onClick={openCreateDrawer}
            className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
            <span>New Category</span>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4 font-medium">Category Name</th>
                  <th className="py-3 px-4 font-medium">Products Linked</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Created</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {filtered.map((c) => {
                  const linkedCount = products.filter(
                    (p) => p.category?.trim().toLowerCase() === c.name?.trim().toLowerCase()
                  ).length

                  return (
                    <tr key={c.id} className="hover:bg-muted/20 transition-colors group">
                      {/* Name + Description */}
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <div>
                          <span>{c.name}</span>
                          {c.description && (
                            <p className="text-[0.6875rem] text-muted-foreground truncate max-w-xs">
                              {c.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Products Count */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center rounded-md bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground tabular-nums">
                          {linkedCount} {linkedCount === 1 ? "product" : "products"}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className={`text-[0.625rem] font-semibold ${
                            c.status?.toLowerCase() === "active"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          {c.status?.toUpperCase() || "ACTIVE"}
                        </Badge>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditDrawer(c)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Edit category"
                          >
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => promptDelete(c)}
                            className="text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Delete category"
                          >
                            <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Drawer (Sheet) - for Add & Edit */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-s border-border bg-card p-0 shadow-2xl flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <SheetHeader className="p-6 pb-4 border-b border-border/60">
            <SheetTitle className="text-base font-semibold">
              {editingCategory ? "Edit Category" : "New Category"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editingCategory
                ? "Update category naming, classification, and visibility."
                : "Create a new category to organize your products on checkout pages."}
            </SheetDescription>
          </SheetHeader>

          {/* Drawer Form Body */}
          <form
            id="category-drawer-form"
            onSubmit={handleSaveCategory}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {/* Category Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Category Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Subscriptions, Digital Downloads, VIP..."
                required
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <Select value={formStatus} onValueChange={(v) => v && setFormStatus(v)}>
                <SelectTrigger className="w-full h-9 text-xs bg-card border-border/80 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active (Visible)</SelectItem>
                  <SelectItem value="Inactive">Inactive (Hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description (Optional)</label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Category summary or purpose..."
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>
          </form>

          {/* Drawer Footer */}
          <SheetFooter className="p-6 pt-4 border-t border-border/60 flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setDrawerOpen(false)}
              className="flex-1 h-9 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="category-drawer-form"
              disabled={isSubmitting}
              className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium cursor-pointer relative"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce" />
                </div>
              ) : editingCategory ? (
                "Save Changes"
              ) : (
                "Create Category"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground">Delete Category</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure you want to delete <span className="font-semibold text-foreground">{categoryToDelete?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row gap-2.5 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => {
                setDeleteDialogOpen(false)
                setCategoryToDelete(null)
              }}
              className="h-9 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-medium cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===================== MEDIA LIBRARY =====================
interface MediaItem {
  id: string
  name: string
  size: string
  type: "Logo" | "Banner" | "Product" | "Icon" | "General"
  url: string
  date: string
}

export function PaymentPages_MediaLibrary() {
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([
    { id: "1", name: "company-logo.png", size: "245 KB", type: "Logo", date: "24 Aug 2026", url: "/pay-per-click.png" },
    { id: "2", name: "checkout-banner.jpg", size: "1.2 MB", type: "Banner", date: "22 Aug 2026", url: "/pay-per-click.png" },
    { id: "3", name: "product-cover.png", size: "540 KB", type: "Product", date: "18 Aug 2026", url: "/pay-per-click.png" },
    { id: "4", name: "brand-icon.svg", size: "32 KB", type: "Icon", date: "15 Aug 2026", url: "/pay-per-click.png" },
    { id: "5", name: "summer-sale-promo.png", size: "850 KB", type: "Banner", date: "12 Aug 2026", url: "/pay-per-click.png" },
    { id: "6", name: "vip-badge.png", size: "120 KB", type: "Product", date: "10 Aug 2026", url: "/pay-per-click.png" },
  ])

  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("ALL")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 8
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // Drawer state (for upload and edit)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editingMedia, setEditingMedia] = React.useState<MediaItem | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form state
  const [formName, setFormName] = React.useState("")
  const [formType, setFormType] = React.useState<MediaItem["type"]>("General")
  const [formUrl, setFormUrl] = React.useState("")

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [mediaToDelete, setMediaToDelete] = React.useState<MediaItem | null>(null)

  function openUploadDrawer() {
    setEditingMedia(null)
    setFormName("")
    setFormType("General")
    setFormUrl("")
    setDrawerOpen(true)
  }

  function openEditDrawer(item: MediaItem) {
    setEditingMedia(item)
    setFormName(item.name)
    setFormType(item.type)
    setFormUrl(item.url)
    setDrawerOpen(true)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ type: "error", title: "File Too Large", description: "Image must be under 5MB." })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setFormUrl(reader.result as string)
      if (!formName) {
        setFormName(file.name)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleSaveMedia(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) return
    setIsSubmitting(true)

    setTimeout(() => {
      if (editingMedia) {
        setMediaList((prev) =>
          prev.map((m) =>
            m.id === editingMedia.id
              ? { ...m, name: formName.trim(), type: formType, url: formUrl || m.url }
              : m
          )
        )
        toast.add({ type: "success", title: "Media Updated", description: `${formName.trim()} saved.` })
      } else {
        const newItem: MediaItem = {
          id: String(Date.now()),
          name: formName.trim(),
          size: "420 KB",
          type: formType,
          url: formUrl || "/pay-per-click.png",
          date: "Today",
        }
        setMediaList([newItem, ...mediaList])
        toast.add({ type: "success", title: "Media Uploaded", description: `${newItem.name} added to library.` })
      }
      setIsSubmitting(false)
      setDrawerOpen(false)
      setEditingMedia(null)
    }, 400)
  }

  function promptDelete(item: MediaItem) {
    setMediaToDelete(item)
    setDeleteDialogOpen(true)
  }

  function handleConfirmDelete() {
    if (!mediaToDelete) return
    setMediaList((prev) => prev.filter((m) => m.id !== mediaToDelete.id))
    setDeleteDialogOpen(false)
    setMediaToDelete(null)
    toast.add({ type: "success", title: "Media Deleted", description: "File removed from library." })
  }

  function copyMediaLink(url: string, id: string) {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    const fullUrl = url.startsWith("http") ? url : `${base}${url}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.add({ type: "success", title: "Link Copied!", description: "Direct image URL copied to clipboard." })
  }

  const typeOptions = ["ALL", "Logo", "Banner", "Product", "Icon", "General"]

  const filtered = mediaList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "ALL" || item.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            Upload, organize, and manage image assets and logos for your hosted checkout pages.
          </p>
        </div>
        <Button
          onClick={openUploadDrawer}
          className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer shrink-0"
        >
          <HugeiconsIcon icon={Upload04Icon} strokeWidth={2} className="size-3.5" />
          <span>Upload Media</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search media files..."
            className="pl-9 h-9 text-xs bg-card border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {typeOptions.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTypeFilter(t)
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === t
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t === "ALL" ? "All Media" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Square Image Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 py-16 text-center text-xs text-muted-foreground space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted/40">
            <HugeiconsIcon icon={Image02Icon} strokeWidth={2} className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No media files found</p>
          <p className="text-xs text-muted-foreground">Upload images, banners, or logos to use across your checkout pages.</p>
          <Button
            onClick={openUploadDrawer}
            className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={Upload04Icon} strokeWidth={2} className="size-3.5" />
            <span>Upload Media</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {paginated.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
            >
              {/* Image Preview */}
              <div className="size-full flex items-center justify-center bg-muted/20 p-2">
                <img
                  src={item.url}
                  alt={item.name}
                  className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Permanent Bottom Tag */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent p-2.5 pt-6 flex items-center justify-between pointer-events-none group-hover:opacity-0 transition-opacity">
                <span className="text-xs font-medium text-foreground truncate max-w-[100px] sm:max-w-[130px]">
                  {item.name}
                </span>
                <span className="text-[0.625rem] text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded font-mono">
                  {item.size}
                </span>
              </div>

              {/* Hover Dark Frosted Overlay */}
              <div className="absolute inset-0 bg-background/85 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 z-10">
                {/* Top: Type Badge & Size */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[0.625rem] font-semibold bg-primary/10 text-primary border-primary/20">
                    {item.type.toUpperCase()}
                  </Badge>
                  <span className="text-[0.625rem] text-muted-foreground font-mono">{item.size}</span>
                </div>

                {/* Middle: File Name */}
                <div className="text-center py-1">
                  <p className="text-xs font-semibold text-foreground truncate px-1" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[0.6875rem] text-muted-foreground">{item.date}</p>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center gap-1.5 justify-center">
                  <Button
                    size="sm"
                    variant={copiedId === item.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      copyMediaLink(item.url, item.id)
                    }}
                    className={`h-7 px-2.5 text-[0.6875rem] font-medium rounded-lg cursor-pointer flex-1 gap-1 ${
                      copiedId === item.id ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    <HugeiconsIcon icon={copiedId === item.id ? Tick02Icon : Copy01Icon} strokeWidth={2} className="size-3" />
                    <span>{copiedId === item.id ? "Copied!" : "Copy Link"}</span>
                  </Button>

                  <Button
                    size="icon-sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditDrawer(item)
                    }}
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Edit asset"
                  >
                    <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3" />
                  </Button>

                  <Button
                    size="icon-sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      promptDelete(item)
                    }}
                    className="size-7 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                    title="Delete asset"
                  >
                    <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {filtered.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span>
            Showing <span className="font-medium text-foreground">{paginated.length}</span> of{" "}
            <span className="font-medium text-foreground">{filtered.length}</span> media assets
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 items-center gap-1 rounded-lg border border-border/70 bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
              Prev
            </button>
            <span className="px-2 text-xs font-medium text-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 items-center gap-1 rounded-lg border border-border/70 bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Media Upload & Edit Drawer (Sheet) */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-s border-border bg-card p-0 shadow-2xl flex flex-col justify-between"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border/60">
            <SheetTitle className="text-base font-semibold">
              {editingMedia ? "Edit Media Asset" : "Upload Media Asset"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editingMedia
                ? "Update asset name, media type tag, or replace image."
                : "Upload new logos, banners, or images for your checkout payment pages."}
            </SheetDescription>
          </SheetHeader>

          <form id="media-drawer-form" onSubmit={handleSaveMedia} className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Image Preview & Upload Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Image File</label>
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/80 p-6 bg-muted/10 hover:border-primary/50 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {formUrl ? (
                  <div className="relative size-24 rounded-lg overflow-hidden border border-border/60">
                    <img src={formUrl} alt="Preview" className="size-full object-contain" />
                  </div>
                ) : (
                  <>
                    <HugeiconsIcon icon={Upload04Icon} strokeWidth={1.5} className="size-8 text-primary" />
                    <p className="text-xs font-medium text-foreground">Click or drag image to upload</p>
                    <p className="text-[0.6875rem] text-muted-foreground">PNG, JPG, SVG, WebP (max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Asset Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">File Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. main-logo.png"
                required
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>

            {/* Media Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Media Type</label>
              <Select value={formType} onValueChange={(v) => v && setFormType(v as MediaItem["type"])}>
                <SelectTrigger className="w-full h-9 text-xs bg-card border-border/80 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Logo">Logo</SelectItem>
                  <SelectItem value="Banner">Banner</SelectItem>
                  <SelectItem value="Product">Product Image</SelectItem>
                  <SelectItem value="Icon">Icon</SelectItem>
                  <SelectItem value="General">General Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>

          <SheetFooter className="p-6 pt-4 border-t border-border/60 flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setDrawerOpen(false)}
              className="flex-1 h-9 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="media-drawer-form"
              disabled={isSubmitting}
              className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium cursor-pointer relative"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce" />
                </div>
              ) : editingMedia ? (
                "Save Changes"
              ) : (
                "Upload Asset"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground">Delete Media Asset</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure you want to delete <span className="font-semibold text-foreground">{mediaToDelete?.name}</span>? This will permanently remove it from your hosted assets.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row gap-2.5 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setMediaToDelete(null)
              }}
              className="h-9 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-medium cursor-pointer"
            >
              Yes, Delete Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===================== SETTINGS (Payment Pages) =====================
interface PaymentPageSettings {
  ppDefaultCurrency: string
  ppAutoRedirect: boolean
  ppCollectCustomerInfo: boolean
  ppShowLogo: boolean
  ppEnableNotifications: boolean
  ppRequirePhone: boolean
  ppRequireEmail: boolean
  ppAllowTips: boolean
  ppShowProgressBar: boolean
}

export function PaymentPages_Settings() {
  const [settings, setSettings] = React.useState<PaymentPageSettings>({
    ppDefaultCurrency: "TZS",
    ppAutoRedirect: true,
    ppCollectCustomerInfo: true,
    ppShowLogo: true,
    ppEnableNotifications: true,
    ppRequirePhone: false,
    ppRequireEmail: false,
    ppAllowTips: false,
    ppShowProgressBar: true,
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)
  const [originalSettings, setOriginalSettings] = React.useState<string>("")

  async function fetchSettings() {
    setLoading(true)
    try {
      const res = await api.get<any>("/settings")
      if (res.success && res.data) {
        const s = res.data
        const mapped: PaymentPageSettings = {
          ppDefaultCurrency: s.ppDefaultCurrency || "TZS",
          ppAutoRedirect: s.ppAutoRedirect ?? true,
          ppCollectCustomerInfo: s.ppCollectCustomerInfo ?? true,
          ppShowLogo: s.ppShowLogo ?? true,
          ppEnableNotifications: s.ppEnableNotifications ?? true,
          ppRequirePhone: s.ppRequirePhone ?? false,
          ppRequireEmail: s.ppRequireEmail ?? false,
          ppAllowTips: s.ppAllowTips ?? false,
          ppShowProgressBar: s.ppShowProgressBar ?? true,
        }
        setSettings(mapped)
        setOriginalSettings(JSON.stringify(mapped))
        setHasChanges(false)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSettings()
  }, [])

  function updateSetting<K extends keyof PaymentPageSettings>(key: K, value: PaymentPageSettings[K]) {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      setHasChanges(JSON.stringify(next) !== originalSettings)
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await api.patch<any>("/settings", settings)
      if (res.success) {
        setOriginalSettings(JSON.stringify(settings))
        setHasChanges(false)
        toast.add({
          type: "success",
          title: "Settings Saved",
          description: "Payment page configurations have been updated.",
        })
      } else {
        toast.add({ type: "error", title: "Save Failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Could not save settings." })
    } finally {
      setSaving(false)
    }
  }

  const checkboxOptions: {
    key: keyof PaymentPageSettings
    label: string
    desc: string
    icon: typeof BellRingIcon
  }[] = [
    {
      key: "ppAutoRedirect",
      label: "Auto-redirect after payment",
      desc: "Instantly route customers to the success redirect URL after payment verification.",
      icon: CreditCardIcon,
    },
    {
      key: "ppCollectCustomerInfo",
      label: "Collect customer details",
      desc: "Request customer name, phone number, and email at checkout.",
      icon: UserCircle02IconAlt,
    },
    {
      key: "ppShowLogo",
      label: "Display business logo",
      desc: "Show your branded logo on hosted payment pages.",
      icon: EyeIcon,
    },
    {
      key: "ppEnableNotifications",
      label: "Real-time payment alerts",
      desc: "Receive immediate notifications when new payments are settled.",
      icon: BellRingIcon,
    },
    {
      key: "ppRequirePhone",
      label: "Require phone number",
      desc: "Force customers to provide a valid phone number before checkout.",
      icon: SmartPhone01Icon,
    },
    {
      key: "ppRequireEmail",
      label: "Require email address",
      desc: "Force customers to provide a valid email before checkout.",
      icon: Mail02Icon,
    },
    {
      key: "ppAllowTips",
      label: "Allow customer tips",
      desc: "Let customers add an optional tip amount at checkout.",
      icon: GiftIcon,
    },
    {
      key: "ppShowProgressBar",
      label: "Show checkout progress bar",
      desc: "Display a visual progress indicator during the checkout flow.",
      icon: Progress02Icon,
    },
  ]

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Centered Container */}
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Payment Page Settings</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Configure global defaults, branding, currency, and checkout behavior for all your hosted payment pages.
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card">
            <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* General Settings Card */}
            <div className="rounded-xl border border-border/60 bg-card p-6 space-y-5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={Coins01Icon} strokeWidth={2} className="size-3.5" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">General Preferences</h2>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Default Currency</label>
                <Select
                  value={settings.ppDefaultCurrency}
                  onValueChange={(v) => v && updateSetting("ppDefaultCurrency", v)}
                >
                  <SelectTrigger className="w-full h-9 text-xs bg-card border-border/80 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TZS">TZS — Tanzanian Shilling</SelectItem>
                    <SelectItem value="USD">USD — US Dollar</SelectItem>
                    <SelectItem value="KES">KES — Kenyan Shilling</SelectItem>
                    <SelectItem value="UGX">UGX — Ugandan Shilling</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[0.6875rem] text-muted-foreground">
                  Applied to all new payment pages unless overridden individually.
                </p>
              </div>
            </div>

            {/* Checkout Features Card */}
            <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} className="size-3.5" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">Checkout Features</h2>
              </div>

              <div className="divide-y divide-border/40">
                {checkboxOptions.map((opt) => (
                  <div
                    key={opt.key}
                    className="flex items-start justify-between gap-3 py-3.5 cursor-pointer select-none group"
                    onClick={() => updateSetting(opt.key, !settings[opt.key])}
                  >
                    <div className="flex items-start gap-3 space-y-0.5 flex-1 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <HugeiconsIcon icon={opt.icon} strokeWidth={2} className="size-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-foreground block">{opt.label}</span>
                        <p className="text-[0.6875rem] text-muted-foreground leading-relaxed">{opt.desc}</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={settings[opt.key] as boolean}
                      onCheckedChange={(val) => updateSetting(opt.key, val as boolean)}
                      className="mt-0.5 size-4.5 shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="h-10 gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6 text-xs font-medium cursor-pointer relative min-w-[180px]"
              >
                {saving ? (
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.3s]" />
                    <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.15s]" />
                    <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce" />
                    <span className="ml-1">Saving...</span>
                  </div>
                ) : (
                  <>
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />
                    <span>{hasChanges ? "Save Changes" : "All Changes Saved"}</span>
                  </>
                )}
              </Button>
              {hasChanges && (
                <p className="text-[0.6875rem] text-amber-500 font-medium">
                  You have unsaved changes
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ===================== PROFILES (Payment Pages) =====================
type ProfileStatus = "pending" | "under_review" | "accepted" | "rejected"

interface ProfileComment {
  id: string
  text: string
  isAdminComment: boolean
  createdAt: string
  user: {
    firstName: string
    lastName: string
    role: string
  }
}

interface MerchantProfile {
  id: string
  userId: string
  name: string
  businessName: string | null
  email: string | null
  phone: string | null
  logoUrl: string | null
  description: string | null
  websiteUrl: string | null
  brandColor: string | null
  language: string | null
  paymentMethods: string | null
  redirectUrl: string | null
  webhookUrl: string | null
  requireEmail: boolean
  status: ProfileStatus
  adminComment: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
  comments: ProfileComment[]
}

const statusColors: Record<ProfileStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  under_review: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
}

export function PaymentPages_Profiles() {
  const [profiles, setProfiles] = React.useState<MerchantProfile[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<ProfileStatus | "all">("all")
  const [filterOpen, setFilterOpen] = React.useState(false)

  // View / comment
  const [viewProfile, setViewProfile] = React.useState<MerchantProfile | null>(null)
  const [newComment, setNewComment] = React.useState("")

  // Create / edit
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<"create" | "edit">("create")
  const [editingProfile, setEditingProfile] = React.useState<MerchantProfile | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    logoUrl: "",
    description: "",
    websiteUrl: "",
    brandColor: "#FF6600",
    language: "English",
    paymentMethods: "MOBILE,CARD",
    redirectUrl: "",
    webhookUrl: "",
    requireEmail: false,
  })
  const [logoUploading, setLogoUploading] = React.useState(false)

  async function fetchProfiles() {
    setLoading(true)
    try {
      const res = await api.get<any>("/merchant-profiles")
      if (res.success && Array.isArray(res.data)) setProfiles(res.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchProfiles()
  }, [])

  const filteredProfiles = React.useMemo(() => {
    return profiles.filter((p) => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.businessName || "").toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q) ||
        (p.phone || "").includes(q)
      return matchStatus && matchSearch
    })
  }, [profiles, search, statusFilter])

  function openCreate() {
    setDrawerMode("create")
    setEditingProfile(null)
    setForm({
      name: "",
      businessName: "",
      email: "",
      phone: "",
      logoUrl: "",
      description: "",
      websiteUrl: "",
      brandColor: "#FF6600",
      language: "English",
      paymentMethods: "MOBILE,CARD",
      redirectUrl: "",
      webhookUrl: "",
      requireEmail: false,
    })
    setDrawerOpen(true)
  }

  function openEdit(p: MerchantProfile) {
    setDrawerMode("edit")
    setEditingProfile(p)
    setForm({
      name: p.name,
      businessName: p.businessName || "",
      email: p.email || "",
      phone: p.phone || "",
      logoUrl: p.logoUrl || "",
      description: p.description || "",
      websiteUrl: p.websiteUrl || "",
      brandColor: p.brandColor || "#FF6600",
      language: p.language || "English",
      paymentMethods: p.paymentMethods || "MOBILE,CARD",
      redirectUrl: p.redirectUrl || "",
      webhookUrl: p.webhookUrl || "",
      requireEmail: p.requireEmail || false,
    })
    setDrawerOpen(true)
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      let res: any
      if (drawerMode === "create") {
        res = await api.post<any>("/merchant-profiles", form)
      } else {
        res = await api.patch<any>(`/merchant-profiles/${editingProfile?.id}`, form)
      }
      if (res.success) {
        toast.add({
          type: "success",
          title: drawerMode === "create" ? "Profile Created" : "Profile Updated",
          description: drawerMode === "create"
            ? "Your profile has been submitted for admin review."
            : "Profile resubmitted for admin review.",
        })
        setDrawerOpen(false)
        fetchProfiles()
      } else {
        toast.add({ type: "error", title: "Save Failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Could not save profile." })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this merchant profile?")) return
    try {
      const res = await api.delete<any>(`/merchant-profiles/${id}`)
      if (res.success) {
        toast.add({ type: "success", title: "Deleted", description: "Profile removed." })
        fetchProfiles()
      } else {
        toast.add({ type: "error", title: "Delete Failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Could not delete profile." })
    }
  }

  async function handleAddComment() {
    if (!viewProfile || !newComment.trim()) return
    try {
      const res = await api.post<any>(`/merchant-profiles/${viewProfile.id}/comments`, { text: newComment.trim() })
      if (res.success) {
        setNewComment("")
        const refreshed = await api.get<any>(`/merchant-profiles/${viewProfile.id}`)
        if (refreshed.success) {
          setViewProfile(refreshed.data)
          setProfiles((prev) => prev.map((p) => (p.id === viewProfile.id ? refreshed.data : p)))
        }
      } else {
        toast.add({ type: "error", title: "Comment Failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Could not add comment." })
    }
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Merchant Profiles</h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and track your merchant profiles. Profiles are reviewed and accepted by an admin before use.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setFilterOpen(true)}
            className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-3.5" />
            <span>Filters</span>
          </Button>
          <Button
            onClick={openCreate}
            className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
            <span>New Profile</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search profiles by name, business, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-9 text-xs bg-card border-border/70 rounded-lg"
        />
      </div>

      {/* Profile List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-border/60 bg-card text-center p-6 space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon icon={UserAccountIcon} strokeWidth={2} className="size-6" />
          </div>
          <h3 className="text-sm font-medium text-foreground">No merchant profiles yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Submit your business profile for admin review. Once accepted, you can link it to payment pages.
          </p>
          <Button onClick={openCreate} className="h-9 rounded-lg bg-primary text-primary-foreground text-xs font-medium cursor-pointer">
            Create First Profile
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="group rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary overflow-hidden">
                    {profile.logoUrl ? (
                      <img src={profile.logoUrl} alt={profile.name} className="size-full object-cover" />
                    ) : (
                      <HugeiconsIcon icon={UserAccountIcon} strokeWidth={2} className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{profile.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{profile.businessName || "No business name"}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[0.625rem] font-semibold capitalize ${statusColors[profile.status]}`}>
                  {profile.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                {profile.email && (
                  <div className="flex items-center gap-2 truncate">
                    <HugeiconsIcon icon={Mail02Icon} strokeWidth={2} className="size-3.5 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2 truncate">
                    <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-3.5 shrink-0" />
                    <span className="truncate">{profile.phone}</span>
                  </div>
                )}
                {profile.adminComment && (
                  <div className="flex items-start gap-2">
                    <HugeiconsIcon icon={Comment01Icon} strokeWidth={2} className="size-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 italic">{profile.adminComment}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewProfile(profile)}
                  className="h-8 gap-1.5 text-xs font-medium text-primary hover:bg-primary/10 cursor-pointer"
                >
                  <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3.5" />
                  <span>View & Comment</span>
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(profile)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(profile.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 cursor-pointer"
                  >
                    <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Sidebar */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="right" className="w-full max-w-sm p-0 bg-card border-l border-border/60">
          <SheetHeader className="p-5 border-b border-border/60">
            <SheetTitle className="text-sm font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-4" />
              Filter Profiles
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Narrow down your merchant profiles by review status.
            </SheetDescription>
          </SheetHeader>
          <div className="p-5 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Review Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(["all", "pending", "under_review", "accepted", "rejected"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`h-9 rounded-lg border text-xs font-medium transition-colors ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border/70 hover:border-primary/40"
                    }`}
                  >
                    {s === "all" ? "All" : s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Search Term</label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to filter..."
                className="h-9 text-xs bg-card border-border/70"
              />
            </div>
          </div>
          <SheetFooter className="p-5 border-t border-border/60 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearch("")
                setStatusFilter("all")
              }}
              className="h-9 text-xs font-medium rounded-lg border-border/70"
            >
              Reset
            </Button>
            <Button onClick={() => setFilterOpen(false)} className="h-9 text-xs font-medium rounded-lg bg-primary text-primary-foreground">
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View & Comment Sheet */}
      <Sheet open={!!viewProfile} onOpenChange={(o) => !o && setViewProfile(null)}>
        <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
          {viewProfile && (
            <>
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="text-sm font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={UserAccountIcon} strokeWidth={2} className="size-4" />
                  {viewProfile.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Review details and conversation for this profile.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary overflow-hidden">
                    {viewProfile.logoUrl ? (
                      <img src={viewProfile.logoUrl} alt={viewProfile.name} className="size-full object-cover" />
                    ) : (
                      <HugeiconsIcon icon={UserAccountIcon} strokeWidth={2} className="size-7" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{viewProfile.businessName || viewProfile.name}</h3>
                    <Badge variant="outline" className={`text-[0.625rem] font-semibold mt-1 capitalize ${statusColors[viewProfile.status]}`}>
                      {viewProfile.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                  {viewProfile.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={Mail02Icon} strokeWidth={2} className="size-3.5" />
                      <span>{viewProfile.email}</span>
                    </div>
                  )}
                  {viewProfile.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-3.5" />
                      <span>{viewProfile.phone}</span>
                    </div>
                  )}
                  {viewProfile.description && (
                    <div className="pt-2 border-t border-border/40 text-foreground leading-relaxed">
                      {viewProfile.description}
                    </div>
                  )}
                </div>

                {viewProfile.adminComment && (
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                      <HugeiconsIcon icon={Comment01Icon} strokeWidth={2} className="size-3.5" />
                      <span>Admin Review Note</span>
                    </div>
                    <p className="text-xs text-amber-800/80 leading-relaxed">{viewProfile.adminComment}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <HugeiconsIcon icon={Comment01Icon} strokeWidth={2} className="size-3.5" />
                    Comments ({viewProfile.comments?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {(viewProfile.comments || []).length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No comments yet. Start the conversation below.</p>
                    ) : (
                      viewProfile.comments.map((c) => (
                        <div key={c.id} className={`rounded-xl p-3.5 text-xs ${c.isAdminComment ? "bg-primary/5 border border-primary/10" : "bg-muted/40 border border-border/40"}`}>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-semibold text-foreground">
                              {c.user?.firstName} {c.user?.lastName}
                              {c.isAdminComment && <span className="ml-1.5 text-[0.625rem] text-primary">(Admin)</span>}
                            </span>
                            <span className="text-[0.625rem] text-muted-foreground">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                      placeholder="Write a comment..."
                      className="h-10 text-xs bg-card border-border/70 rounded-lg flex-1"
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()} className="h-10 w-10 p-0 rounded-lg bg-primary text-primary-foreground">
                      <HugeiconsIcon icon={SentIcon} strokeWidth={2} className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create / Edit Sheet */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
          <SheetHeader className="p-5 border-b border-border/60">
            <SheetTitle className="text-sm font-semibold">
              {drawerMode === "create" ? "New Merchant Profile" : "Edit Profile"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {drawerMode === "create"
                ? "Submit your business profile for admin review."
                : "Resubmit your updated profile for admin review."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Business Logo</label>
              <div className="flex items-center gap-4">
                <div className="relative size-20 shrink-0 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 overflow-hidden flex items-center justify-center">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Logo" className="size-full object-cover" />
                  ) : (
                    <HugeiconsIcon icon={Image02Icon} strokeWidth={1.5} className="size-7 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="flex items-center justify-center gap-1.5 h-9 rounded-lg border border-border/70 bg-card text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors">
                    <HugeiconsIcon icon={Upload04Icon} strokeWidth={2} className="size-3.5" />
                    <span>{logoUploading ? "Uploading..." : "Upload Logo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setLogoUploading(true)
                        const reader = new FileReader()
                        reader.onload = () => {
                          setForm((p) => ({ ...p, logoUrl: reader.result as string }))
                          setLogoUploading(false)
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, logoUrl: "" }))}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3" />
                      Remove
                    </button>
                  )}
                  <p className="text-[0.625rem] text-muted-foreground">PNG, JPG or SVG. Recommended 256x256px.</p>
                </div>
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Business Name *</label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Acme Electronics"
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>

            {/* Website URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Website URL</label>
              <Input
                type="url"
                value={form.websiteUrl}
                onChange={(e) => setForm((p) => ({ ...p, websiteUrl: e.target.value }))}
                placeholder="https://example.com"
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>

            {/* Brand Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Brand Color</label>
              <div className="flex items-center gap-2">
                <div className="relative size-9 shrink-0 rounded-lg border border-border/80 overflow-hidden">
                  <input
                    type="color"
                    value={form.brandColor}
                    onChange={(e) => setForm((p) => ({ ...p, brandColor: e.target.value }))}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                  <div className="size-full" style={{ backgroundColor: form.brandColor }} />
                </div>
                <Input
                  value={form.brandColor}
                  onChange={(e) => setForm((p) => ({ ...p, brandColor: e.target.value }))}
                  placeholder="#FF6600"
                  className="h-9 text-xs bg-card border-border/80 rounded-lg flex-1 font-mono"
                />
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Checkout Language</label>
              <Select
                value={form.language}
                onValueChange={(v) => v && setForm((p) => ({ ...p, language: v }))}
              >
                <SelectTrigger className="w-full h-9 text-xs bg-card border-border/80 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Swahili">Swahili</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                  <SelectItem value="Portuguese">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Accepted Payment Methods</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "MOBILE", label: "Mobile Money" },
                  { value: "CARD", label: "Card" },
                  { value: "BANK", label: "Bank Transfer" },
                  { value: "CASH", label: "Cash" },
                ].map((pm) => {
                  const methods = form.paymentMethods.split(",").filter(Boolean)
                  const checked = methods.includes(pm.value)
                  return (
                    <label
                      key={pm.value}
                      className={`flex items-center gap-2 h-9 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                        checked
                          ? "border-primary/40 bg-primary/5 text-primary"
                          : "border-border/70 bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          const next = v
                            ? [...methods, pm.value]
                            : methods.filter((m) => m !== pm.value)
                          setForm((p) => ({ ...p, paymentMethods: next.join(",") }))
                        }}
                        className="size-3.5"
                      />
                      <span>{pm.label}</span>
                      {pm.value === "CARD" && (
                        <span className="ml-auto text-[0.5625rem] text-muted-foreground italic">Soon</span>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Redirect URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Redirect URL</label>
              <Input
                type="url"
                value={form.redirectUrl}
                onChange={(e) => setForm((p) => ({ ...p, redirectUrl: e.target.value }))}
                placeholder="https://example.com/thank-you"
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
              <p className="text-[0.625rem] text-muted-foreground">Where to send customers after payment</p>
            </div>

            {/* Webhook URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Webhook URL</label>
              <Input
                type="url"
                value={form.webhookUrl}
                onChange={(e) => setForm((p) => ({ ...p, webhookUrl: e.target.value }))}
                placeholder="https://example.com/webhooks"
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>

            {/* Require Email */}
            <label className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.requireEmail}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, requireEmail: !!v }))}
                  className="size-4"
                />
                <span className="text-xs font-medium text-foreground">Require customer email at checkout</span>
              </div>
            </label>

            {/* Contact Info Divider */}
            <div className="pt-2 border-t border-border/40">
              <h3 className="text-xs font-semibold text-foreground mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="support@business.com"
                    className="h-9 text-xs bg-card border-border/80 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Phone</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+255 700 000 000"
                    className="h-9 text-xs bg-card border-border/80 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description of your business..."
                className="min-h-[80px] w-full rounded-lg border border-border/70 bg-card p-3 text-xs text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </form>
          <SheetFooter className="p-5 border-t border-border/60 gap-2">
            <Button type="button" variant="outline" onClick={() => setDrawerOpen(false)} className="h-9 text-xs font-medium rounded-lg border-border/70">
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={!form.name.trim() || saving}
              className="h-9 text-xs font-medium rounded-lg bg-primary text-primary-foreground"
            >
              {saving ? (
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce" />
                </div>
              ) : (
                <>
                  <HugeiconsIcon icon={drawerMode === "create" ? PlusIcon : TickIconAlt} strokeWidth={2} className="size-3.5 mr-1.5" />
                  {drawerMode === "create" ? "Submit for Review" : "Update & Resubmit"}
                </>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ===================== STORAGE =====================
interface StorageCabinet {
  id: string
  name: string
  type: "images" | "documents" | "media" | "archives" | "secure"
  fileCount: number
  size: string
  sizePercent: number
  lastUpdated: string
  status: "active" | "archived" | "locked"
}

const cabinetTypeConfig: Record<
  StorageCabinet["type"],
  { icon: typeof CloudIcon; color: string; bg: string; label: string }
> = {
  images: { icon: Image02Icon, color: "text-blue-500", bg: "bg-blue-500/10", label: "Images" },
  documents: { icon: File01Icon, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Documents" },
  media: { icon: CloudIcon, color: "text-purple-500", bg: "bg-purple-500/10", label: "Media" },
  archives: { icon: ArchiveIcon, color: "text-amber-500", bg: "bg-amber-500/10", label: "Archives" },
  secure: { icon: FileLockIcon, color: "text-rose-500", bg: "bg-rose-500/10", label: "Secure" },
}

const cabinetStatusColors: Record<StorageCabinet["status"], string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  archived: "bg-muted text-muted-foreground border-border/40",
  locked: "bg-rose-500/10 text-rose-600 border-rose-500/20",
}

export function PaymentPages_Storage() {
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<StorageCabinet["type"] | "all">("all")
  const [statusFilter, setStatusFilter] = React.useState<StorageCabinet["status"] | "all">("all")
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [viewCabinet, setViewCabinet] = React.useState<StorageCabinet | null>(null)

  const cabinets: StorageCabinet[] = [
    { id: "1", name: "Product Images", type: "images", fileCount: 48, size: "12.4 MB", sizePercent: 35, lastUpdated: "25 Aug 2026", status: "active" },
    { id: "2", name: "Business Documents", type: "documents", fileCount: 12, size: "3.2 MB", sizePercent: 9, lastUpdated: "24 Aug 2026", status: "active" },
    { id: "3", name: "Checkout Media", type: "media", fileCount: 24, size: "8.7 MB", sizePercent: 24, lastUpdated: "23 Aug 2026", status: "active" },
    { id: "4", name: "Receipt Archives", type: "archives", fileCount: 156, size: "5.1 MB", sizePercent: 14, lastUpdated: "20 Aug 2026", status: "archived" },
    { id: "5", name: "Secure Vault", type: "secure", fileCount: 6, size: "1.8 MB", sizePercent: 5, lastUpdated: "22 Aug 2026", status: "locked" },
    { id: "6", name: "Logo Assets", type: "images", fileCount: 8, size: "2.3 MB", sizePercent: 6, lastUpdated: "21 Aug 2026", status: "active" },
    { id: "7", name: "Webhook Logs", type: "archives", fileCount: 342, size: "4.6 MB", sizePercent: 13, lastUpdated: "25 Aug 2026", status: "archived" },
    { id: "8", name: "KYC Documents", type: "secure", fileCount: 4, size: "0.9 MB", sizePercent: 3, lastUpdated: "18 Aug 2026", status: "locked" },
  ]

  const filteredCabinets = React.useMemo(() => {
    return cabinets.filter((c) => {
      const matchType = typeFilter === "all" || c.type === typeFilter
      const matchStatus = statusFilter === "all" || c.status === statusFilter
      const q = search.toLowerCase()
      const matchSearch = !q || c.name.toLowerCase().includes(q)
      return matchType && matchStatus && matchSearch
    })
  }, [cabinets, search, typeFilter, statusFilter])

  const totalFiles = cabinets.reduce((sum, c) => sum + c.fileCount, 0)
  const totalSize = "38.0 MB"
  const quotaPercent = 3.8

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Storage & Cabinets</h1>
          <p className="text-sm text-muted-foreground">
            Organize and manage your file storage cabinets, digital assets, and bandwidth usage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setFilterOpen(true)}
            className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-3.5" />
            <span>Filters</span>
          </Button>
          <Button
            className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={Upload04Icon} strokeWidth={2} className="size-3.5" />
            <span>Upload</span>
          </Button>
        </div>
      </div>

      {/* Storage Overview Bar */}
      <div className="rounded-xl border border-border/60 bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={HardDriveIconAlt} strokeWidth={2} className="size-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">Total Storage</span>
              <p className="text-[0.6875rem] text-muted-foreground">{totalFiles} files across {cabinets.length} cabinets</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-foreground tabular-nums">{totalSize}</span>
            <p className="text-[0.6875rem] text-muted-foreground">of 1 GB</p>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${quotaPercent}%` }} />
        </div>
        <div className="flex items-center justify-between text-[0.6875rem] text-muted-foreground">
          <span>{quotaPercent}% used</span>
          <span>{(100 - quotaPercent).toFixed(1)}% available</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search cabinets by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-9 text-xs bg-card border-border/70 rounded-lg"
        />
      </div>

      {/* Cabinets Grid */}
      {filteredCabinets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 rounded-xl border border-dashed border-border/60 bg-card text-center p-6 space-y-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
            <HugeiconsIcon icon={Cabinet01Icon} strokeWidth={2} className="size-5" />
          </div>
          <h3 className="text-sm font-medium text-foreground">No cabinets found</h3>
          <p className="text-xs text-muted-foreground">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCabinets.map((cabinet) => {
            const cfg = cabinetTypeConfig[cabinet.type]
            return (
              <div
                key={cabinet.id}
                onClick={() => setViewCabinet(cabinet)}
                className="group rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.color}`}>
                      <HugeiconsIcon icon={cfg.icon} strokeWidth={2} className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{cabinet.name}</h3>
                      <p className="text-[0.6875rem] text-muted-foreground">{cfg.label}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[0.625rem] font-semibold capitalize ${cabinetStatusColors[cabinet.status]}`}>
                    {cabinet.status}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{cabinet.fileCount} files</span>
                    <span className="font-medium text-foreground tabular-nums">{cabinet.size}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cabinet.sizePercent > 25 ? "bg-amber-500" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(cabinet.sizePercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[0.6875rem] text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3" />
                      {cabinet.lastUpdated}
                    </span>
                    <span className="group-hover:text-primary transition-colors font-medium">View →</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Filter Sidebar */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="right" className="w-full max-w-sm p-0 bg-card border-l border-border/60">
          <SheetHeader className="p-5 border-b border-border/60">
            <SheetTitle className="text-sm font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-4" />
              Filter Cabinets
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Narrow down storage cabinets by type and status.
            </SheetDescription>
          </SheetHeader>
          <div className="p-5 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Cabinet Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["all", "images", "documents", "media", "archives", "secure"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`h-9 rounded-lg border text-xs font-medium transition-colors capitalize ${
                      typeFilter === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border/70 hover:border-primary/40"
                    }`}
                  >
                    {t === "all" ? "All Types" : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(["all", "active", "archived", "locked"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`h-9 rounded-lg border text-xs font-medium transition-colors capitalize ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border/70 hover:border-primary/40"
                    }`}
                  >
                    {s === "all" ? "All" : s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Search Term</label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to filter..."
                className="h-9 text-xs bg-card border-border/70"
              />
            </div>
          </div>
          <SheetFooter className="p-5 border-t border-border/60 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearch("")
                setTypeFilter("all")
                setStatusFilter("all")
              }}
              className="h-9 text-xs font-medium rounded-lg border-border/70"
            >
              Reset
            </Button>
            <Button onClick={() => setFilterOpen(false)} className="h-9 text-xs font-medium rounded-lg bg-primary text-primary-foreground">
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Cabinet Detail Sheet */}
      <Sheet open={!!viewCabinet} onOpenChange={(o) => !o && setViewCabinet(null)}>
        <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
          {viewCabinet && (
            <>
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="text-sm font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={Cabinet01Icon} strokeWidth={2} className="size-4" />
                  {viewCabinet.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Cabinet details and storage breakdown.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${cabinetTypeConfig[viewCabinet.type].bg} ${cabinetTypeConfig[viewCabinet.type].color}`}>
                    <HugeiconsIcon icon={cabinetTypeConfig[viewCabinet.type].icon} strokeWidth={2} className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{viewCabinet.name}</h3>
                    <Badge variant="outline" className={`text-[0.625rem] font-semibold mt-1 capitalize ${cabinetStatusColors[viewCabinet.status]}`}>
                      {viewCabinet.status}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground">{cabinetTypeConfig[viewCabinet.type].label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Files</span>
                    <span className="font-medium text-foreground tabular-nums">{viewCabinet.fileCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium text-foreground tabular-nums">{viewCabinet.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium text-foreground">{viewCabinet.lastUpdated}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Storage Usage</span>
                    <span className="text-muted-foreground">{viewCabinet.sizePercent}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${viewCabinet.sizePercent > 25 ? "bg-amber-500" : "bg-primary"}`}
                      style={{ width: `${Math.min(viewCabinet.sizePercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="h-9 flex-1 text-xs font-medium rounded-lg border-border/70 gap-1.5">
                    <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
                    Download All
                  </Button>
                  {viewCabinet.status !== "locked" && (
                    <Button variant="outline" className="h-9 flex-1 text-xs font-medium rounded-lg border-border/70 gap-1.5">
                      <HugeiconsIcon icon={Upload04Icon} strokeWidth={2} className="size-3.5" />
                      Add Files
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ===================== RECORDS =====================
interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string | null
  resourceId: string | null
  metadata: string | null
  ipAddress: string | null
  createdAt: string
}

const actionLabels: Record<string, { label: string; color: string }> = {
  "product.created": { label: "Product Created", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  "product.updated": { label: "Product Updated", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  "product.deleted": { label: "Product Deleted", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  "category.created": { label: "Category Created", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  "category.updated": { label: "Category Updated", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  "category.deleted": { label: "Category Deleted", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  "profile.created": { label: "Profile Submitted", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  "profile.updated": { label: "Profile Updated", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  "profile.deleted": { label: "Profile Deleted", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  "profile.commented": { label: "Profile Comment", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  "profile.pending": { label: "Profile Pending", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  "profile.under_review": { label: "Under Review", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  "profile.accepted": { label: "Profile Accepted", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  "profile.rejected": { label: "Profile Rejected", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  "payment_page.created": { label: "Payment Page Created", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  "payment_page.updated": { label: "Payment Page Updated", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  "payment_page.deleted": { label: "Payment Page Deleted", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  "settings.updated": { label: "Settings Updated", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
}

const resourceLabels: Record<string, string> = {
  product: "Product",
  category: "Category",
  merchant_profile: "Merchant Profile",
  payment_page: "Payment Page",
  user_settings: "Settings",
  delivery: "Delivery",
}

function formatTimestamp(dateStr: string) {
  const d = new Date(dateStr)
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    relative: getRelativeTime(d),
  }
}

function getRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
}

export function PaymentPages_Records() {
  const [logs, setLogs] = React.useState<AuditLog[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [search, setSearch] = React.useState("")
  const [resourceFilter, setResourceFilter] = React.useState<string>("all")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  const [viewLog, setViewLog] = React.useState<AuditLog | null>(null)
  const limit = 15

  const resourceTabs = ["all", "product", "category", "merchant_profile", "payment_page", "user_settings", "delivery"] as const

  async function fetchLogs(p = 1) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) })
      if (resourceFilter !== "all") params.set("resource", resourceFilter)
      if (search) params.set("search", search)
      if (dateRange?.from) {
        params.set("from", (dateRange.from as Date).toISOString().split("T")[0] || "")
      }
      if (dateRange?.to) {
        const t = new Date(dateRange.to as Date)
        t.setHours(23, 59, 59, 999)
        params.set("to", t.toISOString().split("T")[0] || "")
      }
      const res = await api.get<any>(`/audit-logs?${params.toString()}`)
      if (res.success && Array.isArray(res.data)) {
        setLogs(res.data)
        if (res.meta) {
          setPage(res.meta.page || p)
          setTotalPages(res.meta.totalPages || 1)
          setTotal(res.meta.total || 0)
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchLogs(1)
  }, [resourceFilter, dateRange])

  React.useEffect(() => {
    const timer = setTimeout(() => fetchLogs(1), 400)
    return () => clearTimeout(timer)
  }, [search])

  function resetFilters() {
    setSearch("")
    setResourceFilter("all")
    setDateRange(undefined)
  }

  const hasActiveFilters = resourceFilter !== "all" || search || !!dateRange?.from

  const dateLabel = dateRange?.from && dateRange?.to
    ? `${dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} — ${dateRange.to.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
    : dateRange?.from
    ? `${dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} — …`
    : "Date Range"

  function handleExport() {
    if (logs.length === 0) return
    const headers = ["Action", "Resource", "Resource ID", "IP Address", "Timestamp"]
    const rows = logs.map((l) => [
      actionLabels[l.action]?.label || l.action,
      resourceLabels[l.resource || ""] || l.resource || "",
      l.resourceId || "",
      l.ipAddress || "",
      new Date(l.createdAt).toISOString(),
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add({ type: "success", title: "Export Complete", description: "Audit logs CSV downloaded." })
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Activity Records</h1>
          <p className="text-sm text-muted-foreground">
            Complete audit trail of all actions across your payment pages — products, categories, profiles, settings, and more.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={logs.length === 0}
          className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer shrink-0"
        >
          <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, resource, or reference ID..."
            className="pl-9 h-9 text-xs bg-card border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {/* Resource Tabs */}
          {resourceTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setResourceFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                resourceFilter === tab
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab === "all" ? "All" : resourceLabels[tab] || tab}
            </button>
          ))}

          {/* Date Range Picker */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                dateRange?.from
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : "border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
              <span>{dateLabel}</span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-3">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="rounded-lg"
              />
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 mt-2">
                <span className="text-xs text-muted-foreground">
                  {dateRange?.from && dateRange?.to
                    ? `${dateRange.from.toLocaleDateString("en-GB")} → ${dateRange.to.toLocaleDateString("en-GB")}`
                    : "Select a date range"}
                </span>
                <div className="flex gap-1.5">
                  {dateRange?.from && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDateRange(undefined)}
                      className="h-7 px-2 text-xs rounded-md border-border/70"
                    >
                      Clear
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => setDatePickerOpen(false)}
                    className="h-7 px-3 text-xs rounded-md bg-primary text-primary-foreground"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer whitespace-nowrap"
            >
              <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} className="size-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Records Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-border/60 bg-card text-center p-6 space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
            <HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-6" />
          </div>
          <h3 className="text-sm font-medium text-foreground">No activity records yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Actions you take across products, categories, profiles, payment pages, and settings will appear here as an audit trail.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4 font-medium">Action</th>
                    <th className="py-3 px-4 font-medium">Resource</th>
                    <th className="py-3 px-4 font-medium">Reference ID</th>
                    <th className="py-3 px-4 font-medium">IP Address</th>
                    <th className="py-3 px-4 font-medium">Timestamp</th>
                    <th className="py-3 px-4 font-medium text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-normal">
                  {logs.map((log) => {
                    const cfg = actionLabels[log.action] || { label: log.action, color: "bg-muted text-muted-foreground border-border/40" }
                    const ts = formatTimestamp(log.createdAt)
                    return (
                      <tr
                        key={log.id}
                        onClick={() => setViewLog(log)}
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className={`text-[0.625rem] font-semibold ${cfg.color}`}>
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-foreground">
                          {resourceLabels[log.resource || ""] || log.resource || "—"}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-muted-foreground">
                          {log.resourceId ? log.resourceId.substring(0, 8) + "…" : "—"}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-muted-foreground">
                          {log.ipAddress || "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="text-foreground">{ts.date}</span>
                            <span className="text-[0.625rem] text-muted-foreground">{ts.time} · {ts.relative}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3.5 text-muted-foreground inline" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span>–
              <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of{" "}
              <span className="font-medium text-foreground">{total}</span> records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => fetchLogs(page - 1)}
                className="h-8 gap-1 border-border/70 rounded-lg text-xs font-medium cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
                <span>Prev</span>
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => fetchLogs(page + 1)}
                className="h-8 gap-1 border-border/70 rounded-lg text-xs font-medium cursor-pointer"
              >
                <span>Next</span>
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Log Detail Sheet */}
      <Sheet open={!!viewLog} onOpenChange={(o) => !o && setViewLog(null)}>
        <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
          {viewLog && (
            <>
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="text-sm font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-4" />
                  Record Details
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Full audit information for this action.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {actionLabels[viewLog.action]?.label || viewLog.action}
                    </h3>
                    <Badge variant="outline" className={`text-[0.625rem] font-semibold mt-1 ${actionLabels[viewLog.action]?.color || "bg-muted text-muted-foreground border-border/40"}`}>
                      {viewLog.action}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Resource</span>
                    <span className="font-medium text-foreground">
                      {resourceLabels[viewLog.resource || ""] || viewLog.resource || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Resource ID</span>
                    <span className="font-mono text-[0.6875rem] text-foreground">{viewLog.resourceId || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">IP Address</span>
                    <span className="font-mono text-[0.6875rem] text-foreground">{viewLog.ipAddress || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{formatTimestamp(viewLog.createdAt).date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{formatTimestamp(viewLog.createdAt).time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Relative</span>
                    <span className="font-medium text-primary">{formatTimestamp(viewLog.createdAt).relative}</span>
                  </div>
                </div>

                {viewLog.metadata && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground">Metadata</h4>
                    <pre className="rounded-xl bg-muted/40 border border-border/40 p-4 text-[0.6875rem] text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all">
                      {(() => {
                        try { return JSON.stringify(JSON.parse(viewLog.metadata!), null, 2) }
                        catch { return viewLog.metadata }
                      })()}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ===================== RECEIPTS =====================
interface ReceiptItem {
  id: string
  receiptNumber: string
  reference: string
  customerName: string
  customerPhone: string
  customerEmail: string
  amount: number
  currency: string
  fee: number
  net: number
  method: string
  channel: string
  pspRef: string
  paymentPageName: string
  paymentPageSlug: string | null
  status: string
  createdAt: string
  updatedAt: string
}

interface ReceiptDetail {
  id: string
  receiptNumber: string
  reference: string
  intentRef: string
  customer: { name: string; phone: string; email: string }
  settlement: { subtotal: number; fee: number; net: number; total: number }
  payment: { method: string; channel: string; pspRef: string; payerPhone: string }
  paymentPage: { title: string; url: string }
  dates: { paid: string; created: string }
}

function formatCurrency(amount: number, currency: string) {
  if (currency === "TSh" || currency === "TZS") {
    return `TSh ${amount.toLocaleString()}`
  }
  return `${currency} ${amount.toLocaleString()}`
}

function formatReceiptDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    relative: getRelativeTime(d),
  }
}

export function PaymentPages_Receipts() {
  const [receipts, setReceipts] = React.useState<ReceiptItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [search, setSearch] = React.useState("")
  const [methodFilter, setMethodFilter] = React.useState("ALL")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  const [viewReceipt, setViewReceipt] = React.useState<ReceiptDetail | null>(null)
  const [detailLoading, setDetailLoading] = React.useState(false)
  const limit = 15

  const methodTabs = ["ALL", "MOBILE", "CARD", "BANK", "CASH"] as const

  async function fetchReceipts(p = 1) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) })
      if (methodFilter !== "ALL") params.set("method", methodFilter)
      if (search) params.set("search", search)
      if (dateRange?.from) {
        params.set("from", (dateRange.from as Date).toISOString().split("T")[0] || "")
      }
      if (dateRange?.to) {
        const t = new Date(dateRange.to as Date)
        t.setHours(23, 59, 59, 999)
        params.set("to", t.toISOString().split("T")[0] || "")
      }
      const res = await api.get<any>(`/receipts?${params.toString()}`)
      if (res.success && Array.isArray(res.data)) {
        setReceipts(res.data)
        if (res.meta) {
          setPage(res.meta.page || p)
          setTotalPages(res.meta.totalPages || 1)
          setTotal(res.meta.total || 0)
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchReceipts(1)
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => fetchReceipts(1), 400)
    return () => clearTimeout(timer)
  }, [search, methodFilter, dateRange])

  async function openReceiptDetail(id: string) {
    setDetailLoading(true)
    setViewReceipt(null)
    try {
      const res = await api.get<any>(`/receipts/${id}`)
      if (res.success && res.data) {
        setViewReceipt(res.data)
      }
    } catch {
      // silent
    } finally {
      setDetailLoading(false)
    }
  }

  function handleExport() {
    if (receipts.length === 0) return
    const headers = ["Receipt #", "Reference", "Customer", "Phone", "Email", "Amount", "Fee", "Net", "Method", "Channel", "Payment Page", "Date"]
    const rows = receipts.map((r) => [
      r.receiptNumber,
      r.reference,
      r.customerName,
      r.customerPhone,
      r.customerEmail,
      String(r.amount),
      String(r.fee),
      String(r.net),
      r.method,
      r.channel,
      r.paymentPageName,
      new Date(r.createdAt).toISOString(),
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `receipts-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add({ type: "success", title: "Export Complete", description: "Receipts CSV downloaded." })
  }

  function resetFilters() {
    setSearch("")
    setMethodFilter("ALL")
    setDateRange(undefined)
  }

  const hasActiveFilters = methodFilter !== "ALL" || search || !!dateRange?.from

  const dateLabel = dateRange?.from && dateRange?.to
    ? `${dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} — ${dateRange.to.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
    : dateRange?.from
    ? `${dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} — …`
    : "Date Range"

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Payment Receipts</h1>
          <p className="text-sm text-muted-foreground">
            Real customer receipts from completed payments — search, filter, and view full details.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={receipts.length === 0}
          className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer shrink-0"
        >
          <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, phone, reference..."
            className="pl-9 h-9 text-xs bg-card border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {methodTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMethodFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                methodFilter === tab
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}

          {/* Date Range Picker */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                dateRange?.from
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : "border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
              <span>{dateLabel}</span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-3">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="rounded-lg"
              />
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 mt-2">
                <span className="text-xs text-muted-foreground">
                  {dateRange?.from && dateRange?.to
                    ? `${dateRange.from.toLocaleDateString("en-GB")} → ${dateRange.to.toLocaleDateString("en-GB")}`
                    : "Select a date range"}
                </span>
                <div className="flex gap-1.5">
                  {dateRange?.from && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDateRange(undefined)}
                      className="h-7 px-2 text-xs rounded-md border-border/70"
                    >
                      Clear
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => setDatePickerOpen(false)}
                    className="h-7 px-3 text-xs rounded-md bg-primary text-primary-foreground"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer whitespace-nowrap"
            >
              <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} className="size-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Receipts Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : receipts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-border/60 bg-card text-center p-6 space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
            <HugeiconsIcon icon={ReceiptIcon} strokeWidth={2} className="size-6" />
          </div>
          <h3 className="text-sm font-medium text-foreground">No receipts found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Completed customer payments will generate receipts here. Try adjusting your filters or search.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4 font-medium">Receipt #</th>
                    <th className="py-3 px-4 font-medium">Reference</th>
                    <th className="py-3 px-4 font-medium">Customer</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Method</th>
                    <th className="py-3 px-4 font-medium">Payment Page</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-normal">
                  {receipts.map((r) => {
                    const ts = formatReceiptDate(r.createdAt)
                    return (
                      <tr
                        key={r.id}
                        onClick={() => openReceiptDetail(r.id)}
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono font-medium text-foreground">{r.receiptNumber.substring(0, 16)}…</td>
                        <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-muted-foreground">{r.reference.substring(0, 14)}…</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{r.customerName}</span>
                            <span className="text-[0.625rem] text-muted-foreground">{r.customerPhone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold tabular-nums text-foreground">
                          {formatCurrency(r.amount, r.currency)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center rounded-md bg-muted/40 px-2 py-0.5 text-[0.625rem] font-medium text-foreground">
                            {r.method}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground">{r.paymentPageName}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="text-foreground">{ts.date}</span>
                            <span className="text-[0.625rem] text-muted-foreground">{ts.time}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3.5 text-muted-foreground inline" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span>–
              <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of{" "}
              <span className="font-medium text-foreground">{total}</span> receipts
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => fetchReceipts(page - 1)}
                className="h-8 gap-1 border-border/70 rounded-lg text-xs font-medium cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
                <span>Prev</span>
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => fetchReceipts(page + 1)}
                className="h-8 gap-1 border-border/70 rounded-lg text-xs font-medium cursor-pointer"
              >
                <span>Next</span>
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Receipt Detail Sheet */}
      <Sheet open={!!viewReceipt || detailLoading} onOpenChange={(o) => !o && setViewReceipt(null)}>
        <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
          {detailLoading ? (
            <div className="flex h-64 items-center justify-center">
              <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : viewReceipt ? (
            <>
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="text-sm font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={ReceiptTextIcon} strokeWidth={2} className="size-4" />
                  Receipt Details
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Full receipt information for this transaction.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Receipt Number */}
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 space-y-1">
                  <p className="text-[0.625rem] text-muted-foreground uppercase tracking-wide">Receipt Number</p>
                  <p className="text-sm font-bold text-foreground font-mono">{viewReceipt.receiptNumber}</p>
                </div>

                {/* References */}
                <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono font-medium text-foreground">{viewReceipt.reference}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Intent Ref</span>
                    <span className="font-mono font-medium text-foreground">{viewReceipt.intentRef}</span>
                  </div>
                </div>

                {/* Customer */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <HugeiconsIcon icon={UserCircle02Icon} strokeWidth={2} className="size-3.5" />
                    Customer
                  </h4>
                  <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium text-foreground">{viewReceipt.customer.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-mono font-medium text-foreground">{viewReceipt.customer.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium text-foreground">{viewReceipt.customer.email}</span>
                    </div>
                  </div>
                </div>

                {/* Settlement */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <HugeiconsIcon icon={Coins01Icon} strokeWidth={2} className="size-3.5" />
                    Settlement
                  </h4>
                  <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground tabular-nums">TSh {viewReceipt.settlement.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Fee</span>
                      <span className="font-medium text-rose-600 tabular-nums">-TSh {viewReceipt.settlement.fee.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Net</span>
                      <span className="font-medium text-emerald-600 tabular-nums">+TSh {viewReceipt.settlement.net.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-foreground tabular-nums">TSh {viewReceipt.settlement.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} className="size-3.5" />
                    Payment
                  </h4>
                  <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Method</span>
                      <span className="font-medium text-foreground">{viewReceipt.payment.method}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Channel</span>
                      <span className="font-mono font-medium text-foreground">{viewReceipt.payment.channel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">PSP Ref</span>
                      <span className="font-mono font-medium text-foreground">{viewReceipt.payment.pspRef}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Payer Phone</span>
                      <span className="font-mono font-medium text-foreground">{viewReceipt.payment.payerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Page */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} className="size-3.5" />
                    Payment Page
                  </h4>
                  <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Title</span>
                      <span className="font-medium text-foreground">{viewReceipt.paymentPage.title}</span>
                    </div>
                    {viewReceipt.paymentPage.url !== "N/A" && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">URL</span>
                        <span className="font-mono text-[0.625rem] text-primary">{viewReceipt.paymentPage.url}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium text-foreground">{formatReceiptDate(viewReceipt.dates.created).date} · {formatReceiptDate(viewReceipt.dates.created).time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-medium text-foreground">{formatReceiptDate(viewReceipt.dates.paid).date} · {formatReceiptDate(viewReceipt.dates.paid).time}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="h-9 flex-1 text-xs font-medium rounded-lg border-border/70 gap-1.5"
                  >
                    <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard?.writeText(viewReceipt.receiptNumber)
                      toast.add({ type: "success", title: "Copied", description: "Receipt number copied." })
                    }}
                    className="h-9 flex-1 text-xs font-medium rounded-lg border-border/70 gap-1.5"
                  >
                    <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
                    Copy Ref
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ===================== CONTENT DELIVERY =====================
interface DeliveryItem {
  id: string
  productName: string
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  sessionToken: string | null
  deliveryType: string
  deliveryUrl: string | null
  licenseKey: string | null
  status: string
  paymentId: string | null
  metadata: string | null
  deliveredAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

const deliveryTypeConfig: Record<string, { label: string; color: string; bg: string; icon: typeof DeliveryBoxIcon }> = {
  download: { label: "Download", color: "text-blue-500", bg: "bg-blue-500/10", icon: Download04Icon },
  link: { label: "Access Link", color: "text-purple-500", bg: "bg-purple-500/10", icon: Globe02Icon },
  license_key: { label: "License Key", color: "text-amber-500", bg: "bg-amber-500/10", icon: FileLockIcon },
  access: { label: "Access", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckmarkCircle01Icon },
}

const deliveryStatusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  failed: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  expired: "bg-muted text-muted-foreground border-border/40",
}

function formatDeliveryDate(dateStr: string | null) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  }
}

export function PaymentPages_ContentDelivery() {
  const [deliveries, setDeliveries] = React.useState<DeliveryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  const [viewDelivery, setViewDelivery] = React.useState<DeliveryItem | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<DeliveryItem | null>(null)
  const [form, setForm] = React.useState({
    productName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryType: "download" as string,
    deliveryUrl: "",
    licenseKey: "",
    sessionToken: "",
    status: "pending" as string,
  })
  const limit = 15

  async function fetchDeliveries(p = 1) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) })
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (typeFilter !== "all") params.set("deliveryType", typeFilter)
      if (search) params.set("search", search)
      if (dateRange?.from) {
        params.set("from", (dateRange.from as Date).toISOString().split("T")[0] || "")
      }
      if (dateRange?.to) {
        const t = new Date(dateRange.to as Date)
        t.setHours(23, 59, 59, 999)
        params.set("to", t.toISOString().split("T")[0] || "")
      }
      const res = await api.get<any>(`/deliveries?${params.toString()}`)
      if (res.success && Array.isArray(res.data)) {
        setDeliveries(res.data)
        if (res.meta) {
          setPage(res.meta.page || p)
          setTotalPages(res.meta.totalPages || 1)
          setTotal(res.meta.total || 0)
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchDeliveries(1)
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => fetchDeliveries(1), 400)
    return () => clearTimeout(timer)
  }, [search])

  function openCreate() {
    setEditMode(false)
    setForm({
      productName: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryType: "download",
      deliveryUrl: "",
      licenseKey: "",
      sessionToken: "",
      status: "pending",
    })
    setCreateOpen(true)
  }

  function openEdit(d: DeliveryItem) {
    setEditMode(true)
    setForm({
      productName: d.productName,
      customerName: d.customerName || "",
      customerEmail: d.customerEmail || "",
      customerPhone: d.customerPhone || "",
      deliveryType: d.deliveryType,
      deliveryUrl: d.deliveryUrl || "",
      licenseKey: d.licenseKey || "",
      sessionToken: d.sessionToken || "",
      status: d.status,
    })
    setViewDelivery(null)
    setCreateOpen(true)
  }

  async function handleSave() {
    if (!form.productName.trim()) {
      toast.add({ type: "error", title: "Product name required" })
      return
    }
    setSaving(true)
    try {
      const payload: any = {
        productName: form.productName,
        customerName: form.customerName || undefined,
        customerEmail: form.customerEmail || undefined,
        customerPhone: form.customerPhone || undefined,
        deliveryType: form.deliveryType,
        deliveryUrl: form.deliveryUrl || undefined,
        licenseKey: form.licenseKey || undefined,
        sessionToken: form.sessionToken || undefined,
        status: form.status,
      }

      if (editMode && viewDelivery) {
        await api.patch(`/deliveries/${viewDelivery.id}`, payload)
        toast.add({ type: "success", title: "Delivery updated" })
      } else {
        await api.post(`/deliveries`, payload)
        toast.add({ type: "success", title: "Delivery created" })
      }
      setCreateOpen(false)
      fetchDeliveries(page)
    } catch {
      toast.add({ type: "error", title: "Failed to save" })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await api.delete(`/deliveries/${deleteTarget.id}`)
      toast.add({ type: "success", title: "Delivery deleted" })
      setDeleteTarget(null)
      setViewDelivery(null)
      fetchDeliveries(page)
    } catch {
      toast.add({ type: "error", title: "Failed to delete" })
    }
  }

  function handleExport() {
    if (deliveries.length === 0) return
    const headers = ["Product", "Customer", "Email", "Phone", "Type", "Status", "Session", "License Key", "Created", "Delivered On"]
    const rows = deliveries.map((d) => [
      d.productName,
      d.customerName || "",
      d.customerEmail || "",
      d.customerPhone || "",
      d.deliveryType,
      d.status,
      d.sessionToken || "",
      d.licenseKey || "",
      new Date(d.createdAt).toISOString(),
      d.deliveredAt ? new Date(d.deliveredAt).toISOString() : "",
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `deliveries-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add({ type: "success", title: "Export Complete", description: "Deliveries CSV downloaded." })
  }

  function resetFilters() {
    setSearch("")
    setStatusFilter("all")
    setTypeFilter("all")
    setDateRange(undefined)
  }

  const hasActiveFilters = statusFilter !== "all" || typeFilter !== "all" || !!dateRange?.from

  const statusTabs = ["all", "pending", "delivered", "failed", "expired"] as const
  const typeTabs = ["all", "download", "link", "license_key", "access"] as const

  const dateLabel = dateRange?.from && dateRange?.to
    ? `${dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} — ${dateRange.to.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
    : dateRange?.from
    ? `${dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} — …`
    : "Date Range"

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Content Delivery</h1>
          <p className="text-sm text-muted-foreground">
            Deliver digital downloads, license keys, and access links automatically after customer payments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={deliveries.length === 0}
            className="h-9 gap-1.5 border-border/70 bg-card rounded-lg text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
            <span>Export</span>
          </Button>
          <Button
            onClick={openCreate}
            className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
            <span>New Delivery</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, customer, session..."
            className="pl-9 h-9 text-xs bg-card border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {/* Status Tabs */}
          {statusTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap capitalize ${
                statusFilter === tab
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab === "all" ? "All" : tab}
            </button>
          ))}

          {/* Type Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer whitespace-nowrap">
              <span>Type</span>
              {typeFilter !== "all" && (
                <span className="flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[0.5625rem] font-bold text-primary-foreground leading-none">
                  1
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Delivery Type
                </DropdownMenuLabel>
                {typeTabs.map((t) => (
                  <DropdownMenuItem
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`flex items-center justify-between text-xs cursor-pointer capitalize ${
                      typeFilter === t ? "font-semibold text-primary" : ""
                    }`}
                  >
                    <span>{t === "all" ? "All Types" : t.replace("_", " ")}</span>
                    {typeFilter === t && (
                      <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Picker */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                dateRange?.from
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : "border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
              <span>{dateLabel}</span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-3">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="rounded-lg"
              />
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 mt-2">
                <span className="text-xs text-muted-foreground">
                  {dateRange?.from && dateRange?.to
                    ? `${dateRange.from.toLocaleDateString("en-GB")} → ${dateRange.to.toLocaleDateString("en-GB")}`
                    : "Select a date range"}
                </span>
                <div className="flex gap-1.5">
                  {dateRange?.from && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDateRange(undefined)}
                      className="h-7 px-2 text-xs rounded-md border-border/70"
                    >
                      Clear
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => setDatePickerOpen(false)}
                    className="h-7 px-3 text-xs rounded-md bg-primary text-primary-foreground"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer whitespace-nowrap"
            >
              <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} className="size-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Deliveries Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : deliveries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-border/60 bg-card text-center p-6 space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
            <HugeiconsIcon icon={DeliveryBoxIcon} strokeWidth={2} className="size-6" />
          </div>
          <h3 className="text-sm font-medium text-foreground">No deliveries yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Create a delivery to automatically send digital downloads, license keys, or access links to customers after payment.
          </p>
          <Button onClick={openCreate} className="h-8 gap-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium cursor-pointer">
            <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
            Create First Delivery
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4 font-medium">Product</th>
                    <th className="py-3 px-4 font-medium">Customer</th>
                    <th className="py-3 px-4 font-medium">Session</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Delivered on</th>
                    <th className="py-3 px-4 font-medium text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-normal">
                  {deliveries.map((d) => {
                    const cfg = deliveryTypeConfig[d.deliveryType] || deliveryTypeConfig.download!
                    const delDate = formatDeliveryDate(d.deliveredAt)
                    const createdDate = formatDeliveryDate(d.createdAt)
                    return (
                      <tr
                        key={d.id}
                        onClick={() => setViewDelivery(d)}
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ${cfg.color}`}>
                              <HugeiconsIcon icon={cfg.icon} strokeWidth={2} className="size-3.5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{d.productName}</span>
                              <span className="text-[0.625rem] text-muted-foreground">{cfg.label}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{d.customerName || "—"}</span>
                            <span className="text-[0.625rem] text-muted-foreground">{d.customerEmail || d.customerPhone || ""}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-muted-foreground">
                          {d.sessionToken ? d.sessionToken.substring(0, 12) + "…" : "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className={`text-[0.625rem] font-semibold capitalize ${deliveryStatusColors[d.status] || deliveryStatusColors.pending}`}>
                            {d.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          {delDate ? (
                            <div className="flex flex-col">
                              <span className="text-foreground">{delDate.date}</span>
                              <span className="text-[0.625rem] text-muted-foreground">{delDate.time}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-[0.625rem]">
                              Created: {createdDate?.date || "—"}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3.5 text-muted-foreground inline" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span>–
              <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of{" "}
              <span className="font-medium text-foreground">{total}</span> deliveries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => fetchDeliveries(page - 1)}
                className="h-8 gap-1 border-border/70 rounded-lg text-xs font-medium cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
                <span>Prev</span>
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => fetchDeliveries(page + 1)}
                className="h-8 gap-1 border-border/70 rounded-lg text-xs font-medium cursor-pointer"
              >
                <span>Next</span>
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <Sheet open={!!viewDelivery} onOpenChange={(o) => !o && setViewDelivery(null)}>
        <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
          {viewDelivery && (
            <>
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="text-sm font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={DeliveryBoxIcon} strokeWidth={2} className="size-4" />
                  Delivery Details
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Full delivery information and status.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className={`flex size-12 items-center justify-center rounded-xl ${deliveryTypeConfig[viewDelivery.deliveryType]?.bg || "bg-primary/10"} ${deliveryTypeConfig[viewDelivery.deliveryType]?.color || "text-primary"}`}>
                    <HugeiconsIcon icon={deliveryTypeConfig[viewDelivery.deliveryType]?.icon || DeliveryBoxIcon} strokeWidth={2} className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{viewDelivery.productName}</h3>
                    <Badge variant="outline" className={`text-[0.625rem] font-semibold mt-1 capitalize ${deliveryStatusColors[viewDelivery.status]}`}>
                      {viewDelivery.status}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground">{deliveryTypeConfig[viewDelivery.deliveryType]?.label || viewDelivery.deliveryType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium text-foreground">{viewDelivery.customerName || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium text-foreground">{viewDelivery.customerEmail || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-mono text-[0.6875rem] text-foreground">{viewDelivery.customerPhone || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Session</span>
                    <span className="font-mono text-[0.6875rem] text-foreground">{viewDelivery.sessionToken || "—"}</span>
                  </div>
                </div>

                {viewDelivery.deliveryUrl && (
                  <div className="rounded-xl border border-border/60 p-4 space-y-2 text-xs">
                    <span className="text-muted-foreground">Delivery URL</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.6875rem] text-primary truncate flex-1">{viewDelivery.deliveryUrl}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard?.writeText(viewDelivery.deliveryUrl!)
                          toast.add({ type: "success", title: "Copied" })
                        }}
                        className="h-7 px-2 text-[0.625rem] rounded-md border-border/70"
                      >
                        <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {viewDelivery.licenseKey && (
                  <div className="rounded-xl border border-border/60 p-4 space-y-2 text-xs">
                    <span className="text-muted-foreground">License Key</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.6875rem] text-foreground truncate flex-1">{viewDelivery.licenseKey}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard?.writeText(viewDelivery.licenseKey!)
                          toast.add({ type: "success", title: "Copied" })
                        }}
                        className="h-7 px-2 text-[0.625rem] rounded-md border-border/70"
                      >
                        <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-border/60 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium text-foreground">{formatDeliveryDate(viewDelivery.createdAt)?.date} · {formatDeliveryDate(viewDelivery.createdAt)?.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delivered</span>
                    <span className="font-medium text-foreground">
                      {viewDelivery.deliveredAt ? `${formatDeliveryDate(viewDelivery.deliveredAt)?.date} · ${formatDeliveryDate(viewDelivery.deliveredAt)?.time}` : "Not delivered"}
                    </span>
                  </div>
                  {viewDelivery.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expires</span>
                      <span className="font-medium text-foreground">{formatDeliveryDate(viewDelivery.expiresAt)?.date}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => openEdit(viewDelivery)} className="h-9 flex-1 text-xs font-medium rounded-lg border-border/70 gap-1.5">
                    <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => setDeleteTarget(viewDelivery)} className="h-9 flex-1 text-xs font-medium rounded-lg border-rose-500/30 text-rose-600 hover:bg-rose-500/5 gap-1.5">
                    <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create / Edit Drawer */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
          <SheetHeader className="p-5 border-b border-border/60">
            <SheetTitle className="text-sm font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-4" />
              {editMode ? "Edit Delivery" : "New Delivery"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editMode ? "Update delivery details." : "Create a new digital content delivery."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Product Name *</label>
              <Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="e.g. E-Book Download" className="h-9 text-xs bg-card border-border/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Customer Name</label>
              <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Customer name" className="h-9 text-xs bg-card border-border/70" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email</label>
                <Input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} placeholder="customer@email.com" className="h-9 text-xs bg-card border-border/70" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Phone</label>
                <Input value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} placeholder="+255..." className="h-9 text-xs bg-card border-border/70" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Delivery Type</label>
                <Select value={form.deliveryType} onValueChange={(v) => v && setForm({ ...form, deliveryType: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="download">Download</SelectItem>
                    <SelectItem value="link">Access Link</SelectItem>
                    <SelectItem value="license_key">License Key</SelectItem>
                    <SelectItem value="access">Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Status</label>
                <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.deliveryType === "link" || form.deliveryType === "download" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Delivery URL</label>
                <Input value={form.deliveryUrl} onChange={(e) => setForm({ ...form, deliveryUrl: e.target.value })} placeholder="https://..." className="h-9 text-xs bg-card border-border/70" />
              </div>
            ) : null}
            {form.deliveryType === "license_key" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">License Key</label>
                <Input value={form.licenseKey} onChange={(e) => setForm({ ...form, licenseKey: e.target.value })} placeholder="XXXX-XXXX-XXXX" className="h-9 text-xs bg-card border-border/70" />
              </div>
            ) : null}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Session Token</label>
              <Input value={form.sessionToken} onChange={(e) => setForm({ ...form, sessionToken: e.target.value })} placeholder="Optional session identifier" className="h-9 text-xs bg-card border-border/70" />
            </div>
          </div>
          <SheetFooter className="p-5 border-t border-border/60 gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="h-9 text-xs font-medium rounded-lg border-border/70">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="h-9 text-xs font-medium rounded-lg bg-primary text-primary-foreground">
              {saving ? <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" /> : editMode ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-sm rounded-xl border border-border/60 bg-card p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
                <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Delete Delivery?</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You are about to delete the delivery for <span className="font-medium text-foreground">{deleteTarget.productName}</span>.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} className="h-9 flex-1 text-xs font-medium rounded-lg border-border/70">Cancel</Button>
              <Button onClick={handleDelete} className="h-9 flex-1 text-xs font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700">Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
