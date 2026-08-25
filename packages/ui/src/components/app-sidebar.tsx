"use client"

import * as React from "react"

import { NavMain } from "@workspace/ui/components/nav-main"
import { NavSecondary } from "@workspace/ui/components/nav-secondary"
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
  BookOpen01Icon,
  Settings02Icon,
  CustomerSupportIcon,
  SentIcon,
  PhoneIcon,
  UserGroupIcon,
  ChartBarBigIcon,
  Exchange01Icon,
  MegaphoneIcon,
  CodeIcon,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@workspace/ui/hooks/use-auth"

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
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: (
        <HugeiconsIcon icon={Exchange01Icon} strokeWidth={2} />
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
      items: [
        {
          title: "Pages",
          url: "/dashboard/payment-pages/pages",
        },
        {
          title: "Payments",
          url: "/dashboard/payment-pages/payments",
        },
        {
          title: "Catalog",
          url: "/dashboard/payment-pages/catalog",
        },
        {
          title: "Products",
          url: "/dashboard/payment-pages/products",
        },
        {
          title: "Categories",
          url: "/dashboard/payment-pages/categories",
        },
        {
          title: "Media Library",
          url: "/dashboard/payment-pages/media-library",
        },
        {
          title: "Settings",
          url: "/dashboard/payment-pages/settings",
        },
        {
          title: "Profiles",
          url: "/dashboard/payment-pages/profiles",
        },
        {
          title: "Storage",
          url: "/dashboard/payment-pages/storage",
        },
        {
          title: "Records",
          url: "/dashboard/payment-pages/records",
        },
        {
          title: "Receipts",
          url: "/dashboard/payment-pages/receipts",
        },
        {
          title: "Content Delivery",
          url: "/dashboard/payment-pages/content-delivery",
        },
      ],
    },
    {
      title: "Marketing",
      url: "/dashboard/marketing",
      icon: (
        <HugeiconsIcon icon={MegaphoneIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Developer",
      url: "/dashboard/developer",
      icon: (
        <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
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
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Verification Overview",
          url: "/dashboard/settings/verification",
        },
        {
          title: "Identity Verification",
          url: "/dashboard/settings/identity",
        },
        {
          title: "Payout",
          url: "/dashboard/settings/payout",
        },
        {
          title: "Security",
          url: "/dashboard/settings/security",
        },
        {
          title: "Connected Apps",
          url: "/dashboard/settings/connected-apps",
        },
        {
          title: "Business Overview",
          url: "/dashboard/settings/business/overview",
        },
        {
          title: "Business Information",
          url: "/dashboard/settings/business/information",
        },
        {
          title: "Verification Documents",
          url: "/dashboard/settings/business/documents",
        },
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
      ],
    },
  ],
  navAdmin: [
    {
      title: "Staff Management",
      url: "/dashboard/staff",
      icon: (
        <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: (
        <HugeiconsIcon icon={ChartBarBigIcon} strokeWidth={2} />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "https://docs.xpay.com",
      icon: (
        <HugeiconsIcon icon={BookOpen01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Support Ticket",
      url: "/dashboard/support",
      icon: (
        <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={2} />
      ),
    },
    {
      title: "+255 613 976 254",
      url: "tel:+255613976254",
      icon: (
        <HugeiconsIcon icon={PhoneIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: (
        <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = useCurrentPathname()
  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"

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
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">XPay</span>
                <span className="truncate text-xs">Payment Platform</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={itemsWithActive} />
        {isAdmin && <NavSecondary items={data.navAdmin} className="mt-auto" />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
