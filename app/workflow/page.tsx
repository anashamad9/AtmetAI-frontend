import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { workflowProjects, type WorkflowProject } from "@/lib/workflow-projects"
import {
  IconBolt,
  IconClipboardCheck,
  IconEdit,
  IconFileAnalytics,
  IconLockAccess,
  IconScale,
  IconUsers,
  type Icon,
} from "@tabler/icons-react"
import Link from "next/link"

const iconByProjectType: Record<WorkflowProject["icon"], Icon> = {
  analysis: IconFileAnalytics,
  checklist: IconClipboardCheck,
  lock: IconLockAccess,
  scale: IconScale,
}

function ProjectCard({ project }: { project: WorkflowProject }) {
  const ProjectIcon = iconByProjectType[project.icon]

  return (
    <article className="flex min-h-56 w-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
          <ProjectIcon className="h-5 w-5" strokeWidth={1.7} />
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground">
          <IconBolt className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.8} />
          Active
        </div>
      </div>

      <h2 className="text-base font-semibold text-card-foreground">{project.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center">
          {project.members.map((member, idx) => (
            <span
              key={member.name}
              title={member.name}
              className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-[11px] font-semibold ${member.tone} ${idx > 0 ? "-ml-2.5" : ""}`}
            >
              {member.initials}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <IconUsers className="h-3.5 w-3.5" strokeWidth={1.8} />
          {project.members.length} assigned
        </span>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Link
          href={`/workflow/${project.id}`}
          className={cn(
            "group/button inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          )}
        >
          See workflow
        </Link>
        <Button className="flex-1">run workflow</Button>
        <Button size="icon" variant="outline" aria-label="Edit workflow">
          <IconEdit className="h-4 w-4" strokeWidth={1.8} />
        </Button>
      </div>
    </article>
  )
}

export default function WorkflowPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col bg-background px-4 py-6 sm:px-6">
      <header className="mb-5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Workflow projects</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Project Workflows</h1>
      </header>

      <section className="pb-2">
        <div className="grid gap-4 md:grid-cols-3">
          {workflowProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </div>
  )
}
