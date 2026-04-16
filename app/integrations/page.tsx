"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleSlash2,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenuCheckboxItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

type IntegrationApp = {
  id: string
  name: string
  description: string
  logo: string
  connected: boolean
  company:
    | "Google"
    | "Microsoft"
    | "Atlassian"
    | "Salesforce"
    | "Notion"
    | "Slack"
    | "Linear"
    | "ClickUp"
    | "Asana"
    | "Discord"
    | "HubSpot"
    | "Dropbox"
    | "Zendesk"
    | "Intercom"
    | "Freshworks"
    | "AWS"
    | "Vercel"
    | "Cloudflare"
    | "GitHub"
    | "GitLab"
    | "Pipedrive"
  category:
    | "Productivity"
    | "Communication"
    | "Infrastructure"
    | "Development"
    | "CRM"
    | "Storage"
    | "Support"
}

type IntegrationPreviewFrame = {
  id: string
  title: string
  subtitle: string
}

const integrationApps: IntegrationApp[] = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Search events and schedules from your Google Calendar.",
    logo: "31",
    connected: true,
    company: "Google",
    category: "Productivity",
  },
  {
    id: "notion",
    name: "Notion",
    description:
      "Search and reference pages, databases, and documents from your Notion workspace.",
    logo: "N",
    connected: true,
    company: "Notion",
    category: "Productivity",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    description:
      "Connect performance and security insights to improve support answers.",
    logo: "C",
    connected: false,
    company: "Cloudflare",
    category: "Infrastructure",
  },
  {
    id: "slack",
    name: "Slack",
    description:
      "Search conversations and channels to surface insights from your Slack workspace.",
    logo: "S",
    connected: true,
    company: "Slack",
    category: "Communication",
  },
  {
    id: "linear",
    name: "Linear",
    description:
      "Access and query issues, projects, and roadmaps from your Linear workspace.",
    logo: "L",
    connected: false,
    company: "Linear",
    category: "Productivity",
  },
  {
    id: "clickup",
    name: "ClickUp",
    description:
      "Ask your workspace documents, tasks, and project files from one place.",
    logo: "U",
    connected: false,
    company: "ClickUp",
    category: "Productivity",
  },
  {
    id: "asana",
    name: "Asana",
    description: "Track projects, tasks, and team timelines in one workspace.",
    logo: "A",
    connected: false,
    company: "Asana",
    category: "Productivity",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Sync issues and sprint planning details into your workflow.",
    logo: "J",
    connected: true,
    company: "Atlassian",
    category: "Development",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Connect repositories, pull requests, and deployment context.",
    logo: "GH",
    connected: true,
    company: "GitHub",
    category: "Development",
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "Reference merge requests, pipelines, and project activity.",
    logo: "GL",
    connected: false,
    company: "GitLab",
    category: "Development",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Search conversations and channels across your organization.",
    logo: "T",
    connected: false,
    company: "Microsoft",
    category: "Communication",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Bring server discussions and updates into your workflows.",
    logo: "D",
    connected: false,
    company: "Discord",
    category: "Communication",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Access contacts, deals, and pipeline activity with context.",
    logo: "H",
    connected: false,
    company: "HubSpot",
    category: "CRM",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect accounts, opportunities, and CRM records securely.",
    logo: "SF",
    connected: false,
    company: "Salesforce",
    category: "CRM",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Sync deals and sales process stages into your flows.",
    logo: "P",
    connected: false,
    company: "Pipedrive",
    category: "CRM",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Search and retrieve files from shared cloud folders.",
    logo: "DB",
    connected: true,
    company: "Dropbox",
    category: "Storage",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Reference docs, sheets, and files from team drives.",
    logo: "GD",
    connected: true,
    company: "Google",
    category: "Storage",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Access company files and folder structures in real time.",
    logo: "OD",
    connected: false,
    company: "Microsoft",
    category: "Storage",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Bring ticket history and support context into conversations.",
    logo: "Z",
    connected: false,
    company: "Zendesk",
    category: "Support",
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Connect customer conversations, inboxes, and help content.",
    logo: "I",
    connected: false,
    company: "Intercom",
    category: "Support",
  },
  {
    id: "freshdesk",
    name: "Freshdesk",
    description:
      "Link support tickets and customer issues with your workflows.",
    logo: "F",
    connected: false,
    company: "Freshworks",
    category: "Support",
  },
  {
    id: "aws",
    name: "AWS",
    description: "Monitor cloud services and pull operational insights.",
    logo: "AWS",
    connected: false,
    company: "AWS",
    category: "Infrastructure",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Track deployments, project status, and production logs.",
    logo: "V",
    connected: true,
    company: "Vercel",
    category: "Infrastructure",
  },
  {
    id: "monday",
    name: "Monday.com",
    description: "Track boards, owners, deadlines, and status updates.",
    logo: "M",
    connected: false,
    company: "Asana",
    category: "Productivity",
  },
  {
    id: "todoist",
    name: "Todoist",
    description: "Manage personal and team task lists with priorities.",
    logo: "TD",
    connected: false,
    company: "Notion",
    category: "Productivity",
  },
  {
    id: "trello",
    name: "Trello",
    description: "Organize cards, lists, and project progress in boards.",
    logo: "TR",
    connected: false,
    company: "Atlassian",
    category: "Productivity",
  },
  {
    id: "wrike",
    name: "Wrike",
    description: "Coordinate team projects, proofing, and approvals.",
    logo: "W",
    connected: false,
    company: "ClickUp",
    category: "Productivity",
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Query bases, tables, records, and linked data views.",
    logo: "AT",
    connected: false,
    company: "Notion",
    category: "Productivity",
  },
  {
    id: "miro",
    name: "Miro",
    description: "Sync collaborative whiteboards and workshop spaces.",
    logo: "MR",
    connected: false,
    company: "Slack",
    category: "Productivity",
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    description: "Review pull requests, branches, and repository activity.",
    logo: "BB",
    connected: false,
    company: "Atlassian",
    category: "Development",
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Monitor application errors, traces, and issue ownership.",
    logo: "SE",
    connected: false,
    company: "GitHub",
    category: "Development",
  },
  {
    id: "postman",
    name: "Postman",
    description: "Reference API collections, environments, and test results.",
    logo: "PM",
    connected: false,
    company: "GitLab",
    category: "Development",
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Inspect logs, metrics, and monitors for active services.",
    logo: "DD",
    connected: false,
    company: "AWS",
    category: "Development",
  },
  {
    id: "new-relic",
    name: "New Relic",
    description: "Track performance telemetry and alert health checks.",
    logo: "NR",
    connected: false,
    company: "Cloudflare",
    category: "Development",
  },
  {
    id: "circleci",
    name: "CircleCI",
    description: "Follow builds, workflow runs, and CI pipeline status.",
    logo: "CI",
    connected: false,
    company: "GitHub",
    category: "Development",
  },
]

