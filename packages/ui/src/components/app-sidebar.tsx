"use client"

import * as React from "react"

import { NavMain, type NavSection } from "@workspace/ui/components/nav-main"
import { NavUser } from "@workspace/ui/components/nav-user"
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
  Store01Icon,
  ShieldUserIcon,
  Wallet01Icon,
  Coins01Icon,
  LockPasswordIcon,
  ArrowLeft01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons"

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

const paymentLinksSections: NavSection[] = [
  {
    label: "Payment Links",
    items: [
      {
        title: "Links",
        url: "/dashboard/payment-links",
        icon: <HugeiconsIcon icon={Link02Icon} strokeWidth={2} />,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Settings",
        url: "/dashboard/payment-links/settings",
        icon: <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />,
      },
    ],
  },
]

const data: { user: { name: string; email: string; avatar: string }; sections: NavSection[] } = {
  user: {
    name: "Ezra Daniel",
    email: "ezra@xpay.com",
    avatar: "/pay-per-click.png",
  },
  sections: [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
          icon: <HugeiconsIcon icon={ChartHistogramIcon} strokeWidth={2} />,
        },
      ],
    },
    {
      label: "Transactions",
      items: [
        {
          title: "Payments",
          url: "/dashboard/payments",
          icon: <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />,
        },
        {
          title: "Payouts",
          url: "/dashboard/payouts",
          icon: <HugeiconsIcon icon={MoneyBag01Icon} strokeWidth={2} />,
        },
      ],
    },
    {
      label: "Selling",
      items: [
        {
          title: "Payment Links",
          url: "/dashboard/payment-links",
          icon: <HugeiconsIcon icon={Link02Icon} strokeWidth={2} />,
          badge: "New",
        },
        {
          title: "Payment Pages",
          url: "/dashboard/payment-pages",
          icon: <HugeiconsIcon icon={InternetIcon} strokeWidth={2} />,
        },
      ],
    },
    {
      label: "Developer",
      items: [
        {
          title: "API Keys",
          url: "/dashboard/api-keys",
          icon: <HugeiconsIcon icon={Key01Icon} strokeWidth={2} />,
        },
        {
          title: "Webhooks",
          url: "/dashboard/webhooks",
          icon: <HugeiconsIcon icon={WebhookIcon} strokeWidth={2} />,
        },
        {
          title: "Documentation",
          url: "/dashboard/docs",
          icon: <HugeiconsIcon icon={BookOpen01Icon} strokeWidth={2} />,
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          title: "Business",
          url: "/dashboard/settings/business",
          icon: <HugeiconsIcon icon={Store01Icon} strokeWidth={2} />,
        },
        {
          title: "KYC",
          url: "/dashboard/settings/kyc",
          icon: <HugeiconsIcon icon={ShieldUserIcon} strokeWidth={2} />,
        },
        {
          title: "Payment Methods",
          url: "/dashboard/settings/payment-methods",
          icon: <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} />,
        },
        {
          title: "Fees",
          url: "/dashboard/settings/fees",
          icon: <HugeiconsIcon icon={Coins01Icon} strokeWidth={2} />,
        },
        {
          title: "Security",
          url: "/dashboard/settings/security",
          icon: <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} />,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = useCurrentPathname()
  const isPaymentLinksRoute = pathname.startsWith("/dashboard/payment-links")

  const sectionsWithActive = React.useMemo(() => {
    const sourceSections = isPaymentLinksRoute ? paymentLinksSections : data.sections
    return sourceSections.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        const isActive =
          pathname === item.url ||
          (item.url !== "/dashboard" && pathname.startsWith(item.url))
        const subItems = item.subItems?.map((sub) => ({
          ...sub,
          isActive: pathname === sub.url,
        }))
        const hasActiveSub = subItems?.some((sub) => sub.isActive)
        return {
          ...item,
          isActive: isActive || hasActiveSub,
          subItems,
        }
      }),
    }))
  }, [pathname, isPaymentLinksRoute])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {isPaymentLinksRoute ? (
              <SidebarMenuButton
                tooltip="Back to Dashboard"
                render={<a href="/dashboard" />}
                className="size-8 rounded-lg text-foreground hover:bg-muted transition-colors flex items-center justify-center p-0 cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                className="data-[slot=sidebar-menu-button]:p-1.5!"
                render={<a href="/dashboard" />}
              >
                <img src="/pay-per-click.png" alt="XPay" className="size-8 rounded-lg object-cover" />
                <span className="text-base font-semibold">XPay</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={sectionsWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
