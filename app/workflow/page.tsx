"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Pattern as EmptyProjectsPattern } from "@/components/examples/c-empty-13"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  Loader2,
  Lock,
  MoreHorizontal,
  Scale,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react"

type ProjectStatus = "Active" | "In review" | "Completed"

const iconMap = {
  analysis: Sparkles,
  checklist: CheckCircle2,
  lock: Lock,
  scale: Scale,
} as const

const statusMeta: Record<
  ProjectStatus,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    className: string
  }
> = {
  Active: {
    label: "Running",
    icon: Loader2,
    className: "text-muted-foreground",
  },
  "In review": {
    label: "In review",
    icon: Clock3,
    className: "text-amber-600",
  },
  Completed: {
    label: "Done",
    icon: CheckCircle2,
    className: "text-emerald-600",
  },
}

function getProjectStatus(project: WorkflowProject): ProjectStatus {
  if (project.steps.every((step) => step.status === "Done")) return "Completed"
  if (project.steps.some((step) => step.status === "In review")) return "In review"
  return "Active"
}

function getPendingStepsCount(project: WorkflowProject) {
  return project.steps.filter((step) => step.status === "Pending").length
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

  const statusFilterLabel = statusFilter === "all" ? "All statuses" : statusFilter

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <section className="mx-auto w-full max-w-4xl flex-1 px-4 py-4 sm:px-6">
        <div className="space-y-4">
          <header>
            <h1 className="text-sm font-semibold text-foreground">Tasks</h1>
          </header>

          {projects.length === 0 ? (
            <div className="flex h-full min-h-[50vh] items-center justify-center">
              <EmptyProjectsPattern onCreateAutomation={() => router.push("/ai-core")} />
            </div>
          ) : (
            <>
              <section className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
                <div className="relative w-full max-w-52 sm:max-w-64">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tasks"
                    className="surface-sidebar-field h-7 pl-7 text-xs"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="surface-sidebar-field h-7 gap-1.5 px-2.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      />
                    }
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>{statusFilterLabel === "All statuses" ? "Filters" : statusFilterLabel}</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="surface-sidebar-menu min-w-40 rounded-xl border p-1"
                  >
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All statuses</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("In review")}>In review</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>Completed</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </section>

              {filteredProjects.length === 0 ? (
                <div className="mx-auto flex h-44 w-full max-w-2xl items-center justify-center rounded-xl border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">No tasks match this filter yet.</p>
                </div>
              ) : (
                <section className="mx-auto w-full max-w-2xl space-y-4">
                  <div className="surface-sidebar-bg overflow-hidden rounded-xl border border-border/70">
                    {filteredProjects.map((project, index) => {
                      const ProjectIcon = iconMap[project.icon]
                      const status = getProjectStatus(project)
                      const statusDetails = statusMeta[status]
                      const StatusIcon = statusDetails.icon
                      const pendingStepsCount = getPendingStepsCount(project)
                      const assignee = project.members[0]

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
                          className={cn(
                            "surface-sidebar-bg group flex items-start justify-between gap-3 px-3 py-2.5 transition-colors hover:bg-sidebar-accent",
                            index !== filteredProjects.length - 1 && "border-b border-border/70"
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2.5">
                              <span className="surface-sidebar-bg mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-sidebar-border">
                                <ProjectIcon className="h-3 w-3 text-muted-foreground" />
                              </span>
                              <div className="min-w-0">
                                <h2 className="line-clamp-1 text-sm font-medium text-foreground">
                                  {project.title}
                                </h2>
                                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                  <span>{project.steps.length} steps</span>
                                  <span>·</span>
                                  <span>{pendingStepsCount} pending</span>
                                  <span>·</span>
                                  <span className="inline-flex items-center gap-1">
                                    <FolderOpen className="h-3 w-3" />
                                    Dashboard
                                  </span>
                                  <span>·</span>
                                  <span className="truncate">
                                    {project.members
                                      .slice(0, 2)
                                      .map((member) => member.name)
                                      .join(", ")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex min-w-28 flex-col items-end gap-1.5">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 text-xs",
                                statusDetails.className
                              )}
                            >
                              <StatusIcon
                                className={cn(
                                  "h-3.5 w-3.5",
                                  status === "Active" && "animate-spin"
                                )}
                              />
                              {statusDetails.label}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {assignee ? (
                                <span
                                  className={cn(
                                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium",
                                    assignee.tone
                                  )}
                                  title={assignee.name}
                                >
                                  {assignee.initials}
                                </span>
                              ) : null}
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button
                                      type="button"
                                      size="icon-xs"
                                      variant="ghost"
                                      className="text-muted-foreground hover:text-foreground"
                                      aria-label={`Task actions for ${project.title}`}
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
                                <DropdownMenuContent
                                  align="end"
                                  className="surface-sidebar-menu min-w-36 rounded-xl border p-1"
                                >
                                  <DropdownMenuItem
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      router.push(`/workflow/${project.id}`)
                                    }}
                                  >
                                    <FolderOpen className="h-3.5 w-3.5" />
                                    Open task
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
                                    Delete task
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    You&apos;ve reached the end • {filteredProjects.length} tasks total
                  </p>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
