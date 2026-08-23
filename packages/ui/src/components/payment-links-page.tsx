"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Copy01Icon,
  PlusSignCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { toast } from "@workspace/ui/components/toast"

interface PaymentLinkRecord {
  id: string
  reference: string
  fullReference: string
  merchantProfile: string
  amount: string
  customer: string
  status: "unpaid" | "completed" | "expired"
  createdAt: string
}

const mockPaymentRecords: PaymentLinkRecord[] = [
  { id: "1", reference: "PAY178545611...", fullReference: "PAY178545611982734", merchantProfile: "XPay", amount: "TSh 1,000", customer: "-", status: "unpaid", createdAt: "31 Jul 2026, 03:01" },
  { id: "2", reference: "PAY177660605...", fullReference: "PAY177660605891234", merchantProfile: "XPay", amount: "TSh 50,000", customer: "-", status: "unpaid", createdAt: "19 Apr 2026, 16:40" },
  { id: "3", reference: "PAY177341881...", fullReference: "PAY177341881902834", merchantProfile: "XPay", amount: "TSh 1,000", customer: "-", status: "unpaid", createdAt: "13 Mar 2026, 19:20" },
  { id: "4", reference: "PAY177338727...", fullReference: "PAY177338727839481", merchantProfile: "XPay", amount: "TSh 2,000", customer: "Euphemia Vitus Joseph", status: "completed", createdAt: "13 Mar 2026, 10:34" },
  { id: "5", reference: "PAY177322187...", fullReference: "PAY177322187123984", merchantProfile: "XPay", amount: "TSh 10,000", customer: "-", status: "expired", createdAt: "11 Mar 2026, 12:37" },
  { id: "6", reference: "PAY177322116...", fullReference: "PAY177322116982341", merchantProfile: "XPay", amount: "TSh 100,000", customer: "-", status: "expired", createdAt: "11 Mar 2026, 12:26" },
  { id: "7", reference: "PAY177322058...", fullReference: "PAY177322058456123", merchantProfile: "XPay", amount: "TSh 200,000", customer: "-", status: "expired", createdAt: "11 Mar 2026, 12:16" },
  { id: "8", reference: "PAY177322058...", fullReference: "PAY177322058987654", merchantProfile: "XPay", amount: "TSh 500,000", customer: "-", status: "unpaid", createdAt: "11 Mar 2026, 12:16" },
  { id: "9", reference: "PAY177321963...", fullReference: "PAY177321963234567", merchantProfile: "XPay", amount: "TSh 100,000", customer: "-", status: "expired", createdAt: "11 Mar 2026, 12:00" },
  { id: "10", reference: "PAY177321920...", fullReference: "PAY177321920876543", merchantProfile: "XPay", amount: "TSh 100,000", customer: "-", status: "expired", createdAt: "11 Mar 2026, 11:53" },
  { id: "11", reference: "PAY177321891...", fullReference: "PAY177321891123456", merchantProfile: "XPay", amount: "TSh 500,000", customer: "-", status: "expired", createdAt: "11 Mar 2026, 11:48" },
  { id: "12", reference: "PAY177321791...", fullReference: "PAY177321791654321", merchantProfile: "XPay", amount: "TSh 500,000", customer: "-", status: "expired", createdAt: "11 Mar 2026, 11:31" },
  { id: "13", reference: "PAY177321723...", fullReference: "PAY177321723789012", merchantProfile: "XPay", amount: "TSh 100,000", customer: "Geofrey peleus", status: "completed", createdAt: "11 Mar 2026, 11:20" },
  { id: "14", reference: "PAY177321700...", fullReference: "PAY177321700345678", merchantProfile: "XPay", amount: "TSh 50,000", customer: "-", status: "expired", createdAt: "11 Mar 2026, 11:16" },
  { id: "15", reference: "PAY177321680...", fullReference: "PAY177321680901234", merchantProfile: "XPay", amount: "TSh 150,000", customer: "-", status: "unpaid", createdAt: "11 Mar 2026, 11:13" },
  { id: "16", reference: "PAY177321675...", fullReference: "PAY177321675567890", merchantProfile: "XPay", amount: "TSh 50,000", customer: "-", status: "unpaid", createdAt: "11 Mar 2026, 11:12" },
  { id: "17", reference: "PAY177321663...", fullReference: "PAY177321663123789", merchantProfile: "XPay", amount: "TSh 300,000", customer: "Mark Bwemo", status: "completed", createdAt: "11 Mar 2026, 11:10" },
  { id: "18", reference: "PAY177321172...", fullReference: "PAY177321172890123", merchantProfile: "XPay", amount: "TSh 1,000", customer: "Joas Maugo", status: "completed", createdAt: "11 Mar 2026, 09:48" },
  { id: "19", reference: "PAY177321127...", fullReference: "PAY177321127456789", merchantProfile: "XPay", amount: "TSh 1,000", customer: "Joseph Gembe Msuya", status: "completed", createdAt: "11 Mar 2026, 09:41" },
  { id: "20", reference: "PAY177321050...", fullReference: "PAY177321050123456", merchantProfile: "XPay", amount: "TSh 1,000", customer: "Air Ezra", status: "completed", createdAt: "11 Mar 2026, 09:28" },
]

