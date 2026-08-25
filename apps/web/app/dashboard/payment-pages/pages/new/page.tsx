"use client"

import { useRouter } from "next/navigation"
import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import { SiteHeader } from "@workspace/ui/components/site-header"
import { PaymentPageEditor } from "@workspace/ui/components/payment-page-editor"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

export default function NewPaymentPageRoute() {
  const router = useRouter()
  return (
    <div className="[--header-height:calc(--spacing(2)+3.5rem)] flex min-h-screen flex-col bg-muted/10">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            <PaymentPageEditor onBack={() => router.push("/dashboard/payment-pages/pages")} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
