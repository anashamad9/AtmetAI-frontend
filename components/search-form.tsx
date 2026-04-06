"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import {
  Bell,
  Bot,
  CreditCard,
  Database,
  FolderKanban,
  Globe2,
  KeyRound,
  Layers,
  Languages,
  LockKeyhole,
  Mail,
  MessageSquare,
  Palette,
  Puzzle,
  Shield,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const OPEN_MANAGE_CHAT_USERS_EVENT = "open-manage-chat-users"
const OPEN_SETTINGS_PANEL_EVENT = "open-settings-panel"

const sectors = ["Data", "Chats", "Projects", "Users", "Settings"] as const
type QuickActionSector = (typeof sectors)[number]
type QuickActionTab = "All" | QuickActionSector
const quickActionTabs: Array<{
  id: QuickActionTab
  label: string
  icon: React.ComponentType<React.ComponentProps<"svg">>
}> = [
  { id: "All", label: "All", icon: Layers },
  { id: "Data", label: "Data", icon: Database },
  { id: "Chats", label: "Chats", icon: MessageSquare },
  { id: "Projects", label: "Projects", icon: FolderKanban },
  { id: "Users", label: "Users", icon: Users },
  { id: "Settings", label: "Settings", icon: Settings },
]
const settingsSections = [
  "Account",
  "Workspace",
  "General",
  "Notifications",
  "Members",
  "Usage and limits",
  "Data controls",
  "Plans (soon)",
  "Billing",
  "Help Docs",
  "Contact Support",
] as const
type SettingsSection = (typeof settingsSections)[number]

type OpenSettingsPanelDetail = {
  section?: SettingsSection
  memberId?: string
  memberQuery?: string
  membersAction?: "invite"
}

type QuickAction = {
  id: string
  parentId?: string
  level: 0 | 1 | 2
  sector: QuickActionSector
  label: string
  description: string
  path?: string
  icon: React.ComponentType<React.ComponentProps<"svg">>
  eventName?: string
  eventDetail?: OpenSettingsPanelDetail
  keywords?: string[]
}

const dataQuickActions: QuickAction[] = [
  {
    id: "data-manage",
    level: 0,
    sector: "Data",
    label: "Manage Data",
    description: "Open data workspace and sources.",
    path: "/my-data",
    icon: Database,
  },
  {
    id: "data-search",
    parentId: "data-manage",
    level: 1,
    sector: "Data",
    label: "Search Data",
    description: "Open files, records, and uploads in My Data.",
    path: "/my-data",
    icon: Database,
  },
  {
    id: "data-integrations",
    parentId: "data-manage",
    level: 1,
    sector: "Data",
    label: "Integrations",
    description: "Manage connected tools and synced sources.",
    path: "/integrations",
    icon: Puzzle,
  },
]

const chatQuickActions: QuickAction[] = [
  {
    id: "chats-manage",
    level: 0,
    sector: "Chats",
    label: "Manage Chats",
    description: "Open AI Core conversations.",
    path: "/ai-core",
    icon: MessageSquare,
  },
  {
    id: "chats-open",
    parentId: "chats-manage",
    level: 1,
    sector: "Chats",
    label: "Open Chats",
    description: "Go to AI Core conversations.",
    path: "/ai-core",
    icon: MessageSquare,
  },
  {
    id: "chats-users",
    parentId: "chats-manage",
    level: 1,
    sector: "Chats",
    label: "Manage Chat Users",
    description: "Open participant management in AI Core.",
    path: "/ai-core",
    icon: Users,
    eventName: OPEN_MANAGE_CHAT_USERS_EVENT,
  },
]

