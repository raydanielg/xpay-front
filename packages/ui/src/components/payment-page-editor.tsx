"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InternetIcon,
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Loading03Icon,
  Search01Icon,
  Copy01Icon,
  ShoppingBag01Icon,
  Globe02Icon,
  Image02Icon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"

type Product = {
  id: string
  name: string
  price: number
  category?: string
  isActive: boolean
}

type PaymentGateway = {
  id: string
  name: string
  description: string
  isDefault: boolean
}

type PageFormData = {
  name: string
  slug: string
  description: string
  displayName: string
  logoUrl: string
  gatewayId: string
  selectedProductIds: string[]
  collectCustomerInfo: boolean
  collectName: boolean
  collectPhone: boolean
  collectEmail: boolean
  collectNotes: boolean
  requireShipping: boolean
  allowQuantity: boolean
  successMessage: string
  successRedirectUrl: string
  themeColor: string
  isActive: boolean
}

const GATEWAYS: PaymentGateway[] = [
  { id: "salamapay", name: "Salamapay", description: "Default payment gateway — supports mobile money, cards, and bank transfers in Tanzania.", isDefault: true },
  { id: "selcom", name: "Selcom", description: "Alternative gateway — supports mobile money and card payments via Selcom API.", isDefault: false },
  { id: "stripe", name: "Stripe", description: "International gateway — supports credit/debit cards globally.", isDefault: false },
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function PaymentPageEditor({ pageId, onBack }: { pageId?: string; onBack?: () => void }) {
  const [loading, setLoading] = React.useState(!!pageId)
  const [saving, setSaving] = React.useState(false)
  const [products, setProducts] = React.useState<Product[]>([])
  const [productSearch, setProductSearch] = React.useState("")
  const [slugEdited, setSlugEdited] = React.useState(false)
  const [showGatewayInfo, setShowGatewayInfo] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("content")

  const [form, setForm] = React.useState<PageFormData>({
    name: "",
    slug: "",
    description: "",
    displayName: "",
    logoUrl: "",
    gatewayId: "salamapay",
    selectedProductIds: [],
    collectCustomerInfo: true,
    collectName: true,
    collectPhone: true,
    collectEmail: false,
    collectNotes: false,
    requireShipping: false,
    allowQuantity: true,
    successMessage: "Thank you for your payment!",
    successRedirectUrl: "",
    themeColor: "#0066ff",
    isActive: true,
  })

  React.useEffect(() => {
    fetchProducts()
    if (pageId) fetchPage()
  }, [pageId])

  async function fetchProducts() {
    try {
      const res = await api.get<Product[]>("/products")
      if (res.success && res.data) setProducts(res.data)
    } catch { /* silent — products may not exist yet */ }
  }

  async function fetchPage() {
    try {
      const res = await api.get<any>(`/payment-pages/${pageId}`)
      if (res.success && res.data) {
        const p = res.data
        setForm({
          name: p.name || "",
          slug: p.slug || "",
          description: p.description || "",
          displayName: p.displayName || p.name || "",
          logoUrl: p.logoUrl || "",
          gatewayId: p.gatewayId || "salamapay",
          selectedProductIds: p.selectedProductIds || [],
          collectCustomerInfo: p.collectCustomerInfo ?? true,
          collectName: p.collectName ?? true,
          collectPhone: p.collectPhone ?? true,
          collectEmail: p.collectEmail ?? false,
          collectNotes: p.collectNotes ?? false,
          requireShipping: p.requireShipping ?? false,
          allowQuantity: p.allowQuantity ?? true,
          successMessage: p.successMessage || "Thank you for your payment!",
          successRedirectUrl: p.successRedirectUrl || "",
          themeColor: p.themeColor || "#0066ff",
          isActive: p.isActive ?? true,
        })
        setSlugEdited(true)
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  function updateForm<K extends keyof PageFormData>(key: K, value: PageFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleNameChange(name: string) {
    updateForm("name", name)
    if (!slugEdited) {
      updateForm("slug", slugify(name))
    }
    if (!form.displayName) {
      updateForm("displayName", name)
    }
  }

  function handleSlugChange(slug: string) {
    setSlugEdited(true)
    updateForm("slug", slugify(slug))
  }

  function toggleProduct(productId: string) {
    setForm((prev) => ({
      ...prev,
      selectedProductIds: prev.selectedProductIds.includes(productId)
        ? prev.selectedProductIds.filter((id) => id !== productId)
        : [...prev.selectedProductIds, productId],
    }))
  }

  function copyUrl() {
    const url = `snippe.me/pay/${form.slug}`
    navigator.clipboard.writeText(`https://${url}`)
    toast.add({ type: "success", title: "URL copied", description: url })
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.add({ type: "error", title: "Name required", description: "Please enter a page name." })
      return
    }
    if (!form.slug.trim()) {
      toast.add({ type: "error", title: "Slug required", description: "Please enter a URL slug." })
      return
    }

    setSaving(true)
    try {
      if (pageId) {
        const res = await api.patch(`/payment-pages/${pageId}`, form)
        if (res.success) {
          toast.add({ type: "success", title: "Page updated", description: "Your changes have been saved." })
        } else {
          toast.add({ type: "error", title: "Update failed", description: res.error || res.message })
        }
      } else {
        const res = await api.post<any>("/payment-pages", form)
        if (res.success && res.data) {
          toast.add({ type: "success", title: "Page created", description: `${form.name} is now live.` })
          if (onBack) onBack()
        } else {
          toast.add({ type: "error", title: "Creation failed", description: res.error || res.message })
        }
      }
    } catch {
      toast.add({ type: "error", title: "Something went wrong" })
    }
    finally { setSaving(false) }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const selectedProducts = products.filter((p) => form.selectedProductIds.includes(p.id))

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon-sm" onClick={onBack}>
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {pageId ? "Edit Payment Page" : "New Payment Page"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {pageId ? form.name : "Create a hosted page to accept payments"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={copyUrl} disabled={!form.slug}>
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-4" />
            Copy URL
          </Button>
          <Button size="sm" className="gap-2" onClick={handleSave} disabled={saving}>
            {saving ? (
              <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
            ) : (
              <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />
            )}
            {pageId ? "Save Changes" : "Create Page"}
          </Button>
        </div>
      </div>

      {/* URL Preview */}
      {form.slug && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
          <HugeiconsIcon icon={Globe02Icon} strokeWidth={1.5} className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Payment URL:</span>
          <span className="text-sm font-mono font-medium text-foreground">
            snippe.me/pay/<span className="text-primary">{form.slug}</span>
          </span>
          <button onClick={copyUrl} className="ml-auto text-muted-foreground hover:text-primary transition-colors">
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="checkout">Checkout</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="flex flex-col gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Page Information</CardTitle>
              <CardDescription>Basic details about your payment page.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Page Name <span className="text-destructive">*</span></label>
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="My Store"
                  required
                />
                <p className="text-[11px] text-muted-foreground">This is the name customers see on your payment page.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">URL Slug <span className="text-destructive">*</span></label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center flex-1 rounded-md border border-input bg-input/20 overflow-hidden">
                    <span className="px-3 py-2 text-xs text-muted-foreground border-r border-input bg-muted/30 whitespace-nowrap">snippe.me/pay/</span>
                    <input
                      className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                      value={form.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="my-store"
                      required
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">The unique URL for your payment page. Only lowercase letters, numbers, and hyphens.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Display Name</label>
                <Input
                  value={form.displayName}
                  onChange={(e) => updateForm("displayName", e.target.value)}
                  placeholder="My Store"
                />
                <p className="text-[11px] text-muted-foreground">Shown as the heading on the payment page. Defaults to page name.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="A brief description shown on your payment page..."
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Logo URL</label>
                <Input
                  value={form.logoUrl}
                  onChange={(e) => updateForm("logoUrl", e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-[11px] text-muted-foreground">Upload your logo to media library and paste the URL here.</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Gateway */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Payment Gateway</CardTitle>
              <CardDescription>Choose how you want to accept payments on this page.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Select value={form.gatewayId} onValueChange={(v) => v && updateForm("gatewayId", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GATEWAYS.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}{g.isDefault ? " (default)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {GATEWAYS.find((g) => g.id === form.gatewayId) && (
                <div className="rounded-lg bg-muted/40 px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">
                    {GATEWAYS.find((g) => g.id === form.gatewayId)!.description}
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowGatewayInfo(!showGatewayInfo)}
                className="flex items-center gap-1.5 text-xs text-primary hover:underline self-start"
              >
                <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-3.5" />
                What's the difference?
              </button>

              {showGatewayInfo && (
                <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
                  {GATEWAYS.map((g) => (
                    <div key={g.id} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{g.name}</span>
                        {g.isDefault && <Badge variant="outline" className="text-[10px] py-0 px-1.5">Default</Badge>}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{g.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="flex flex-col gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Select Products</CardTitle>
              <CardDescription>Choose which products customers can purchase on this page.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="relative w-full">
                <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9"
                />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-lg border-2 border-dashed border-border">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted/50">
                    <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.5} className="size-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">No products available</p>
                    <p className="text-xs text-muted-foreground mt-1">Add products from the Products tab to select them here.</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-4" />
                    Add Product
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <Checkbox
                        checked={form.selectedProductIds.includes(product.id)}
                        onCheckedChange={() => toggleProduct(product.id)}
                      />
                      <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-foreground truncate">{product.name}</span>
                          {product.category && (
                            <span className="text-xs text-muted-foreground">{product.category}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">TSh {product.price.toLocaleString()}</span>
                          {!product.isActive && <Badge variant="outline" className="text-[10px]">Inactive</Badge>}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedProducts.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""} selected
                    </span>
                    <button
                      onClick={() => updateForm("selectedProductIds", [])}
                      className="text-xs text-destructive hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProducts.map((p) => (
                      <Badge key={p.id} variant="outline" className="gap-1.5 py-1">
                        {p.name}
                        <button onClick={() => toggleProduct(p.id)} className="text-muted-foreground hover:text-destructive">
                          <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Checkout Tab */}
        <TabsContent value="checkout" className="flex flex-col gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Customer Information</CardTitle>
              <CardDescription>Collect extra information from customers at checkout (name, phone, notes, etc.).</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Collect customer information</span>
                  <span className="text-xs text-muted-foreground">Ask customers for their details at checkout</span>
                </div>
                <Switch
                  checked={form.collectCustomerInfo}
                  onCheckedChange={(v) => updateForm("collectCustomerInfo", !!v)}
                />
              </label>

              {form.collectCustomerInfo && (
                <div className="flex flex-col gap-1 pl-4 border-l-2 border-border ml-2">
                  {[
                    { key: "collectName", label: "Full name" },
                    { key: "collectPhone", label: "Phone number" },
                    { key: "collectEmail", label: "Email address" },
                    { key: "collectNotes", label: "Order notes" },
                  ].map((field) => (
                    <label key={field.key} className="flex items-center gap-3 py-1.5 cursor-pointer">
                      <Checkbox
                        checked={form[field.key as keyof PageFormData] as boolean}
                        onCheckedChange={() => updateForm(field.key as keyof PageFormData, !form[field.key as keyof PageFormData] as boolean)}
                      />
                      <span className="text-sm text-foreground">{field.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Checkout Options</CardTitle>
              <CardDescription>Configure how checkout works on your page.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Allow quantity selection</span>
                  <span className="text-xs text-muted-foreground">Let customers choose how many of each product to buy</span>
                </div>
                <Switch
                  checked={form.allowQuantity}
                  onCheckedChange={(v) => updateForm("allowQuantity", !!v)}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Require shipping address</span>
                  <span className="text-xs text-muted-foreground">Ask customers for a shipping address at checkout</span>
                </div>
                <Switch
                  checked={form.requireShipping}
                  onCheckedChange={(v) => updateForm("requireShipping", !!v)}
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">After Payment</CardTitle>
              <CardDescription>What happens after a successful payment.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Success Message</label>
                <Textarea
                  value={form.successMessage}
                  onChange={(e) => updateForm("successMessage", e.target.value)}
                  placeholder="Thank you for your payment!"
                  rows={2}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Success Redirect URL (optional)</label>
                <Input
                  value={form.successRedirectUrl}
                  onChange={(e) => updateForm("successRedirectUrl", e.target.value)}
                  placeholder="https://yoursite.com/thank-you"
                />
                <p className="text-[11px] text-muted-foreground">Customers will be redirected here after successful payment. Leave empty to show success message only.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design" className="flex flex-col gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Appearance</CardTitle>
              <CardDescription>Customize how your payment page looks.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.themeColor}
                    onChange={(e) => updateForm("themeColor", e.target.value)}
                    className="size-10 rounded-lg border border-input cursor-pointer"
                  />
                  <Input
                    value={form.themeColor}
                    onChange={(e) => updateForm("themeColor", e.target.value)}
                    className="max-w-[120px] font-mono"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Used for buttons, headers, and accents on your payment page.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20">
                    {form.logoUrl ? (
                      <img src={form.logoUrl} alt="Logo" className="size-full object-contain rounded-lg" />
                    ) : (
                      <HugeiconsIcon icon={Image02Icon} strokeWidth={1.5} className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Input
                      value={form.logoUrl}
                      onChange={(e) => updateForm("logoUrl", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-[11px] text-muted-foreground">Paste your logo URL or upload from Media Library.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="flex flex-col gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Page Status</CardTitle>
              <CardDescription>Control whether your page is accessible.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Page is active</span>
                  <span className="text-xs text-muted-foreground">When active, customers can access and pay through this page</span>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => updateForm("isActive", !!v)}
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for this page.</CardDescription>
            </CardHeader>
            <CardContent>
              {pageId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => {
                    if (confirm(`Delete "${form.name}"? This cannot be undone."`)) {
                      api.delete(`/payment-pages/${pageId}`).then(() => {
                        toast.add({ type: "success", title: "Page deleted" })
                        if (onBack) onBack()
                      })
                    }
                  }}
                >
                  <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-4" />
                  Delete Page
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom action bar */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
        {onBack && (
          <Button variant="outline" onClick={onBack}>Cancel</Button>
        )}
        <Button className="gap-2" onClick={handleSave} disabled={saving}>
          {saving ? (
            <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />
          )}
          {pageId ? "Save Changes" : "Create Page"}
        </Button>
      </div>
    </div>
  )
}
