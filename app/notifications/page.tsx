"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Badge } from "@/registry/spell-ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  BellRing,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react"
import {
  categoryBadgeVariant,
  INITIAL_NOTIFICATIONS,
  priorityBadgeVariant,
  type NotificationCategory,
  type NotificationItem,
} from "./notifications-data"

type DateRangeFilter = "all" | "today" | "7d" | "30d"
type NotificationView = "all" | "unread" | "mentions"

function bucketByDate(
  dateIso: string,
  now: Date
): "Today" | "Yesterday" | "Earlier this week" | "Earlier" {
  const created = new Date(dateIso)
  const diffDays = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays <= 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays <= 6) return "Earlier this week"
  return "Earlier"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [search, setSearch] = useState("")
  const [view, setView] = useState<NotificationView>("all")
  const [categoryFilter, setCategoryFilter] = useState<
    NotificationCategory | "all"
  >("all")
  const [rangeFilter, setRangeFilter] = useState<DateRangeFilter>("all")

  const filteredNotifications = useMemo(() => {
    const now = new Date()

    return notifications.filter((item) => {
      const normalizedSearch = search.trim().toLowerCase()
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch)

      const matchesView =
        view === "all" ||
        (view === "unread" && item.unread) ||
        (view === "mentions" && item.mentioned)

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter

      const diffDays = Math.floor(
        (now.getTime() - new Date(item.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
      const matchesRange =
        rangeFilter === "all" ||
        (rangeFilter === "today" && diffDays <= 0) ||
        (rangeFilter === "7d" && diffDays <= 6) ||
        (rangeFilter === "30d" && diffDays <= 29)

      return matchesSearch && matchesView && matchesCategory && matchesRange
    })
  }, [notifications, search, view, categoryFilter, rangeFilter])

  const groupedNotifications = useMemo(() => {
    const now = new Date()
    const groups: Record<string, NotificationItem[]> = {
      Today: [],
      Yesterday: [],
      "Earlier this week": [],
      Earlier: [],
    }

    filteredNotifications.forEach((item) => {
      groups[bucketByDate(item.createdAt, now)].push(item)
    })

    return groups
  }, [filteredNotifications])

  const unreadCount = notifications.filter((item) => item.unread).length
  const allCount = notifications.length
  const mentionsCount = notifications.filter((item) => item.mentioned).length

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, unread: false }))
    )
  }

  const toggleReadState = (id: string) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, unread: !item.unread } : item
      )
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((previous) => previous.filter((item) => item.id !== id))
  }

  const hasNoMatches = filteredNotifications.length === 0

  const rangeLabel =
    rangeFilter === "all"
      ? "Any time"
      : rangeFilter === "today"
        ? "Today"
        : rangeFilter === "7d"
          ? "Last 7 days"
          : "Last 30 days"

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <section className="sticky top-10 z-30 flex h-10 items-center border-b border-border bg-background px-3">
        <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto">
          <div className="relative h-7 min-w-64 shrink-0">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notifications..."
              className="h-7 rounded-lg border-border/60 bg-transparent pl-7 text-xs"
            />
          </div>

          <div className="inline-flex h-7 shrink-0 items-center rounded-lg border border-border/60 bg-background p-0.5">
            {(
              [
                { key: "all", label: "All", count: allCount },
                { key: "unread", label: "Unread", count: unreadCount },
                { key: "mentions", label: "Mentions", count: mentionsCount },
              ] as const
            ).map((item) => (
              <Button
                key={item.key}
                type="button"
                variant={view === item.key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView(item.key)}
                className={cn(
                  "h-6 gap-1 rounded-md px-2 text-xs",
                  view === item.key
                    ? "bg-sidebar text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span>{item.label}</span>
                <Badge variant="neutral" size="sm">
                  {item.count}
                </Badge>
              </Button>
            ))}
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
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{categoryFilter === "all" ? "All categories" : categoryFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-44 rounded-xl p-1">
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                All categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Workflow")}>
                Workflow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Apps")}>
                Apps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Data")}>
                Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Members")}>
                Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Security")}>
                Security
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Billing")}>
                Billing
              </DropdownMenuItem>
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
              <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{rangeLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-40 rounded-xl p-1">
              <DropdownMenuItem onClick={() => setRangeFilter("all")}>
                Any time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRangeFilter("today")}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRangeFilter("7d")}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRangeFilter("30d")}>
                Last 30 days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 gap-1.5 rounded-lg border-border/60 bg-transparent px-2.5 text-xs"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          </div>
        </div>
      </section>

      <section className="flex-1 px-3 py-4">
        {hasNoMatches ? (
          <div className="flex h-44 items-center justify-center rounded-xl border border-border bg-card">
            <p className="text-sm text-muted-foreground">
              No notifications match the current filters.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {(["Today", "Yesterday", "Earlier this week", "Earlier"] as const).map(
              (groupKey) => {
                const groupItems = groupedNotifications[groupKey]
                if (!groupItems || groupItems.length === 0) return null

                return (
                  <section key={groupKey}>
                    <div className="mb-2 flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-foreground">{groupKey}</h2>
                      <Badge variant="neutral">{groupItems.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {groupItems.map((item) => (
                        <article
                          key={item.id}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border p-3 transition-colors",
                            item.unread
                              ? "border-border bg-muted/25"
                              : "border-border/70 bg-card"
                          )}
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                            <BellRing className="h-4 w-4 text-muted-foreground" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium text-foreground">
                                {item.title}
                              </p>
                              {item.unread ? (
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                              ) : null}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge variant={categoryBadgeVariant[item.category]}>
                                {item.category}
                              </Badge>
                              <Badge variant={priorityBadgeVariant[item.priority]}>
                                {item.priority}
                              </Badge>
                              {item.mentioned ? (
                                <Badge variant="purple">Mention</Badge>
                              ) : null}
                            </div>
                          </div>

                          <div className="ml-auto flex shrink-0 items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">
                              {item.relativeTime}
                            </span>
                            <Button
                              render={<Link href={`/notifications/${item.id}`} />}
                              variant="outline"
                              size="sm"
                              className="h-7 rounded-lg border-border/60 bg-transparent px-2.5 text-xs"
                            >
                              Read more
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                                  />
                                }
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="min-w-40 rounded-xl p-1">
                                <DropdownMenuItem onClick={() => toggleReadState(item.id)}>
                                  <Check className="h-3.5 w-3.5" />
                                  {item.unread ? "Mark as read" : "Mark as unread"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => removeNotification(item.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )
              }
            )}
          </div>
        )}
      </section>
    </div>
  )
}
