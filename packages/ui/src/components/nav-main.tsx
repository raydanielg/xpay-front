"use client"

import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

export interface SubItem {
  title: string
  url: string
  isActive?: boolean
}

export interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  badge?: string
  subItems?: SubItem[]
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export function NavMain({
  sections,
}: {
  sections: NavSection[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        {sections.map((section, sectionIndex) => {
          const hasActiveItem = section.items.some(
            (item) =>
              item.isActive ||
              (item.subItems?.some((sub) => sub.isActive) ?? false)
          )
          return (
            <Collapsible
              key={section.label}
              defaultOpen={sectionIndex === 0 || hasActiveItem}
              className="group/section border-b border-sidebar-border/60 last:border-0"
            >
              {/* Section Header - Clickable */}
              <CollapsibleTrigger
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-xs font-semibold tracking-wide text-foreground/80 transition-colors hover:bg-muted/50 hover:text-foreground cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                <span>{section.label}</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="size-3.5 transition-transform duration-200 group-data-[expanded]/section:rotate-180"
                />
              </CollapsibleTrigger>

              {/* Section Items */}
              <CollapsibleContent>
                <SidebarMenu className="mt-0.5">
                  {section.items.map((item) => {
                    const hasSubItems =
                      item.subItems && item.subItems.length > 0
                    if (hasSubItems) {
                      return (
                        <Collapsible
                          key={item.title}
                          defaultOpen={item.isActive}
                          className="group/collapsible"
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger
                              render={
                                <SidebarMenuButton
                                  tooltip={item.title}
                                  isActive={item.isActive}
                                />
                              }
                            >
                              {item.icon}
                              <span>{item.title}</span>
                              {item.badge && (
                                <span className="ml-auto text-[0.625rem] font-medium text-muted-foreground">
                                  {item.badge}
                                </span>
                              )}
                              <HugeiconsIcon
                                icon={ArrowDown01Icon}
                                strokeWidth={2}
                                className="ml-auto size-3.5 text-muted-foreground transition-transform duration-200 group-data-[expanded]/collapsible:rotate-180"
                              />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.subItems!.map((sub) => (
                                  <SidebarMenuSubItem key={sub.title}>
                                    <SidebarMenuSubButton
                                      render={<a href={sub.url} />}
                                      isActive={sub.isActive}
                                    >
                                      <span>{sub.title}</span>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      )
                    }
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={item.isActive}
                          render={<a href={item.url} />}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto text-[0.625rem] font-medium text-muted-foreground">
                              {item.badge}
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
