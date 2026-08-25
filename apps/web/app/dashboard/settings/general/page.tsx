import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import { SiteHeader } from "@workspace/ui/components/site-header"
import { GeneralSettingsPage } from "@workspace/ui/components/general-settings-page"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

export default function GeneralSettingsRoute() {
  return (
    <div className="[--header-height:calc(--spacing(2)+3.5rem)] flex min-h-screen flex-col bg-muted/10">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            <GeneralSettingsPage />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
