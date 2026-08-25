"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Store01Icon,
  CheckmarkCircle01Icon,
  Edit02Icon,
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

export function BusinessSettingsPage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)

  const [form, setForm] = React.useState({
    businessType: "Sole Proprietor",
    businessName: "Zerixa Technologies",
    industry: "Cybersecurity",
    website: "https://zerixa.co.tz",
    supportEmail: "support@zerixa.co.tz",
    currency: "TZS",
  })

  const [editForm, setEditForm] = React.useState({ ...form })

  React.useEffect(() => {
    let cancelled = false
    async function loadSettings() {
      try {
        const res = await api.get<{
          businessName?: string
          supportEmail?: string
          currency?: string
        }>("/settings")
        if (!cancelled && res.success && res.data) {
          const nextData = {
            businessType: "Sole Proprietor",
            businessName: res.data?.businessName || user?.businessName || "Zerixa Technologies",
            industry: "Cybersecurity",
            website: "https://zerixa.co.tz",
            supportEmail: res.data?.supportEmail || "support@zerixa.co.tz",
            currency: res.data?.currency || "TZS",
          }
          setForm(nextData)
          setEditForm(nextData)
        }
      } catch {
        // silent
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
    setEditForm({ ...form })
    setEditModalOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.patch("/settings", {
        businessName: editForm.businessName,
        supportEmail: editForm.supportEmail,
        currency: editForm.currency,
      })
      if (res.success) {
        setForm({ ...editForm })
        setEditModalOpen(false)
        if (refreshUser) await refreshUser()
        toast.add({
          type: "success",
          title: "Business Details Updated",
          description: "Your registered company information has been saved.",
        })
      } else {
        toast.add({
          type: "error",
          title: "Save Failed",
          description: res.message || "Failed to update business profile.",
        })
      }
    } catch {
      toast.add({ type: "error", title: "Network error. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-3xl w-full">
      {/* Top Header & Subtitle */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-foreground">Business Information</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your registered company information.
        </p>
      </div>

      {/* Business Details Card */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted-foreground">Business Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenEdit}
            className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
          >
            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-3.5" />
            <span>Edit Information</span>
          </Button>
        </div>

        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-0 divide-y divide-border/60 text-sm">
            {/* Business Type */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Business Type</span>
              <Badge variant="outline" className="text-xs font-normal bg-muted/40 text-foreground border-border/60">
                {form.businessType}
              </Badge>
            </div>

            {/* Business Name */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Business Name</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">{form.businessName}</span>
            </div>

            {/* Industry */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Industry</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">{form.industry}</span>
            </div>

            {/* Website */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Website</span>
              <a
                href={form.website}
                target="_blank"
                rel="noreferrer"
                className="text-foreground font-medium text-xs sm:text-sm hover:underline"
              >
                {form.website}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Business Information Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Business Information</DialogTitle>
            <DialogDescription>
              Update your registered merchant company details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Business Legal Name</label>
              <Input
                value={editForm.businessName}
                onChange={(e) => setEditForm((p) => ({ ...p, businessName: e.target.value }))}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Business Type</label>
              <Select
                value={editForm.businessType}
                onValueChange={(v) => v && setEditForm((p) => ({ ...p, businessType: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Business Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sole Proprietor">Sole Proprietor</SelectItem>
                  <SelectItem value="Registered Company">Registered Company</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="NGO / Non-Profit">NGO / Non-Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Industry / Sector</label>
              <Input
                value={editForm.industry}
                onChange={(e) => setEditForm((p) => ({ ...p, industry: e.target.value }))}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Official Website</label>
              <Input
                value={editForm.website}
                onChange={(e) => setEditForm((p) => ({ ...p, website: e.target.value }))}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Customer Support Email</label>
              <Input
                type="email"
                value={editForm.supportEmail}
                onChange={(e) => setEditForm((p) => ({ ...p, supportEmail: e.target.value }))}
                required
              />
            </div>

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
                  <>
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
