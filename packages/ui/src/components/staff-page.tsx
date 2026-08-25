"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroupIcon,
  PlusIcon,
  Loading03Icon,
  TrashIcon,
  Edit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
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

type StaffMember = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  isVerified: boolean
  createdAt: string
  staffProfile: {
    id: string
    staffRole: string
    permissions: string
    isActive: boolean
  } | null
}

const allPermissions = [
  { id: "payments.view", label: "View Payments" },
  { id: "payments.manage", label: "Manage Payments" },
  { id: "payouts.view", label: "View Payouts" },
  { id: "payouts.manage", label: "Manage Payouts" },
  { id: "users.view", label: "View Users" },
  { id: "users.manage", label: "Manage Users" },
  { id: "support.view", label: "View Support Tickets" },
  { id: "support.manage", label: "Manage Support Tickets" },
  { id: "reports.view", label: "View Reports" },
  { id: "settings.view", label: "View Settings" },
  { id: "settings.manage", label: "Manage Settings" },
  { id: "api_keys.manage", label: "Manage API Keys" },
]

const staffRoleLabels: Record<string, string> = {
  staff: "Staff",
  support: "Support",
  finance: "Finance",
  developer: "Developer",
  manager: "Manager",
}

const staffRoleColors: Record<string, string> = {
  staff: "bg-muted text-muted-foreground border-border",
  support: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  finance: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  developer: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  manager: "bg-amber-500/10 text-amber-600 border-amber-500/20",
}

export function StaffPage() {
  const [staff, setStaff] = React.useState<StaffMember[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editTarget, setEditTarget] = React.useState<StaffMember | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const [createForm, setCreateForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    staffRole: "staff",
    permissions: [] as string[],
  })

  const [editForm, setEditForm] = React.useState({
    staffRole: "staff",
    permissions: [] as string[],
    isActive: true,
  })

  async function fetchStaff() {
    try {
      setLoading(true)
      const res = await api.get<StaffMember[]>("/staff")
      if (res.success && res.data) {
        setStaff(res.data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchStaff()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post<StaffMember>("/staff", {
        ...createForm,
        phone: createForm.phone || undefined,
      })
      if (res.success && res.data) {
        setStaff((prev) => [res.data!, ...prev])
        setCreateForm({ firstName: "", lastName: "", email: "", password: "", phone: "", staffRole: "staff", permissions: [] })
        setCreateOpen(false)
        toast.add({ type: "success", title: "Staff member created", description: `${res.data.firstName} has been added as staff.` })
      } else {
        toast.add({ type: "error", title: "Failed to create staff", description: res.error || res.message })
      }
    } catch {
      toast.add({ type: "error", title: "Something went wrong", description: "Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  function openEdit(member: StaffMember) {
    setEditTarget(member)
    setEditForm({
      staffRole: member.staffProfile?.staffRole || "staff",
      permissions: member.staffProfile ? JSON.parse(member.staffProfile.permissions || "[]") : [],
      isActive: member.staffProfile?.isActive ?? true,
    })
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editTarget) return
    setSubmitting(true)
    try {
      const res = await api.patch<StaffMember>(`/staff/${editTarget.id}`, editForm)
      if (res.success) {
        await fetchStaff()
        setEditTarget(null)
        toast.add({ type: "success", title: "Staff updated", description: "Permissions and role updated successfully." })
      } else {
        toast.add({ type: "error", title: "Update failed", description: res.error || res.message })
      }
    } catch {
      toast.add({ type: "error", title: "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name} from staff? This cannot be undone.`)) return
    try {
      const res = await api.delete(`/staff/${id}`)
      if (res.success) {
        setStaff((prev) => prev.filter((s) => s.id !== id))
        toast.add({ type: "success", title: "Staff removed", description: `${name} has been removed.` })
      } else {
        toast.add({ type: "error", title: "Failed to remove", description: res.error })
      }
    } catch {
      toast.add({ type: "error", title: "Something went wrong" })
    }
  }

  function togglePermission(list: string[], perm: string): string[] {
    return list.includes(perm) ? list.filter((p) => p !== perm) : [...list, perm]
  }

  const filtered = staff.filter((s) => {
    const q = search.toLowerCase()
    return s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
  })

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Staff Management</h1>
            <p className="text-sm text-muted-foreground">Manage team members, roles, and permissions.</p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => setCreateOpen(true)}>
          <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-4" />
          Add Staff
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staff..."
          className="pl-9"
        />
      </div>

      {/* Staff List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted/50">
              <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.5} className="size-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No staff members yet</p>
            <p className="text-xs text-muted-foreground">Add team members and assign them roles and permissions.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((member) => {
            const perms = member.staffProfile ? JSON.parse(member.staffProfile.permissions || "[]") : []
            return (
              <Card key={member.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {member.firstName} {member.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {member.staffProfile && (
                            <Badge variant="outline" className={`text-xs ${staffRoleColors[member.staffProfile.staffRole] || staffRoleColors.staff}`}>
                              {staffRoleLabels[member.staffProfile.staffRole] || member.staffProfile.staffRole}
                            </Badge>
                          )}
                          {member.staffProfile?.isActive ? (
                            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">Inactive</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{perms.length} permissions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(member)}>
                        <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(member.id, `${member.firstName} ${member.lastName}`)}>
                        <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>Create a new staff account with specific roles and permissions.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">First Name</label>
                <Input value={createForm.firstName} onChange={(e) => setCreateForm((p) => ({ ...p, firstName: e.target.value }))} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Last Name</label>
                <Input value={createForm.lastName} onChange={(e) => setCreateForm((p) => ({ ...p, lastName: e.target.value }))} required />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Email</label>
              <Input type="email" value={createForm.email} onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Password</label>
                <Input type="password" value={createForm.password} onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))} required minLength={8} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Phone (optional)</label>
                <Input value={createForm.phone} onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Staff Role</label>
              <Select value={createForm.staffRole} onValueChange={(v) => v && setCreateForm((p) => ({ ...p, staffRole: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium">Permissions</label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 max-h-40 overflow-y-auto">
                {allPermissions.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={createForm.permissions.includes(perm.id)}
                      onCheckedChange={() => setCreateForm((p) => ({ ...p, permissions: togglePermission(p.permissions, perm.id) }))}
                    />
                    <span className="text-xs">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? <><HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />Creating...</> : "Create Staff"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              {editTarget && `Update role and permissions for ${editTarget.firstName} ${editTarget.lastName}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Staff Role</label>
              <Select value={editForm.staffRole} onValueChange={(v) => v && setEditForm((p) => ({ ...p, staffRole: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium">Permissions</label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 max-h-40 overflow-y-auto">
                {allPermissions.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={editForm.permissions.includes(perm.id)}
                      onCheckedChange={() => setEditForm((p) => ({ ...p, permissions: togglePermission(p.permissions, perm.id) }))}
                    />
                    <span className="text-xs">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={editForm.isActive} onCheckedChange={(v) => setEditForm((p) => ({ ...p, isActive: !!v }))} />
              <span className="text-xs font-medium">Active (can log in)</span>
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditTarget(null)} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? <><HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />Saving...</> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
