"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons"
import { Check, ChevronDown, Crown, Gift, Plus, Users } from "lucide-react"

const OPEN_SETTINGS_PANEL_EVENT = "open-settings-panel"

export type WorkspaceSwitcherItem = {
  id: string
  name: string
  initials?: string
  avatarUrl?: string | null
  bgClass?: string
  textClass?: string
}

export function VersionSwitcher({
  workspaces,
  selectedWorkspaceId,
  onSelectedWorkspaceIdChange,
}: {
  workspaces: WorkspaceSwitcherItem[]
  selectedWorkspaceId: string
  onSelectedWorkspaceIdChange: (workspaceId: string) => void
}) {
  const { state, toggleSidebar } = useSidebar()
  const selectedWorkspace =
    workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ??
    workspaces[0]

  if (!selectedWorkspace) {
    return null
  }

  const getWorkspaceFallback = (workspace: WorkspaceSwitcherItem) =>
    workspace.initials ?? workspace.name[0]?.toUpperCase() ?? "W"
  const getWorkspaceIconClasses = (workspace: WorkspaceSwitcherItem) => ({
    bgClass: workspace.bgClass ?? "bg-muted",
    textClass: workspace.textClass ?? "text-foreground",
  })

  const collapsedClasses = getWorkspaceIconClasses(selectedWorkspace)
  const triggerClasses = getWorkspaceIconClasses(selectedWorkspace)

  if (state === "collapsed") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex w-full justify-center py-1">
            <Avatar className="size-7 !rounded-md ring-1 ring-border/60 after:!rounded-md">
              <AvatarImage
                src={selectedWorkspace.avatarUrl ?? undefined}
                alt={`${selectedWorkspace.name} avatar`}
                className="!rounded-md object-cover"
              />
              <AvatarFallback
                className={`!rounded-md text-xs font-semibold ${collapsedClasses.bgClass} ${collapsedClasses.textClass}`}
              >
                {getWorkspaceFallback(selectedWorkspace)}
              </AvatarFallback>
            </Avatar>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu className="h-full">
      <SidebarMenuItem className="h-full">
        <div data-workspace-switcher-scope="true" className="flex h-full items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  data-workspace-switcher-trigger="true"
                  className="inline-flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md pl-0.5 pr-1.5 text-left text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                />
              }
            >
              <Avatar className="size-7 shrink-0 !rounded-md ring-1 ring-border/60 after:!rounded-md">
                <AvatarImage
                  src={selectedWorkspace.avatarUrl ?? undefined}
                  alt={`${selectedWorkspace.name} avatar`}
                  className="!rounded-md object-cover"
                />
                <AvatarFallback
                  className={`!rounded-md text-xs font-semibold ${triggerClasses.bgClass} ${triggerClasses.textClass}`}
                >
                  {getWorkspaceFallback(selectedWorkspace)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-base font-medium">
                {selectedWorkspace.name}
              </span>
              <ChevronDown className="ms-auto size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onSelect={() => onSelectedWorkspaceIdChange(workspace.id)}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Avatar className="size-5 !rounded-[6px] after:!rounded-[6px]">
                      <AvatarImage
                        src={workspace.avatarUrl ?? undefined}
                        alt={`${workspace.name} avatar`}
                        className="!rounded-[6px] object-cover"
                      />
                      <AvatarFallback
                        className={`!rounded-[6px] text-[11px] font-semibold ${
                          getWorkspaceIconClasses(workspace).bgClass
                        } ${getWorkspaceIconClasses(workspace).textClass}`}
                      >
                        {getWorkspaceFallback(workspace)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{workspace.name}</span>
                  </span>
                  {workspace.id === selectedWorkspace.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="h-4 w-4 opacity-80" />
                Create workspace
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="h-4 w-4 opacity-80" />
                Add users to workspace
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  window.dispatchEvent(
                    new CustomEvent(OPEN_SETTINGS_PANEL_EVENT, {
                      detail: { section: "Refer and earn" },
                    })
                  )
                }}
              >
                <Gift className="h-4 w-4 opacity-80" />
                Refer and earn
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Crown className="h-4 w-4 opacity-80" />
                Upgrade plan (soon)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              toggleSidebar()
            }}
            aria-label="Toggle sidebar"
          >
            <HugeiconsIcon
              icon={SidebarLeftIcon}
              strokeWidth={1.5}
              className="size-4 rtl:rotate-180"
            />
          </button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
