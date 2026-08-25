"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CustomerSupportIcon,
  PlusIcon,
  Loading03Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
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
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"

type SupportTicket = {
  id: string
  ticketRef: string
  subject: string
  description: string
  category: string
  priority: string
  status: string
  response: string | null
  createdAt: string
}

const statusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  in_progress: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  closed: "bg-muted text-muted-foreground border-border",
}

const statusLabels: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
}

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground border-border",
  medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  urgent: "bg-rose-500/10 text-rose-600 border-rose-500/20",
}

export function SupportTicketPage() {
  const [tickets, setTickets] = React.useState<SupportTicket[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium",
  })

  async function fetchTickets() {
    try {
      setLoading(true)
      const res = await api.get<SupportTicket[]>("/support-tickets")
      if (res.success && res.data) {
        setTickets(res.data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTickets()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.subject.trim().length < 3 || form.description.trim().length < 10) {
      toast.add({
        type: "error",
        title: "Validation error",
        description: "Subject must be 3+ chars and description 10+ chars.",
      })
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post<SupportTicket>("/support-tickets", form)
      if (res.success && res.data) {
        setTickets((prev) => [res.data!, ...prev])
        setForm({ subject: "", description: "", category: "general", priority: "medium" })
        setDialogOpen(false)
        toast.add({
          type: "success",
          title: "Ticket created",
          description: "Your support ticket has been submitted. You'll receive an SMS confirmation.",
        })
      } else {
        toast.add({
          type: "error",
          title: "Failed to create ticket",
          description: res.error || res.message,
        })
      }
    } catch {
      toast.add({
        type: "error",
        title: "Something went wrong",
        description: "Please try again later.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={2} className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Support Tickets</h1>
            <p className="text-sm text-muted-foreground">
              Get help with your account, payments, or technical issues.
            </p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-4" />
                New Ticket
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Fill in the details below and we'll get back to you via SMS and email.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Subject</label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  placeholder="Brief summary of your issue"
                  maxLength={200}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Category</label>
                <Select
                  value={form.category}
                  onValueChange={(val) => val && setForm((p) => ({ ...p, category: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="payout">Payout</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Priority</label>
                <Select
                  value={form.priority}
                  onValueChange={(val) => val && setForm((p) => ({ ...p, priority: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  maxLength={2000}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? (
                    <>
                      <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted/50">
              <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={1.5} className="size-7 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">No support tickets yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a ticket and our team will assist you via SMS.
              </p>
            </div>
            <Button
              className="mt-2 gap-2"
              onClick={() => setDialogOpen(true)}
            >
              <HugeiconsIcon icon={PlusIcon} strokeWidth={2} className="size-4" />
              Create your first ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => {
            const shortRef = ticket.ticketRef.slice(0, 8).toUpperCase()
            return (
              <Card key={ticket.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">#{shortRef}</span>
                        <Badge variant="outline" className={`text-xs ${statusColors[ticket.status] || statusColors.open}`}>
                          {statusLabels[ticket.status] || ticket.status}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${priorityColors[ticket.priority] || priorityColors.medium}`}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-medium">{ticket.subject}</CardTitle>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{ticket.description}</p>
                  {ticket.response && (
                    <div className="mt-3 rounded-lg bg-muted/40 p-3">
                      <p className="text-xs font-medium text-foreground mb-1">Support Response:</p>
                      <p className="text-sm text-muted-foreground">{ticket.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
