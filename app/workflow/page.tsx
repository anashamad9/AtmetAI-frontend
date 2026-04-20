"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Pattern as EmptyProjectsPattern } from "@/components/examples/c-empty-13"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge, type BadgeVariant } from "@/registry/spell-ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { workflowProjects, type WorkflowProject } from "@/lib/workflow-projects"
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  FolderOpen,
  Lock,
  MoreHorizontal,
  Scale,
  Search,
  Sparkles,
  Target,
  Trash2,
  Workflow,
} from "lucide-react"

type ProjectStatus = "Active" | "In review" | "Completed"

const iconMap = {
  analysis: Sparkles,
  checklist: CheckCircle2,
  lock: Lock,
  scale: Scale,
} as const

function getProjectStatus(project: WorkflowProject): ProjectStatus {
  if (project.steps.every((step) => step.status === "Done")) return "Completed"
  if (project.steps.some((step) => step.status === "In review")) return "In review"
  return "Active"
}

function getStepProgress(project: WorkflowProject) {
  const done = project.steps.filter((step) => step.status === "Done").length
  const total = project.steps.length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  return { done, total, percent }
}

const projectStatusBadgeStyles: Record<ProjectStatus, BadgeVariant> = {
  Active: "blue",
  "In review": "amber",
  Completed: "green",
}

export default function WorkflowPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<WorkflowProject[]>(workflowProjects)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all")

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const status = getProjectStatus(project)
      const matchesStatus = statusFilter === "all" || statusFilter === status
      const lowerSearch = search.trim().toLowerCase()
      const matchesSearch =
        lowerSearch.length === 0 ||
        project.title.toLowerCase().includes(lowerSearch) ||
        project.description.toLowerCase().includes(lowerSearch) ||
        project.tags.some((tag) => tag.toLowerCase().includes(lowerSearch)) ||
        project.members.some((member) =>
          member.name.toLowerCase().includes(lowerSearch)
        )
      return matchesStatus && matchesSearch
    })
  }, [projects, search, statusFilter])

  const metrics = useMemo(() => {
    const total = projects.length
    const inReview = projects.filter(
      (project) => getProjectStatus(project) === "In review"
    ).length
    const completed = projects.filter(
      (project) => getProjectStatus(project) === "Completed"
    ).length
    const pendingSteps = projects.reduce((sum, project) => {
      return sum + project.steps.filter((step) => step.status === "Pending").length
    }, 0)
    return { total, inReview, completed, pendingSteps }
  }, [projects])

  const statusFilterLabel =
    statusFilter === "all" ? "All statuses" : statusFilter

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <section className="sticky top-10 z-30 flex h-10 items-center border-b border-border bg-background px-3">
        <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto">
          <div className="relative h-7 min-w-72 shrink-0">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search project, member, or tag"
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
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Status:</span>
              <span>{statusFilterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-40 rounded-xl p-1">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("In review")}>
                In review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <section className="border-b border-border px-4 py-3">
        <div className="grid gap-2 md:grid-cols-4">
          <div className="rounded-xl border border-border/70 bg-card px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Workspace Projects</p>
            <p className="text-lg font-semibold text-foreground">{metrics.total}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card px-3 py-2">
            <p className="text-[11px] text-muted-foreground">In Review</p>
            <p className="text-lg font-semibold text-foreground">{metrics.inReview}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Completed</p>
            <p className="text-lg font-semibold text-foreground">{metrics.completed}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Pending Steps</p>
            <p className="text-lg font-semibold text-foreground">
              {metrics.pendingSteps}
            </p>
          </div>
        </div>
      </section>

      <section className="flex-1 px-4 py-4">
        {projects.length === 0 ? (
          <div className="flex h-full min-h-[50vh] items-center justify-center">
            <EmptyProjectsPattern
              onCreateAutomation={() => router.push("/ai-core")}
            />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-border">
            <p className="text-sm text-muted-foreground">
              No projects match this filter yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => {
              const ProjectIcon = iconMap[project.icon]
              const status = getProjectStatus(project)
              const progress = getStepProgress(project)

              return (
                <article
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/workflow/${project.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      router.push(`/workflow/${project.id}`)
                    }
                  }}
                  className="group rounded-xl border border-border/70 bg-card p-3 text-left transition-all hover:border-primary/35 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-muted/40">
                      <ProjectIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={projectStatusBadgeStyles[status]}
                        size="default"
                      >
                        {status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              type="button"
                              size="icon-xs"
                              variant="ghost"
                              className="text-muted-foreground hover:text-foreground"
                              aria-label={`Project actions for ${project.title}`}
                              onClick={(event) => {
                                event.stopPropagation()
                              }}
                              onPointerDown={(event) => {
                                event.stopPropagation()
                              }}
                            />
                          }
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-40 p-1">
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation()
                              router.push(`/workflow/${project.id}`)
                            }}
                          >
                            <FolderOpen className="h-3.5 w-3.5" />
                            Open project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={(event) => {
                              event.stopPropagation()
                              setProjects((previous) =>
                                previous.filter((item) => item.id !== project.id)
                              )
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <h2 className="mt-2 line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
                    {project.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="neutral"
                        size="sm"
                        className="px-1.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-3 rounded-lg border border-border/60 bg-background/70 px-2 py-1.5">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Workflow className="h-3 w-3" />
                        Progress
                      </span>
                      <span>
                        {progress.done}/{progress.total} done
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className="h-1.5 rounded-full bg-primary transition-all"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {project.members.slice(0, 3).map((member) => (
                        <span
                          key={member.name}
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full border border-background text-[10px] font-medium",
                            member.tone
                          )}
                          title={member.name}
                        >
                          {member.initials}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      {project.steps.length} steps
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
