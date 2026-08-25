"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Key01Icon,
  Store01Icon,
  ShieldUserIcon,
  Wallet01Icon,
  Coins01Icon,
  LockPasswordIcon,
  Copy01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  RefreshIcon,
  CheckmarkCircle01Icon,
  PlusSignIcon,
  Alert02Icon,
  SmartPhone01Icon,
  BankIcon,
  UserCircleIcon,
  Camera01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"

export type SettingsTab = "api-keys" | "business" | "payment-methods" | "security" | "fees" | "kyc"

interface ApiKeyItem {
  id: string
  name: string
  keyPrefix: string
  fullKey?: string
  isActive: boolean
  createdAt: string
  lastUsedAt: string | null
}

interface ApiKeyCreateResponse {
  id: string
  name: string
  key: string
  keyPrefix: string
  isActive: boolean
  createdAt: string
}

interface UserSettings {
  businessName: string | null
  businessLogo: string | null
  supportEmail: string | null
  currency: string
  payoutMethod: string
  payoutDetails: string | null
  notifications: boolean
  twoFactorAuth: boolean
  webhookUrl: string | null
}

export function SettingsPage({ defaultTab = "api-keys" }: { defaultTab?: SettingsTab }) {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>(defaultTab)
  const [apiKeys, setApiKeys] = React.useState<ApiKeyItem[]>([])
  const [keysLoading, setKeysLoading] = React.useState(true)
  const [revealedKeys, setRevealedKeys] = React.useState<Record<string, boolean>>({})
  const [keyToRegenerate, setKeyToRegenerate] = React.useState<ApiKeyItem | null>(null)
  const [newKeyModalOpen, setNewKeyModalOpen] = React.useState(false)
  const [newKeyName, setNewKeyName] = React.useState("")
  const [newlyCreatedKey, setNewlyCreatedKey] = React.useState<string | null>(null)

  // Business form state
  const [businessName, setBusinessName] = React.useState("")
  const [supportEmail, setSupportEmail] = React.useState("")
  const [currency, setCurrency] = React.useState("TZS (Tanzanian Shilling)")
  const [website, setWebsite] = React.useState("")
  const [settingsLoading, setSettingsLoading] = React.useState(true)
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)
  const [accountType, setAccountType] = React.useState("normal")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Payment methods state
  const [methods, setMethods] = React.useState({
    mpesa: true,
    airtel: true,
    tigo: true,
    halopesa: true,
    crdb: true,
    nmb: true,
  })

  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false)
  const [ipWhitelist, setIpWhitelist] = React.useState("")

  // Fetch API keys
  React.useEffect(() => {
    let cancelled = false
    async function fetchKeys() {
      setKeysLoading(true)
      try {
        const res = await api.get<ApiKeyItem[]>("/api-keys")
        if (!cancelled && res.success && res.data) {
          setApiKeys(Array.isArray(res.data) ? res.data : [])
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setKeysLoading(false)
      }
    }
    fetchKeys()
    return () => { cancelled = true }
  }, [])

  // Fetch settings
  React.useEffect(() => {
    let cancelled = false
    async function fetchSettings() {
      setSettingsLoading(true)
      try {
        const res = await api.get<UserSettings>("/settings")
        if (!cancelled && res.success && res.data) {
          const s = res.data
          setBusinessName(s.businessName || "")
          setSupportEmail(s.supportEmail || "")
          setCurrency(s.currency || "TZS (Tanzanian Shilling)")
          setTwoFactorEnabled(s.twoFactorAuth || false)
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setSettingsLoading(false)
      }
    }
    fetchSettings()
    return () => { cancelled = true }
  }, [])

  function toggleReveal(id: string) {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function copyKey(key: string, name: string) {
    navigator.clipboard.writeText(key)
    toast.add({
      type: "success",
      title: "Key Copied",
      description: `${name} copied to clipboard. Keep it secure!`,
    })
  }

  async function handleConfirmRegenerate() {
    if (!keyToRegenerate) return

    try {
      // Delete old key
      await api.delete(`/api-keys/${keyToRegenerate.id}`)

      // Create new key with same name
      const res = await api.post<ApiKeyCreateResponse>("/api-keys", {
        name: keyToRegenerate.name,
      })

      if (res.success && res.data) {
        const newKey = res.data
        setApiKeys((prev) => [
          {
            id: newKey.id,
            name: newKey.name,
            keyPrefix: newKey.keyPrefix,
            fullKey: newKey.key,
            isActive: newKey.isActive,
            createdAt: newKey.createdAt,
            lastUsedAt: null,
          },
          ...prev.filter((k) => k.id !== keyToRegenerate.id),
        ])
        setNewlyCreatedKey(newKey.key)
        toast.add({
          type: "success",
          title: "Key Regenerated",
          description: `${keyToRegenerate.name} has been rolled. Save the new key securely — it won't be shown again.`,
        })
      } else {
        toast.add({
          type: "error",
          title: "Regeneration failed",
          description: res.message || "Please try again.",
        })
      }
    } catch {
      toast.add({
        type: "error",
        title: "Regeneration failed",
        description: "Network error. Please try again.",
      })
    }

    setKeyToRegenerate(null)
  }

  async function handleCreateNewKey(e: React.FormEvent) {
    e.preventDefault()
    if (!newKeyName) return

    try {
      const res = await api.post<ApiKeyCreateResponse>("/api-keys", {
        name: newKeyName,
      })

      if (res.success && res.data) {
        const newKey = res.data
        setApiKeys((prev) => [
          {
            id: newKey.id,
            name: newKey.name,
            keyPrefix: newKey.keyPrefix,
            fullKey: newKey.key,
            isActive: newKey.isActive,
            createdAt: newKey.createdAt,
            lastUsedAt: null,
          },
          ...prev,
        ])
        setNewlyCreatedKey(newKey.key)
        setNewKeyModalOpen(false)
        setNewKeyName("")
        toast.add({
          type: "success",
          title: "New Key Created",
          description: `${newKey.name} is ready. Save the key securely — it won't be shown again.`,
        })
      } else {
        toast.add({
          type: "error",
          title: "Creation failed",
          description: res.message || "Please try again.",
        })
      }
    } catch {
      toast.add({
        type: "error",
        title: "Creation failed",
        description: "Network error. Please try again.",
      })
    }
  }

  async function saveBusinessProfile(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await api.patch<UserSettings>("/settings", {
        businessName: businessName.trim() || undefined,
        supportEmail: supportEmail.trim() || undefined,
        currency: currency.split(" ")[0],
      })
      if (res.success) {
        toast.add({
          type: "success",
          title: "Profile Saved",
          description: "Business details have been updated.",
        })
      } else {
        toast.add({
          type: "error",
          title: "Save failed",
          description: res.message || "Please try again.",
        })
      }
    } catch {
      toast.add({
        type: "error",
        title: "Network error",
        description: "Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6 max-w-5xl">
      {/* Settings Title Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Settings & Developer</h1>
        <p className="text-sm text-muted-foreground">
          Manage API keys, merchant configuration, payment channels, and security.
        </p>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-muted/30 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("api-keys")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "api-keys"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <HugeiconsIcon icon={Key01Icon} strokeWidth={2} className="size-3.5" />
          <span>API & Link Keys</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("business")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "business"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-3.5" />
          <span>Business</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payment-methods")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "payment-methods"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} className="size-3.5" />
          <span>Payment Methods</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} className="size-3.5" />
          <span>Security</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("fees")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "fees"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <HugeiconsIcon icon={Coins01Icon} strokeWidth={2} className="size-3.5" />
          <span>Fees</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("kyc")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "kyc"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <HugeiconsIcon icon={ShieldUserIcon} strokeWidth={2} className="size-3.5" />
          <span>KYC</span>
        </button>
      </div>

      {/* TAB 1: API & LINK KEYS */}
      {activeTab === "api-keys" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">API & Payment Link Keys</h2>
              <p className="text-xs text-muted-foreground">
                Authenticate requests and embed payment links into your applications securely.
              </p>
            </div>
            <Button
              onClick={() => setNewKeyModalOpen(true)}
              className="h-9 gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-xs font-medium cursor-pointer shrink-0"
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
              <span>Generate Key</span>
            </Button>
          </div>

          {/* Keys List */}
          <div className="space-y-3">
            {keysLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted/20 p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
                  </div>
                ))
              : apiKeys.length === 0
              ? (
                <div className="rounded-xl border border-dashed border-border/60 py-12 text-center">
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-muted/40">
                    <HugeiconsIcon icon={Key01Icon} strokeWidth={2} className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No API keys yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Generate a key to start integrating XPay.</p>
                </div>
              )
              : apiKeys.map((item) => {
                const isRevealed = !!revealedKeys[item.id]
                const displayKey = item.fullKey
                  ? isRevealed
                    ? item.fullKey
                    : `${item.keyPrefix}${"•".repeat(24)}`
                  : `${item.keyPrefix}${"•".repeat(24)}`

                return (
                  <div
                    key={item.id}
                    className="rounded-xl bg-muted/20 p-4 sm:p-5 transition-all hover:bg-muted/30 space-y-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{item.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-[0.625rem] font-semibold tracking-wider ${
                            item.isActive
                              ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "text-rose-600 dark:text-rose-400 border-rose-500/20"
                          }`
                        }>
                          {item.isActive ? "ACTIVE" : "REVOKED"}
                        </Badge>
                      </div>

                      <div className="text-[0.6875rem] text-muted-foreground">
                        Created {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        {item.lastUsedAt ? ` · Last used: ${new Date(item.lastUsedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}` : " · Never used"}
                      </div>
                    </div>

                    {/* Key Display & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1 flex items-center justify-between rounded-lg bg-background border border-border/70 px-3 py-2 font-mono text-xs text-foreground">
                        <span className="truncate select-all">{displayKey}</span>
                        <div className="flex items-center gap-1.5 pl-2 shrink-0">
                          {item.fullKey && (
                            <button
                              type="button"
                              onClick={() => toggleReveal(item.id)}
                              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title={isRevealed ? "Hide key" : "Show key"}
                            >
                              <HugeiconsIcon
                                icon={isRevealed ? ViewOffSlashIcon : ViewIcon}
                                strokeWidth={2}
                                className="size-3.5"
                              />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => copyKey(item.fullKey || item.keyPrefix, item.name)}
                            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            title="Copy key"
                          >
                            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Regenerate Key Button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setKeyToRegenerate(item)}
                        className="h-9 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-border/80 cursor-pointer rounded-lg shrink-0"
                      >
                        <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-3.5" />
                        <span>Roll Key</span>
                      </Button>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* TAB 2: BUSINESS PROFILE */}
      {activeTab === "business" && (
        <form onSubmit={saveBusinessProfile} className="space-y-6">
          <div className="text-center">
            <h2 className="text-base font-semibold text-foreground">Business Information</h2>
            <p className="text-xs text-muted-foreground">
              Official company profile displayed on invoices, payment pages, and receipts.
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="size-24 rounded-full overflow-hidden border-2 border-border/60 bg-muted/30 flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="size-full object-cover" />
                ) : (
                  <HugeiconsIcon icon={User02Icon} strokeWidth={1.5} className="size-10 text-muted-foreground" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <HugeiconsIcon icon={Camera01Icon} strokeWidth={2} className="size-6 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      setAvatarUrl(ev.target?.result as string)
                      toast.add({ type: "success", title: "Avatar Updated", description: "Profile picture has been updated." })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 text-xs font-medium rounded-lg cursor-pointer gap-1.5"
              >
                <HugeiconsIcon icon={Camera01Icon} strokeWidth={2} className="size-3.5" />
                <span>Upload Avatar</span>
              </Button>
              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setAvatarUrl(null); toast.add({ type: "info", title: "Avatar Removed", description: "Profile picture has been removed." }) }}
                  className="h-8 text-xs font-medium rounded-lg cursor-pointer text-muted-foreground"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Account Type */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Account Type</label>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[0.625rem] font-semibold bg-blue-500/10 text-blue-600 border-blue-500/20 px-3 py-1"
              >
                Normal Account
              </Badge>
              <span className="text-[0.625rem] text-muted-foreground">Business & Elite coming soon</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="max-w-2xl mx-auto w-full rounded-xl bg-muted/20 p-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Business Legal Name</label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="h-9 text-xs bg-background border border-border/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Customer Support Email</label>
                <Input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="h-9 text-xs bg-background border border-border/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Official Website</label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="h-9 text-xs bg-background border border-border/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Default Settlement Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-9 w-full rounded-lg bg-background border border-border/80 px-3 text-xs font-medium text-foreground outline-none cursor-pointer"
                >
                  <option>TZS (Tanzanian Shilling)</option>
                  <option>USD (US Dollar)</option>
                  <option>KES (Kenyan Shilling)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium px-6 cursor-pointer">
              Save Profile
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: PAYMENT METHODS */}
      {activeTab === "payment-methods" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Accepted Payment Channels</h2>
            <p className="text-xs text-muted-foreground">
              Enable or disable payment rails available to your buyers at checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* M-Pesa */}
            <div className="flex items-center justify-between rounded-xl bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Vodacom M-Pesa</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Direct USSD STK Push</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={methods.mpesa}
                onChange={(e) => setMethods({ ...methods, mpesa: e.target.checked })}
                className="size-4 rounded accent-primary cursor-pointer"
              />
            </div>

            {/* Airtel Money */}
            <div className="flex items-center justify-between rounded-xl bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Airtel Money</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Direct USSD STK Push</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={methods.airtel}
                onChange={(e) => setMethods({ ...methods, airtel: e.target.checked })}
                className="size-4 rounded accent-primary cursor-pointer"
              />
            </div>

            {/* Tigo Pesa */}
            <div className="flex items-center justify-between rounded-xl bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Tigo Pesa (Mix by Yas)</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Direct USSD STK Push</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={methods.tigo}
                onChange={(e) => setMethods({ ...methods, tigo: e.target.checked })}
                className="size-4 rounded accent-primary cursor-pointer"
              />
            </div>

            {/* Halopesa */}
            <div className="flex items-center justify-between rounded-xl bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Halopesa</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Direct USSD STK Push</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={methods.halopesa}
                onChange={(e) => setMethods({ ...methods, halopesa: e.target.checked })}
                className="size-4 rounded accent-primary cursor-pointer"
              />
            </div>

            {/* Bank Transfer */}
            <div className="flex items-center justify-between rounded-xl bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <HugeiconsIcon icon={BankIcon} strokeWidth={2} className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">CRDB & NMB Bank</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Automated virtual bank accounts</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={methods.crdb}
                onChange={(e) => setMethods({ ...methods, crdb: e.target.checked, nmb: e.target.checked })}
                className="size-4 rounded accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Security & Access Control</h2>
            <p className="text-xs text-muted-foreground">
              Protect your account funds, API keys, and set whitelisted IP ranges.
            </p>
          </div>

          <div className="rounded-xl bg-muted/20 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <div className="text-xs font-semibold text-foreground">Two-Factor Authentication (2FA)</div>
                <div className="text-[0.6875rem] text-muted-foreground">
                  Require OTP verification code on sensitive actions and payouts.
                </div>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={async (e) => {
                  setTwoFactorEnabled(e.target.checked)
                  try {
                    await api.patch("/settings", { twoFactorAuth: e.target.checked })
                    toast.add({
                      type: "info",
                      title: "2FA Preference",
                      description: `2FA is now ${e.target.checked ? "enabled" : "disabled"}.`,
                    })
                  } catch {
                    toast.add({ type: "error", title: "Update failed", description: "Could not save 2FA preference." })
                  }
                }}
                className="size-4 rounded accent-primary cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-medium text-foreground">API IP Whitelist</label>
              <Input
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder="Comma separated IPs..."
                className="h-9 text-xs bg-background border border-border/80 font-mono"
              />
              <p className="text-[0.6875rem] text-muted-foreground">
                Only server requests originating from these IP addresses can invoke the Secret Key.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FEES */}
      {activeTab === "fees" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Pricing & Fee Schedule</h2>
            <p className="text-xs text-muted-foreground">
              Transparent, pay-as-you-go pricing for all payment rails and instant settlements.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="text-xs text-muted-foreground">Mobile Money (TZS)</div>
              <div className="text-2xl font-bold text-foreground">2.0%</div>
              <div className="text-[0.6875rem] text-muted-foreground">Per successful transaction</div>
            </div>

            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="text-xs text-muted-foreground">Bank & Mobile Payouts</div>
              <div className="text-2xl font-bold text-foreground">0.5%</div>
              <div className="text-[0.6875rem] text-muted-foreground">Capped at TSh 5,000 max</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: KYC / VERIFICATION OVERVIEW */}
      {activeTab === "kyc" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-base font-semibold text-foreground">Verification Overview</h2>
            <p className="text-xs text-muted-foreground">
              Your account verification status and compliance details.
            </p>
          </div>

          {/* Verification Status Banner */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">Account Fully Verified</div>
                <div className="text-xs text-muted-foreground">
                  All required documents have been validated.
                </div>
              </div>
              <Badge variant="outline" className="ml-auto text-[0.625rem] font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1">
                Verified
              </Badge>
            </div>
          </div>

          {/* Details Grid */}
          <div className="max-w-2xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Business Name */}
            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Store01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
                <span className="text-[0.6875rem] font-medium text-muted-foreground">Business Name</span>
              </div>
              <p className="text-xs font-semibold text-foreground">{businessName || "Not set"}</p>
            </div>

            {/* Account Type */}
            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={UserCircleIcon} strokeWidth={2} className="size-4 text-muted-foreground" />
                <span className="text-[0.6875rem] font-medium text-muted-foreground">Account Type</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[0.625rem] font-semibold bg-blue-500/10 text-blue-600 border-blue-500/20">
                  Normal
                </Badge>
              </div>
            </div>

            {/* Support Email */}
            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
                <span className="text-[0.6875rem] font-medium text-muted-foreground">Support Email</span>
              </div>
              <p className="text-xs font-semibold text-foreground">{supportEmail || "Not set"}</p>
            </div>

            {/* Member Since */}
            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
                <span className="text-[0.6875rem] font-medium text-muted-foreground">Member Since</span>
              </div>
              <p className="text-xs font-semibold text-foreground">Aug 2026</p>
            </div>

            {/* National ID (NIDA) */}
            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={ShieldUserIcon} strokeWidth={2} className="size-4 text-muted-foreground" />
                <span className="text-[0.6875rem] font-medium text-muted-foreground">National ID (NIDA)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Verified</span>
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            {/* TIN Certificate */}
            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={ShieldUserIcon} strokeWidth={2} className="size-4 text-muted-foreground" />
                <span className="text-[0.6875rem] font-medium text-muted-foreground">TIN Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Verified</span>
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="rounded-xl bg-muted/20 p-5 space-y-3">
              <h3 className="text-xs font-semibold text-foreground">Verification Checklist</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Email address verified", done: true },
                  { label: "Phone number verified", done: true },
                  { label: "National ID (NIDA) validated", done: true },
                  { label: "TIN certificate validated", done: true },
                  { label: "Business profile completed", done: !!businessName },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`flex size-5 items-center justify-center rounded-full ${item.done ? "bg-emerald-500/15" : "bg-muted"}`}>
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        strokeWidth={2}
                        className={`size-3.5 ${item.done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                      />
                    </div>
                    <span className={`text-xs ${item.done ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate / Roll Key Confirmation Alert Dialog */}
      <AlertDialog
        open={!!keyToRegenerate}
        onOpenChange={(open) => !open && setKeyToRegenerate(null)}
      >
        <AlertDialogContent className="max-w-md rounded-2xl bg-card border shadow-2xl p-6">
          <AlertDialogHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-5" />
            </div>
            <AlertDialogTitle className="text-base font-semibold">
              Regenerate {keyToRegenerate?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to roll this key? The current key will be immediately deactivated, and any integrated system or payment links using it will stop working until updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 pt-4">
            <AlertDialogCancel
              onClick={() => setKeyToRegenerate(null)}
              className="flex-1 h-9 text-xs font-medium cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRegenerate}
              className="flex-1 h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-medium cursor-pointer"
            >
              Roll Key Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create New Key Modal */}
      {newKeyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setNewKeyModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Create New Key</h2>
              <p className="text-xs text-muted-foreground">
                Generate a new API key or Payment Link key for your integrations.
              </p>
            </div>

            <form onSubmit={handleCreateNewKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Key Name / Identifier</label>
                <Input
                  placeholder="e.g. Website Checkout Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  required
                  className="h-9 text-xs bg-muted/20 border-0 focus-visible:ring-1"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewKeyModalOpen(false)}
                  className="flex-1 h-9 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium cursor-pointer"
                >
                  Create Key
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
