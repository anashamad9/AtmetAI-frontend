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
  AtSign,
  BellRing,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  Filter,
  Inbox,
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

const GROUP_ORDER = ["Today", "Yesterday", "Earlier this week", "Earlier"] as const

const CATEGORY_OPTIONS: ReadonlyArray<NotificationCategory | "all"> = [
  "all",
  "Workflow",
  "Apps",
  "Data",
  "Members",
  "Security",
  "Billing",
]

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
      <section
        data-filter-bar-scope="true"
        className="sticky top-10 z-30 border-b border-border bg-background/95 px-3 py-2 backdrop-blur supports-backdrop-filter:backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2">
          <div className="relative h-7 min-w-[17rem] grow">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notifications..."
              className="surface-filter-field h-7 rounded-lg pl-7 text-xs"
            />
          </div>

          <div className="inline-flex h-7 items-center rounded-lg border border-border/60 bg-background p-0.5">
            {(
              [
                { key: "all", label: "All", count: allCount, icon: Inbox },
                { key: "unread", label: "Unread", count: unreadCount, icon: BellRing },
                { key: "mentions", label: "Mentions", count: mentionsCount, icon: AtSign },
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
                <item.icon className="h-3.5 w-3.5" />
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
                  className="surface-filter-field h-7 gap-1.5 rounded-lg px-2.5 text-xs"
                />
              }
            >
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{categoryFilter === "all" ? "All categories" : categoryFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-44 rounded-xl p-1">
              {CATEGORY_OPTIONS.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === "all" ? "All categories" : category}
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
                  className="surface-filter-field h-7 gap-1.5 rounded-lg px-2.5 text-xs"
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

          <div className="ml-auto flex items-center gap-2">
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
        <div className="mx-auto w-full max-w-6xl">
          {hasNoMatches ? (
            <div className="flex h-52 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card">
              <Inbox className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No notifications match the current filters.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {GROUP_ORDER.map((groupKey) => {
                const groupItems = groupedNotifications[groupKey]
                if (!groupItems || groupItems.length === 0) return null

                return (
                  <section
                    key={groupKey}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
                      <h2 className="text-sm font-semibold text-foreground">{groupKey}</h2>
                      <Badge variant="neutral">{groupItems.length}</Badge>
                    </div>
                    <div className="divide-y divide-border/70">
                      {groupItems.map((item) => (
                        <article
                          key={item.id}
                          className={cn(
                            "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/20",
                            item.unread && "bg-muted/20"
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
                              Open
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="h-7 w-7 rounded-lg border-0 bg-transparent text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent"
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
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
