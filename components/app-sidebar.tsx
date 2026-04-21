"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import { BarInteractive } from "@/components/charts/bar-interactive"
import { ChartBarPattern } from "@/components/examples/c-chart-5"
import { Pattern as EmptyIntegrationsPattern } from "@/components/examples/c-empty-19"
import { ColorSelector } from "@/components/color-selector"
import { Badge, type BadgeVariant } from "@/registry/spell-ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenuAction,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  WorkflowCircle01Icon,
} from "@hugeicons/core-free-icons"
import {
  IconApps,
  IconBell,
  IconBuilding,
  IconChartBar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCreditCard,
  IconDatabase,
  IconFileText,
  IconHelpCircle,
  IconLogout2,
  IconMoon,
  IconPlus,
  IconPuzzle,
  IconSettings,
  IconShield,
  IconSun,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import {
  Brain,
  Briefcase,
  Camera,
  Check,
  Clock3,
  Copy,
  Gift,
  Globe2,
  Hash,
  KeyRound,
  Languages,
  Mail,
  MessageSquare,
  Monitor,
  MoreHorizontal,
  Palette,
  PenLine,
  Phone,
  Pin,
  PinOff,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Smile,
  SlidersHorizontal,
  Trash2,
  User,
  UserPlus,
} from "lucide-react"

const navItems = [
  {
    title: "New Chat",
    url: "/ai-core",
    iconType: "tabler" as const,
    icon: IconPlus,
  },
  {
    title: "Workflow",
    url: "/workflow",
    iconType: "hugeicons" as const,
    icon: WorkflowCircle01Icon,
  },
  {
    title: "Skills",
    url: "/skills",
    iconType: "tabler" as const,
    icon: IconPuzzle,
  },
  {
    title: "Notifications",
    url: "/notifications",
    iconType: "tabler" as const,
    icon: IconBell,
  },
  {
    title: "Apps",
    url: "/integrations",
    iconType: "tabler" as const,
    icon: IconApps,
  },
]
const workspaces = ["Documentation", "Product", "Operations", "Marketing"]
const baseSettingsSections = [
  "Account",
  "Personalization",
  "Workspace",
  "General",
  "Notifications",
  "Members",
  "Integrations",
  "Usage and limits",
  "Data controls",
  "Plans (soon)",
  "Refer and earn",
  "Billing",
  "Help Docs",
  "Contact Support",
] as const
const adminSettingsSections = [
  "Admin overview",
  "Access policies",
  "Audit logs",
] as const
const settingsSections = [
  ...baseSettingsSections,
  ...adminSettingsSections,
] as const
type SettingsSection = (typeof settingsSections)[number]
type AdminSettingsSection = (typeof adminSettingsSections)[number]
const currentUser = {
  name: "Amir Haddad",
  role: "Operations Manager",
  initials: "AH",
}
const accountProfile = {
  firstName: "Amir",
  lastName: "Haddad",
  email: "amir.haddad@atmet.ai",
  phoneNumber: "+962 7 9000 1234",
  role: "Operations Manager",
  userId: "usr_8f29ab01c7",
  avatarUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
}
const workspaceProfile = {
  name: "Atmet AI Workspace",
  primaryEmail: "workspace@atmet.ai",
  description:
    "Main workspace for collaboration, automations, and shared project operations.",
  avatarUrl:
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=256&q=80",
  initials: "AT",
}
type WorkspaceMemberApp = {
  name: string
  category: string
  status: "Connected" | "Disconnected"
  connectedAt: string
  lastUsed: string
}

type WorkspaceMember = {
  id: string
  name: string
  email: string
  role: "Super Admin" | "Admin" | "Member"
  profileRole: string
  lastLogin: string
  initials: string
  avatarUrl: string
  creditsUsage: {
    allTime: number
    thisMonth: number
    thisWeek: number
  }
  integratedApps: WorkspaceMemberApp[]
}

const workspaceMembers: WorkspaceMember[] = [
  {
    id: "mem_001",
    name: "Amir Haddad",
    email: "amir.haddad@atmet.ai",
    role: "Super Admin",
    profileRole: "Operations Manager",
    lastLogin: "Today, 10:42 AM",
    initials: "AH",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    creditsUsage: {
      allTime: 24860,
      thisMonth: 3120,
      thisWeek: 820,
    },
    integratedApps: [
      {
        name: "Slack",
        category: "Communication",
        status: "Connected",
        connectedAt: "Feb 11, 2026",
        lastUsed: "Today",
      },
      {
        name: "Google Drive",
        category: "Storage",
        status: "Connected",
        connectedAt: "Jan 22, 2026",
        lastUsed: "Yesterday",
      },
      {
        name: "Notion",
        category: "Productivity",
        status: "Disconnected",
        connectedAt: "Dec 04, 2025",
        lastUsed: "Mar 01, 2026",
      },
    ],
  },
  {
    id: "mem_002",
    name: "Lina Saad",
    email: "lina.saad@atmet.ai",
    role: "Admin",
    profileRole: "Product Lead",
    lastLogin: "Today, 09:15 AM",
    initials: "LS",
    avatarUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80",
    creditsUsage: {
      allTime: 19140,
      thisMonth: 2710,
      thisWeek: 640,
    },
    integratedApps: [
      {
        name: "Linear",
        category: "Project management",
        status: "Connected",
        connectedAt: "Feb 02, 2026",
        lastUsed: "Today",
      },
      {
        name: "GitHub",
        category: "Engineering",
        status: "Connected",
        connectedAt: "Jan 18, 2026",
        lastUsed: "Today",
      },
    ],
  },
  {
    id: "mem_003",
    name: "Omar Khaled",
    email: "omar.khaled@atmet.ai",
    role: "Member",
    profileRole: "Operations Specialist",
    lastLogin: "Yesterday, 07:40 PM",
    initials: "OK",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    creditsUsage: {
      allTime: 12870,
      thisMonth: 1840,
      thisWeek: 410,
    },
    integratedApps: [
      {
        name: "Asana",
        category: "Task tracking",
        status: "Connected",
        connectedAt: "Mar 03, 2026",
        lastUsed: "Yesterday",
      },
      {
        name: "Zendesk",
        category: "Support",
        status: "Disconnected",
        connectedAt: "Jan 07, 2026",
        lastUsed: "Feb 28, 2026",
      },
    ],
  },
  {
    id: "mem_004",
    name: "Yara Nasser",
    email: "yara.nasser@atmet.ai",
    role: "Member",
    profileRole: "Marketing Specialist",
    lastLogin: "Yesterday, 11:05 AM",
    initials: "YN",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    creditsUsage: {
      allTime: 10390,
      thisMonth: 1390,
      thisWeek: 350,
    },
    integratedApps: [
      {
        name: "HubSpot",
        category: "CRM",
        status: "Connected",
        connectedAt: "Feb 16, 2026",
        lastUsed: "Yesterday",
      },
      {
        name: "Canva",
        category: "Design",
        status: "Connected",
        connectedAt: "Jan 27, 2026",
        lastUsed: "Today",
      },
    ],
  },
  {
    id: "mem_005",
    name: "Fadi Mourad",
    email: "fadi.mourad@atmet.ai",
    role: "Admin",
    profileRole: "Engineering Manager",
    lastLogin: "Mar 24, 2026",
    initials: "FM",
    avatarUrl:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=120&q=80",
    creditsUsage: {
      allTime: 22440,
      thisMonth: 2920,
      thisWeek: 560,
    },
    integratedApps: [
      {
        name: "GitLab",
        category: "Engineering",
        status: "Connected",
        connectedAt: "Dec 12, 2025",
        lastUsed: "Mar 24, 2026",
      },
      {
        name: "Datadog",
        category: "Monitoring",
        status: "Connected",
        connectedAt: "Jan 30, 2026",
        lastUsed: "Mar 23, 2026",
      },
      {
        name: "Sentry",
        category: "Monitoring",
        status: "Disconnected",
        connectedAt: "Nov 09, 2025",
        lastUsed: "Feb 05, 2026",
      },
    ],
  },
]

const settingsContent: Record<SettingsSection, string[]> = {
  Account: ["Profile details", "Email and login", "Security"],
  Personalization: ["About me", "Preferences", "Saved answers"],
  Notifications: [
    "Email notifications",
    "Push notifications",
    "Digest frequency",
  ],
  General: ["Theme and colors", "Font size", "Time zone", "Language"],
  Workspace: ["Workspace name", "Default workflow", "Region"],
  Members: ["Members", "Roles and permissions", "Invites"],
  Integrations: ["Workspace apps", "Member access", "Enforcement policy"],
  "Usage and limits": ["Usage summary", "Rate limits", "Quota alerts"],
  "Data controls": ["Retention policy", "Data export", "Delete requests"],
  "Plans (soon)": ["Current plan", "Billing", "Upgrade options"],
  "Refer and earn": ["Referral link", "Rewards", "Payout value"],
  Billing: ["Payment methods", "Invoices", "Billing history"],
  "Help Docs": ["Help center", "Guides", "API references"],
  "Contact Support": ["Support contact", "Live chat", "Report a bug"],
  "Admin overview": [
    "Platform health",
    "Workspace activity",
    "Pending approvals",
  ],
  "Access policies": [
    "Global access guards",
    "Invite controls",
    "Provisioning defaults",
  ],
  "Audit logs": ["Admin actions", "Security events", "Export logs"],
}

const PersonalizationIcon = ({ className }: { className?: string }) => (
  <Smile className={className} strokeWidth={1.6} />
)

const settingsSectionIcons: Record<
  SettingsSection,
  React.ComponentType<{ className?: string }>
> = {
  Account: IconUser,
  Personalization: PersonalizationIcon,
  Notifications: IconBell,
  General: Monitor,
  Workspace: IconBuilding,
  Members: IconUsers,
  Integrations: IconApps,
  "Usage and limits": IconChartBar,
  "Data controls": IconShield,
  "Plans (soon)": IconSettings,
  "Refer and earn": Gift,
  Billing: IconCreditCard,
  "Help Docs": IconFileText,
  "Contact Support": IconHelpCircle,
  "Admin overview": IconSettings,
  "Access policies": IconShield,
  "Audit logs": IconFileText,
}
const usageRangeStats = {
  "This week": {
    creditsUsed: 1820,
    creditsLimit: 5000,
    apiRequests: 124000,
    apiLimit: 300000,
    storageUsedGb: 38,
    storageLimitGb: 120,
    automationsActive: 29,
    automationsLimit: 60,
  },
  "This month": {
    creditsUsed: 7420,
    creditsLimit: 20000,
    apiRequests: 486000,
    apiLimit: 1200000,
    storageUsedGb: 42,
    storageLimitGb: 120,
    automationsActive: 31,
    automationsLimit: 60,
  },
  "All time": {
    creditsUsed: 52840,
    creditsLimit: 120000,
    apiRequests: 2860000,
    apiLimit: 5000000,
    storageUsedGb: 57,
    storageLimitGb: 120,
    automationsActive: 33,
    automationsLimit: 60,
  },
} as const
const usageLimitsRows = [
  {
    key: "credits",
    label: "Credits",
    limitKey: "creditsLimit" as const,
    usedKey: "creditsUsed" as const,
    unit: "",
  },
  {
    key: "requests",
    label: "API requests",
    limitKey: "apiLimit" as const,
    usedKey: "apiRequests" as const,
    unit: "",
  },
  {
    key: "storage",
    label: "Storage",
    limitKey: "storageLimitGb" as const,
    usedKey: "storageUsedGb" as const,
    unit: "GB",
  },
  {
    key: "automations",
    label: "Active automations",
    limitKey: "automationsLimit" as const,
    usedKey: "automationsActive" as const,
    unit: "",
  },
] as const

type StoredChatItem = {
  id: string
  title: string
  updatedAt: number
  pinned?: boolean
  path?: string
}

const AI_CORE_CHATS_STORAGE_KEY = "ai-core-chats"
const AI_CORE_CHATS_UPDATED_EVENT = "ai-core-chats-updated"
const OPEN_SETTINGS_PANEL_EVENT = "open-settings-panel"

type OpenSettingsPanelDetail = {
  section?: SettingsSection
  memberId?: string
  memberQuery?: string
  membersAction?: "invite"
}

const INITIAL_VISIBLE_CHATS = 4
const CHAT_LOAD_STEP = 10
const APPEARANCE_SETTINGS_STORAGE_KEY = "atmet-appearance-settings"
const PERSONALIZATION_SETTINGS_STORAGE_KEY = "atmet-personalization-settings"
const HELP_DOCS_EXTERNAL_URL = "https://atmet.ai/help-docs"
const CHANALOGE_EXTERNAL_URL = "https://chanaloge.com"
const BILLING_PORTAL_EXTERNAL_URL = "#"
const appearanceColorOptions = [
  {
    id: "graphite",
    label: "Graphite",
    primary: "#111111",
    primaryForeground: "#ffffff",
    border: "rgb(23 23 23 / 16%)",
    input: "rgb(23 23 23 / 18%)",
    ring: "rgb(23 23 23 / 30%)",
  },
  {
    id: "cobalt",
    label: "Cobalt",
    primary: "#1e90ff",
    primaryForeground: "#ffffff",
    border: "rgb(30 144 255 / 22%)",
    input: "rgb(30 144 255 / 22%)",
    ring: "rgb(30 144 255 / 36%)",
  },
  {
    id: "emerald",
    label: "Emerald",
    primary: "#059669",
    primaryForeground: "#ffffff",
    border: "rgb(5 150 105 / 22%)",
    input: "rgb(5 150 105 / 22%)",
    ring: "rgb(5 150 105 / 36%)",
  },
  {
    id: "violet",
    label: "Violet",
    primary: "#7c3aed",
    primaryForeground: "#ffffff",
    border: "rgb(124 58 237 / 22%)",
    input: "rgb(124 58 237 / 22%)",
    ring: "rgb(124 58 237 / 36%)",
  },
  {
    id: "rose",
    label: "Rose",
    primary: "#e11d48",
    primaryForeground: "#ffffff",
    border: "rgb(225 29 72 / 22%)",
    input: "rgb(225 29 72 / 22%)",
    ring: "rgb(225 29 72 / 36%)",
  },
  {
    id: "amber",
    label: "Amber",
    primary: "#d97706",
    primaryForeground: "#ffffff",
    border: "rgb(217 119 6 / 22%)",
    input: "rgb(217 119 6 / 22%)",
    ring: "rgb(217 119 6 / 36%)",
  },
  {
    id: "cyan",
    label: "Cyan",
    primary: "#0891b2",
    primaryForeground: "#ffffff",
    border: "rgb(8 145 178 / 22%)",
    input: "rgb(8 145 178 / 22%)",
    ring: "rgb(8 145 178 / 36%)",
  },
  {
    id: "teal",
    label: "Teal",
    primary: "#0f766e",
    primaryForeground: "#ffffff",
    border: "rgb(15 118 110 / 22%)",
    input: "rgb(15 118 110 / 22%)",
    ring: "rgb(15 118 110 / 36%)",
  },
  {
    id: "slate",
    label: "Slate",
    primary: "#334155",
    primaryForeground: "#ffffff",
    border: "rgb(51 65 85 / 22%)",
    input: "rgb(51 65 85 / 22%)",
    ring: "rgb(51 65 85 / 36%)",
  },
] as const

type AppearanceTheme = "light" | "dark" | "system"
type AppearanceColorId = (typeof appearanceColorOptions)[number]["id"]
type FontScale = "smaller" | "default" | "bigger"
type AppearanceSettings = {
  theme: AppearanceTheme
  colorId: AppearanceColorId
  timezone: string
  language: string
  fontScale: FontScale
}

function applyAppearanceColor(colorId: AppearanceColorId) {
  if (typeof document === "undefined") return
  const targetColor =
    appearanceColorOptions.find((option) => option.id === colorId) ??
    appearanceColorOptions[0]
  const root = document.documentElement

  root.style.setProperty("--primary", targetColor.primary)
  root.style.setProperty("--primary-foreground", targetColor.primaryForeground)
  root.style.setProperty("--sidebar-primary", targetColor.primary)
  root.style.setProperty(
    "--sidebar-primary-foreground",
    targetColor.primaryForeground
  )
  root.style.setProperty("--sidebar-ring", targetColor.ring)
  root.style.setProperty("--ring", targetColor.primary)
  root.style.removeProperty("--accent")
  root.style.removeProperty("--border")
  root.style.removeProperty("--input")
  root.style.removeProperty("--sidebar-border")
}

function applyGlobalFontScale(fontScale: FontScale) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (fontScale === "smaller") {
    root.style.fontSize = "15px"
    return
  }
  if (fontScale === "bigger") {
    root.style.fontSize = "17px"
    return
  }
  root.style.fontSize = ""
}

