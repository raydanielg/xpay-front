"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { useAuth } from "@workspace/ui/hooks/use-auth"

export function ProfilePage() {
  const { user } = useAuth()

  function formatMemberSince(dateStr?: string) {
    if (!dateStr) return "23 February 2026"
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return "23 February 2026"
    }
  }

  const fullName = user
    ? `${user.firstName || "Ezra"} ${user.lastName || "Daniel"}`.trim()
    : "Ezra Daniel"

  const email = user?.email || "airezra2@gmail.com"
  const phone = user?.phone || "+255613976254"
  const role = user?.role || "user"

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-3xl w-full">
      {/* Top Header & Notice */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your account details and verification status. Contact support to update your profile information.
        </p>
      </div>

      {/* User Hero Avatar Card */}
      <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none bg-muted/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 sm:size-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl uppercase shrink-0">
              {fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "ED"}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">{fullName}</h2>
              <span className="text-xs sm:text-sm text-muted-foreground truncate">{email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1. Profile Information */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Profile Information</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-0 divide-y divide-border/60 text-sm">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Full Name</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">{fullName}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Email</span>
              <span className="text-foreground font-medium text-xs sm:text-sm font-mono">{email}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Phone</span>
              <span className="text-foreground font-medium text-xs sm:text-sm font-mono">{phone}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Country</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">TZ</span>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Timezone</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">Africa/Dar_es_Salaam</span>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Role</span>
              <Badge variant="outline" className="text-xs font-normal bg-muted/40 text-foreground border-border/60 capitalize">
                {role}
              </Badge>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Member Since</span>
              <span className="text-foreground font-medium text-xs sm:text-sm">
                {formatMemberSince((user as any)?.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Verification Status */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Verification Status</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-0 divide-y divide-border/60 text-sm">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Phone</span>
              <Badge variant="outline" className="text-xs font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
                Verified
              </Badge>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-muted-foreground font-normal">Email</span>
              <Badge variant="outline" className="text-xs font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
                Verified
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
