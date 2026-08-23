import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: number
}

export function Logo({ className, showText = true, size = 36 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/pay-per-click.png"
        alt="XPay Logo"
        width={size}
        height={size}
        priority
        className="rounded-lg shadow-sm"
      />
      {showText && (
        <span className="text-xl font-bold tracking-tight">
          X<span className="text-primary">Pay</span>
        </span>
      )}
    </div>
  )
}
