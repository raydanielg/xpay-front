"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Copy01Icon,
  Loading03Icon,
  PlusSignIcon,
  Wallet01Icon,
  RefreshIcon,
  ArrowDown01Icon,
  Calendar03Icon,
  Sorting01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
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
} from "@workspace/ui/components/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"

interface ApiPayout {
  id: string
  reference: string
  amount: number
  currency: string
  status: string
  method: string
  destination: string | null
  accountName: string | null
  accountNumber: string | null
  narration?: string | null
  fee: number | null
  createdAt: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const datePart = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const timePart = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return `${datePart}, ${timePart}`
}

function formatCurrency(amount: number, currency = "TSh") {
  return `${currency} ${amount.toLocaleString()}`
}

function maskAccount(acc?: string | null) {
  if (!acc) return "••••••6254"
  if (acc.length <= 4) return `••••••${acc}`
  return `••••••${acc.slice(-4)}`
}

export function PayoutsPage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [showRequestModal, setShowRequestModal] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [payouts, setPayouts] = React.useState<ApiPayout[]>([])
  const [selected, setSelected] = React.useState<string[]>([])
  const [total, setTotal] = React.useState(0)
  const [analyticsData, setAnalyticsData] = React.useState<{
    payouts: { totalAmount: number; completed: number; total: number }
    payments: { totalAmount: number }
  } | null>(null)

  // Withdraw form states
  const [credential, setCredential] = React.useState("HaloPesa • ••••••••6254")
  const [amount, setAmount] = React.useState("")
  const [narration, setNarration] = React.useState("")
  const [currency, setCurrency] = React.useState("TZS")

  // Date range state
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to?: Date | undefined } | undefined>(undefined)

  // Column visibility state
  const [visibleCols, setVisibleCols] = React.useState<Record<string, boolean>>({
    reference: true,
    recipient: true,
    amount: true,
    channel: true,
    narration: true,
    status: true,
    date: true,
  })

  function toggleCol(key: string) {
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const fetchPayoutData = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", "1")
      params.set("limit", "100")
      if (statusFilter !== "ALL") params.set("status", statusFilter.toLowerCase())

      const [payoutsRes, analyticsRes] = await Promise.all([
        api.get<ApiPayout[]>(`/payouts?${params.toString()}`),
        api.get<{
          payouts: { totalAmount: number; completed: number; total: number }
          payments: { totalAmount: number }
        }>("/analytics"),
      ])

      if (payoutsRes.success && payoutsRes.data) {
        setPayouts(Array.isArray(payoutsRes.data) ? payoutsRes.data : [])
        setTotal(payoutsRes.meta?.total || 0)
      }
      if (analyticsRes.success && analyticsRes.data) {
        setAnalyticsData(analyticsRes.data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  React.useEffect(() => {
    fetchPayoutData()
  }, [fetchPayoutData])

  const filtered = payouts.filter((p) => {
    const q = search.toLowerCase()
    const matchesSearch =
      p.reference?.toLowerCase().includes(q) ||
      p.destination?.toLowerCase().includes(q) ||
      p.accountName?.toLowerCase().includes(q) ||
      p.method?.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "ALL" || p.status?.toUpperCase() === statusFilter
    let matchesDate = true
    if (dateRange?.from) {
      const payoutDate = new Date(p.createdAt)
      const from = new Date(dateRange.from)
      from.setHours(0, 0, 0, 0)
      const to = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from)
      to.setHours(23, 59, 59, 999)
      matchesDate = payoutDate >= from && payoutDate <= to
    }
    return matchesSearch && matchesStatus && matchesDate
  })

  const allSelected = filtered.length > 0 && selected.length === filtered.length
  const someSelected = selected.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) setSelected([])
    else setSelected(filtered.map((t) => t.id))
  }

  function toggleOne(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function copyRef(ref: string) {
    navigator.clipboard.writeText(ref)
    toast.add({ type: "success", title: "Copied", description: `${ref} copied to clipboard.` })
  }

  const totalPaidOut = analyticsData?.payouts.totalAmount || 0
  const availableBalance = Math.max(0, (analyticsData?.payments.totalAmount || 0) - totalPaidOut)

  async function handleWithdraw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      toast.add({ type: "error", title: "Invalid amount", description: "Please enter a valid amount to withdraw." })
      return
    }

    setSubmitting(true)
    toast.add({ type: "loading", title: "Processing withdrawal..." })

    try {
      const isBank = credential.toLowerCase().includes("bank")
      const channelName = credential.split("•")[0]?.trim() || "HaloPesa"
      const res = await api.post<ApiPayout>("/payouts", {
        amount: numericAmount,
        currency,
        destination: channelName,
        credential,
        narration: narration || "Reason for withdrawal",
        accountName: "ezra daniel",
        accountNumber: credential.split("••••••••")[1] || "6254",
        method: isBank ? "BANK" : "mobile_money",
      })

      if (res.success) {
        toast.add({
          type: "success",
          title: "Withdrawal successful",
          description: `TSh ${numericAmount.toLocaleString()} has been sent to ${credential}.`,
        })
        setShowRequestModal(false)
        setAmount("")
        setNarration("")
        fetchPayoutData()
      } else {
        toast.add({ type: "error", title: "Withdrawal failed", description: res.message || "Failed to process withdrawal." })
      }
    } catch {
      toast.add({ type: "error", title: "Withdrawal failed", description: "Network error. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  function formatStatus(status: string) {
    const s = status?.toUpperCase()
    if (s === "COMPLETED" || s === "SUCCESSFUL") {
      return (
        <span className="inline-flex items-center rounded px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wider bg-primary/10 text-primary border border-primary/20">
          COMPLETED
        </span>
      )
    }
    if (s === "PROCESSING") {
      return (
        <span className="inline-flex items-center rounded px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          PROCESSING
        </span>
      )
    }
    if (s === "PENDING") {
      return (
        <span className="inline-flex items-center rounded px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          PENDING
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        FAILED
      </span>
    )
  }

  return (
    <div className="space-y-4 px-4 py-5 lg:px-6">
      {/* Top Filter & Actions Bar matching Screenshot */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Status Dropdown + Search */}
        <div className="flex flex-1 items-center gap-2">
          {/* Status Dropdown */}
          <div className="w-[140px] shrink-0">
            <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/70 rounded-lg font-medium">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by reference..."
              className="pl-8.5 h-9 text-xs bg-card border-border/70 rounded-lg focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right: Date range, View, Refresh, + Withdraw */}
        <div className="flex items-center gap-2">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-xs font-normal text-muted-foreground border-border/70 bg-card rounded-lg gap-1.5 cursor-pointer hover:text-foreground"
                />
              }
            >
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={1.8} className="size-3.5" />
              <span>
                {dateRange?.from
                  ? dateRange.to
                    ? `${dateRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${dateRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    : dateRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "Date range"}
              </span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0 rounded-xl bg-card border shadow-xl flex flex-col">
              <div className="p-2 border-b border-border/60 flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date()
                    setDateRange({ from: today, to: today })
                  }}
                  className="rounded-md px-2 py-1 text-[0.6875rem] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const to = new Date()
                    const from = new Date()
                    from.setDate(from.getDate() - 7)
                    setDateRange({ from, to })
                  }}
                  className="rounded-md px-2 py-1 text-[0.6875rem] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  Last 7 days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const to = new Date()
                    const from = new Date()
                    from.setDate(from.getDate() - 30)
                    setDateRange({ from, to })
                  }}
                  className="rounded-md px-2 py-1 text-[0.6875rem] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  Last 30 days
                </button>
                {dateRange && (
                  <button
                    type="button"
                    onClick={() => setDateRange(undefined)}
                    className="ml-auto rounded-md px-2 py-1 text-[0.6875rem] font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="p-2">
                <Calendar
                  mode="range"
                  selected={dateRange as any}
                  onSelect={setDateRange as any}
                  numberOfMonths={2}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* View / Column Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-xs font-normal text-muted-foreground border-border/70 bg-card rounded-lg gap-1.5 cursor-pointer hover:text-foreground"
                />
              }
            >
              <HugeiconsIcon icon={Sorting01Icon} strokeWidth={1.8} className="size-3.5" />
              <span>View</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl bg-popover border shadow-xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider">
                  Toggle columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  { key: "reference", label: "Reference" },
                  { key: "recipient", label: "Recipient" },
                  { key: "amount", label: "Amount" },
                  { key: "channel", label: "Channel" },
                  { key: "narration", label: "Narration" },
                  { key: "status", label: "Status" },
                  { key: "date", label: "Date" },
                ].map((col) => (
                  <DropdownMenuItem
                    key={col.key}
                    onClick={() => toggleCol(col.key)}
                    className="text-xs cursor-pointer flex items-center justify-between"
                  >
                    <span>{col.label}</span>
                    {visibleCols[col.key] && (
                      <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 border-border/70 bg-card rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => {
              fetchPayoutData()
              toast.add({ type: "success", title: "Refreshed" })
            }}
          >
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={1.8} className="size-3.5" />
          </Button>

          {/* + Withdraw Button */}
          <Button
            onClick={() => setShowRequestModal(true)}
            className="h-9 px-3.5 text-xs font-medium rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs gap-1 cursor-pointer transition-colors"
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.2} className="size-3.5" />
            <span>Withdraw</span>
          </Button>
        </div>
      </div>

      {/* Payouts Table */}
      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 py-16 text-center text-xs text-muted-foreground">
          No payouts found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-muted-foreground font-semibold">
                  <th className="py-3 px-3 w-10 text-center">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                    />
                  </th>
                  {visibleCols.reference && <th className="py-3 px-4 font-medium">Reference</th>}
                  {visibleCols.recipient && <th className="py-3 px-4 font-medium">Recipient</th>}
                  {visibleCols.amount && <th className="py-3 px-4 font-medium">Amount</th>}
                  {visibleCols.channel && <th className="py-3 px-4 font-medium">Channel</th>}
                  {visibleCols.narration && <th className="py-3 px-4 font-medium">Narration</th>}
                  {visibleCols.status && <th className="py-3 px-4 font-medium">Status</th>}
                  {visibleCols.date && <th className="py-3 px-4 font-medium">Date</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {filtered.map((payout) => {
                  const isSelected = selected.includes(payout.id)
                  const recipientName = payout.accountName || "ezra daniel"
                  const channel = (payout.method || payout.destination || "HALOTEL").toUpperCase().replace(/\s+/g, "_")
                  const narrationText = payout.narration || "funds"

                  return (
                    <tr
                      key={payout.id}
                      className={`hover:bg-muted/20 transition-colors group ${
                        isSelected ? "bg-muted/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleOne(payout.id)}
                          aria-label={`Select ${payout.reference}`}
                        />
                      </td>

                      {/* Reference with copy */}
                      {visibleCols.reference && (
                      <td className="py-3 px-3 font-mono text-foreground font-normal whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{payout.reference?.slice(0, 10)}...</span>
                          <button
                            type="button"
                            onClick={() => copyRef(payout.reference)}
                            className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity"
                            title="Copy reference"
                          >
                            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                      </td>
                      )}

                      {/* Recipient: Name + masked account number */}
                      {visibleCols.recipient && (
                      <td className="py-3 px-3 text-foreground whitespace-nowrap">
                        <span className="font-normal">{recipientName}</span>{" "}
                        <span className="text-muted-foreground ml-1">{maskAccount(payout.accountNumber)}</span>
                      </td>
                      )}

                      {/* Amount */}
                      {visibleCols.amount && (
                      <td className="py-3 px-3 font-medium text-foreground whitespace-nowrap">
                        {formatCurrency(payout.amount, payout.currency)}
                      </td>
                      )}

                      {/* Channel */}
                      {visibleCols.channel && (
                      <td className="py-3 px-3 text-muted-foreground font-mono uppercase text-[0.6875rem] whitespace-nowrap">
                        {channel}
                      </td>
                      )}

                      {/* Narration */}
                      {visibleCols.narration && (
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap lowercase">
                        {narrationText}
                      </td>
                      )}

                      {/* Status badge */}
                      {visibleCols.status && (
                      <td className="py-3 px-3 whitespace-nowrap">
                        {formatStatus(payout.status)}
                      </td>
                      )}

                      {/* Date */}
                      {visibleCols.date && (
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap font-normal">
                        {formatDate(payout.createdAt)}
                      </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Withdraw Side Drawer */}
      <Sheet open={showRequestModal} onOpenChange={setShowRequestModal}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-s border-border bg-card p-0 shadow-2xl flex flex-col"
        >
          {/* Drawer Header */}
          <SheetHeader className="p-6 pb-4 border-b border-border/60 flex flex-row items-center justify-between pr-12">
            <div>
              <SheetTitle className="text-base font-semibold flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                  <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} className="size-4 text-primary" />
                </div>
                Withdraw
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Transfer funds to your mobile money or bank account.
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Drawer Body */}
          <form onSubmit={handleWithdraw} className="flex flex-col gap-4 p-6 overflow-y-auto flex-1">
            {/* Available Balance Card */}
            <div className="rounded-xl border border-border/80 bg-muted/15 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Available Balance</span>
                <HugeiconsIcon icon={Wallet01Icon} strokeWidth={1.8} className="size-4 text-muted-foreground/70" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {loading ? "..." : `TSh ${availableBalance.toLocaleString()}`}
              </div>
            </div>

            {/* Credential Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">Credential</label>
              <Select value={credential} onValueChange={(v) => v && setCredential(v)}>
                <SelectTrigger className="w-full h-10 text-xs bg-card border-border/80 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HaloPesa • ••••••••6254">HaloPesa • ••••••••6254</SelectItem>
                  <SelectItem value="M-Pesa • ••••••••1234">M-Pesa • ••••••••1234</SelectItem>
                  <SelectItem value="Airtel Money • ••••••••5678">Airtel Money • ••••••••5678</SelectItem>
                  <SelectItem value="Mixx by Yas • ••••••••9012">Mixx by Yas • ••••••••9012</SelectItem>
                  <SelectItem value="CRDB Bank • ••••••••3456">CRDB Bank • ••••••••3456</SelectItem>
                  <SelectItem value="NMB Bank • ••••••••7890">NMB Bank • ••••••••7890</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">Amount</label>
              <div className="flex items-center rounded-lg border border-border/80 bg-card overflow-hidden focus-within:ring-1 focus-within:ring-primary">
                <div className="flex items-center gap-1 border-r border-border/80 bg-muted/25 px-3 py-2 text-xs font-medium text-foreground shrink-0">
                  <span>{currency}</span>
                  <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3 text-muted-foreground" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  required
                  min="1"
                  className="flex-1 border-0 bg-transparent px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Narration Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">Narration</label>
              <textarea
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                placeholder="Reason for withdrawal"
                rows={2}
                className="w-full rounded-lg border border-border/80 bg-card p-3 text-xs text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-1 focus-visible:ring-primary focus:outline-none"
              />
            </div>

            {/* Withdraw Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Withdraw"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
