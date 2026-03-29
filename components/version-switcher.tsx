"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons"
import { Check, ChevronDown, Crown, Plus, Users } from "lucide-react"

export function VersionSwitcher({
  workspaces,
  defaultWorkspace,
}: {
  workspaces: string[]
  defaultWorkspace: string
}) {
  const WORKSPACE_LOGOS: Record<
    string,
    { label: string; bgClass: string; textClass: string }
  > = {
    Documentation: {
      label: "D",
      bgClass: "bg-sky-500/20",
      textClass: "text-sky-700 dark:text-sky-300",
    },
    Product: {
      label: "P",
      bgClass: "bg-indigo-500/20",
      textClass: "text-indigo-700 dark:text-indigo-300",
    },
    Operations: {
      label: "O",
      bgClass: "bg-emerald-500/20",
      textClass: "text-emerald-700 dark:text-emerald-300",
    },
    Marketing: {
      label: "M",
      bgClass: "bg-amber-500/20",
      textClass: "text-amber-700 dark:text-amber-300",
    },
  }
  const [selectedWorkspace, setSelectedWorkspace] = React.useState(defaultWorkspace)
  const { state, toggleSidebar } = useSidebar()
  const selectedWorkspaceLogo = WORKSPACE_LOGOS[selectedWorkspace] ?? {
    label: selectedWorkspace[0] ?? "W",
    bgClass: "bg-muted",
    textClass: "text-foreground",
  }

  if (state === "collapsed") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex w-full justify-center py-1">
            <div
              className={`flex aspect-square size-7 items-center justify-center rounded-md ${selectedWorkspaceLogo.bgClass} ${selectedWorkspaceLogo.textClass}`}
            >
              <span className="text-xs font-semibold">{selectedWorkspaceLogo.label}</span>
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu className="h-full">
      <SidebarMenuItem className="h-full">
        <div className="flex h-full items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="inline-flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 text-left text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                />
              }
            >
              <div
                className={`flex aspect-square size-7 shrink-0 items-center justify-center rounded-md ${selectedWorkspaceLogo.bgClass} ${selectedWorkspaceLogo.textClass}`}
              >
                <span className="text-xs font-semibold">{selectedWorkspaceLogo.label}</span>
              </div>
              <span className="truncate text-base font-medium">{selectedWorkspace}</span>
              <ChevronDown className="ms-auto size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace}
                  onSelect={() => setSelectedWorkspace(workspace)}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex size-5 items-center justify-center rounded-[6px] text-[11px] font-semibold ${
                        (WORKSPACE_LOGOS[workspace]?.bgClass ?? "bg-muted")
                      } ${
                        (WORKSPACE_LOGOS[workspace]?.textClass ?? "text-foreground")
                      }`}
                    >
                      {(WORKSPACE_LOGOS[workspace]?.label ?? workspace[0] ?? "W")}
                    </span>
                    <span>{workspace}</span>
                  </span>
                  {workspace === selectedWorkspace && <Check className="h-4 w-4 text-primary" />}
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
              <DropdownMenuItem>
                <Crown className="h-4 w-4 opacity-80" />
                Upgrade plan
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