function AccountSettingsContent() {
  const roleOptions = [
    "Operations Manager",
    "Product Manager",
    "Software Engineer",
    "Designer",
    "Marketing Manager",
    "Other",
  ] as const
  const [savedProfile, setSavedProfile] = React.useState({
    firstName: accountProfile.firstName,
    lastName: accountProfile.lastName,
    email: accountProfile.email,
    phoneNumber: accountProfile.phoneNumber,
    selectedRole: accountProfile.role as (typeof roleOptions)[number] | string,
    customRole: "",
  })
  const [firstName, setFirstName] = React.useState(accountProfile.firstName)
  const [lastName, setLastName] = React.useState(accountProfile.lastName)
  const [email, setEmail] = React.useState(accountProfile.email)
  const [phoneNumber, setPhoneNumber] = React.useState(
    accountProfile.phoneNumber
  )
  const [selectedRole, setSelectedRole] = React.useState<
    (typeof roleOptions)[number] | string
  >(accountProfile.role)
  const [customRole, setCustomRole] = React.useState("")
  const displayedRole =
    selectedRole === "Other" ? customRole || "Other" : selectedRole
  const hasUnsavedChanges =
    firstName !== savedProfile.firstName ||
    lastName !== savedProfile.lastName ||
    email !== savedProfile.email ||
    phoneNumber !== savedProfile.phoneNumber ||
    selectedRole !== savedProfile.selectedRole ||
    customRole !== savedProfile.customRole

  return (
    <div className="flex min-h-full flex-col">
      <div className="space-y-6">
        <div className="flex items-center gap-2.5">
          <DropdownMenu>
            <div className="group/avatar-edit relative">
              <Avatar className="size-14 !rounded-lg ring-1 ring-border after:!rounded-lg">
                <AvatarImage
                  src={accountProfile.avatarUrl}
                  alt={`${accountProfile.firstName} avatar`}
                  className="!rounded-lg"
                />
                <AvatarFallback className="!rounded-lg text-sm font-semibold">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              <span className="pointer-events-none absolute inset-0 rounded-lg bg-background/20 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-focus-within/avatar-edit:opacity-100 group-hover/avatar-edit:opacity-100" />
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="outline"
                    className="pointer-events-none absolute inset-0 z-10 m-auto border-border/70 bg-background/90 opacity-0 shadow-xs transition-opacity duration-200 group-focus-within/avatar-edit:pointer-events-auto group-focus-within/avatar-edit:opacity-100 group-hover/avatar-edit:pointer-events-auto group-hover/avatar-edit:opacity-100"
                    aria-label="Edit profile image"
                  />
                }
              >
                <PenLine className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent
              align="start"
              className="min-w-44 rounded-lg p-1"
            >
              <DropdownMenuItem>
                <Camera className="h-3.5 w-3.5" />
                Upload image
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash2 className="h-3.5 w-3.5" />
                Delete image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="space-y-0.5 leading-tight">
            <p className="text-sm font-medium text-foreground">
              {firstName} {lastName}
            </p>
            <p className="text-sm text-muted-foreground">{displayedRole}</p>
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label
              className="text-muted-foreground"
              htmlFor="settings-first-name"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground/80" />
              First name
            </Label>
            <Input
              id="settings-first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Enter your first name"
              className="h-7"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              className="text-muted-foreground"
              htmlFor="settings-last-name"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground/80" />
              Last name
            </Label>
            <Input
              id="settings-last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Enter your last name"
              className="h-7"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-muted-foreground" htmlFor="settings-email">
              <Mail className="h-3.5 w-3.5 text-muted-foreground/80" />
              Email
            </Label>
            <Input
              id="settings-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              className="h-7"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-muted-foreground" htmlFor="settings-phone">
              <Phone className="h-3.5 w-3.5 text-muted-foreground/80" />
              Phone number
            </Label>
            <Input
              id="settings-phone"
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+1 (555) 000-0000"
              className="h-7"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-muted-foreground" htmlFor="settings-role">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground/80" />
              Role
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    id="settings-role"
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-full justify-between rounded-lg border-input bg-transparent px-2.5 text-sm font-normal"
                  />
                }
              >
                <span>{selectedRole}</span>
                <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-56 rounded-lg p-1"
              >
                {roleOptions.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => {
                      setSelectedRole(role)
                      if (role !== "Other") setCustomRole("")
                    }}
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedRole === "Other" && (
              <Input
                id="settings-custom-role"
                value={customRole}
                onChange={(event) => setCustomRole(event.target.value)}
                placeholder="Type your role"
                className="h-7"
              />
            )}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-muted-foreground" htmlFor="settings-user-id">
              <Hash className="h-3.5 w-3.5 text-muted-foreground/80" />
              User ID
            </Label>
            <div className="flex items-center gap-2">
              <p
                id="settings-user-id"
                className="font-mono text-sm text-foreground"
              >
                {accountProfile.userId}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Copy user ID"
                onClick={() =>
                  void navigator.clipboard.writeText(accountProfile.userId)
                }
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-5 pb-1">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm">
              <Mail className="h-3.5 w-3.5" />
              Send a link
            </Button>
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-destructive">
                Danger Zone
              </p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated workspaces.
              </p>
            </div>
            <Button type="button" variant="destructive" size="sm">
              <Trash2 className="h-3.5 w-3.5" />
              Delete my account
            </Button>
          </div>
        </section>
      </div>
      <div className="mt-auto flex justify-end pt-5 pb-1">
        <Button
          type="button"
          size="sm"
          disabled={!hasUnsavedChanges}
          onClick={() =>
            setSavedProfile({
              firstName,
              lastName,
              email,
              phoneNumber,
              selectedRole,
              customRole,
            })
          }
        >
          <Check className="h-3.5 w-3.5" />
          Save
        </Button>
      </div>
    </div>
  )
}

function PersonalizationSettingsContent() {
  const initialAnswers = React.useMemo(
    () => ({
      aboutMe: "",
      communicationStyle: "",
      preferences: "",
    }),
    []
  )
  const [savedAnswers, setSavedAnswers] = React.useState(initialAnswers)
  const [answers, setAnswers] = React.useState(initialAnswers)

  React.useEffect(() => {
    try {
      const rawSettings = window.localStorage.getItem(
        PERSONALIZATION_SETTINGS_STORAGE_KEY
      )
      if (!rawSettings) return
      const parsed = JSON.parse(rawSettings) as Partial<typeof initialAnswers>
      const nextAnswers = {
        aboutMe:
          typeof parsed.aboutMe === "string" ? parsed.aboutMe : initialAnswers.aboutMe,
        communicationStyle:
          typeof parsed.communicationStyle === "string"
            ? parsed.communicationStyle
            : initialAnswers.communicationStyle,
        preferences:
          typeof parsed.preferences === "string"
            ? parsed.preferences
            : initialAnswers.preferences,
      }
      setSavedAnswers(nextAnswers)
      setAnswers(nextAnswers)
    } catch {}
  }, [initialAnswers])

  const hasUnsavedChanges =
    answers.aboutMe !== savedAnswers.aboutMe ||
    answers.communicationStyle !== savedAnswers.communicationStyle ||
    answers.preferences !== savedAnswers.preferences

  return (
    <div className="space-y-3 pb-1">
      <section className="space-y-0.5">
        <p className="text-sm font-semibold text-foreground">Personalization</p>
        <p className="text-sm text-muted-foreground">
          Add saved answers about yourself so the assistant can personalize your
          experience.
        </p>
      </section>

      <section className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="personalization-about-me">About me</Label>
          <Textarea
            id="personalization-about-me"
            value={answers.aboutMe}
            onChange={(event) =>
              setAnswers((previous) => ({
                ...previous,
                aboutMe: event.target.value,
              }))
            }
            placeholder="Write a short summary about yourself."
            className="min-h-[90px]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="personalization-communication-style">
            Preferred communication style
          </Label>
          <Textarea
            id="personalization-communication-style"
            value={answers.communicationStyle}
            onChange={(event) =>
              setAnswers((previous) => ({
                ...previous,
                communicationStyle: event.target.value,
              }))
            }
            placeholder="Example: concise answers, Arabic + English mixed, include examples."
            className="min-h-[90px]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="personalization-preferences">My preferences</Label>
          <Textarea
            id="personalization-preferences"
            value={answers.preferences}
            onChange={(event) =>
              setAnswers((previous) => ({
                ...previous,
                preferences: event.target.value,
              }))
            }
            placeholder="Anything the assistant should remember for better help."
            className="min-h-[90px]"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          disabled={!hasUnsavedChanges}
          onClick={() => {
            setSavedAnswers(answers)
            window.localStorage.setItem(
              PERSONALIZATION_SETTINGS_STORAGE_KEY,
              JSON.stringify(answers)
            )
          }}
        >
          <Check className="h-3.5 w-3.5" />
          Save
        </Button>
      </div>
    </div>
  )
}

function NotificationSettingsContent() {
  const digestOptions = [
    "Real-time",
    "Daily digest",
    "Weekly digest",
    "Off",
  ] as const
  const notificationCategories = [
    {
      key: "security",
      label: "Security alerts",
      description: "Account sign-ins, password changes, and security activity.",
      icon: KeyRound,
    },
    {
      key: "product",
      label: "Product updates",
      description: "New features, improvements, and release updates.",
      icon: Briefcase,
    },
    {
      key: "tips",
      label: "Tips and recommendations",
      description: "Best practices and suggestions to improve your workflow.",
      icon: IconBell,
    },
  ] as const

  const defaultSettings = {
    categoryChannels: {
      security: { email: true, inApp: true },
      product: { email: true, inApp: true },
      tips: { email: false, inApp: false },
    },
    digest: "Daily digest" as (typeof digestOptions)[number],
    quietHours: false,
    quietFrom: "22:00",
    quietTo: "07:00",
  }

  const [notificationSettings, setNotificationSettings] =
    React.useState(defaultSettings)
  const [savedNotificationSettings, setSavedNotificationSettings] =
    React.useState(defaultSettings)
  const categoryChannels =
    notificationSettings.categoryChannels ?? defaultSettings.categoryChannels
  const savedCategoryChannels =
    savedNotificationSettings.categoryChannels ??
    defaultSettings.categoryChannels

  const hasUnsavedChanges =
    JSON.stringify(categoryChannels) !==
      JSON.stringify(savedCategoryChannels) ||
    notificationSettings.digest !== savedNotificationSettings.digest ||
    notificationSettings.quietHours !== savedNotificationSettings.quietHours ||
    notificationSettings.quietFrom !== savedNotificationSettings.quietFrom ||
    notificationSettings.quietTo !== savedNotificationSettings.quietTo

  return (
    <div className="flex min-h-full flex-col">
      <div className="space-y-3">
        <section className="space-y-1.5">
          <p className="text-sm font-medium text-foreground">Notify me about</p>
          <div className="space-y-2">
            {notificationCategories.map((category) => {
              const CategoryIcon = category.icon
              return (
                <div
                  key={category.key}
                  className="rounded-lg border border-input bg-transparent px-2.5 py-2"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-3.5 w-3.5 text-muted-foreground/80" />
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-foreground">
                          {category.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={
                            categoryChannels[category.key]?.email ?? false
                          }
                          onChange={(event) =>
                            setNotificationSettings((prev) => ({
                              ...prev,
                              categoryChannels: {
                                ...(prev.categoryChannels ??
                                  defaultSettings.categoryChannels),
                                [category.key]: {
                                  ...(prev.categoryChannels ??
                                    defaultSettings.categoryChannels)[
                                    category.key
                                  ],
                                  email: event.target.checked,
                                },
                              },
                            }))
                          }
                          className="size-3.5 rounded border-input accent-primary"
                        />
                        <Mail className="h-3.5 w-3.5 text-muted-foreground/80" />
                        Email
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={
                            categoryChannels[category.key]?.inApp ?? false
                          }
                          onChange={(event) =>
                            setNotificationSettings((prev) => ({
                              ...prev,
                              categoryChannels: {
                                ...(prev.categoryChannels ??
                                  defaultSettings.categoryChannels),
                                [category.key]: {
                                  ...(prev.categoryChannels ??
                                    defaultSettings.categoryChannels)[
                                    category.key
                                  ],
                                  inApp: event.target.checked,
                                },
                              },
                            }))
                          }
                          className="size-3.5 rounded border-input accent-primary"
                        />
                        <IconBell className="h-3.5 w-3.5 text-muted-foreground/80" />
                        In-app
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="space-y-1.5">
          <Label
            className="text-muted-foreground"
            htmlFor="settings-digest-frequency"
          >
            <IconBell className="h-3.5 w-3.5 text-muted-foreground/80" />
            Digest frequency
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  id="settings-digest-frequency"
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 w-full justify-between rounded-lg border-input bg-transparent px-2.5 text-sm font-normal"
                />
              }
            >
              <span>{notificationSettings.digest}</span>
              <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-56 rounded-lg p-1"
            >
              {digestOptions.map((digest) => (
                <DropdownMenuItem
                  key={digest}
                  onClick={() =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      digest,
                    }))
                  }
                >
                  {digest}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2 pt-5 pb-1">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-0.5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={notificationSettings.quietHours}
                  onChange={(event) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      quietHours: event.target.checked,
                    }))
                  }
                  className="size-3.5 rounded border-input accent-primary"
                />
                Quiet hours
              </label>
              <p className="text-sm text-muted-foreground">
                Pause non-critical notifications during your off-hours.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={notificationSettings.quietFrom}
                onChange={(event) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    quietFrom: event.target.value,
                  }))
                }
                disabled={!notificationSettings.quietHours}
                className="h-7 w-28"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="time"
                value={notificationSettings.quietTo}
                onChange={(event) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    quietTo: event.target.value,
                  }))
                }
                disabled={!notificationSettings.quietHours}
                className="h-7 w-28"
              />
            </div>
          </div>
        </section>
      </div>
      <div className="mt-auto flex justify-end pt-5 pb-1">
        <Button
          type="button"
          size="sm"
          disabled={!hasUnsavedChanges}
          onClick={() =>
            setSavedNotificationSettings({
              ...notificationSettings,
              categoryChannels,
            })
          }
        >
          <Check className="h-3.5 w-3.5" />
          Save
        </Button>
      </div>
    </div>
  )
}

