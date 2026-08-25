"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ChartHistogramIcon,
  Loading03Icon,
  Dollar01Icon,
  UserGroupIcon,
  ServerIcon,
  CreditCardIcon,
  MoneyBag01Icon,
  CustomerSupportIcon,
  SentIcon,
} from "@hugeicons/core-free-icons"

import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { api } from "@workspace/ui/lib/api"

type OverviewData = {
  users: { total: number }
  payments: {
    total: number
    successful: number
    revenue: number
    last30Days: { count: number; revenue: number }
  }
  payouts: {
    total: number
    pending: number
    pendingAmount: number
  }
  support: { totalTickets: number }
  feedback: { total: number }
}

type FinancialData = {
  summary: {
    totalRevenue: number
    totalPayouts: number
    netRevenue: number
    totalPayments: number
    totalPayoutsCount: number
  }
  paymentsByStatus: Record<string, number>
  payoutsByStatus: Record<string, number>
}

type UsersData = {
  summary: {
    total: number
    verified: number
    unverified: number
    byRole: Record<string, number>
  }
  users: Array<{
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    isVerified: boolean
    createdAt: string
    _count: { payments: number; payouts: number; supportTickets: number; feedbacks: number }
  }>
}

type SystemData = {
  sms: { totalLogs: number }
  webhooks: { total: number }
  apiKeys: { total: number }
  support: { totalTickets: number; byStatus: Record<string, number> }
  feedback: { total: number; averageRating: number; byRating: Record<number, number> }
}

type Tab = "overview" | "financial" | "users" | "system"

const tabs: { id: Tab; label: string; icon: typeof ChartHistogramIcon }[] = [
  { id: "overview", label: "Overview", icon: ChartHistogramIcon },
  { id: "financial", label: "Financial", icon: Dollar01Icon },
  { id: "users", label: "Users", icon: UserGroupIcon },
  { id: "system", label: "System", icon: ServerIcon },
]

