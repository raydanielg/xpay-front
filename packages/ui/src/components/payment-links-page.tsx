"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Copy01Icon,
  PlusSignIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  CancelCircleIcon,
  Calendar03Icon,
  RefreshIcon,
  Sorting01Icon,
} from "@hugeicons/core-free-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { toast } from "@workspace/ui/components/toast"

interface PaymentLinkRecord {
  id: string
  reference: string
  fullReference: string
  merchantProfile: string
  amount: string
  customer: string
  status: "unpaid" | "completed" | "expired"
  paymentMethods?: string
  description?: string
  createdAt: string
  expiresAt?: string
  customerEmail?: string
  metadata?: {
    paymentId?: string
    planId?: string
    restaurantId?: string
  }
}

const mockPaymentRecords: PaymentLinkRecord[] = [
  {
    id: "1",
    reference: "PAY178545611...",
    fullReference: "PAY17854561181590356",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "-",
    customerEmail: "airezra2@gmail.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Subscription: Basic",
    createdAt: "31 Jul 2026, 03:01",
    expiresAt: "31 Jul 2026, 04:01",
    metadata: { paymentId: "5", planId: "2", restaurantId: "1" },
  },
  {
    id: "2",
    reference: "PAY177660605...",
    fullReference: "PAY17766060589123490",
    merchantProfile: "SalamaPay",
    amount: "TSh 50,000",
    customer: "-",
    customerEmail: "sarah.wilson@example.com",
    status: "unpaid",
    paymentMethods: "mobile money, card",
    description: "Annual Subscription: Pro",
    createdAt: "19 Apr 2026, 16:40",
    expiresAt: "19 Apr 2026, 17:40",
    metadata: { paymentId: "12", planId: "4", restaurantId: "1" },
  },
  {
    id: "3",
    reference: "PAY177341881...",
    fullReference: "PAY17734188190283411",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "-",
    customerEmail: "guest@xpay.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Quick payment invoice",
    createdAt: "13 Mar 2026, 19:20",
    expiresAt: "13 Mar 2026, 20:20",
    metadata: { paymentId: "15", planId: "1", restaurantId: "2" },
  },
  {
    id: "4",
    reference: "PAY177338727...",
    fullReference: "PAY17733872783948190",
    merchantProfile: "SalamaPay",
    amount: "TSh 2,000",
    customer: "Euphemia Vitus Joseph",
    customerEmail: "euphemia.v@gmail.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Restaurant Table Order #42",
    createdAt: "13 Mar 2026, 10:34",
    expiresAt: "13 Mar 2026, 11:34",
    metadata: { paymentId: "21", planId: "2", restaurantId: "3" },
  },
  {
    id: "5",
    reference: "PAY177322187...",
    fullReference: "PAY17732218712398455",
    merchantProfile: "SalamaPay",
    amount: "TSh 10,000",
    customer: "-",
    customerEmail: "customer@example.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Lunch Special Voucher",
    createdAt: "11 Mar 2026, 12:37",
    expiresAt: "11 Mar 2026, 13:37",
    metadata: { paymentId: "32", planId: "1", restaurantId: "1" },
  },
  {
    id: "6",
    reference: "PAY177322116...",
    fullReference: "PAY17732211698234100",
    merchantProfile: "SalamaPay",
    amount: "TSh 100,000",
    customer: "-",
    customerEmail: "customer@example.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Catering Deposit",
    createdAt: "11 Mar 2026, 12:26",
    expiresAt: "11 Mar 2026, 13:26",
    metadata: { paymentId: "33", planId: "3", restaurantId: "1" },
  },
  {
    id: "7",
    reference: "PAY177322058...",
    fullReference: "PAY17732205845612399",
    merchantProfile: "SalamaPay",
    amount: "TSh 200,000",
    customer: "-",
    customerEmail: "finance@xpay.com",
    status: "expired",
    paymentMethods: "mobile money, card",
    description: "Bulk Reservation",
    createdAt: "11 Mar 2026, 12:16",
    expiresAt: "11 Mar 2026, 13:16",
    metadata: { paymentId: "34", planId: "5", restaurantId: "2" },
  },
  {
    id: "8",
    reference: "PAY177322058...",
    fullReference: "PAY17732205898765412",
    merchantProfile: "SalamaPay",
    amount: "TSh 500,000",
    customer: "-",
    customerEmail: "client@corporate.tz",
    status: "unpaid",
    paymentMethods: "mobile money, bank",
    description: "Corporate Dinner Package",
    createdAt: "11 Mar 2026, 12:16",
    expiresAt: "11 Mar 2026, 13:16",
    metadata: { paymentId: "35", planId: "6", restaurantId: "1" },
  },
  {
    id: "9",
    reference: "PAY177321963...",
    fullReference: "PAY17732196323456788",
    merchantProfile: "SalamaPay",
    amount: "TSh 100,000",
    customer: "-",
    customerEmail: "support@xpay.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Event Ticket Deposit",
    createdAt: "11 Mar 2026, 12:00",
    expiresAt: "11 Mar 2026, 13:00",
    metadata: { paymentId: "36", planId: "2", restaurantId: "1" },
  },
  {
    id: "10",
    reference: "PAY177321920...",
    fullReference: "PAY17732192087654321",
    merchantProfile: "SalamaPay",
    amount: "TSh 100,000",
    customer: "-",
    customerEmail: "info@xpay.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "VIP Section Access",
    createdAt: "11 Mar 2026, 11:53",
    expiresAt: "11 Mar 2026, 12:53",
    metadata: { paymentId: "37", planId: "2", restaurantId: "1" },
  },
  {
    id: "11",
    reference: "PAY177321891...",
    fullReference: "PAY17732189112345678",
    merchantProfile: "SalamaPay",
    amount: "TSh 500,000",
    customer: "-",
    customerEmail: "orders@xpay.com",
    status: "expired",
    paymentMethods: "mobile money, bank",
    description: "Monthly Service Fee",
    createdAt: "11 Mar 2026, 11:48",
    expiresAt: "11 Mar 2026, 12:48",
    metadata: { paymentId: "38", planId: "6", restaurantId: "2" },
  },
  {
    id: "12",
    reference: "PAY177321791...",
    fullReference: "PAY17732179165432100",
    merchantProfile: "SalamaPay",
    amount: "TSh 500,000",
    customer: "-",
    customerEmail: "sales@xpay.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Software License Fee",
    createdAt: "11 Mar 2026, 11:31",
    expiresAt: "11 Mar 2026, 12:31",
    metadata: { paymentId: "39", planId: "6", restaurantId: "1" },
  },
  {
    id: "13",
    reference: "PAY177321723...",
    fullReference: "PAY17732172378901234",
    merchantProfile: "SalamaPay",
    amount: "TSh 100,000",
    customer: "Geofrey peleus",
    customerEmail: "geofrey.p@outlook.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Consulting Hour",
    createdAt: "11 Mar 2026, 11:20",
    expiresAt: "11 Mar 2026, 12:20",
    metadata: { paymentId: "40", planId: "3", restaurantId: "3" },
  },
  {
    id: "14",
    reference: "PAY177321700...",
    fullReference: "PAY17732170034567890",
    merchantProfile: "SalamaPay",
    amount: "TSh 50,000",
    customer: "-",
    customerEmail: "guest@xpay.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Menu Bundle Special",
    createdAt: "11 Mar 2026, 11:16",
    expiresAt: "11 Mar 2026, 12:16",
    metadata: { paymentId: "41", planId: "2", restaurantId: "1" },
  },
  {
    id: "15",
    reference: "PAY177321680...",
    fullReference: "PAY17732168090123456",
    merchantProfile: "SalamaPay",
    amount: "TSh 150,000",
    customer: "-",
    customerEmail: "inquiries@xpay.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Beverage Package",
    createdAt: "11 Mar 2026, 11:13",
    expiresAt: "11 Mar 2026, 12:13",
    metadata: { paymentId: "42", planId: "4", restaurantId: "2" },
  },
  {
    id: "16",
    reference: "PAY177321675...",
    fullReference: "PAY17732167556789012",
    merchantProfile: "SalamaPay",
    amount: "TSh 50,000",
    customer: "-",
    customerEmail: "billing@xpay.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Delivery fee deposit",
    createdAt: "11 Mar 2026, 11:12",
    expiresAt: "11 Mar 2026, 12:12",
    metadata: { paymentId: "43", planId: "2", restaurantId: "1" },
  },
  {
    id: "17",
    reference: "PAY177321663...",
    fullReference: "PAY17732166312378900",
    merchantProfile: "SalamaPay",
    amount: "TSh 300,000",
    customer: "Mark Bwemo",
    customerEmail: "mark.bwemo@gmail.com",
    status: "completed",
    paymentMethods: "mobile money, card",
    description: "Private Dining Reservation",
    createdAt: "11 Mar 2026, 11:10",
    expiresAt: "11 Mar 2026, 12:10",
    metadata: { paymentId: "44", planId: "5", restaurantId: "1" },
  },
  {
    id: "18",
    reference: "PAY177321172...",
    fullReference: "PAY17732117289012345",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "Joas Maugo",
    customerEmail: "joas.m@yahoo.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Coffee & Pastry",
    createdAt: "11 Mar 2026, 09:48",
    expiresAt: "11 Mar 2026, 10:48",
    metadata: { paymentId: "45", planId: "1", restaurantId: "1" },
  },
  {
    id: "19",
    reference: "PAY177321127...",
    fullReference: "PAY17732112745678901",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "Joseph Gembe Msuya",
    customerEmail: "gembe.m@gmail.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Quick snack order",
    createdAt: "11 Mar 2026, 09:41",
    expiresAt: "11 Mar 2026, 10:41",
    metadata: { paymentId: "46", planId: "1", restaurantId: "1" },
  },
  {
    id: "20",
    reference: "PAY177321050...",
    fullReference: "PAY17732105012345678",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "Air Ezra",
    customerEmail: "airezra2@gmail.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Subscription: Basic",
    createdAt: "11 Mar 2026, 09:28",
    expiresAt: "11 Mar 2026, 10:28",
    metadata: { paymentId: "5", planId: "2", restaurantId: "1" },
  },
]

