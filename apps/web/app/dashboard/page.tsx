import {
  AppSidebar,
} from "@workspace/ui/components/app-sidebar"
import {
  SiteHeader,
} from "@workspace/ui/components/site-header"
import {
  OverviewMetrics,
} from "@workspace/ui/components/overview-metrics"
import {
  RecentPaymentsTable,
} from "@workspace/ui/components/recent-payments-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"

export default function DashboardPage() {
  return (
    <div className="[--header-height:calc(--spacing(2)+3.5rem)] flex min-h-screen flex-col bg-muted/10">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col space-y-2 pb-8">
            {/* Overview Metric Cards + Quick Actions */}
            <OverviewMetrics />

            {/* Recent Payments Table */}
            <RecentPaymentsTable />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
