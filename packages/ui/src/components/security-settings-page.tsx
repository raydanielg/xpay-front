"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  LaptopIcon,
  LockPasswordIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/toast"

interface TrustedDevice {
  id: string
  name: string
  browser: string
  os: string
  location: string
  lastActive: string
  isCurrent: boolean
}

export function SecuritySettingsPage() {
  const [trustedDevices, setTrustedDevices] = React.useState<TrustedDevice[]>([])

  function handleRevokeDevice(id: string, name: string) {
    setTrustedDevices((prev) => prev.filter((d) => d.id !== id))
    toast.add({
      type: "success",
      title: "Device Revoked",
      description: `${name} has been removed from your trusted devices.`,
    })
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 max-w-3xl w-full">
      {/* Top Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-foreground">Security</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Manage your security settings to keep your account protected.
        </p>
      </div>

      {/* 1. Trusted Devices */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Trusted Devices</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-foreground">Remembered devices</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Devices that can skip OTP verification when logging in. Devices expire after 7 days of inactivity.
              </p>
            </div>

            {trustedDevices.length === 0 ? (
              <div className="rounded-lg bg-muted/30 border border-border/60 p-4 text-xs text-muted-foreground leading-relaxed">
                No trusted devices. Enable “Remember this device” during login to skip OTP on future sign-ins.
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/60 pt-2">
                {trustedDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                        <HugeiconsIcon icon={LaptopIcon} strokeWidth={2} className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">{device.name}</span>
                          {device.isCurrent && (
                            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                              This device
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {device.browser} on {device.os} • {device.location} • Last active {device.lastActive}
                        </span>
                      </div>
                    </div>

                    {!device.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeDevice(device.id, device.name)}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <HugeiconsIcon icon={TrashIcon} strokeWidth={2} className="size-3.5 mr-1" />
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2. Two-Factor Authentication */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">Two-Factor Authentication</h2>
        <Card className="rounded-xl border border-border/70 overflow-hidden shadow-none">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">OTP verification</h3>
              <Badge variant="outline" className="text-xs font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-3 mr-1" />
                Always on
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              A one-time code is sent to your phone and email on every login from an unrecognized device. This cannot be disabled.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
