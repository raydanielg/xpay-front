"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SentIcon,
  StarIcon,
  Loading03Icon,
  SparklesIcon,
  CheckmarkCircle02Icon,
  RocketIcon,
  ShieldIcon,
  ChartIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"

type Feedback = {
  id: string
  rating: number
  category: string
  message: string
  status: string
  featureRequests: string | null
  createdAt: string
}

const categoryLabels: Record<string, string> = {
  general: "General",
  feature_request: "Feature Request",
  bug_report: "Bug Report",
  ui_ux: "UI / UX",
  performance: "Performance",
  other: "Other",
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  reviewed: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  addressed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
}

const statusLabels: Record<string, string> = {
  new: "New",
  reviewed: "Reviewed",
  addressed: "Addressed",
}

const recentUpdates = [
  {
    icon: RocketIcon,
    title: "New Dashboard Experience",
    description: "Fresh dashboard with real-time analytics, personalized greetings, and payment trend charts.",
    date: "Aug 2026",
  },
  {
    icon: ShieldIcon,
    title: "Enhanced Security",
    description: "Financial data is now hidden by default. Toggle to reveal sensitive amounts when needed.",
    date: "Aug 2026",
  },
  {
    icon: ChartIcon,
    title: "Payment Trends Chart",
    description: "Visualize your daily payment volume with interactive area charts powered by real data.",
    date: "Aug 2026",
  },
  {
    icon: SparklesIcon,
    title: "Support Tickets via SMS",
    description: "Create support tickets and receive instant SMS confirmations with your ticket reference.",
    date: "Aug 2026",
  },
]

export function FeedbackPage() {
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([])
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [hoverRating, setHoverRating] = React.useState(0)
  const [form, setForm] = React.useState({
    rating: 0,
    category: "general",
    message: "",
  })

  async function fetchFeedbacks() {
    try {
      setLoading(true)
      const res = await api.get<Feedback[]>("/feedback")
      if (res.success && res.data) {
        setFeedbacks(res.data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchFeedbacks()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.rating === 0) {
      toast.add({
        type: "error",
        title: "Rating required",
        description: "Please select a star rating before submitting.",
      })
      return
    }
    if (form.message.trim().length < 10) {
      toast.add({
        type: "error",
        title: "Message too short",
        description: "Please write at least 10 characters.",
      })
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post<Feedback>("/feedback", form)
      if (res.success && res.data) {
        setFeedbacks((prev) => [res.data!, ...prev])
        setForm({ rating: 0, category: "general", message: "" })
        setHoverRating(0)
        toast.add({
          type: "success",
          title: "Feedback submitted",
          description: "Thank you! We appreciate your feedback.",
        })
      } else {
        toast.add({
          type: "error",
          title: "Submission failed",
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
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <HugeiconsIcon icon={SentIcon} strokeWidth={2} className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Feedback</h1>
          <p className="text-sm text-muted-foreground">
            Help us improve XPay. Share your thoughts, report bugs, or request features.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Feedback Form + History */}
        <div className="flex flex-col gap-6">
          {/* Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Share Your Feedback</CardTitle>
              <CardDescription>
                Rate your experience and let us know what you think.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Star Rating */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-foreground">How would you rate XPay?</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, rating: star }))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer rounded-md p-1 transition-transform hover:scale-110"
                      >
                        <HugeiconsIcon
                          icon={StarIcon}
                          strokeWidth={1.5}
                          className={`size-7 transition-colors ${
                            (hoverRating || form.rating) >= star
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/40"
                          }`}
                        />
                      </button>
                    ))}
                    {form.rating > 0 && (
                      <span className="ml-2 text-xs font-medium text-muted-foreground">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
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
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                      <SelectItem value="bug_report">Bug Report</SelectItem>
                      <SelectItem value="ui_ux">UI / UX</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-foreground">Your Message</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us what you think... What can we improve? What do you love?"
                    rows={5}
                    maxLength={2000}
                  />
                  <span className="text-xs text-muted-foreground text-end">
                    {form.message.length}/2000
                  </span>
                </div>

                <Button type="submit" disabled={submitting} className="gap-2 w-full">
                  {submitting ? (
                    <>
                      <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={SentIcon} strokeWidth={2} className="size-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Previous Feedback */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">Your Previous Feedback</h2>

            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <HugeiconsIcon icon={Loading03Icon} strokeWidth={1.5} className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : feedbacks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-2 py-10">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted/50">
                    <HugeiconsIcon icon={SentIcon} strokeWidth={1.5} className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No feedback yet</p>
                  <p className="text-xs text-muted-foreground">Your submitted feedback will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              feedbacks.map((fb) => (
                <Card key={fb.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <HugeiconsIcon
                                key={s}
                                icon={StarIcon}
                                strokeWidth={1.5}
                                className={`size-3.5 ${
                                  fb.rating >= s ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant="outline" className={`text-xs ${statusColors[fb.status] || statusColors.new}`}>
                            {statusLabels[fb.status] || fb.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            {categoryLabels[fb.category] || fb.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground">{fb.message}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(fb.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right: What's New / Recent Updates */}
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="size-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">What&apos;s New in XPay</CardTitle>
                  <CardDescription>Recent updates and improvements we&apos;ve shipped</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {recentUpdates.map((update, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                    <HugeiconsIcon icon={update.icon} strokeWidth={1.5} className="size-4.5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">{update.title}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{update.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{update.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stats card */}
          <Card className="bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={1.5} className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">We listen to your feedback</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Every submission is reviewed by our team. Your input shapes the future of XPay.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
