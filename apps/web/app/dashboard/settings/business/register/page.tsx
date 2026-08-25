import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import { SiteHeader } from "@workspace/ui/components/site-header"
import { BusinessRegisterPage } from "@workspace/ui/components/business-register-page"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

export default function BusinessRegisterRoute() {
  return (
    <div className="[--header-height:calc(--spacing(2)+3.5rem)] flex min-h-screen flex-col bg-muted/10">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            <BusinessRegisterPage />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
