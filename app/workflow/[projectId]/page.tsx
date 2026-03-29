import Ai03 from "@/components/ai-03"
import { Button } from "@/components/ui/button"
import { getWorkflowProject, type WorkflowProject } from "@/lib/workflow-projects"
import {
  IconArrowLeft,
  IconBolt,
  IconClipboardCheck,
  IconEdit,
  IconFileAnalytics,
  IconLockAccess,
  IconScale,
  type Icon,
} from "@tabler/icons-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const iconByProjectType: Record<WorkflowProject["icon"], Icon> = {
  analysis: IconFileAnalytics,
  checklist: IconClipboardCheck,
  lock: IconLockAccess,
  scale: IconScale,
}

const statusStyles: Record<WorkflowProject["steps"][number]["status"], string> = {
  Done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "In review": "border-amber-200 bg-amber-50 text-amber-700",
  Pending: "border-slate-200 bg-slate-50 text-slate-600",
}

export default async function WorkflowProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const project = getWorkflowProject(projectId)

  if (!project) {
    notFound()
  }

  const ProjectIcon = iconByProjectType[project.icon]

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 bg-background">
      <section className="w-full px-6 py-6 xl:w-[58%]">
        <div className="mb-5">
          <Link
            href="/workflow"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Back to workflows
          </Link>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
              <ProjectIcon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{project.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button>run workflow</Button>
            <Button size="icon" variant="outline" aria-label="Edit workflow">
              <IconEdit className="h-4 w-4" strokeWidth={1.8} />
            </Button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {project.steps.map((step, index) => (
            <div key={step.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{step.name}</p>
                  <p className="text-xs text-muted-foreground">Owner: {step.owner}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[step.status]}`}
              >
                {step.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {project.members.map((member) => (
            <div key={member.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold ${member.tone}`}
                >
                  {member.initials}
                </span>
                <span className="text-sm text-foreground">{member.name}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <IconBolt className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.8} />
                Active
              </span>
            </div>
          ))}
        </div>
      </section>

      <aside className="hidden min-h-[calc(100vh-4rem)] flex-1 border-l border-border px-6 py-6 xl:flex xl:items-end xl:justify-center">
        <Ai03 />
      </aside>
    </div>
  )
}
