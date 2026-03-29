"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AiBrain01Icon,
  AiIdeaIcon,
  ApiIcon,
  Database01Icon,
  Search01Icon,
  WorkflowCircle01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

const quickActions = [
  {
    group: "Navigate",
    label: "AI Core",
    description: "Open your main AI workspace",
    path: "/ai-core",
    icon: AiBrain01Icon,
  },
  {
    group: "Navigate",
    label: "Workflow",
    description: "Open workflow builder and projects",
    path: "/workflow",
    icon: WorkflowCircle01Icon,
  },
  {
    group: "Navigate",
    label: "Skills",
    description: "Browse and manage your skills",
    path: "/skills",
    icon: AiIdeaIcon,
  },
  {
    group: "Workspace",
    label: "My Data",
    description: "View and manage your data sources",
    path: "/my-data",
    icon: Database01Icon,
  },
  {
    group: "Workspace",
    label: "Integrations",
    description: "Connect external tools and services",
    path: "/integrations",
    icon: ApiIcon,
  },
] as const

export function SearchForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const filteredActions = React.useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return quickActions
    return quickActions.filter((action) =>
      [action.label, action.description, action.group].some((value) =>
        value.toLowerCase().includes(term)
      )
    )
  }, [query])

  const runAction = React.useCallback(
    (path: string) => {
      setOpen(false)
      setQuery("")
      router.push(path)
    },
    [router]
  )

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className={cn("relative", className)} {...props}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full justify-start"
        aria-label="Open quick actions"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={1.5}
          className="size-4 shrink-0 text-muted-foreground"
        />
        <span className="truncate text-sm text-foreground/90">Search or run action...</span>
        <Kbd className="ms-auto">⌘K</Kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        showCloseButton={false}
        className="w-[min(620px,94vw)]"
      >
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput
            placeholder="Search or run action..."
            value={query}
            onValueChange={(next) => setQuery(next)}
          />
          <CommandList>
            <CommandEmpty>No actions found.</CommandEmpty>
            {(["Navigate", "Workspace"] as const).map((group) => {
              const groupActions = filteredActions.filter((action) => action.group === group)
              if (groupActions.length === 0) return null

              return (
                <CommandGroup key={group} heading={group}>
                  {groupActions.map((action) => (
                    <CommandItem
                      key={action.path}
                      value={`${action.label} ${action.description} ${action.group}`}
                      onSelect={() => runAction(action.path)}
                      className="gap-2.5"
                    >
                      <HugeiconsIcon icon={action.icon} strokeWidth={1.5} className="size-4 shrink-0" />
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-medium">{action.label}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {action.description}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
