"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings02Icon,
  CheckmarkCircle01Icon,
  Store01Icon,
  Link02Icon,
  Notification03Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/toast"

export function PaymentLinksSettingsPage() {
  const [domain, setDomain] = React.useState("pay.xpay.com")
  const [brandName, setBrandName] = React.useState("XPay Store")
  const [defaultRedirect, setDefaultRedirect] = React.useState("https://mywebsite.com/thank-you")
  const [emailReceipts, setEmailReceipts] = React.useState(true)
  const [notifyOnPayment, setNotifyOnPayment] = React.useState(true)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.add({
      type: "success",
      title: "Settings Saved",
      description: "Payment Links preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Payment Links Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure branding, notifications, and default behavior for your payment links
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {/* Branding & Appearance */}
        <div className="rounded-xl bg-muted/30 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Branding & Identity</h2>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Merchant Display Name</label>
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="h-9 text-sm"
              />
              <p className="text-[0.6875rem] text-muted-foreground">
                Displayed prominently at the top of all payment links.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Custom Subdomain / Host</label>
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Redirects & Checkout Experience */}
        <div className="rounded-xl bg-muted/30 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Link02Icon} strokeWidth={2} className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Redirects & Confirmation</h2>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Default Thank-You / Return URL</label>
              <Input
                value={defaultRedirect}
                onChange={(e) => setDefaultRedirect(e.target.value)}
                placeholder="https://..."
                className="h-9 text-sm"
              />
              <p className="text-[0.6875rem] text-muted-foreground">
                Customers are redirected here immediately after a successful transaction.
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl bg-muted/30 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Notification03Icon} strokeWidth={2} className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Notifications & Receipts</h2>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="size-4 rounded accent-primary"
              />
              <div className="text-xs">
                <div className="font-medium text-foreground">Send automated customer receipts</div>
                <div className="text-muted-foreground">Email receipt with transaction reference to customer.</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnPayment}
                onChange={(e) => setNotifyOnPayment(e.target.checked)}
                className="size-4 rounded accent-primary"
              />
              <div className="text-xs">
                <div className="font-medium text-foreground">Notify me on new payment</div>
                <div className="text-muted-foreground">Receive instant email and push notification when a payment is completed.</div>
              </div>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium px-4 cursor-pointer"
        >
          Save Changes
        </Button>
      </form>
    </div>
  )
}
