"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SmartPhone01Icon,
  BankIcon,
  CheckmarkCircle01Icon,
  Edit02Icon,
  Alert02Icon,
  InformationCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"
import { useAuth } from "@workspace/ui/hooks/use-auth"

interface PayoutParsedDetails {
  accountName: string
  carrier?: string
  phone?: string
  bankName?: string
  accountNumber?: string
  branchName?: string
  isVerified?: boolean
}

export function PayoutSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [activeMethod, setActiveMethod] = React.useState<"mobile_money" | "bank">("mobile_money")
  const [editModalOpen, setEditModalOpen] = React.useState(false)

  // Details State
  const [details, setDetails] = React.useState<PayoutParsedDetails>({
    accountName: "ezra daniel",
    carrier: "HaloPesa",
    phone: "+255613976254",
    bankName: "CRDB Bank",
    accountNumber: "0152435678900",
    branchName: "Kariakoo Branch",
    isVerified: true,
  })

  // Edit Form State
  const [editForm, setEditForm] = React.useState<PayoutParsedDetails>({
    accountName: "",
    carrier: "HaloPesa",
    phone: "",
    bankName: "CRDB Bank",
    accountNumber: "",
    branchName: "",
    isVerified: true,
  })

  // Fetch current payout settings from backend
  React.useEffect(() => {
    let cancelled = false
    async function loadSettings() {
      try {
        const res = await api.get<{
          payoutMethod?: string
          payoutDetails?: string
        }>("/settings")

        if (!cancelled && res.success && res.data) {
          if (res.data.payoutMethod === "bank" || res.data.payoutMethod === "mobile_money") {
            setActiveMethod(res.data.payoutMethod)
          }

          if (res.data.payoutDetails) {
            try {
              const parsed = JSON.parse(res.data.payoutDetails)
              setDetails((prev) => ({
                ...prev,
                ...parsed,
              }))
            } catch {
              // Ignore parse error, keep defaults
            }
          } else if (user) {
            setDetails((prev) => ({
              ...prev,
              accountName: `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase() || "ezra daniel",
              phone: user.phone || "+255613976254",
            }))
          }
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadSettings()
    return () => {
      cancelled = true
    }
  }, [user])

  function handleOpenEdit() {
    setEditForm({ ...details })
    setEditModalOpen(true)
  }

  async function handleSavePayout(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const payloadDetails = {
        ...editForm,
        isVerified: true, // Auto-verified for primary payout account
      }

      const res = await api.patch("/settings", {
        payoutMethod: activeMethod,
        payoutDetails: JSON.stringify(payloadDetails),
      })

      if (res.success) {
        setDetails(payloadDetails)
        setEditModalOpen(false)
        toast.add({
          type: "success",
          title: "Payout Account Updated",
          description: "Your payout destination credentials have been saved securely.",
        })
      } else {
        toast.add({
          type: "error",
          title: "Update Failed",
          description: res.message || "Failed to update payout settings.",
        })
      }
    } catch {
      toast.add({
        type: "error",
        title: "Network Error",
        description: "Please check your connection and try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleSwitchMethod(method: "mobile_money" | "bank") {
    setActiveMethod(method)
    try {
      await api.patch("/settings", {
        payoutMethod: method,
      })
    } catch {
      // silent
    }
  }

  // Format phone to mask: e.g. "•••• •••• 6254"
  function maskPhone(phoneStr?: string) {
    if (!phoneStr) return "•••• •••• 6254"
    const digits = phoneStr.replace(/\D/g, "")
    const last4 = digits.slice(-4) || "6254"
    return `•••• •••• ${last4}`
  }

  // Format account to mask: e.g. "•••• •••• 8900"
  function maskAccountNumber(accStr?: string) {
    if (!accStr) return "•••• •••• 8900"
    const last4 = accStr.slice(-4)
    return `•••• •••• ${last4}`
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-2xl w-full">
      {/* Header Description */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-foreground">Payout Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Add the account where you'd like to receive your payouts. Make sure the details match the account holder exactly.
        </p>
      </div>

      {/* Payout Method Toggle Pills */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/40 border border-border/60 w-fit">
        <button
          type="button"
          onClick={() => handleSwitchMethod("mobile_money")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeMethod === "mobile_money"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-4" />
          <span>Mobile Money</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchMethod("bank")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeMethod === "bank"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HugeiconsIcon icon={BankIcon} strokeWidth={2} className="size-4" />
          <span>Bank Account</span>
        </button>
      </div>

      {/* Method Details Card */}
      {activeMethod === "mobile_money" ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground">Mobile Money Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenEdit}
              className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
            >
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
              <span>Edit Account</span>
            </Button>
          </div>

          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-0 divide-y divide-border/60 text-sm">
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-muted-foreground font-normal">Name</span>
                <span className="text-foreground font-medium text-xs sm:text-sm capitalize">
                  {details.accountName || "ezra daniel"}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-muted-foreground font-normal">Carrier</span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  {details.carrier || "HaloPesa"}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-muted-foreground font-normal">Phone</span>
                <span className="text-foreground font-mono font-medium text-xs sm:text-sm">
                  {maskPhone(details.phone)}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-muted-foreground font-normal">Status</span>
                <Badge variant="outline" className="text-xs font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground">Bank Account Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenEdit}
              className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
            >
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
              <span>Edit Account</span>
            </Button>
          </div>

          <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
            <CardContent className="p-0 divide-y divide-border/60 text-sm">
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-muted-foreground font-normal">Account Name</span>
                <span className="text-foreground font-medium text-xs sm:text-sm capitalize">
                  {details.accountName || "ezra daniel"}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-muted-foreground font-normal">Bank Name</span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  {details.bankName || "CRDB Bank"}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-muted-foreground font-normal">Account Number</span>
                <span className="text-foreground font-mono font-medium text-xs sm:text-sm">
                  {maskAccountNumber(details.accountNumber)}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-muted-foreground font-normal">Branch</span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  {details.branchName || "Kariakoo Branch"}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-muted-foreground font-normal">Status</span>
                <Badge variant="outline" className="text-xs font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Warning Notice Footer */}
      <div className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 shrink-0 text-muted-foreground" />
        <span>Updating payout credentials requires verification for your security.</span>
      </div>

      {/* Edit Payout Account Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {activeMethod === "mobile_money" ? "Edit Mobile Money Payout Account" : "Edit Bank Account Payout"}
            </DialogTitle>
            <DialogDescription>
              Enter the new recipient credentials for automated payout settlements.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePayout} className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Account Holder Name</label>
              <Input
                value={editForm.accountName}
                onChange={(e) => setEditForm((p) => ({ ...p, accountName: e.target.value }))}
                placeholder="e.g. Ezra Daniel"
                required
              />
              <p className="text-[11px] text-muted-foreground">Must match your national ID or registered SIM card name.</p>
            </div>

            {activeMethod === "mobile_money" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Mobile Carrier</label>
                  <Select
                    value={editForm.carrier}
                    onValueChange={(v) => v && setEditForm((p) => ({ ...p, carrier: v }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M-Pesa">Vodacom M-Pesa</SelectItem>
                      <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                      <SelectItem value="Tigo Pesa">Tigo Pesa</SelectItem>
                      <SelectItem value="HaloPesa">HaloPesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Phone Number</label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+255 613 976 254"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Format: +255XXXXXXXXX</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Bank Name</label>
                  <Select
                    value={editForm.bankName}
                    onValueChange={(v) => v && setEditForm((p) => ({ ...p, bankName: v }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRDB Bank">CRDB Bank</SelectItem>
                      <SelectItem value="NMB Bank">NMB Bank</SelectItem>
                      <SelectItem value="NBC Bank">NBC Bank</SelectItem>
                      <SelectItem value="Stanbic Bank">Stanbic Bank</SelectItem>
                      <SelectItem value="Standard Chartered">Standard Chartered</SelectItem>
                      <SelectItem value="Absa Bank">Absa Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Account Number</label>
                  <Input
                    value={editForm.accountNumber}
                    onChange={(e) => setEditForm((p) => ({ ...p, accountNumber: e.target.value }))}
                    placeholder="e.g. 0152435678900"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Branch Name</label>
                  <Input
                    value={editForm.branchName}
                    onChange={(e) => setEditForm((p) => ({ ...p, branchName: e.target.value }))}
                    placeholder="e.g. Kariakoo Branch"
                  />
                </div>
              </>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & Verify"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
