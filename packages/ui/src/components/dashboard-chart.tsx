"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import { api } from "@workspace/ui/lib/api"

type ChartDataPoint = {
  date: string
  amount: number
}

const chartConfig = {
  amount: {
    label: "Payment Volume",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function formatCurrencyShort(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

export function DashboardChart() {
  const [data, setData] = React.useState<ChartDataPoint[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    async function fetchAnalytics() {
      try {
        const res = await api.get<{ dailyBreakdown: ChartDataPoint[] }>("/analytics")
        if (!cancelled && res.success && res.data?.dailyBreakdown) {
          setData(res.data.dailyBreakdown)
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

  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0)
  const avgPerDay = data.length > 0 ? Math.round(totalAmount / data.length) : 0

  return (
    <div className="px-4 pb-20 pt-2 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Payment Trends</CardTitle>
          <CardDescription>
            {loading
              ? "Loading chart data..."
              : data.length === 0
                ? "No transaction data yet"
                : `${data.length} days  ·  Avg TSh ${formatCurrencyShort(avgPerDay)} / day`}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {loading ? (
            <div className="flex h-[280px] items-center justify-center">
              <div className="h-full w-full animate-pulse rounded-lg bg-muted/40" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm font-medium text-muted-foreground">No payment data to display</p>
              <p className="text-xs text-muted-foreground">Chart will appear here once payments start coming in.</p>
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-amount)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-amount)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
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
                  width={56}
                  tickFormatter={(value) => formatCurrencyShort(Number(value))}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      formatter={(value) => [
                        `TSh ${Number(value).toLocaleString()}`,
                        "Payment Volume",
                      ]}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="amount"
                  type="natural"
                  fill="url(#fillAmount)"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
