"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PuzzleIcon,
  CheckmarkCircle01Icon,
  PlusSignIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/toast"

interface AppIntegration {
  id: string
  name: string
  description: string
  category: string
  iconText: string
  connected: boolean
}

const DEFAULT_APPS: AppIntegration[] = [
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Accept payments directly on your WordPress WooCommerce store.",
    category: "E-Commerce",
    iconText: "WC",
    connected: true,
  },
  {
    id: "shopify",
    name: "Shopify Store",
    description: "Sync automated checkout orders with your Shopify online catalog.",
    category: "E-Commerce",
    iconText: "SP",
    connected: false,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate payouts, payment alerts, and customer notifications.",
    category: "Automation",
    iconText: "ZP",
    connected: false,
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Automatically reconcile customer payments and settlement invoices.",
    category: "Accounting",
    iconText: "QB",
    connected: false,
  },
]

export function ConnectedAppsPage() {
  const [apps, setApps] = React.useState<AppIntegration[]>(DEFAULT_APPS)

  function toggleConnect(id: string, name: string, current: boolean) {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, connected: !current } : a))
    )
    toast.add({
      type: current ? "info" : "success",
      title: current ? "App Disconnected" : "App Connected",
      description: `${name} has been ${current ? "disconnected from" : "linked to"} your XPay account.`,
    })
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-3xl w-full">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-foreground">Connected Apps</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Manage third-party plugins, platforms, and accounting integrations connected to your account.
        </p>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {apps.map((app) => (
          <Card key={app.id} className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-4 flex flex-col justify-between h-full gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    {app.iconText}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{app.name}</h3>
                    <span className="text-[11px] text-muted-foreground">{app.category}</span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium ${
                    app.connected
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-muted/40 text-muted-foreground border-border/60"
                  }`}
                >
                  {app.connected ? "Connected" : "Available"}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {app.description}
              </p>

              <div className="pt-2 border-t border-border/50 flex justify-end">
                <Button
                  variant={app.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleConnect(app.id, app.name, app.connected)}
                  className="h-8 text-xs cursor-pointer"
                >
                  {app.connected ? "Disconnect" : "Connect App"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
