import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/registry/spell-ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BellRing, Clock3, UserRound } from "lucide-react"
import {
  categoryBadgeVariant,
  getNotificationById,
  priorityBadgeVariant,
} from "../notifications-data"

export default function NotificationDetailsPage({
  params,
}: {
  params: { notificationId: string }
}) {
  const notification = getNotificationById(params.notificationId)

  if (!notification) {
    notFound()
  }

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <section className="sticky top-10 z-30 flex h-10 items-center border-b border-border bg-background px-3">
        <Button
          render={<Link href="/notifications" />}
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 rounded-lg border-border/60 bg-transparent px-2.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to notifications
        </Button>
      </section>

      <section className="flex-1 px-3 py-4">
        <article className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant={categoryBadgeVariant[notification.category]}>
                  {notification.category}
                </Badge>
                <Badge variant={priorityBadgeVariant[notification.priority]}>
                  {notification.priority}
                </Badge>
                {notification.mentioned ? <Badge variant="purple">Mention</Badge> : null}
              </div>
              <h1 className="text-xl font-semibold text-foreground">{notification.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
              <BellRing className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="mb-5 grid gap-3 rounded-xl border border-border bg-background p-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              <span>{notification.relativeTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              <span>{notification.actor}</span>
            </div>
            <div className="truncate">Source: {notification.source}</div>
          </div>

          <div className="space-y-5 text-sm">
            <section>
              <h2 className="mb-2 font-semibold text-foreground">Details</h2>
              <p className="leading-relaxed text-muted-foreground">{notification.body}</p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground">Highlights</h2>
              <ul className="space-y-2">
                {notification.highlights.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground">Recommended next steps</h2>
              <ol className="space-y-2 text-muted-foreground">
                {notification.nextSteps.map((step, index) => (
                  <li
                    key={step}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <span className="mr-2 text-foreground">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </article>
      </section>
    </div>
  )
}
