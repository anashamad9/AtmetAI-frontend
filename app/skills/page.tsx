"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { OPEN_NEW_SKILL_DIALOG_EVENT } from "@/lib/skills-events"
import { IconPhoto } from "@tabler/icons-react"
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"

type SkillCategory = "Reasoning" | "Data" | "Automation" | "Support"
type SkillStatus = "Active" | "Draft"
type SkillSection =
  | "Marketing"
  | "Sales"
  | "Engineering"
  | "Finance"
  | "Operations"
  | "Support"
  | "Product"

type SkillItem = {
  id: string
  name: string
  description: string
  category: SkillCategory
  section: SkillSection
  status: SkillStatus
  updatedAt: string
  owner: string
  isUserCreated: boolean
  connectedApps?: string[]
}

const SECTION_ORDER: SkillSection[] = [
  "Marketing",
  "Sales",
  "Engineering",
  "Finance",
  "Operations",
  "Support",
  "Product",
]

const COMMON_APPS = [
  "Slack",
  "Notion",
  "Google Drive",
  "Gmail",
  "Jira",
  "GitHub",
  "Airtable",
  "Asana",
] as const

const INITIAL_SKILL_ITEMS: SkillItem[] = [
  {
    id: "skill-contract-risk",
    name: "Contract Risk Detector",
    description: "Identifies high-risk clauses and flags legal exceptions.",
    category: "Reasoning",
    section: "Operations",
    status: "Active",
    updatedAt: "2026-03-12",
    owner: "Sarah Chen",
    isUserCreated: false,
  },
  {
    id: "skill-policy-qa",
    name: "Policy QA",
    description: "Answers internal policy questions from indexed knowledge.",
    category: "Support",
    section: "Support",
    status: "Active",
    updatedAt: "2026-03-08",
    owner: "Nina Brooks",
    isUserCreated: false,
  },
  {
    id: "skill-invoice-struct",
    name: "Invoice Structuring",
    description: "Extracts invoice fields and normalizes vendor data.",
    category: "Data",
    section: "Sales",
    status: "Draft",
    updatedAt: "2026-03-01",
    owner: "Xi Sun",
    isUserCreated: false,
  },
  {
    id: "skill-ticket-orchestrator",
    name: "Ticket Orchestrator",
    description: "Creates and routes Jira tasks from workflow outcomes.",
    category: "Automation",
    section: "Engineering",
    status: "Active",
    updatedAt: "2026-02-26",
    owner: "Jay Park",
    isUserCreated: false,
  },
  {
    id: "skill-nda-explainer",
    name: "NDA Explainer",
    description: "Summarizes confidentiality terms in plain language.",
    category: "Reasoning",
    section: "Support",
    status: "Draft",
    updatedAt: "2026-02-20",
    owner: "Amir Haddad",
    isUserCreated: true,
  },
  {
    id: "skill-seo-cluster-writer",
    name: "SEO Cluster Writer",
    description:
      "Creates SEO content clusters and internal linking suggestions.",
    category: "Automation",
    section: "Marketing",
    status: "Active",
    updatedAt: "2026-03-15",
    owner: "You",
    isUserCreated: true,
  },
  {
    id: "skill-lead-qualification",
    name: "Lead Qualification",
    description: "Scores leads from inbound data and routes hot opportunities.",
    category: "Data",
    section: "Sales",
    status: "Active",
    updatedAt: "2026-03-10",
    owner: "Mia Torres",
    isUserCreated: false,
  },
  {
    id: "skill-release-notes-drafter",
    name: "Release Notes Drafter",
    description:
      "Drafts changelogs from merged pull requests and ticket links.",
    category: "Automation",
    section: "Engineering",
    status: "Draft",
    updatedAt: "2026-03-05",
    owner: "Noah Karim",
    isUserCreated: false,
  },
  {
    id: "skill-playbook-builder",
    name: "Playbook Builder",
    description: "Builds SOP playbooks for internal operations and onboarding.",
    category: "Support",
    section: "Operations",
    status: "Active",
    updatedAt: "2026-03-03",
    owner: "Leen Haddad",
    isUserCreated: false,
  },
  {
    id: "skill-finance-variance-monitor",
    name: "Budget Variance Monitor",
    description:
      "Tracks spending variance and flags unusual cost deviations across teams.",
    category: "Data",
    section: "Finance",
    status: "Active",
    updatedAt: "2026-03-09",
    owner: "Rana Kamel",
    isUserCreated: false,
  },
  {
    id: "skill-product-prioritizer",
    name: "Product Prioritizer",
    description:
      "Ranks product opportunities by impact, effort, and business constraints.",
    category: "Reasoning",
    section: "Product",
    status: "Draft",
    updatedAt: "2026-03-07",
    owner: "Adam Saleh",
    isUserCreated: false,
  },
]

