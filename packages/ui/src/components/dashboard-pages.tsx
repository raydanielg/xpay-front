"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Copy01Icon,
  Loading03Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  CancelCircleIcon,
  PlusIcon,
  Edit02Icon,
  TrashIcon,
  EyeIcon,
  MegaphoneIcon,
  ChartIcon,
  TargetIcon,
  Coins01Icon,
  MouseLeftClick01Icon,
  TrendingUpIcon,
  Link02Icon,
  Calendar03Icon,
  Cancel01Icon,
  Key01Icon,
  PlayIcon,
  ArrowUpRight01Icon,
  ArrowDown01Icon,
  Tick02Icon,
  Alert02Icon,
  ArrowTurnForwardIcon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@workspace/ui/components/sheet"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@workspace/ui/components/select"
import { Popover, PopoverTrigger, PopoverContent } from "@workspace/ui/components/popover"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"

// ===================== TRANSACTIONS PAGE =====================
export function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")

  React.useEffect(() => {
    let cancelled = false
    async function fetchTx() {
      try {
        const res = await api.get<any[]>("/payments")
        if (!cancelled && res.success && res.data) {
          setTransactions(res.data)
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchTx()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase()
    const matchesSearch =
      t.reference?.toLowerCase().includes(q) ||
      t.customerEmail?.toLowerCase().includes(q) ||
      t.customerName?.toLowerCase().includes(q) ||
      t.amount?.toString().includes(q)

    const matchesStatus =
      statusFilter === "ALL" ||
      t.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text)
    toast.add({
      type: "success",
      title: "Copied",
      description: `${label} copied to clipboard.`,
    })
  }

  function formatStatus(status: string) {
    const s = status?.toLowerCase()
    if (s === "completed" || s === "successful") {
      return (
        <Badge variant="outline" className="text-[0.625rem] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
          COMPLETED
        </Badge>
      )
    }
    if (s === "pending") {
      return (
        <Badge variant="outline" className="text-[0.625rem] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
          <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3 mr-1" />
          PENDING
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

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">Transactions</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Real-time stream of all customer checkout transactions and payment collections.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ref, customer, amount..."
            className="pl-9 h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["ALL", "COMPLETED", "PENDING", "FAILED"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 py-12 text-center text-xs text-muted-foreground">
          No transactions found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-muted-foreground font-semibold">
                  <th className="py-3 px-4 font-medium">Reference</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Method</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span>{t.reference?.slice(0, 12)}...</span>
                        <button
                          type="button"
                          onClick={() => copyText(t.reference, "Reference")}
                          className="opacity-50 hover:opacity-100 cursor-pointer"
                        >
                          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {t.currency} {(t.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {t.customerName || t.customerEmail || "—"}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground capitalize">
                      {t.method || "Mobile Money"}
                    </td>
                    <td className="py-3 px-4">
                      {formatStatus(t.status)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString("en-GB", {
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
        </div>
      )}
    </div>
  )
}

// ===================== MARKETING PAGE =====================
interface Campaign {
  id: string
  name: string
  channel: string
  status: string
  targetUrl: string
  shortCode: string
  budget: number
  spend: number
  clicks: number
  conversions: number
  revenue: number
  startDate: string | null
  endDate: string | null
  notes: string | null
  createdAt: string
}

interface CampaignStats {
  totalCampaigns: number
  activeCampaigns: number
  totalClicks: number
  totalConversions: number
  totalSpend: number
  totalRevenue: number
  conversionRate: number
  roi: number
}

const channelLabels: Record<string, string> = {
  social: "Social Media",
  email: "Email",
  sms: "SMS",
  direct: "Direct",
  referral: "Referral",
  paid_ads: "Paid Ads",
  other: "Other",
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
}

export function MarketingPage() {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([])
  const [stats, setStats] = React.useState<CampaignStats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [channelFilter, setChannelFilter] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const limit = 15

  // Drawer state
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<"create" | "edit">("create")
  const [editingCampaign, setEditingCampaign] = React.useState<Campaign | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [viewCampaign, setViewCampaign] = React.useState<Campaign | null>(null)

  const [form, setForm] = React.useState({
    name: "",
    channel: "social",
    targetUrl: "",
    budget: "0",
    spend: "0",
    clicks: "0",
    conversions: "0",
    revenue: "0",
    status: "active",
    startDate: "",
    endDate: "",
    notes: "",
  })

  async function fetchStats() {
    try {
      const res = await api.get<any>("/marketing/stats")
      if (res.success && res.data) setStats(res.data)
    } catch {
      // silent
    }
  }

  async function fetchCampaigns(p = 1) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) })
      if (search) params.set("search", search)
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (channelFilter !== "all") params.set("channel", channelFilter)
      const res = await api.get<any>(`/marketing?${params.toString()}`)
      if (res.success && Array.isArray(res.data)) {
        setCampaigns(res.data)
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
    fetchStats()
  }, [])

  React.useEffect(() => {
    fetchCampaigns(1)
  }, [statusFilter, channelFilter])

  React.useEffect(() => {
    const timer = setTimeout(() => fetchCampaigns(1), 400)
    return () => clearTimeout(timer)
  }, [search])

  function openCreate() {
    setDrawerMode("create")
    setEditingCampaign(null)
    setForm({
      name: "",
      channel: "social",
      targetUrl: "",
      budget: "0",
      spend: "0",
      clicks: "0",
      conversions: "0",
      revenue: "0",
      status: "active",
      startDate: "",
      endDate: "",
      notes: "",
    })
    setDrawerOpen(true)
  }

  function openEdit(c: Campaign) {
    setDrawerMode("edit")
    setEditingCampaign(c)
    setForm({
      name: c.name,
      channel: c.channel,
      targetUrl: c.targetUrl,
      budget: String(c.budget),
      spend: String(c.spend),
      clicks: String(c.clicks),
      conversions: String(c.conversions),
      revenue: String(c.revenue),
      status: c.status,
      startDate: c.startDate ? c.startDate.split("T")[0] || "" : "",
      endDate: c.endDate ? c.endDate.split("T")[0] || "" : "",
      notes: c.notes || "",
    })
    setDrawerOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        channel: form.channel,
        targetUrl: form.targetUrl.trim(),
        budget: Number(form.budget) || 0,
        spend: Number(form.spend) || 0,
        clicks: Number(form.clicks) || 0,
        conversions: Number(form.conversions) || 0,
        revenue: Number(form.revenue) || 0,
        status: form.status,
        startDate: form.startDate || "",
        endDate: form.endDate || "",
        notes: form.notes.trim() || "",
      }
      let res: any
      if (drawerMode === "create") {
        const { status, clicks, conversions, revenue, ...createPayload } = payload
        res = await api.post<any>("/marketing", createPayload)
      } else {
        res = await api.patch<any>(`/marketing/${editingCampaign?.id}`, payload)
      }
      if (res.success) {
        toast.add({
          type: "success",
          title: drawerMode === "create" ? "Campaign Created" : "Campaign Updated",
          description: drawerMode === "create"
            ? "Your marketing campaign is now live."
            : "Campaign has been updated.",
        })
        setDrawerOpen(false)
        fetchCampaigns(page)
        fetchStats()
      } else {
        toast.add({ type: "error", title: "Save Failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Could not save campaign." })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this campaign?")) return
    try {
      const res = await api.delete<any>(`/marketing/${id}`)
      if (res.success) {
        toast.add({ type: "success", title: "Deleted", description: "Campaign removed." })
        fetchCampaigns(page)
        fetchStats()
      }
    } catch {
      toast.add({ type: "error", title: "Network Error", description: "Could not delete." })
    }
  }

  function copyShortLink(code: string) {
    const link = `https://xpay.me/m/${code}`
    navigator.clipboard.writeText(link)
    toast.add({ type: "success", title: "Copied", description: link })
  }

  const hasActiveFilters = search || statusFilter !== "all" || channelFilter !== "all"

  function resetFilters() {
    setSearch("")
    setStatusFilter("all")
    setChannelFilter("all")
  }

  const statusTabs = ["all", "active", "paused", "completed"] as const
  const channelOptions = ["all", "social", "email", "sms", "direct", "referral", "paid_ads", "other"] as const

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Marketing & Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Create marketing strategies, track campaign performance, and measure ROI in real time.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
        >
          <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
          <span>New Campaign</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Active Campaigns</span>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats ? stats.activeCampaigns : "..."}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Total Clicks</span>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats ? stats.totalClicks.toLocaleString() : "..."}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Conversion Rate</span>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {stats ? `${stats.conversionRate}%` : "..."}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <span className="text-xs font-medium text-muted-foreground">ROI</span>
          <div className={`text-2xl font-bold tracking-tight ${stats && stats.roi >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {stats ? `${stats.roi >= 0 ? "+" : ""}${stats.roi}%` : "..."}
          </div>
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
            placeholder="Search campaigns..."
            className="pl-9 h-9 text-xs bg-card border border-border/80 rounded-lg focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
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

          <Select
            value={channelFilter}
            onValueChange={(v) => v && setChannelFilter(v)}
          >
            <SelectTrigger className="h-8 w-auto gap-1.5 rounded-lg border border-border/70 bg-card text-xs font-medium px-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {channelOptions.map((ch) => (
                <SelectItem key={ch} value={ch}>
                  {ch === "all" ? "All Channels" : channelLabels[ch] || ch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

      {/* Campaigns Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-border/60 bg-card text-center p-6 space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon icon={MegaphoneIcon} strokeWidth={2} className="size-6" />
          </div>
          <h3 className="text-sm font-medium text-foreground">No campaigns yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Create your first marketing campaign to start tracking clicks, conversions, and ROI.
          </p>
          <Button onClick={openCreate} className="h-9 rounded-lg bg-primary text-primary-foreground text-xs font-medium cursor-pointer">
            Create First Campaign
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4 font-medium">Campaign</th>
                    <th className="py-3 px-4 font-medium">Channel</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Clicks</th>
                    <th className="py-3 px-4 font-medium">Conv.</th>
                    <th className="py-3 px-4 font-medium">Spend</th>
                    <th className="py-3 px-4 font-medium">Revenue</th>
                    <th className="py-3 px-4 font-medium">ROI</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-normal">
                  {campaigns.map((c) => {
                    const roi = c.spend > 0 ? ((c.revenue - c.spend) / c.spend) * 100 : 0
                    const convRate = c.clicks > 0 ? (c.conversions / c.clicks) * 100 : 0
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setViewCampaign(c)}
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{c.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyShortLink(c.shortCode)
                              }}
                              className="flex items-center gap-1 text-[0.625rem] text-primary hover:underline mt-0.5"
                            >
                              <HugeiconsIcon icon={Link02Icon} strokeWidth={2} className="size-3" />
                              xpay.me/m/{c.shortCode}
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {channelLabels[c.channel] || c.channel}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className={`text-[0.625rem] font-semibold capitalize ${statusColors[c.status] || "bg-muted text-muted-foreground border-border/40"}`}>
                            {c.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-foreground tabular-nums">{c.clicks.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-foreground tabular-nums">
                          {c.conversions} <span className="text-[0.625rem] text-muted-foreground">({convRate.toFixed(1)}%)</span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground tabular-nums">{c.spend.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-foreground tabular-nums">{c.revenue.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className={`font-semibold tabular-nums ${roi >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {roi >= 0 ? "+" : ""}{roi.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); openEdit(c) }}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleDelete(c.id) }}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500 cursor-pointer"
                            >
                              <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5" />
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

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span>–
              <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of{" "}
              <span className="font-medium text-foreground">{total}</span> campaigns
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => fetchCampaigns(page - 1)}
                className="h-8 gap-1 border-border/70 rounded-lg text-xs font-medium cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5 rotate-180" />
                <span>Prev</span>
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => fetchCampaigns(page + 1)}
                className="h-8 gap-1 border-border/70 rounded-lg text-xs font-medium cursor-pointer"
              >
                <span>Next</span>
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Create / Edit Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
          <SheetHeader className="p-5 border-b border-border/60">
            <SheetTitle className="text-sm font-semibold">
              {drawerMode === "create" ? "New Marketing Campaign" : "Edit Campaign"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {drawerMode === "create"
                ? "Create a trackable marketing campaign with ROI metrics."
                : "Update campaign details and performance metrics."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Campaign Name *</label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Summer Sale Promo"
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Channel</label>
              <Select
                value={form.channel}
                onValueChange={(v) => v && setForm((p) => ({ ...p, channel: v }))}
              >
                <SelectTrigger className="w-full h-9 text-xs bg-card border-border/80 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(channelLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Target URL *</label>
              <Input
                required
                type="url"
                value={form.targetUrl}
                onChange={(e) => setForm((p) => ({ ...p, targetUrl: e.target.value }))}
                placeholder="https://xpay.me/pay/my-store"
                className="h-9 text-xs bg-card border-border/80 rounded-lg"
              />
              <p className="text-[0.625rem] text-muted-foreground">Where users land when they click your short link</p>
            </div>

            {drawerMode === "edit" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(v) => v && setForm((p) => ({ ...p, status: v }))}
                >
                  <SelectTrigger className="w-full h-9 text-xs bg-card border-border/80 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Budget & Spend */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Budget</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.budget}
                  onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                  className="h-9 text-xs bg-card border-border/80 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Spend</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.spend}
                  onChange={(e) => setForm((p) => ({ ...p, spend: e.target.value }))}
                  className="h-9 text-xs bg-card border-border/80 rounded-lg"
                />
              </div>
            </div>

            {/* Performance (edit mode only) */}
            {drawerMode === "edit" && (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Clicks</label>
                  <Input
                    type="number"
                    min="0"
                    value={form.clicks}
                    onChange={(e) => setForm((p) => ({ ...p, clicks: e.target.value }))}
                    className="h-9 text-xs bg-card border-border/80 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Conversions</label>
                  <Input
                    type="number"
                    min="0"
                    value={form.conversions}
                    onChange={(e) => setForm((p) => ({ ...p, conversions: e.target.value }))}
                    className="h-9 text-xs bg-card border-border/80 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Revenue</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.revenue}
                    onChange={(e) => setForm((p) => ({ ...p, revenue: e.target.value }))}
                    className="h-9 text-xs bg-card border-border/80 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Start Date</label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  className="h-9 text-xs bg-card border-border/80 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">End Date</label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  className="h-9 text-xs bg-card border-border/80 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Campaign strategy, targeting notes, goals..."
                className="min-h-[80px] w-full rounded-lg border border-border/70 bg-card p-3 text-xs text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </form>
          <SheetFooter className="p-5 border-t border-border/60 gap-2">
            <Button type="button" variant="outline" onClick={() => setDrawerOpen(false)} className="h-9 text-xs font-medium rounded-lg border-border/70">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.name.trim() || !form.targetUrl.trim() || saving}
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
                  <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5 mr-1.5" />
                  {drawerMode === "create" ? "Create Campaign" : "Update Campaign"}
                </>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Campaign Detail */}
      <Sheet open={!!viewCampaign} onOpenChange={(o) => !o && setViewCampaign(null)}>
        <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
          {viewCampaign && (
            <>
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="text-sm font-semibold flex items-center gap-2">
                  <HugeiconsIcon icon={MegaphoneIcon} strokeWidth={2} className="size-4" />
                  {viewCampaign.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Campaign details and performance metrics
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={ChartIcon} strokeWidth={2} className="size-6" />
                  </div>
                  <div>
                    <Badge variant="outline" className={`text-[0.625rem] font-semibold capitalize ${statusColors[viewCampaign.status] || ""}`}>
                      {viewCampaign.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{channelLabels[viewCampaign.channel] || viewCampaign.channel}</p>
                  </div>
                </div>

                {/* Short Link */}
                <div className="rounded-xl border border-border/60 p-4 space-y-2">
                  <span className="text-xs font-semibold text-foreground">Trackable Short Link</span>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono text-primary">xpay.me/m/{viewCampaign.shortCode}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyShortLink(viewCampaign.shortCode)}
                      className="h-7 text-xs gap-1 cursor-pointer"
                    >
                      <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                      Copy
                    </Button>
                  </div>
                  <div className="text-[0.625rem] text-muted-foreground truncate">
                    → {viewCampaign.targetUrl}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/60 p-3 space-y-1">
                    <span className="text-[0.625rem] text-muted-foreground">Clicks</span>
                    <div className="text-lg font-bold text-foreground tabular-nums">{viewCampaign.clicks.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3 space-y-1">
                    <span className="text-[0.625rem] text-muted-foreground">Conversions</span>
                    <div className="text-lg font-bold text-foreground tabular-nums">{viewCampaign.conversions}</div>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3 space-y-1">
                    <span className="text-[0.625rem] text-muted-foreground">Spend</span>
                    <div className="text-lg font-bold text-foreground tabular-nums">{viewCampaign.spend.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3 space-y-1">
                    <span className="text-[0.625rem] text-muted-foreground">Revenue</span>
                    <div className="text-lg font-bold text-emerald-600 tabular-nums">{viewCampaign.revenue.toLocaleString()}</div>
                  </div>
                </div>

                {/* ROI */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-foreground">Return on Investment</span>
                      <div className={`text-2xl font-bold tabular-nums ${viewCampaign.spend > 0 && ((viewCampaign.revenue - viewCampaign.spend) / viewCampaign.spend) * 100 >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {viewCampaign.spend > 0
                          ? `${((viewCampaign.revenue - viewCampaign.spend) / viewCampaign.spend) * 100 >= 0 ? "+" : ""}${(((viewCampaign.revenue - viewCampaign.spend) / viewCampaign.spend) * 100).toFixed(1)}%`
                          : "—"
                        }
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-foreground">Conv. Rate</span>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {viewCampaign.clicks > 0 ? `${((viewCampaign.conversions / viewCampaign.clicks) * 100).toFixed(1)}%` : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="rounded-xl border border-border/60 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium text-foreground">{viewCampaign.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-medium text-foreground">{viewCampaign.spend.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${viewCampaign.budget > 0 ? Math.min((viewCampaign.spend / viewCampaign.budget) * 100, 100) : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[0.625rem] text-muted-foreground">
                    <span>{viewCampaign.budget > 0 ? `${((viewCampaign.spend / viewCampaign.budget) * 100).toFixed(0)}% used` : "No budget set"}</span>
                    <span>{viewCampaign.budget - viewCampaign.spend > 0 ? `${(viewCampaign.budget - viewCampaign.spend).toLocaleString()} remaining` : "Budget exhausted"}</span>
                  </div>
                </div>

                {/* Dates */}
                {(viewCampaign.startDate || viewCampaign.endDate) && (
                  <div className="rounded-xl border border-border/60 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
                      Campaign Schedule
                    </div>
                    {viewCampaign.startDate && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Start</span>
                        <span className="font-medium text-foreground">{new Date(viewCampaign.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                    {viewCampaign.endDate && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">End</span>
                        <span className="font-medium text-foreground">{new Date(viewCampaign.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {viewCampaign.notes && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground">Strategy Notes</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed rounded-xl bg-muted/30 border border-border/40 p-4">
                      {viewCampaign.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => { setViewCampaign(null); openEdit(viewCampaign) }}
                    className="h-9 flex-1 text-xs font-medium rounded-lg border-border/70 cursor-pointer"
                  >
                    <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { handleDelete(viewCampaign.id); setViewCampaign(null) }}
                    className="h-9 text-xs font-medium rounded-lg border-border/70 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
interface ApiKey {
  id: string
  name: string
  key?: string
  keyPrefix: string
  scopes?: string | null
  expiresAt?: string | null
  isActive: boolean
  lastUsedAt: string | null
  createdAt: string
}

interface Webhook {
  id: string
  url: string
  event: string
  isActive: boolean
  createdAt: string
}

const devTabs = ["API Keys", "API Versions", "Webhooks", "Settings"] as const
type DevTab = (typeof devTabs)[number]

const AVAILABLE_SCOPES = [
  { id: "collection:read", label: "collection:read", description: "Read payment collections & transactions" },
  { id: "collection:create", label: "collection:create", description: "Create payment collection requests" },
  { id: "disbursement:read", label: "disbursement:read", description: "Read disbursements & payouts" },
  { id: "disbursement:create", label: "disbursement:create", description: "Create disbursement & payout transfers" },
] as const

const webhookEvents = [
  "payment.created",
  "payment.completed",
  "payment.failed",
  "payout.created",
  "payout.completed",
  "refund.created",
] as const

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

const apiVersions = [
  { version: "v1", status: "stable", released: "Jan 2025", deprecation: null as string | null, endpoint: "/v1" },
  { version: "v2", status: "beta", released: "Aug 2025", deprecation: null as string | null, endpoint: "/v2" },
  { version: "v0", status: "deprecated", released: "Mar 2024", deprecation: "Dec 2025", endpoint: "/v0" },
] as const

export function DeveloperPage() {
  const [activeTab, setActiveTab] = React.useState<DevTab>("API Keys")
  const [keys, setKeys] = React.useState<ApiKey[]>([])
  const [webhooks, setWebhooks] = React.useState<Webhook[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  // API Key creation modal
  const [createOpen, setCreateOpen] = React.useState(false)
  const [keyName, setKeyName] = React.useState("")
  const [selectedScopes, setSelectedScopes] = React.useState<string[]>([
    "collection:read",
    "collection:create",
  ])
  const [expiryOption, setExpiryOption] = React.useState("never")
  const [createdRawKey, setCreatedRawKey] = React.useState<string | null>(null)
  const [keyCopied, setKeyCopied] = React.useState(false)
  const [keyToDelete, setKeyToDelete] = React.useState<{ id: string; name: string } | null>(null)
  const [revokeAllOpen, setRevokeAllOpen] = React.useState(false)
  const [webhookSecret, setWebhookSecret] = React.useState("whsec_40b5ca2de0c75f1a32f8a7b6c9d1e3f5")
  const [webhookSecretCopied, setWebhookSecretCopied] = React.useState(false)
  const [renewSecretOpen, setRenewSecretOpen] = React.useState(false)
  const [scopesPopoverOpen, setScopesPopoverOpen] = React.useState(false)

  // Webhook form
  const [whUrl, setWhUrl] = React.useState("")
  const [whEvent, setWhEvent] = React.useState<string>(webhookEvents[0])
  const [webhookStatusFilter, setWebhookStatusFilter] = React.useState<string>("all")
  const [selectedWebhook, setSelectedWebhook] = React.useState<any | null>(null)

  React.useEffect(() => {
    let cancelled = false
    async function loadData() {
      try {
        const [keysRes, webhooksRes] = await Promise.all([
          api.get<any[]>("/api-keys"),
          api.get<any[]>("/webhooks"),
        ])
        if (!cancelled) {
          if (keysRes.success && Array.isArray(keysRes.data)) setKeys(keysRes.data as ApiKey[])
          if (webhooksRes.success && Array.isArray(webhooksRes.data)) setWebhooks(webhooksRes.data as Webhook[])
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadData()
    return () => { cancelled = true }
  }, [])

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text)
    toast.add({ type: "success", title: "Copied", description: `${label} copied to clipboard.` })
  }

  function toggleScope(scopeId: string) {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    )
  }

  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault()
    if (!keyName.trim()) return
    setSaving(true)
    try {
      let expiresAt: string | null = null
      const now = new Date()
      if (expiryOption === "30d") {
        now.setDate(now.getDate() + 30)
        expiresAt = now.toISOString()
      } else if (expiryOption === "60d") {
        now.setDate(now.getDate() + 60)
        expiresAt = now.toISOString()
      } else if (expiryOption === "90d") {
        now.setDate(now.getDate() + 90)
        expiresAt = now.toISOString()
      } else if (expiryOption === "1y") {
        now.setFullYear(now.getFullYear() + 1)
        expiresAt = now.toISOString()
      }

      const res = await api.post<any>("/api-keys", {
        name: keyName.trim(),
        scopes: selectedScopes,
        expiresAt,
      })

      if (res.success && res.data) {
        setKeys((prev) => [res.data, ...prev])
        setCreatedRawKey(res.data.key || res.data.keyPrefix)
        setKeyName("")
        setSelectedScopes(["collection:read", "collection:create"])
        setExpiryOption("never")
        setCreateOpen(false)
        toast.add({
          type: "success",
          title: "API Key Created",
          description: "Copy your key now — it won't be shown again.",
        })
      } else {
        toast.add({ type: "error", title: "Error", description: res.message || "Failed to create API key." })
      }
    } catch {
      toast.add({ type: "error", title: "Error", description: "Could not create API key." })
    } finally {
      setSaving(false)
    }
  }

  async function deleteKey(id: string) {
    try {
      const res = await api.delete<any>(`/api-keys/${id}`)
      if (res.success) {
        setKeys((prev) => prev.filter((k) => k.id !== id))
        toast.add({ type: "success", title: "Revoked", description: "API key revoked successfully." })
      } else {
        toast.add({ type: "error", title: "Error", description: res.message || "Could not revoke key." })
      }
    } catch {
      toast.add({ type: "error", title: "Error", description: "Could not revoke key." })
    }
  }

  async function handleRevokeAll() {
    try {
      const res = await api.post<any>("/api-keys/revoke-all", {})
      if (res.success) {
        setKeys([])
        toast.add({ type: "success", title: "All Keys Revoked", description: "All API keys have been revoked." })
      } else {
        toast.add({ type: "error", title: "Error", description: res.message || "Could not revoke all keys." })
      }
    } catch {
      toast.add({ type: "error", title: "Error", description: "Could not revoke all keys." })
    }
  }

  async function createWebhook(e: React.FormEvent) {
    e.preventDefault()
    if (!whUrl.trim() || !whEvent) return
    setSaving(true)
    try {
      const res = await api.post<any>("/webhooks", { url: whUrl.trim(), event: whEvent })
      if (res.success && res.data) {
        setWebhooks((prev) => [res.data, ...prev])
        setWhUrl("")
        toast.add({ type: "success", title: "Webhook Added", description: "Endpoint will receive event notifications." })
      }
    } catch {
      toast.add({ type: "error", title: "Error", description: "Could not add webhook." })
    } finally {
      setSaving(false)
    }
  }

  async function deleteWebhook(id: string) {
    try {
      const res = await api.delete<any>(`/webhooks/${id}`)
      if (res.success) {
        setWebhooks((prev) => prev.filter((w) => w.id !== id))
        toast.add({ type: "success", title: "Deleted", description: "Webhook removed successfully." })
      } else {
        toast.add({ type: "error", title: "Error", description: res.message || "Could not delete webhook." })
      }
    } catch {
      toast.add({ type: "error", title: "Error", description: "Could not delete webhook." })
    }
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Developer & API Tools</h1>
        <p className="text-sm text-muted-foreground">
          Manage API keys, webhooks, and developer settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/60 overflow-x-auto">
        {devTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === tab
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "API Keys" && (
        <div className="space-y-4">
          {/* Top Banner / Actions matching Screenshot 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="text-muted-foreground">
              API keys allow programmatic access. Use them as Bearer tokens.{" "}
              <a
                href="#docs"
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium inline-flex items-center gap-0.5"
              >
                Learn here <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} className="size-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer gap-1.5"
              >
                <HugeiconsIcon icon={PlayIcon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                <span>Watch tutorial</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevokeAllOpen(true)}
                disabled={keys.length === 0}
                className="h-8 px-3 text-xs font-medium border-border/70 rounded-lg hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer"
              >
                Revoke all
              </Button>

              <Button
                size="sm"
                onClick={() => setCreateOpen(true)}
                className="h-8 px-3 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1"
              >
                <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-3.5" />
                <span>Create key</span>
              </Button>
            </div>
          </div>

          {/* Table matching Screenshot 1 */}
          {loading ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-border/60 bg-card">
              <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-7 animate-spin text-muted-foreground" />
            </div>
          ) : keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 rounded-xl border border-dashed border-border/60 bg-card text-center p-6 space-y-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
                <HugeiconsIcon icon={Key01Icon} strokeWidth={2} className="size-5" />
              </div>
              <p className="text-xs text-muted-foreground">No API keys yet. Click &quot;Create key&quot; to generate one.</p>
              <Button
                size="sm"
                onClick={() => setCreateOpen(true)}
                className="h-8 px-3 text-xs font-medium rounded-lg bg-primary text-primary-foreground cursor-pointer"
              >
                + Create key
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground font-semibold text-[0.6875rem] uppercase tracking-wider">
                      <th className="py-3 px-4 w-10"></th>
                      <th className="py-3 px-4 font-semibold text-foreground">NAME</th>
                      <th className="py-3 px-4 font-semibold text-foreground">KEY PREFIX</th>
                      <th className="py-3 px-4 font-semibold text-foreground">SCOPES</th>
                      <th className="py-3 px-4 font-semibold text-foreground">LAST USED</th>
                      <th className="py-3 px-4 font-semibold text-foreground">EXPIRES</th>
                      <th className="py-3 px-4 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-normal">
                    {keys.map((k) => {
                      const keyScopes = k.scopes
                        ? k.scopes.split(",").map((s) => s.trim()).filter(Boolean)
                        : ["collection:read", "collection:create"]

                      let lastUsedFormatted = ""
                      if (k.lastUsedAt) {
                        const d = new Date(k.lastUsedAt)
                        lastUsedFormatted = `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
                      }

                      let expiresFormatted = ""
                      if (k.expiresAt) {
                        const d = new Date(k.expiresAt)
                        expiresFormatted = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      }

                      const prefixDisplay = k.keyPrefix
                        ? k.keyPrefix.endsWith("...")
                          ? k.keyPrefix
                          : `${k.keyPrefix}...`
                        : "snp_••••••••..."

                      return (
                        <tr key={k.id} className="hover:bg-muted/15 transition-colors">
                          <td className="py-3.5 px-4 text-muted-foreground">
                            <HugeiconsIcon icon={Key01Icon} strokeWidth={1.75} className="size-4 opacity-70" />
                          </td>
                          <td className="py-3.5 px-4 font-medium text-foreground">
                            {k.name}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-muted-foreground">
                            {prefixDisplay}
                          </td>
                          <td className="py-3.5 px-4">
                            <Popover>
                              <PopoverTrigger className="flex items-center gap-1 text-[0.6875rem] font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider cursor-pointer">
                                <span>SCOPES</span>
                                <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3" />
                              </PopoverTrigger>
                              <PopoverContent align="start" className="w-60 p-2.5 rounded-xl bg-card border border-border shadow-lg">
                                <div className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                                  Active Scopes ({keyScopes.length})
                                </div>
                                <div className="space-y-1 mt-1">
                                  {AVAILABLE_SCOPES.map((scope) => {
                                    const hasScope = keyScopes.includes(scope.id)
                                    return (
                                      <div
                                        key={scope.id}
                                        className="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
                                      >
                                        <HugeiconsIcon
                                          icon={hasScope ? Tick02Icon : CancelCircleIcon}
                                          strokeWidth={2}
                                          className={`size-3.5 ${hasScope ? "text-emerald-600" : "text-muted-foreground/30"}`}
                                        />
                                        <span
                                          className={`font-mono text-[0.6875rem] ${
                                            hasScope
                                              ? "text-foreground font-medium"
                                              : "text-muted-foreground line-through opacity-40"
                                          }`}
                                        >
                                          {scope.id}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground">
                            {lastUsedFormatted || "—"}
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground">
                            {expiresFormatted || "—"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setKeyToDelete({ id: k.id, name: k.name })}
                              className="h-7 w-7 p-0 text-rose-500/70 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                              <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create API Key Sheet matching Screenshot 2 */}
          <Sheet open={createOpen} onOpenChange={setCreateOpen}>
            <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="text-base font-semibold text-foreground">Create API key</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  The raw key is shown only once. Store it securely.
                </SheetDescription>
              </SheetHeader>

              <form onSubmit={handleCreateKey} className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Name</label>
                  <Input
                    required
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g. Production Backend"
                    className="h-9 text-xs bg-muted/10 border-border/80 rounded-lg"
                  />
                </div>

                {/* Scopes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Scopes</label>

                  <Popover open={scopesPopoverOpen} onOpenChange={setScopesPopoverOpen}>
                    <PopoverTrigger className="w-full flex items-center justify-between h-9 px-3 text-xs bg-muted/10 border border-border/80 rounded-lg text-foreground cursor-pointer hover:bg-muted/20 transition-colors">
                      <span className="text-muted-foreground">
                        {selectedScopes.length === 0
                          ? "Select scopes"
                          : selectedScopes.length === AVAILABLE_SCOPES.length
                          ? "All scopes selected (4/4)"
                          : `${selectedScopes.length} scopes selected`}
                      </span>
                      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-80 p-3 rounded-xl bg-card border border-border shadow-xl space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-border/50">
                        <span className="text-xs font-semibold text-foreground">API Scopes</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedScopes.length === AVAILABLE_SCOPES.length) {
                              setSelectedScopes([])
                            } else {
                              setSelectedScopes(AVAILABLE_SCOPES.map((s) => s.id))
                            }
                          }}
                          className="text-[0.6875rem] text-primary hover:underline font-medium cursor-pointer"
                        >
                          {selectedScopes.length === AVAILABLE_SCOPES.length ? "Deselect all" : "Select all"}
                        </button>
                      </div>

                      <div className="space-y-1 pt-1">
                        {AVAILABLE_SCOPES.map((scope) => {
                          const isChecked = selectedScopes.includes(scope.id)
                          return (
                            <div
                              key={scope.id}
                              onClick={() => toggleScope(scope.id)}
                              className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggleScope(scope.id)}
                                className="mt-0.5"
                              />
                              <div className="flex flex-col">
                                <code className="text-xs font-mono font-medium text-foreground">{scope.id}</code>
                                <span className="text-[0.6875rem] text-muted-foreground">{scope.description}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Badges preview */}
                  {selectedScopes.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedScopes.map((sc) => (
                        <span
                          key={sc}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/40 border border-border/60 text-[0.6875rem] font-mono text-muted-foreground"
                        >
                          {sc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expires at */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Expires at</label>
                  <Select value={expiryOption} onValueChange={(v) => v && setExpiryOption(v)}>
                    <SelectTrigger className="w-full h-9 text-xs bg-muted/10 border-border/80 rounded-lg">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never expires</SelectItem>
                      <SelectItem value="30d">In 30 days</SelectItem>
                      <SelectItem value="60d">In 60 days</SelectItem>
                      <SelectItem value="90d">In 90 days</SelectItem>
                      <SelectItem value="1y">In 1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>

              <SheetFooter className="p-5 border-t border-border/60 flex flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  className="h-9 text-xs font-medium rounded-lg border-border/70 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKey}
                  disabled={!keyName.trim() || saving || selectedScopes.length === 0}
                  className="h-9 text-xs font-medium rounded-lg bg-[#7ca982] hover:bg-[#6b9771] text-white cursor-pointer px-6"
                >
                  {saving ? "Creating..." : "Create"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Key Created Modal */}
          <Sheet open={!!createdRawKey} onOpenChange={(o) => { if (!o) { setCreatedRawKey(null); setKeyCopied(false) } }}>
            <SheetContent side="right" className="w-full max-w-md p-0 bg-card border-l border-border/60 flex flex-col">
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="text-base font-semibold text-foreground">API key generated</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Please copy this key now. For your security, it will never be displayed again.
                </SheetDescription>
              </SheetHeader>
              <div className="p-5 space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-foreground">Your secret API key</span>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 border border-border/60 p-3">
                    <code className="text-xs font-mono text-foreground break-all">{createdRawKey}</code>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (createdRawKey) {
                          copyText(createdRawKey, "API Key")
                          setKeyCopied(true)
                          setTimeout(() => setKeyCopied(false), 2000)
                        }
                      }}
                      className="h-7 px-2.5 text-xs gap-1 cursor-pointer shrink-0"
                    >
                      <HugeiconsIcon icon={keyCopied ? Tick02Icon : Copy01Icon} strokeWidth={2} className="size-3" />
                      <span>{keyCopied ? "Copied!" : "Copy"}</span>
                    </Button>
                  </div>
                </div>
              </div>
              <SheetFooter className="p-5 border-t border-border/60 flex flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (createdRawKey) {
                      copyText(createdRawKey, "API Key")
                      setKeyCopied(true)
                      setTimeout(() => setKeyCopied(false), 2000)
                    }
                  }}
                  className="h-9 text-xs font-medium rounded-lg border-border/70 cursor-pointer"
                >
                  <HugeiconsIcon icon={keyCopied ? Tick02Icon : Copy01Icon} strokeWidth={2} className="size-3.5" />
                  {keyCopied ? "Copied!" : "Copy key"}
                </Button>
                <Button
                  onClick={() => setCreatedRawKey(null)}
                  className="h-9 text-xs font-medium rounded-lg bg-primary text-primary-foreground cursor-pointer px-6"
                >
                  Done
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* TAB: API Versions */}
      {activeTab === "API Versions" && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">API Versions</h3>
            <p className="text-xs text-muted-foreground">
              Track API version lifecycle and endpoints. Use the base URL below with your API key.{" "}
              <a href="https://docs.xpay.com/api-versions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Learn more
              </a>
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4 font-medium">Version</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Endpoint</th>
                    <th className="py-3 px-4 font-medium">Released</th>
                    <th className="py-3 px-4 font-medium">Deprecation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {apiVersions.map((v) => {
                    const statusColor = v.status === "stable"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : v.status === "beta"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    return (
                      <tr key={v.version} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <code className="font-mono font-semibold text-foreground">{v.version}</code>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className={"text-[0.625rem] font-semibold capitalize " + statusColor}>
                            {v.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-muted-foreground text-[0.6875rem]">{API_BASE_URL}{v.endpoint}</code>
                            <button
                              onClick={() => copyText(`${API_BASE_URL}${v.endpoint}`, "Endpoint URL")}
                              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">{v.released}</td>
                        <td className="py-3.5 px-4 text-muted-foreground">{v.deprecation || "-"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Card className="rounded-xl border border-border/60 shadow-none">
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Base API URL</h3>
                <p className="text-xs text-muted-foreground">Send JSON HTTP requests with your Bearer token in the Authorization header.</p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 border border-border/60 p-3 font-mono text-xs">
                <span>{API_BASE_URL}</span>
                <Button variant="ghost" size="sm" onClick={() => copyText(API_BASE_URL, "Base URL")} className="h-7 text-xs gap-1 cursor-pointer">
                  <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                  <span>Copy</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

{/* TAB: Webhooks */}
      {activeTab === "Webhooks" && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">Webhooks</h3>
            <p className="text-xs text-muted-foreground">
              Receive real-time notifications for payment and payout events.{" "}
              <a href="https://docs.xpay.com/webhooks" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Learn more
              </a>
            </p>
          </div>

          {/* Webhooks Table */}
          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-xl border border-border/60 bg-card">
              <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : webhooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 rounded-xl border border-dashed border-border/60 bg-card text-center p-6">
              <p className="text-xs text-muted-foreground">No webhooks configured yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Filter & Reload */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Select value={webhookStatusFilter} onValueChange={(v) => v && setWebhookStatusFilter(v)}>
                    <SelectTrigger className="w-36 h-8 text-xs bg-card border-border/80 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">
                    {webhooks.filter((w) => webhookStatusFilter === "all" || (webhookStatusFilter === "active" ? w.isActive : !w.isActive)).length} webhook{webhooks.filter((w) => webhookStatusFilter === "all" || (webhookStatusFilter === "active" ? w.isActive : !w.isActive)).length !== 1 ? "s" : ""}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setLoading(true)
                    try {
                      const webhooksRes = await api.get<any[]>("/webhooks")
                      setWebhooks(webhooksRes)
                    } catch {
                      toast.add({ type: "error", title: "Error", description: "Could not reload webhooks." })
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className="h-8 px-3 text-xs font-medium border-border/70 rounded-lg cursor-pointer gap-1.5"
                >
                  <HugeiconsIcon icon={ArrowTurnForwardIcon} strokeWidth={2} className="size-3.5" />
                  <span>Reload</span>
                </Button>
              </div>

              <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                        <th className="py-3 px-4 font-medium">Event</th>
                        <th className="py-3 px-4 font-medium">URL</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Attempts</th>
                        <th className="py-3 px-4 font-medium">Created</th>
                        <th className="py-3 px-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {webhooks
                        .filter((w) => webhookStatusFilter === "all" || (webhookStatusFilter === "active" ? w.isActive : !w.isActive))
                        .map((w) => (
                        <tr
                          key={w.id}
                          onClick={() => setSelectedWebhook(w)}
                          className="hover:bg-muted/20 transition-colors cursor-pointer"
                        >
                          <td className="py-3 px-4">
                            <code className="text-xs font-mono text-primary">{w.event}</code>
                          </td>
                          <td className="py-3 px-4 font-mono text-foreground max-w-[220px] truncate" title={w.url}>
                            {w.url}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={`text-[0.625rem] font-semibold ${w.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/40"}`}
                            >
                              {w.isActive ? "success" : "inactive"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            0 / 5
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(w.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); deleteWebhook(w.id) }}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500 cursor-pointer"
                            >
                              <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Webhook Delivery Details Drawer */}
          <Sheet open={!!selectedWebhook} onOpenChange={(o) => { if (!o) setSelectedWebhook(null) }}>
            <SheetContent side="right" className="w-full max-w-lg p-0 bg-card border-l border-border/60 flex flex-col">
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="text-base font-semibold text-foreground">Webhook delivery details</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Detailed information about this webhook delivery.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selectedWebhook && (
                  <>
                    {/* Details grid */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">Event</span>
                        <code className="text-xs font-mono text-primary">{selectedWebhook.event}</code>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">Status</span>
                        <Badge
                          variant="outline"
                          className={`text-[0.625rem] font-semibold ${selectedWebhook.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/40"}`}
                        >
                          {selectedWebhook.isActive ? "success" : "inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">URL</span>
                        <code className="text-xs font-mono text-foreground max-w-[300px] truncate" title={selectedWebhook.url}>
                          {selectedWebhook.url}
                        </code>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">Attempts</span>
                        <span className="text-xs font-mono text-foreground">0 / 5</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">Status code</span>
                        <Badge variant="outline" className="text-[0.625rem] font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          200
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border/40">
                        <span className="text-xs font-medium text-muted-foreground">Created</span>
                        <span className="text-xs text-foreground">
                          {new Date(selectedWebhook.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* Response */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">Response</span>
                      <pre className="text-[0.6875rem] font-mono text-foreground bg-muted/30 border border-border/60 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
{JSON.stringify({ status: "success", message: "Webhook processed successfully." }, null, 2)}
                      </pre>
                    </div>

                    {/* Payload */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">Payload</span>
                      <pre className="text-[0.6875rem] font-mono text-foreground bg-muted/30 border border-border/60 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
{JSON.stringify({
  id: "evt_" + selectedWebhook.id.slice(-20),
  type: selectedWebhook.event,
  api_version: "2026-01-25",
  created_at: new Date(selectedWebhook.createdAt).toISOString(),
  data: {
    reference: "SN" + Math.random().toString().slice(2, 18),
    external_reference: "ML" + Math.random().toString().slice(2, 8),
    status: selectedWebhook.event.replace("payment.", ""),
    amount: {
      value: Math.floor(Math.random() * 50000) + 1000,
      currency: "TZS",
    },
  },
}, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </div>
              <SheetFooter className="p-5 border-t border-border/60 flex flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (selectedWebhook) {
                      const payload = JSON.stringify({
                        id: "evt_" + selectedWebhook.id.slice(-20),
                        type: selectedWebhook.event,
                        api_version: "2026-01-25",
                        created_at: new Date(selectedWebhook.createdAt).toISOString(),
                        data: {
                          reference: "SN" + Math.random().toString().slice(2, 18),
                          status: selectedWebhook.event.replace("payment.", ""),
                        },
                      }, null, 2)
                      copyText(payload, "Payload")
                    }
                  }}
                  className="h-9 text-xs font-medium rounded-lg border-border/70 cursor-pointer gap-1.5"
                >
                  <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
                  Copy payload
                </Button>
                <Button
                  onClick={() => setSelectedWebhook(null)}
                  className="h-9 text-xs font-medium rounded-lg bg-primary text-primary-foreground cursor-pointer px-6"
                >
                  Close
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* TAB: Settings */}
      {activeTab === "Settings" && (
        <div className="space-y-4">
          <Card className="rounded-xl border border-border/60 shadow-none">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">API Configuration</h3>
                <p className="text-xs text-muted-foreground">General settings for your API access.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div>
                    <span className="text-xs font-medium text-foreground">Request Timeout</span>
                    <p className="text-[0.625rem] text-muted-foreground">Maximum time for API requests (seconds)</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">30s</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div>
                    <span className="text-xs font-medium text-foreground">Rate Limit</span>
                    <p className="text-[0.625rem] text-muted-foreground">Maximum requests per minute</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">100/min</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div>
                    <span className="text-xs font-medium text-foreground">IP Whitelisting</span>
                    <p className="text-[0.625rem] text-muted-foreground">Restrict API access to specific IPs</p>
                  </div>
                  <Badge variant="outline" className="text-[0.625rem] font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    Free — All IPs allowed
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-xs font-medium text-foreground">Test Mode</span>
                    <p className="text-[0.625rem] text-muted-foreground">Use sandbox environment for testing</p>
                  </div>
                  <Badge variant="outline" className="text-[0.625rem] font-semibold bg-muted text-muted-foreground border-border/40">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Secret */}
          <Card className="rounded-xl border border-border/60 shadow-none">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Webhook Secret</h3>
                <p className="text-xs text-muted-foreground">
                  Manage your integration credentials and webhook configuration.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Signing Secret</label>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 border border-border/60 p-3">
                    <code className="text-xs font-mono text-foreground break-all">
                      {webhookSecret.slice(0, 24)}...
                    </code>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          copyText(webhookSecret, "Signing Secret")
                          setWebhookSecretCopied(true)
                          setTimeout(() => setWebhookSecretCopied(false), 2000)
                        }}
                        className="h-7 px-2.5 text-xs gap-1 cursor-pointer"
                      >
                        <HugeiconsIcon icon={webhookSecretCopied ? Tick02Icon : Copy01Icon} strokeWidth={2} className="size-3" />
                        <span>{webhookSecretCopied ? "Copied!" : "Copy"}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRenewSecretOpen(true)}
                        className="h-7 px-2.5 text-xs gap-1 cursor-pointer border-border/70"
                      >
                        <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} className="size-3" />
                        <span>Renew</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-[0.625rem] text-muted-foreground">
                    Use this secret to verify webhook signatures. Keep it safe and never expose it in client-side code.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border/60 shadow-none">
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
                <p className="text-xs text-muted-foreground">Irreversible actions for your developer account.</p>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border/40">
                <div>
                  <span className="text-xs font-medium text-rose-600">Revoke All API Keys</span>
                  <p className="text-[0.625rem] text-muted-foreground">Immediately disable all active keys</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRevokeAllOpen(true)}
                  className="h-7 text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                >
                  Revoke All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Key Confirmation */}
      <AlertDialog
        open={!!keyToDelete}
        onOpenChange={(open) => { if (!open) setKeyToDelete(null) }}
      >
        <AlertDialogContent className="max-w-md rounded-2xl bg-card border shadow-2xl p-6">
          <AlertDialogHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
              <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-5" />
            </div>
            <AlertDialogTitle className="text-base font-semibold text-left">
              Revoke {keyToDelete?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground text-left">
              This API key will be permanently revoked and cannot be undone. Any services using this key will stop working immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 pt-4">
            <AlertDialogCancel className="flex-1 h-9 text-xs font-medium cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (keyToDelete) {
                  deleteKey(keyToDelete.id)
                  setKeyToDelete(null)
                }
              }}
              className="flex-1 h-9 bg-rose-600 text-white hover:bg-rose-700 text-xs font-medium cursor-pointer"
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke All Confirmation */}
      <AlertDialog
        open={revokeAllOpen}
        onOpenChange={setRevokeAllOpen}
      >
        <AlertDialogContent className="max-w-md rounded-2xl bg-card border shadow-2xl p-6">
          <AlertDialogHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
              <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} className="size-5" />
            </div>
            <AlertDialogTitle className="text-base font-semibold text-left">
              Revoke all API keys?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground text-left">
              This will immediately revoke all {keys.length} active API key{keys.length !== 1 ? "s" : ""}. All integrations and services using these keys will stop working. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 pt-4">
            <AlertDialogCancel className="flex-1 h-9 text-xs font-medium cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleRevokeAll()
                setRevokeAllOpen(false)
              }}
              className="flex-1 h-9 bg-rose-600 text-white hover:bg-rose-700 text-xs font-medium cursor-pointer"
            >
              Revoke All Keys
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Renew Secret Confirmation */}
      <AlertDialog
        open={renewSecretOpen}
        onOpenChange={setRenewSecretOpen}
      >
        <AlertDialogContent className="max-w-md rounded-2xl bg-card border shadow-2xl p-6">
          <AlertDialogHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
              <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-5" />
            </div>
            <AlertDialogTitle className="text-base font-semibold text-left">
              Renew webhook signing secret?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground text-left">
              This will generate a new signing secret and invalidate the current one. All webhook endpoints using the old secret will fail to verify signatures until updated with the new secret.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 pt-4">
            <AlertDialogCancel className="flex-1 h-9 text-xs font-medium cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const newSecret = "whsec_" + Array.from({ length: 32 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")
                setWebhookSecret(newSecret)
                setWebhookSecretCopied(false)
                setRenewSecretOpen(false)
                toast.add({ type: "success", title: "Secret Renewed", description: "Your webhook signing secret has been renewed. Update your endpoints." })
              }}
              className="flex-1 h-9 bg-amber-600 text-white hover:bg-amber-700 text-xs font-medium cursor-pointer"
            >
              Renew Secret
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
