"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Store01Icon,
  Link02Icon,
  Notification03Icon,
  PaintBoardIcon,
  SmartPhone01Icon,
  CreditCardIcon,
  CheckmarkCircle01Icon,
  ArrowUpRight01Icon,
  Copy01Icon,
  QrCode01Icon,
  LockPasswordIcon,
  ShieldUserIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { toast } from "@workspace/ui/components/toast"

const colorPresets = [
  { name: "Emerald", hex: "#10b981", class: "bg-emerald-500" },
  { name: "Blue", hex: "#2563eb", class: "bg-blue-600" },
  { name: "Violet", hex: "#7c3aed", class: "bg-violet-600" },
  { name: "Rose", hex: "#e11d48", class: "bg-rose-600" },
  { name: "Amber", hex: "#d97706", class: "bg-amber-600" },
  { name: "Slate", hex: "#0f172a", class: "bg-slate-900" },
]

export function PaymentLinksSettingsPage() {
  // Customization State
  const [brandName, setBrandName] = React.useState("SalamaPay")
  const [subdomain, setSubdomain] = React.useState("salamapay")
  const [headline, setHeadline] = React.useState("Complete Your Payment")
  const [description, setDescription] = React.useState("Fast and secure checkout powered by XPay.")
  const [selectedColor, setSelectedColor] = React.useState("#10b981")
  const [thankYouMsg, setThankYouMsg] = React.useState("Thank you! Your payment was successful.")
  const [defaultRedirect, setDefaultRedirect] = React.useState("https://salamapay.com/success")

  // Field Requirements
  const [collectName, setCollectName] = React.useState(true)
  const [collectEmail, setCollectEmail] = React.useState(true)
  const [collectPhone, setCollectPhone] = React.useState(true)
  const [collectNotes, setCollectNotes] = React.useState(false)

  // Payment Methods
  const [allowMpesa, setAllowMpesa] = React.useState(true)
  const [allowAirtel, setAllowAirtel] = React.useState(true)
  const [allowTigo, setAllowTigo] = React.useState(true)
  const [allowCards, setAllowCards] = React.useState(true)

  // Interactive Live Preview State
  const [previewMethod, setPreviewMethod] = React.useState<"mpesa" | "airtel" | "tigo" | "card">("mpesa")
  const [previewPhone, setPreviewPhone] = React.useState("0712 345 678")
  const [previewCustomerName, setPreviewCustomerName] = React.useState("Ezra Daniel")
  const [previewAmount, setPreviewAmount] = React.useState("50,000")
  const [previewPaid, setPreviewPaid] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.add({
      type: "success",
      title: "Settings Saved",
      description: "Payment Page customization is live and updated across all links.",
    })
  }

  function handlePreviewPay(e: React.FormEvent) {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setPreviewPaid(true)
      toast.add({
        type: "success",
        title: "Test Payment Successful",
        description: `TSh ${previewAmount} test payment simulated successfully.`,
      })
    }, 1200)
  }

  function copyDemoLink() {
    const demoUrl = `https://pay.xpay.com/${subdomain}/demo`
    navigator.clipboard.writeText(demoUrl)
    toast.add({
      type: "success",
      title: "Link Copied",
      description: `${demoUrl} copied to clipboard.`,
    })
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Payment Pages & Link Customizer
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize branding, colors, checkout fields, and preview customer experience in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={copyDemoLink}
            className="h-9 gap-1.5 text-xs font-medium cursor-pointer rounded-lg"
          >
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
            <span>Copy Live Link</span>
          </Button>
          <Button
            type="submit"
            form="settings-customizer-form"
            className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium px-4 cursor-pointer rounded-lg"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main 2-Column Layout: Controls on Left, Live Interactive Preview on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: Customization Controls (7 Cols) */}
        <form
          id="settings-customizer-form"
          onSubmit={handleSave}
          className="space-y-5 lg:col-span-7"
        >
          {/* Section 1: Branding & Visuals */}
          <div className="rounded-xl bg-muted/20 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={PaintBoardIcon} strokeWidth={2} className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Branding & Appearance</h2>
            </div>

            <div className="space-y-3.5 pt-1">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Brand / Merchant Name</label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="h-9 text-xs bg-background border border-border/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Subdomain Slug</label>
                  <div className="flex items-center rounded-lg bg-background border border-border/80 px-2.5">
                    <span className="text-xs text-muted-foreground font-mono">pay.xpay.com/</span>
                    <input
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="h-9 w-full bg-transparent px-1 text-xs font-mono text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Accent Color Theme */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Primary Accent Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setSelectedColor(preset.hex)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        selectedColor === preset.hex
                          ? "border-foreground bg-muted font-semibold text-foreground ring-2 ring-foreground/20"
                          : "border-border/60 bg-background text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <span className="size-3 rounded-full" style={{ backgroundColor: preset.hex }} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="size-7 cursor-pointer rounded-md border-0 bg-transparent p-0"
                      title="Custom color"
                    />
                    <span className="font-mono text-xs text-muted-foreground">{selectedColor}</span>
                  </div>
                </div>
              </div>

              {/* Headline & Subheadline */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Checkout Headline</label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="h-9 text-xs bg-background border border-border/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Checkout Description / Subtitle</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-9 text-xs bg-background border border-border/80"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Rails */}
          <div className="rounded-xl bg-muted/20 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Enabled Checkout Channels</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center justify-between rounded-lg bg-background border border-border/70 p-3 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-3.5" />
                  </div>
                  <span className="text-xs font-medium text-foreground">M-Pesa</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowMpesa}
                  onChange={(e) => setAllowMpesa(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg bg-background border border-border/70 p-3 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-3.5" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Airtel Money</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowAirtel}
                  onChange={(e) => setAllowAirtel(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg bg-background border border-border/70 p-3 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-3.5" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Tigo Pesa</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowTigo}
                  onChange={(e) => setAllowTigo(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg bg-background border border-border/70 p-3 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} className="size-3.5" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Card (Visa/MC)</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowCards}
                  onChange={(e) => setAllowCards(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Customer Information Fields */}
          <div className="rounded-xl bg-muted/20 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={ShieldUserIcon} strokeWidth={2} className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Customer Fields</h2>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="flex items-center justify-between rounded-lg bg-background border border-border/70 p-3 cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-foreground">Customer Full Name</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Ask buyer for first and last name.</div>
                </div>
                <input
                  type="checkbox"
                  checked={collectName}
                  onChange={(e) => setCollectName(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg bg-background border border-border/70 p-3 cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-foreground">Customer Email Address</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Required to send automated receipt & delivery.</div>
                </div>
                <input
                  type="checkbox"
                  checked={collectEmail}
                  onChange={(e) => setCollectEmail(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg bg-background border border-border/70 p-3 cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-foreground">Customer Mobile Number</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Needed for USSD mobile payment prompts.</div>
                </div>
                <input
                  type="checkbox"
                  checked={collectPhone}
                  onChange={(e) => setCollectPhone(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg bg-background border border-border/70 p-3 cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-foreground">Custom Notes / Order Instructions</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Optional text area for special requests.</div>
                </div>
                <input
                  type="checkbox"
                  checked={collectNotes}
                  onChange={(e) => setCollectNotes(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 4: Redirects & Post-Payment */}
          <div className="rounded-xl bg-muted/20 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Link02Icon} strokeWidth={2} className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Post-Payment Confirmation</h2>
            </div>

            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Success Thank-You Message</label>
                <Input
                  value={thankYouMsg}
                  onChange={(e) => setThankYouMsg(e.target.value)}
                  className="h-9 text-xs bg-background border border-border/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Return / Redirect URL</label>
                <Input
                  value={defaultRedirect}
                  onChange={(e) => setDefaultRedirect(e.target.value)}
                  placeholder="https://..."
                  className="h-9 text-xs bg-background border border-border/80"
                />
              </div>
            </div>
          </div>
        </form>

        {/* RIGHT COLUMN: Live Interactive Customer Checkout Preview (5 Cols) */}
        <div className="space-y-3 lg:col-span-5 sticky top-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-foreground">Live Customer Preview</span>
            </div>
            <span className="font-mono text-[0.6875rem] text-muted-foreground">
              pay.xpay.com/{subdomain}
            </span>
          </div>

          {/* Simulated Checkout Frame */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xl transition-all space-y-5">
            {/* Checkout Header with Brand & Logo */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <img
                  src="/pay-per-click.png"
                  alt="Merchant"
                  className="size-8 rounded-lg object-cover border-2"
                  style={{ borderColor: selectedColor }}
                />
                <div>
                  <div className="text-sm font-bold text-foreground">{brandName || "Merchant Store"}</div>
                  <div className="flex items-center gap-1 text-[0.625rem] text-emerald-600 dark:text-emerald-400 font-medium">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3" />
                    <span>Verified Merchant</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-[0.625rem] font-mono">
                XPay Secure
              </Badge>
            </div>

            {previewPaid ? (
              /* Success State Screen */
              <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div
                  className="mx-auto flex size-14 items-center justify-center rounded-full text-white shadow-lg"
                  style={{ backgroundColor: selectedColor }}
                >
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2.5} className="size-8" />
                </div>
                <h3 className="text-base font-bold text-foreground">Payment Complete!</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  {thankYouMsg}
                </p>
                <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1 max-w-xs mx-auto">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Amount Paid:</span>
                    <span className="font-semibold text-foreground">TSh {previewAmount}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-mono">
                    <span>Reference:</span>
                    <span>PAY{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewPaid(false)}
                  className="h-8 text-xs font-medium cursor-pointer rounded-lg"
                >
                  Reset Preview
                </Button>
              </div>
            ) : (
              /* Checkout Form Preview */
              <form onSubmit={handlePreviewPay} className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{headline}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>

                {/* Amount Display */}
                <div className="rounded-xl bg-muted/30 p-3.5 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Total Due</span>
                  <span className="text-lg font-bold text-foreground tabular-nums">
                    TSh {previewAmount}
                  </span>
                </div>

                {/* Payment Methods Grid */}
                <div className="space-y-1.5">
                  <label className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {allowMpesa && (
                      <button
                        type="button"
                        onClick={() => setPreviewMethod("mpesa")}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-all cursor-pointer ${
                          previewMethod === "mpesa"
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                            : "border-border/60 bg-background hover:bg-muted/30"
                        }`}
                      >
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span>M-Pesa</span>
                      </button>
                    )}

                    {allowAirtel && (
                      <button
                        type="button"
                        onClick={() => setPreviewMethod("airtel")}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-all cursor-pointer ${
                          previewMethod === "airtel"
                            ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold"
                            : "border-border/60 bg-background hover:bg-muted/30"
                        }`}
                      >
                        <span className="size-2 rounded-full bg-rose-500" />
                        <span>Airtel</span>
                      </button>
                    )}

                    {allowTigo && (
                      <button
                        type="button"
                        onClick={() => setPreviewMethod("tigo")}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-all cursor-pointer ${
                          previewMethod === "tigo"
                            ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold"
                            : "border-border/60 bg-background hover:bg-muted/30"
                        }`}
                      >
                        <span className="size-2 rounded-full bg-blue-500" />
                        <span>Tigo Pesa</span>
                      </button>
                    )}

                    {allowCards && (
                      <button
                        type="button"
                        onClick={() => setPreviewMethod("card")}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-all cursor-pointer ${
                          previewMethod === "card"
                            ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold"
                            : "border-border/60 bg-background hover:bg-muted/30"
                        }`}
                      >
                        <span className="size-2 rounded-full bg-purple-500" />
                        <span>Card</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer Inputs */}
                <div className="space-y-2.5 pt-1">
                  {collectName && (
                    <div className="space-y-1">
                      <label className="text-[0.6875rem] font-medium text-muted-foreground">Full Name</label>
                      <Input
                        value={previewCustomerName}
                        onChange={(e) => setPreviewCustomerName(e.target.value)}
                        placeholder="Your Name"
                        className="h-8 text-xs bg-background border border-border/80"
                      />
                    </div>
                  )}

                  {collectPhone && (
                    <div className="space-y-1">
                      <label className="text-[0.6875rem] font-medium text-muted-foreground">
                        {previewMethod === "card" ? "Phone Number" : "Mobile Money Number (USSD Push)"}
                      </label>
                      <Input
                        value={previewPhone}
                        onChange={(e) => setPreviewPhone(e.target.value)}
                        placeholder="07XX XXX XXX"
                        className="h-8 text-xs bg-background border border-border/80 font-mono"
                      />
                    </div>
                  )}

                  {collectEmail && (
                    <div className="space-y-1">
                      <label className="text-[0.6875rem] font-medium text-muted-foreground">Email Receipt To</label>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        defaultValue="customer@example.com"
                        className="h-8 text-xs bg-background border border-border/80"
                      />
                    </div>
                  )}

                  {collectNotes && (
                    <div className="space-y-1">
                      <label className="text-[0.6875rem] font-medium text-muted-foreground">Order Notes / Request</label>
                      <Input
                        placeholder="Optional details..."
                        className="h-8 text-xs bg-background border border-border/80"
                      />
                    </div>
                  )}
                </div>

                {/* Interactive Pay Button with Custom Brand Color */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-10 rounded-xl text-white font-semibold text-xs transition-all hover:opacity-90 active:scale-98 shadow-md flex items-center justify-center cursor-pointer disabled:opacity-60"
                  style={{ backgroundColor: selectedColor }}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                      <span className="size-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                      <span className="size-1.5 rounded-full bg-white animate-bounce" />
                    </div>
                  ) : (
                    <span>Pay TSh {previewAmount}</span>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1 text-[0.625rem] text-muted-foreground pt-1">
                  <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} className="size-3" />
                  <span>256-bit encrypted secure checkout</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
