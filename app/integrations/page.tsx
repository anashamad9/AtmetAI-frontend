"use client"

import * as React from "react"
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleSlash2,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenuCheckboxItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

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
    description: "Search and reference pages, databases, and documents from your Notion workspace.",
    logo: "N",
    connected: true,
    company: "Notion",
    category: "Productivity",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    description: "Connect performance and security insights to improve support answers.",
    logo: "C",
    connected: false,
    company: "Cloudflare",
    category: "Infrastructure",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Search conversations and channels to surface insights from your Slack workspace.",
    logo: "S",
    connected: true,
    company: "Slack",
    category: "Communication",
  },
  {
    id: "linear",
    name: "Linear",
    description: "Access and query issues, projects, and roadmaps from your Linear workspace.",
    logo: "L",
    connected: false,
    company: "Linear",
    category: "Productivity",
  },
  {
    id: "clickup",
    name: "ClickUp",
    description: "Ask your workspace documents, tasks, and project files from one place.",
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
    description: "Link support tickets and customer issues with your workflows.",
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

export default function IntegrationsPage() {
  const [nameQuery, setNameQuery] = React.useState("")
  const [connectionFilter, setConnectionFilter] = React.useState<
    "all" | "connected" | "not-connected"
  >("all")
  const [selectedCompanies, setSelectedCompanies] = React.useState<IntegrationApp["company"][]>(
    []
  )
  const [companyQuery, setCompanyQuery] = React.useState("")
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = React.useState(false)

  const companyOptions = React.useMemo(
    () =>
      Array.from(new Set(integrationApps.map((app) => app.company))).sort((a, b) =>
        a.localeCompare(b)
      ),
    []
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

    return integrationApps.filter((app) => {
      const matchesName =
        normalizedQuery.length === 0 || app.name.toLowerCase().includes(normalizedQuery)
      const matchesConnection =
        connectionFilter === "all" ||
        (connectionFilter === "connected" && app.connected) ||
        (connectionFilter === "not-connected" && !app.connected)
      const matchesCompany =
        selectedCompanies.length === 0 || selectedCompanies.includes(app.company)

      return matchesName && matchesConnection && matchesCompany
    })
  }, [connectionFilter, nameQuery, selectedCompanies])

  const toggleCompanySelection = React.useCallback((company: IntegrationApp["company"]) => {
    setSelectedCompanies((prev) => {
      if (prev.includes(company)) {
        return prev.filter((item) => item !== company)
      }
      return [...prev, company]
    })
  }, [])

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
      <div className="flex h-10 items-center border-b px-4 sm:px-6">
        <div
          className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto"
          data-slot="integrations-secondary-navbar"
        >
          <div className="relative h-7 min-w-64 shrink-0">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
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
            <DropdownMenuContent align="start" className="min-w-40 rounded-xl p-1">
              <DropdownMenuItem onClick={() => setConnectionFilter("all")}>
                <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConnectionFilter("connected")}>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Connected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConnectionFilter("not-connected")}>
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
            <DropdownMenuContent align="start" className="min-w-56 rounded-xl p-1">
              <div className="relative px-1 pb-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
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
                <div className="px-2 py-1.5 text-xs text-muted-foreground">No apps found.</div>
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
        </div>
      </div>

      <div className="flex-1 px-4 py-4 sm:px-6">
        <section>
          <div className="space-y-5">
            {integrationCategories.map((category) => {
              const categoryApps = filteredApps.filter((app) => app.category === category)
              if (categoryApps.length === 0) return null

              return (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">{category}</h2>
                    <span className="text-xs text-muted-foreground">{categoryApps.length} apps</span>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryApps.map((app) => (
                      <article
                        key={app.id}
                        className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 p-2.5 transition-colors hover:bg-muted/35"
                      >
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-xs font-semibold text-muted-foreground">
                          {app.logo}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold tracking-tight text-foreground">
                            {app.name}
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-muted-foreground">
                            {app.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={
                            app.connected
                              ? "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/80"
                              : "inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-black px-3 text-xs font-medium text-white transition-colors hover:bg-black/90"
                          }
                        >
                          {app.connected ? "Connected" : "Connect"}
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              )
            })}
            {filteredApps.length === 0 && (
              <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No integrations match your current filters.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
