"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  Download04Icon,
  Message01Icon,
  Sorting01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/toast"

export function PublicCheckoutPage({
  reference = "PAY17854561181590356",
  merchantName = "PIUS JUSTUS",
  title = "UNATAKA KUWA WAKALA LAKINI HUJUI UANZIE WAPI?",
  description = "MWONGOZO WA BIASHARA YA UWAKALA",
  amount = "TSh 19,999",
  currency = "TZS",
  brandColor = "#dc2626",
  customerName = "",
  customerEmail = "",
  status = "unpaid",
  expiresAt = "",
  paymentMethods,
  link = "",
}: {
  reference?: string
  merchantName?: string
  title?: string
  description?: string
  amount?: string
  currency?: string
  brandColor?: string
  customerName?: string
  customerEmail?: string
  status?: string
  expiresAt?: string
  paymentMethods?: string
  link?: string
}) {
  const [phone, setPhone] = React.useState("")
  const [fullName, setFullName] = React.useState(customerName && customerName !== "-" ? customerName : "")
  const [email, setEmail] = React.useState(customerEmail && customerEmail !== "-" ? customerEmail : "")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(status === "completed")
  const [isPrinting, setIsPrinting] = React.useState(false)

  const cleanAmount = amount.replace(/^TSh\s*/i, "").trim() || "19,999"
  const formattedPrice = `TSh ${cleanAmount}`

  const receiptDate = React.useMemo(() => {
    const now = new Date()
    return now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }, [])

  const fiscalReceiptNumber = React.useMemo(() => {
    return `RCT${Math.floor(100000 + Math.random() * 900000)}`
  }, [])

  function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setIsPrinting(true)
      toast.add({
        type: "success",
        title: "Malipo Yamekamilika! 🎉",
        description: `Malipo ya ${formattedPrice} kwa ${merchantName} yamepokelewa kikamilifu.`,
      })
      setTimeout(() => setIsPrinting(false), 2500)
    }, 1600)
  }


  function handleDownloadReceipt() {
    const receiptContent = `
========================================
    TANZANIA REVENUE AUTHORITY (TRA)
ELECTRONIC FISCAL DEVICE (EFD) RECEIPT
========================================
MERCHANT: ${merchantName}
TIN: 142-998-312 | VRN: 40-029411-K
EFD S/N: XPAY-EFD-891042
RECEIPT NO: ${fiscalReceiptNumber}
REFERENCE: ${reference}
DATE & TIME: ${receiptDate}
----------------------------------------
CUSTOMER: ${fullName || "Mteja"}
EMAIL: ${email || "-"}
PHONE: ${phone || "+255 7XX XXX XXX"}
----------------------------------------
ITEM: ${description || "MWONGOZO WA BIASHARA YA UWAKALA"}
QTY: 1  x  ${formattedPrice}
----------------------------------------
SUBTOTAL: ${formattedPrice}
VAT (18% INCLUSIVE): TSh ${(Number(cleanAmount.replace(/,/g, "")) * 0.18).toLocaleString()}
TOTAL PAID: ${formattedPrice}
PAYMENT METHOD: VODACOM M-PESA / AIRTEL
STATUS: SUCCESSFUL (APPROVED)
----------------------------------------
       ASANTE KWA KUTUCHAGUA
   POWERED BY XPAY PAYMENT GATEWAY
========================================
    `
    const element = document.createElement("a")
    const file = new Blob([receiptContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `Receipt_${reference}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast.add({
      type: "success",
      title: "Receipt Imepakuliwa",
      description: `Risiti ya ${reference} imehifadhiwa.`,
    })
  }

  function handlePrintReceipt() {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  function handleShareWhatsapp() {
    const message = encodeURIComponent(
      `Habari ${merchantName}, nimekamilisha malipo ya ${formattedPrice} kwa ajili ya ${description || "Mwongozo wa Uwakala"}.\nReference: ${reference}\nJina: ${fullName || "Mteja"}\nEmail: ${email || "-"}`
    )
    window.open(`https://wa.me/255712345678?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased">
      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isSuccess ? (
          /* ========================================================================= */
          /* REALISTIC EFD / POS PRINTER MACHINE ANIMATION WITH DISPENSING RECEIPT     */
          /* ========================================================================= */
          <div className="max-w-xl mx-auto space-y-6">
            {/* EFD Terminal Machine Chassis */}
            <div className="rounded-3xl bg-zinc-900 border-4 border-zinc-800 shadow-2xl overflow-hidden relative">
              {/* Terminal Top Hardware Details */}
              <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex size-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-3 bg-emerald-500" />
                  </span>
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                      {isPrinting ? "● PRINTING FISCAL RECEIPT..." : "● EFD TERMINAL ONLINE"}
                    </div>
                    <div className="text-[0.625rem] font-mono text-zinc-400">
                      TRA FISCAL CODE: VERIFIED · {receiptDate}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[0.6875rem] font-mono font-semibold text-zinc-300">
                    TRA-EFD-891042
                  </div>
                  <div className="text-[0.5625rem] font-mono text-zinc-500">
                    STATUS: APPROVED 200
                  </div>
                </div>
              </div>

              {/* Printer Dispenser Paper Exit Slot */}
              <div className="relative bg-zinc-950 pt-2 pb-1 px-6 shadow-inner flex justify-center">
                <div className="w-11/12 h-3 bg-zinc-900 rounded-sm border border-zinc-800 shadow-inner flex items-center justify-center">
                  <div className="w-full h-0.5 bg-black/80 rounded-full" />
                </div>
              </div>

              {/* Dispensed Receipt Paper Area */}
              <div className="bg-zinc-950 p-4 sm:p-6 flex flex-col items-center">
                {/* The Paper Receipt with serrated edges */}
                <div
                  className={`w-full max-w-md bg-[#fafaf9] text-zinc-900 shadow-xl border border-zinc-300 transition-all duration-700 ${
                    isPrinting
                      ? "animate-in slide-in-from-top-12 duration-1000"
                      : "animate-in fade-in duration-300"
                  }`}
                  style={{
                    filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.35))",
                  }}
                >
                  {/* Top Jagged / Serrated Cut Edge */}
                  <div className="w-full h-3 bg-zinc-950 flex overflow-hidden">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-zinc-950 shrink-0"
                      />
                    ))}
                  </div>

                  {/* Receipt Printable Body */}
                  <div className="p-6 sm:p-7 space-y-4 font-mono text-xs">
                    {/* Header TRA info */}
                    <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-400">
                      <div className="font-extrabold text-sm tracking-wider uppercase">
                        TANZANIA REVENUE AUTHORITY
                      </div>
                      <div className="text-[0.6875rem] font-bold text-zinc-700 uppercase">
                        ELECTRONIC FISCAL DEVICE (EFD) RECEIPT
                      </div>
                      <div className="text-[0.625rem] text-zinc-600">
                        OFFICIAL FISCAL SALE RECEIPT
                      </div>
                    </div>

                    {/* Merchant & Device Metadata */}
                    <div className="text-[0.6875rem] space-y-0.5 text-zinc-700 pb-3 border-b border-dashed border-zinc-400">
                      <div className="flex justify-between font-bold text-zinc-900">
                        <span>MERCHANT:</span>
                        <span className="uppercase">{merchantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TIN:</span>
                        <span>142-998-312</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VRN:</span>
                        <span>40-029411-K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SERIAL NO:</span>
                        <span>XPAY-EFD-891042</span>
                      </div>
                      <div className="flex justify-between font-semibold text-zinc-900">
                        <span>RECEIPT NO:</span>
                        <span>{fiscalReceiptNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DATE & TIME:</span>
                        <span>{receiptDate}</span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="text-[0.6875rem] space-y-0.5 text-zinc-700 pb-3 border-b border-dashed border-zinc-400">
                      <div className="flex justify-between">
                        <span>CUSTOMER:</span>
                        <span className="font-semibold text-zinc-900">
                          {fullName || "Mteja"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>EMAIL:</span>
                        <span className="font-semibold text-zinc-900">
                          {email || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>PHONE:</span>
                        <span className="font-semibold text-zinc-900">
                          {phone || "+255 7XX XXX XXX"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>REFERENCE:</span>
                        <span className="font-bold text-zinc-900">{reference}</span>
                      </div>
                    </div>

                    {/* Itemized Table */}
                    <div className="space-y-2 pb-3 border-b border-dashed border-zinc-400">
                      <div className="flex justify-between font-bold text-[0.6875rem] text-zinc-800 pb-1 border-b border-zinc-300">
                        <span>ITEM DESCRIPTION</span>
                        <span>AMOUNT</span>
                      </div>

                      <div className="flex justify-between items-start text-xs pt-1">
                        <div className="pr-2">
                          <div className="font-bold text-zinc-900 leading-tight">
                            {description || "MWONGOZO WA BIASHARA YA UWAKALA"}
                          </div>
                          <div className="text-[0.625rem] text-zinc-600">
                            Qty: 1 x {formattedPrice}
                          </div>
                        </div>
                        <span className="font-bold text-zinc-900 shrink-0">
                          {formattedPrice}
                        </span>
                      </div>
                    </div>

                    {/* Totals & Tax Calculation */}
                    <div className="space-y-1 text-xs pb-3 border-b border-dashed border-zinc-400">
                      <div className="flex justify-between text-zinc-700 text-[0.6875rem]">
                        <span>SUBTOTAL:</span>
                        <span>{formattedPrice}</span>
                      </div>
                      <div className="flex justify-between text-zinc-700 text-[0.6875rem]">
                        <span>VAT (18% INCLUSIVE):</span>
                        <span>TSh {(Number(cleanAmount.replace(/,/g, "")) * 0.18).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base font-extrabold text-zinc-900 pt-1 border-t border-zinc-300">
                        <span>TOTAL PAID:</span>
                        <span className="text-red-700 dark:text-red-600">{formattedPrice}</span>
                      </div>
                    </div>

                    {/* Payment Provider & Verification */}
                    <div className="space-y-2 text-center pt-1 text-[0.6875rem]">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[0.625rem]">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2.5} className="size-3 text-emerald-700" />
                        <span>PAYMENT APPROVED · PAID IN FULL</span>
                      </div>

                      <div className="text-[0.625rem] text-zinc-600">
                        CHANNEL: VODACOM M-PESA / TIGO / AIRTEL (INSTANT SETTLEMENT)
                      </div>

                      {/* Mock TRA QR & Verification Barcode */}
                      <div className="py-2 flex flex-col items-center justify-center gap-1.5">
                        <div className="p-2 bg-white border border-zinc-300 rounded-md shadow-xs">
                          {/* Visual QR Code Representation */}
                          <div className="size-20 bg-zinc-900 p-1 flex flex-wrap gap-0.5 rounded-xs">
                            {Array.from({ length: 64 }).map((_, idx) => (
                              <div
                                key={idx}
                                className={`size-2 ${
                                  (idx * 7 + 3) % 3 === 0 || idx < 8 || idx % 8 === 0
                                    ? "bg-white"
                                    : "bg-zinc-900"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-[0.5625rem] font-mono text-zinc-500 tracking-widest">
                          TRA VERIFICATION QR: {reference}
                        </div>
                      </div>

                      <div className="text-[0.6875rem] font-bold text-zinc-800 pt-1">
                        *** ASANTE KWA KUTUCHAGUA ***
                      </div>
                      <div className="text-[0.5625rem] text-zinc-500">
                        KITABU KIMETUMWA MOJA KWA MOJA KWENYE WHATSAPP YAKO
                      </div>
                    </div>
                  </div>

                  {/* Bottom Jagged / Serrated Tear Edge */}
                  <div className="w-full h-3 bg-zinc-950 flex overflow-hidden">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-zinc-950 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions after payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={handleDownloadReceipt}
                className="h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-4" />
                <span>Pakua Risiti (Receipt)</span>
              </Button>

              <Button
                type="button"
                onClick={handleShareWhatsapp}
                className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <HugeiconsIcon icon={Message01Icon} strokeWidth={2} className="size-4" />
                <span>Thibitisha WhatsApp</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handlePrintReceipt}
                className="h-10 text-xs font-medium rounded-xl cursor-pointer"
              >
                <span>Chapisha (Print)</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSuccess(false)
                }}
                className="h-10 text-xs font-medium rounded-xl cursor-pointer"
              >
                <span>Fanya Malipo Mengine</span>
              </Button>
            </div>
          </div>
        ) : (
          /* 2-COLUMN CHECKOUT PAGE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT COLUMN: Product Info (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Merchant Logo + Name */}
              <div className="flex items-center gap-2.5 pb-2">
                <div className="size-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src="/pay-per-click.png"
                    alt={merchantName}
                    className="size-full object-cover"
                  />
                </div>
                <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                  {merchantName}
                </span>
              </div>

              {/* Pay / Currency Row */}
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <span>Pay</span>
                <span>🇹🇿</span>
                <span className="inline-flex items-center gap-0.5 font-semibold text-zinc-700 dark:text-zinc-300">
                  TZS
                  <HugeiconsIcon icon={Sorting01Icon} strokeWidth={2} className="size-3" />
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                {formattedPrice}
              </div>

              {/* Product Title */}
              <h2 className="font-bold text-lg sm:text-xl text-zinc-950 dark:text-white tracking-tight">
                {title}
              </h2>

              {/* Description */}
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                {description || "Malipo kwa simu – M-Pesa, Airtel Money, Halopesa, Mixx by Yas."}
              </p>

              {/* Product Preview Card */}
              <div className="pt-2 space-y-3">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src="/pay-per-click.png"
                        alt={title}
                        className="size-5 object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white">
                        {title}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{formattedPrice}</span>
                        <span>·</span>
                        <span>Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="size-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-0.5 bg-primary-foreground rounded-full" />
                  </div>
                </div>

                {/* Itemized row */}
                <div className="flex items-center justify-between px-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {title} × 1
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {formattedPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Payment Form (5 Cols) */}
            <div className="lg:col-span-5">
              <form onSubmit={handlePayment} className="space-y-5">
                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Payment method
                  </label>

                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 p-3.5">
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white">
                        Mobile Money
                      </div>
                      <div className="text-[0.6875rem] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        M-Pesa, Mixx by Yas, Airtel Money, Halopesa
                      </div>
                    </div>

                    <div className="size-4 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                      <div className="size-2 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Phone number
                  </label>
                  <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <div className="flex items-center gap-1.5 px-3 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0 select-none">
                      <span>🇹🇿</span>
                      <HugeiconsIcon icon={Sorting01Icon} strokeWidth={2} className="size-3 text-zinc-400" />
                      <span className="text-zinc-900 dark:text-white font-mono">+255</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="712 345 678"
                      required
                      className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm font-mono font-medium outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Contact Information
                  </label>

                  <div className="space-y-2">
                    {/* Full Name */}
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      required
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />

                    {/* Email Address */}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      required
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-bold text-sm sm:text-base shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.3s]" />
                      <span className="size-2 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.15s]" />
                      <span className="size-2 rounded-full bg-primary-foreground animate-bounce" />
                      <span className="text-xs font-medium ml-1">Processing...</span>
                    </div>
                  ) : (
                    `Pay ${formattedPrice}`
                  )}
                </button>

                {/* Payment Providers */}
                <div className="pt-2 text-center space-y-3">
                  <div className="text-[0.6875rem] font-medium text-zinc-500 dark:text-zinc-400">
                    Supported payment providers
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
                    <img src="/providers/airtel-seeklogo.png" alt="Airtel" className="h-5 w-auto object-contain" />
                    <img src="/providers/vodacom-seeklogo.png" alt="Vodacom" className="h-5 w-auto object-contain" />
                    <img src="/providers/halopesa.png" alt="Halopesa" className="h-5 w-auto object-contain" />
                    <img src="/providers/mixx-by-yas-seeklogo.png" alt="Mixx by Yas" className="h-5 w-auto object-contain" />
                    <img src="/providers/tips.png" alt="TIPS" className="h-5 w-auto object-contain" />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <img src="/providers/Visa.png" alt="Visa" className="h-4 w-auto object-contain" />
                    <img src="/providers/Mastercard.png" alt="Mastercard" className="h-4 w-auto object-contain" />
                    <img src="/providers/Amex.png" alt="Amex" className="h-4 w-auto object-contain" />
                    <img src="/providers/UnionPay.png" alt="UnionPay" className="h-4 w-auto object-contain" />
                    <img src="/providers/ApplePay.png" alt="Apple Pay" className="h-4 w-auto object-contain" />
                    <img src="/providers/GooglePay.png" alt="Google Pay" className="h-4 w-auto object-contain" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

