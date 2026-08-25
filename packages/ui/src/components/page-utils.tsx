"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Card, CardContent } from "@workspace/ui/components/card"

type IconProp = React.ComponentProps<typeof HugeiconsIcon>["icon"]

export function PageHeader({
  icon,
  title,
  description,
  action,
}: {
  icon?: IconProp
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <HugeiconsIcon icon={icon} strokeWidth={2} className="size-5 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: IconProp
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/50">
          <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-7 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}

export function StatCard({
  icon,
  label,
  value,
  color = "bg-primary/10 text-primary",
}: {
  icon: IconProp
  label: string
  value: string | number
  color?: string
}) {
  return (
    <Card>
      <CardContent className="py-5">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
            <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
