"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  ChartHistogramIcon,
  CreditCardIcon,
  MoneyBag01Icon,
  Link02Icon,
  InternetIcon,
  Key01Icon,
  WebhookIcon,
  BookOpen01Icon,
  Settings02Icon,
  CustomerSupportIcon,
  SentIcon,
} from "@hugeicons/core-free-icons"

const data = {
  user: {
    name: "Ezra Daniel",
    email: "ezra@xpay.com",
    avatar: "/pay-per-click.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: (
        <HugeiconsIcon icon={ChartHistogramIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: (
        <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Payouts",
      url: "/dashboard/payouts",
      icon: (
        <HugeiconsIcon icon={MoneyBag01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Payment Links",
      url: "/dashboard/payment-links",
      icon: (
        <HugeiconsIcon icon={Link02Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Payment Pages",
      url: "/dashboard/payment-pages",
      icon: (
        <HugeiconsIcon icon={InternetIcon} strokeWidth={2} />
      ),
    },
    {
      title: "API Keys",
      url: "/dashboard/api-keys",
      icon: (
        <HugeiconsIcon icon={Key01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Webhooks",
      url: "/dashboard/webhooks",
      icon: (
        <HugeiconsIcon icon={WebhookIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Documentation",
      url: "/dashboard/docs",
      icon: (
        <HugeiconsIcon icon={BookOpen01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: (
        <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />
      ),
      items: [
        {
          title: "Business",
          url: "/dashboard/settings/business",
        },
        {
          title: "KYC",
          url: "/dashboard/settings/kyc",
        },
        {
          title: "Payment Methods",
          url: "/dashboard/settings/payment-methods",
        },
        {
          title: "Fees",
          url: "/dashboard/settings/fees",
        },
        {
          title: "Security",
          url: "/dashboard/settings/security",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: (
        <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Feedback",
      url: "#",
      icon: (
        <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
      ),
    },
  ],
}
function useCurrentPathname() {
  const [pathname, setPathname] = React.useState<string>("")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname)
    }
  }, [])

  React.useEffect(() => {
    function handlePopState() {
      if (typeof window !== "undefined") {
        setPathname(window.location.pathname)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return pathname
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = useCurrentPathname()

  const itemsWithActive = React.useMemo(
    () =>
      data.navMain.map((item) => {
        const isActive =
          pathname === item.url ||
          (item.url !== "/dashboard" && pathname.startsWith(item.url))
        const subItems = item.items?.map((sub) => ({
          ...sub,
          isActive: pathname === sub.url,
        }))
        const hasActiveSub = subItems?.some((sub) => sub.isActive)
        return {
          ...item,
          isActive: isActive || hasActiveSub,
          items: subItems,
        }
      }),
    [pathname]
  )

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <img src="/pay-per-click.png" alt="XPay" className="size-8 rounded-lg object-cover" />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">XPay</span>
                <span className="truncate text-xs">Payment Platform</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={itemsWithActive} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
