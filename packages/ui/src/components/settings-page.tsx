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
  CreditCardIcon,
  BankIcon,
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

export type SettingsTab = "api-keys" | "business" | "payment-methods" | "security" | "fees" | "kyc"

interface ApiKeyItem {
  id: string
  name: string
  keyPrefix: string
  fullKey: string
  type: "PUBLIC" | "SECRET" | "LINK"
  environment: "LIVE" | "TEST"
  created: string
  lastUsed: string
}

const initialApiKeys: ApiKeyItem[] = [
  {
    id: "1",
    name: "Live Public Key",
    keyPrefix: "pk_live_",
    fullKey: "pk_live_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d",
    type: "PUBLIC",
    environment: "LIVE",
    created: "20 May 2026",
    lastUsed: "2 mins ago",
  },
  {
    id: "2",
    name: "Live Secret Key",
    keyPrefix: "sk_live_",
    fullKey: "sk_live_1234567890abcdef1234567890abcdef",
    type: "SECRET",
    environment: "LIVE",
    created: "20 May 2026",
    lastUsed: "Just now",
  },
  {
    id: "3",
    name: "Payment Link Key",
    keyPrefix: "lk_live_",
    fullKey: "lk_live_88492019384729103948572910384729",
    type: "LINK",
    environment: "LIVE",
    created: "15 Jun 2026",
    lastUsed: "Today, 11:20",
  },
  {
    id: "4",
    name: "Test Secret Key",
    keyPrefix: "sk_test_",
    fullKey: "sk_test_testkey99887766554433221100aabbccdd",
    type: "SECRET",
    environment: "TEST",
    created: "01 May 2026",
    lastUsed: "Yesterday",
  },
]

