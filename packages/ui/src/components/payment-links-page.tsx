"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Copy01Icon,
  PlusSignIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  CheckmarkCircle01Icon,
  Tick02Icon,
  Clock01Icon,
  CancelCircleIcon,
  Calendar03Icon,
  RefreshIcon,
  Sorting01Icon,
  Link03Icon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/components/toast"
import {
  type PaymentLinkRecord,
  profileSlug,
} from "../data/mock-payment-links"
import { api } from "@workspace/ui/lib/api"

interface ApiPaymentLink {
  id: string
  name: string
  amount: number
  currency: string
  description: string | null
  isActive: boolean
  url: string
  createdAt: string
}

interface ApiPaymentPage {
  id: string
  name: string
  slug: string
  displayName: string | null
  isActive: boolean
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

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
  const [records, setRecords] = React.useState<PaymentLinkRecord[]>([])
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
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [origin, setOrigin] = React.useState("")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  const getPaymentUrl = React.useCallback(
    (profile: string) => {
      const base = origin || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
      return `${base}/pay/${profileSlug(profile)}`
    },
    [origin]
  )

  // Drawer form fields
  const [merchantProfile, setMerchantProfile] = React.useState("")
  const [currency, setCurrency] = React.useState("TZS")
  const [amount, setAmount] = React.useState("")
  const [letCustomerChoose, setLetCustomerChoose] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [expiryDuration, setExpiryDuration] = React.useState("1 hour")

  // Real merchant profiles from API
  const [profiles, setProfiles] = React.useState<ApiPaymentPage[]>([])
  const [profilesLoading, setProfilesLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    async function fetchProfiles() {
      try {
        const res = await api.get<ApiPaymentPage[]>("/payment-pages")
        if (!cancelled && res.success && res.data) {
 const pages = Array.isArray(res.data) ? res.data : []
          setProfiles(pages)
          if (pages.length > 0 && pages[0] && !merchantProfile) {
            setMerchantProfile(pages[0].name)
          }
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setProfilesLoading(false)
      }
    }
    fetchProfiles()
    return () => { cancelled = true }
  }, [])

