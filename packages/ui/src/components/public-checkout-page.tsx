"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  SmartPhone01Icon,
  CreditCardIcon,
  LockPasswordIcon,
  ArrowLeft01Icon,
  ShieldUserIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { toast } from "@workspace/ui/components/toast"

export function PublicCheckoutPage({
  merchantName = "SalamaPay",
  title = "Complete Your Payment",
  description = "Fast and secure checkout powered by XPay.",
  amount = "50,000",
  currency = "TZS",
  brandColor = "#10b981",
}: {
  merchantName?: string
  title?: string
  description?: string
  amount?: string
  currency?: string
  brandColor?: string
}) {
  const [method, setMethod] = React.useState<"mpesa" | "airtel" | "tigo" | "card">("mpesa")
  const [phone, setPhone] = React.useState("")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      toast.add({
        type: "success",
        title: "Payment Approved",
        description: `Your payment of ${currency} ${amount} to ${merchantName} was successful.`,
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Merchant Branding */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <img
              src="/pay-per-click.png"
              alt="Merchant"
              className="size-10 rounded-xl object-cover border-2"
              style={{ borderColor: brandColor }}
            />
            <div>
              <div className="text-base font-bold text-foreground">{merchantName}</div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5" />
                <span>Verified Business</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            XPay
          </Badge>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div
              className="mx-auto flex size-16 items-center justify-center rounded-full text-white shadow-xl"
              style={{ backgroundColor: brandColor }}
            >
              <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2.5} className="size-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Payment Received!</h2>
              <p className="text-xs text-muted-foreground mt-1">
                A receipt has been sent to your email address.
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between text-muted-foreground">
                <span>Merchant:</span>
                <span className="font-semibold text-foreground">{merchantName}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Amount Paid:</span>
                <span className="font-bold text-foreground">{currency} {amount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-mono">
                <span>Reference:</span>
                <span>PAY{Math.floor(100000000 + Math.random() * 900000000)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase">COMPLETED</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/dashboard/payment-links"
                }
              }}
              className="w-full h-10 text-xs font-medium cursor-pointer rounded-xl"
            >
              Return to Dashboard
            </Button>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h1 className="text-lg font-bold text-foreground">{title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>

            {/* Total Due Banner */}
            <div className="rounded-xl bg-muted/30 p-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Total Amount</span>
              <span className="text-xl font-bold text-foreground tabular-nums">
                {currency} {amount}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment Channel
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMethod("mpesa")}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                    method === "mpesa"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold ring-2 ring-emerald-500/20"
                      : "border-border/60 bg-background hover:bg-muted/30"
                  }`}
                >
                  <span className="size-2.5 rounded-full bg-emerald-500" />
                  <span>Vodacom M-Pesa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("airtel")}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                    method === "airtel"
                      ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold ring-2 ring-rose-500/20"
                      : "border-border/60 bg-background hover:bg-muted/30"
                  }`}
                >
                  <span className="size-2.5 rounded-full bg-rose-500" />
                  <span>Airtel Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("tigo")}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                    method === "tigo"
                      ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold ring-2 ring-blue-500/20"
                      : "border-border/60 bg-background hover:bg-muted/30"
                  }`}
                >
                  <span className="size-2.5 rounded-full bg-blue-500" />
                  <span>Tigo Pesa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                    method === "card"
                      ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold ring-2 ring-purple-500/20"
                      : "border-border/60 bg-background hover:bg-muted/30"
                  }`}
                >
                  <span className="size-2.5 rounded-full bg-purple-500" />
                  <span>Visa / Master</span>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ezra Daniel"
                  required
                  className="h-9 text-xs bg-background border border-border/80"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {method === "card" ? "Cardholder Phone Number" : "Mobile Money Number (USSD Push)"}
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  required
                  className="h-9 text-xs bg-background border border-border/80 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="h-9 text-xs bg-background border border-border/80"
                />
              </div>
            </div>

            {/* Submit / Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full h-11 rounded-xl text-white font-semibold text-xs sm:text-sm transition-all hover:opacity-90 active:scale-98 shadow-lg flex items-center justify-center cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: brandColor }}
            >
              {isProcessing ? (
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-2 rounded-full bg-white animate-bounce" />
                </div>
              ) : (
                <span>Pay {currency} {amount}</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-1">
              <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} className="size-3.5" />
              <span>Secured and processed by XPay Gateway</span>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
