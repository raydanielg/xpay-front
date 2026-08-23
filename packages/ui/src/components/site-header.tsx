"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Sun02Icon,
  Moon02Icon,
  Notification03Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  InformationSquareIcon,
} from "@hugeicons/core-free-icons"

const notifications = [
  {
    id: 1,
    title: "New transaction received",
    description: "Payment of $1,250 from John Doe",
    time: "2 min ago",
    type: "success",
  },
  {
    id: 2,
    title: "Failed transaction",
    description: "Payment of $540 failed - insufficient funds",
    time: "15 min ago",
    type: "error",
  },
  {
    id: 3,
    title: "New customer registered",
    description: "Sarah Wilson just signed up",
    time: "1 hour ago",
    type: "info",
  },
  {
    id: 4,
    title: "Payout processed",
    description: "Payout of $3,200 has been processed",
    time: "3 hours ago",
    type: "success",
  },
]

function NotificationIcon({ type }: { type: string }) {
  if (type === "success")
    return (
      <HugeiconsIcon
        icon={CheckmarkCircle01Icon}
        strokeWidth={2}
        className="size-4 text-green-500"
      />
    )
  if (type === "error")
    return (
      <HugeiconsIcon
        icon={AlertCircleIcon}
        strokeWidth={2}
        className="size-4 text-red-500"
      />
    )
  return (
    <HugeiconsIcon
      icon={InformationSquareIcon}
      strokeWidth={2}
      className="size-4 text-blue-500"
    />
  )
}

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ms-1" />

        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />

        <h1 className="hidden text-base font-medium sm:block">Dashboard</h1>

        {/* Search */}
        <div className="relative ml-auto hidden flex-1 justify-center md:flex md:max-w-[320px] lg:max-w-[400px]">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search transactions, customers, invoices..."
            className="h-9 pl-9 pr-4 text-sm"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
          >
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </Button>

          {/* Dark mode toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle theme"
              className="transition-transform active:scale-90"
            >
              {resolvedTheme === "dark" ? (
                <HugeiconsIcon
                  icon={Sun02Icon}
                  strokeWidth={2}
                  className="size-4 animate-in fade-in zoom-in-50 duration-300"
                />
              ) : (
                <HugeiconsIcon
                  icon={Moon02Icon}
                  strokeWidth={2}
                  className="size-4 animate-in fade-in zoom-in-50 duration-300"
                />
              )}
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                />
              }
            >
              <HugeiconsIcon icon={Notification03Icon} strokeWidth={2} />
              <span className="absolute right-1 top-1 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-red-500" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-0"
              sideOffset={8}
            >
              <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold">Notifications</span>
                <Badge variant="secondary" className="text-xs">
                  {notifications.length} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notif, index) => (
                  <React.Fragment key={notif.id}>
                    <DropdownMenuItem className="flex items-start gap-3 px-4 py-3 focus:bg-muted/50">
                      <div className="mt-0.5 flex-shrink-0">
                        <NotificationIcon type={notif.type} />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-medium leading-none">
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notif.description}
                        </p>
                        <p className="text-[0.6875rem] text-muted-foreground/70">
                          {notif.time}
                        </p>
                      </div>
                    </DropdownMenuItem>
                    {index < notifications.length - 1 && (
                      <DropdownMenuSeparator />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center px-4 py-2.5 text-sm font-medium text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
