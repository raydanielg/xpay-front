import {
  AppSidebar,
} from "@workspace/ui/components/app-sidebar"
import {
  SiteHeader,
} from "@workspace/ui/components/site-header"
import {
  PaymentLinksPage,
} from "@workspace/ui/components/payment-links-page"
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"

export default function PaymentLinks() {
  return (
    <div className="[--header-height:calc(--spacing(2)+3.5rem)] flex min-h-screen flex-col bg-muted/10">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            <PaymentLinksPage />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
