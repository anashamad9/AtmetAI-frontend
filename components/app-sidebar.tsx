"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import { BarInteractive } from "@/components/charts/bar-interactive"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
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
  AiBrain01Icon,
  AiIdeaIcon,
  ApiIcon,
  Database01Icon,
  WorkflowCircle01Icon,
} from "@hugeicons/core-free-icons"
import {
  IconBell,
  IconBuilding,
  IconChartBar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCreditCard,
  IconFileText,
  IconHelpCircle,
  IconLogout2,
  IconMoon,
  IconSettings,
  IconShield,
  IconSun,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { Briefcase, Camera, Check, Clock3, Copy, Globe2, Hash, KeyRound, Languages, Mail, Monitor, MoreHorizontal, Palette, PenLine, Phone, Pin, PinOff, Plus, Search, SlidersHorizontal, Trash2, User, UserPlus } from "lucide-react"

const navItems = [
  { title: "AI Core", url: "/ai-core", icon: AiBrain01Icon },
  { title: "Workflow", url: "/workflow", icon: WorkflowCircle01Icon },
  { title: "Skills", url: "/skills", icon: AiIdeaIcon },
  { title: "My Data", url: "/my-data", icon: Database01Icon },
  { title: "Integrations", url: "/integrations", icon: ApiIcon },
]
const workspaces = ["Documentation", "Product", "Operations", "Marketing"]
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

const settingsContent: Record<(typeof settingsSections)[number], string[]> = {
  Account: ["Profile details", "Email and login", "Security"],
  Notifications: ["Email notifications", "Push notifications", "Digest frequency"],
  General: ["Theme and colors", "Font size", "Time zone", "Language"],
  Workspace: ["Workspace name", "Default workflow", "Region"],
  Members: ["Members", "Roles and permissions", "Invites"],
  "Usage and limits": ["Usage summary", "Rate limits", "Quota alerts"],
  "Data controls": ["Retention policy", "Data export", "Delete requests"],
  "Plans (soon)": ["Current plan", "Billing", "Upgrade options"],
  Billing: ["Payment methods", "Invoices", "Billing history"],
  "Help Docs": ["Help center", "Guides", "API references"],
  "Contact Support": ["Support contact", "Live chat", "Report a bug"],
}
const settingsSectionIcons: Record<(typeof settingsSections)[number], React.ComponentType<{ className?: string }>> = {
  Account: IconUser,
  Notifications: IconBell,
  General: Monitor,
  Workspace: IconBuilding,
  Members: IconUsers,
  "Usage and limits": IconChartBar,
  "Data controls": IconShield,
  "Plans (soon)": IconSettings,
  Billing: IconCreditCard,
  "Help Docs": IconFileText,
  "Contact Support": IconHelpCircle,
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
  { key: "credits", label: "Credits", limitKey: "creditsLimit" as const, usedKey: "creditsUsed" as const, unit: "" },
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
const INITIAL_VISIBLE_CHATS = 4
const CHAT_LOAD_STEP = 10
const APPEARANCE_SETTINGS_STORAGE_KEY = "atmet-appearance-settings"
const HELP_DOCS_EXTERNAL_URL = "https://atmet.ai/help-docs"
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
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    border: "rgb(37 99 235 / 22%)",
    input: "rgb(37 99 235 / 22%)",
    ring: "rgb(37 99 235 / 36%)",
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
    appearanceColorOptions.find((option) => option.id === colorId) ?? appearanceColorOptions[0]
  const root = document.documentElement

  root.style.setProperty("--primary", targetColor.primary)
  root.style.setProperty("--primary-foreground", targetColor.primaryForeground)
  root.style.setProperty("--sidebar-primary", targetColor.primary)
  root.style.setProperty("--sidebar-primary-foreground", targetColor.primaryForeground)
  root.style.setProperty("--ring", targetColor.ring)
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
  const [phoneNumber, setPhoneNumber] = React.useState(accountProfile.phoneNumber)
  const [selectedRole, setSelectedRole] = React.useState<(typeof roleOptions)[number] | string>(
    accountProfile.role
  )
  const [customRole, setCustomRole] = React.useState("")
  const displayedRole = selectedRole === "Other" ? customRole || "Other" : selectedRole
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
              <span className="pointer-events-none absolute inset-0 rounded-lg bg-background/20 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/avatar-edit:opacity-100 group-focus-within/avatar-edit:opacity-100" />
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="outline"
                    className="absolute inset-0 z-10 m-auto border-border/70 bg-background/90 opacity-0 shadow-xs transition-opacity duration-200 pointer-events-none group-hover/avatar-edit:pointer-events-auto group-hover/avatar-edit:opacity-100 group-focus-within/avatar-edit:pointer-events-auto group-focus-within/avatar-edit:opacity-100"
                    aria-label="Edit profile image"
                  />
                }
              >
                <PenLine className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="start" className="min-w-44 rounded-lg p-1">
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
            <Label className="text-muted-foreground" htmlFor="settings-first-name">
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
            <Label className="text-muted-foreground" htmlFor="settings-last-name">
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
              <DropdownMenuContent align="start" className="min-w-56 rounded-lg p-1">
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
              <p id="settings-user-id" className="font-mono text-sm text-foreground">
                {accountProfile.userId}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Copy user ID"
                onClick={() => void navigator.clipboard.writeText(accountProfile.userId)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 pb-1 pt-5">
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
              <p className="text-sm font-medium text-destructive">Danger Zone</p>
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
      <div className="mt-auto flex justify-end pb-1 pt-5">
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

function NotificationSettingsContent() {
  const digestOptions = ["Real-time", "Daily digest", "Weekly digest", "Off"] as const
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

  const [notificationSettings, setNotificationSettings] = React.useState(defaultSettings)
  const [savedNotificationSettings, setSavedNotificationSettings] = React.useState(defaultSettings)
  const categoryChannels =
    notificationSettings.categoryChannels ?? defaultSettings.categoryChannels
  const savedCategoryChannels =
    savedNotificationSettings.categoryChannels ?? defaultSettings.categoryChannels

  const hasUnsavedChanges =
    JSON.stringify(categoryChannels) !== JSON.stringify(savedCategoryChannels) ||
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
                        <p className="text-sm font-medium text-foreground">{category.label}</p>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={categoryChannels[category.key]?.email ?? false}
                          onChange={(event) =>
                            setNotificationSettings((prev) => ({
                              ...prev,
                              categoryChannels: {
                                ...(prev.categoryChannels ?? defaultSettings.categoryChannels),
                                [category.key]: {
                                  ...(prev.categoryChannels ?? defaultSettings.categoryChannels)[
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
                          checked={categoryChannels[category.key]?.inApp ?? false}
                          onChange={(event) =>
                            setNotificationSettings((prev) => ({
                              ...prev,
                              categoryChannels: {
                                ...(prev.categoryChannels ?? defaultSettings.categoryChannels),
                                [category.key]: {
                                  ...(prev.categoryChannels ?? defaultSettings.categoryChannels)[
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
          <Label className="text-muted-foreground" htmlFor="settings-digest-frequency">
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
            <DropdownMenuContent align="start" className="min-w-56 rounded-lg p-1">
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

      <div className="space-y-2 pb-1 pt-5">
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
                  setNotificationSettings((prev) => ({ ...prev, quietFrom: event.target.value }))
                }
                disabled={!notificationSettings.quietHours}
                className="h-7 w-28"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="time"
                value={notificationSettings.quietTo}
                onChange={(event) =>
                  setNotificationSettings((prev) => ({ ...prev, quietTo: event.target.value }))
                }
                disabled={!notificationSettings.quietHours}
                className="h-7 w-28"
              />
            </div>
          </div>
        </section>
      </div>
      <div className="mt-auto flex justify-end pb-1 pt-5">
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
  const languageOptions = ["English", "Arabic", "French", "Spanish", "German", "Japanese"] as const
  const initializedRef = React.useRef(false)
  const [appearanceSettings, setAppearanceSettings] = React.useState<AppearanceSettings>({
    theme: "system",
    colorId: "graphite",
    timezone: inferredTimezone,
    language: "English",
    fontScale: "default",
  })
  const [savedAppearanceSettings, setSavedAppearanceSettings] = React.useState<AppearanceSettings>({
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

    const rawSettings = window.localStorage.getItem(APPEARANCE_SETTINGS_STORAGE_KEY)
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
          parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system"
            ? parsed.theme
            : fallbackSettings.theme,
        colorId:
          appearanceColorOptions.some((option) => option.id === parsed.colorId)
            ? (parsed.colorId as AppearanceColorId)
            : fallbackSettings.colorId,
        timezone: typeof parsed.timezone === "string" ? parsed.timezone : fallbackSettings.timezone,
        language: typeof parsed.language === "string" ? parsed.language : fallbackSettings.language,
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
              {([
                { id: "light", label: "Light", icon: IconSun },
                { id: "dark", label: "Dark", icon: IconMoon },
                { id: "system", label: "System", icon: Monitor },
              ] as const).map((themeOption) => {
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
                    <div
                      className={cn(
                        "h-20 rounded-lg border p-2",
                        themeOption.id === "light" && "border-input/70 bg-muted/25",
                        themeOption.id === "dark" && "border-white/10 bg-slate-950",
                        themeOption.id === "system" &&
                          "border-input/70 bg-gradient-to-r from-muted/25 from-55% to-slate-950 to-55%"
                      )}
                    >
                      <div className="grid h-full grid-cols-4 gap-1">
                        <div
                          className={cn(
                            "col-span-1 rounded-md",
                            themeOption.id === "dark" ? "bg-white/5" : "bg-foreground/5"
                          )}
                        />
                        <div
                          className={cn(
                            "col-span-3 rounded-md border",
                            themeOption.id === "dark"
                              ? "border-white/10 bg-white/[0.03]"
                              : "border-foreground/10 bg-background/70",
                            themeOption.id === "system" && "border-foreground/10 bg-background/75"
                          )}
                        >
                          <div className="grid h-full grid-cols-3 gap-1 p-1">
                            {Array.from({ length: 9 }).map((_, idx) => (
                              <span
                                key={idx}
                                className={cn(
                                  "rounded-sm",
                                  themeOption.id === "dark" ? "bg-white/7" : "bg-foreground/8",
                                  themeOption.id === "system" && idx > 5 && "bg-white/12"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
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
            <div className="flex flex-wrap items-center gap-2">
              {appearanceColorOptions.map((colorOption) => (
                <button
                  key={colorOption.id}
                  type="button"
                  onClick={() =>
                    setAppearanceSettings((prev) => ({
                      ...prev,
                      colorId: colorOption.id,
                    }))
                  }
                  aria-label={colorOption.label}
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full border transition-all",
                    appearanceSettings.colorId === colorOption.id
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-input hover:scale-105"
                  )}
                >
                  <span
                    className="size-4 rounded-full border border-black/10"
                    style={{ backgroundColor: colorOption.primary }}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Applies to primary buttons and focused field borders.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "smaller", label: "Smaller" },
              { id: "default", label: "Default" },
              { id: "bigger", label: "Bigger" },
            ] as const).map((fontOption) => (
              <Button
                key={fontOption.id}
                type="button"
                variant={appearanceSettings.fontScale === fontOption.id ? "default" : "outline"}
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
          <p className="text-sm font-medium text-foreground">Time and language</p>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground" htmlFor="settings-timezone">
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
              <DropdownMenuContent align="start" className="min-w-56 rounded-lg p-1">
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
            <Label className="text-muted-foreground" htmlFor="settings-language">
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
              <DropdownMenuContent align="start" className="min-w-56 rounded-lg p-1">
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
      <div className="mt-auto flex justify-end pb-1 pt-5">
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
  const [workspaceName, setWorkspaceName] = React.useState(workspaceProfile.name)
  const [description, setDescription] = React.useState(workspaceProfile.description)

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
              <span className="pointer-events-none absolute inset-0 rounded-lg bg-background/20 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/workspace-avatar:opacity-100 group-focus-within/workspace-avatar:opacity-100" />
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="outline"
                    className="pointer-events-none absolute inset-0 z-10 m-auto border-border/70 bg-background/90 opacity-0 shadow-xs transition-opacity duration-200 group-hover/workspace-avatar:pointer-events-auto group-hover/workspace-avatar:opacity-100 group-focus-within/workspace-avatar:pointer-events-auto group-focus-within/workspace-avatar:opacity-100"
                    aria-label="Edit workspace image"
                  />
                }
              >
                <PenLine className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="start" className="min-w-44 rounded-lg p-1">
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
          <Label className="text-muted-foreground" htmlFor="settings-workspace-name">
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
            <Label className="text-muted-foreground" htmlFor="settings-workspace-email">
              <Mail className="h-3.5 w-3.5 text-muted-foreground/80" />
              Primary email
            </Label>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex size-4 items-center justify-center rounded-full border border-border text-[10px] font-semibold leading-none text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    aria-label="Primary email cannot be edited"
                  >
                    !
                  </button>
                }
              />
              <TooltipContent className="max-w-64 text-xs">
                You can&apos;t edit the primary email. Contact support to update your primary
                email.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <Input
              id="settings-workspace-email"
              type="email"
              value={workspaceProfile.primaryEmail}
              disabled
              className="h-7 cursor-not-allowed border-dashed bg-muted/55 pr-20 text-muted-foreground disabled:opacity-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-2 inline-flex items-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Read only
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-muted-foreground" htmlFor="settings-workspace-description">
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

      <div className="space-y-3 pb-1 pt-6">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Members</p>
              <p className="text-sm text-muted-foreground">
                Manage workspace members, invites, and permissions.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onGoToMembers}>
              <IconUsers className="h-3.5 w-3.5" />
              Go to members
            </Button>
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-destructive">Delete workspace</p>
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
      <div className="mt-auto flex justify-end pb-1 pt-5">
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

function MembersSettingsContent() {
  const roleFilters = ["All users", "Super Admin", "Admin", "Member"] as const
  const inviteRoleOptions = ["Member", "Admin", "Super Admin"] as const
  const creditsRanges = ["All time", "This month", "This week"] as const
  const seatsLimit = 10
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<(typeof roleFilters)[number]>("All users")
  const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(null)
  const [creditsRange, setCreditsRange] =
    React.useState<(typeof creditsRanges)[number]>("All time")
  const [isInviteOpen, setIsInviteOpen] = React.useState(false)
  const [inviteRole, setInviteRole] =
    React.useState<(typeof inviteRoleOptions)[number]>("Member")
  const [inviteInput, setInviteInput] = React.useState("")
  const [inviteEmails, setInviteEmails] = React.useState<string[]>([])
  const [inviteError, setInviteError] = React.useState("")
  const roleBadgeClasses: Record<WorkspaceMember["role"], string> = {
    "Super Admin":
      "border-violet-300/70 bg-violet-100/75 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300",
    Admin:
      "border-violet-300/70 bg-violet-100/75 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300",
    Member: "border-border bg-muted/55 text-muted-foreground",
  }
  const appStatusClasses: Record<WorkspaceMemberApp["status"], string> = {
    Connected: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Disconnected: "border-border bg-muted/55 text-muted-foreground",
  }

  const filteredMembers = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return workspaceMembers.filter((member) => {
      const matchesRole = roleFilter === "All users" || member.role === roleFilter
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
    () => workspaceMembers.find((member) => member.id === selectedMemberId) ?? null,
    [selectedMemberId]
  )
  const selectedCreditsUsage = React.useMemo(() => {
    if (!selectedMember) return 0
    if (creditsRange === "This month") return selectedMember.creditsUsage.thisMonth
    if (creditsRange === "This week") return selectedMember.creditsUsage.thisWeek
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
      return weights.map((weight) => Math.max(0, Math.round((total * weight) / weightSum)))
    }

    if (creditsRange === "All time") {
      const labels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]
      const values = buildSeries(selectedMember.creditsUsage.allTime, [9, 12, 11, 15, 16, 19, 18])
      return labels.map((label, index) => ({ label, value: values[index] ?? 0 }))
    }

    if (creditsRange === "This month") {
      const labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
      const values = buildSeries(selectedMember.creditsUsage.thisMonth, [22, 28, 24, 26])
      return labels.map((label, index) => ({ label, value: values[index] ?? 0 }))
    }

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const values = buildSeries(selectedMember.creditsUsage.thisWeek, [12, 16, 15, 14, 13, 17, 13])
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

  const submitInvite = () => {
    const tokens = inviteInput
      .split(/[\s,;]+/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validTokens = tokens.filter((token) => emailPattern.test(token))
    const merged = Array.from(
      new Set([...inviteEmails.map((email) => email.toLowerCase()), ...validTokens])
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
              <p className="text-sm font-semibold text-foreground">User profile</p>
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
                    <p className="text-sm font-medium text-foreground">{selectedMember.name}</p>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-[min(var(--radius-md),10px)] border px-2 py-0.5 text-[11px] font-medium",
                        roleBadgeClasses[selectedMember.role]
                      )}
                    >
                      {selectedMember.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedMember.profileRole}</p>
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    value={selectedMember.email}
                    disabled
                    className="h-7 cursor-not-allowed border-dashed bg-muted/55 text-muted-foreground disabled:opacity-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground">Last login</Label>
                  <Input
                    value={selectedMember.lastLogin}
                    disabled
                    className="h-7 cursor-not-allowed border-dashed bg-muted/55 text-muted-foreground disabled:opacity-100"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">Usage of credits</p>
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
                  <DropdownMenuContent align="end" className="min-w-32 rounded-lg p-1">
                    {creditsRanges.map((range) => (
                      <DropdownMenuItem key={range} onClick={() => setCreditsRange(range)}>
                        {range}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="rounded-xl border border-border bg-background px-3 py-2.5">
                <p className="text-base font-semibold text-foreground">{formattedCreditsUsage} credits</p>
                <p className="text-xs text-muted-foreground">
                  Consumption for {creditsRange.toLowerCase()}.
                </p>
                <BarInteractive data={creditsChartData} className="mt-2.5 h-44" />
              </div>
            </section>

            <section className="space-y-2.5">
              <p className="text-sm font-semibold text-foreground">Integrated apps</p>
              <div className="overflow-hidden rounded-xl border border-border bg-background">
                <table className="w-full table-fixed border-collapse text-[0.8rem]">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="w-[35%] px-2.5 py-1.5 text-left font-medium">App</th>
                      <th className="w-[25%] px-2.5 py-1.5 text-left font-medium">Category</th>
                      <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">Status</th>
                      <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">Last used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMember.integratedApps.map((app) => (
                      <tr key={app.name} className="border-b border-border/70 last:border-b-0">
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
                          <span
                            className={cn(
                              "inline-flex items-center rounded-[min(var(--radius-md),10px)] border px-2 py-0.5 text-[11px] font-medium",
                              appStatusClasses[app.status]
                            )}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="truncate px-2.5 py-1.5 text-muted-foreground">{app.lastUsed}</td>
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
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
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
              <DropdownMenuContent align="start" className="min-w-40 rounded-lg p-1">
                {roleFilters.map((role) => (
                  <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)}>
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button type="button" size="sm" onClick={() => setIsInviteOpen(true)}>
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
            <div className="h-full rounded-full bg-primary/80" style={{ width: `${seatsProgress}%` }} />
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
                    className="cursor-pointer border-b border-border/70 transition-colors hover:bg-muted/35 last:border-b-0"
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
                          <p className="truncate text-[11px] text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2.5 py-1.5 pe-3 text-[0.8rem] text-foreground">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-[min(var(--radius-md),10px)] border px-2 py-0.5 text-[11px] font-medium",
                          roleBadgeClasses[member.role]
                        )}
                      >
                        {member.role}
                      </span>
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
                        <DropdownMenuContent align="end" className="min-w-40 rounded-lg p-1">
                          <DropdownMenuItem onClick={() => setSelectedMemberId(member.id)}>
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
                <p className="text-sm font-semibold text-foreground">Invite team members</p>
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
                <Label className="text-muted-foreground">Send invite to ...</Label>
                <div className="flex min-h-24 flex-wrap content-start items-start gap-1.5 rounded-lg border border-input bg-background px-2.5 py-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
                  {inviteEmails.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1.5 rounded-[min(var(--radius-md),10px)] border border-border bg-muted/45 px-2 py-0.5 text-[11px] text-foreground"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() =>
                          setInviteEmails((previous) => previous.filter((item) => item !== email))
                        }
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`Remove ${email}`}
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </span>
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
                          setInviteError("Some entries were ignored because they are invalid.")
                        }
                      }
                    }}
                    onPaste={(event) => {
                      const pasted = event.clipboardData.getData("text")
                      if (!/[,\n;\s]/.test(pasted)) return
                      event.preventDefault()
                      const { invalid } = addInviteEmails(pasted)
                      if (invalid > 0) {
                        setInviteError("Some entries were ignored because they are invalid.")
                      }
                    }}
                    onBlur={() => {
                      if (!inviteInput.trim()) return
                      const { invalid } = addInviteEmails(inviteInput)
                      setInviteInput("")
                      if (invalid > 0) {
                        setInviteError("Some entries were ignored because they are invalid.")
                      }
                    }}
                    placeholder={inviteEmails.length === 0 ? "name@company.com" : ""}
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
                  <DropdownMenuContent align="start" className="min-w-40 rounded-lg p-1">
                    {inviteRoleOptions.map((role) => (
                      <DropdownMenuItem key={role} onClick={() => setInviteRole(role)}>
                        {role}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {inviteError && <p className="text-xs text-destructive">{inviteError}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
              <Button type="button" variant="outline" size="sm" onClick={closeInviteModal}>
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
  const [usageRange, setUsageRange] = React.useState<(typeof usageRanges)[number]>("This month")
  const defaultUserLimits = React.useMemo<Record<string, number>>(
    () =>
      Object.fromEntries(
        workspaceMembers.map((member) => [
          member.id,
          member.role === "Super Admin" ? 6000 : member.role === "Admin" ? 4000 : 2500,
        ])
      ),
    []
  )
  const [userLimits, setUserLimits] = React.useState<Record<string, number>>(defaultUserLimits)
  const [savedUserLimits, setSavedUserLimits] =
    React.useState<Record<string, number>>(defaultUserLimits)

  const stats = usageRangeStats[usageRange]
  const creditsPercentage = Math.min(100, (stats.creditsUsed / stats.creditsLimit) * 100)
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
          <p className="text-sm font-semibold text-foreground">Usage overview</p>
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
              <DropdownMenuItem key={range} onClick={() => setUsageRange(range)}>
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
              {stats.creditsUsed.toLocaleString()} / {stats.creditsLimit.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">API requests</p>
            <p className="text-sm font-semibold text-foreground">
              {stats.apiRequests.toLocaleString()} / {stats.apiLimit.toLocaleString()}
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

        <section className="rounded-xl border border-border bg-background px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">Credits trend</p>
            <span className="text-xs text-muted-foreground">{creditsPercentage.toFixed(0)}% of quota</span>
          </div>
          <BarInteractive data={chartData} className="mt-2.5 h-44 border-0 bg-transparent p-0" />
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-background">
          <table className="w-full table-fixed border-collapse text-[0.8rem]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="w-[30%] px-2.5 py-1.5 text-left font-medium">Resource</th>
                <th className="w-[35%] px-2.5 py-1.5 text-left font-medium">Usage</th>
                <th className="w-[20%] px-2.5 py-1.5 text-left font-medium">Limit</th>
                <th className="w-[15%] px-2.5 py-1.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {usageLimitsRows.map((row) => {
                const used = stats[row.usedKey]
                const limit = stats[row.limitKey]
                const progress = Math.min(100, (used / Math.max(limit, 1)) * 100)
                const nearLimit = progress >= 80
                return (
                  <tr key={row.key} className="border-b border-border/70 last:border-b-0">
                    <td className="px-2.5 py-1.5 font-medium text-foreground">{row.label}</td>
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
                      <span
                        className={cn(
                          "inline-flex items-center rounded-[min(var(--radius-md),10px)] border px-2 py-0.5 text-[11px] font-medium",
                          nearLimit
                            ? "border-destructive/25 bg-destructive/10 text-destructive"
                            : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        )}
                      >
                        {nearLimit ? "Near limit" : "Within limit"}
                      </span>
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
              <p className="text-sm font-semibold text-foreground">Per-user limits</p>
              <p className="text-xs text-muted-foreground">
                Set a monthly credits cap for each member.
              </p>
            </div>
          </div>
          <table className="w-full table-fixed border-collapse text-[0.8rem]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="w-[46%] px-2.5 py-1.5 text-left font-medium">User</th>
                <th className="w-[22%] px-2.5 py-1.5 text-left font-medium">User type</th>
                <th className="w-[24%] px-2.5 py-1.5 text-left font-medium">Monthly limit</th>
                <th className="w-[8%] px-2.5 py-1.5 text-left font-medium">Unit</th>
              </tr>
            </thead>
            <tbody>
              {workspaceMembers.map((member) => (
                <tr key={member.id} className="border-b border-border/70 last:border-b-0">
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
                        <p className="truncate text-[0.8rem] font-medium text-foreground">{member.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2.5 py-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-[min(var(--radius-md),10px)] border px-2 py-0.5 text-[11px] font-medium",
                        member.role === "Member"
                          ? "border-border bg-muted/55 text-muted-foreground"
                          : "border-violet-300/70 bg-violet-100/75 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300"
                      )}
                    >
                      {member.role}
                    </span>
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
                          [member.id]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
                        }))
                      }}
                      className="h-7"
                    />
                  </td>
                  <td className="px-2.5 py-1.5 text-muted-foreground">credits</td>
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
            <p className="text-sm font-medium text-foreground">Delete all uploaded files</p>
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
            <p className="text-sm font-medium text-foreground">Delete all chats and workflows</p>
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
                  <p className="text-sm font-semibold text-foreground">Free plan</p>
                  <p className="text-sm text-muted-foreground">$0.00 per user/month, billed monthly</p>
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
                <p className="text-sm text-muted-foreground">Renews on Apr 20, 2026</p>
              </div>
              <div className="flex items-end justify-between">
                <button
                  type="button"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Show details
                </button>
                <p className="text-3xl font-semibold leading-none text-foreground">$0.00</p>
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
              <div className="h-full rounded-full bg-primary/80" style={{ width: `${seatsProgress}%` }} />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onGoToMembers}>
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
              <div className="h-full rounded-full bg-primary/35" style={{ width: `${creditsProgress}%` }} />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onGoToUsageLimits}>
              Usage
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-background px-4 py-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">Manage billing</p>
            <p className="text-sm text-muted-foreground">View and manage your billing details.</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => window.open(BILLING_PORTAL_EXTERNAL_URL, "_blank", "noopener,noreferrer")}
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
        <Button type="button" variant="outline" size="sm" className="text-destructive hover:text-destructive">
          Cancel subscription
        </Button>
      </div>
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [activeSettingsSection, setActiveSettingsSection] = React.useState<
    (typeof settingsSections)[number]
  >("Account")
  const [storedChats, setStoredChats] = React.useState<StoredChatItem[]>([])
  const [isChatsExpanded, setIsChatsExpanded] = React.useState(true)
  const [visibleChatsCount, setVisibleChatsCount] = React.useState(INITIAL_VISIBLE_CHATS)
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

  const persistStoredChats = React.useCallback((nextChats: StoredChatItem[]) => {
    setStoredChats(nextChats)
    window.localStorage.setItem(AI_CORE_CHATS_STORAGE_KEY, JSON.stringify(nextChats))
    window.dispatchEvent(new CustomEvent(AI_CORE_CHATS_UPDATED_EVENT))
  }, [])

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

  React.useEffect(() => {
    const syncChats = () => {
      setStoredChats(readStoredChats())
    }

    syncChats()

    const onStorage = (event: StorageEvent) => {
      if (event.key !== AI_CORE_CHATS_STORAGE_KEY) return
      syncChats()
    }

    window.addEventListener(AI_CORE_CHATS_UPDATED_EVENT, syncChats as EventListener)
    window.addEventListener("storage", onStorage)

    return () => {
      window.removeEventListener(AI_CORE_CHATS_UPDATED_EVENT, syncChats as EventListener)
      window.removeEventListener("storage", onStorage)
    }
  }, [readStoredChats])

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader className="gap-0 p-0">
        <div className="h-10 border-b border-sidebar-border px-2 py-1 group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:border-b-0">
          <VersionSwitcher workspaces={workspaces} defaultWorkspace={workspaces[0]} />
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
                        <a href="#" onClick={(event) => event.preventDefault()} />
                      ) : (
                        <Link href={item.url} />
                      )
                    }
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={1.35}
                      className="h-3.5 w-3.5 shrink-0 opacity-80"
                    />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-12 pt-2">
          <div className="mb-1 flex items-center justify-between pl-0 pr-2">
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
              isChatsExpanded ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <SidebarGroupContent>
                <SidebarMenu>
              {pinnedChats.map((chat, index) => (
                <SidebarMenuItem key={chat.id} className={cn("w-full", index > 0 && "mt-1")}>
                  {editingChatId === chat.id ? (
                    <SidebarMenuButton render={<div />} className="h-7 pr-2">
                      <input
                        autoFocus
                        value={editingChatTitle}
                        onChange={(event) => setEditingChatTitle(event.target.value)}
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
                        className="h-6 w-full rounded-sm border border-sidebar-border bg-transparent px-1.5 text-sm outline-hidden focus-visible:ring-1 focus-visible:ring-sidebar-ring"
                        aria-label="Rename chat"
                      />
                    </SidebarMenuButton>
                  ) : (
                    <>
                      <SidebarMenuButton
                        isActive={pathname.startsWith("/ai-core") && activeChatId === chat.id}
                        render={<Link href={chat.path ?? `/ai-core?chat=${chat.id}`} />}
                        className="h-7 pr-10 group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground"
                      >
                        <span className="truncate text-sm">{chat.title}</span>
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
                        <DropdownMenuContent align="end" side="right" className="min-w-36">
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
                <SidebarMenuItem key={chat.id} className={cn("w-full", index > 0 && "mt-1")}>
                  {editingChatId === chat.id ? (
                    <SidebarMenuButton render={<div />} className="h-7 pr-2">
                      <input
                        autoFocus
                        value={editingChatTitle}
                        onChange={(event) => setEditingChatTitle(event.target.value)}
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
                        className="h-6 w-full rounded-sm border border-sidebar-border bg-transparent px-1.5 text-sm outline-hidden focus-visible:ring-1 focus-visible:ring-sidebar-ring"
                        aria-label="Rename chat"
                      />
                    </SidebarMenuButton>
                  ) : (
                    <>
                      <SidebarMenuButton
                        isActive={pathname.startsWith("/ai-core") && activeChatId === chat.id}
                        render={<Link href={chat.path ?? `/ai-core?chat=${chat.id}`} />}
                        className="h-7 pr-10 group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground"
                      >
                        <span className="truncate text-sm">{chat.title}</span>
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
                        <DropdownMenuContent align="end" side="right" className="min-w-36">
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
                className="data-[side=right]:!inset-y-auto data-[side=right]:!right-1/2 data-[side=right]:!top-1/2 data-[side=right]:!h-[min(78vh,720px)] data-[side=right]:!w-[min(980px,92vw)] data-[side=right]:!max-w-none data-[side=right]:!-translate-y-1/2 data-[side=right]:!translate-x-1/2 rounded-2xl border border-border p-0"
              >
                <div className="flex h-full min-h-0 overflow-hidden rounded-2xl">
                  <aside className="w-64 border-r border-sidebar-border bg-sidebar">
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-sidebar-foreground">Settings</p>
                    </div>
                    <nav className="space-y-1 px-2 pt-4">
                      {settingsSections.map((section) => {
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
                              window.open(HELP_DOCS_EXTERNAL_URL, "_blank", "noopener,noreferrer")
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
                      })}
                    </nav>
                  </aside>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <SheetHeader className="px-5 py-3 pe-10">
                      <SheetTitle className="text-sm font-semibold">{activeSettingsSection}</SheetTitle>
                    </SheetHeader>
                    <div className="min-h-0 flex-1 overflow-auto p-4">
                      {activeSettingsSection === "Account" ? (
                        <AccountSettingsContent />
                      ) : activeSettingsSection === "Notifications" ? (
                        <NotificationSettingsContent />
                      ) : activeSettingsSection === "General" ? (
                        <GeneralSettingsContent currentTheme={theme} setTheme={setTheme} />
                      ) : activeSettingsSection === "Workspace" ? (
                        <WorkspaceSettingsContent
                          onGoToMembers={() => setActiveSettingsSection("Members")}
                        />
                      ) : activeSettingsSection === "Members" ? (
                        <MembersSettingsContent />
                      ) : activeSettingsSection === "Usage and limits" ? (
                        <UsageLimitsSettingsContent />
                      ) : activeSettingsSection === "Data controls" ? (
                        <DataControlsSettingsContent />
                      ) : activeSettingsSection === "Billing" ? (
                        <BillingSettingsContent
                          onGoToMembers={() => setActiveSettingsSection("Members")}
                          onGoToUsageLimits={() => setActiveSettingsSection("Usage and limits")}
                        />
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Manage {activeSettingsSection.toLowerCase()} settings for your account
                            and workspace.
                          </p>
                          <div className="mt-4 divide-y divide-border border-y border-border">
                            {settingsContent[activeSettingsSection].map((item) => (
                              <div key={item} className="flex items-center justify-between py-3">
                                <span className="text-sm text-foreground">{item}</span>
                                <Button size="xs" variant="ghost" className="px-1">
                                  Edit
                                </Button>
                              </div>
                            ))}
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
                  <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:p-0!" />
                }
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                  {currentUser.initials}
                </span>
                <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium">{currentUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{currentUser.role}</span>
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
                    <IconSun className="h-4 w-4" />
                  ) : (
                    <IconMoon className="h-4 w-4" />
                  )}
                  Theme toggle
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconUser className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <IconLogout2 className="h-4 w-4" />
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