const integrationCategories: Array<IntegrationApp["category"]> = [
  "Productivity",
  "Development",
  "Communication",
  "CRM",
  "Storage",
  "Support",
  "Infrastructure",
]

const companyLogoPlaceholders: Record<IntegrationApp["company"], string> = {
  Google: "G",
  Microsoft: "MS",
  Atlassian: "AT",
  Salesforce: "SF",
  Notion: "N",
  Slack: "SL",
  Linear: "LN",
  ClickUp: "CU",
  Asana: "AS",
  Discord: "DC",
  HubSpot: "HS",
  Dropbox: "DB",
  Zendesk: "ZD",
  Intercom: "IC",
  Freshworks: "FW",
  AWS: "AWS",
  Vercel: "V",
  Cloudflare: "CF",
  GitHub: "GH",
  GitLab: "GL",
  Pipedrive: "PD",
}

const INITIAL_VISIBLE_APPS = 5
const LOAD_MORE_STEP = 10
const SHOW_MORE_LOGO_COUNT = 9

function getSeededScore(seed: string, value: string) {
  const input = `${seed}:${value}`
  let hash = 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function getShowMorePreviewApps(
  category: IntegrationApp["category"],
  hiddenApps: IntegrationApp[],
  categoryApps: IntegrationApp[]
) {
  const sourceApps = hiddenApps.length > 0 ? hiddenApps : categoryApps

  return [...sourceApps]
    .sort(
      (firstApp, secondApp) =>
        getSeededScore(category, firstApp.id) -
        getSeededScore(category, secondApp.id)
    )
    .slice(0, SHOW_MORE_LOGO_COUNT)
}

function getAppPreviewFrames(app: IntegrationApp): IntegrationPreviewFrame[] {
  return Array.from({ length: 8 }, (_, index) => ({
    id: `${app.id}-preview-${index + 1}`,
    title: `${app.name} Preview ${index + 1}`,
    subtitle: `Workflow view ${index + 1}`,
  }))
}

export default function IntegrationsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [apps, setApps] = React.useState<IntegrationApp[]>(integrationApps)
  const [nameQuery, setNameQuery] = React.useState("")
  const [connectionFilter, setConnectionFilter] = React.useState<
    "all" | "connected" | "not-connected"
  >("all")
  const [selectedCompanies, setSelectedCompanies] = React.useState<
    IntegrationApp["company"][]
  >([])
  const [companyQuery, setCompanyQuery] = React.useState("")
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = React.useState(false)
  const [pendingInstallApp, setPendingInstallApp] =
    React.useState<IntegrationApp | null>(null)
  const [isMemoryReferenceEnabled, setIsMemoryReferenceEnabled] =
    React.useState(false)
  const [selectedAppId, setSelectedAppId] = React.useState<string>(
    integrationApps[0]?.id ?? ""
  )
  const [isAppDetailsOpen, setIsAppDetailsOpen] = React.useState(false)
  const [activePreviewIndex, setActivePreviewIndex] = React.useState(0)
  const [visibleAppsByCategory, setVisibleAppsByCategory] = React.useState<
    Record<IntegrationApp["category"], number>
  >(() =>
    integrationCategories.reduce(
      (accumulator, category) => ({
        ...accumulator,
        [category]: INITIAL_VISIBLE_APPS,
      }),
      {} as Record<IntegrationApp["category"], number>
    )
  )

  const companyOptions = React.useMemo(
    () =>
      Array.from(new Set(apps.map((app) => app.company))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [apps]
  )

  const filteredCompanyOptions = React.useMemo(() => {
    const normalizedQuery = companyQuery.trim().toLowerCase()
    if (!normalizedQuery) return companyOptions
    return companyOptions.filter((company) =>
      company.toLowerCase().includes(normalizedQuery)
    )
  }, [companyOptions, companyQuery])

  const filteredApps = React.useMemo(() => {
    const normalizedQuery = nameQuery.trim().toLowerCase()

    return apps.filter((app) => {
      const matchesName =
        normalizedQuery.length === 0 ||
        app.name.toLowerCase().includes(normalizedQuery)
      const matchesConnection =
        connectionFilter === "all" ||
        (connectionFilter === "connected" && app.connected) ||
        (connectionFilter === "not-connected" && !app.connected)
      const matchesCompany =
        selectedCompanies.length === 0 ||
        selectedCompanies.includes(app.company)

      return matchesName && matchesConnection && matchesCompany
    })
  }, [apps, connectionFilter, nameQuery, selectedCompanies])

  const selectedApp = React.useMemo(
    () => apps.find((app) => app.id === selectedAppId) ?? apps[0] ?? null,
    [apps, selectedAppId]
  )

  const toggleCompanySelection = React.useCallback(
    (company: IntegrationApp["company"]) => {
      setSelectedCompanies((prev) => {
        if (prev.includes(company)) {
          return prev.filter((item) => item !== company)
        }
        return [...prev, company]
      })
    },
    []
  )

  const handleConnectApp = React.useCallback((appId: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, connected: true } : app))
    )
  }, [])

  const handleUnconnectApp = React.useCallback((appId: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, connected: false } : app))
    )
  }, [])

  const openInstallDialog = React.useCallback((app: IntegrationApp) => {
    setPendingInstallApp(app)
    setIsMemoryReferenceEnabled(false)
  }, [])

  const closeInstallDialog = React.useCallback(() => {
    setPendingInstallApp(null)
    setIsMemoryReferenceEnabled(false)
  }, [])

  const handleConfirmInstall = React.useCallback(() => {
    if (!pendingInstallApp) return
    handleConnectApp(pendingInstallApp.id)
    closeInstallDialog()
  }, [closeInstallDialog, handleConnectApp, pendingInstallApp])

  const handleShowMoreApps = React.useCallback(
    (category: IntegrationApp["category"]) => {
      setVisibleAppsByCategory((prev) => ({
        ...prev,
        [category]: (prev[category] ?? INITIAL_VISIBLE_APPS) + LOAD_MORE_STEP,
      }))
    },
    []
  )

  const openAppDetails = React.useCallback((appId: string) => {
    setSelectedAppId(appId)
    setIsAppDetailsOpen(true)
  }, [])

  const setIntegrationAppInQuery = React.useCallback(
    (appId: string | null) => {
      const nextParams = new URLSearchParams(searchParams.toString())

      if (appId) {
        nextParams.set("app", appId)
      } else {
        nextParams.delete("app")
      }

      const nextQuery = nextParams.toString()
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      })
    },
    [pathname, router, searchParams]
  )

  React.useEffect(() => {
    setActivePreviewIndex(0)
  }, [selectedAppId])

  React.useEffect(() => {
    const appIdFromQuery = searchParams.get("app")
    if (!appIdFromQuery) {
      setIsAppDetailsOpen(false)
      return
    }

    const matchedApp = apps.find((app) => app.id === appIdFromQuery)
    if (!matchedApp) {
      setIsAppDetailsOpen(false)
      return
    }

    setSelectedAppId(matchedApp.id)
    setIsAppDetailsOpen(true)
  }, [apps, searchParams])

  const connectionFilterLabel =
    connectionFilter === "all"
      ? "All"
      : connectionFilter === "connected"
        ? "Connected"
        : "Not connected"
  const selectedCompaniesLabel =
    selectedCompanies.length === 0
      ? "All"
      : selectedCompanies.length === 1
        ? selectedCompanies[0]
        : `${selectedCompanies.length} selected`

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <div className="flex h-10 items-center border-b px-3">
        <div
          className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto"
          data-slot="integrations-secondary-navbar"
        >
          {isAppDetailsOpen ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 gap-1.5 rounded-lg border-border/60 bg-transparent px-2.5 text-xs"
              onClick={() => {
                setIsAppDetailsOpen(false)
                setIntegrationAppInQuery(null)
              }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to integrations
            </Button>
          ) : (
            <>
              <div className="relative h-7 min-w-64 shrink-0">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={nameQuery}
                  onChange={(event) => setNameQuery(event.target.value)}
                  placeholder="Search by app name..."
                  className="h-7 rounded-lg border-border/60 bg-transparent pl-7 text-xs"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 shrink-0 gap-1.5 rounded-lg border-border/60 bg-transparent px-2.5 text-xs"
                    />
                  }
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                  <span>{connectionFilterLabel}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-40 rounded-xl p-1"
                >
                  <DropdownMenuItem onClick={() => setConnectionFilter("all")}>
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setConnectionFilter("connected")}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Connected
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setConnectionFilter("not-connected")}
                  >
                    <CircleSlash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    Not connected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu
                open={isCompanyMenuOpen}
                onOpenChange={(open) => {
                  setIsCompanyMenuOpen(open)
                  if (!open) setCompanyQuery("")
                }}
              >
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 shrink-0 gap-1.5 rounded-lg border-border/60 bg-transparent px-2.5 text-xs"
                    />
                  }
                >
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Apps:</span>
                  <span>{selectedCompaniesLabel}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-56 rounded-xl p-1"
                >
                  <div className="relative px-1 pb-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={companyQuery}
                      onChange={(event) => setCompanyQuery(event.target.value)}
                      onKeyDown={(event) => event.stopPropagation()}
                      placeholder="Search apps..."
                      className="h-8 rounded-lg border-border/60 bg-transparent pl-8 text-xs"
                    />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault()
                      setSelectedCompanies([])
                    }}
                  >
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                    All apps
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {filteredCompanyOptions.length === 0 && (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      No apps found.
                    </div>
                  )}
                  {filteredCompanyOptions.map((company) => (
                    <DropdownMenuCheckboxItem
                      key={company}
                      checked={selectedCompanies.includes(company)}
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={() => toggleCompanySelection(company)}
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-muted text-[9px] font-semibold text-muted-foreground">
                        {companyLogoPlaceholders[company]}
                      </span>
                      <span>{company}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 px-0 py-4 sm:px-1 lg:px-2">
        <section className="mx-auto w-full max-w-4xl">
          <div className="space-y-6">
            {isAppDetailsOpen && selectedApp ? (
              <div className="space-y-4">
                {(() => {
                  const previewFrames = getAppPreviewFrames(selectedApp)
                  const maxPreviewIndex = previewFrames.length - 1
                  const boundedPreviewIndex = Math.min(
                    activePreviewIndex,
                    maxPreviewIndex
                  )
                  const activePreviewFrame =
                    previewFrames[boundedPreviewIndex] ?? previewFrames[0]

                  return (
                    <>
                <div className="space-y-4">
                  <div className="flex min-h-[72px] items-center gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-sm font-semibold text-foreground">
                      {selectedApp.logo}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h2 className="text-[2rem] font-semibold leading-tight tracking-tight text-foreground">
                        {selectedApp.name}
                      </h2>
                      <p className="text-base leading-6 text-muted-foreground">
                        Unlock smarter answers and faster team workflows.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-36 w-full rounded-lg border border-border bg-gradient-to-br from-muted to-background p-3">
                      <p className="text-sm font-semibold text-foreground">
                        {activePreviewFrame?.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activePreviewFrame?.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-border px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        onClick={() =>
                          setActivePreviewIndex((prev) =>
                            prev <= 0 ? maxPreviewIndex : prev - 1
                          )
                        }
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Left
                      </button>
                      <p className="text-xs text-muted-foreground">
                        {boundedPreviewIndex + 1} / {previewFrames.length}
                      </p>
                      <button
                        type="button"
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-border px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        onClick={() =>
                          setActivePreviewIndex((prev) =>
                            prev >= maxPreviewIndex ? 0 : prev + 1
                          )
                        }
                      >
                        Right
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {selectedApp.description} Use this integration to keep your AI
                    context aligned with the latest updates from{" "}
                    {selectedApp.name}.
                  </p>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        selectedApp.connected
                          ? handleUnconnectApp(selectedApp.id)
                          : openInstallDialog(selectedApp)
                      }
                      className={
                        selectedApp.connected
                          ? "inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                          : "inline-flex h-9 items-center justify-center rounded-lg bg-black px-3.5 text-sm font-medium text-white transition-colors hover:bg-black/90"
                      }
                    >
                      {selectedApp.connected
                        ? "Unconnect"
                        : `Connect ${selectedApp.name}`}
                    </button>
                  </div>
                </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <>
                <div className="flex aspect-[16/9] w-full items-center rounded-xl border border-border bg-muted/50 px-4 py-5 sm:px-5">
                  <p className="text-sm text-muted-foreground">
                    Banner content will be added here.
                  </p>
                </div>

                {integrationCategories.map((category) => {
              const categoryApps = filteredApps.filter(
                (app) => app.category === category
              )
              if (categoryApps.length === 0) return null
              const visibleCount =
                visibleAppsByCategory[category] ?? INITIAL_VISIBLE_APPS
              const visibleApps = categoryApps.slice(0, visibleCount)
              const hiddenApps = categoryApps.slice(visibleCount)
              const showMorePreviewApps = getShowMorePreviewApps(
                category,
                hiddenApps,
                categoryApps
              )
              const remainingAppsCount = hiddenApps.length

              return (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">
                      {category}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {categoryApps.length} apps
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {visibleApps.map((app) => (
                      <article
                        key={app.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-muted/25"
                        onClick={() => {
                          openAppDetails(app.id)
                          setIntegrationAppInQuery(app.id)
                        }}
                      >
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-semibold text-muted-foreground">
                          {app.logo}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold tracking-tight text-foreground">
                            {app.name}
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted-foreground">
                            {app.description}
                          </p>
                        </div>
                      </article>
                    ))}

                    {remainingAppsCount > 0 && (
                      <div className="flex items-center gap-2 py-1">
                        <div className="flex items-center gap-1">
                          {showMorePreviewApps.map((previewApp) => (
                            <span
                              key={previewApp.id}
                              className="inline-flex h-5 w-5 items-center justify-center text-[9px] font-semibold text-muted-foreground"
                            >
                              {previewApp.logo}
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleShowMoreApps(category)}
                          className="text-xs font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                        >
                          Show more
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
                })}
                {filteredApps.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                    No integrations match your current filters.
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <Dialog
        open={pendingInstallApp !== null}
        onOpenChange={(open) => {
          if (!open) closeInstallDialog()
        }}
      >
        <DialogContent className="flex max-h-[85vh] max-w-[calc(100%-1rem)] flex-col overflow-hidden rounded-2xl p-0 sm:max-w-[38rem]">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {pendingInstallApp
                ? `Install ${pendingInstallApp.name}`
                : "Install app"}
            </DialogTitle>
            <DialogDescription>
              Review permissions and confirm to connect this integration.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 pt-5 pb-3 sm:px-5">
            <div className="space-y-2.5 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-black text-sm font-semibold text-white">
                  AI
                </span>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold text-foreground">
                  {pendingInstallApp?.logo}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {pendingInstallApp
                    ? `Install ${pendingInstallApp.name}`
                    : "Install app"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Developed by {pendingInstallApp?.company}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 pr-2">
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Reference memories and chats
                  </h3>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Allow Atmet AI to reference relevant chats when sharing data
                    with {pendingInstallApp?.name} for more helpful responses.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Toggle memories and chats references"
                  aria-pressed={isMemoryReferenceEnabled}
                  onClick={() => setIsMemoryReferenceEnabled((prev) => !prev)}
                  className={`relative mt-1 inline-flex h-7 w-12 shrink-0 rounded-full border transition-colors ${
                    isMemoryReferenceEnabled
                      ? "border-black bg-black"
                      : "border-border bg-muted"
                  }`}
                >
                  <span
                    className={`mt-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      isMemoryReferenceEnabled
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <Separator className="my-3 bg-border/80" />

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold tracking-tight text-foreground">
                    You&apos;re in control
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Atmet AI respects your data and only accesses information
                    you explicitly permit.
                  </p>
                </div>

                <Separator className="bg-border/80" />

                <div>
                  <h4 className="text-sm font-semibold tracking-tight text-foreground">
                    Apps may introduce elevated risk
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    We secure your workspace, but connected apps can still be
                    targeted by attackers. Connect only trusted providers.
                  </p>
                </div>

                <Separator className="bg-border/80" />

                <div>
                  <h4 className="text-sm font-semibold tracking-tight text-foreground">
                    Data shared with this app
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Installing this app allows access to basic request metadata
                    and relevant context required to answer your prompts. Use of
                    this data follows the app{" "}
                    <span className="underline underline-offset-4">
                      Terms of Use
                    </span>{" "}
                    and{" "}
                    <span className="underline underline-offset-4">
                      Privacy Notice
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border bg-background px-4 py-3 sm:px-6">
            <Button
              type="button"
              onClick={handleConfirmInstall}
              className="h-10 w-full rounded-full bg-black text-sm font-semibold text-white hover:bg-black/90"
            >
              {pendingInstallApp
                ? `Install ${pendingInstallApp.name}`
                : "Install app"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
