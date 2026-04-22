"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleSlash2,
  Code2,
  Database,
  LifeBuoy,
  MessageCircle,
  Search,
  Server,
} from "lucide-react"

import { Pattern as EmptyIntegrationsPattern } from "@/components/examples/c-empty-19"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

const categoryMeta: Record<
  IntegrationApp["category"],
  {
    icon: React.ComponentType<{ className?: string }>
    iconClassName: string
  }
> = {
  Productivity: {
    icon: Briefcase,
    iconClassName: "text-blue-500",
  },
  Communication: {
    icon: MessageCircle,
    iconClassName: "text-violet-500",
  },
  Infrastructure: {
    icon: Server,
    iconClassName: "text-amber-500",
  },
  Development: {
    icon: Code2,
    iconClassName: "text-emerald-500",
  },
  CRM: {
    icon: Database,
    iconClassName: "text-pink-500",
  },
  Storage: {
    icon: Database,
    iconClassName: "text-cyan-500",
  },
  Support: {
    icon: LifeBuoy,
    iconClassName: "text-orange-500",
  },
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

export default function IntegrationsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [apps, setApps] = React.useState<IntegrationApp[]>(integrationApps)
  const [nameQuery, setNameQuery] = React.useState("")
  const [connectionFilter, setConnectionFilter] = React.useState<
    "all" | "connected" | "not-connected"
  >("all")
  const [selectedAppId, setSelectedAppId] = React.useState<string>(
    integrationApps[0]?.id ?? ""
  )
  const [isAppDetailsOpen, setIsAppDetailsOpen] = React.useState(false)
  const [pendingInstallApp, setPendingInstallApp] =
    React.useState<IntegrationApp | null>(null)
  const [isMemoryReferenceEnabled, setIsMemoryReferenceEnabled] =
    React.useState(false)

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

      return matchesName && matchesConnection
    })
  }, [apps, connectionFilter, nameQuery])

  const installedApps = React.useMemo(
    () => apps.filter((app) => app.connected),
    [apps]
  )

  const installedCategories = React.useMemo(
    () =>
      Array.from(new Set(installedApps.map((app) => app.category))).sort(
        (firstCategory, secondCategory) =>
          firstCategory.localeCompare(secondCategory)
      ),
    [installedApps]
  )

  const selectedApp = React.useMemo(
    () => apps.find((app) => app.id === selectedAppId) ?? null,
    [apps, selectedAppId]
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

  const openAppDetails = React.useCallback(
    (appId: string) => {
      setSelectedAppId(appId)
      setIsAppDetailsOpen(true)
      setIntegrationAppInQuery(appId)
    },
    [setIntegrationAppInQuery]
  )

  const closeAppDetails = React.useCallback(() => {
    setIsAppDetailsOpen(false)
    setIntegrationAppInQuery(null)
  }, [setIntegrationAppInQuery])

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
      ? "All Integrations"
      : connectionFilter === "connected"
        ? "Installed"
        : "Not Installed"

  const shouldRenderConnectedEmptyState =
    connectionFilter === "connected" || apps.every((app) => !app.connected)

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Integrations
            </h1>
            <p className="text-sm text-muted-foreground">
              Connect external apps and manage your workspace integrations.
            </p>
          </header>

          {isAppDetailsOpen && selectedApp ? (
            <section className="space-y-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeAppDetails}
                className="h-8 w-fit rounded-lg border-border/70 px-3 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to apps
              </Button>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                <article className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted text-sm font-semibold text-muted-foreground">
                      {selectedApp.logo}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {selectedApp.company} · {selectedApp.category}
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                        {selectedApp.name}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {selectedApp.description} You can use this integration to
                    keep answers grounded in up-to-date context from{" "}
                    {selectedApp.name}.
                  </p>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      What you can do
                    </h3>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                      <li>Search and reference {selectedApp.name} content.</li>
                      <li>
                        Bring relevant records into prompts and team workflows.
                      </li>
                      <li>Control access by connecting only trusted apps.</li>
                    </ul>
                  </div>
                </article>

                <aside className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground">
                    Connection Status
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selectedApp.connected
                      ? `${selectedApp.name} is currently connected to this workspace.`
                      : `${selectedApp.name} is not connected yet. Install to enable access.`}
                  </p>

                  <Button
                    type="button"
                    onClick={() =>
                      selectedApp.connected
                        ? handleUnconnectApp(selectedApp.id)
                        : openInstallDialog(selectedApp)
                    }
                    className={
                      selectedApp.connected
                        ? "mt-4 h-9 w-full rounded-lg border border-sidebar-border bg-sidebar text-sm font-medium text-foreground hover:bg-sidebar-accent"
                        : "mt-4 h-9 w-full rounded-lg bg-black text-sm font-medium text-white hover:bg-black/90"
                    }
                  >
                    {selectedApp.connected
                      ? "Connected"
                      : `Install ${selectedApp.name}`}
                  </Button>
                </aside>
              </div>
            </section>
          ) : (
            <>
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">
                    Installed
                  </h2>
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-accent px-1.5 text-[11px] font-medium text-muted-foreground">
                    {installedCategories.length}
                  </span>
                </div>

                {installedCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {installedCategories.map((category) => {
                      const Icon = categoryMeta[category].icon
                      return (
                        <span
                          key={category}
                          className="inline-flex h-7 items-center gap-2 rounded-lg bg-sidebar px-2.5 text-xs text-foreground"
                        >
                          <Icon
                            className={`h-3.5 w-3.5 ${categoryMeta[category].iconClassName}`}
                          />
                          <span className="truncate">{category}</span>
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No installed integrations yet.
                  </p>
                )}
              </section>

              <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 justify-start gap-1.5 border-transparent bg-sidebar px-2.5 text-xs text-foreground hover:bg-sidebar-accent"
                      />
                    }
                  >
                    <span>{connectionFilterLabel}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="surface-sidebar-menu min-w-44 rounded-xl border p-1"
                  >
                    <DropdownMenuItem onClick={() => setConnectionFilter("all")}>
                      <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                      All Integrations
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setConnectionFilter("connected")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Installed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setConnectionFilter("not-connected")}
                    >
                      <CircleSlash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      Not Installed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={nameQuery}
                    onChange={(event) => setNameQuery(event.target.value)}
                    placeholder="Search"
                    className="surface-sidebar-field h-7 rounded-lg border-transparent pl-7 text-xs"
                  />
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Apps
                  </h2>
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-accent px-1.5 text-[11px] font-medium text-muted-foreground">
                    {filteredApps.length}
                  </span>
                </div>

                {filteredApps.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {filteredApps.map((app) => (
                      <article
                        key={app.id}
                        className="flex min-h-[184px] flex-col rounded-xl bg-sidebar p-3.5"
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-accent text-[11px] font-semibold text-muted-foreground">
                          {app.logo}
                        </span>

                        <div className="mt-2.5 space-y-1">
                          <button
                            type="button"
                            onClick={() => openAppDetails(app.id)}
                            className="text-left text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/75"
                          >
                            {app.name}
                          </button>
                          <p className="line-clamp-2 text-xs leading-4 text-muted-foreground">
                            {app.description}
                          </p>
                        </div>

                        <div className="mt-auto pt-3">
                          <Button
                            type="button"
                            onClick={() =>
                              app.connected
                                ? handleUnconnectApp(app.id)
                                : openAppDetails(app.id)
                            }
                            className={
                              app.connected
                                ? "h-8 w-full rounded-md bg-sidebar text-xs font-medium text-foreground hover:bg-sidebar-accent"
                                : "h-8 w-full rounded-md bg-black text-xs font-medium text-white hover:bg-black/90"
                            }
                          >
                            {app.connected ? "Connected" : "Install"}
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : shouldRenderConnectedEmptyState ? (
                  <EmptyIntegrationsPattern />
                ) : (
                  <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                    No integrations match your current filters.
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </section>

      <Dialog
        open={pendingInstallApp !== null}
        onOpenChange={(open: boolean) => {
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
