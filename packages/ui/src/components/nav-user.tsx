"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreVerticalCircle01Icon, UserCircle02Icon, CreditCardIcon, Notification03Icon, Logout01Icon, GraduationCapIcon, BookOpen01Icon, CustomerSupportIcon, PhoneIcon } from "@hugeicons/core-free-icons"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="size-8 rounded-lg grayscale">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-foreground/70">
                {user.email}
              </span>
            </div>
            <HugeiconsIcon icon={MoreVerticalCircle01Icon} strokeWidth={2} className="ms-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={UserCircle02Icon} strokeWidth={2} />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Notification03Icon} strokeWidth={2} />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<a href="/dashboard/academy" />}>
                <HugeiconsIcon icon={GraduationCapIcon} strokeWidth={2} />
                XPay Academy
              </DropdownMenuItem>
              <DropdownMenuItem render={<a href="https://docs.xpay.com" target="_blank" rel="noopener noreferrer" />}>
                <HugeiconsIcon icon={BookOpen01Icon} strokeWidth={2} />
                Docs
              </DropdownMenuItem>
              <DropdownMenuItem render={<a href="/dashboard/support" />}>
                <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={2} />
                Support Ticket
              </DropdownMenuItem>
              <DropdownMenuItem render={<a href="tel:+255699920009" />}>
                <HugeiconsIcon icon={PhoneIcon} strokeWidth={2} />
                +255 699 920 009
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/"
                }
              }}
            >
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
