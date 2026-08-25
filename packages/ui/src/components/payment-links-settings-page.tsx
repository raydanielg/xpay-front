"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlusSignIcon,
  Search01Icon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Copy01Icon,
  Tick02Icon,
  CheckmarkCircle01Icon,
  Store01Icon,
  Coins01Icon,
  PencilEdit02Icon,
  TrashIcon,
  WhatsappIcon,
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
import { toast } from "@workspace/ui/components/toast"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@workspace/ui/components/dropdown-menu"
import {
  type MerchantProfile,
  profileSlug,
} from "../data/mock-payment-links"
import { api } from "@workspace/ui/lib/api"

interface ApiPaymentPage {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  isActive: boolean
  createdAt: string
}

const allPaymentMethods = [
  { id: "mobile", label: "Mobile Money", color: "bg-emerald-500" },
  { id: "card", label: "Card", color: "bg-violet-500" },
]

function StatusBadge({ status }: { status: MerchantProfile["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
      <span className="size-1.5 rounded-full bg-amber-500" />
      Draft
    </span>
  )
}

export function PaymentLinksSettingsPage() {
  const [profiles, setProfiles] = React.useState<MerchantProfile[]>([])
  const [search, setSearch] = React.useState("")
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editDrawerOpen, setEditDrawerOpen] = React.useState(false)
  const [editingProfile, setEditingProfile] = React.useState<MerchantProfile | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [origin, setOrigin] = React.useState("")

  // Create form state
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [logo, setLogo] = React.useState("")
  const [selectedMethods, setSelectedMethods] = React.useState<string[]>(["mobile"])

  // Edit form state
  const [editName, setEditName] = React.useState("")
  const [editDescription, setEditDescription] = React.useState("")
  const [editLogo, setEditLogo] = React.useState("")
  const [editSelectedMethods, setEditSelectedMethods] = React.useState<string[]>([])
  const [editStatus, setEditStatus] = React.useState<"active" | "draft">("active")

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.add({ type: "error", title: "File too large", description: "Logo must be under 2MB." })
      e.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setter(reader.result as string)
      toast.add({ type: "success", title: "Logo uploaded", description: file.name })
    }
    reader.onerror = () => {
      toast.add({ type: "error", title: "Upload failed", description: "Could not read the file." })
    }
    reader.readAsDataURL(file)
  }

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  // Fetch payment pages from API
  React.useEffect(() => {
    let cancelled = false
    async function fetchPages() {
      setLoading(true)
      try {
        const res = await api.get<ApiPaymentPage[]>("/payment-pages")
        if (!cancelled && res.success && res.data) {
          const pages = Array.isArray(res.data) ? res.data : []
          const mapped: MerchantProfile[] = pages.map((page) => ({
            id: page.id,
            name: page.name,
            slug: page.slug,
            logo: page.logoUrl || "/pay-per-click.png",
            description: page.description || "",
            accentColor: "#10b981",
            paymentMethods: ["Mobile Money"],
            checkoutUrl: `/pay/${page.slug}`,
            status: page.isActive ? "active" : "draft",
            createdAt: new Date(page.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            totalPayments: 0,
            totalRevenue: "TSh 0",
          }))
          setProfiles(mapped)
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchPages()
    return () => { cancelled = true }
  }, [])

  const getCheckoutUrl = React.useCallback(
    (slug: string) => {
      const base = origin || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
      return `${base}/pay/${slug}`
    },
    [origin]
  )

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.includes(search.toLowerCase())
  )

  function toggleMethod(id: string) {
    setSelectedMethods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  function copyLink(url: string, key: string) {
    navigator.clipboard.writeText(url)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey((curr) => (curr === key ? null : curr)), 2000)
    toast.add({ type: "success", title: "Link Copied!", description: "Checkout URL copied to clipboard." })
  }

  function previewProfile(slug: string) {
    window.open(`/pay/${slug}`, "_blank", "noopener,noreferrer")
    toast.add({ type: "info", title: "Opening Preview", description: `Opening /pay/${slug} in a new tab.` })
  }

  function openEdit(profile: MerchantProfile) {
    setEditingProfile(profile)
    setEditName(profile.name)
    setEditDescription(profile.description)
    setEditLogo(profile.logo)
    setEditSelectedMethods(profile.paymentMethods.map((m) => allPaymentMethods.find((pm) => pm.label === m)?.id || m))
    setEditStatus(profile.status)
    setEditDrawerOpen(true)
  }

  function toggleEditMethod(id: string) {
    setEditSelectedMethods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editingProfile || !editName.trim()) return
    setIsSubmitting(true)

    try {
      const res = await api.patch<ApiPaymentPage>(`/payment-pages/${editingProfile.id}`, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        logoUrl: editLogo || undefined,
        isActive: editStatus === "active",
      })

      if (res.success && res.data) {
        const page = res.data
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === editingProfile.id
              ? {
                  ...p,
                  name: page.name,
                  slug: page.slug,
                  logo: page.logoUrl || p.logo,
                  description: page.description || p.description,
                  status: page.isActive ? "active" : "draft",
                }
              : p
          )
        )
        setEditDrawerOpen(false)
        setEditingProfile(null)
        toast.add({ type: "success", title: "Profile Updated", description: `${editName.trim()} has been updated.` })
      } else {
        toast.add({ type: "error", title: "Update failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network error", description: "Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(profile: MerchantProfile) {
    try {
      const res = await api.delete(`/payment-pages/${profile.id}`)
      if (res.success) {
        setProfiles((prev) => prev.filter((p) => p.id !== profile.id))
        setEditDrawerOpen(false)
        setEditingProfile(null)
        toast.add({ type: "success", title: "Profile Deleted", description: `${profile.name} has been removed.` })
      } else {
        toast.add({ type: "error", title: "Delete failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network error", description: "Please try again." })
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setIsSubmitting(true)

    try {
      const slug = profileSlug(name)
      const res = await api.post<ApiPaymentPage>("/payment-pages", {
        name: name.trim(),
        slug,
        description: description.trim() || undefined,
        logoUrl: logo || undefined,
        isActive: true,
      })

      if (res.success && res.data) {
        const page = res.data
        const newProfile: MerchantProfile = {
          id: page.id,
          name: page.name,
          slug: page.slug,
          logo: page.logoUrl || "/pay-per-click.png",
          description: page.description || "",
          accentColor: "#10b981",
          paymentMethods: selectedMethods.map((id) => allPaymentMethods.find((m) => m.id === id)?.label || id),
          checkoutUrl: `/pay/${page.slug}`,
          status: "active",
          createdAt: "Today",
          totalPayments: 0,
          totalRevenue: "TSh 0",
        }
        setProfiles([newProfile, ...profiles])
        setDrawerOpen(false)
        setName("")
        setDescription("")
        setLogo("")
        setSelectedMethods(["mobile"])
        toast.add({ type: "success", title: "Profile Created", description: `${newProfile.name} merchant profile is ready.` })
      } else {
        toast.add({ type: "error", title: "Creation failed", description: res.message || "Please try again." })
      }
    } catch {
      toast.add({ type: "error", title: "Network error", description: "Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Payment Pages</h1>
          <p className="text-sm text-muted-foreground">Create and manage merchant checkout profiles</p>
        </div>
        <Button
          onClick={() => setDrawerOpen(true)}
          className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer shrink-0"
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
          <span>New Profile</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search profiles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-9 pr-4 text-sm"
        />
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 animate-pulse rounded-lg bg-muted" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                      <div className="h-2.5 w-16 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                  <div className="h-5 w-14 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 animate-pulse rounded-lg bg-muted/30" />
                  <div className="h-14 animate-pulse rounded-lg bg-muted/30" />
                </div>
              </div>
            ))
          : filtered.map((profile) => (
          <div
            key={profile.id}
            onClick={() => openEdit(profile)}
            className="group relative rounded-xl border border-border/60 bg-card p-5 space-y-4 transition-all hover:shadow-lg hover:border-primary/40 cursor-pointer active:scale-[0.99]"
          >
            {/* Edit overlay hint */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-primary/0 group-hover:bg-primary/[0.02] transition-colors">
              <span className="flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100 border border-primary/20">
                <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} className="size-3.5" />
                Click to edit
              </span>
            </div>
            {/* Header: Logo + Name + Status */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-lg overflow-hidden border-2"
                  style={{ borderColor: profile.accentColor }}
                >
                  <img src={profile.logo} alt={profile.name} className="size-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{profile.name}</h3>
                  <p className="text-[0.6875rem] text-muted-foreground font-mono">/{profile.slug}</p>
                </div>
              </div>
              <StatusBadge status={profile.status} />
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2">{profile.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="flex items-center gap-1.5 text-[0.625rem] text-muted-foreground">
                  <HugeiconsIcon icon={Coins01Icon} strokeWidth={2} className="size-3" />
                  Revenue
                </div>
                <div className="mt-0.5 text-xs font-bold text-foreground tabular-nums">{profile.totalRevenue}</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="flex items-center gap-1.5 text-[0.625rem] text-muted-foreground">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3" />
                  Payments
                </div>
                <div className="mt-0.5 text-xs font-bold text-foreground tabular-nums">{profile.totalPayments}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-border/40">
              <button
                onClick={(e) => { e.stopPropagation(); previewProfile(profile.slug) }}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} className="size-3.5" />
                Preview
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); copyLink(getCheckoutUrl(profile.slug), `card-${profile.id}`) }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  copiedKey === `card-${profile.id}`
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <HugeiconsIcon icon={copiedKey === `card-${profile.id}` ? Tick02Icon : Copy01Icon} strokeWidth={2} className="size-3.5" />
                {copiedKey === `card-${profile.id}` ? "Copied!" : "Copy link"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const url = getCheckoutUrl(profile.slug)
                  const text = `Pay via ${profile.name}: ${url}`
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer")
                  toast.add({ type: "success", title: "WhatsApp Opened", description: "Share your checkout link via WhatsApp." })
                }}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={WhatsappIcon} strokeWidth={2} className="size-3.5" />
                WhatsApp
              </button>
              <span className="ml-auto text-[0.625rem] text-muted-foreground">{profile.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 py-16 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted/40">
            <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No profiles found</p>
          <p className="mt-1 text-xs text-muted-foreground">Create a new merchant profile to get started.</p>
          <Button
            onClick={() => setDrawerOpen(true)}
            className="mt-4 h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer"
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
            New Profile
          </Button>
        </div>
      )}

      {/* Create Profile Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-s border-border bg-card p-0 shadow-2xl flex flex-col justify-between"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border/60">
            <SheetTitle className="text-base font-semibold">Create Merchant Profile</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Set up a new checkout profile with branding and payment methods.
            </SheetDescription>
          </SheetHeader>

          <form id="create-profile-form" onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Logo Upload */}
            <div className="flex items-center gap-4 rounded-xl bg-muted/20 p-4">
              <label className="group relative flex size-16 items-center justify-center rounded-xl overflow-hidden border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors shrink-0 cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={(e) => handleLogoUpload(e, setLogo)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {logo ? (
                  <img src={logo} alt="Profile logo" className="size-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                    <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-5" />
                    <span className="text-[0.5625rem] font-medium">Upload</span>
                  </div>
                )}
              </label>
              <div className="min-w-0">
                <div className="text-sm font-bold text-foreground truncate">{name || "Your Profile Name"}</div>
                <div className="text-[0.6875rem] text-muted-foreground font-mono truncate">/pay/{name ? profileSlug(name) : "your-slug"}</div>
                <p className="text-[0.625rem] text-muted-foreground mt-0.5">Click the icon to upload a logo (PNG, JPG, SVG — max 2MB)</p>
              </div>
            </div>

            {/* Profile Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Profile Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SalamaPay, My Store..."
                required
                className="h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this profile for?"
                className="h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
              />
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Payment Methods</label>
              <div className="grid grid-cols-2 gap-2">
                {allPaymentMethods.map((method) => {
                  const isSelected = selectedMethods.includes(method.id)
                  const isDisabled = method.id === "card"
                  if (isDisabled) {
                    return (
                      <div
                        key={method.id}
                        className="flex items-center justify-between rounded-lg border border-dashed border-border/40 bg-muted/10 p-2.5 text-xs font-medium text-muted-foreground/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${method.color} opacity-40`} />
                          <span>{method.label}</span>
                        </div>
                        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground/40">Soon</span>
                      </div>
                    )
                  }
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => toggleMethod(method.id)}
                      className={`flex items-center justify-between rounded-lg border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border/60 bg-background text-muted-foreground hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${method.color}`} />
                        <span>{method.label}</span>
                      </div>
                      {isSelected && (
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </form>

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
              form="create-profile-form"
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
                "Create Profile"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Profile Drawer */}
      <Sheet open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-s border-border bg-card p-0 shadow-2xl flex flex-col justify-between"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border/60">
            <SheetTitle className="text-base font-semibold">Edit Merchant Profile</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Update branding, payment methods, and profile status.
            </SheetDescription>
          </SheetHeader>

          <form id="edit-profile-form" onSubmit={handleEditSave} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Logo Upload */}
            <div className="flex items-center gap-4 rounded-xl bg-muted/20 p-4">
              <label className="group relative flex size-16 items-center justify-center rounded-xl overflow-hidden border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors shrink-0 cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={(e) => handleLogoUpload(e, setEditLogo)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {editLogo ? (
                  <img src={editLogo} alt="Profile logo" className="size-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                    <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-5" />
                    <span className="text-[0.5625rem] font-medium">Upload</span>
                  </div>
                )}
              </label>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-foreground truncate">{editName || "Your Profile Name"}</div>
                <div className="text-[0.6875rem] text-muted-foreground font-mono truncate">/pay/{editName ? profileSlug(editName) : "your-slug"}</div>
                <p className="text-[0.625rem] text-muted-foreground mt-0.5">Click the icon to change logo</p>
              </div>
              <StatusBadge status={editStatus} />
            </div>

            {/* Profile Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Profile Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. SalamaPay, My Store..."
                required
                className="h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="What is this profile for?"
                className="h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-between w-full h-9 rounded-lg border border-border/60 bg-background px-3 text-xs font-medium cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${editStatus === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <span className={editStatus === "active" ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}>
                      {editStatus === "active" ? "Active" : "Draft"}
                    </span>
                  </div>
                  <HugeiconsIcon icon={ArrowDownRight01Icon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-40">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setEditStatus("active")}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </div>
                      {editStatus === "active" && (
                        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5 text-emerald-500" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setEditStatus("draft")}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span>Draft</span>
                      </div>
                      {editStatus === "draft" && (
                        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5 text-amber-500" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Payment Methods</label>
              <div className="grid grid-cols-2 gap-2">
                {allPaymentMethods.map((method) => {
                  const isSelected = editSelectedMethods.includes(method.id)
                  const isDisabled = method.id === "card"
                  if (isDisabled) {
                    return (
                      <div
                        key={method.id}
                        className="flex items-center justify-between rounded-lg border border-dashed border-border/40 bg-muted/10 p-2.5 text-xs font-medium text-muted-foreground/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${method.color} opacity-40`} />
                          <span>{method.label}</span>
                        </div>
                        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground/40">Soon</span>
                      </div>
                    )
                  }
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => toggleEditMethod(method.id)}
                      className={`flex items-center justify-between rounded-lg border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border/60 bg-background text-muted-foreground hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${method.color}`} />
                        <span>{method.label}</span>
                      </div>
                      {isSelected && (
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </form>

          <SheetFooter className="p-6 pt-4 border-t border-border/60 flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleDelete(editingProfile!)}
              className="h-9 text-xs font-medium cursor-pointer text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400"
            >
              <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setEditDrawerOpen(false)}
              className="flex-1 h-9 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-profile-form"
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
                "Save Changes"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
