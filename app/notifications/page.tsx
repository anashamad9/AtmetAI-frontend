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
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  CreditCard,
  Database,
  Inbox,
  MoreHorizontal,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Zap,
  Puzzle,
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

const categoryIcon: Record<
  NotificationCategory,
  React.ComponentType<{ className?: string }>
> = {
  Workflow: Zap,
  Apps: Puzzle,
  Data: Database,
  Members: UserPlus,
  Security: Shield,
  Billing: CreditCard,
}

const categoryIconStyle: Record<NotificationCategory, string> = {
  Workflow: "text-violet-600 bg-violet-100 dark:bg-violet-950/40",
  Apps: "text-blue-600 bg-blue-100 dark:bg-blue-950/40",
  Data: "text-cyan-600 bg-cyan-100 dark:bg-cyan-950/40",
  Members: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40",
  Security: "text-red-600 bg-red-100 dark:bg-red-950/40",
  Billing: "text-amber-600 bg-amber-100 dark:bg-amber-950/40",
}

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

  const categoryFilterLabel =
    categoryFilter === "all" ? "All" : categoryFilter

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <section
        data-filter-bar-scope="true"
        className="sticky top-10 z-30 flex h-10 shrink-0 items-center border-b border-border bg-background px-3"
      >
        <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto">
          <div className="relative h-7 min-w-56 shrink-0">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notifications..."
              className="surface-filter-field h-7 rounded-lg pl-7 text-xs"
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
                  "h-6 gap-1.5 rounded-md px-2 text-xs",
                  view === item.key
                    ? "bg-sidebar text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span>{item.label}</span>
                <span className={cn(
                  "tabular-nums inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium leading-none",
                  view === item.key
                    ? "bg-foreground/10 text-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {item.count}
                </span>
              </Button>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="surface-filter-field h-7 shrink-0 gap-1.5 rounded-lg px-2.5 text-xs"
                />
              }
            >
              <span className="text-muted-foreground">Category:</span>
              <span>{categoryFilterLabel}</span>
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
                  className="surface-filter-field h-7 shrink-0 gap-1.5 rounded-lg px-2.5 text-xs"
                />
              }
            >
              <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
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

          <div className="ml-auto flex shrink-0 items-center">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
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
        <div className="mx-auto w-full max-w-3xl">
          {hasNoMatches ? (
            <div className="flex h-52 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border">
              <Inbox className="h-5 w-5 text-muted-foreground" />
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
                  <section key={groupKey}>
                    <div className="mb-2 flex items-center justify-between px-1">
                      <h2 className="text-xs font-medium text-muted-foreground">
                        {groupKey}
                      </h2>
                      <span className="tabular-nums text-xs text-muted-foreground">
                        {groupItems.length}
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
                      {groupItems.map((item, index) => {
                        const CategoryIcon = categoryIcon[item.category]
                        const iconStyle = categoryIconStyle[item.category]

                        return (
                          <article
                            key={item.id}
                            className={cn(
                              "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/20",
                              item.unread && "bg-muted/10",
                              index !== groupItems.length - 1 &&
                                "border-b border-border/60"
                            )}
                          >
                            <div className="relative mt-0.5 shrink-0">
                              <div
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-lg",
                                  iconStyle
                                )}
                              >
                                <CategoryIcon className="h-3.5 w-3.5" />
                              </div>
                              {item.unread && (
                                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-500 ring-1 ring-background" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={cn(
                                      "text-sm text-foreground",
                                      item.unread
                                        ? "font-semibold"
                                        : "font-medium"
                                    )}
                                  >
                                    {item.title}
                                  </p>
                                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                    {item.description}
                                  </p>
                                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                    <Badge
                                      variant={categoryBadgeVariant[item.category]}
                                      size="sm"
                                    >
                                      {item.category}
                                    </Badge>
                                    <Badge
                                      variant={priorityBadgeVariant[item.priority]}
                                      size="sm"
                                    >
                                      {item.priority}
                                    </Badge>
                                    {item.mentioned ? (
                                      <Badge variant="purple" size="sm">
                                        <AtSign className="h-2.5 w-2.5" />
                                        Mention
                                      </Badge>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="flex shrink-0 flex-col items-end gap-2">
                                  <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                                    {item.relativeTime}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      render={
                                        <Link href={`/notifications/${item.id}`} />
                                      }
                                      variant="outline"
                                      size="sm"
                                      className="h-6 rounded-md border-border/60 bg-transparent px-2 text-xs"
                                    >
                                      Open
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger
                                        render={
                                          <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            className="h-6 w-6 rounded-md border-0 bg-transparent text-muted-foreground shadow-none hover:bg-muted hover:text-foreground aria-expanded:bg-muted"
                                          />
                                        }
                                      >
                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="min-w-40 rounded-xl p-1"
                                      >
                                        <DropdownMenuItem
                                          onClick={() => toggleReadState(item.id)}
                                        >
                                          <Check className="h-3.5 w-3.5" />
                                          {item.unread
                                            ? "Mark as read"
                                            : "Mark as unread"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            removeNotification(item.id)
                                          }
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                          Remove
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </article>
                        )
                      })}
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