function formatCurrency(value: number) {
  return `TSh ${value.toLocaleString()}`
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>("overview")
  const [loading, setLoading] = React.useState(true)
  const [overview, setOverview] = React.useState<OverviewData | null>(null)
  const [financial, setFinancial] = React.useState<FinancialData | null>(null)
  const [users, setUsers] = React.useState<UsersData | null>(null)
  const [system, setSystem] = React.useState<SystemData | null>(null)

  async function fetchReport(tab: Tab) {
    setLoading(true)
    try {
      const res = await api.get<typeof tab extends "overview" ? OverviewData : never>(`/reports/${tab}`)
      if (res.success && res.data) {
        if (tab === "overview") setOverview(res.data as OverviewData)
        if (tab === "financial") setFinancial(res.data as FinancialData)
        if (tab === "users") setUsers(res.data as UsersData)
        if (tab === "system") setSystem(res.data as SystemData)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchReport(activeTab)
  }, [activeTab])

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <HugeiconsIcon icon={ChartHistogramIcon} strokeWidth={2} className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Platform-wide insights and administrative reports.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-t-lg cursor-pointer ${
              activeTab === tab.id
                ? "text-foreground border-b-2 border-primary -mb-px"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HugeiconsIcon icon={tab.icon} strokeWidth={2} className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Overview */}
          {activeTab === "overview" && overview && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.5} className="size-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Users</p>
                      <p className="text-xl font-bold text-foreground">{overview.users.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                      <HugeiconsIcon icon={CreditCardIcon} strokeWidth={1.5} className="size-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Revenue</p>
                      <p className="text-xl font-bold text-foreground">{formatCurrency(overview.payments.revenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                      <HugeiconsIcon icon={MoneyBag01Icon} strokeWidth={1.5} className="size-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pending Payouts</p>
                      <p className="text-xl font-bold text-foreground">{overview.payouts.pending}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(overview.payouts.pendingAmount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={1.5} className="size-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Support Tickets</p>
                      <p className="text-xl font-bold text-foreground">{overview.support.totalTickets}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle className="text-sm">Last 30 Days</CardTitle>
                  <CardDescription>Payment activity in the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Payments</p>
                      <p className="text-lg font-semibold">{overview.payments.last30Days.count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-semibold">{formatCurrency(overview.payments.last30Days.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Successful Rate</p>
                      <p className="text-lg font-semibold">
                        {overview.payments.total > 0
                          ? `${Math.round((overview.payments.successful / overview.payments.total) * 100)}%`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Financial */}
          {activeTab === "financial" && financial && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="py-5">
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-xl font-bold text-emerald-600">{formatCurrency(financial.summary.totalRevenue)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-5">
                    <p className="text-xs text-muted-foreground">Total Payouts</p>
                    <p className="text-xl font-bold text-amber-600">{formatCurrency(financial.summary.totalPayouts)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-5">
                    <p className="text-xs text-muted-foreground">Net Revenue</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(financial.summary.netRevenue)}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-sm">Payments by Status</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {Object.entries(financial.paymentsByStatus).map(([status, count]) => (
                      <Badge key={status} variant="outline" className="text-xs">
                        {status}: {count}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-sm">Payouts by Status</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {Object.entries(financial.payoutsByStatus).map(([status, count]) => (
                      <Badge key={status} variant="outline" className="text-xs">
                        {status}: {count}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && users && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <Card><CardContent className="py-5"><p className="text-xs text-muted-foreground">Total Users</p><p className="text-xl font-bold">{users.summary.total}</p></CardContent></Card>
                <Card><CardContent className="py-5"><p className="text-xs text-muted-foreground">Verified</p><p className="text-xl font-bold text-emerald-600">{users.summary.verified}</p></CardContent></Card>
                <Card><CardContent className="py-5"><p className="text-xs text-muted-foreground">Unverified</p><p className="text-xl font-bold text-amber-600">{users.summary.unverified}</p></CardContent></Card>
                <Card><CardContent className="py-5"><p className="text-xs text-muted-foreground">Roles</p><div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(users.summary.byRole).map(([role, count]) => (
                    <Badge key={role} variant="outline" className="text-xs">{role}: {count}</Badge>
                  ))}
                </div></CardContent></Card>
              </div>

              <Card>
                <CardHeader><CardTitle className="text-sm">User List</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border text-left text-muted-foreground">
                          <th className="pb-2 pr-4 font-medium">Name</th>
                          <th className="pb-2 pr-4 font-medium">Email</th>
                          <th className="pb-2 pr-4 font-medium">Role</th>
                          <th className="pb-2 pr-4 font-medium">Payments</th>
                          <th className="pb-2 pr-4 font-medium">Payouts</th>
                          <th className="pb-2 font-medium">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.users.slice(0, 20).map((u) => (
                          <tr key={u.id} className="border-b border-border/50">
                            <td className="py-2 pr-4 font-medium">{u.firstName} {u.lastName}</td>
                            <td className="py-2 pr-4 text-muted-foreground">{u.email}</td>
                            <td className="py-2 pr-4"><Badge variant="outline" className="text-xs">{u.role}</Badge></td>
                            <td className="py-2 pr-4">{u._count.payments}</td>
                            <td className="py-2 pr-4">{u._count.payouts}</td>
                            <td className="py-2 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* System */}
          {activeTab === "system" && system && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="py-5">
                  <p className="text-xs text-muted-foreground">SMS Logs</p>
                  <p className="text-xl font-bold">{system.sms.totalLogs}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-5">
                  <p className="text-xs text-muted-foreground">Webhooks</p>
                  <p className="text-xl font-bold">{system.webhooks.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-5">
                  <p className="text-xs text-muted-foreground">API Keys</p>
                  <p className="text-xl font-bold">{system.apiKeys.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-5">
                  <p className="text-xs text-muted-foreground">Avg Feedback Rating</p>
                  <p className="text-xl font-bold">{system.feedback.averageRating || "—"} / 5</p>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2">
                <CardHeader><CardTitle className="text-sm">Support Tickets by Status</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {Object.entries(system.support.byStatus).map(([status, count]) => (
                    <Badge key={status} variant="outline" className="text-xs">{status}: {count}</Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="sm:col-span-2">
                <CardHeader><CardTitle className="text-sm">Feedback Ratings Distribution</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {Object.entries(system.feedback.byRating).map(([rating, count]) => (
                    <Badge key={rating} variant="outline" className="text-xs">
                      {rating} star: {count}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
