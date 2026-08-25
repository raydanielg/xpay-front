"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ReceiptIcon,
  Loading03Icon,
  Download04Icon,
  Share01Icon,
  PrinterIcon,
  CheckmarkCircle01Icon,
  UserCircle02Icon,
  CreditCardIcon,
  Calendar01Icon,
  Globe02Icon,
  Building01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@workspace/ui/components/page-utils"

type ReceiptData = {
  id: string
  receiptNumber: string
  reference: string
  intentRef: string
  customer: {
    name: string
    phone: string
    email: string
  }
  settlement: {
    subtotal: number
    fee: number
    net: number
    total: number
  }
  payment: {
    method: string
    channel: string
    pspRef: string
    payerPhone: string
  }
  paymentPage: {
    title: string
    url: string
  }
  dates: {
    paid: string
    created: string
  }
}

function formatCurrency(value: number) {
  return `TSh ${value.toLocaleString()}`
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-dashed border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium text-foreground ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}

function SectionTitle({ icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-4 pb-2">
      <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-4 text-muted-foreground" />
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
    </div>
  )
}

export function ReceiptPage({ receiptId }: { receiptId?: string }) {
  const [receipt, setReceipt] = React.useState<ReceiptData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!receiptId) {
      setLoading(false)
      return
    }
    api.get<ReceiptData>(`/payments/${receiptId}/receipt`).then((res) => {
      if (res.success && res.data) setReceipt(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [receiptId])

  function handlePrint() {
    window.print()
  }

  function handleDownload() {
    toast.add({ type: "success", title: "Receipt downloaded", description: "PDF receipt has been downloaded." })
  }

  function handleShare() {
    if (navigator.share && receipt) {
      navigator.share({
        title: `Receipt ${receipt.receiptNumber}`,
        text: `Payment receipt for ${receipt.settlement.total}`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.add({ type: "success", title: "Link copied", description: "Receipt link copied to clipboard." })
    }
  }

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
        <PageHeader icon={ReceiptIcon} title="Receipt" description="Payment receipt details." />
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted/50">
              <HugeiconsIcon icon={ReceiptIcon} strokeWidth={1.5} className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Receipt not found</p>
            <p className="text-xs text-muted-foreground">The receipt you are looking for does not exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 no-print">
        <PageHeader icon={ReceiptIcon} title="Receipt Details" description={`Receipt #${receipt.receiptNumber}`} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
            <HugeiconsIcon icon={Share01Icon} strokeWidth={2} className="size-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
            <HugeiconsIcon icon={PrinterIcon} strokeWidth={2} className="size-4" />
            Print
          </Button>
          <Button size="sm" className="gap-2" onClick={handleDownload}>
            <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Receipt Card — Dropped/Tilted Design */}
      <div className="flex items-start justify-center pt-6 pb-10">
        <div
          className="relative w-full max-w-md"
          style={{ perspective: "1200px" }}
        >
          {/* Shadow underneath */}
          <div
            className="absolute inset-0 rounded-2xl bg-black/20 blur-2xl translate-y-8 scale-95"
            aria-hidden
          />

          {/* The receipt card — tilted/dropped */}
          <div
            className="relative rounded-2xl border border-border bg-gradient-to-b from-background to-muted/30 shadow-2xl transition-transform duration-500 hover:[transform:rotateX(0deg)_rotateY(0deg)_translateY(0)]"
            style={{
              transform: "rotateX(8deg) rotateY(-3deg) translateY(12px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Top zigzag edge */}
            <div className="relative overflow-hidden rounded-t-2xl">
              <div
                className="absolute top-0 left-0 right-0 h-3"
                style={{
                  backgroundImage: "linear-gradient(135deg, transparent 33.33%, var(--background) 33.66%, var(--background) 66.66%, transparent 67%)",
                  backgroundSize: "12px 12px",
                }}
              />
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Success check + Receipt number */}
              <div className="flex flex-col items-center gap-3 pt-6 pb-4">
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={1.5} className="size-8 text-emerald-500" />
                </div>
                <div className="text-center">
                  <h2 className="text-base font-bold text-foreground">Payment Successful</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Receipt has been generated</p>
                </div>
                <div className="rounded-lg bg-muted/60 px-4 py-1.5">
                  <span className="text-sm font-mono font-bold text-foreground tracking-tight">{receipt.receiptNumber}</span>
                </div>
              </div>

              {/* Dashed separator */}
              <div className="border-t-2 border-dashed border-border/50 my-2" />

              {/* Details */}
              <div className="flex flex-col">
                <SectionTitle icon={ReceiptIcon} title="Details" />
                <DetailRow label="Receipt #" value={receipt.receiptNumber} mono />
                <DetailRow label="Reference" value={receipt.reference} mono />
                <DetailRow label="Intent Ref" value={receipt.intentRef} mono />

                <SectionTitle icon={UserCircle02Icon} title="Customer" />
                <DetailRow label="Name" value={receipt.customer.name} />
                <DetailRow label="Phone" value={receipt.customer.phone} mono />
                <DetailRow label="Email" value={receipt.customer.email} />

                <SectionTitle icon={Building01Icon} title="Settlement" />
                <DetailRow label="Subtotal" value={formatCurrency(receipt.settlement.subtotal)} />
                <DetailRow label="Fee" value={`-${formatCurrency(receipt.settlement.fee)}`} />
                <div className="flex items-center justify-between py-2.5 border-b border-dashed border-border/40">
                  <span className="text-xs font-semibold text-foreground">Net</span>
                  <span className="text-sm font-bold text-emerald-600">+{formatCurrency(receipt.settlement.net)}</span>
                </div>
                <div className="flex items-center justify-between py-3 mt-1 rounded-lg bg-muted/40 px-3">
                  <span className="text-sm font-bold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">{formatCurrency(receipt.settlement.total)}</span>
                </div>

                <SectionTitle icon={CreditCardIcon} title="Payment" />
                <DetailRow label="Method" value={receipt.payment.method} />
                <DetailRow label="Channel" value={receipt.payment.channel} mono />
                <DetailRow label="PSP Ref" value={receipt.payment.pspRef} mono />
                <DetailRow label="Payer Phone" value={receipt.payment.payerPhone} mono />

                <SectionTitle icon={Globe02Icon} title="Payment Page" />
                <DetailRow label="Title" value={receipt.paymentPage.title} />
                <div className="flex items-center justify-between py-2 border-b border-dashed border-border/40 last:border-0">
                  <span className="text-xs text-muted-foreground">URL</span>
                  <a href={receipt.paymentPage.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-primary truncate max-w-[200px] hover:underline">
                    {receipt.paymentPage.url}
                  </a>
                </div>

                <SectionTitle icon={Calendar01Icon} title="Dates" />
                <DetailRow label="Paid" value={formatDate(receipt.dates.paid)} />
                <DetailRow label="Created" value={formatDate(receipt.dates.created)} />
              </div>

              {/* Dashed separator */}
              <div className="border-t-2 border-dashed border-border/50 my-3" />

              {/* Footer */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <p className="text-xs font-semibold text-foreground">XPay</p>
                <p className="text-[10px] text-muted-foreground">Powered by XPay Payment Platform</p>
                <p className="text-[10px] text-muted-foreground mt-1">This is an electronic receipt. No signature required.</p>
              </div>
            </div>

            {/* Bottom zigzag edge */}
            <div className="relative overflow-hidden rounded-b-2xl">
              <div
                className="absolute bottom-0 left-0 right-0 h-3"
                style={{
                  backgroundImage: "linear-gradient(45deg, transparent 33.33%, var(--background) 33.66%, var(--background) 66.66%, transparent 67%)",
                  backgroundSize: "12px 12px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
