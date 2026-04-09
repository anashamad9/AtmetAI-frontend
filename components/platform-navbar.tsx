"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import AvatarGroupTooltipTransitionDemo, {
  type ChatParticipant,
} from "@/components/shadcn-studio/avatar/avatar-18"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/components/ui/sidebar"
import {
  getWorkflowProject,
  workflowProjects,
  type WorkflowProject,
} from "@/lib/workflow-projects"
import {
  WORKFLOW_OPEN_LOG_EVENT,
  WORKFLOW_PUBLISH_EVENT,
  WORKFLOW_RUN_EVENT,
  WORKFLOW_SET_AUTORUN_EVENT,
  WORKFLOW_STATE_EVENT,
  type WorkflowControlEventDetail,
  type WorkflowRunSchedule,
  type WorkflowSetAutoRunEventDetail,
  type WorkflowStateEventDetail,
} from "@/lib/workflow-events"
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  FileClock,
  Loader2,
  Play,
  Plus,
  Rocket,
  X,
} from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SidebarLeftIcon } from "@hugeicons/core-free-icons"

const OPEN_MANAGE_CHAT_USERS_EVENT = "open-manage-chat-users"
const AI_CORE_CHATS_STORAGE_KEY = "ai-core-chats"
const AI_CORE_CHATS_UPDATED_EVENT = "ai-core-chats-updated"
const WORKFLOW_PROJECT_PARTICIPANTS_STORAGE_KEY = "workflow-project-participants"

type WorkspaceUser = ChatParticipant & {
  email: string
}

type StoredChatItem = {
  id: string
  title: string
  updatedAt: number
  pinned?: boolean
  path?: string
}

type WorkflowControlState = Omit<WorkflowStateEventDetail, "projectId">

const defaultWorkflowControlState: WorkflowControlState = {
  isRunning: false,
  isPublishing: false,
  publishState: "Draft",
  hasUnpublishedChanges: false,
  runSchedule: { mode: "off" },
}

const routeTitles: Record<string, string> = {
  "/ai-core": "AI Core",
  "/workflow": "Workflow",
  "/automations": "Automations",
  "/skills": "Skills",
  "/my-data": "My Data",
  "/integrations": "Integrations",
  "/settings": "Settings",
  "/dashboard": "Dashboard",
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/workflow")) {
    return "Workflow"
  }

  return routeTitles[pathname] ?? "Platform"
}

function buildFallbackFromName(name: string) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
  return letters.slice(0, 2) || "U"
}

function buildWorkspaceEmail(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
  return `${slug || "user"}@atmet.ai`
}

function getDefaultParticipantsForProject(project: WorkflowProject | null) {
  if (!project) return []
  return project.members.map((member) => ({
    name: member.name,
    fallback: member.initials || buildFallbackFromName(member.name),
  }))
}

function getAutoRunLabel(runSchedule: WorkflowRunSchedule) {
  if (runSchedule.mode === "off") return "Off"
  if (runSchedule.mode === "every") {
    const unitLabel =
      runSchedule.unit === "minutes"
        ? "minutes"
        : runSchedule.unit === "hours"
          ? "hours"
          : runSchedule.unit === "days"
            ? "days"
            : runSchedule.unit === "weeks"
              ? "weeks"
              : "months"
    return `Every ${runSchedule.value} ${unitLabel}`
  }
  if (runSchedule.frequency === "day") return "At every day"
  if (runSchedule.frequency === "week") return "At every week"
  return "At every month"
}