const statusOptions = [
  { label: "All statuses", value: "ALL" },
  { label: "Completed", value: "completed" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Expired", value: "expired" },
] as const

function StatusBadge({ status }: { status: PaymentLinkRecord["status"] }) {
  if (status === "unpaid") {
    return (
      <span className="inline-flex items-center justify-center rounded-md bg-rose-500/15 px-2.5 py-0.5 text-[0.625rem] font-semibold tracking-wider text-rose-600 dark:text-rose-400 uppercase">
        UNPAID
      </span>
    )
  }

  if (status === "completed") {
    return (
      <span className="inline-flex items-center justify-center rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-[0.625rem] font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
        COMPLETED
      </span>
    )
  }

  return (
    <span className="inline-flex items-center justify-center rounded-md border border-slate-300/60 dark:border-slate-700/60 bg-slate-500/10 px-2.5 py-0.5 text-[0.625rem] font-semibold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
      EXPIRED
    </span>
  )
}

export function PaymentLinksPage() {
  const [records, setRecords] = React.useState<PaymentLinkRecord[]>(mockPaymentRecords)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [selected, setSelected] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [selectedRecord, setSelectedRecord] = React.useState<PaymentLinkRecord | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [autoRefreshInterval, setAutoRefreshInterval] = React.useState<number>(15) // seconds, 0 = off
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to?: Date | undefined } | undefined>(undefined)

  // Drawer form fields
  const [merchantProfile, setMerchantProfile] = React.useState("Default")
  const [currency, setCurrency] = React.useState("TZS (Tanzanian Shilling)")
  const [amount, setAmount] = React.useState("0")
  const [letCustomerChoose, setLetCustomerChoose] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [expiryDuration, setExpiryDuration] = React.useState("1 hour")

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Auto-refresh timer polling
  React.useEffect(() => {
    if (autoRefreshInterval === 0) return

    const interval = setInterval(() => {
      setIsRefreshing(true)
      setTimeout(() => {
        setIsRefreshing(false)
      }, 600)
    }, autoRefreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefreshInterval])

  function handleRefresh(showToast = true) {
    setIsRefreshing(true)
    if (showToast) {
      toast.add({
        type: "loading",
        title: "Checking for new payments...",
      })
    }
    setTimeout(() => {
      setIsRefreshing(false)
      if (showToast) {
        toast.add({
          type: "success",
          title: "Up to date",
          description: "All transactions are synchronized.",
        })
      }
    }, 700)
  }

  const filteredRecords = records.filter((item) => {
    const matchesSearch =
      item.reference.toLowerCase().includes(search.toLowerCase()) ||
      item.fullReference.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const allSelected = selected.length === paginatedRecords.length && paginatedRecords.length > 0
  const someSelected = selected.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) setSelected([])
    else setSelected(paginatedRecords.map((r) => r.id))
  }

  function toggleOne(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function copyRef(ref: string) {
    navigator.clipboard.writeText(ref)
    toast.add({
      type: "success",
      title: "Copied Reference",
      description: `${ref} copied to clipboard.`,
    })
  }

  function handleCreateLink(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const randNum = Math.floor(100000000 + Math.random() * 900000000)
      const formattedAmount = letCustomerChoose
        ? "Custom Amount"
        : `TSh ${Number(amount || 0).toLocaleString()}`

      const newRecord: PaymentLinkRecord = {
        id: String(Date.now()),
        reference: `PAY${String(randNum).substring(0, 9)}...`,
        fullReference: `PAY${randNum}${Date.now().toString().substring(8)}`,
        merchantProfile: merchantProfile === "Default" ? "XPay" : merchantProfile,
        amount: formattedAmount,
        customer: description.trim() || "-",
        status: "unpaid",
        createdAt: "Today, just now",
      }

      setRecords([newRecord, ...records])
      setIsSubmitting(false)
      setDrawerOpen(false)

      // Reset form
      setAmount("0")
      setDescription("")
      setLetCustomerChoose(false)
      setExpiryDuration("1 hour")

      toast.add({
        type: "success",
        title: "Payment Link Created",
        description: `Reference ${newRecord.reference} generated successfully.`,
      })
    }, 1200)
  }

  return (
    <div className="space-y-4 px-4 py-6 lg:px-6">
      {/* Table Header Filter Bar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        {/* All statuses dropdown with chevron */}
        <div className="relative w-full sm:w-36">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 w-full appearance-none rounded-lg border border-border/80 bg-background px-3 pr-8 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/40 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-popover text-popover-foreground">
                {opt.label}
              </option>
            ))}
          </select>
          <HugeiconsIcon
            icon={Sorting01Icon}
            strokeWidth={2}
            className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground"
          />
        </div>

        {/* Search by reference... input */}
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by reference..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 pl-9 pr-4 text-xs bg-background border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        {/* Date range picker popover */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="h-9 gap-1.5 border border-border/80 bg-background px-3 text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer rounded-lg shrink-0"
              />
            }
          >
            <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
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
                  const today = new Date("2026-08-23")
                  setDateRange({ from: today, to: today })
                }}
                className="rounded-md px-2 py-1 text-[0.6875rem] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  const to = new Date("2026-08-23")
                  const from = new Date("2026-08-23")
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
                  const to = new Date("2026-08-23")
                  const from = new Date("2026-08-23")
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

        {/* Refresh button with Auto-refresh indicator */}
        <div className="relative flex items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleRefresh(true)}
            className="size-9 p-0 border border-border/80 bg-background hover:bg-muted/40 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg flex items-center justify-center shrink-0 relative"
            title={autoRefreshInterval > 0 ? `Auto-refresh active (${autoRefreshInterval}s). Click to refresh now.` : "Click to refresh"}
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              strokeWidth={2}
              className={`size-3.5 transition-transform ${isRefreshing ? "animate-spin" : ""}`}
            />
            {autoRefreshInterval > 0 && (
              <span className="absolute -top-1 -right-1 flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
            )}
          </Button>
        </div>

        {/* + New Link button */}
        <Button
          onClick={() => setDrawerOpen(true)}
          className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer shrink-0"
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
          <span>New Link</span>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-muted/20">
        <table className="w-full text-left text-xs">
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
              <th className="px-4 py-3">MERCHANT PROFILE</th>
              <th className="px-4 py-3">AMOUNT</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">CREATED</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3.5"><div className="size-4 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-16 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-28 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 w-16 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 animate-pulse rounded bg-muted" /></td>
                </tr>
              ))
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No payment links found</p>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((item) => {
                const isSelected = selected.includes(item.id)
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className={`group transition-colors hover:bg-muted/40 cursor-pointer ${
                      isSelected ? "bg-muted/50" : ""
                    }`}
                  >
                    <td
                      className="px-4 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(item.id)}
                        aria-label={`Select ${item.reference}`}
                      />
                    </td>

                    {/* Reference */}
                    <td className="px-4 py-3.5 font-mono font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="hover:underline">{item.reference}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyRef(item.fullReference)
                          }}
                          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary cursor-pointer"
                          title="Copy reference"
                        >
                          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                        </button>
                      </div>
                    </td>

                    {/* Merchant Profile */}
                    <td className="px-4 py-3.5 text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <img
                          src="/pay-per-click.png"
                          alt="Merchant"
                          className="size-4 rounded-xs object-cover"
                        />
                        <span>{item.merchantProfile}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 font-semibold tabular-nums text-foreground">
                      {item.amount}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5 text-foreground">
                      {item.customer !== "-" ? (
                        <span className="font-medium">{item.customer}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {item.createdAt}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && filteredRecords.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row text-xs text-muted-foreground">
          {/* Items count / page size */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{pageSize}</span>
            <span>items per page</span>
          </div>

          {/* Page status & controls */}
          <div className="flex items-center gap-4">
            <span>
              Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
              <span className="font-semibold text-foreground">{totalPages}</span>
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="size-7 p-0 border-0 bg-muted/30 hover:bg-muted cursor-pointer disabled:opacity-30"
                aria-label="Previous page"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="size-7 p-0 border-0 bg-muted/30 hover:bg-muted cursor-pointer disabled:opacity-30"
                aria-label="Next page"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Link Details Side Drawer */}
      <Sheet open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-s border-border bg-card p-0 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b border-border/60 flex flex-row items-center justify-between pr-14">
            <div>
              <SheetTitle className="text-base font-semibold">Payment Link Details</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Overview and transaction metadata
              </SheetDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (selectedRecord) {
                  navigator.clipboard.writeText(`https://pay.xpay.com/${selectedRecord.fullReference}`)
                  toast.add({
                    type: "success",
                    title: "Link Copied",
                    description: `Checkout link copied to clipboard.`,
                  })
                }
              }}
              className="h-8 gap-1.5 text-xs font-medium bg-muted/40 hover:bg-muted cursor-pointer rounded-lg shrink-0"
            >
              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
              <span>Copy link</span>
            </Button>
          </SheetHeader>

          {/* Body Content */}
          {selectedRecord && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Main Attributes */}
              <div className="space-y-4">
                {/* Reference */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium">Reference</span>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 p-2.5 font-mono text-xs font-semibold text-foreground">
                    <span className="truncate">{selectedRecord.fullReference}</span>
                    <button
                      type="button"
                      onClick={() => copyRef(selectedRecord.fullReference)}
                      className="hover:text-primary transition-colors cursor-pointer shrink-0"
                      title="Copy full reference"
                    >
                      <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Status</span>
                    <div>
                      <StatusBadge status={selectedRecord.status} />
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Amount</span>
                    <span className="text-base font-bold text-foreground tabular-nums">
                      {selectedRecord.amount}
                    </span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium">Payment Methods</span>
                  <span className="text-xs font-medium text-foreground capitalize">
                    {selectedRecord.paymentMethods ?? "mobile money"}
                  </span>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium">Description</span>
                  <span className="text-xs text-foreground font-medium">
                    {selectedRecord.description ?? "Subscription: Basic"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Created */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Created</span>
                    <span className="text-xs text-muted-foreground">
                      {selectedRecord.createdAt}
                    </span>
                  </div>

                  {/* Expires */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Expires</span>
                    <span className="text-xs text-muted-foreground">
                      {selectedRecord.expiresAt ?? "31 Jul 2026, 04:01"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parties Section */}
              <div className="space-y-3 pt-2 border-t border-border/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Parties
                </h3>

                <div className="space-y-3 rounded-xl bg-muted/20 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Merchant Profile</span>
                    <span className="font-semibold text-foreground">
                      {selectedRecord.merchantProfile}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium text-foreground">
                      {selectedRecord.customer !== "-" ? selectedRecord.customer : "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-mono text-foreground">
                      {selectedRecord.customerEmail ?? "airezra2@gmail.com"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="space-y-3 pt-2 border-t border-border/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Metadata
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-muted/20 p-3 text-center">
                    <div className="text-[0.6875rem] text-muted-foreground font-medium">Payment Id</div>
                    <div className="mt-1 text-sm font-bold font-mono text-foreground">
                      {selectedRecord.metadata?.paymentId ?? "5"}
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/20 p-3 text-center">
                    <div className="text-[0.6875rem] text-muted-foreground font-medium">Plan Id</div>
                    <div className="mt-1 text-sm font-bold font-mono text-foreground">
                      {selectedRecord.metadata?.planId ?? "2"}
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/20 p-3 text-center">
                    <div className="text-[0.6875rem] text-muted-foreground font-medium">Restaurant Id</div>
                    <div className="mt-1 text-sm font-bold font-mono text-foreground">
                      {selectedRecord.metadata?.restaurantId ?? "1"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <SheetFooter className="p-6 pt-4 border-t border-border/60 flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedRecord(null)}
              className="flex-1 h-9 text-xs font-medium cursor-pointer"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (selectedRecord) {
                  navigator.clipboard.writeText(`https://pay.xpay.com/${selectedRecord.fullReference}`)
                  toast.add({
                    type: "success",
                    title: "Copied Link",
                    description: `Checkout link copied to clipboard.`,
                  })
                }
              }}
              className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium cursor-pointer"
            >
              Copy Link
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Side Drawer (Sheet) for Create Payment Link */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-s border-border bg-card p-0 shadow-2xl flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <SheetHeader className="p-6 pb-4 border-b border-border/60">
            <SheetTitle className="text-base font-semibold">Create Payment Link</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Configure parameters to generate a shareable checkout link.
            </SheetDescription>
          </SheetHeader>

          {/* Drawer Form Body */}
          <form
            id="create-payment-link-form"
            onSubmit={handleCreateLink}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            {/* Merchant Profile */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Merchant profile</label>
              <div className="space-y-1">
                <select
                  value={merchantProfile}
                  onChange={(e) => setMerchantProfile(e.target.value)}
                  className="h-9 w-full rounded-lg bg-muted/30 px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <option value="Default" className="bg-popover text-popover-foreground">
                    Default
                  </option>
                  <option value="SalamaPay" className="bg-popover text-popover-foreground">
                    SalamaPay
                  </option>
                  <option value="XPay Store" className="bg-popover text-popover-foreground">
                    XPay Store
                  </option>
                </select>
                <p className="text-[0.6875rem] text-muted-foreground">
                  Choose a profile for branding, redirect URLs, and payment methods.
                </p>
              </div>
            </div>

            {/* Currency & Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Amount</label>
              <div className="space-y-2">
                {/* Currency selector */}
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-9 w-full rounded-lg bg-muted/30 px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <option value="TZS (Tanzanian Shilling)" className="bg-popover text-popover-foreground">
                    TZS (Tanzanian Shilling)
                  </option>
                  <option value="USD (US Dollar)" className="bg-popover text-popover-foreground">
                    USD (US Dollar)
                  </option>
                  <option value="KES (Kenyan Shilling)" className="bg-popover text-popover-foreground">
                    KES (Kenyan Shilling)
                  </option>
                  <option value="UGX (Ugandan Shilling)" className="bg-popover text-popover-foreground">
                    UGX (Ugandan Shilling)
                  </option>
                </select>

                {/* Amount input */}
                {!letCustomerChoose && (
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required={!letCustomerChoose}
                    className="h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
                  />
                )}

                <p className="text-[0.6875rem] text-muted-foreground">
                  Show the price to the customer in this currency. Settlement still happens in TZS.
                </p>
              </div>
            </div>

            {/* Let customer choose how much to pay */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={letCustomerChoose}
                  onChange={(e) => setLetCustomerChoose(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-xs font-medium text-foreground">
                  Let customer choose how much to pay
                </span>
              </label>
            </div>

            {/* Payment Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <div className="space-y-1">
                <Input
                  placeholder="Payment for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
                />
                <p className="text-[0.6875rem] text-muted-foreground">
                  Shown to the customer on the checkout page.
                </p>
              </div>
            </div>

            {/* Expiry Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Expiry</label>
              <div className="space-y-1">
                <select
                  value={expiryDuration}
                  onChange={(e) => setExpiryDuration(e.target.value)}
                  className="h-9 w-full rounded-lg bg-muted/30 px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <option value="1 hour" className="bg-popover text-popover-foreground">
                    1 hour
                  </option>
                  <option value="6 hours" className="bg-popover text-popover-foreground">
                    6 hours
                  </option>
                  <option value="24 hours" className="bg-popover text-popover-foreground">
                    24 hours
                  </option>
                  <option value="7 days" className="bg-popover text-popover-foreground">
                    7 days
                  </option>
                  <option value="30 days" className="bg-popover text-popover-foreground">
                    30 days
                  </option>
                  <option value="Never" className="bg-popover text-popover-foreground">
                    Never
                  </option>
                </select>
                <p className="text-[0.6875rem] text-muted-foreground">
                  Link will automatically deactivate after this duration.
                </p>
              </div>
            </div>
          </form>

          {/* Drawer Footer with Submit Button & Loading Animation */}
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
              form="create-payment-link-form"
              disabled={isSubmitting}
              className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium cursor-pointer relative"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce" />
                </div>
              ) : (
                "Create Link"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