function GeneralSettingsContent({
  currentTheme,
  setTheme,
}: {
  currentTheme?: string
  setTheme: (theme: string) => void
}) {
  const inferredTimezone = React.useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
    } catch {
      return "UTC"
    }
  }, [])
  const timezoneOptions = React.useMemo(() => {
    const base = [
      "Asia/Amman",
      "Asia/Dubai",
      "Asia/Riyadh",
      "Europe/London",
      "UTC",
      "America/New_York",
      "America/Los_Angeles",
      "Asia/Tokyo",
    ]
    return base.includes(inferredTimezone) ? base : [inferredTimezone, ...base]
  }, [inferredTimezone])
  const languageOptions = [
    "English",
    "Arabic",
    "French",
    "Spanish",
    "German",
    "Japanese",
  ] as const
  const initializedRef = React.useRef(false)
  const [appearanceSettings, setAppearanceSettings] =
    React.useState<AppearanceSettings>({
      theme: "system",
      colorId: "graphite",
      timezone: inferredTimezone,
      language: "English",
      fontScale: "default",
    })
  const [savedAppearanceSettings, setSavedAppearanceSettings] =
    React.useState<AppearanceSettings>({
      theme: "system",
      colorId: "graphite",
      timezone: inferredTimezone,
      language: "English",
      fontScale: "default",
    })

  React.useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const fallbackSettings: AppearanceSettings = {
      theme: (currentTheme as AppearanceTheme) || "system",
      colorId: "graphite",
      timezone: inferredTimezone,
      language: "English",
      fontScale: "default",
    }

    if (typeof window === "undefined") {
      setAppearanceSettings(fallbackSettings)
      setSavedAppearanceSettings(fallbackSettings)
      return
    }

    const rawSettings = window.localStorage.getItem(
      APPEARANCE_SETTINGS_STORAGE_KEY
    )
    if (!rawSettings) {
      setAppearanceSettings(fallbackSettings)
      setSavedAppearanceSettings(fallbackSettings)
      applyAppearanceColor(fallbackSettings.colorId)
      applyGlobalFontScale(fallbackSettings.fontScale)
      return
    }

    try {
      const parsed = JSON.parse(rawSettings) as Partial<AppearanceSettings>
      const nextSettings: AppearanceSettings = {
        theme:
          parsed.theme === "light" ||
          parsed.theme === "dark" ||
          parsed.theme === "system"
            ? parsed.theme
            : fallbackSettings.theme,
        colorId: appearanceColorOptions.some(
          (option) => option.id === parsed.colorId
        )
          ? (parsed.colorId as AppearanceColorId)
          : fallbackSettings.colorId,
        timezone:
          typeof parsed.timezone === "string"
            ? parsed.timezone
            : fallbackSettings.timezone,
        language:
          typeof parsed.language === "string"
            ? parsed.language
            : fallbackSettings.language,
        fontScale:
          parsed.fontScale === "smaller" ||
          parsed.fontScale === "default" ||
          parsed.fontScale === "bigger"
            ? parsed.fontScale
            : fallbackSettings.fontScale,
      }

      setAppearanceSettings(nextSettings)
      setSavedAppearanceSettings(nextSettings)
      applyAppearanceColor(nextSettings.colorId)
      applyGlobalFontScale(nextSettings.fontScale)
      setTheme(nextSettings.theme)
    } catch {
      setAppearanceSettings(fallbackSettings)
      setSavedAppearanceSettings(fallbackSettings)
      applyAppearanceColor(fallbackSettings.colorId)
      applyGlobalFontScale(fallbackSettings.fontScale)
    }
  }, [currentTheme, inferredTimezone, setTheme])

  const hasUnsavedChanges =
    appearanceSettings.theme !== savedAppearanceSettings.theme ||
    appearanceSettings.colorId !== savedAppearanceSettings.colorId ||
    appearanceSettings.timezone !== savedAppearanceSettings.timezone ||
    appearanceSettings.language !== savedAppearanceSettings.language ||
    appearanceSettings.fontScale !== savedAppearanceSettings.fontScale
  const selectedAppearanceColor =
    appearanceColorOptions.find(
      (option) => option.id === appearanceSettings.colorId
    ) ?? appearanceColorOptions[0]

  const renderThemePagePreview = React.useCallback(
    (tone: "light" | "dark") => (
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-md border p-1.5",
          tone === "dark"
            ? "border-white/12 bg-slate-950 text-slate-300"
            : "border-foreground/10 bg-[#f8fafc] text-slate-700"
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0",
            tone === "dark"
              ? "bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.18),transparent_48%)]"
              : "bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,0.08),transparent_46%)]"
          )}
        />
        <div className="relative flex h-full flex-col">
          <div
            className={cn(
              "mt-0.5 text-center text-[8px] font-semibold",
              tone === "dark" ? "text-slate-200/90" : "text-slate-700/90"
            )}
          >
            Good evening, Amir
          </div>
          <div
            className={cn(
              "mt-auto space-y-1 rounded-md border px-1.5 py-1",
              tone === "dark"
                ? "border-white/12 bg-white/[0.04]"
                : "border-foreground/10 bg-white/85"
            )}
          >
            <div
              className={cn(
                "truncate text-[7px]",
                tone === "dark" ? "text-slate-300/70" : "text-slate-500"
              )}
            >
              Use / to add a skill or @ to connect an app.
            </div>
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "truncate text-[6.5px]",
                  tone === "dark" ? "text-slate-300/75" : "text-slate-500"
                )}
              >
                AI Claude 4.5 Sonnet | Apps + Skills +
              </div>
              <span
                className={cn(
                  "rounded-[4px] px-1 py-0.5 text-[6px] font-medium",
                  tone === "dark"
                    ? "bg-slate-200/15 text-slate-100"
                    : "bg-slate-200 text-slate-700"
                )}
              >
                Send
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    []
  )

  return (
    <div className="flex min-h-full flex-col">
      <div className="space-y-3">
        <section className="space-y-2">
          <p className="text-sm font-medium text-foreground">Appearance</p>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">
              <Palette className="h-3.5 w-3.5 text-muted-foreground/80" />
              Theme mode
            </Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  { id: "light", label: "Light", icon: IconSun },
                  { id: "dark", label: "Dark", icon: IconMoon },
                  { id: "system", label: "System", icon: Monitor },
                ] as const
              ).map((themeOption) => {
                const ThemeIcon = themeOption.icon
                return (
                  <button
                    key={themeOption.id}
                    type="button"
                    onClick={() =>
                      setAppearanceSettings((prev) => ({
                        ...prev,
                        theme: themeOption.id,
                      }))
                    }
                    className={cn(
                      "rounded-xl border p-2 text-left transition-colors",
                      appearanceSettings.theme === themeOption.id
                        ? "border-primary ring-1 ring-primary/35"
                        : "border-input hover:bg-muted/30"
                    )}
                  >
                    <div className="h-24">
                      {themeOption.id === "system" ? (
                        <div className="grid h-full grid-cols-2 gap-1.5 rounded-lg border border-input/70 bg-muted/20 p-1.5">
                          {renderThemePagePreview("light")}
                          {renderThemePagePreview("dark")}
                        </div>
                      ) : (
                        renderThemePagePreview(themeOption.id as "light" | "dark")
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-foreground">
                      <ThemeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      {themeOption.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-muted-foreground">
              <Palette className="h-3.5 w-3.5 text-muted-foreground/80" />
              Primary color
            </Label>
            <ColorSelector
              colors={appearanceColorOptions.map((colorOption) => colorOption.primary)}
              defaultValue={selectedAppearanceColor.primary}
              onColorSelect={(selectedColor) => {
                const matchedColor = appearanceColorOptions.find(
                  (colorOption) => colorOption.primary === selectedColor
                )
                if (!matchedColor) return
                setAppearanceSettings((prev) => ({
                  ...prev,
                  colorId: matchedColor.id,
                }))
              }}
              className="flex flex-wrap items-center gap-2"
            />
            <p className="text-xs text-muted-foreground">
              Applies to primary buttons and focused field borders.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: "smaller", label: "Smaller" },
                { id: "default", label: "Default" },
                { id: "bigger", label: "Bigger" },
              ] as const
            ).map((fontOption) => (
              <Button
                key={fontOption.id}
                type="button"
                variant={
                  appearanceSettings.fontScale === fontOption.id
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="h-7"
                onClick={() =>
                  setAppearanceSettings((prev) => ({
                    ...prev,
                    fontScale: fontOption.id,
                  }))
                }
              >
                {fontOption.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Applies globally across the entire website.
          </p>
        </section>

        <section className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Time and language
          </p>
          <div className="space-y-1.5">
            <Label
              className="text-muted-foreground"
              htmlFor="settings-timezone"
            >
              <Clock3 className="h-3.5 w-3.5 text-muted-foreground/80" />
              Time zone
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    id="settings-timezone"
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-full justify-between rounded-lg border-input bg-transparent px-2.5 text-sm font-normal"
                  />
                }
              >
                <span>{appearanceSettings.timezone}</span>
                <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-56 rounded-lg p-1"
              >
                {timezoneOptions.map((timezone) => (
                  <DropdownMenuItem
                    key={timezone}
                    onClick={() =>
                      setAppearanceSettings((prev) => ({
                        ...prev,
                        timezone,
                      }))
                    }
                  >
                    {timezone}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-1.5">
            <Label
              className="text-muted-foreground"
              htmlFor="settings-language"
            >
              <Languages className="h-3.5 w-3.5 text-muted-foreground/80" />
              Language
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    id="settings-language"
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-full justify-between rounded-lg border-input bg-transparent px-2.5 text-sm font-normal"
                  />
                }
              >
                <span>{appearanceSettings.language}</span>
                <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-56 rounded-lg p-1"
              >
                {languageOptions.map((language) => (
                  <DropdownMenuItem
                    key={language}
                    onClick={() =>
                      setAppearanceSettings((prev) => ({
                        ...prev,
                        language,
                      }))
                    }
                  >
                    <Globe2 className="h-3.5 w-3.5 text-muted-foreground/80" />
                    {language}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
      </div>
      <div className="mt-auto flex justify-end pt-5 pb-1">
        <Button
          type="button"
          size="sm"
          disabled={!hasUnsavedChanges}
          onClick={() => {
            setSavedAppearanceSettings(appearanceSettings)
            setTheme(appearanceSettings.theme)
            applyAppearanceColor(appearanceSettings.colorId)
            applyGlobalFontScale(appearanceSettings.fontScale)
            if (typeof window !== "undefined") {
              window.localStorage.setItem(
                APPEARANCE_SETTINGS_STORAGE_KEY,
                JSON.stringify(appearanceSettings)
              )
            }
          }}
        >
          <Check className="h-3.5 w-3.5" />
          Save
        </Button>
      </div>
    </div>
  )
}

function WorkspaceSettingsContent({
  onGoToMembers,
}: {
  onGoToMembers: () => void
}) {
  const [savedWorkspace, setSavedWorkspace] = React.useState({
    name: workspaceProfile.name,
    description: workspaceProfile.description,
  })
  const [workspaceName, setWorkspaceName] = React.useState(
    workspaceProfile.name
  )
  const [description, setDescription] = React.useState(
    workspaceProfile.description
  )

  const hasUnsavedChanges =
    workspaceName !== savedWorkspace.name ||
    description !== savedWorkspace.description

  return (
    <div className="flex min-h-full flex-col">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <DropdownMenu>
            <div className="group/workspace-avatar relative">
              <Avatar className="size-14 !rounded-lg ring-1 ring-border after:!rounded-lg">
                <AvatarImage
                  src={workspaceProfile.avatarUrl}
                  alt={`${workspaceProfile.name} avatar`}
                  className="!rounded-lg"
                />
                <AvatarFallback className="!rounded-lg text-sm font-semibold">
                  {workspaceProfile.initials}
                </AvatarFallback>
              </Avatar>
              <span className="pointer-events-none absolute inset-0 rounded-lg bg-background/20 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-focus-within/workspace-avatar:opacity-100 group-hover/workspace-avatar:opacity-100" />
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="outline"
                    className="pointer-events-none absolute inset-0 z-10 m-auto border-border/70 bg-background/90 opacity-0 shadow-xs transition-opacity duration-200 group-focus-within/workspace-avatar:pointer-events-auto group-focus-within/workspace-avatar:opacity-100 group-hover/workspace-avatar:pointer-events-auto group-hover/workspace-avatar:opacity-100"
                    aria-label="Edit workspace image"
                  />
                }
              >
                <PenLine className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent
              align="start"
              className="min-w-44 rounded-lg p-1"
            >
              <DropdownMenuItem>
                <Camera className="h-3.5 w-3.5" />
                Upload image
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash2 className="h-3.5 w-3.5" />
                Delete image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="space-y-0.5 leading-tight">
            <p className="text-sm font-medium text-foreground">
              {workspaceName || "Workspace"}
            </p>
            <p className="text-sm text-muted-foreground">Workspace profile</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            className="text-muted-foreground"
            htmlFor="settings-workspace-name"
          >
            <IconBuilding className="h-3.5 w-3.5 text-muted-foreground/80" />
            Workspace name
          </Label>
          <Input
            id="settings-workspace-name"
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            placeholder="Enter workspace name"
            className="h-7"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Label
              className="text-muted-foreground"
              htmlFor="settings-workspace-email"
            >
              <Mail className="h-3.5 w-3.5 text-muted-foreground/80" />
              Primary email
            </Label>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex size-4 items-center justify-center rounded-full border border-border text-[10px] leading-none font-semibold text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    aria-label="Primary email cannot be edited"
                  >
                    !
                  </button>
                }
              />
              <TooltipContent className="max-w-64 text-xs">
                You can&apos;t edit the primary email. Contact support to update
                your primary email.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <Input
              id="settings-workspace-email"
              type="email"
              value={workspaceProfile.primaryEmail}
              disabled
              className="h-7 cursor-not-allowed bg-muted/55 pr-20 text-muted-foreground disabled:opacity-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-2 inline-flex items-center text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Read only
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            className="text-muted-foreground"
            htmlFor="settings-workspace-description"
          >
            <IconFileText className="h-3.5 w-3.5 text-muted-foreground/80" />
            Description
          </Label>
          <Textarea
            id="settings-workspace-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your workspace..."
            className="min-h-20 resize-none rounded-lg border-input"
          />
        </div>
      </div>

      <div className="space-y-3 pt-6 pb-1">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Members</p>
              <p className="text-sm text-muted-foreground">
                Manage workspace members, invites, and permissions.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onGoToMembers}
            >
              <IconUsers className="h-3.5 w-3.5" />
              Go to members
            </Button>
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-destructive">
                Delete workspace
              </p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this workspace and all associated data.
              </p>
            </div>
            <Button type="button" variant="destructive" size="sm">
              <Trash2 className="h-3.5 w-3.5" />
              Delete workspace
            </Button>
          </div>
        </section>
      </div>
      <div className="mt-auto flex justify-end pt-5 pb-1">
        <Button
          type="button"
          size="sm"
          disabled={!hasUnsavedChanges}
          onClick={() =>
            setSavedWorkspace({
              name: workspaceName,
              description,
            })
          }
        >
          <Check className="h-3.5 w-3.5" />
          Save
        </Button>
      </div>
    </div>
  )
}

function MembersSettingsContent({
  quickActionToken = 0,
  quickSearchQuery = "",
  quickSelectedMemberId = null,
  quickInviteToken = 0,
}: {
  quickActionToken?: number
  quickSearchQuery?: string
  quickSelectedMemberId?: string | null
  quickInviteToken?: number
}) {
  const roleFilters = ["All users", "Super Admin", "Admin", "Member"] as const
  const inviteRoleOptions = ["Member", "Admin", "Super Admin"] as const
  const creditsRanges = ["All time", "This month", "This week"] as const
  const seatsLimit = 10
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] =
    React.useState<(typeof roleFilters)[number]>("All users")
  const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(
    null
  )
  const [creditsRange, setCreditsRange] =
    React.useState<(typeof creditsRanges)[number]>("All time")
  const [isInviteOpen, setIsInviteOpen] = React.useState(false)
  const [inviteRole, setInviteRole] =
    React.useState<(typeof inviteRoleOptions)[number]>("Member")
  const [inviteInput, setInviteInput] = React.useState("")
  const [inviteEmails, setInviteEmails] = React.useState<string[]>([])
  const [inviteError, setInviteError] = React.useState("")
  const roleBadgeClasses: Record<WorkspaceMember["role"], BadgeVariant> = {
    "Super Admin": "violet",
    Admin: "blue",
    Member: "neutral",
  }
  const appStatusClasses: Record<WorkspaceMemberApp["status"], BadgeVariant> = {
    Connected: "green",
    Disconnected: "neutral",
  }

  const filteredMembers = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return workspaceMembers.filter((member) => {
      const matchesRole =
        roleFilter === "All users" || member.role === roleFilter
      if (!matchesRole) return false
      if (!query) return true
      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, roleFilter])
  const seatsUsed = workspaceMembers.length
  const seatsProgress = Math.min(100, (seatsUsed / seatsLimit) * 100)
  const selectedMember = React.useMemo(
    () =>
      workspaceMembers.find((member) => member.id === selectedMemberId) ?? null,
    [selectedMemberId]
  )
  const selectedCreditsUsage = React.useMemo(() => {
    if (!selectedMember) return 0
    if (creditsRange === "This month")
      return selectedMember.creditsUsage.thisMonth
    if (creditsRange === "This week")
      return selectedMember.creditsUsage.thisWeek
    return selectedMember.creditsUsage.allTime
  }, [selectedMember, creditsRange])
  const formattedCreditsUsage = React.useMemo(
    () => new Intl.NumberFormat("en-US").format(selectedCreditsUsage),
    [selectedCreditsUsage]
  )
  const creditsChartData = React.useMemo(() => {
    if (!selectedMember) return [] as { label: string; value: number }[]

    const buildSeries = (total: number, weights: number[]) => {
      const weightSum = weights.reduce((sum, weight) => sum + weight, 0) || 1
      return weights.map((weight) =>
        Math.max(0, Math.round((total * weight) / weightSum))
      )
    }

    if (creditsRange === "All time") {
      const labels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]
      const values = buildSeries(
        selectedMember.creditsUsage.allTime,
        [9, 12, 11, 15, 16, 19, 18]
      )
      return labels.map((label, index) => ({
        label,
        value: values[index] ?? 0,
      }))
    }

    if (creditsRange === "This month") {
      const labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
      const values = buildSeries(
        selectedMember.creditsUsage.thisMonth,
        [22, 28, 24, 26]
      )
      return labels.map((label, index) => ({
        label,
        value: values[index] ?? 0,
      }))
    }

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const values = buildSeries(
      selectedMember.creditsUsage.thisWeek,
      [12, 16, 15, 14, 13, 17, 13]
    )
    return labels.map((label, index) => ({ label, value: values[index] ?? 0 }))
  }, [selectedMember, creditsRange])

  const addInviteEmails = React.useCallback((raw: string) => {
    const tokens = raw
      .split(/[\s,;]+/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
    if (tokens.length === 0) return { added: 0, invalid: 0 }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let invalid = 0
    let added = 0

    setInviteEmails((previous) => {
      const seen = new Set(previous.map((value) => value.toLowerCase()))
      const next = [...previous]
      for (const token of tokens) {
        if (!emailPattern.test(token)) {
          invalid += 1
          continue
        }
        if (seen.has(token)) continue
        seen.add(token)
        next.push(token)
        added += 1
      }
      return next
    })

    return { added, invalid }
  }, [])

  const closeInviteModal = React.useCallback(() => {
    setIsInviteOpen(false)
    setInviteInput("")
    setInviteEmails([])
    setInviteRole("Member")
    setInviteError("")
  }, [])

  React.useEffect(() => {
    if (!isInviteOpen) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInviteModal()
    }
    window.addEventListener("keydown", onEscape)
    return () => window.removeEventListener("keydown", onEscape)
  }, [isInviteOpen, closeInviteModal])
  React.useEffect(() => {
    if (!selectedMemberId) return
    setCreditsRange("All time")
  }, [selectedMemberId])

  React.useEffect(() => {
    if (quickActionToken === 0) return

    if (quickSelectedMemberId) {
      setSelectedMemberId(quickSelectedMemberId)
      setSearchQuery("")
    } else {
      setSelectedMemberId(null)
      setSearchQuery(quickSearchQuery)
    }

    setRoleFilter("All users")
  }, [quickActionToken, quickSearchQuery, quickSelectedMemberId])

  React.useEffect(() => {
    if (quickInviteToken === 0) return
    setSelectedMemberId(null)
    setSearchQuery("")
    setRoleFilter("All users")
    setInviteInput("")
    setInviteEmails([])
    setInviteError("")
    setInviteRole("Member")
    setIsInviteOpen(true)
  }, [quickInviteToken])

  const submitInvite = () => {
    const tokens = inviteInput
      .split(/[\s,;]+/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validTokens = tokens.filter((token) => emailPattern.test(token))
    const merged = Array.from(
      new Set([
        ...inviteEmails.map((email) => email.toLowerCase()),
        ...validTokens,
      ])
    )

    if (merged.length === 0) {
      setInviteError("Please enter at least one valid email address.")
      return
    }

    closeInviteModal()
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {selectedMember ? (
        <>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedMemberId(null)}
            >
              <IconChevronLeft className="h-3.5 w-3.5" />
              Back to members
            </Button>
          </div>

          <div className="mt-2 min-h-0 flex-1 space-y-4 overflow-y-auto pe-1">
            <section className="space-y-2.5">
              <p className="text-sm font-semibold text-foreground">
                User profile
              </p>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-10 !rounded-full">
                  <AvatarImage
                    src={selectedMember.avatarUrl}
                    alt={selectedMember.name}
                    className="!rounded-full object-cover"
                  />
                  <AvatarFallback className="!rounded-full text-xs font-semibold">
                    {selectedMember.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground">
                      {selectedMember.name}
                    </p>
                    <Badge variant={roleBadgeClasses[selectedMember.role]}>
                      {selectedMember.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedMember.profileRole}
                  </p>
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    value={selectedMember.email}
                    disabled
                    className="h-7 cursor-not-allowed bg-muted/55 text-muted-foreground disabled:opacity-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground">Last login</Label>
                  <Input
                    value={selectedMember.lastLogin}
                    disabled
                    className="h-7 cursor-not-allowed bg-muted/55 text-muted-foreground disabled:opacity-100"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  Usage of credits
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 justify-between rounded-lg border-input bg-transparent px-2.5 text-[0.8rem] font-normal sm:min-w-28"
                      />
                    }
                  >
                    <span>{creditsRange}</span>
                    <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="min-w-32 rounded-lg p-1"
                  >
                    {creditsRanges.map((range) => (
                      <DropdownMenuItem
                        key={range}
                        onClick={() => setCreditsRange(range)}
                      >
                        {range}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="rounded-xl border border-border bg-background px-3 py-2.5">
                <p className="text-base font-semibold text-foreground">
                  {formattedCreditsUsage} credits
                </p>
                <p className="text-xs text-muted-foreground">
                  Consumption for {creditsRange.toLowerCase()}.
                </p>
                <BarInteractive
                  data={creditsChartData}
                  className="mt-2.5 h-44"
                />
              </div>
            </section>

            <section className="space-y-2.5">
              <p className="text-sm font-semibold text-foreground">
                Integrated apps
              </p>
              <div className="overflow-hidden rounded-xl border border-border bg-background">
                <table className="w-full table-fixed border-collapse text-[0.8rem]">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="w-[35%] px-2.5 py-1.5 text-left font-medium">
                        App
                      </th>
                      <th className="w-[25%] px-2.5 py-1.5 text-left font-medium">
                        Category
                      </th>
                      <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">
                        Status
                      </th>
                      <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">
                        Last used
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMember.integratedApps.map((app) => (
                      <tr
                        key={app.name}
                        className="border-b border-border/70 last:border-b-0"
                      >
                        <td className="px-2.5 py-1.5 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-[min(var(--radius-md),9px)] border border-border bg-muted/45 text-[10px] font-semibold text-foreground">
                              {app.name.slice(0, 1).toUpperCase()}
                            </span>
                            <span className="truncate">{app.name}</span>
                          </div>
                        </td>
                        <td className="truncate px-2.5 py-1.5 text-muted-foreground">
                          {app.category}
                        </td>
                        <td className="px-2.5 py-1.5">
                          <Badge variant={appStatusClasses[app.status]}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="truncate px-2.5 py-1.5 text-muted-foreground">
                          {app.lastUsed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name or email"
                  className="h-7 pl-8"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 justify-between rounded-lg border-input bg-transparent px-2.5 text-[0.8rem] font-normal sm:min-w-36"
                    />
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                    {roleFilter}
                  </span>
                  <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-40 rounded-lg p-1"
                >
                  {roleFilters.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => setRoleFilter(role)}
                    >
                      {role}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsInviteOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Invite
            </Button>
          </div>

          <section className="mt-3 space-y-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <IconUsers className="h-3.5 w-3.5 text-muted-foreground" />
                Seat limit
              </p>
              <span className="text-sm text-muted-foreground">
                {seatsUsed} / {seatsLimit}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/80"
                style={{ width: `${seatsProgress}%` }}
              />
            </div>
          </section>

          <div className="mt-3 min-h-0 flex-1 overflow-auto">
            <div className="overflow-hidden rounded-xl border border-border bg-background">
              <table className="w-full min-w-0 table-fixed border-collapse text-[0.8rem]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="w-[48%] px-2.5 py-1.5 text-left font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        Name & email
                      </span>
                    </th>
                    <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        User type
                      </span>
                    </th>
                    <th className="w-[24%] px-2.5 py-1.5 text-left font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        Last login
                      </span>
                    </th>
                    <th className="w-11 px-2 py-1.5 text-center font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => setSelectedMemberId(member.id)}
                      className="cursor-pointer border-b border-border/70 transition-colors last:border-b-0 hover:bg-muted/35"
                    >
                      <td className="px-2.5 py-1.5 pe-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7 !rounded-full">
                            <AvatarImage
                              src={member.avatarUrl}
                              alt={member.name}
                              className="!rounded-full object-cover"
                            />
                            <AvatarFallback className="!rounded-full text-[10px] font-semibold">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-[0.8rem] font-medium text-foreground">
                              {member.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2.5 py-1.5 pe-3 text-[0.8rem] text-foreground">
                        <Badge variant={roleBadgeClasses[member.role]}>
                          {member.role}
                        </Badge>
                      </td>
                      <td className="px-2.5 py-1.5 text-[0.8rem] text-muted-foreground">
                        {member.lastLogin}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                type="button"
                                size="icon-xs"
                                variant="ghost"
                                className="text-muted-foreground hover:text-foreground"
                                aria-label={`Actions for ${member.name}`}
                                onClick={(event) => event.stopPropagation()}
                              />
                            }
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="min-w-40 rounded-lg p-1"
                          >
                            <DropdownMenuItem
                              onClick={() => setSelectedMemberId(member.id)}
                            >
                              <User className="h-3.5 w-3.5" />
                              Go to profile
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete user
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No members match your current search or filter.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isInviteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4 backdrop-blur-[1px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeInviteModal()
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="inline-flex items-center gap-2.5">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">
                  Invite team members
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground"
                onClick={closeInviteModal}
              >
                <IconX className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-3.5 px-4 py-3.5">
              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  Send invite to ...
                </Label>
                <div className="flex min-h-24 flex-wrap content-start items-start gap-1.5 rounded-lg border border-input bg-background px-2.5 py-2 focus-within:border-ring">
                  {inviteEmails.map((email) => (
                    <Badge
                      key={email}
                      variant="neutral"
                      className="gap-1.5 text-foreground"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() =>
                          setInviteEmails((previous) =>
                            previous.filter((item) => item !== email)
                          )
                        }
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`Remove ${email}`}
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    type="text"
                    value={inviteInput}
                    onChange={(event) => {
                      setInviteInput(event.target.value)
                      if (inviteError) setInviteError("")
                    }}
                    onKeyDown={(event) => {
                      const shouldCommitOnSpace =
                        event.key === " " && inviteInput.trim().includes("@")
                      if (
                        event.key === "Enter" ||
                        event.key === "," ||
                        event.key === ";" ||
                        shouldCommitOnSpace
                      ) {
                        event.preventDefault()
                        const { invalid } = addInviteEmails(inviteInput)
                        setInviteInput("")
                        if (invalid > 0) {
                          setInviteError(
                            "Some entries were ignored because they are invalid."
                          )
                        }
                      }
                    }}
                    onPaste={(event) => {
                      const pasted = event.clipboardData.getData("text")
                      if (!/[,\n;\s]/.test(pasted)) return
                      event.preventDefault()
                      const { invalid } = addInviteEmails(pasted)
                      if (invalid > 0) {
                        setInviteError(
                          "Some entries were ignored because they are invalid."
                        )
                      }
                    }}
                    onBlur={() => {
                      if (!inviteInput.trim()) return
                      const { invalid } = addInviteEmails(inviteInput)
                      setInviteInput("")
                      if (invalid > 0) {
                        setInviteError(
                          "Some entries were ignored because they are invalid."
                        )
                      }
                    }}
                    placeholder={
                      inviteEmails.length === 0 ? "name@company.com" : ""
                    }
                    className="h-6 min-w-[180px] flex-1 border-0 bg-transparent text-[0.8rem] text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Invite as</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 w-full justify-between rounded-lg border-input bg-transparent px-2.5 text-[0.8rem] font-normal"
                      />
                    }
                  >
                    <span>{inviteRole}</span>
                    <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="min-w-40 rounded-lg p-1"
                  >
                    {inviteRoleOptions.map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => setInviteRole(role)}
                      >
                        {role}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {inviteError && (
                <p className="text-xs text-destructive">{inviteError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeInviteModal}
              >
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={submitInvite}>
                <Mail className="h-3.5 w-3.5" />
                Send invites
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function UsageLimitsSettingsContent() {
  const usageRanges = ["This week", "This month", "All time"] as const
  const [usageRange, setUsageRange] =
    React.useState<(typeof usageRanges)[number]>("This month")
  const defaultUserLimits = React.useMemo<Record<string, number>>(
    () =>
      Object.fromEntries(
        workspaceMembers.map((member) => [
          member.id,
          member.role === "Super Admin"
            ? 6000
            : member.role === "Admin"
              ? 4000
              : 2500,
        ])
      ),
    []
  )
  const [userLimits, setUserLimits] =
    React.useState<Record<string, number>>(defaultUserLimits)
  const [savedUserLimits, setSavedUserLimits] =
    React.useState<Record<string, number>>(defaultUserLimits)

  const stats = usageRangeStats[usageRange]
  const creditsPercentage = Math.min(
    100,
    (stats.creditsUsed / stats.creditsLimit) * 100
  )
  const hasUserLimitsChanges =
    JSON.stringify(userLimits) !== JSON.stringify(savedUserLimits)
  const chartData = React.useMemo(() => {
    if (usageRange === "All time") {
      return [
        { label: "Oct", value: 5400 },
        { label: "Nov", value: 6900 },
        { label: "Dec", value: 6400 },
        { label: "Jan", value: 7900 },
        { label: "Feb", value: 8350 },
        { label: "Mar", value: 9200 },
        { label: "Apr", value: 8690 },
      ]
    }
    if (usageRange === "This week") {
      return [
        { label: "Mon", value: 210 },
        { label: "Tue", value: 280 },
        { label: "Wed", value: 260 },
        { label: "Thu", value: 240 },
        { label: "Fri", value: 310 },
        { label: "Sat", value: 270 },
        { label: "Sun", value: 250 },
      ]
    }
    return [
      { label: "W1", value: 1520 },
      { label: "W2", value: 1860 },
      { label: "W3", value: 2010 },
      { label: "W4", value: 2030 },
    ]
  }, [usageRange])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">
            Usage overview
          </p>
          <p className="text-sm text-muted-foreground">
            Monitor consumption, quotas, and workspace limits.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 justify-between rounded-lg border-input bg-transparent px-2.5 text-[0.8rem] font-normal sm:min-w-32"
              />
            }
          >
            <span>{usageRange}</span>
            <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-32 rounded-lg p-1">
            {usageRanges.map((range) => (
              <DropdownMenuItem
                key={range}
                onClick={() => setUsageRange(range)}
              >
                {range}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-background px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">Credits used</p>
            <p className="text-sm font-semibold text-foreground">
              {stats.creditsUsed.toLocaleString()} /{" "}
              {stats.creditsLimit.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">API requests</p>
            <p className="text-sm font-semibold text-foreground">
              {stats.apiRequests.toLocaleString()} /{" "}
              {stats.apiLimit.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">Storage</p>
            <p className="text-sm font-semibold text-foreground">
              {stats.storageUsedGb}GB / {stats.storageLimitGb}GB
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">Automations</p>
            <p className="text-sm font-semibold text-foreground">
              {stats.automationsActive} / {stats.automationsLimit}
            </p>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-background p-2.5">
          <ChartBarPattern
            title="Usage trend"
            description={`Consumption across ${usageRange.toLowerCase()}.`}
            badgeLabel={usageRange}
            data={chartData.map((point) => ({
              label: point.label,
              usage: point.value,
              baseline: Math.max(Math.round(point.value * 0.78), 1),
            }))}
          />
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-background">
          <table className="w-full table-fixed border-collapse text-[0.8rem]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="w-[30%] px-2.5 py-1.5 text-left font-medium">
                  Resource
                </th>
                <th className="w-[35%] px-2.5 py-1.5 text-left font-medium">
                  Usage
                </th>
                <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">
                  Limit
                </th>
                <th className="w-[15%] px-2.5 py-1.5 text-left font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {usageLimitsRows.map((row) => {
                const used = stats[row.usedKey]
                const limit = stats[row.limitKey]
                const progress = Math.min(
                  100,
                  (used / Math.max(limit, 1)) * 100
                )
                const nearLimit = progress >= 80
                return (
                  <tr
                    key={row.key}
                    className="border-b border-border/70 last:border-b-0"
                  >
                    <td className="px-2.5 py-1.5 font-medium text-foreground">
                      {row.label}
                    </td>
                    <td className="px-2.5 py-1.5">
                      <div className="space-y-1">
                        <p className="text-[11px] text-muted-foreground">
                          {used.toLocaleString()}
                          {row.unit ? ` ${row.unit}` : ""}
                        </p>
                        <div className="h-1.5 rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              nearLimit ? "bg-destructive/70" : "bg-primary/70"
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-2.5 py-1.5 text-muted-foreground">
                      {limit.toLocaleString()}
                      {row.unit ? ` ${row.unit}` : ""}
                    </td>
                    <td className="px-2.5 py-1.5">
                      <Badge variant={nearLimit ? "red" : "green"}>
                        {nearLimit ? "Near limit" : "Within limit"}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="border-b border-border px-3 py-2.5">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                Per-user limits
              </p>
              <p className="text-xs text-muted-foreground">
                Set a monthly credits cap for each member.
              </p>
            </div>
          </div>
          <table className="w-full table-fixed border-collapse text-[0.8rem]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="w-[46%] px-2.5 py-1.5 text-left font-medium">
                  User
                </th>
                <th className="w-[22%] px-2.5 py-1.5 text-left font-medium">
                  User type
                </th>
                <th className="w-[24%] px-2.5 py-1.5 text-left font-medium">
                  Monthly limit
                </th>
                <th className="w-[8%] px-2.5 py-1.5 text-left font-medium">
                  Unit
                </th>
              </tr>
            </thead>
            <tbody>
              {workspaceMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border/70 last:border-b-0"
                >
                  <td className="px-2.5 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7 !rounded-full">
                        <AvatarImage
                          src={member.avatarUrl}
                          alt={member.name}
                          className="!rounded-full object-cover"
                        />
                        <AvatarFallback className="!rounded-full text-[10px] font-semibold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-[0.8rem] font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2.5 py-1.5">
                    <Badge
                      variant={member.role === "Member" ? "neutral" : "violet"}
                    >
                      {member.role}
                    </Badge>
                  </td>
                  <td className="px-2.5 py-1.5">
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      value={userLimits[member.id] ?? 0}
                      onChange={(event) => {
                        const parsed = Number(event.target.value)
                        setUserLimits((previous) => ({
                          ...previous,
                          [member.id]: Number.isFinite(parsed)
                            ? Math.max(0, parsed)
                            : 0,
                        }))
                      }}
                      className="h-7"
                    />
                  </td>
                  <td className="px-2.5 py-1.5 text-muted-foreground">
                    credits
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end border-t border-border px-3 py-2.5">
            <Button
              type="button"
              size="sm"
              disabled={!hasUserLimitsChanges}
              onClick={() => setSavedUserLimits(userLimits)}
            >
              <Check className="h-3.5 w-3.5" />
              Save limits
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

function IntegrationsSettingsContent() {
  const [nameFilter, setNameFilter] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [viewMode, setViewMode] = React.useState<"workspace" | "users">(
    "workspace"
  )
  const [disconnectedAppsByName, setDisconnectedAppsByName] = React.useState<
    Record<string, boolean>
  >({})
  const [forcedAppsByName, setForcedAppsByName] = React.useState<
    Record<string, boolean>
  >(() => ({
    Slack: true,
    Notion: true,
  }))

  const appRows = React.useMemo(() => {
    const appMap = new Map<
      string,
      { name: string; category: string; connectedUsers: number }
    >()

    for (const member of workspaceMembers) {
      for (const app of member.integratedApps) {
        if (app.status !== "Connected") continue
        if (disconnectedAppsByName[app.name]) continue
        const existing = appMap.get(app.name)
        if (existing) {
          appMap.set(app.name, {
            ...existing,
            connectedUsers: existing.connectedUsers + 1,
          })
          continue
        }

        appMap.set(app.name, {
          name: app.name,
          category: app.category,
          connectedUsers: 1,
        })
      }
    }

    return Array.from(appMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [disconnectedAppsByName])

  const categoryOptions = React.useMemo(
    () => Array.from(new Set(appRows.map((app) => app.category))).sort(),
    [appRows]
  )

  const filteredAppRows = React.useMemo(() => {
    const loweredFilter = nameFilter.trim().toLowerCase()
    return appRows.filter((app) => {
      const matchesName =
        loweredFilter.length === 0 ||
        app.name.toLowerCase().includes(loweredFilter) ||
        app.category.toLowerCase().includes(loweredFilter)
      const matchesCategory =
        categoryFilter === "all" || app.category === categoryFilter
      return matchesName && matchesCategory
    })
  }, [appRows, categoryFilter, nameFilter])

  const forcedAppNames = React.useMemo(
    () =>
      Object.entries(forcedAppsByName)
        .filter(([, isForced]) => isForced)
        .map(([name]) => name),
    [forcedAppsByName]
  )

  const categoryFilterLabel =
    categoryFilter === "all" ? "All categories" : categoryFilter
  const hasAnyConnectedApps = appRows.length > 0
  const handleDisconnectApp = React.useCallback((appName: string) => {
    setDisconnectedAppsByName((previous) => ({
      ...previous,
      [appName]: true,
    }))
    setForcedAppsByName((previous) => ({
      ...previous,
      [appName]: false,
    }))
  }, [])

  return (
    <div className="space-y-3 pb-1">
      <section className="rounded-xl border border-border bg-background px-3 py-2.5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">
            Integrations policy
          </p>
          <p className="text-sm text-muted-foreground">
            Workspace owners can enforce selected integrations for every member.
            Forced integrations are available for all users by default.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2">
        <div className="inline-flex rounded-[min(var(--radius-md),12px)] bg-muted p-0.5">
          <Button
            type="button"
            size="xs"
            variant={viewMode === "workspace" ? "default" : "ghost"}
            className="rounded-[min(var(--radius-md),10px)]"
            onClick={() => setViewMode("workspace")}
          >
            Workspace apps
          </Button>
          <Button
            type="button"
            size="xs"
            variant={viewMode === "users" ? "default" : "ghost"}
            className="rounded-[min(var(--radius-md),10px)]"
            onClick={() => setViewMode("users")}
          >
            Member access
          </Button>
        </div>
      </div>

      {viewMode === "workspace" ? (
        <>
          {!hasAnyConnectedApps ? (
            <EmptyIntegrationsPattern />
          ) : (
            <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={nameFilter}
                  onChange={(event) => setNameFilter(event.target.value)}
                  placeholder="Search app by name"
                  className="h-7 pl-8"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 justify-between rounded-[min(var(--radius-md),12px)] border border-transparent bg-sidebar px-2.5 text-[0.8rem] font-normal text-foreground hover:bg-sidebar-accent sm:min-w-44"
                    />
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                    {categoryFilterLabel}
                  </span>
                  <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-44 rounded-lg p-1"
                >
                  <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                    All categories
                  </DropdownMenuItem>
                  {categoryOptions.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {filteredAppRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No integrations match your current filters.
            </div>
          ) : (
            <section className="overflow-hidden rounded-xl border border-border bg-background">
              <table className="w-full table-fixed border-collapse text-[0.8rem]">
                <thead>
                  <tr className="border-b border-border bg-muted/25 text-muted-foreground">
                    <th className="w-[28%] px-2.5 py-1.5 text-left font-medium">
                      Integration
                    </th>
                    <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">
                      Category
                    </th>
                    <th className="w-[14%] px-2.5 py-1.5 text-left font-medium">
                      Connected users
                    </th>
                    <th className="w-[38%] px-2.5 py-1.5 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppRows.map((app) => {
                    const isForced = Boolean(forcedAppsByName[app.name])
                    const connectedUsersCount = isForced
                      ? workspaceMembers.length
                      : app.connectedUsers

                    return (
                      <tr
                        key={app.name}
                        className="border-b border-border/70 last:border-b-0"
                      >
                        <td className="px-2.5 py-1.5">
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-[min(var(--radius-md),9px)] border border-border bg-muted/45 text-[10px] font-semibold text-foreground">
                              {app.name.slice(0, 1).toUpperCase()}
                            </span>
                            <div className="flex min-w-0 items-center gap-1.5">
                              <span className="truncate font-medium text-foreground">
                                {app.name}
                              </span>
                              <Badge
                                variant={isForced ? "blue" : "neutral"}
                                className="shrink-0"
                              >
                                {isForced ? "Forced" : "Optional"}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="truncate px-2.5 py-1.5 text-muted-foreground">
                          {app.category}
                        </td>
                        <td className="px-2.5 py-1.5 text-foreground">
                          {connectedUsersCount} / {workspaceMembers.length}
                        </td>
                        <td className="px-2.5 py-1.5 text-right">
                          <div className="flex flex-nowrap justify-end gap-1.5">
                            <Button
                              type="button"
                              size="xs"
                              variant="ghost"
                              className="shrink-0 rounded-[min(var(--radius-md),12px)] border border-transparent bg-sidebar text-foreground hover:bg-sidebar-accent"
                              onClick={() =>
                                setForcedAppsByName((previous) => ({
                                  ...previous,
                                  [app.name]: !isForced,
                                }))
                              }
                            >
                              {isForced ? "Disable force" : "Force to all"}
                            </Button>
                            <Button
                              type="button"
                              size="xs"
                              variant="ghost"
                              className="shrink-0 rounded-[min(var(--radius-md),12px)] border border-transparent bg-sidebar text-foreground hover:bg-sidebar-accent"
                              onClick={() => handleDisconnectApp(app.name)}
                            >
                              Unconnect
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          )}
            </>
          )}
        </>
      ) : (
        hasAnyConnectedApps || forcedAppNames.length > 0 ? (
          <section className="overflow-hidden rounded-xl border border-border bg-background">
            <table className="w-full table-fixed border-collapse text-[0.8rem]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="w-[34%] px-2.5 py-1.5 text-left font-medium">
                    Member
                  </th>
                  <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">
                    Role
                  </th>
                  <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">
                    Effective integrations
                  </th>
                  <th className="w-[26%] px-2.5 py-1.5 text-left font-medium">
                    Forced integrations
                  </th>
                </tr>
              </thead>
              <tbody>
                {workspaceMembers.map((member) => {
                  const connectedNames = member.integratedApps
                    .filter(
                      (app) =>
                        app.status === "Connected" &&
                        !disconnectedAppsByName[app.name]
                    )
                    .map((app) => app.name)
                  const effectiveSet = new Set([
                    ...connectedNames,
                    ...forcedAppNames,
                  ])

                  return (
                    <tr
                      key={member.id}
                      className="border-b border-border/70 last:border-b-0"
                    >
                      <td className="px-2.5 py-1.5 pe-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7 !rounded-full">
                            <AvatarImage
                              src={member.avatarUrl}
                              alt={member.name}
                              className="!rounded-full object-cover"
                            />
                            <AvatarFallback className="!rounded-full text-[10px] font-semibold">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-[0.8rem] font-medium text-foreground">
                              {member.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2.5 py-1.5 text-foreground">
                        {member.role}
                      </td>
                      <td className="px-2.5 py-1.5 text-foreground">
                        {effectiveSet.size}
                      </td>
                      <td className="px-2.5 py-1.5">
                        {forcedAppNames.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {forcedAppNames.map((appName) => (
                              <Badge
                                key={`${member.id}-${appName}`}
                                variant="blue"
                              >
                                {appName}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            None
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        ) : (
          <EmptyIntegrationsPattern />
        )
      )}
    </div>
  )
}

function DataControlsSettingsContent() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-foreground">Data controls</p>
        <p className="text-sm text-muted-foreground">
          Manage permanent deletion actions for workspace data.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <section className="flex flex-col gap-2 rounded-xl border border-border bg-background px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Delete all uploaded files
            </p>
            <p className="text-sm text-muted-foreground">
              Permanently remove all uploaded documents and assets.
            </p>
          </div>
          <Button type="button" variant="destructive" size="sm">
            <Trash2 className="h-3.5 w-3.5" />
            Delete files
          </Button>
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-border bg-background px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Delete all chats and workflows
            </p>
            <p className="text-sm text-muted-foreground">
              Permanently remove conversation history and workflow data.
            </p>
          </div>
          <Button type="button" variant="destructive" size="sm">
            <Trash2 className="h-3.5 w-3.5" />
            Delete chats and workflows
          </Button>
        </section>
      </div>
    </div>
  )
}

function ReferAndEarnSettingsContent() {
  const referredUsers = 12
  const totalCredits = 310
  const referralCode = accountProfile.userId.replace(/^usr_/, "").toUpperCase()
  const referralLink = React.useMemo(() => {
    if (typeof window === "undefined") {
      return `https://app.atmet.ai/signup?ref=${referralCode}`
    }
    return `${window.location.origin}/signup?ref=${referralCode}`
  }, [referralCode])
  const [copied, setCopied] = React.useState(false)
  const [payoutStatus, setPayoutStatus] = React.useState("")

  React.useEffect(() => {
    if (!copied) return
    const timeoutId = window.setTimeout(() => {
      setCopied(false)
    }, 2000)
    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [copied])

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
    } catch {}
  }, [referralLink])

  const handleShare = React.useCallback(async () => {
    const shareMessage =
      "Join Atmet AI with my referral link and get 25% for your first year."
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: "Atmet AI referral",
          text: shareMessage,
          url: referralLink,
        })
        return
      }
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
    } catch {}
  }, [referralLink])

  const handleRequestMoney = React.useCallback(() => {
    setPayoutStatus("Payout request submitted. Our team will contact you soon.")
  }, [])

  return (
    <div className="space-y-3 pb-1">
      <div className="space-y-0.5 px-1">
        <p className="text-sm font-semibold text-foreground">Refer and earn</p>
        <p className="text-sm text-muted-foreground">
          Share your unique link. New clients get 25% for one year, and you
          earn referral credits when they pay.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-muted/25 p-2.5">
        <Label htmlFor="referral-link" className="text-xs text-muted-foreground">
          Your unique referral link
        </Label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input id="referral-link" value={referralLink} readOnly />
          <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button type="button" size="sm" onClick={handleShare}>
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </section>

      <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-background px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Referred users</p>
          <p className="text-sm font-semibold text-foreground">{referredUsers}</p>
        </div>
        <div className="rounded-xl border border-border bg-background px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Total credits</p>
          <p className="text-sm font-semibold text-foreground">
            {totalCredits.toLocaleString()} credits
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Balance payout</p>
          <Button type="button" size="sm" className="mt-1" onClick={handleRequestMoney}>
            Request money
          </Button>
          {payoutStatus ? (
            <p className="mt-2 text-xs text-muted-foreground">{payoutStatus}</p>
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-sidebar p-3">
        <p className="text-sm font-semibold text-foreground">Example earnings</p>
        <p className="mt-1 text-sm text-muted-foreground">
          If a referred client stays on the monthly plan for 12 months, you
          receive 120 credits. If they choose the yearly plan, you receive 150
          credits from that purchase.
        </p>
      </section>
    </div>
  )
}

function BillingSettingsContent({
  onGoToMembers,
  onGoToUsageLimits,
}: {
  onGoToMembers: () => void
  onGoToUsageLimits: () => void
}) {
  const seatsUsed = 1
  const seatsLimit = 1
  const creditsUsed = 0
  const creditsLimit = 250

  const seatsProgress = Math.min(100, (seatsUsed / seatsLimit) * 100)
  const creditsProgress = Math.min(100, (creditsUsed / creditsLimit) * 100)

  return (
    <div className="space-y-3 pb-1">
      <section className="rounded-xl border border-border bg-sidebar p-2.5 sm:p-3">
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="grid md:grid-cols-2">
            <div className="flex min-h-[148px] flex-col justify-between gap-3 px-4 py-3.5 md:border-r md:border-border">
              <div className="flex items-start gap-2.5">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 text-foreground">
                  <IconBuilding className="h-4 w-4" />
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    Free plan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    $0.00 per user/month, billed monthly
                  </p>
                </div>
              </div>
              <div>
                <Button type="button" size="sm">
                  <Plus className="h-3.5 w-3.5" />
                  Explore plans
                </Button>
              </div>
            </div>

            <div className="flex min-h-[148px] flex-col justify-between gap-3 px-4 py-3.5">
              <div className="space-y-0.5">
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  Upcoming bill
                  <IconHelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </p>
                <p className="text-sm text-muted-foreground">
                  Renews on Apr 20, 2026
                </p>
              </div>
              <div className="flex items-end justify-between">
                <button
                  type="button"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Show details
                </button>
                <p className="text-3xl leading-none font-semibold text-foreground">
                  $0.00
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid md:grid-cols-2 md:divide-x md:divide-border/60">
          <div className="space-y-2.5 border-b border-border/60 px-1 py-1.5 md:border-b-0 md:px-3 md:py-2.5">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <IconUsers className="h-3.5 w-3.5 text-muted-foreground" />
              Seats
            </p>
            <p className="text-sm text-muted-foreground">
              {seatsUsed} / {seatsLimit}
            </p>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/80"
                style={{ width: `${seatsProgress}%` }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onGoToMembers}
            >
              Manage seats
            </Button>
          </div>

          <div className="space-y-2.5 px-1 py-1.5 md:px-3 md:py-2.5">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <IconCreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              Credits
              <IconHelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            </p>
            <p className="text-sm text-muted-foreground">
              {creditsUsed.toLocaleString()} / {creditsLimit.toLocaleString()}
            </p>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/35"
                style={{ width: `${creditsProgress}%` }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onGoToUsageLimits}
            >
              Usage
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-background px-4 py-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">
              Manage billing
            </p>
            <p className="text-sm text-muted-foreground">
              View and manage your billing details.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              window.open(
                BILLING_PORTAL_EXTERNAL_URL,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Billing portal
            <IconChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Need help?</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              window.location.href = "mailto:support@atmet.ai"
            }}
          >
            Contact support
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          Cancel subscription
        </Button>
      </div>
    </div>
  )
}

function AdminOverviewSettingsContent() {
  const overviewCards = [
    {
      label: "Managed workspaces",
      value: "24",
      note: "+3 this month",
    },
    {
      label: "Active admins",
      value: "9",
      note: "2 Super Admin",
    },
    {
      label: "Pending approvals",
      value: "5",
      note: "Requires review",
    },
    {
      label: "Security incidents",
      value: "0",
      note: "Last 30 days",
    },
  ] as const

  return (
    <div className="space-y-3 pb-1">
      <section className="rounded-xl border border-border bg-background px-4 py-3.5">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">Platform admin</p>
          <p className="text-sm text-muted-foreground">
            Cross-workspace controls and oversight for platform administrators.
          </p>
        </div>
      </section>

      <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-background px-3 py-2.5"
          >
            <p className="text-[11px] text-muted-foreground">{item.label}</p>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
            <p className="text-[11px] text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">
              Pending admin actions
            </p>
            <p className="text-xs text-muted-foreground">
              Approval queue that impacts multiple workspaces.
            </p>
          </div>
          <Button type="button" size="sm">
            Review queue
          </Button>
        </div>
        <div className="divide-y divide-border">
          {[
            "Approve SSO enforcement for Product workspace",
            "Review enterprise export request from Operations",
            "Confirm elevated API rate limit request",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between gap-2 px-3 py-2.5"
            >
              <p className="text-sm text-foreground">{item}</p>
              <Button type="button" variant="outline" size="sm">
                Open
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function AccessPoliciesSettingsContent() {
  const [requireMfaForAdmins, setRequireMfaForAdmins] = React.useState(true)
  const [inviteApprovalRequired, setInviteApprovalRequired] =
    React.useState(true)
  const [autoProvisionByDomain, setAutoProvisionByDomain] =
    React.useState(false)

  return (
    <div className="space-y-3 pb-1">
      <section className="rounded-xl border border-border bg-background px-4 py-3.5">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">Access policies</p>
          <p className="text-sm text-muted-foreground">
            Configure default security and permission rules across the platform.
          </p>
        </div>
      </section>

      <section className="space-y-2 rounded-xl border border-border bg-background px-3 py-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Require MFA for admin roles
            </p>
            <p className="text-sm text-muted-foreground">
              Enforce multi-factor auth for Admin and Super Admin accounts.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={requireMfaForAdmins ? "default" : "outline"}
            onClick={() => setRequireMfaForAdmins((previous) => !previous)}
          >
            {requireMfaForAdmins ? "Enabled" : "Disabled"}
          </Button>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Require invite approval
            </p>
            <p className="text-sm text-muted-foreground">
              New workspace invitations require admin approval before sending.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={inviteApprovalRequired ? "default" : "outline"}
            onClick={() => setInviteApprovalRequired((previous) => !previous)}
          >
            {inviteApprovalRequired ? "Enabled" : "Disabled"}
          </Button>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Auto-provision by approved domain
            </p>
            <p className="text-sm text-muted-foreground">
              Automatically create member accounts for verified company domains.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={autoProvisionByDomain ? "default" : "outline"}
            onClick={() => setAutoProvisionByDomain((previous) => !previous)}
          >
            {autoProvisionByDomain ? "Enabled" : "Disabled"}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-background px-3 py-2.5">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">
            Global admin contacts
          </p>
          <p className="text-sm text-muted-foreground">
            These contacts receive high-priority policy and security alerts.
          </p>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {["security@atmet.ai", "ops-admin@atmet.ai", "compliance@atmet.ai"].map(
            (email) => (
              <Badge key={email} variant="blue">
                {email}
              </Badge>
            )
          )}
        </div>
      </section>
    </div>
  )
}

function AuditLogsSettingsContent() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [severityFilter, setSeverityFilter] = React.useState<
    "all" | "high" | "medium" | "low"
  >("all")
  const [eventTypeFilter, setEventTypeFilter] = React.useState<
    | "all"
    | "auth"
    | "policy"
    | "integration"
    | "data"
    | "workspace"
    | "navigation"
  >("all")
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "success" | "blocked" | "failed"
  >("all")
  const [workspaceFilter, setWorkspaceFilter] = React.useState("all")

  const auditLogRows = React.useMemo(
    () =>
      [
        {
          id: "evt_001",
          actor: "Rana Kamel",
          actorRole: "Member",
          action: 'Opened "New Chat" and submitted 3 prompts',
          scope: "User activity",
          workspace: "Documentation",
          severity: "high" as const,
          eventType: "navigation" as const,
          status: "success" as const,
          timestamp: "Apr 18, 2026 • 13:42",
          ipAddress: "10.14.20.19",
          location: "Amman, JO",
          requestId: "req_911be31a",
          changedFields: ["page_click:new-chat", "chat_count:+3", "credits:+94"],
        },
        {
          id: "evt_003",
          actor: "Samer Odeh",
          actorRole: "Member",
          action: "Triggered workflow run: Contract Risk Review",
          scope: "Workflow execution",
          workspace: "Operations",
          severity: "medium" as const,
          eventType: "data" as const,
          status: "success" as const,
          timestamp: "Apr 18, 2026 • 13:11",
          ipAddress: "10.14.22.41",
          location: "Riyadh, SA",
          requestId: "req_a125d6ce",
          changedFields: ["workflow_runs:+1", "credits:+62", "api_requests:+411"],
        },
        {
          id: "evt_004",
          actor: "System",
          actorRole: "Security monitor",
          action: "Blocked suspicious login from unknown device",
          scope: "Authentication guard",
          workspace: "Platform",
          severity: "high" as const,
          eventType: "auth" as const,
          status: "blocked" as const,
          timestamp: "Apr 18, 2026 • 12:53",
          ipAddress: "185.77.212.90",
          location: "Frankfurt, DE",
          requestId: "req_aa812d6f",
          changedFields: ["session_blocked", "risk_score"],
        },
        {
          id: "evt_005",
          actor: "Noah Karim",
          actorRole: "Admin",
          action: "Updated default invite policy",
          scope: "Workspace governance",
          workspace: "Product",
          severity: "low" as const,
          eventType: "workspace" as const,
          status: "success" as const,
          timestamp: "Apr 17, 2026 • 16:28",
          ipAddress: "10.14.22.3",
          location: "Riyadh, SA",
          requestId: "req_6e03bd35",
          changedFields: ["invite_requires_approval", "allowed_domains"],
        },
        {
          id: "evt_006",
          actor: "System",
          actorRole: "Integration service",
          action: "Slack force-policy sync failed for 2 users",
          scope: "Apps policy",
          workspace: "Documentation",
          severity: "medium" as const,
          eventType: "integration" as const,
          status: "failed" as const,
          timestamp: "Apr 17, 2026 • 14:03",
          ipAddress: "internal",
          location: "Region eu-central",
          requestId: "req_9a10ceef",
          changedFields: ["sync_attempts", "failed_targets"],
        },
        {
          id: "evt_007",
          actor: "Maya Nassar",
          actorRole: "Member",
          action: 'Visited pages: Workflow, Skills, My Data',
          scope: "User navigation",
          workspace: "Product",
          severity: "low" as const,
          eventType: "navigation" as const,
          status: "success" as const,
          timestamp: "Apr 17, 2026 • 11:32",
          ipAddress: "10.14.11.54",
          location: "Cairo, EG",
          requestId: "req_2d9b4bb7",
          changedFields: ["page_click:workflow", "page_click:skills", "page_click:my-data"],
        },
        {
          id: "evt_008",
          actor: "Lina Saad",
          actorRole: "Admin",
          action: "Approved workspace export request",
          scope: "Compliance export",
          workspace: "Operations",
          severity: "medium" as const,
          eventType: "policy" as const,
          status: "success" as const,
          timestamp: "Apr 17, 2026 • 09:21",
          ipAddress: "10.14.21.11",
          location: "Dubai, AE",
          requestId: "req_41ca8bd2",
          changedFields: ["export_status", "approval_state"],
        },
      ] as const,
    []
  )

  const userActivityRows = React.useMemo(
    () => [
      {
        id: "usr_01",
        name: "Amir Haddad",
        role: "Super Admin",
        workspace: "Documentation",
        chats: 86,
        usageCredits: 2480,
      },
      {
        id: "usr_02",
        name: "Lina Saad",
        role: "Admin",
        workspace: "Operations",
        chats: 59,
        usageCredits: 1810,
      },
      {
        id: "usr_03",
        name: "Rana Kamel",
        role: "Member",
        workspace: "Documentation",
        chats: 44,
        usageCredits: 1360,
      },
      {
        id: "usr_04",
        name: "Maya Nassar",
        role: "Member",
        workspace: "Product",
        chats: 32,
        usageCredits: 980,
      },
      {
        id: "usr_05",
        name: "Samer Odeh",
        role: "Member",
        workspace: "Operations",
        chats: 51,
        usageCredits: 1540,
      },
    ],
    []
  )

  const [workspaceControls, setWorkspaceControls] = React.useState<
    Record<string, { paused: boolean; capCredits: number }>
  >({
    Documentation: { paused: false, capCredits: 16000 },
    Operations: { paused: false, capCredits: 18000 },
    Product: { paused: false, capCredits: 14000 },
    Marketing: { paused: true, capCredits: 10000 },
  })

  const workspaceUsageRows = React.useMemo(
    () => [
      {
        workspace: "Documentation",
        activeUsers: 8,
        chats: 214,
        usageCredits: 6920,
        pageClicks: 3160,
      },
      {
        workspace: "Operations",
        activeUsers: 6,
        chats: 178,
        usageCredits: 5740,
        pageClicks: 2410,
      },
      {
        workspace: "Product",
        activeUsers: 5,
        chats: 121,
        usageCredits: 3980,
        pageClicks: 1960,
      },
      {
        workspace: "Marketing",
        activeUsers: 3,
        chats: 77,
        usageCredits: 2140,
        pageClicks: 1330,
      },
    ],
    []
  )

  const pageClickRows = React.useMemo(
    () => [
      { page: "New Chat", clicks: 2640 },
      { page: "Workflow", clicks: 2320 },
      { page: "Skills", clicks: 1860 },
      { page: "Apps", clicks: 1490 },
      { page: "My Data", clicks: 1210 },
      { page: "Notifications", clicks: 780 },
    ],
    []
  )

  const workspaceOptions = React.useMemo(
    () =>
      Array.from(new Set(auditLogRows.map((row) => row.workspace))).sort(),
    [auditLogRows]
  )

  const filteredRows = React.useMemo(() => {
    const loweredQuery = searchQuery.trim().toLowerCase()
    return auditLogRows.filter((row) => {
      const matchesQuery =
        loweredQuery.length === 0 ||
        row.actor.toLowerCase().includes(loweredQuery) ||
        row.action.toLowerCase().includes(loweredQuery) ||
        row.scope.toLowerCase().includes(loweredQuery) ||
        row.requestId.toLowerCase().includes(loweredQuery) ||
        row.ipAddress.toLowerCase().includes(loweredQuery)
      const matchesSeverity =
        severityFilter === "all" || row.severity === severityFilter
      const matchesEventType =
        eventTypeFilter === "all" || row.eventType === eventTypeFilter
      const matchesStatus = statusFilter === "all" || row.status === statusFilter
      const matchesWorkspace =
        workspaceFilter === "all" || row.workspace === workspaceFilter
      return (
        matchesQuery &&
        matchesSeverity &&
        matchesEventType &&
        matchesStatus &&
        matchesWorkspace
      )
    })
  }, [
    auditLogRows,
    eventTypeFilter,
    searchQuery,
    severityFilter,
    statusFilter,
    workspaceFilter,
  ])

  const severityLabel =
    severityFilter === "all"
      ? "All severities"
      : severityFilter === "high"
        ? "High"
        : severityFilter === "medium"
          ? "Medium"
          : "Low"
  const eventTypeLabel =
    eventTypeFilter === "all"
      ? "All event types"
      : eventTypeFilter === "auth"
        ? "Auth"
        : eventTypeFilter === "policy"
          ? "Policy"
          : eventTypeFilter === "integration"
            ? "Integration"
          : eventTypeFilter === "data"
            ? "Data"
            : eventTypeFilter === "navigation"
              ? "Navigation"
              : "Workspace"
  const statusLabel =
    statusFilter === "all"
      ? "All statuses"
      : statusFilter === "success"
        ? "Success"
        : statusFilter === "blocked"
          ? "Blocked"
          : "Failed"
  const workspaceLabel =
    workspaceFilter === "all" ? "All workspaces" : workspaceFilter

  const detailedStats = React.useMemo(() => {
    const highEvents = auditLogRows.filter((row) => row.severity === "high").length
    const blockedEvents = auditLogRows.filter((row) => row.status === "blocked").length
    const failedEvents = auditLogRows.filter((row) => row.status === "failed").length
    const topPage = pageClickRows[0]?.page ?? "-"
    const topPageClicks = pageClickRows[0]?.clicks ?? 0
    const avgChatsPerUser = Math.round(
      userActivityRows.reduce((sum, row) => sum + row.chats, 0) /
        Math.max(userActivityRows.length, 1)
    )
    const avgUsagePerUser = Math.round(
      userActivityRows.reduce((sum, row) => sum + row.usageCredits, 0) /
        Math.max(userActivityRows.length, 1)
    )
    const avgUsagePerWorkspace = Math.round(
      workspaceUsageRows.reduce((sum, row) => sum + row.usageCredits, 0) /
        Math.max(workspaceUsageRows.length, 1)
    )
    return {
      total: auditLogRows.length,
      highEvents,
      blockedEvents,
      failedEvents,
      topPage,
      topPageClicks,
      avgChatsPerUser,
      avgUsagePerUser,
      avgUsagePerWorkspace,
    }
  }, [auditLogRows, pageClickRows, userActivityRows, workspaceUsageRows])

  return (
    <div className="space-y-3 pb-1">
      <section className="rounded-xl border border-border bg-background px-4 py-3.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">
              Platform activity and control
            </p>
            <p className="text-sm text-muted-foreground">
              Track all users/workspaces activity, usage, and controls in one place.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
      </section>

      <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-background px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Most clicked page</p>
          <p className="text-sm font-semibold text-foreground">
            {detailedStats.topPage}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {detailedStats.topPageClicks.toLocaleString()} clicks
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Avg chats per user</p>
          <p className="text-sm font-semibold text-foreground">
            {detailedStats.avgChatsPerUser}
          </p>
          <p className="text-[11px] text-muted-foreground">last 30 days</p>
        </div>
        <div className="rounded-xl border border-border bg-background px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Avg usage per user</p>
          <p className="text-sm font-semibold text-foreground">
            {detailedStats.avgUsagePerUser.toLocaleString()} credits
          </p>
          <p className="text-[11px] text-muted-foreground">last 30 days</p>
        </div>
        <div className="rounded-xl border border-border bg-background px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Avg usage per workspace</p>
          <p className="text-sm font-semibold text-foreground">
            {detailedStats.avgUsagePerWorkspace.toLocaleString()} credits
          </p>
          <p className="text-[11px] text-muted-foreground">last 30 days</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold text-foreground">
            Workspace usage and controls
          </p>
          <p className="text-xs text-muted-foreground">
            Monitor each workspace and apply control actions instantly.
          </p>
        </div>
        <table className="w-full table-fixed border-collapse text-[0.8rem]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="w-[24%] px-2.5 py-1.5 text-left font-medium">
                Workspace
              </th>
              <th className="w-[10%] px-2.5 py-1.5 text-left font-medium">
                Users
              </th>
              <th className="w-[12%] px-2.5 py-1.5 text-left font-medium">
                Chats
              </th>
              <th className="w-[16%] px-2.5 py-1.5 text-left font-medium">
                Usage
              </th>
              <th className="w-[14%] px-2.5 py-1.5 text-left font-medium">
                Clicks
              </th>
              <th className="w-[24%] px-2.5 py-1.5 text-left font-medium">
                Controls
              </th>
            </tr>
          </thead>
          <tbody>
            {workspaceUsageRows.map((row) => {
              const controls = workspaceControls[row.workspace] ?? {
                paused: false,
                capCredits: 0,
              }
              return (
                <tr key={row.workspace} className="border-b border-border/70 last:border-b-0">
                  <td className="px-2.5 py-1.5 font-medium text-foreground">
                    {row.workspace}
                  </td>
                  <td className="px-2.5 py-1.5 text-muted-foreground">
                    {row.activeUsers}
                  </td>
                  <td className="px-2.5 py-1.5 text-muted-foreground">
                    {row.chats}
                  </td>
                  <td className="px-2.5 py-1.5 text-muted-foreground">
                    {row.usageCredits.toLocaleString()} credits
                    <p className="text-[11px] text-muted-foreground">
                      cap {controls.capCredits.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-2.5 py-1.5 text-muted-foreground">
                    {row.pageClicks.toLocaleString()}
                  </td>
                  <td className="px-2.5 py-1.5">
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        onClick={() =>
                          setWorkspaceControls((previous) => ({
                            ...previous,
                            [row.workspace]: {
                              ...controls,
                              paused: !controls.paused,
                            },
                          }))
                        }
                      >
                        {controls.paused ? "Resume" : "Pause"}
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        onClick={() =>
                          setWorkspaceControls((previous) => ({
                            ...previous,
                            [row.workspace]: {
                              ...controls,
                              capCredits: controls.capCredits + 1000,
                            },
                          }))
                        }
                      >
                        +1k cap
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold text-foreground">
            User productivity and usage
          </p>
          <p className="text-xs text-muted-foreground">
            Compare average chats and credit usage by user.
          </p>
        </div>
        <table className="w-full table-fixed border-collapse text-[0.8rem]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="w-[30%] px-2.5 py-1.5 text-left font-medium">User</th>
              <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">Role</th>
              <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">Workspace</th>
              <th className="w-[14%] px-2.5 py-1.5 text-left font-medium">Chats</th>
              <th className="w-[16%] px-2.5 py-1.5 text-left font-medium">Usage</th>
            </tr>
          </thead>
          <tbody>
            {userActivityRows.map((row) => (
              <tr key={row.id} className="border-b border-border/70 last:border-b-0">
                <td className="px-2.5 py-1.5 font-medium text-foreground">{row.name}</td>
                <td className="px-2.5 py-1.5 text-muted-foreground">{row.role}</td>
                <td className="px-2.5 py-1.5 text-muted-foreground">{row.workspace}</td>
                <td className="px-2.5 py-1.5 text-muted-foreground">{row.chats}</td>
                <td className="px-2.5 py-1.5 text-muted-foreground">
                  {row.usageCredits.toLocaleString()} credits
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search actor, action, request ID, or IP"
            className="h-7 pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 justify-between rounded-lg border-input bg-transparent px-2.5 text-[0.8rem] font-normal sm:min-w-40"
              />
            }
          >
            <span>{severityLabel}</span>
            <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-40 rounded-lg p-1">
            <DropdownMenuItem onClick={() => setSeverityFilter("all")}>
              All severities
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter("high")}>
              High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter("medium")}>
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter("low")}>
              Low
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 justify-between rounded-lg border-input bg-transparent px-2.5 text-[0.8rem] font-normal sm:min-w-40"
              />
            }
          >
            <span>{eventTypeLabel}</span>
            <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-40 rounded-lg p-1">
            <DropdownMenuItem onClick={() => setEventTypeFilter("all")}>
              All event types
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEventTypeFilter("auth")}>
              Auth
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEventTypeFilter("policy")}>
              Policy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEventTypeFilter("integration")}>
              Integration
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEventTypeFilter("data")}>
              Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEventTypeFilter("workspace")}>
              Workspace
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEventTypeFilter("navigation")}>
              Navigation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 justify-between rounded-lg border-input bg-transparent px-2.5 text-[0.8rem] font-normal sm:min-w-40"
              />
            }
          >
            <span>{statusLabel}</span>
            <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-40 rounded-lg p-1">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("success")}>
              Success
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("blocked")}>
              Blocked
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("failed")}>
              Failed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 justify-between rounded-lg border-input bg-transparent px-2.5 text-[0.8rem] font-normal sm:min-w-40"
              />
            }
          >
            <span>{workspaceLabel}</span>
            <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-40 rounded-lg p-1">
            <DropdownMenuItem onClick={() => setWorkspaceFilter("all")}>
              All workspaces
            </DropdownMenuItem>
            {workspaceOptions.map((workspace) => (
              <DropdownMenuItem
                key={workspace}
                onClick={() => setWorkspaceFilter(workspace)}
              >
                {workspace}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-background">
        <table className="w-full table-fixed border-collapse text-[0.8rem]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="w-[25%] px-2.5 py-1.5 text-left font-medium">Event</th>
              <th className="w-[17%] px-2.5 py-1.5 text-left font-medium">Actor</th>
              <th className="w-[18%] px-2.5 py-1.5 text-left font-medium">
                Workspace
              </th>
              <th className="w-[18%] px-2.5 py-1.5 text-left font-medium">
                Context
              </th>
              <th className="w-[12%] px-2.5 py-1.5 text-left font-medium">Time</th>
              <th className="w-[10%] px-2.5 py-1.5 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-2.5 py-6 text-center text-sm text-muted-foreground"
                >
                  No audit logs match current filters.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-border/70 last:border-b-0">
                  <td className="px-2.5 py-1.5 align-top">
                    <p className="text-foreground">{row.action}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant={
                          row.eventType === "auth"
                            ? "blue"
                            : row.eventType === "policy"
                              ? "violet"
                              : row.eventType === "integration"
                                ? "green"
                                : row.eventType === "data"
                                  ? "cyan"
                                  : "neutral"
                        }
                      >
                        {row.eventType}
                      </Badge>
                      <Badge
                        variant={
                          row.severity === "high"
                            ? "red"
                            : row.severity === "medium"
                              ? "amber"
                              : "neutral"
                        }
                      >
                        {row.severity}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{row.id}</span>
                    </div>
                  </td>
                  <td className="px-2.5 py-1.5 align-top">
                    <p className="text-foreground">{row.actor}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {row.actorRole} • {row.ipAddress}
                    </p>
                  </td>
                  <td className="px-2.5 py-1.5 align-top">
                    <p className="text-foreground">{row.workspace}</p>
                    {row.workspace in workspaceControls ? (
                      <p className="text-[11px] text-muted-foreground">
                        {workspaceControls[row.workspace]?.paused
                          ? "Paused"
                          : "Active"}{" "}
                        • cap{" "}
                        {workspaceControls[row.workspace]?.capCredits.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">Global scope</p>
                    )}
                  </td>
                  <td className="px-2.5 py-1.5 align-top">
                    <p className="text-muted-foreground">{row.scope}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Request: {row.requestId}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {row.changedFields.slice(0, 2).map((field) => (
                        <Badge key={`${row.id}-${field}`} variant="neutral">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-2.5 py-1.5 align-top">
                    <p className="text-[11px] text-muted-foreground">{row.timestamp}</p>
                  </td>
                  <td className="px-2.5 py-1.5 align-top">
                    <Badge
                      variant={
                        row.status === "success"
                          ? "green"
                          : row.status === "blocked"
                            ? "amber"
                            : "red"
                      }
                    >
                      {row.status}
                    </Badge>
                    <p className="mt-1 text-[11px] text-muted-foreground">{row.location}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const currentWorkspaceMember = React.useMemo(
    () =>
      workspaceMembers.find(
        (member) =>
          member.email.toLowerCase() === accountProfile.email.toLowerCase()
      ) ?? null,
    []
  )
  const isPlatformAdmin =
    currentWorkspaceMember?.role === "Super Admin" ||
    currentWorkspaceMember?.role === "Admin"
  const visibleSettingsSections = React.useMemo<readonly SettingsSection[]>(
    () =>
      isPlatformAdmin
        ? settingsSections
        : baseSettingsSections,
    [isPlatformAdmin]
  )
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [activeSettingsSection, setActiveSettingsSection] =
    React.useState<SettingsSection>("Account")
  const [membersQuickSearchQuery, setMembersQuickSearchQuery] =
    React.useState("")
  const [membersQuickSelectedId, setMembersQuickSelectedId] = React.useState<
    string | null
  >(null)
  const [membersQuickActionToken, setMembersQuickActionToken] =
    React.useState(0)
  const [membersQuickInviteToken, setMembersQuickInviteToken] =
    React.useState(0)
  const [storedChats, setStoredChats] = React.useState<StoredChatItem[]>([])
  const [isMemoryExpanded, setIsMemoryExpanded] = React.useState(false)
  const [isChatsExpanded, setIsChatsExpanded] = React.useState(true)
  const [visibleChatsCount, setVisibleChatsCount] = React.useState(
    INITIAL_VISIBLE_CHATS
  )
  const [editingChatId, setEditingChatId] = React.useState<string | null>(null)
  const [editingChatTitle, setEditingChatTitle] = React.useState("")
  const discardNextRenameSubmitRef = React.useRef(false)
  const activeChatId = searchParams.get("chat")

  const sortedChats = React.useMemo(() => {
    return [...storedChats].sort((a, b) => {
      const aPinned = Boolean(a.pinned)
      const bPinned = Boolean(b.pinned)
      if (aPinned !== bPinned) return aPinned ? -1 : 1
      return b.updatedAt - a.updatedAt
    })
  }, [storedChats])
  const visibleChats = React.useMemo(
    () => sortedChats.slice(0, visibleChatsCount),
    [sortedChats, visibleChatsCount]
  )
  const pinnedChats = React.useMemo(
    () => visibleChats.filter((chat) => Boolean(chat.pinned)),
    [visibleChats]
  )
  const unpinnedChats = React.useMemo(
    () => visibleChats.filter((chat) => !chat.pinned),
    [visibleChats]
  )

  const readStoredChats = React.useCallback((): StoredChatItem[] => {
    try {
      const raw = window.localStorage.getItem(AI_CORE_CHATS_STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []

      return parsed.filter(
        (item): item is StoredChatItem =>
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.updatedAt === "number"
      )
    } catch {
      return []
    }
  }, [])

  const persistStoredChats = React.useCallback(
    (nextChats: StoredChatItem[]) => {
      setStoredChats(nextChats)
      window.localStorage.setItem(
        AI_CORE_CHATS_STORAGE_KEY,
        JSON.stringify(nextChats)
      )
      window.dispatchEvent(new CustomEvent(AI_CORE_CHATS_UPDATED_EVENT))
    },
    []
  )

  const toggleChatPin = React.useCallback(
    (chatId: string) => {
      const nextChats = storedChats.map((chat) =>
        chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat
      )
      persistStoredChats(nextChats)
    },
    [persistStoredChats, storedChats]
  )

  const startRenamingChat = React.useCallback(
    (chatId: string) => {
      const target = storedChats.find((chat) => chat.id === chatId)
      if (!target) return
      discardNextRenameSubmitRef.current = false
      setEditingChatId(chatId)
      setEditingChatTitle(target.title)
    },
    [storedChats]
  )

  const cancelRenamingChat = React.useCallback(() => {
    setEditingChatId(null)
    setEditingChatTitle("")
  }, [])

  const submitRenamingChat = React.useCallback(
    (chatId: string) => {
      if (discardNextRenameSubmitRef.current) {
        discardNextRenameSubmitRef.current = false
        cancelRenamingChat()
        return
      }

      const target = storedChats.find((chat) => chat.id === chatId)
      if (!target) {
        cancelRenamingChat()
        return
      }

      const trimmedTitle = editingChatTitle.trim()
      if (!trimmedTitle || trimmedTitle === target.title) {
        cancelRenamingChat()
        return
      }

      const nextChats = storedChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: trimmedTitle } : chat
      )
      persistStoredChats(nextChats)
      discardNextRenameSubmitRef.current = false
      cancelRenamingChat()
    },
    [cancelRenamingChat, editingChatTitle, persistStoredChats, storedChats]
  )

  const deleteChat = React.useCallback(
    (chatId: string) => {
      const target = storedChats.find((chat) => chat.id === chatId)
      if (!target) return

      const confirmed = window.confirm(`Delete "${target.title}"?`)
      if (!confirmed) return

      const nextChats = storedChats.filter((chat) => chat.id !== chatId)
      persistStoredChats(nextChats)

      if (activeChatId === chatId) {
        router.push("/ai-core")
      }
    },
    [activeChatId, persistStoredChats, router, storedChats]
  )

  const createNewChat = React.useCallback(() => {
    const now = Date.now()
    const id = `chat-${now}-${Math.random().toString(36).slice(2, 8)}`
    const nextChat: StoredChatItem = {
      id,
      title: "New chat",
      updatedAt: now,
      pinned: false,
      path: `/ai-core?chat=${id}`,
    }

    const nextChats = [nextChat, ...storedChats]
    persistStoredChats(nextChats)
    router.push(nextChat.path ?? "/ai-core")
  }, [persistStoredChats, router, storedChats])

  const openPersonalizationSettings = React.useCallback(() => {
    setActiveSettingsSection("Personalization")
    setSettingsOpen(true)
  }, [])

  const openMemoryChats = React.useCallback(() => {
    setIsChatsExpanded(true)
    router.push("/ai-core")
  }, [router])

  React.useEffect(() => {
    const syncChats = () => {
      setStoredChats(readStoredChats())
    }

    syncChats()

    const onStorage = (event: StorageEvent) => {
      if (event.key !== AI_CORE_CHATS_STORAGE_KEY) return
      syncChats()
    }

    window.addEventListener(
      AI_CORE_CHATS_UPDATED_EVENT,
      syncChats as EventListener
    )
    window.addEventListener("storage", onStorage)

    return () => {
      window.removeEventListener(
        AI_CORE_CHATS_UPDATED_EVENT,
        syncChats as EventListener
      )
      window.removeEventListener("storage", onStorage)
    }
  }, [readStoredChats])

  React.useEffect(() => {
    if (
      !isPlatformAdmin &&
      (adminSettingsSections as readonly SettingsSection[]).includes(
        activeSettingsSection
      )
    ) {
      setActiveSettingsSection("Account")
    }
  }, [activeSettingsSection, isPlatformAdmin])

  React.useEffect(() => {
    const handleOpenSettingsPanel = (event: Event) => {
      const detail = (event as CustomEvent<OpenSettingsPanelDetail>).detail
      const requestedSection = detail?.section
      const hasMemberTarget = Boolean(detail?.memberId || detail?.memberQuery)
      const fallbackSection = hasMemberTarget ? "Members" : undefined
      const targetSection = requestedSection ?? fallbackSection

      if (
        targetSection &&
        visibleSettingsSections.includes(targetSection as SettingsSection)
      ) {
        setActiveSettingsSection(targetSection as SettingsSection)
      }

      if (targetSection === "Members") {
        if (detail?.membersAction === "invite") {
          setMembersQuickSearchQuery("")
          setMembersQuickSelectedId(null)
          setMembersQuickInviteToken((previous) => previous + 1)
        } else {
          setMembersQuickSearchQuery(detail?.memberQuery ?? "")
          setMembersQuickSelectedId(detail?.memberId ?? null)
          setMembersQuickActionToken((previous) => previous + 1)
        }
      }

      setSettingsOpen(true)
    }

    window.addEventListener(
      OPEN_SETTINGS_PANEL_EVENT,
      handleOpenSettingsPanel as EventListener
    )
    return () =>
      window.removeEventListener(
        OPEN_SETTINGS_PANEL_EVENT,
        handleOpenSettingsPanel as EventListener
      )
  }, [visibleSettingsSections])

  const renderSettingsSectionButton = (section: SettingsSection) => {
    const SectionIcon = settingsSectionIcons[section]
    return (
      <button
        key={section}
        onClick={() => {
          if (section === "Contact Support") {
            window.location.href = "mailto:support@atmet.ai"
            return
          }
          if (section === "Help Docs") {
            window.open(
              HELP_DOCS_EXTERNAL_URL,
              "_blank",
              "noopener,noreferrer"
            )
            return
          }
          setActiveSettingsSection(section)
        }}
        className={cn(
          "flex h-7 w-full items-center justify-between rounded-md px-2 text-left text-sm transition-colors",
          activeSettingsSection === section
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <span className="flex items-center gap-2">
          <SectionIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
          <span>{section}</span>
        </span>
        <IconChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
      </button>
    )
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader className="gap-0 p-0">
        <div className="h-10 border-b border-sidebar-border px-2 py-1 group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:border-b-0">
          <VersionSwitcher
            workspaces={workspaces}
            defaultWorkspace={workspaces[0]}
          />
        </div>
        <div className="px-2 py-2 group-data-[collapsible=icon]:hidden">
          <SearchForm />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.url !== "#" && pathname.startsWith(item.url)}
                    className="h-7"
                    render={
                      item.url === "#" ? (
                        <a
                          href="#"
                          onClick={(event) => event.preventDefault()}
                        />
                      ) : (
                        <Link href={item.url} />
                      )
                    }
                  >
                    {item.iconType === "hugeicons" ? (
                      <HugeiconsIcon
                        icon={item.icon}
                        strokeWidth={1.35}
                        className="h-3.5 w-3.5 shrink-0 opacity-80"
                      />
                    ) : (
                      <item.icon className="h-3.5 w-3.5 shrink-0 opacity-80" stroke={1.5} />
                    )}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="h-7"
                  render={
                    <button
                      type="button"
                      onClick={() => setIsMemoryExpanded((previous) => !previous)}
                    />
                  }
                >
                  <Brain className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={1.6} />
                  <span>Memory</span>
                  <IconChevronRight
                    className={cn(
                      "ms-auto h-3.5 w-3.5 shrink-0 opacity-80 transition-transform duration-200",
                      isMemoryExpanded && "rotate-90"
                    )}
                  />
                </SidebarMenuButton>
                <div
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out group-data-[collapsible=icon]:hidden",
                    isMemoryExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "pointer-events-none grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="min-h-0">
                    <div className="mt-1 ms-4 space-y-1 border-s border-sidebar-border ps-2">
                      <button
                        type="button"
                        onClick={openPersonalizationSettings}
                        className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-left text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <Smile
                          className="h-3.5 w-3.5 shrink-0 opacity-80"
                          strokeWidth={1.6}
                        />
                        <span>Personalization</span>
                      </button>
                      <Link
                        href="/my-data"
                        className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <IconDatabase className="h-3.5 w-3.5 shrink-0 opacity-80" />
                        <span>My data</span>
                      </Link>
                      <button
                        type="button"
                        onClick={openMemoryChats}
                        className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-left text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <MessageSquare
                          className="h-3.5 w-3.5 shrink-0 opacity-80"
                          strokeWidth={1.6}
                        />
                        <span>Chats</span>
                      </button>
                    </div>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-12 pt-2 group-data-[collapsible=icon]:hidden">
          <div className="mb-1 flex items-center justify-between pr-2 pl-0">
            <button
              type="button"
              onClick={() =>
                setIsChatsExpanded((prev) => {
                  const nextIsExpanded = !prev
                  if (!nextIsExpanded) {
                    setVisibleChatsCount(INITIAL_VISIBLE_CHATS)
                  }
                  return nextIsExpanded
                })
              }
              aria-label={isChatsExpanded ? "Collapse chats" : "Expand chats"}
              className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="text-xs font-medium">Chats</span>
              <IconChevronRight
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  isChatsExpanded && "rotate-90"
                )}
              />
            </button>
            <button
              type="button"
              onClick={createNewChat}
              aria-label="Create new chat"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
              isChatsExpanded
                ? "grid-rows-[1fr] opacity-100"
                : "pointer-events-none grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <SidebarGroupContent>
                <SidebarMenu>
                  {pinnedChats.map((chat, index) => (
                    <SidebarMenuItem
                      key={chat.id}
                      className={cn("w-full", index > 0 && "mt-1")}
                    >
                      {editingChatId === chat.id ? (
                        <SidebarMenuButton
                          render={<div />}
                          className="h-7 pr-2"
                        >
                          <input
                            autoFocus
                            value={editingChatTitle}
                            onChange={(event) =>
                              setEditingChatTitle(event.target.value)
                            }
                            onFocus={(event) => event.currentTarget.select()}
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => {
                              event.stopPropagation()
                              if (event.key === "Enter") {
                                event.preventDefault()
                                submitRenamingChat(chat.id)
                              }
                              if (event.key === "Escape") {
                                event.preventDefault()
                                discardNextRenameSubmitRef.current = true
                                cancelRenamingChat()
                              }
                            }}
                            onBlur={() => submitRenamingChat(chat.id)}
                            className="h-6 w-full rounded-sm border border-input bg-transparent px-1.5 text-sm outline-hidden focus-visible:border-ring"
                            aria-label="Rename chat"
                          />
                        </SidebarMenuButton>
                      ) : (
                        <>
                          <SidebarMenuButton
                            isActive={
                              pathname.startsWith("/ai-core") &&
                              activeChatId === chat.id
                            }
                            render={
                              <Link
                                href={chat.path ?? `/ai-core?chat=${chat.id}`}
                              />
                            }
                            className="h-7 pr-10 group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground"
                          >
                            <span className="truncate text-sm">
                              {chat.title}
                            </span>
                          </SidebarMenuButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <SidebarMenuAction
                                  showOnHover
                                  className="z-10"
                                  onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                  }}
                                  aria-label="Chat options"
                                />
                              }
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              side="right"
                              className="min-w-36"
                            >
                              <DropdownMenuItem
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  toggleChatPin(chat.id)
                                }}
                              >
                                <PinOff className="h-4 w-4 opacity-80" />
                                Unpin chat
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  startRenamingChat(chat.id)
                                }}
                              >
                                <PenLine className="h-4 w-4 opacity-80" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  deleteChat(chat.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </SidebarMenuItem>
                  ))}
                  {pinnedChats.length > 0 && unpinnedChats.length > 0 && (
                    <li aria-hidden className="h-4" />
                  )}
                  {unpinnedChats.map((chat, index) => (
                    <SidebarMenuItem
                      key={chat.id}
                      className={cn("w-full", index > 0 && "mt-1")}
                    >
                      {editingChatId === chat.id ? (
                        <SidebarMenuButton
                          render={<div />}
                          className="h-7 pr-2"
                        >
                          <input
                            autoFocus
                            value={editingChatTitle}
                            onChange={(event) =>
                              setEditingChatTitle(event.target.value)
                            }
                            onFocus={(event) => event.currentTarget.select()}
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => {
                              event.stopPropagation()
                              if (event.key === "Enter") {
                                event.preventDefault()
                                submitRenamingChat(chat.id)
                              }
                              if (event.key === "Escape") {
                                event.preventDefault()
                                discardNextRenameSubmitRef.current = true
                                cancelRenamingChat()
                              }
                            }}
                            onBlur={() => submitRenamingChat(chat.id)}
                            className="h-6 w-full rounded-sm border border-input bg-transparent px-1.5 text-sm outline-hidden focus-visible:border-ring"
                            aria-label="Rename chat"
                          />
                        </SidebarMenuButton>
                      ) : (
                        <>
                          <SidebarMenuButton
                            isActive={
                              pathname.startsWith("/ai-core") &&
                              activeChatId === chat.id
                            }
                            render={
                              <Link
                                href={chat.path ?? `/ai-core?chat=${chat.id}`}
                              />
                            }
                            className="h-7 pr-10 group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground"
                          >
                            <span className="truncate text-sm">
                              {chat.title}
                            </span>
                          </SidebarMenuButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <SidebarMenuAction
                                  showOnHover
                                  className="z-10"
                                  onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                  }}
                                  aria-label="Chat options"
                                />
                              }
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              side="right"
                              className="min-w-36"
                            >
                              <DropdownMenuItem
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  toggleChatPin(chat.id)
                                }}
                              >
                                <Pin className="h-4 w-4 opacity-80" />
                                Pin chat
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  startRenamingChat(chat.id)
                                }}
                              >
                                <PenLine className="h-4 w-4 opacity-80" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  deleteChat(chat.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </SidebarMenuItem>
                  ))}
                  {sortedChats.length === 0 && (
                    <SidebarMenuItem>
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        Chats will appear here automatically.
                      </div>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
                {sortedChats.length > visibleChatsCount && (
                  <div className="mt-1 flex justify-center px-2">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleChatsCount((prev) =>
                          Math.min(prev + CHAT_LOAD_STEP, sortedChats.length)
                        )
                      }
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      aria-label="Show more chats"
                    >
                      <IconChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </SidebarGroupContent>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="group-data-[collapsible=icon]:justify-center"
              render={
                <a
                  href={CHANALOGE_EXTERNAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <RefreshCw className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>chanaloge</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
              <SheetTrigger
                render={
                  <SidebarMenuButton
                    isActive={settingsOpen}
                    className="group-data-[collapsible=icon]:justify-center"
                  />
                }
              >
                <IconSettings className="h-3.5 w-3.5 shrink-0 opacity-80" />
                <span>Settings</span>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="rounded-2xl border border-border p-0 data-[side=right]:!inset-y-auto data-[side=right]:!top-1/2 data-[side=right]:!right-1/2 data-[side=right]:!h-[min(78vh,720px)] data-[side=right]:!w-[min(980px,92vw)] data-[side=right]:!max-w-none data-[side=right]:!translate-x-1/2 data-[side=right]:!-translate-y-1/2"
              >
                <div className="flex h-full min-h-0 overflow-hidden rounded-2xl">
                  <aside className="w-64 border-r border-sidebar-border bg-sidebar">
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-sidebar-foreground">
                        Settings
                      </p>
                    </div>
                    <nav className="space-y-3 px-2 pt-4">
                      <div className="space-y-1">
                        {baseSettingsSections.map((section) =>
                          renderSettingsSectionButton(section)
                        )}
                      </div>
                      {isPlatformAdmin && (
                        <div className="space-y-1 border-t border-sidebar-border pt-3">
                          <p className="px-2 text-[11px] font-medium tracking-wide text-sidebar-foreground/55 uppercase">
                            Platform admin
                          </p>
                          {(adminSettingsSections as readonly AdminSettingsSection[]).map(
                            (section) => renderSettingsSectionButton(section)
                          )}
                        </div>
                      )}
                    </nav>
                  </aside>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <SheetHeader className="px-5 py-3 pe-10">
                      <SheetTitle className="text-sm font-semibold">
                        {activeSettingsSection}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="min-h-0 flex-1 overflow-auto p-4">
                      {activeSettingsSection === "Account" ? (
                        <AccountSettingsContent />
                      ) : activeSettingsSection === "Personalization" ? (
                        <PersonalizationSettingsContent />
                      ) : activeSettingsSection === "Notifications" ? (
                        <NotificationSettingsContent />
                      ) : activeSettingsSection === "General" ? (
                        <GeneralSettingsContent
                          currentTheme={theme}
                          setTheme={setTheme}
                        />
                      ) : activeSettingsSection === "Workspace" ? (
                        <WorkspaceSettingsContent
                          onGoToMembers={() =>
                            setActiveSettingsSection("Members")
                          }
                        />
                      ) : activeSettingsSection === "Members" ? (
                        <MembersSettingsContent
                          quickActionToken={membersQuickActionToken}
                          quickSearchQuery={membersQuickSearchQuery}
                          quickSelectedMemberId={membersQuickSelectedId}
                          quickInviteToken={membersQuickInviteToken}
                        />
                      ) : activeSettingsSection === "Integrations" ? (
                        <IntegrationsSettingsContent />
                      ) : activeSettingsSection === "Usage and limits" ? (
                        <UsageLimitsSettingsContent />
                      ) : activeSettingsSection === "Data controls" ? (
                        <DataControlsSettingsContent />
                      ) : activeSettingsSection === "Admin overview" ? (
                        <AdminOverviewSettingsContent />
                      ) : activeSettingsSection === "Access policies" ? (
                        <AccessPoliciesSettingsContent />
                      ) : activeSettingsSection === "Audit logs" ? (
                        <AuditLogsSettingsContent />
                      ) : activeSettingsSection === "Plans (soon)" ? (
                        <div className="flex min-h-[calc(78vh-9rem)] items-center justify-center rounded-xl bg-primary px-6 py-10">
                          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Soon
                          </h2>
                        </div>
                      ) : activeSettingsSection === "Refer and earn" ? (
                        <ReferAndEarnSettingsContent />
                      ) : activeSettingsSection === "Billing" ? (
                        <BillingSettingsContent
                          onGoToMembers={() =>
                            setActiveSettingsSection("Members")
                          }
                          onGoToUsageLimits={() =>
                            setActiveSettingsSection("Usage and limits")
                          }
                        />
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Manage {activeSettingsSection.toLowerCase()}{" "}
                            settings for your account and workspace.
                          </p>
                          <div className="mt-4 divide-y divide-border border-y border-border">
                            {settingsContent[activeSettingsSection].map(
                              (item) => (
                                <div
                                  key={item}
                                  className="flex items-center justify-between py-3"
                                >
                                  <span className="text-sm text-foreground">
                                    {item}
                                  </span>
                                  <Button
                                    size="xs"
                                    variant="ghost"
                                    className="px-1"
                                  >
                                    Edit
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="group-data-[collapsible=icon]:p-0!"
                  />
                }
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                  {currentUser.initials}
                </span>
                <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium">
                    {currentUser.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {currentUser.role}
                  </span>
                </span>
                <IconChevronUp className="ms-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-44">
                <DropdownMenuItem
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                >
                  {resolvedTheme === "dark" ? (
                    <IconSun className="h-4 w-4" stroke={1.5} />
                  ) : (
                    <IconMoon className="h-4 w-4" stroke={1.5} />
                  )}
                  Theme toggle
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconUser className="h-4 w-4" stroke={1.5} />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setActiveSettingsSection("Refer and earn")
                    setSettingsOpen(true)
                  }}
                >
                  <Gift className="h-4 w-4" strokeWidth={1.6} />
                  Refer and earn
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <IconLogout2 className="h-4 w-4" stroke={1.5} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