const statusStyles: Record<SkillStatus, string> = {
  Active: "text-emerald-700 bg-emerald-50",
  Draft: "text-amber-700 bg-amber-50",
}

function SkillsPageContent() {
  const searchParams = useSearchParams()
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILL_ITEMS)
  const [nameFilter, setNameFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createSkillOpen, setCreateSkillOpen] = useState(false)
  const [newSkillTitle, setNewSkillTitle] = useState("")
  const [newSkillPrompt, setNewSkillPrompt] = useState("")
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [customAppDraft, setCustomAppDraft] = useState("")
  const [createSkillError, setCreateSkillError] = useState<string | null>(null)
  const sectionFilterParam = searchParams.get("section")
  const sectionFilter = useMemo<SkillSection | null>(() => {
    if (!sectionFilterParam) return null
    return (
      SECTION_ORDER.find(
        (section) => section.toLowerCase() === sectionFilterParam.toLowerCase()
      ) ?? null
    )
  }, [sectionFilterParam])

  const resetCreateSkillForm = useCallback(() => {
    setNewSkillTitle("")
    setNewSkillPrompt("")
    setSelectedApps([])
    setCustomAppDraft("")
    setCreateSkillError(null)
  }, [])

  useEffect(() => {
    const openCreateSkillDialog = () => {
      setCreateSkillOpen(true)
    }

    window.addEventListener(OPEN_NEW_SKILL_DIALOG_EVENT, openCreateSkillDialog)
    return () => {
      window.removeEventListener(OPEN_NEW_SKILL_DIALOG_EVENT, openCreateSkillDialog)
    }
  }, [])

  const closeCreateSkillDialog = useCallback(() => {
    setCreateSkillOpen(false)
    resetCreateSkillForm()
  }, [resetCreateSkillForm])

  const toggleAppConnection = useCallback((app: string) => {
    setSelectedApps((previous) => {
      if (previous.includes(app)) {
        return previous.filter((item) => item !== app)
      }
      return [...previous, app]
    })
  }, [])

  const addCustomApp = useCallback(() => {
    const normalized = customAppDraft.trim()
    if (!normalized) return

    setSelectedApps((previous) => {
      if (
        previous.some((app) => app.toLowerCase() === normalized.toLowerCase())
      ) {
        return previous
      }
      return [...previous, normalized]
    })
    setCustomAppDraft("")
  }, [customAppDraft])

  const removeConnectedApp = useCallback((app: string) => {
    setSelectedApps((previous) => previous.filter((item) => item !== app))
  }, [])

  const createSkill = useCallback(() => {
    const title = newSkillTitle.trim()
    const prompt = newSkillPrompt.trim()

    if (!title || !prompt) {
      setCreateSkillError("Title and prompt are required.")
      return
    }

    const connectedApps = selectedApps
      .map((app) => app.trim())
      .filter((app) => app.length > 0)

    const createdSkill: SkillItem = {
      id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: title,
      description:
        prompt.length > 120 ? `${prompt.slice(0, 117).trimEnd()}...` : prompt,
      category: "Automation",
      section: sectionFilter ?? "Operations",
      status: "Draft",
      updatedAt: new Date().toISOString().slice(0, 10),
      owner: "You",
      isUserCreated: true,
      connectedApps,
    }

    setSkills((previous) => [createdSkill, ...previous])
    setCreateSkillOpen(false)
    resetCreateSkillForm()
  }, [
    newSkillPrompt,
    newSkillTitle,
    resetCreateSkillForm,
    sectionFilter,
    selectedApps,
  ])

  const categoryOptions = useMemo(
    () => Array.from(new Set(skills.map((skill) => skill.category))),
    [skills]
  )

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const byName =
        nameFilter.trim().length === 0 ||
        skill.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        skill.description.toLowerCase().includes(nameFilter.toLowerCase())

      const byCategory =
        categoryFilter === "all" || skill.category === categoryFilter
      const byStatus = statusFilter === "all" || skill.status === statusFilter
      const bySection =
        sectionFilter === null || skill.section === sectionFilter

      return byName && byCategory && byStatus && bySection
    })
  }, [skills, nameFilter, categoryFilter, sectionFilter, statusFilter])

  const pinnedSkills = useMemo(
    () => filteredSkills.filter((skill) => skill.isUserCreated),
    [filteredSkills]
  )

  const sectionedSkills = useMemo(
    () =>
      SECTION_ORDER.map((section) => ({
        section,
        items: filteredSkills.filter(
          (skill) => !skill.isUserCreated && skill.section === section
        ),
      })).filter((group) => group.items.length > 0),
    [filteredSkills]
  )

  const categoryFilterLabel =
    categoryFilter === "all" ? "All categories" : categoryFilter
  const statusFilterLabel = statusFilter === "all" ? "All" : statusFilter

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <section className="flex h-10 items-center border-b border-border px-3">
        <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto">
          <div className="relative h-7 min-w-64 shrink-0">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={nameFilter}
              onChange={(event) => setNameFilter(event.target.value)}
              placeholder="Search by skill name..."
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
              <span className="text-muted-foreground">Category:</span>
              <span>{categoryFilterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-44 rounded-xl p-1"
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
              <Circle className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Status:</span>
              <span>{statusFilterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-40 rounded-xl p-1"
            >
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Draft")}>
                <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <div className="flex-1 px-3 py-4">
        <p className="mb-3 text-sm text-muted-foreground">
          {filteredSkills.length} skills
        </p>

        {pinnedSkills.length > 0 && (
          <section className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Pinned by you
              </h2>
              <span className="text-xs text-muted-foreground">
                {pinnedSkills.length} skills
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {pinnedSkills.map((skill) => (
                <article
                  key={skill.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="flex h-32 items-center justify-center border-b border-border bg-muted/40 text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <IconPhoto className="h-4 w-4" strokeWidth={1.7} />
                      Cover image
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {skill.name}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${statusStyles[skill.status]}`}
                      >
                        {skill.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {skill.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5">
                        {skill.category}
                      </span>
                      {skill.connectedApps?.map((app) => (
                        <span
                          key={`${skill.id}-${app}`}
                          className="rounded-full border border-border bg-background px-2 py-0.5"
                        >
                          {app}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4">
                      <Button
                        size="xs"
                        variant="outline"
                        className="px-2 text-xs"
                      >
                        Know more
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          {sectionedSkills.map((group) => (
            <div key={group.section}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {group.section}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {group.items.length} skills
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {group.items.map((skill) => (
                  <article
                    key={skill.id}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <div className="flex h-32 items-center justify-center border-b border-border bg-muted/40 text-muted-foreground">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <IconPhoto className="h-4 w-4" strokeWidth={1.7} />
                        Cover image
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-foreground">
                          {skill.name}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${statusStyles[skill.status]}`}
                        >
                          {skill.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {skill.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2 py-0.5">
                          {skill.category}
                        </span>
                        {skill.connectedApps?.map((app) => (
                          <span
                            key={`${skill.id}-${app}`}
                            className="rounded-full border border-border bg-background px-2 py-0.5"
                          >
                            {app}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4">
                        <Button
                          size="xs"
                          variant="outline"
                          className="px-2 text-xs"
                        >
                          Know more
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      <Dialog
        open={createSkillOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCreateSkillDialog()
            return
          }
          setCreateSkillOpen(true)
        }}
      >
        <DialogContent className="max-h-[85vh] w-[min(680px,calc(100vw-2rem))] overflow-hidden p-0 sm:max-w-[680px]">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle>Create Skill</DialogTitle>
            <DialogDescription>
              Add a title, define the prompt, connect apps, then create your
              skill.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[calc(85vh-138px)] space-y-4 overflow-y-auto px-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-skill-title">Title</Label>
              <Input
                id="new-skill-title"
                value={newSkillTitle}
                onChange={(event) => {
                  setNewSkillTitle(event.target.value)
                  setCreateSkillError(null)
                }}
                placeholder="e.g. Contract Redline Assistant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-skill-prompt">Prompt</Label>
              <Textarea
                id="new-skill-prompt"
                value={newSkillPrompt}
                onChange={(event) => {
                  setNewSkillPrompt(event.target.value)
                  setCreateSkillError(null)
                }}
                placeholder="Describe how this skill should behave, what inputs it gets, and what output it should return."
                className="min-h-32"
              />
            </div>

            <div className="space-y-2">
              <Label>Connect Apps</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_APPS.map((app) => {
                  const isSelected = selectedApps.includes(app)
                  return (
                    <button
                      key={app}
                      type="button"
                      onClick={() => toggleAppConnection(app)}
                      className={
                        isSelected
                          ? "inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-2.5 py-1 text-xs text-foreground"
                          : "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      }
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {app}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={customAppDraft}
                  onChange={(event) => setCustomAppDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addCustomApp()
                    }
                  }}
                  placeholder="Add custom app"
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="shrink-0"
                  onClick={addCustomApp}
                  disabled={customAppDraft.trim().length === 0}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              {selectedApps.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedApps.map((app) => (
                    <span
                      key={`selected-app-${app}`}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-xs text-foreground"
                    >
                      {app}
                      <button
                        type="button"
                        aria-label={`Remove ${app}`}
                        onClick={() => removeConnectedApp(app)}
                        className="rounded text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {createSkillError && (
              <p className="text-xs text-destructive">{createSkillError}</p>
            )}
          </div>

          <DialogFooter className="border-t border-border bg-background/70">
            <Button type="button" variant="outline" onClick={closeCreateSkillDialog}>
              Cancel
            </Button>
            <Button type="button" onClick={createSkill}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function SkillsPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-[calc(100vh-2.5rem)] flex-1 bg-background" />}
    >
      <SkillsPageContent />
    </Suspense>
  )
}
