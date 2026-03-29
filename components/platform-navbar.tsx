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
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/components/ui/sidebar"
import { Plus, X } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SidebarLeftIcon } from "@hugeicons/core-free-icons"

const OPEN_MANAGE_CHAT_USERS_EVENT = "open-manage-chat-users"
const AI_CORE_CHATS_STORAGE_KEY = "ai-core-chats"
const AI_CORE_CHATS_UPDATED_EVENT = "ai-core-chats-updated"

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

export function PlatformNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state: sidebarState, toggleSidebar } = useSidebar()
  const userPickerCardRef = useRef<HTMLDivElement>(null)
  const isAiCore = pathname.startsWith("/ai-core")
  const isSkills = pathname.startsWith("/skills")
  const isChatOwner = true
  const currentUserFullName = "Amir Haddad"
  const [isUserPickerOpen, setIsUserPickerOpen] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const workspaceUsers = useMemo<WorkspaceUser[]>(
    () => [
      { name: currentUserFullName, fallback: "AH", email: "amir.haddad@atmet.ai" },
      { name: "Sarah Reed", fallback: "SR", email: "sarah.reed@atmet.ai" },
      { name: "Noah Ali", fallback: "NA", email: "noah.ali@atmet.ai" },
      { name: "Lina Omar", fallback: "LO", email: "lina.omar@atmet.ai" },
      { name: "Kareem Aziz", fallback: "KA", email: "kareem.aziz@atmet.ai" },
      { name: "Automation Bot", fallback: "AB", email: "automation.bot@atmet.ai" },
      { name: "Product Manager", fallback: "PM", email: "product.manager@atmet.ai" },
      { name: "Engineer", fallback: "EN", email: "engineer@atmet.ai" },
    ],
    []
  )
  const [chatParticipants, setChatParticipants] = useState<ChatParticipant[]>([
    { name: currentUserFullName, fallback: "AH" },
  ])
  const chatParticipantNames = useMemo(
    () => new Set(chatParticipants.map((participant) => participant.name)),
    [chatParticipants]
  )
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
    setUserSearchQuery("")
    setIsUserPickerOpen(true)
  }, [])

  const closeUserPicker = useCallback(() => {
    setIsUserPickerOpen(false)
  }, [])

  const handleAddUser = useCallback((user: ChatParticipant) => {
    setChatParticipants((prev) => {
      if (prev.some((participant) => participant.name === user.name)) return prev
      return [...prev, user]
    })
  }, [])

  const handleRemoveUser = useCallback((user: ChatParticipant) => {
    setChatParticipants((prev) =>
      prev.filter((participant) => participant.name !== user.name)
    )
  }, [])

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
      if (!isAiCore) return
      openUserPicker()
    }

    window.addEventListener(OPEN_MANAGE_CHAT_USERS_EVENT, handleOpenEvent as EventListener)
    return () =>
      window.removeEventListener(OPEN_MANAGE_CHAT_USERS_EVENT, handleOpenEvent as EventListener)
  }, [isAiCore, openUserPicker])

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
      <header className="flex h-10 shrink-0 items-center justify-between gap-1 border-b px-3">
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
          {isAiCore && chatParticipants.length > 1 && (
            <AvatarGroupTooltipTransitionDemo
              users={chatParticipants}
              onOpenUserPicker={openUserPicker}
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
      {isAiCore && isUserPickerOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div
            ref={userPickerCardRef}
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-popover p-3 shadow-xl pointer-events-auto"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-base font-semibold text-popover-foreground">Manage chat users</p>
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
                const isInChat = chatParticipantNames.has(workspaceUser.name)
                const isCurrentUser = workspaceUser.name === currentUserFullName
                const canRemove = isChatOwner && isInChat && !isCurrentUser

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
                    ) : isInChat ? (
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