const projectQuickActions: QuickAction[] = [
  {
    id: "projects-manage",
    level: 0,
    sector: "Projects",
    label: "Manage Projects",
    description: "Open workflow projects and builders.",
    path: "/workflow",
    icon: FolderKanban,
  },
  {
    id: "projects-workflow",
    parentId: "projects-manage",
    level: 1,
    sector: "Projects",
    label: "Workflow Builder",
    description: "Create and manage workflow automations.",
    path: "/workflow",
    icon: FolderKanban,
  },
  {
    id: "projects-skills",
    parentId: "projects-manage",
    level: 1,
    sector: "Projects",
    label: "Skills",
    description: "Browse and manage workflow skills.",
    path: "/skills",
    icon: Bot,
  },
]

const userQuickActionRoots: QuickAction[] = [
  {
    id: "users-manage",
    level: 0,
    sector: "Users",
    label: "Manage Users",
    description: "Open members and permissions in settings.",
    icon: Users,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Members" },
  },
  {
    id: "users-add",
    level: 0,
    sector: "Users",
    label: "Add New User",
    description: "Open invite flow in members settings.",
    icon: Users,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Members", membersAction: "invite" },
    keywords: ["invite", "add member", "new user", "create user"],
  },
]

const settingsRootAction: QuickAction = {
  id: "settings-manage",
  level: 0,
  sector: "Settings",
  label: "Manage Settings",
  description: "Open workspace settings.",
  icon: Settings,
  eventName: OPEN_SETTINGS_PANEL_EVENT,
  eventDetail: { section: "General" },
}

const settingsSectionQuickActions: QuickAction[] = settingsSections.map(
  (section) => ({
    id: `settings-section-${section.toLowerCase().replace(/\s+/g, "-")}`,
    parentId: "settings-manage",
    level: 1,
    sector: "Settings",
    label: section,
    description: `Open ${section.toLowerCase()} settings.`,
    icon: Settings,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section },
  })
)

const settingsNestedQuickActions: QuickAction[] = [
  {
    id: "settings-password",
    parentId: "settings-section-account",
    level: 2,
    sector: "Settings",
    label: "Change Password",
    description: "Account > Security. Update your login password.",
    icon: LockKeyhole,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Account" },
    keywords: ["password", "security", "change password", "login"],
  },
  {
    id: "settings-email-login",
    parentId: "settings-section-account",
    level: 2,
    sector: "Settings",
    label: "Email and Login",
    description: "Account > Email and login preferences.",
    icon: Mail,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Account" },
    keywords: ["email", "signin", "authentication"],
  },
  {
    id: "settings-theme-colors",
    parentId: "settings-section-general",
    level: 2,
    sector: "Settings",
    label: "Theme and Colors",
    description: "General > Appearance controls.",
    icon: Palette,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "General" },
    keywords: ["theme", "dark mode", "light mode", "colors"],
  },
  {
    id: "settings-font-size",
    parentId: "settings-section-general",
    level: 2,
    sector: "Settings",
    label: "Font Size",
    description: "General > Typography scale.",
    icon: SlidersHorizontal,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "General" },
    keywords: ["font", "text size", "size"],
  },
  {
    id: "settings-timezone",
    parentId: "settings-section-general",
    level: 2,
    sector: "Settings",
    label: "Time Zone",
    description: "General > Time and locale setup.",
    icon: Globe2,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "General" },
    keywords: ["timezone", "time zone", "region"],
  },
  {
    id: "settings-language",
    parentId: "settings-section-general",
    level: 2,
    sector: "Settings",
    label: "Language",
    description: "General > Language preferences.",
    icon: Languages,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "General" },
    keywords: ["language", "locale", "translation"],
  },
  {
    id: "settings-notifications",
    parentId: "settings-section-notifications",
    level: 2,
    sector: "Settings",
    label: "Notification Preferences",
    description: "Notifications > Email and push controls.",
    icon: Bell,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Notifications" },
    keywords: ["alerts", "notify", "email notifications", "push"],
  },
  {
    id: "settings-roles",
    parentId: "settings-section-members",
    level: 2,
    sector: "Settings",
    label: "Roles and Permissions",
    description: "Members > Access control settings.",
    icon: Shield,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Members" },
    keywords: ["permissions", "roles", "access"],
  },
  {
    id: "settings-invite-members",
    parentId: "settings-section-members",
    level: 2,
    sector: "Settings",
    label: "Invite Members",
    description: "Members > Invite team users.",
    icon: Users,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Members" },
    keywords: ["invite", "add member", "team"],
  },
  {
    id: "settings-limits",
    parentId: "settings-section-usage-and-limits",
    level: 2,
    sector: "Settings",
    label: "Rate Limits and Quotas",
    description: "Usage and limits > Monitor usage ceilings.",
    icon: Shield,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Usage and limits" },
    keywords: ["quota", "usage", "limit", "rate limit"],
  },
  {
    id: "settings-data-export",
    parentId: "settings-section-data-controls",
    level: 2,
    sector: "Settings",
    label: "Data Export and Retention",
    description: "Data controls > Export and retention policies.",
    icon: Database,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Data controls" },
    keywords: ["export", "retention", "delete requests", "privacy"],
  },
  {
    id: "settings-payments",
    parentId: "settings-section-billing",
    level: 2,
    sector: "Settings",
    label: "Payment Methods",
    description: "Billing > Manage payment methods and invoices.",
    icon: CreditCard,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Billing" },
    keywords: ["billing", "invoice", "card", "payment"],
  },
  {
    id: "settings-api-references",
    parentId: "settings-section-help-docs",
    level: 2,
    sector: "Settings",
    label: "API References",
    description: "Help Docs > Browse API documentation.",
    icon: KeyRound,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: { section: "Help Docs" },
    keywords: ["api docs", "documentation", "guides"],
  },
]