export function SettingsPage({ defaultTab = "api-keys" }: { defaultTab?: SettingsTab }) {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>(defaultTab)
  const [apiKeys, setApiKeys] = React.useState<ApiKeyItem[]>(initialApiKeys)
  const [revealedKeys, setRevealedKeys] = React.useState<Record<string, boolean>>({})
  const [keyToRegenerate, setKeyToRegenerate] = React.useState<ApiKeyItem | null>(null)
  const [newKeyModalOpen, setNewKeyModalOpen] = React.useState(false)
  const [newKeyName, setNewKeyName] = React.useState("")
  const [newKeyType, setNewKeyType] = React.useState<"PUBLIC" | "SECRET" | "LINK">("LINK")

  // Business form state
  const [businessName, setBusinessName] = React.useState("SalamaPay Ltd")
  const [supportEmail, setSupportEmail] = React.useState("support@salamapay.com")
  const [supportPhone, setSupportPhone] = React.useState("+255 699 920 009")
  const [currency, setCurrency] = React.useState("TZS (Tanzanian Shilling)")
  const [website, setWebsite] = React.useState("https://salamapay.com")

  // Payment methods state
  const [methods, setMethods] = React.useState({
    mpesa: true,
    airtel: true,
    tigo: true,
    halopesa: true,
    visa: true,
    mastercard: true,
    crdb: true,
    nmb: true,
  })

  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true)
  const [ipWhitelist, setIpWhitelist] = React.useState("197.250.12.44, 41.59.88.10")

  function toggleReveal(id: string) {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function copyKey(fullKey: string, name: string) {
    navigator.clipboard.writeText(fullKey)
    toast.add({
      type: "success",
      title: "Key Copied",
      description: `${name} copied to clipboard. Keep it secure!`,
    })
  }

  function handleConfirmRegenerate() {
    if (!keyToRegenerate) return

    const randHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    const newFullKey = `${keyToRegenerate.keyPrefix}${randHex}${randHex}`

    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === keyToRegenerate.id
          ? { ...k, fullKey: newFullKey, created: "Just now", lastUsed: "Never" }
          : k
      )
    )

    toast.add({
      type: "success",
      title: "Key Regenerated",
      description: `${keyToRegenerate.name} has been rolled. Previous key is now permanently invalid.`,
    })

    setKeyToRegenerate(null)
  }

  function handleCreateNewKey(e: React.FormEvent) {
    e.preventDefault()
    if (!newKeyName) return

    const prefix = newKeyType === "PUBLIC" ? "pk_live_" : newKeyType === "SECRET" ? "sk_live_" : "lk_live_"
    const randHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    const newKey: ApiKeyItem = {
      id: String(Date.now()),
      name: newKeyName,
      keyPrefix: prefix,
      fullKey: `${prefix}${randHex}${randHex}`,
      type: newKeyType,
      environment: "LIVE",
      created: "Today",
      lastUsed: "Never",
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyModalOpen(false)
    setNewKeyName("")
    toast.add({
      type: "success",
      title: "New Key Created",
      description: `${newKeyName} is ready to use.`,
    })
  }

  function saveBusinessProfile(e: React.FormEvent) {
    e.preventDefault()
    toast.add({
      type: "success",
      title: "Profile Saved",
      description: "Business details have been updated.",
    })
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
            {apiKeys.map((item) => {
              const isRevealed = !!revealedKeys[item.id]
              const displayKey = isRevealed
                ? item.fullKey
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
                          item.environment === "LIVE"
                            ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {item.environment}
                      </Badge>
                      <Badge variant="outline" className="text-[0.625rem] font-normal text-muted-foreground">
                        {item.type}
                      </Badge>
                    </div>

                    <div className="text-[0.6875rem] text-muted-foreground">
                      Created {item.created} · Last used: {item.lastUsed}
                    </div>
                  </div>

                  {/* Key Display & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1 flex items-center justify-between rounded-lg bg-background border border-border/70 px-3 py-2 font-mono text-xs text-foreground">
                      <span className="truncate select-all">{displayKey}</span>
                      <div className="flex items-center gap-1.5 pl-2 shrink-0">
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
                        <button
                          type="button"
                          onClick={() => copyKey(item.fullKey, item.name)}
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
          <div>
            <h2 className="text-base font-semibold text-foreground">Business Information</h2>
            <p className="text-xs text-muted-foreground">
              Official company profile displayed on invoices, payment pages, and receipts.
            </p>
          </div>

          <div className="rounded-xl bg-muted/20 p-5 space-y-4">
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
                <label className="text-xs font-medium text-foreground">Support Phone Number</label>
                <Input
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
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

          <Button type="submit" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium px-4 cursor-pointer">
            Save Profile
          </Button>
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

            {/* Visa & Mastercard */}
            <div className="flex items-center justify-between rounded-xl bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Visa & Mastercard</div>
                  <div className="text-[0.6875rem] text-muted-foreground">3D Secure debit & credit cards</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={methods.visa}
                onChange={(e) => setMethods({ ...methods, visa: e.target.checked, mastercard: e.target.checked })}
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
                onChange={(e) => {
                  setTwoFactorEnabled(e.target.checked)
                  toast.add({
                    type: "info",
                    title: "2FA Preference",
                    description: `2FA is now ${e.target.checked ? "enabled" : "disabled"}.`,
                  })
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="text-xs text-muted-foreground">Mobile Money (TZS)</div>
              <div className="text-2xl font-bold text-foreground">2.0%</div>
              <div className="text-[0.6875rem] text-muted-foreground">Per successful transaction</div>
            </div>

            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="text-xs text-muted-foreground">Cards (Visa / Master)</div>
              <div className="text-2xl font-bold text-foreground">2.5%</div>
              <div className="text-[0.6875rem] text-muted-foreground">Local & international cards</div>
            </div>

            <div className="rounded-xl bg-muted/20 p-4 space-y-1">
              <div className="text-xs text-muted-foreground">Bank & Mobile Payouts</div>
              <div className="text-2xl font-bold text-foreground">0.5%</div>
              <div className="text-[0.6875rem] text-muted-foreground">Capped at TSh 5,000 max</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: KYC */}
      {activeTab === "kyc" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Identity & Business Verification</h2>
            <p className="text-xs text-muted-foreground">
              Compliance status and verified identity documentation.
            </p>
          </div>

          <div className="rounded-xl bg-muted/20 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-foreground">Account Fully Verified</div>
                <div className="text-[0.6875rem] text-muted-foreground">
                  Your National ID (NIDA) and TIN certificate have been validated.
                </div>
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

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Key Type</label>
                <select
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value as any)}
                  className="h-9 w-full rounded-lg bg-muted/30 px-3 text-xs font-medium text-foreground outline-none cursor-pointer"
                >
                  <option value="LINK">Payment Link Key (lk_live_)</option>
                  <option value="PUBLIC">Public Key (pk_live_)</option>
                  <option value="SECRET">Secret Key (sk_live_)</option>
                </select>
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
