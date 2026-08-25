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
  DashboardChart,
} from "@workspace/ui/components/dashboard-chart"
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"

export default function Page() {
  return (
    <div className="[--header-height:calc(--spacing(2)+3.5rem)] flex min-h-screen flex-col bg-muted/10">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            <OverviewMetrics />
            <RecentPaymentsTable />
            <DashboardChart />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