const workspaceMemberTargets = [
  {
    id: "mem_001",
    name: "Amir Haddad",
    email: "amir.haddad@atmet.ai",
    role: "Super Admin",
  },
  {
    id: "mem_002",
    name: "Lina Saad",
    email: "lina.saad@atmet.ai",
    role: "Admin",
  },
  {
    id: "mem_003",
    name: "Omar Khaled",
    email: "omar.khaled@atmet.ai",
    role: "Member",
  },
  {
    id: "mem_004",
    name: "Yara Nasser",
    email: "yara.nasser@atmet.ai",
    role: "Member",
  },
  {
    id: "mem_005",
    name: "Fadi Mourad",
    email: "fadi.mourad@atmet.ai",
    role: "Admin",
  },
] as const

const userQuickActions: QuickAction[] = workspaceMemberTargets.map(
  (member) => ({
    id: `users-member-${member.id}`,
    parentId: "users-manage",
    level: 1,
    sector: "Users",
    label: member.name,
    description: `${member.role} • ${member.email}`,
    icon: Users,
    eventName: OPEN_SETTINGS_PANEL_EVENT,
    eventDetail: {
      section: "Members",
      memberId: member.id,
      memberQuery: member.name,
    },
    keywords: [member.email, member.role, "member profile", "workspace user"],
  })
)

const settingsNestedByParent = new Map<string, QuickAction[]>(
  settingsNestedQuickActions.reduce<Array<[string, QuickAction[]]>>(
    (groups, action) => {
      if (!action.parentId) return groups
      const existing = groups.find(([groupKey]) => groupKey === action.parentId)
      if (existing) {
        existing[1].push(action)
      } else {
        groups.push([action.parentId, [action]])
      }
      return groups
    },
    []
  )
)

const orderedSettingsTreeActions = settingsSectionQuickActions.flatMap(
  (sectionAction) => [
    sectionAction,
    ...(settingsNestedByParent.get(sectionAction.id) ?? []),
  ]
)

const quickActions = [
  ...dataQuickActions,
  ...chatQuickActions,
  ...projectQuickActions,
  userQuickActionRoots[0],
  ...userQuickActions,
  userQuickActionRoots[1],
  settingsRootAction,
  ...orderedSettingsTreeActions,
]

