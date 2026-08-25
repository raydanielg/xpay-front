import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import { SiteHeader } from "@workspace/ui/components/site-header"
import { ConnectedAppsPage } from "@workspace/ui/components/connected-apps-page"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

export default function ConnectedAppsRoute() {
  return (
    <div className="[--header-height:calc(--spacing(2)+3.5rem)] flex min-h-screen flex-col bg-muted/10">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            <ConnectedAppsPage />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