const statusOptions = [
  { label: "All statuses", value: "ALL" },
  { label: "completed", value: "completed" },
  { label: "unpaid", value: "unpaid" },
  { label: "expired", value: "expired" },
] as const

function StatusBadge({ status }: { status: PaymentLinkRecord["status"] }) {
  const config = {
    completed: {
      icon: CheckmarkCircle01Icon,
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    unpaid: {
      icon: Clock01Icon,
      className: "bg-muted text-muted-foreground border-border",
    },
    expired: {
      icon: CancelCircleIcon,
      className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
  }
  const { icon, className } = config[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider lowercase ${className}`}>
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3" />
      {status}
    </span>
  )
}

export function PaymentLinksPage() {
  const [records, setRecords] = React.useState<PaymentLinkRecord[]>(mockPaymentRecords)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [selected, setSelected] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Drawer form fields
  const [merchantProfile, setMerchantProfile] = React.useState("Default")
  const [currency, setCurrency] = React.useState("TZS (Tanzanian Shilling)")
  const [amount, setAmount] = React.useState("0")
  const [letCustomerChoose, setLetCustomerChoose] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [expiryDuration, setExpiryDuration] = React.useState("1 hour")

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredRecords = records.filter((item) => {
    const matchesSearch =
      item.reference.toLowerCase().includes(search.toLowerCase()) ||
      item.fullReference.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const allSelected = selected.length === paginatedRecords.length && paginatedRecords.length > 0
  const someSelected = selected.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) setSelected([])
    else setSelected(paginatedRecords.map((r) => r.id))
  }

  function toggleOne(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function copyRef(ref: string) {
    navigator.clipboard.writeText(ref)
    toast.add({
      type: "success",
      title: "Copied Reference",
      description: `${ref} copied to clipboard.`,
    })
  }

  function handleCreateLink(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const randNum = Math.floor(100000000 + Math.random() * 900000000)
      const formattedAmount = letCustomerChoose
        ? "Custom Amount"
        : `TSh ${Number(amount || 0).toLocaleString()}`

      const newRecord: PaymentLinkRecord = {
        id: String(Date.now()),
        reference: `PAY${String(randNum).substring(0, 9)}...`,
        fullReference: `PAY${randNum}${Date.now().toString().substring(8)}`,
        merchantProfile: merchantProfile === "Default" ? "XPay" : merchantProfile,
        amount: formattedAmount,
        customer: description.trim() || "-",
        status: "unpaid",
        createdAt: "Today, just now",
      }

      setRecords([newRecord, ...records])
      setIsSubmitting(false)
      setDrawerOpen(false)

      // Reset form
      setAmount("0")
      setDescription("")
      setLetCustomerChoose(false)
      setExpiryDuration("1 hour")

      toast.add({
        type: "success",
        title: "Payment Link Created",
        description: `Reference ${newRecord.reference} generated successfully.`,
      })
    }, 1200)
  }

  return (
    <div className="space-y-4 px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Payment Links</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor payment link transactions
          </p>
        </div>
        <Button
          onClick={() => setDrawerOpen(true)}
          className="h-9 gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
        >
          <HugeiconsIcon icon={PlusSignCircleIcon} strokeWidth={2} className="size-3.5" />
          Create Payment Link
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Status Dropdown Filter */}
        <div className="w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 w-full rounded-lg bg-muted/30 px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/50 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-popover text-popover-foreground">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by reference..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 pl-9 pr-4 text-xs bg-muted/20 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-muted/20">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/40 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3">REFERENCE</th>
              <th className="px-4 py-3">MERCHANT PROFILE</th>
              <th className="px-4 py-3">AMOUNT</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">CREATED</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3.5"><div className="size-4 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-20 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-16 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-28 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-5 w-16 animate-pulse rounded bg-muted" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 animate-pulse rounded bg-muted" /></td>
                </tr>
              ))
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No payment links found</p>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((item) => {
                const isSelected = selected.includes(item.id)
                return (
                  <tr
                    key={item.id}
                    className={`group transition-colors hover:bg-muted/40 ${
                      isSelected ? "bg-muted/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(item.id)}
                        aria-label={`Select ${item.reference}`}
                      />
                    </td>

                    {/* Reference */}
                    <td className="px-4 py-3.5 font-mono font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span>{item.reference}</span>
                        <button
                          type="button"
                          onClick={() => copyRef(item.fullReference)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary cursor-pointer"
                          title="Copy reference"
                        >
                          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                        </button>
                      </div>
                    </td>

                    {/* Merchant Profile */}
                    <td className="px-4 py-3.5 text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <img
                          src="/pay-per-click.png"
                          alt="Merchant"
                          className="size-4 rounded-xs object-cover"
                        />
                        <span>{item.merchantProfile}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 font-semibold tabular-nums text-foreground">
                      {item.amount}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5 text-foreground">
                      {item.customer !== "-" ? (
                        <span className="font-medium">{item.customer}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {item.createdAt}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && filteredRecords.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row text-xs text-muted-foreground">
          {/* Items count / page size */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{pageSize}</span>
            <span>items per page</span>
          </div>

          {/* Page status & controls */}
          <div className="flex items-center gap-4">
            <span>
              Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
              <span className="font-semibold text-foreground">{totalPages}</span>
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="size-7 p-0 border-0 bg-muted/30 hover:bg-muted cursor-pointer disabled:opacity-30"
                aria-label="Previous page"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="size-7 p-0 border-0 bg-muted/30 hover:bg-muted cursor-pointer disabled:opacity-30"
                aria-label="Next page"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Side Drawer (Sheet) for Create Payment Link */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-s border-border bg-card p-0 shadow-2xl flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <SheetHeader className="p-6 pb-4 border-b border-border/60">
            <SheetTitle className="text-base font-semibold">Create Payment Link</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Configure parameters to generate a shareable checkout link.
            </SheetDescription>
          </SheetHeader>

          {/* Drawer Form Body */}
          <form
            id="create-payment-link-form"
            onSubmit={handleCreateLink}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            {/* Merchant Profile */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Merchant profile</label>
              <div className="space-y-1">
                <select
                  value={merchantProfile}
                  onChange={(e) => setMerchantProfile(e.target.value)}
                  className="h-9 w-full rounded-lg bg-muted/30 px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <option value="Default" className="bg-popover text-popover-foreground">
                    Default
                  </option>
                  <option value="SalamaPay" className="bg-popover text-popover-foreground">
                    SalamaPay
                  </option>
                  <option value="XPay Store" className="bg-popover text-popover-foreground">
                    XPay Store
                  </option>
                </select>
                <p className="text-[0.6875rem] text-muted-foreground">
                  Choose a profile for branding, redirect URLs, and payment methods.
                </p>
              </div>
            </div>

            {/* Currency & Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Amount</label>
              <div className="space-y-2">
                {/* Currency selector */}
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-9 w-full rounded-lg bg-muted/30 px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <option value="TZS (Tanzanian Shilling)" className="bg-popover text-popover-foreground">
                    TZS (Tanzanian Shilling)
                  </option>
                  <option value="USD (US Dollar)" className="bg-popover text-popover-foreground">
                    USD (US Dollar)
                  </option>
                  <option value="KES (Kenyan Shilling)" className="bg-popover text-popover-foreground">
                    KES (Kenyan Shilling)
                  </option>
                  <option value="UGX (Ugandan Shilling)" className="bg-popover text-popover-foreground">
                    UGX (Ugandan Shilling)
                  </option>
                </select>

                {/* Amount input */}
                {!letCustomerChoose && (
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required={!letCustomerChoose}
                    className="h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
                  />
                )}

                <p className="text-[0.6875rem] text-muted-foreground">
                  Show the price to the customer in this currency. Settlement still happens in TZS.
                </p>
              </div>
            </div>

            {/* Let customer choose how much to pay */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={letCustomerChoose}
                  onChange={(e) => setLetCustomerChoose(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-xs font-medium text-foreground">
                  Let customer choose how much to pay
                </span>
              </label>
            </div>

            {/* Payment Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <div className="space-y-1">
                <Input
                  placeholder="Payment for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
                />
                <p className="text-[0.6875rem] text-muted-foreground">
                  Shown to the customer on the checkout page.
                </p>
              </div>
            </div>

            {/* Expiry Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Expiry</label>
              <div className="space-y-1">
                <select
                  value={expiryDuration}
                  onChange={(e) => setExpiryDuration(e.target.value)}
                  className="h-9 w-full rounded-lg bg-muted/30 px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <option value="1 hour" className="bg-popover text-popover-foreground">
                    1 hour
                  </option>
                  <option value="6 hours" className="bg-popover text-popover-foreground">
                    6 hours
                  </option>
                  <option value="24 hours" className="bg-popover text-popover-foreground">
                    24 hours
                  </option>
                  <option value="7 days" className="bg-popover text-popover-foreground">
                    7 days
                  </option>
                  <option value="30 days" className="bg-popover text-popover-foreground">
                    30 days
                  </option>
                  <option value="Never" className="bg-popover text-popover-foreground">
                    Never
                  </option>
                </select>
                <p className="text-[0.6875rem] text-muted-foreground">
                  Link will automatically deactivate after this duration.
                </p>
              </div>
            </div>
          </form>

          {/* Drawer Footer with Submit Button & Loading Animation */}
          <SheetFooter className="p-6 pt-4 border-t border-border/60 flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setDrawerOpen(false)}
              className="flex-1 h-9 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-payment-link-form"
              disabled={isSubmitting}
              className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium cursor-pointer relative"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-bounce" />
                </div>
              ) : (
                "Create Link"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