export function SearchForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<QuickActionTab>("All")
  const actionMap = React.useMemo(
    () => new Map(quickActions.map((action) => [action.id, action])),
    []
  )

  const getInitials = React.useCallback((name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
  }, [])

  const filteredActions = React.useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return quickActions

    const matchedIds = new Set(
      quickActions
        .filter((action) => {
          const searchable = [
            action.label,
            action.description,
            action.sector,
            ...(action.keywords ?? []),
          ]
          return searchable.some((value) => value.toLowerCase().includes(term))
        })
        .map((action) => action.id)
    )

    const includedIds = new Set(matchedIds)

    for (const id of matchedIds) {
      let current = actionMap.get(id)
      while (current?.parentId) {
        includedIds.add(current.parentId)
        current = actionMap.get(current.parentId)
      }
    }

    return quickActions.filter((action) => includedIds.has(action.id))
  }, [actionMap, query])

  const visibleActions = React.useMemo(() => {
    if (activeTab === "All") return filteredActions
    return filteredActions.filter((action) => action.sector === activeTab)
  }, [activeTab, filteredActions])

  const runAction = React.useCallback(
    (action: QuickAction) => {
      const emitEvent = () => {
        if (!action.eventName) return
        window.dispatchEvent(
          new CustomEvent(action.eventName, { detail: action.eventDetail })
        )
      }

      setOpen(false)
      setQuery("")

      if (action.path) {
        router.push(action.path)
        if (action.eventName) {
          window.setTimeout(emitEvent, 140)
        }
        return
      }

      emitEvent()
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
        <span className="truncate text-sm text-foreground/90">
          Search or run action...
        </span>
        <Kbd className="ms-auto">⌘K</Kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) {
            setActiveTab("All")
            setQuery("")
          }
        }}
        showCloseButton={false}
        className="top-1/2 h-[min(74svh,680px)] max-h-[calc(100svh-1.5rem)] w-[min(860px,92vw)] max-w-[92vw] -translate-y-1/2 sm:!max-w-[860px]"
      >
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput
            placeholder="Search sectors, pages, and actions..."
            value={query}
            onValueChange={(next) => setQuery(next)}
          />
          <div className="flex flex-wrap gap-1.5 border-b border-border px-3 pb-2 pt-1.5">
            {quickActionTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border border-transparent px-2.5 py-1 text-xs font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-pressed={isActive}
                >
                  <tab.icon className="size-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
          <CommandList className="max-h-none flex-1">
            <CommandEmpty>No actions found.</CommandEmpty>
            {sectors.map((sector) => {
              const groupActions = visibleActions.filter(
                (action) => action.sector === sector
              )
              if (groupActions.length === 0) return null

              return (
                <CommandGroup key={sector} heading={sector}>
                  {groupActions.map((action) => (
                    <CommandItem
                      key={action.id}
                      value={`${action.label} ${action.description} ${action.sector}`}
                      onSelect={() => runAction(action)}
                      className={cn(
                        "gap-2.5",
                        action.level === 1 && "pl-6",
                        action.level === 2 && "pl-10"
                      )}
                    >
                      {action.id.startsWith("users-member-") ? (
                        <Avatar size="sm" className="size-5">
                          <AvatarFallback className="text-[10px] font-medium">
                            {getInitials(action.label)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <action.icon className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {action.label}
                        </span>
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
          <CommandSeparator />
          <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <Kbd>Enter</Kbd>
              Open
            </span>
            <span className="inline-flex items-center gap-1">
              <Kbd>Esc</Kbd>
              Close
            </span>
            <span className="inline-flex items-center gap-1">
              <Kbd>⌘K</Kbd>
              Toggle
            </span>
          </div>
        </Command>
      </CommandDialog>
    </div>
  )
}
