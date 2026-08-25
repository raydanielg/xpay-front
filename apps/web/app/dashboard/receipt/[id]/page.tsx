"use client"

import { use } from "react"
import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import { SiteHeader } from "@workspace/ui/components/site-header"
import { ReceiptPage } from "@workspace/ui/components/receipt-page"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

export default function ReceiptRoutePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  return (
    <div className="[--header-height:calc(--spacing(2)+3.5rem)] flex min-h-screen flex-col bg-muted/10">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            <ReceiptPage receiptId={resolvedParams.id} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