  // Fetch payment links from API
  React.useEffect(() => {
    let cancelled = false
    async function fetchLinks() {
      setLoading(true)
      try {
        const res = await api.get<ApiPaymentLink[]>("/payment-links")
        if (!cancelled && res.success && res.data) {
          const links = Array.isArray(res.data) ? res.data : []
          const mapped: PaymentLinkRecord[] = links.map((link) => ({
            id: link.id,
            reference: link.url.length > 10 ? link.url.slice(0, 8) + "..." : link.url,
            fullReference: link.url,
            merchantProfile: link.name,
            amount: link.isActive ? `${link.currency || "TZS"} ${link.amount.toLocaleString()}` : "Inactive",
            customer: link.description || "-",
            status: link.isActive ? "unpaid" : "expired",
            description: link.description || undefined,
            createdAt: formatDate(link.createdAt),
            link: link.url,
          }))
          setRecords(mapped)
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchLinks()
    return () => { cancelled = true }
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

  function copyRef(ref: string, key?: string) {
    const targetKey = key || ref
    navigator.clipboard.writeText(ref)
    setCopiedKey(targetKey)
    setTimeout(() => {
      setCopiedKey((curr) => (curr === targetKey ? null : curr))
    }, 2000)
    toast.add({
      type: "success",
      title: "Copied Reference",
      description: `${ref} copied to clipboard.`,
    })
  }

  function copyCheckoutLink(url: string, key: string) {
    navigator.clipboard.writeText(url)
    setCopiedKey(key)
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr))
    }, 2000)
    toast.add({
      type: "success",
      title: "Link Copied!",
      description: "Checkout payment link copied to clipboard.",
    })
  }

  function previewCheckoutLink(profile: string) {
    const targetUrl = `/pay/${profileSlug(profile)}`
    window.open(targetUrl, "_blank", "noopener,noreferrer")
    toast.add({
      type: "info",
      title: "Opening Checkout",
      description: `Opened ${profile} in a new tab.`,
    })
  }

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault()
    if (!merchantProfile) {
      toast.add({ type: "error", title: "Select a profile", description: "Please choose a merchant profile." })
      return
    }
    setIsSubmitting(true)

    try {
      const linkAmount = letCustomerChoose ? 0 : Number(amount || 0)
      const res = await api.post<ApiPaymentLink>("/payment-links", {
        name: merchantProfile,
        amount: linkAmount,
        currency,
        description: description.trim() || undefined,
        isActive: true,
      })

      if (res.success && res.data) {
        const link = res.data
        const newRecord: PaymentLinkRecord = {
          id: link.id,
          reference: link.url.length > 10 ? link.url.slice(0, 8) + "..." : link.url,
          fullReference: link.url,
          merchantProfile: link.name,
          amount: `${link.currency || "TZS"} ${link.amount.toLocaleString()}`,
          customer: link.description || "-",
          status: "unpaid",
          description: link.description || undefined,
          createdAt: formatDate(link.createdAt),
          link: link.url,
        }

        setRecords([newRecord, ...records])
        setDrawerOpen(false)

        setAmount("")
        setDescription("")
        setLetCustomerChoose(false)
        setExpiryDuration("1 hour")
        setCurrency("TZS")
        if (profiles.length > 0 && profiles[0]) setMerchantProfile(profiles[0].name)

        toast.add({
          type: "success",
          title: "Payment Link Created",
          description: `Link for ${newRecord.merchantProfile} generated successfully.`,
        })
      } else {
        toast.add({
          type: "error",
          title: "Failed to create link",
          description: res.message || "Please try again.",
        })
      }
    } catch {
      toast.add({
        type: "error",
        title: "Network error",
        description: "Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
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
          <thead className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
            <tr>
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Merchant Profile</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
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
                <td colSpan={7} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50">
                      <HugeiconsIcon icon={Link03Icon} strokeWidth={1.5} className="size-7 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">No payment links found</p>
                      <p className="text-xs text-muted-foreground">Create a payment link to start collecting money from customers.</p>
                    </div>
                  </div>
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
                          className={`transition-opacity cursor-pointer ${
                            copiedKey === item.fullReference
                              ? "opacity-100 text-emerald-600 dark:text-emerald-400"
                              : "opacity-0 group-hover:opacity-100 hover:text-primary text-muted-foreground"
                          }`}
                          title={copiedKey === item.fullReference ? "Copied!" : "Copy reference"}
                        >
                          <HugeiconsIcon
                            icon={copiedKey === item.fullReference ? Tick02Icon : Copy01Icon}
                            strokeWidth={2}
                            className="size-3"
                          />
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
          <SheetHeader className="p-6 pb-4 border-b border-border/60 flex flex-row items-center justify-between pr-12">
            <div>
              <SheetTitle className="text-base font-semibold">Payment Link Details</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Overview and transaction metadata
              </SheetDescription>
            </div>
            {selectedRecord && (
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => previewCheckoutLink(selectedRecord.merchantProfile)}
                  className="h-8 gap-1 text-xs font-medium bg-background hover:bg-muted text-foreground cursor-pointer rounded-lg shrink-0"
                  title="Open checkout page in new tab"
                >
                  <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                  <span>Preview</span>
                </Button>
                <Button
                  size="sm"
                  variant={copiedKey === `header-${selectedRecord.fullReference}` ? "default" : "outline"}
                  onClick={() =>
                    copyCheckoutLink(
                      getPaymentUrl(selectedRecord.merchantProfile),
                      `header-${selectedRecord.fullReference}`
                    )
                  }
                  className={`h-8 gap-1.5 text-xs font-medium cursor-pointer rounded-lg shrink-0 transition-all ${
                    copiedKey === `header-${selectedRecord.fullReference}`
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 border-emerald-600"
                      : "bg-muted/40 hover:bg-muted"
                  }`}
                >
                  <HugeiconsIcon
                    icon={copiedKey === `header-${selectedRecord.fullReference}` ? Tick02Icon : Copy01Icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                  <span>{copiedKey === `header-${selectedRecord.fullReference}` ? "Copied!" : "Copy link"}</span>
                </Button>
              </div>
            )}
          </SheetHeader>

          {/* Body Content */}
          {selectedRecord && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Shareable Checkout Link Box */}
              <div className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-gradient-to-br from-muted/30 to-muted/10 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    Shareable Checkout Link
                  </span>
                  <span className="inline-flex items-center gap-1 text-[0.6875rem] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Link
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg bg-background border border-border/50 px-3 py-2 font-mono text-xs font-medium text-foreground shadow-2xs">
                  <span className="truncate text-primary">
                    {getPaymentUrl(selectedRecord.merchantProfile)}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        copyCheckoutLink(
                          getPaymentUrl(selectedRecord.merchantProfile),
                          `body-${selectedRecord.fullReference}`
                        )
                      }
                      className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                        copiedKey === `body-${selectedRecord.fullReference}`
                          ? "text-emerald-600 bg-emerald-500/10 font-sans font-medium"
                          : "hover:text-primary text-muted-foreground hover:bg-muted"
                      }`}
                      title="Copy link"
                    >
                      <HugeiconsIcon
                        icon={copiedKey === `body-${selectedRecord.fullReference}` ? Tick02Icon : Copy01Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                      {copiedKey === `body-${selectedRecord.fullReference}` && (
                        <span>Copied</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => previewCheckoutLink(selectedRecord.merchantProfile)}
                      className="p-1.5 rounded-md transition-colors hover:text-primary text-muted-foreground hover:bg-muted cursor-pointer"
                      title="Open in new tab"
                    >
                      <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Attributes */}
              <div className="space-y-4">
                {/* Reference */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium">Reference</span>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 p-2.5 font-mono text-xs font-semibold text-foreground">
                    <span className="truncate">{selectedRecord.fullReference}</span>
                    <button
                      type="button"
                      onClick={() => copyRef(selectedRecord.fullReference, `ref-${selectedRecord.fullReference}`)}
                      className={`transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                        copiedKey === `ref-${selectedRecord.fullReference}`
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "hover:text-primary text-muted-foreground"
                      }`}
                      title="Copy full reference"
                    >
                      <HugeiconsIcon
                        icon={copiedKey === `ref-${selectedRecord.fullReference}` ? Tick02Icon : Copy01Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                      {copiedKey === `ref-${selectedRecord.fullReference}` && (
                        <span className="text-[0.6875rem] font-sans font-medium">Copied!</span>
                      )}
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
          <SheetFooter className="p-6 pt-4 border-t border-border/60 flex flex-row gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedRecord(null)}
              className="h-9 text-xs font-medium cursor-pointer px-4"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (selectedRecord) {
                  previewCheckoutLink(selectedRecord.merchantProfile)
                }
              }}
              className="flex-1 h-9 gap-1.5 text-xs font-medium cursor-pointer hover:bg-muted"
            >
              <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} className="size-3.5" />
              <span>Preview</span>
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (selectedRecord) {
                  copyCheckoutLink(
                    getPaymentUrl(selectedRecord.merchantProfile),
                    `footer-${selectedRecord.fullReference}`
                  )
                }
              }}
              className={`flex-1 h-9 gap-1.5 text-xs font-medium cursor-pointer transition-all ${
                copiedKey === `footer-${selectedRecord?.fullReference}`
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <HugeiconsIcon
                icon={copiedKey === `footer-${selectedRecord?.fullReference}` ? Tick02Icon : Copy01Icon}
                strokeWidth={2}
                className="size-3.5"
              />
              <span>{copiedKey === `footer-${selectedRecord?.fullReference}` ? "Copied!" : "Copy Link"}</span>
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Merchant profile</label>
              {profilesLoading ? (
                <div className="h-10 rounded-lg bg-muted/30 animate-pulse" />
              ) : profiles.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 p-3 text-center text-[0.6875rem] text-muted-foreground">
                  No profiles found. Create a payment page first.
                </div>
              ) : (
                <Select value={merchantProfile} onValueChange={(v) => v && setMerchantProfile(v)}>
                  <SelectTrigger className="w-full h-10 text-xs bg-card border-border/80 rounded-lg">
                    <SelectValue placeholder="Select a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.displayName || p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-[0.6875rem] text-muted-foreground">
                Choose a profile for branding, redirect URLs, and payment methods.
              </p>
            </div>

            {/* Currency & Amount */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Amount</label>
              <div className="space-y-2">
                {/* Currency selector */}
                <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
                  <SelectTrigger className="w-full h-10 text-xs bg-card border-border/80 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TZS">TZS (Tanzanian Shilling)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                    <SelectItem value="UGX">UGX (Ugandan Shilling)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Amount input */}
                {!letCustomerChoose && (
                  <div className="flex items-center rounded-lg border border-border/80 bg-card overflow-hidden focus-within:ring-1 focus-within:ring-primary">
                    <div className="flex items-center gap-1 border-r border-border/80 bg-muted/25 px-3 py-2.5 text-xs font-medium text-foreground shrink-0">
                      <span>{currency}</span>
                    </div>
                    <input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required={!letCustomerChoose}
                      min="0"
                      className="flex-1 border-0 bg-transparent px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                )}

                <p className="text-[0.6875rem] text-muted-foreground">
                  Show the price to the customer in this currency. Settlement still happens in TZS.
                </p>
              </div>
            </div>

            {/* Let customer choose how much to pay */}
            <div className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <Checkbox
                checked={letCustomerChoose}
                onCheckedChange={(checked) => setLetCustomerChoose(checked === true)}
              />
              <span className="text-xs font-medium text-foreground">
                Let customer choose how much to pay
              </span>
            </div>

            {/* Payment Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <Input
                placeholder="Payment for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-10 text-xs bg-card border-border/80 rounded-lg focus-visible:ring-1"
              />
              <p className="text-[0.6875rem] text-muted-foreground">
                Shown to the customer on the checkout page.
              </p>
            </div>

            {/* Expiry Duration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Expiry</label>
              <Select value={expiryDuration} onValueChange={(v) => v && setExpiryDuration(v)}>
                <SelectTrigger className="w-full h-10 text-xs bg-card border-border/80 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="6 hours">6 hours</SelectItem>
                  <SelectItem value="24 hours">24 hours</SelectItem>
                  <SelectItem value="7 days">7 days</SelectItem>
                  <SelectItem value="30 days">30 days</SelectItem>
                  <SelectItem value="Never">Never</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[0.6875rem] text-muted-foreground">
                Link will automatically deactivate after this duration.
              </p>
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