export function PlatformNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state: sidebarState, toggleSidebar } = useSidebar()
  const userPickerCardRef = useRef<HTMLDivElement>(null)
  const isAiCore = pathname.startsWith("/ai-core")
  const workflowProjectId = useMemo(() => {
    if (!pathname.startsWith("/workflow/")) return null
    const segments = pathname.split("/").filter(Boolean)
    return segments[1] ?? null
  }, [pathname])
  const activeWorkflowProject = useMemo(
    () => (workflowProjectId ? getWorkflowProject(workflowProjectId) ?? null : null),
    [workflowProjectId]
  )
  const isWorkflowProject = Boolean(activeWorkflowProject && workflowProjectId)
  const isSkills = pathname.startsWith("/skills")
  const canManageUsersFromNavbar = isAiCore || isWorkflowProject
  const manageUsersLabel = isWorkflowProject ? "Invite users" : "Manage chat users"
  const isChatOwner = true
  const currentUserFullName = "Amir Haddad"
  const [isUserPickerOpen, setIsUserPickerOpen] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const workspaceUsers = useMemo<WorkspaceUser[]>(
    () => {
      const users = new Map<string, WorkspaceUser>([
        [
          currentUserFullName,
          { name: currentUserFullName, fallback: "AH", email: "amir.haddad@atmet.ai" },
        ],
        ["Sarah Reed", { name: "Sarah Reed", fallback: "SR", email: "sarah.reed@atmet.ai" }],
        ["Noah Ali", { name: "Noah Ali", fallback: "NA", email: "noah.ali@atmet.ai" }],
        ["Lina Omar", { name: "Lina Omar", fallback: "LO", email: "lina.omar@atmet.ai" }],
        ["Kareem Aziz", { name: "Kareem Aziz", fallback: "KA", email: "kareem.aziz@atmet.ai" }],
        [
          "Automation Bot",
          { name: "Automation Bot", fallback: "AB", email: "automation.bot@atmet.ai" },
        ],
        [
          "Product Manager",
          { name: "Product Manager", fallback: "PM", email: "product.manager@atmet.ai" },
        ],
        ["Engineer", { name: "Engineer", fallback: "EN", email: "engineer@atmet.ai" }],
      ])

      workflowProjects.forEach((project) => {
        project.members.forEach((member) => {
          if (users.has(member.name)) return
          users.set(member.name, {
            name: member.name,
            fallback: member.initials || buildFallbackFromName(member.name),
            email: buildWorkspaceEmail(member.name),
          })
        })
      })

      return Array.from(users.values())
    },
    [currentUserFullName]
  )
  const [aiCoreParticipants, setAiCoreParticipants] = useState<ChatParticipant[]>([
    { name: currentUserFullName, fallback: "AH" },
  ])
  const [workflowParticipantsByProject, setWorkflowParticipantsByProject] = useState<
    Record<string, ChatParticipant[]>
  >({})
  const activeParticipants = useMemo(() => {
    if (isAiCore) return aiCoreParticipants
    if (isWorkflowProject && workflowProjectId) {
      const hasStoredParticipants = Object.prototype.hasOwnProperty.call(
        workflowParticipantsByProject,
        workflowProjectId
      )
      if (hasStoredParticipants) {
        return workflowParticipantsByProject[workflowProjectId] ?? []
      }
      return getDefaultParticipantsForProject(activeWorkflowProject)
    }
    return []
  }, [
    isAiCore,
    aiCoreParticipants,
    isWorkflowProject,
    workflowProjectId,
    workflowParticipantsByProject,
    activeWorkflowProject,
  ])
  const activeParticipantNames = useMemo(
    () => new Set(activeParticipants.map((participant) => participant.name)),
    [activeParticipants]
  )
  const shouldShowParticipantsTrigger =
    isWorkflowProject || (isAiCore && aiCoreParticipants.length > 1)
  const [workflowControlStateByProject, setWorkflowControlStateByProject] = useState<
    Record<string, WorkflowControlState>
  >({})
  const activeWorkflowControlState = useMemo<WorkflowControlState>(() => {
    if (!workflowProjectId) return defaultWorkflowControlState
    return workflowControlStateByProject[workflowProjectId] ?? defaultWorkflowControlState
  }, [workflowControlStateByProject, workflowProjectId])
  const workflowPublishButtonLabel = activeWorkflowControlState.isPublishing
    ? "Publishing..."
    : activeWorkflowControlState.hasUnpublishedChanges ||
        activeWorkflowControlState.publishState === "Draft"
      ? "Publish"
      : "Published"

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WORKFLOW_PROJECT_PARTICIPANTS_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return

      const cleaned: Record<string, ChatParticipant[]> = {}
      Object.entries(parsed).forEach(([projectId, participants]) => {
        if (!Array.isArray(participants)) return
        cleaned[projectId] = participants
          .filter(
            (participant): participant is ChatParticipant =>
              Boolean(
                participant &&
                  typeof participant === "object" &&
                  typeof participant.name === "string" &&
                  typeof participant.fallback === "string"
              )
          )
          .map((participant) => ({
            name: participant.name,
            fallback: participant.fallback,
            src: participant.src,
          }))
      })
      setWorkflowParticipantsByProject(cleaned)
    } catch {
      setWorkflowParticipantsByProject({})
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WORKFLOW_PROJECT_PARTICIPANTS_STORAGE_KEY,
        JSON.stringify(workflowParticipantsByProject)
      )
    } catch {
      // Ignore storage write errors.
    }
  }, [workflowParticipantsByProject])

  useEffect(() => {
    if (isUserPickerOpen && !canManageUsersFromNavbar) {
      setIsUserPickerOpen(false)
    }
  }, [canManageUsersFromNavbar, isUserPickerOpen])

  useEffect(() => {
    const onWorkflowStateUpdated = (event: Event) => {
      const detail = (event as CustomEvent<WorkflowStateEventDetail>).detail
      if (!detail?.projectId) return
      setWorkflowControlStateByProject((previous) => ({
        ...previous,
        [detail.projectId]: {
          isRunning: detail.isRunning,
          isPublishing: detail.isPublishing,
          publishState: detail.publishState,
          hasUnpublishedChanges: detail.hasUnpublishedChanges,
          runSchedule: detail.runSchedule,
        },
      }))
    }

    window.addEventListener(WORKFLOW_STATE_EVENT, onWorkflowStateUpdated as EventListener)
    return () =>
      window.removeEventListener(
        WORKFLOW_STATE_EVENT,
        onWorkflowStateUpdated as EventListener
      )
  }, [])

  const filteredWorkspaceUsers = useMemo(() => {
    const query = userSearchQuery.trim().toLowerCase()
    if (!query) return workspaceUsers

    return workspaceUsers.filter(
      (workspaceUser) =>
        workspaceUser.name.toLowerCase().includes(query) ||
        workspaceUser.email.toLowerCase().includes(query)
    )
  }, [workspaceUsers, userSearchQuery])

  const openUserPicker = useCallback(() => {
    if (!canManageUsersFromNavbar) return
    setUserSearchQuery("")
    setIsUserPickerOpen(true)
  }, [canManageUsersFromNavbar])

  const closeUserPicker = useCallback(() => {
    setIsUserPickerOpen(false)
  }, [])

  const dispatchWorkflowControlEvent = useCallback(
    (eventName: string) => {
      if (!workflowProjectId) return
      const detail: WorkflowControlEventDetail = { projectId: workflowProjectId }
      try {
        window.dispatchEvent(new CustomEvent(eventName, { detail }))
      } catch (error) {
        console.error("Failed to dispatch workflow control event:", error)
      }
    },
    [workflowProjectId]
  )
  const requestWorkflowRun = useCallback(() => {
    dispatchWorkflowControlEvent(WORKFLOW_RUN_EVENT)
  }, [dispatchWorkflowControlEvent])

  const requestWorkflowPublish = useCallback(() => {
    dispatchWorkflowControlEvent(WORKFLOW_PUBLISH_EVENT)
  }, [dispatchWorkflowControlEvent])

  const openWorkflowExecutionLog = useCallback(() => {
    dispatchWorkflowControlEvent(WORKFLOW_OPEN_LOG_EVENT)
  }, [dispatchWorkflowControlEvent])

  const requestWorkflowSetAutoRun = useCallback(
    (schedule: WorkflowRunSchedule) => {
      if (!workflowProjectId) return
      const detail: WorkflowSetAutoRunEventDetail = {
        projectId: workflowProjectId,
        schedule,
      }
      try {
        window.dispatchEvent(new CustomEvent(WORKFLOW_SET_AUTORUN_EVENT, { detail }))
      } catch (error) {
        console.error("Failed to dispatch workflow auto-run event:", error)
      }
    },
    [workflowProjectId]
  )

  const handleAddUser = useCallback((user: ChatParticipant) => {
    const nextParticipant: ChatParticipant = {
      name: user.name,
      fallback: user.fallback,
      src: user.src,
    }

    if (isAiCore) {
      setAiCoreParticipants((previous) => {
        if (previous.some((participant) => participant.name === nextParticipant.name)) {
          return previous
        }
        return [...previous, nextParticipant]
      })
      return
    }

    if (!isWorkflowProject || !workflowProjectId) return

    setWorkflowParticipantsByProject((previous) => {
      const currentParticipants = Object.prototype.hasOwnProperty.call(
        previous,
        workflowProjectId
      )
        ? previous[workflowProjectId] ?? []
        : getDefaultParticipantsForProject(activeWorkflowProject)

      if (currentParticipants.some((participant) => participant.name === nextParticipant.name)) {
        return previous
      }

      return {
        ...previous,
        [workflowProjectId]: [...currentParticipants, nextParticipant],
      }
    })
  }, [isAiCore, isWorkflowProject, workflowProjectId, activeWorkflowProject])

  const handleRemoveUser = useCallback((user: ChatParticipant) => {
    if (isAiCore) {
      setAiCoreParticipants((previous) =>
        previous.filter((participant) => participant.name !== user.name)
      )
      return
    }

    if (!isWorkflowProject || !workflowProjectId) return

    setWorkflowParticipantsByProject((previous) => {
      const currentParticipants = Object.prototype.hasOwnProperty.call(
        previous,
        workflowProjectId
      )
        ? previous[workflowProjectId] ?? []
        : getDefaultParticipantsForProject(activeWorkflowProject)

      return {
        ...previous,
        [workflowProjectId]: currentParticipants.filter(
          (participant) => participant.name !== user.name
        ),
      }
    })
  }, [isAiCore, isWorkflowProject, workflowProjectId, activeWorkflowProject])

  const createNewChat = useCallback(() => {
    const now = Date.now()
    const id = `chat-${now}-${Math.random().toString(36).slice(2, 8)}`
    const nextChat: StoredChatItem = {
      id,
      title: "New chat",
      updatedAt: now,
      pinned: false,
      path: `/ai-core?chat=${id}`,
    }

    let currentChats: StoredChatItem[] = []
    try {
      const raw = window.localStorage.getItem(AI_CORE_CHATS_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          currentChats = parsed.filter(
            (item): item is StoredChatItem =>
              item &&
              typeof item === "object" &&
              typeof item.id === "string" &&
              typeof item.title === "string" &&
              typeof item.updatedAt === "number"
          )
        }
      }
    } catch {
      currentChats = []
    }

    const nextChats = [nextChat, ...currentChats]
    window.localStorage.setItem(AI_CORE_CHATS_STORAGE_KEY, JSON.stringify(nextChats))
    window.dispatchEvent(new CustomEvent(AI_CORE_CHATS_UPDATED_EVENT))
    router.push(nextChat.path ?? "/ai-core")
  }, [router])

  useEffect(() => {
    const handleOpenEvent = () => {
      if (!canManageUsersFromNavbar) return
      openUserPicker()
    }

    window.addEventListener(OPEN_MANAGE_CHAT_USERS_EVENT, handleOpenEvent as EventListener)
    return () =>
      window.removeEventListener(OPEN_MANAGE_CHAT_USERS_EVENT, handleOpenEvent as EventListener)
  }, [canManageUsersFromNavbar, openUserPicker])

  useEffect(() => {
    if (!isUserPickerOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeUserPicker()
      }
    }

    const handlePointerOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (userPickerCardRef.current?.contains(target)) return
      closeUserPicker()
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handlePointerOutside)
    document.addEventListener("touchstart", handlePointerOutside)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handlePointerOutside)
      document.removeEventListener("touchstart", handlePointerOutside)
    }
  }, [isUserPickerOpen, closeUserPicker])

  return (
    <>
      <header className="sticky top-0 z-40 flex h-10 shrink-0 items-center justify-between gap-1 border-b bg-background px-3">
        <div className="flex items-center gap-1.5">
          {sidebarState === "collapsed" && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <HugeiconsIcon icon={SidebarLeftIcon} strokeWidth={1.5} className="size-4 rtl:rotate-180" />
            </button>
          )}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle(pathname)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-1.5">
          {isSkills && (
            <Button size="sm" className="h-7 gap-1.5 px-2.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              New skill
            </Button>
          )}
          {isWorkflowProject && (
            <>
              <button
                type="button"
                onClick={requestWorkflowRun}
                disabled={activeWorkflowControlState.isRunning}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2.5 text-xs text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
              >
                {activeWorkflowControlState.isRunning ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                {activeWorkflowControlState.isRunning ? "Running..." : "Run"}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      disabled={activeWorkflowControlState.isPublishing}
                      className="inline-flex h-7 items-center gap-1 rounded-md bg-foreground px-2.5 text-xs text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-70"
                    />
                  }
                >
                  {activeWorkflowControlState.isPublishing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Rocket className="h-3.5 w-3.5" />
                  )}
                  {workflowPublishButtonLabel}
                  <ChevronDown className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-56">
                  <DropdownMenuGroup>
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <p className="truncate text-sm font-medium text-foreground">
                        {activeWorkflowProject?.title ?? "Workflow Project"}
                      </p>
                      <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        v1.2
                      </span>
                    </div>
                  </DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={requestWorkflowPublish}
                    disabled={activeWorkflowControlState.isPublishing}
                    className="bg-foreground text-background hover:bg-foreground/90 focus:bg-foreground/90 focus:text-background"
                  >
                    <Rocket className="h-3.5 w-3.5" />
                    Update Workflow
                  </DropdownMenuItem>
                  <div className="px-2 py-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      12m ago by Ethan Walker
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <Play className="h-3.5 w-3.5" />
                        Run Workflow
                      </span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent align="end" className="min-w-52">
                      <DropdownMenuItem
                        onClick={requestWorkflowRun}
                        disabled={activeWorkflowControlState.isRunning}
                      >
                        <Play className="h-3.5 w-3.5" />
                        Run now
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => requestWorkflowSetAutoRun({ mode: "off" })}>
                        Off
                        <span className="ms-auto text-xs text-muted-foreground">
                          {activeWorkflowControlState.runSchedule.mode === "off" ? "Active" : ""}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Every</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent align="end" className="min-w-56">
                          <DropdownMenuItem
                            onClick={() =>
                              requestWorkflowSetAutoRun({
                                mode: "every",
                                value: 5,
                                unit: "minutes",
                              })
                            }
                          >
                            5 minutes
                            <span className="ms-auto text-xs text-muted-foreground">
                              {activeWorkflowControlState.runSchedule.mode === "every" &&
                              activeWorkflowControlState.runSchedule.value === 5 &&
                              activeWorkflowControlState.runSchedule.unit === "minutes"
                                ? "Active"
                                : ""}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              requestWorkflowSetAutoRun({
                                mode: "every",
                                value: 1,
                                unit: "hours",
                              })
                            }
                          >
                            1 hour
                            <span className="ms-auto text-xs text-muted-foreground">
                              {activeWorkflowControlState.runSchedule.mode === "every" &&
                              activeWorkflowControlState.runSchedule.value === 1 &&
                              activeWorkflowControlState.runSchedule.unit === "hours"
                                ? "Active"
                                : ""}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              requestWorkflowSetAutoRun({
                                mode: "every",
                                value: 1,
                                unit: "days",
                              })
                            }
                          >
                            1 day
                            <span className="ms-auto text-xs text-muted-foreground">
                              {activeWorkflowControlState.runSchedule.mode === "every" &&
                              activeWorkflowControlState.runSchedule.value === 1 &&
                              activeWorkflowControlState.runSchedule.unit === "days"
                                ? "Active"
                                : ""}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              requestWorkflowSetAutoRun({
                                mode: "every",
                                value: 1,
                                unit: "weeks",
                              })
                            }
                          >
                            1 week
                            <span className="ms-auto text-xs text-muted-foreground">
                              {activeWorkflowControlState.runSchedule.mode === "every" &&
                              activeWorkflowControlState.runSchedule.value === 1 &&
                              activeWorkflowControlState.runSchedule.unit === "weeks"
                                ? "Active"
                                : ""}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              requestWorkflowSetAutoRun({
                                mode: "every",
                                value: 1,
                                unit: "months",
                              })
                            }
                          >
                            1 month
                            <span className="ms-auto text-xs text-muted-foreground">
                              {activeWorkflowControlState.runSchedule.mode === "every" &&
                              activeWorkflowControlState.runSchedule.value === 1 &&
                              activeWorkflowControlState.runSchedule.unit === "months"
                                ? "Active"
                                : ""}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>At</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent align="end" className="min-w-56">
                          <DropdownMenuItem
                            onClick={() =>
                              requestWorkflowSetAutoRun({ mode: "at", frequency: "day" })
                            }
                          >
                            Every day
                            <span className="ms-auto text-xs text-muted-foreground">
                              {activeWorkflowControlState.runSchedule.mode === "at" &&
                              activeWorkflowControlState.runSchedule.frequency === "day"
                                ? "Active"
                                : ""}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              requestWorkflowSetAutoRun({ mode: "at", frequency: "week" })
                            }
                          >
                            Every week
                            <span className="ms-auto text-xs text-muted-foreground">
                              {activeWorkflowControlState.runSchedule.mode === "at" &&
                              activeWorkflowControlState.runSchedule.frequency === "week"
                                ? "Active"
                                : ""}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              requestWorkflowSetAutoRun({ mode: "at", frequency: "month" })
                            }
                          >
                            Every month
                            <span className="ms-auto text-xs text-muted-foreground">
                              {activeWorkflowControlState.runSchedule.mode === "at" &&
                              activeWorkflowControlState.runSchedule.frequency === "month"
                                ? "Active"
                                : ""}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                    onClick={openWorkflowExecutionLog}
                    className="justify-between"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <FileClock className="h-3.5 w-3.5" />
                      View Execution Log
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </DropdownMenuItem>
                  <div className="px-2 py-1 text-[11px] text-muted-foreground">
                    Auto-run: {getAutoRunLabel(activeWorkflowControlState.runSchedule)}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {shouldShowParticipantsTrigger && (
            <AvatarGroupTooltipTransitionDemo
              users={activeParticipants}
              onOpenUserPicker={openUserPicker}
              manageUsersLabel={manageUsersLabel}
            />
          )}
          {isAiCore && (
            <button
              type="button"
              onClick={createNewChat}
              aria-label="Create new chat"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>
      {canManageUsersFromNavbar && isUserPickerOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div
            ref={userPickerCardRef}
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-popover p-3 shadow-xl pointer-events-auto"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-base font-semibold text-popover-foreground">
                {manageUsersLabel}
              </p>
              <button
                type="button"
                aria-label="Close user picker"
                onClick={closeUserPicker}
                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-2 px-1">
              <Input
                value={userSearchQuery}
                onChange={(event) => setUserSearchQuery(event.target.value)}
                placeholder="Search by name or email"
                className="h-8"
              />
            </div>
            <div className="max-h-[70vh] space-y-1 overflow-y-auto">
              {filteredWorkspaceUsers.map((workspaceUser) => {
                const isIncluded = activeParticipantNames.has(workspaceUser.name)
                const isCurrentUser = workspaceUser.name === currentUserFullName
                const canRemove = isChatOwner && isIncluded && !isCurrentUser

                return (
                  <div
                    key={workspaceUser.name}
                    className="flex items-center justify-between gap-2 rounded-md px-1 py-1"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar size="sm" className="ring-background ring-2">
                        <AvatarImage src={workspaceUser.src} alt={workspaceUser.name} />
                        <AvatarFallback className="text-[10px]">{workspaceUser.fallback}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-popover-foreground">
                          {workspaceUser.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {workspaceUser.email}
                        </p>
                      </div>
                    </div>
                    {canRemove ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(workspaceUser)}
                        className="px-2 text-xs font-medium text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    ) : isIncluded ? (
                      <Button size="xs" variant="secondary" disabled>
                        Added
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleAddUser(workspaceUser)}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                )
              })}
              {filteredWorkspaceUsers.length === 0 && (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No users match this search.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
