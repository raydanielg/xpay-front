"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlayIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/components/toast"
import { useAuth } from "@workspace/ui/hooks/use-auth"

export function IdentityVerificationPage() {
  const { user } = useAuth()
  const [saving, setSaving] = React.useState(false)

  const [form, setForm] = React.useState({
    firstName: user?.firstName || "Ezra",
    lastName: user?.lastName || "Daniel",
    idType: "nida",
    idNumber: "",
    dob: "",
    gender: "male",
    address: "",
    occupation: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      toast.add({
        type: "success",
        title: "Details submitted",
        description: "Your identity details have been submitted for verification.",
      })
    } catch {
      toast.add({ type: "error", title: "Failed to submit details" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-2xl w-full">
      {/* Top Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-2">
          <a
            href="/dashboard/settings/verification"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
            <span>Back to Verification Overview</span>
          </a>
        </div>
        <h1 className="text-lg font-semibold text-foreground">Identity Verification</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Enter your details so we can verify your identity and get your account fully set up.
        </p>
      </div>

      {/* Guide / Video Banner Card */}
      <Card className="rounded-xl border border-border/70 bg-muted/20 shadow-none overflow-hidden">
        <CardContent className="p-4 flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
              <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-semibold text-foreground">Not sure which documents you need?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A short walkthrough of the accepted ID types, TIN, company papers, and how the photo and selfie checks work.
              </p>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-1 w-fit"
              >
                <HugeiconsIcon icon={PlayIcon} strokeWidth={2} className="size-3.5" />
                <span>Jinsi ya Kuthibitisha Akaunti ya Snippe (KYC) — Nyaraka Zote Unazohitaji</span>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card className="rounded-xl border border-border/70 shadow-none">
          <CardContent className="p-5 flex flex-col gap-4">
            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">First Name</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Last Name</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* ID Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Select ID type</label>
              <Select
                value={form.idType}
                onValueChange={(v) => v && setForm((p) => ({ ...p, idType: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nida">National ID Card (NIDA)</SelectItem>
                  <SelectItem value="voters_card">Voter's Card</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driving_licence">Driving Licence</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Choose the identification document you'll verify with.
              </p>
            </div>

            {/* ID Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">ID Number</label>
              <Input
                value={form.idNumber}
                onChange={(e) => setForm((p) => ({ ...p, idNumber: e.target.value }))}
                placeholder="As shown on your document"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Enter the number exactly as shown on your ID document.
              </p>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Date of Birth</label>
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))}
                placeholder="01/01/0001"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Must match the date on your ID document.
              </p>
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Select gender</label>
              <Select
                value={form.gender}
                onValueChange={(v) => v && setForm((p) => ({ ...p, gender: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Residential Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Residential Address</label>
              <Input
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="e.g. Kariakoo, Dar es Salaam"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Your current residential address.
              </p>
            </div>

            {/* Occupation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Occupation</label>
              <Input
                value={form.occupation}
                onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
                placeholder="e.g. Retail trader"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Your current occupation or profession.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving} className="gap-2 h-10 px-6 cursor-pointer">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />
            {saving ? "Submitting..." : "Submit for Verification"}
          </Button>
        </div>
      </form>
    </div>
  )
}
