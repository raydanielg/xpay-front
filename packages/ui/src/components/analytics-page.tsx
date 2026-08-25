"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ReceiptIcon,
  SentIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  PieChartIcon,
  Calendar03Icon,
  TrendingUpIcon,
  Message01Icon,
  ShieldUserIcon,
} from "@hugeicons/core-free-icons"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"

interface AnalyticsData {
  payments: {
    total: number
    completed: number
    pending: number
    failed: number
    totalAmount: number
  }
  payouts: {
    total: number
    completed: number
    totalAmount: number
  }
  links: {
    activePaymentLinks: number
    activePaymentPages: number
  }
  recentPayments: Array<{
    id: string
    amount: number
    currency: string
    status: string
    method: string
    customerEmail: string | null
    customerName: string | null
    createdAt: string
  }>
  dailyBreakdown: Array<{ date: string; amount: number }>
}

const timeRanges = ["Today", "7D", "30D", "90D", "All", "Custom"] as const

const txChartConfig = {
  transactions: {
    label: "Transactions",
  },
  completed: {
    label: "Completed",
    color: "var(--primary)",
  },
  failed: {
    label: "Failed",
    color: "var(--destructive)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const volumeChartConfig = {
  volume: {
    label: "Volume",
  },
  payments: {
    label: "Payments",
    color: "var(--primary)",
  },
  payouts: {
    label: "Payouts",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const successRadialData = [
  { name: "success", rate: 0, fill: "var(--color-success)" },
]

const successRadialConfig = {
  rate: {
    label: "Success Rate",
  },
  success: {
    label: "Successful",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const settlementRadialData = [
  { name: "settled", rate: 0, fill: "var(--color-settled)" },
]

const settlementRadialConfig = {
  rate: {
    label: "Settlement Rate",
  },
  settled: {
    label: "Settled",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const mobileShareData = [
  { name: "mobile", rate: 0, fill: "var(--color-mobile)" },
]

const mobileShareConfig = {
  rate: {
    label: "Mobile Share",
  },
  mobile: {
    label: "Mobile Money",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = React.useState<string>("All")
  const [txTimeRange, setTxTimeRange] = React.useState("90d")
  const [volTimeRange, setVolTimeRange] = React.useState("90d")
  const [loading, setLoading] = React.useState(true)
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null)

  React.useEffect(() => {
    let cancelled = false
    async function fetchAnalytics() {
      setLoading(true)
      try {
        const res = await api.get<AnalyticsData>("/analytics")
        if (!cancelled && res.success && res.data) {
          setAnalytics(res.data)
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAnalytics()
    return () => { cancelled = true }
  }, [])

  const successRate = analytics
    ? analytics.payments.total > 0
      ? ((analytics.payments.completed / analytics.payments.total) * 100).toFixed(1)
      : "0"
    : "0"

  const settlementRate = analytics
    ? analytics.payouts.total > 0
      ? (analytics.payouts.completed / analytics.payouts.total) * 100
      : 0
    : 0

  const mobileShare = React.useMemo(() => {
    if (!analytics?.recentPayments || analytics.recentPayments.length === 0) return 0
    const mobileCount = analytics.recentPayments.filter((p) => p.method?.toLowerCase() === "mobile").length
    return (mobileCount / analytics.recentPayments.length) * 100
  }, [analytics])

  const overviewStats = [
    {
      label: "Payments",
      value: `TSh ${(analytics?.payments.totalAmount || 0).toLocaleString()}`,
      sub: `${analytics?.payments.total || 0} transactions`,
      icon: ReceiptIcon,
    },
    {
      label: "Payouts",
      value: `TSh ${(analytics?.payouts.totalAmount || 0).toLocaleString()}`,
      sub: `${analytics?.payouts.total || 0} transactions`,
      icon: SentIcon,
    },
    {
      label: "Successful",
      value: `${analytics?.payments.completed || 0}`,
      sub: `TSh ${(analytics?.payments.totalAmount || 0).toLocaleString()}`,
      icon: CheckmarkCircle01Icon,
    },
    {
      label: "Pending",
      value: `${analytics?.payments.pending || 0}`,
      sub: `TSh 0`,
      icon: Clock01Icon,
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      sub: `${analytics?.payments.failed || 0} failed`,
      icon: PieChartIcon,
    },
  ]

  // Build transaction chart data from dailyBreakdown
  const transactionsData = React.useMemo(() => {
    if (!analytics?.dailyBreakdown) return []
    return analytics.dailyBreakdown.map((d) => ({
      date: d.date,
      completed: 1,
      failed: 0,
      pending: 0,
      amount: d.amount,
    }))
  }, [analytics])

  // Build volume chart data from dailyBreakdown
  const volumeData = React.useMemo(() => {
    if (!analytics?.dailyBreakdown) return []
    return analytics.dailyBreakdown.map((d) => ({
      date: d.date,
      payments: d.amount,
      payouts: 0,
    }))
  }, [analytics])

  const filteredTxData = React.useMemo(() => {
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (txTimeRange === "30d") daysToSubtract = 30
    if (txTimeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return transactionsData.filter((item) => new Date(item.date) >= startDate)
  }, [txTimeRange, transactionsData])

  const filteredVolData = React.useMemo(() => {
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (volTimeRange === "30d") daysToSubtract = 30
    if (volTimeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return volumeData.filter((item) => new Date(item.date) >= startDate)
  }, [volTimeRange, volumeData])

  return (
    <div className="relative space-y-6 px-4 py-6 lg:px-6">
      {/* Overview Section Header & Range Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="text-xs text-muted-foreground">Monitor your financial performance in real time</p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-muted/30 p-1">
          {timeRanges.map((range) => {
            const isCustom = range === "Custom"
            const isSelected = selectedRange === range

            return (
              <button
                key={range}
                type="button"
                onClick={() => {
                  setSelectedRange(range)
                  if (isCustom) {
                    toast.add({
                      type: "info",
                      title: "Date Range",
                      description: "Custom date range calendar opened.",
                    })
                  }
                }}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {isCustom && (
                  <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
                )}
                <span>{range}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-16 animate-pulse rounded bg-muted" />
                  <div className="size-4 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="mt-3 h-6 w-28 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))
          : overviewStats.map((stat) => (
              <div
                key={stat.label}
                className="group relative rounded-xl bg-muted/30 p-4 transition-all hover:bg-muted/50"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stat.label}</span>
                  <HugeiconsIcon
                    icon={stat.icon}
                    strokeWidth={2}
                    className="size-4 opacity-70 transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.sub}</div>
              </div>
            ))}
      </div>

      {/* Interactive Charts Section */}
      <div className="pt-2">
        <h2 className="text-base font-semibold text-foreground">Analytics</h2>
        <p className="text-xs text-muted-foreground">Interactive trends and metrics breakdown</p>
      </div>

      {/* 2 Interactive Area Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Chart 1: Interactive Transactions Area Chart */}
        <Card className="@container/card rounded-xl border-0 bg-muted/30 p-0 shadow-none ring-0">
          <CardHeader className="flex flex-col gap-2 border-b border-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="grid gap-1">
              <CardTitle className="text-sm font-semibold">Transactions Breakdown</CardTitle>
              <CardDescription className="text-xs">
                Completed, failed, and pending transactions
              </CardDescription>
            </div>
            <CardAction>
              <ToggleGroup
                multiple={false}
                value={txTimeRange ? [txTimeRange] : []}
                onValueChange={(value) => {
                  setTxTimeRange(value[0] ?? "90d")
                }}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:px-3! *:data-[slot=toggle-group-item]:text-xs @[540px]/card:flex"
              >
                <ToggleGroupItem value="90d">90 days</ToggleGroupItem>
                <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
                <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
              </ToggleGroup>
              <Select
                value={txTimeRange}
                onValueChange={(value) => {
                  if (value !== null) setTxTimeRange(value)
                }}
              >
                <SelectTrigger
                  className="flex w-32 text-xs @[540px]/card:hidden"
                  size="sm"
                  aria-label="Select range"
                >
                  <SelectValue placeholder="Last 90 days" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 90 days
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {loading ? (
              <div className="h-[250px] w-full animate-pulse rounded-lg bg-muted/40" />
            ) : (
              <ChartContainer config={txChartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart data={filteredTxData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-completed)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-completed)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-failed)" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="var(--color-failed)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="failed"
                    type="natural"
                    fill="url(#fillFailed)"
                    stroke="var(--color-failed)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="pending"
                    type="natural"
                    fill="url(#fillPending)"
                    stroke="var(--color-pending)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="completed"
                    type="natural"
                    fill="url(#fillCompleted)"
                    stroke="var(--color-completed)"
                    strokeWidth={2}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Interactive Payments & Payouts Volume Area Chart */}
        <Card className="@container/card rounded-xl border-0 bg-muted/30 p-0 shadow-none ring-0">
          <CardHeader className="flex flex-col gap-2 border-b border-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="grid gap-1">
              <CardTitle className="text-sm font-semibold">Cashflow Volume</CardTitle>
              <CardDescription className="text-xs">
                Inflows (Payments) vs Outflows (Payouts) in TSh
              </CardDescription>
            </div>
            <CardAction>
              <ToggleGroup
                multiple={false}
                value={volTimeRange ? [volTimeRange] : []}
                onValueChange={(value) => {
                  setVolTimeRange(value[0] ?? "90d")
                }}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:px-3! *:data-[slot=toggle-group-item]:text-xs @[540px]/card:flex"
              >
                <ToggleGroupItem value="90d">90 days</ToggleGroupItem>
                <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
                <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
              </ToggleGroup>
              <Select
                value={volTimeRange}
                onValueChange={(value) => {
                  if (value !== null) setVolTimeRange(value)
                }}
              >
                <SelectTrigger
                  className="flex w-32 text-xs @[540px]/card:hidden"
                  size="sm"
                  aria-label="Select range"
                >
                  <SelectValue placeholder="Last 90 days" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 90 days
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {loading ? (
              <div className="h-[250px] w-full animate-pulse rounded-lg bg-muted/40" />
            ) : (
              <ChartContainer config={volumeChartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart data={filteredVolData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillPayments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-payments)" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="var(--color-payments)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="fillPayouts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-payouts)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-payouts)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(val) => (val === 0 ? "0" : `${val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val / 1000}K`}`)}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className="text-muted-foreground">{name === "payments" ? "Payments:" : "Payouts:"}</span>
                            <span className="font-semibold text-foreground">TSh {Number(value).toLocaleString()}</span>
                          </div>
                        )}
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="payouts"
                    type="natural"
                    fill="url(#fillPayouts)"
                    stroke="var(--color-payouts)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="payments"
                    type="natural"
                    fill="url(#fillPayments)"
                    stroke="var(--color-payments)"
                    strokeWidth={2}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Circle Radial Charts Section */}
      <div className="pt-2">
        <h2 className="text-base font-semibold text-foreground">Performance & Health</h2>
        <p className="text-xs text-muted-foreground">Conversion efficiency and processing rates</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Radial Chart 1: Success Rate */}
        <Card className="flex flex-col rounded-xl border-0 bg-muted/30 p-0 shadow-none ring-0">
          <CardHeader className="items-center border-b border-muted/50 p-4 pb-2 text-center">
            <CardTitle className="text-sm font-semibold">Payment Success Rate</CardTitle>
            <CardDescription className="text-xs">Completed vs attempted</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4 pb-0">
            {loading ? (
              <div className="mx-auto aspect-square max-h-[220px] w-full animate-pulse rounded-full bg-muted/40" />
            ) : (
              <ChartContainer
                config={successRadialConfig}
                className="mx-auto aspect-square max-h-[220px]"
              >
                <RadialBarChart
                  data={[{ name: "success", rate: Number(successRate), fill: "var(--color-success)" }]}
                  startAngle={90}
                  endAngle={90 + (360 * Number(successRate)) / 100}
                  innerRadius={65}
                  outerRadius={95}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted/40 last:fill-background"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar dataKey="rate" background cornerRadius={10} />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {successRate}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-xs"
                              >
                                Success Rate
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-1.5 p-4 pt-2 text-center text-xs">
            <div className="flex items-center justify-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span>Trending up by +3.4%</span>
              <HugeiconsIcon icon={TrendingUpIcon} strokeWidth={2} className="size-3.5" />
            </div>
            <div className="text-muted-foreground">Highest conversion this quarter</div>
          </CardFooter>
        </Card>

        {/* Radial Chart 2: Settlement Rate */}
        <Card className="flex flex-col rounded-xl border-0 bg-muted/30 p-0 shadow-none ring-0">
          <CardHeader className="items-center border-b border-muted/50 p-4 pb-2 text-center">
            <CardTitle className="text-sm font-semibold">Payout Settlement Rate</CardTitle>
            <CardDescription className="text-xs">Fulfillment to bank & mobile</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4 pb-0">
            {loading ? (
              <div className="mx-auto aspect-square max-h-[220px] w-full animate-pulse rounded-full bg-muted/40" />
            ) : (
              <ChartContainer
                config={settlementRadialConfig}
                className="mx-auto aspect-square max-h-[220px]"
              >
                <RadialBarChart
                  data={[{ name: "settled", rate: settlementRate, fill: "var(--color-settled)" }]}
                  startAngle={90}
                  endAngle={90 + (360 * settlementRate) / 100}
                  innerRadius={65}
                  outerRadius={95}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted/40 last:fill-background"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar dataKey="rate" background cornerRadius={10} />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {settlementRate.toFixed(1)}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-xs"
                              >
                                On Time
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-1.5 p-4 pt-2 text-center text-xs">
            <div className="flex items-center justify-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span>Average speed: &lt; 2 minutes</span>
              <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5" />
            </div>
            <div className="text-muted-foreground">Instant automated disbursements</div>
          </CardFooter>
        </Card>

        {/* Radial Chart 3: Mobile Money Dominance */}
        <Card className="flex flex-col rounded-xl border-0 bg-muted/30 p-0 shadow-none ring-0">
          <CardHeader className="items-center border-b border-muted/50 p-4 pb-2 text-center">
            <CardTitle className="text-sm font-semibold">Mobile Money Share</CardTitle>
            <CardDescription className="text-xs">M-Pesa, Airtel & Tigo vs Cards</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4 pb-0">
            {loading ? (
              <div className="mx-auto aspect-square max-h-[220px] w-full animate-pulse rounded-full bg-muted/40" />
            ) : (
              <ChartContainer
                config={mobileShareConfig}
                className="mx-auto aspect-square max-h-[220px]"
              >
                <RadialBarChart
                  data={[{ name: "mobile", rate: mobileShare, fill: "var(--color-mobile)" }]}
                  startAngle={90}
                  endAngle={90 + (360 * mobileShare) / 100}
                  innerRadius={65}
                  outerRadius={95}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted/40 last:fill-background"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar dataKey="rate" background cornerRadius={10} />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {mobileShare.toFixed(1)}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-xs"
                              >
                                Mobile Channels
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-1.5 p-4 pt-2 text-center text-xs">
            <div className="flex items-center justify-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span>Preferred local channel</span>
              <HugeiconsIcon icon={ShieldUserIcon} strokeWidth={2} className="size-3.5" />
            </div>
            <div className="text-muted-foreground">Tigo Pesa, M-Pesa, Airtel Money</div>
          </CardFooter>
        </Card>
      </div>

      {/* Floating Help Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() =>
            toast.add({
              type: "info",
              title: "Customer Support",
              description: "Live chat assistant is ready. How can we help you today?",
            })
          }
          className="group flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-white shadow-lg transition-all hover:bg-emerald-700 hover:scale-105 active:scale-95 cursor-pointer dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-white/20">
            <HugeiconsIcon icon={Message01Icon} strokeWidth={2} className="size-3.5" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-semibold">Need Help?</div>
            <div className="text-[0.625rem] text-emerald-100">Ask me</div>
          </div>
        </button>
      </div>
    </div>
  )
}
