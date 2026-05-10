"use client"

import Link from "next/link"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react"
import { useParams } from "next/navigation"
import AIPrompt from "@/components/kokonutui/ai-prompt"
import { Kbd } from "@/components/kbd"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ContextMenu5Wrapper } from "@/components/examples/c-context-menu-5"
import { Badge } from "@/registry/spell-ui/badge"
import { cn } from "@/lib/utils"
import { getWorkflowProject, type WorkflowProject } from "@/lib/workflow-projects"
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
  Check,
  Files,
  PenSquare,
  PlayCircle,
  Plus,
  Trash2,
  X,
  Zap,
  ChevronDown,
} from "lucide-react"

type WorkflowNode = {
  id: string
  nodeType: "Action" | "Trigger"
  stepName: string
  status: "Done" | "In review" | "Pending"
  executionStatus: "idle" | "running" | "success" | "error"
  owner: string
  provider: string
  model: string
  prompt: string
  tokenCount: number
  lastRan: string
  usedApps: string[]
  usedSkills: string[]
  files: string[]
  x: number
  y: number
}

type WorkflowEdge = {
  id: string
  sourceId: string
  targetId: string
}

type EdgeGeometry = WorkflowEdge & {
  path: string
  fromX: number
  fromY: number
  toX: number
  toY: number
  midX: number
  midY: number
}

type WorkflowSnapshot = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string
}

const NODE_WIDTH = 392
const DEFAULT_NODE_HEIGHT = 176
const CANVAS_GRID_STEP = 12
const WIRE_GRID_STEP = CANVAS_GRID_STEP
const WORKSPACE_WIDTH = 10000
const WORKSPACE_HEIGHT = 7000
const WORKSPACE_OFFSET_X = 2200
const WORKSPACE_OFFSET_Y = 1400
const OPEN_MANAGE_CHAT_USERS_EVENT = "open-manage-chat-users"
const EXECUTION_STATUS_META: Record<
  WorkflowNode["executionStatus"],
  { label: string; dotClass: string; borderClass: string }
> = {
  idle: {
    label: "Idle",
    dotClass: "bg-muted-foreground/45",
    borderClass: "border-border/80",
  },
  running: {
    label: "Running",
    dotClass: "bg-sky-500 animate-pulse",
    borderClass: "border-sky-300 dark:border-sky-500/65",
  },
  success: {
    label: "Success",
    dotClass: "bg-emerald-500",
    borderClass: "border-emerald-300 dark:border-emerald-500/65",
  },
  error: {
    label: "Error",
    dotClass: "bg-red-500",
    borderClass: "border-red-300 dark:border-red-500/65",
  },
}

function snapToGrid(value: number, step: number) {
  return Math.round(value / step) * step
}

function snapCanvasCoord(value: number) {
  return Math.max(CANVAS_GRID_STEP, snapToGrid(value, CANVAS_GRID_STEP))
}

function getOrthogonalWirePath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  if (fromX === toX) {
    const topY = Math.min(fromY, toY)
    const bottomY = Math.max(fromY, toY)
    return {
      path: `M ${fromX} ${topY} L ${fromX} ${bottomY}`,
      midX: fromX,
      midY: (topY + bottomY) / 2,
    }
  }

  const verticalDirection = toY >= fromY ? 1 : -1
  const horizontalDirection =
    toX > fromX
      ? 1
      : -1

  const exitY = snapToGrid(fromY + verticalDirection * WIRE_GRID_STEP, WIRE_GRID_STEP)
  let entryY = snapToGrid(toY - verticalDirection * WIRE_GRID_STEP, WIRE_GRID_STEP)
  if (Math.abs(entryY - exitY) < WIRE_GRID_STEP) {
    entryY = snapToGrid(entryY - verticalDirection * WIRE_GRID_STEP, WIRE_GRID_STEP)
  }

  const laneBaseX =
    (fromX + toX) / 2 + horizontalDirection * WIRE_GRID_STEP
  const laneX = snapToGrid(laneBaseX, WIRE_GRID_STEP)

  const points: Array<{ x: number; y: number }> = [
    { x: fromX, y: fromY },
    { x: fromX, y: exitY },
    { x: laneX, y: exitY },
    { x: laneX, y: entryY },
    { x: toX, y: entryY },
    { x: toX, y: toY },
  ]

  const path = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ")

  const segmentLengths = points.slice(0, -1).map((point, index) => {
    const next = points[index + 1]
    return Math.abs(next.x - point.x) + Math.abs(next.y - point.y)
  })
  const total = segmentLengths.reduce((sum, length) => sum + length, 0)
  const half = total / 2

  let midX = points[0]?.x ?? fromX
  let midY = points[0]?.y ?? fromY
  let traversed = 0

  for (let i = 0; i < segmentLengths.length; i += 1) {
    const length = segmentLengths[i] ?? 0
    const start = points[i]
    const end = points[i + 1]
    if (!start || !end) continue

    if (traversed + length >= half) {
      const remaining = half - traversed
      if (start.x === end.x) {
        midX = start.x
        midY = start.y + (end.y > start.y ? remaining : -remaining)
      } else {
        midX = start.x + (end.x > start.x ? remaining : -remaining)
        midY = start.y
      }
      break
    }
    traversed += length
  }

  return { path, midX, midY }
}

function buildNodes(project: WorkflowProject): WorkflowNode[] {
  const lastRanSamples = ["Just now", "3 min ago", "11 min ago", "1 hr ago"]
  const skillPool = [
    "Summarization",
    "Entity Extraction",
    "Risk Scoring",
    "Route to Owner",
    "Compliance QA",
    "Action Planner",
  ]

  return project.steps.map((step, index) => ({
    id: `${project.id}-node-${index + 1}`,
    nodeType: "Action",
    stepName: step.name,
    status: step.status,
    executionStatus: "idle",
    owner: step.owner,
    provider: index % 2 === 0 ? "Anthropic" : "ChatGPT",
    model: index % 2 === 0 ? "Claude Opus 4.1" : "GPT-5.2",
    prompt: `Execute "${step.name}" for ${project.title}. Return concise, structured output that can be passed to the next workflow node.`,
    tokenCount: 290 + index * 38,
    lastRan: lastRanSamples[index % lastRanSamples.length],
    usedApps:
      index % 2 === 0
        ? [index % 3 === 0 ? "Slack" : "Notion", "Airtable", "ChatGPT"]
        : ["GitHub", "Asana", "Anthropic"],
    usedSkills: [
      skillPool[(index + 1) % skillPool.length],
      skillPool[(index + 3) % skillPool.length],
    ],
    files: [
      `${step.name.replace(/\s+/g, "_")}_input.pdf`,
      `${step.name.replace(/\s+/g, "_")}_notes.txt`,
      `${step.name.replace(/\s+/g, "_")}_output.json`,
    ],
    x: snapCanvasCoord(WORKSPACE_OFFSET_X + 110),
    y: snapCanvasCoord(WORKSPACE_OFFSET_Y + 150 + index * 300),
  }))
}

function getRunScheduleIntervalMs(runSchedule: WorkflowRunSchedule) {
  if (runSchedule.mode === "off") return null
  if (runSchedule.mode === "every") {
    const multiplier =
      runSchedule.unit === "minutes"
        ? 1
        : runSchedule.unit === "hours"
          ? 60
          : runSchedule.unit === "days"
            ? 60 * 24
            : runSchedule.unit === "weeks"
              ? 60 * 24 * 7
              : 60 * 24 * 30
    return Math.max(1, runSchedule.value) * multiplier * 60 * 1000
  }
  return null
}

export default function WorkflowProjectPage() {
  const params = useParams<{ projectId: string }>()
  const projectId = Array.isArray(params?.projectId)
    ? params.projectId[0]
    : params?.projectId

  const project = useMemo(
    () => (projectId ? getWorkflowProject(projectId) : undefined),
    [projectId]
  )

  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [edges, setEdges] = useState<WorkflowEdge[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string>("")
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null)
  const [wireCursor, setWireCursor] = useState<{ x: number; y: number } | null>(null)
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null)
  const [filesDialogOpen, setFilesDialogOpen] = useState(false)
  const [executionLogOpen, setExecutionLogOpen] = useState(false)
  const [editingTitleNodeId, setEditingTitleNodeId] = useState<string | null>(null)
  const [titleDraft, setTitleDraft] = useState("")
  const [copiedNode, setCopiedNode] = useState<WorkflowNode | null>(null)
  const [historyPast, setHistoryPast] = useState<WorkflowSnapshot[]>([])
  const [historyFuture, setHistoryFuture] = useState<WorkflowSnapshot[]>([])
  const [contextMenuPoint, setContextMenuPoint] = useState<{ x: number; y: number } | null>(
    null
  )
  const [zoom, setZoom] = useState(1)
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false)
  const [isPublishingWorkflow, setIsPublishingWorkflow] = useState(false)
  const [publishState, setPublishState] = useState<"Draft" | "Published">("Draft")
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false)
  const [lastExecutionLabel, setLastExecutionLabel] = useState("Not run yet")
  const [chatPanelNodeId, setChatPanelNodeId] = useState<string | null>(null)
  const [isNodeChatPanelOpen, setIsNodeChatPanelOpen] = useState(false)
  const [runSchedule, setRunSchedule] = useState<WorkflowRunSchedule>({
    mode: "off",
  })
  const [nodeHeights, setNodeHeights] = useState<Record<string, number>>({})
  const viewportRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const edgeHoverTimeoutRef = useRef<number | null>(null)
  const runTimerRef = useRef<number | null>(null)
  const publishTimerRef = useRef<number | null>(null)
  const autoRunIntervalRef = useRef<number | null>(null)
  const autoRunTimeoutRef = useRef<number | null>(null)
  const focusAnimationFrameRef = useRef<number | null>(null)
  const nodesRef = useRef<WorkflowNode[]>([])
  const edgesRef = useRef<WorkflowEdge[]>([])
  const selectedNodeIdRef = useRef("")
  const panStateRef = useRef<{
    startClientX: number
    startClientY: number
    startScrollLeft: number
    startScrollTop: number
  } | null>(null)
  const dragStateRef = useRef<{
    nodeId: string
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const pointerCanvasPointRef = useRef<{ x: number; y: number } | null>(null)

  const setNodeHeightRef = useCallback((nodeId: string, element: HTMLDivElement | null) => {
    if (!element) return
    const measuredHeight = element.offsetHeight
    setNodeHeights((previous) =>
      previous[nodeId] === measuredHeight
        ? previous
        : { ...previous, [nodeId]: measuredHeight }
    )
  }, [])

  useEffect(() => {
    if (!project) return
    const initialNodes = buildNodes(project)
    const initialEdges = initialNodes.slice(0, -1).map((node, index) => ({
      id: `${node.id}->${initialNodes[index + 1]?.id}`,
      sourceId: node.id,
      targetId: initialNodes[index + 1]?.id ?? "",
    }))
    setNodes(initialNodes)
    setEdges(initialEdges.filter((edge) => edge.targetId.length > 0))
    setSelectedNodeId(initialNodes[0]?.id ?? "")
    setConnectingSourceId(null)
    setWireCursor(null)
    setHoveredEdgeId(null)
    setFilesDialogOpen(false)
    setExecutionLogOpen(false)
    setEditingTitleNodeId(null)
    setTitleDraft("")
    setCopiedNode(null)
    setHistoryPast([])
    setHistoryFuture([])
    setContextMenuPoint(null)
    setZoom(1)
    setIsSpacePressed(false)
    setIsPanning(false)
    setIsRunningWorkflow(false)
    setIsPublishingWorkflow(false)
    setPublishState("Draft")
    setHasUnpublishedChanges(false)
    setLastExecutionLabel("Not run yet")
    setChatPanelNodeId(null)
    setIsNodeChatPanelOpen(false)
    setRunSchedule({ mode: "off" })

    window.requestAnimationFrame(() => {
      const viewport = viewportRef.current
      if (!viewport || initialNodes.length === 0) return

      const firstNode = initialNodes[0]
      if (!firstNode) return
      const targetCenterX = firstNode.x + NODE_WIDTH / 2
      const targetCenterY = firstNode.y + DEFAULT_NODE_HEIGHT / 2

      viewport.scrollLeft = Math.max(
        0,
        targetCenterX - viewport.clientWidth / 2
      )
      viewport.scrollTop = Math.max(
        0,
        targetCenterY - viewport.clientHeight / 2
      )
    })
  }, [project])

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId]
  )
  const panelNode = useMemo(
    () => nodes.find((node) => node.id === chatPanelNodeId) ?? null,
    [chatPanelNodeId, nodes]
  )
  const hasSelectedNode = Boolean(selectedNode)
  const canPaste = Boolean(copiedNode)
  const canUndo = historyPast.length > 0
  const canRedo = historyFuture.length > 0

  useEffect(() => {
    if (isNodeChatPanelOpen || selectedNode) return

    const timeoutId = window.setTimeout(() => {
      setChatPanelNodeId(null)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [isNodeChatPanelOpen, selectedNode])

  const doneSteps = useMemo(
    () => nodes.filter((node) => node.status === "Done").length,
    [nodes]
  )
  const inReviewSteps = useMemo(
    () => nodes.filter((node) => node.status === "In review").length,
    [nodes]
  )
  const pendingSteps = useMemo(
    () => nodes.filter((node) => node.status === "Pending").length,
    [nodes]
  )
  const idleNodeCount = useMemo(
    () => nodes.filter((node) => node.executionStatus === "idle").length,
    [nodes]
  )
  const runningNodeCount = useMemo(
    () => nodes.filter((node) => node.executionStatus === "running").length,
    [nodes]
  )
  const successNodeCount = useMemo(
    () => nodes.filter((node) => node.executionStatus === "success").length,
    [nodes]
  )
  const errorNodeCount = useMemo(
    () => nodes.filter((node) => node.executionStatus === "error").length,
    [nodes]
  )
  const completionPercent = useMemo(() => {
    if (nodes.length === 0) return 0
    return Math.round((doneSteps / nodes.length) * 100)
  }, [doneSteps, nodes.length])
  const totalTokenCount = useMemo(
    () => nodes.reduce((sum, node) => sum + node.tokenCount, 0),
    [nodes]
  )
  const uniqueAppsCount = useMemo(
    () => new Set(nodes.flatMap((node) => node.usedApps)).size,
    [nodes]
  )
  const uniqueSkillsCount = useMemo(
    () => new Set(nodes.flatMap((node) => node.usedSkills)).size,
    [nodes]
  )
  const totalFileCount = useMemo(
    () => nodes.reduce((sum, node) => sum + node.files.length, 0),
    [nodes]
  )
  const actionNodeCount = useMemo(
    () => nodes.filter((node) => node.nodeType === "Action").length,
    [nodes]
  )
  const triggerNodeCount = useMemo(
    () => nodes.filter((node) => node.nodeType === "Trigger").length,
    [nodes]
  )
  const orderedNodes = useMemo(
    () => [...nodes].sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x)),
    [nodes]
  )
  const runScheduleLabel = useMemo(() => {
    if (runSchedule.mode === "off") return "Manual only"
    if (runSchedule.mode === "every") {
      return `Every ${runSchedule.value} ${runSchedule.unit}`
    }
    const runAt = new Date(runSchedule.atISO)
    if (Number.isNaN(runAt.getTime())) return "One-time schedule set"
    return `At ${runAt.toLocaleString()}`
  }, [runSchedule])
  const executionTimeline = useMemo(() => {
    if (lastExecutionLabel === "Not run yet") {
      return [
        {
          title: "No execution yet",
          detail: "Run the workflow to generate a full event timeline.",
        },
        {
          title: "Publish state",
          detail: publishState === "Published" ? "Published and active" : "Draft",
        },
        {
          title: "Scheduler",
          detail: runScheduleLabel,
        },
      ]
    }
    return [
      {
        title: "Workflow started",
        detail: `Latest run ${lastExecutionLabel}`,
      },
      {
        title: "Node processing",
        detail: `${doneSteps} done • ${inReviewSteps} in review • ${pendingSteps} pending`,
      },
      {
        title: "Execution snapshot",
        detail: `${totalTokenCount.toLocaleString()} tokens across ${nodes.length} nodes`,
      },
      {
        title: "Publish state",
        detail: publishState === "Published" ? "Published and active" : "Draft",
      },
    ]
  }, [
    doneSteps,
    inReviewSteps,
    lastExecutionLabel,
    nodes.length,
    pendingSteps,
    publishState,
    runScheduleLabel,
    totalTokenCount,
  ])

  const nodeMap = useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes]
  )

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    edgesRef.current = edges
  }, [edges])

  useEffect(() => {
    selectedNodeIdRef.current = selectedNodeId
  }, [selectedNodeId])

  const cloneSnapshot = useCallback(
    (snapshot: WorkflowSnapshot): WorkflowSnapshot => ({
      nodes: snapshot.nodes.map((node) => ({ ...node })),
      edges: snapshot.edges.map((edge) => ({ ...edge })),
      selectedNodeId: snapshot.selectedNodeId,
    }),
    []
  )

  const getCurrentSnapshot = useCallback(
    (): WorkflowSnapshot => ({
      nodes: nodesRef.current.map((node) => ({ ...node })),
      edges: edgesRef.current.map((edge) => ({ ...edge })),
      selectedNodeId: selectedNodeIdRef.current,
    }),
    []
  )

  const pushHistorySnapshot = useCallback(() => {
    const snapshot = getCurrentSnapshot()
    setHistoryPast((previous) => [...previous, snapshot])
    setHistoryFuture([])
  }, [getCurrentSnapshot])

  const applySnapshot = useCallback((snapshot: WorkflowSnapshot) => {
    const next = cloneSnapshot(snapshot)
    setNodes(next.nodes)
    setEdges(next.edges)
    setSelectedNodeId(next.selectedNodeId)
    setConnectingSourceId(null)
    setWireCursor(null)
    setHoveredEdgeId(null)
    setEditingTitleNodeId(null)
    setTitleDraft("")
  }, [cloneSnapshot])

  const markProjectChanged = useCallback(() => {
    setHasUnpublishedChanges(true)
    setPublishState("Draft")
  }, [])

  const handleUndo = useCallback(() => {
    setHistoryPast((previous) => {
      if (previous.length === 0) return previous
      const previousSnapshot = previous[previous.length - 1]
      setHistoryFuture((future) => [getCurrentSnapshot(), ...future])
      applySnapshot(previousSnapshot)
      markProjectChanged()
      return previous.slice(0, -1)
    })
  }, [applySnapshot, getCurrentSnapshot, markProjectChanged])

  const handleRedo = useCallback(() => {
    setHistoryFuture((future) => {
      if (future.length === 0) return future
      const [nextSnapshot, ...rest] = future
      setHistoryPast((previous) => [...previous, getCurrentSnapshot()])
      applySnapshot(nextSnapshot)
      markProjectChanged()
      return rest
    })
  }, [applySnapshot, getCurrentSnapshot, markProjectChanged])

  const edgeGeometries = useMemo<EdgeGeometry[]>(() => {
    return edges
      .map((edge) => {
        const sourceNode = nodeMap.get(edge.sourceId)
        const targetNode = nodeMap.get(edge.targetId)
        if (!sourceNode || !targetNode) return null
        const sourceHeight = nodeHeights[sourceNode.id] ?? DEFAULT_NODE_HEIGHT

        const fromX = sourceNode.x + NODE_WIDTH / 2
        const fromY = sourceNode.y + sourceHeight
        const toX = targetNode.x + NODE_WIDTH / 2
        const toY = targetNode.y
        const { path, midX, midY } = getOrthogonalWirePath(fromX, fromY, toX, toY)

        return { ...edge, path, fromX, fromY, toX, toY, midX, midY }
      })
      .filter((edge): edge is EdgeGeometry => edge !== null)
  }, [edges, nodeHeights, nodeMap])

  const draftWirePath = useMemo(() => {
    if (!connectingSourceId || !wireCursor) return null
    const sourceNode = nodeMap.get(connectingSourceId)
    if (!sourceNode) return null
    const sourceHeight = nodeHeights[sourceNode.id] ?? DEFAULT_NODE_HEIGHT

    const fromX = sourceNode.x + NODE_WIDTH / 2
    const fromY = sourceNode.y + sourceHeight
    const toX = wireCursor.x
    const toY = wireCursor.y
    return getOrthogonalWirePath(fromX, fromY, toX, toY).path
  }, [connectingSourceId, nodeHeights, nodeMap, wireCursor])

  const handleRunWorkflow = useCallback(() => {
    if (isRunningWorkflow) return
    if (runTimerRef.current !== null) {
      window.clearTimeout(runTimerRef.current)
      runTimerRef.current = null
    }

    const totalNodes = nodesRef.current.length
    if (totalNodes === 0) return

    setIsRunningWorkflow(true)
    setNodes((previous) =>
      previous.map((node) => ({
        ...node,
        status: "Pending",
        executionStatus: "idle",
        lastRan: "Queued...",
      }))
    )

    const errorIndex =
      totalNodes > 2 && Math.random() < 0.35
        ? Math.floor(Math.random() * totalNodes)
        : -1

    const executeNodeAt = (index: number) => {
      if (index >= totalNodes) {
        setLastExecutionLabel("Just now")
        setIsRunningWorkflow(false)
        runTimerRef.current = null
        return
      }

      setNodes((previous) =>
        previous.map((node, nodeIndex) =>
          nodeIndex === index
            ? {
                ...node,
                status: "In review",
                executionStatus: "running",
                lastRan: "Running...",
              }
            : node
        )
      )

      runTimerRef.current = window.setTimeout(() => {
        const isError = index === errorIndex
        setNodes((previous) =>
          previous.map((node, nodeIndex) =>
            nodeIndex === index
              ? {
                  ...node,
                  status: isError ? "Pending" : "Done",
                  executionStatus: isError ? "error" : "success",
                  lastRan: "Just now",
                }
              : node
          )
        )
        executeNodeAt(index + 1)
      }, 600)
    }

    executeNodeAt(0)
  }, [isRunningWorkflow])

  const handlePublishWorkflow = useCallback(() => {
    if (isPublishingWorkflow) return
    if (publishTimerRef.current !== null) {
      window.clearTimeout(publishTimerRef.current)
      publishTimerRef.current = null
    }

    setIsPublishingWorkflow(true)

    publishTimerRef.current = window.setTimeout(() => {
      setPublishState("Published")
      setHasUnpublishedChanges(false)
      setIsPublishingWorkflow(false)
      publishTimerRef.current = null
    }, 900)
  }, [isPublishingWorkflow])

  const toggleConnection = (sourceId: string, targetId: string) => {
    if (!sourceId || !targetId || sourceId === targetId) return
    pushHistorySnapshot()
    markProjectChanged()
    setEdges((previous) => {
      const existing = previous.find(
        (edge) => edge.sourceId === sourceId && edge.targetId === targetId
      )
      if (existing) {
        return previous.filter((edge) => edge.id !== existing.id)
      }
      return [
        ...previous,
        {
          id: `${sourceId}->${targetId}`,
          sourceId,
          targetId,
        },
      ]
    })
  }

  const getCanvasPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const canvasRect = canvas.getBoundingClientRect()
    return {
      x: Math.round((clientX - canvasRect.left) / zoom),
      y: Math.round((clientY - canvasRect.top) / zoom),
    }
  }

  const clearWireDraft = () => {
    setConnectingSourceId(null)
    setWireCursor(null)
  }

  const startTitleEdit = (node: WorkflowNode) => {
    setSelectedNodeId(node.id)
    setEditingTitleNodeId(node.id)
    setTitleDraft(node.stepName)
  }

  const openNodeChatPanel = (node: WorkflowNode) => {
    setSelectedNodeId(node.id)
    setChatPanelNodeId(node.id)
    setIsNodeChatPanelOpen(true)
  }

  const commitTitleEdit = (nodeId: string) => {
    const nextTitle = titleDraft.trim()
    if (!nextTitle) {
      setEditingTitleNodeId(null)
      setTitleDraft("")
      return
    }
    pushHistorySnapshot()
    markProjectChanged()
    setNodes((previous) =>
      previous.map((node) =>
        node.id === nodeId ? { ...node, stepName: nextTitle } : node
      )
    )
    setEditingTitleNodeId(null)
    setTitleDraft("")
  }

  const addNodeNextTo = (sourceNodeId: string) => {
    const source = nodes.find((node) => node.id === sourceNodeId)
    if (!source) return
    const projectKey = project?.id ?? "workflow"
    const newId = `${projectKey}-node-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`
    const newNode: WorkflowNode = {
      id: newId,
      nodeType: source.nodeType,
      stepName: "New Step",
      status: "Pending",
      executionStatus: "idle",
      owner: "You",
      provider: source.provider,
      model: source.model,
      prompt: "Define what this node should do.",
      tokenCount: 0,
      lastRan: "Never",
      usedApps: [source.provider],
      usedSkills: ["Action Planner"],
      files: [],
      x: snapCanvasCoord(source.x + NODE_WIDTH + 52),
      y: snapCanvasCoord(source.y),
    }

    pushHistorySnapshot()
    markProjectChanged()
    setNodes((previous) => {
      const sourceIndex = previous.findIndex((node) => node.id === sourceNodeId)
      if (sourceIndex === -1) return [...previous, newNode]
      return [
        ...previous.slice(0, sourceIndex + 1),
        newNode,
        ...previous.slice(sourceIndex + 1),
      ]
    })
    setEdges((previous) => [
      ...previous,
      { id: `${sourceNodeId}->${newId}`, sourceId: sourceNodeId, targetId: newId },
    ])
    setSelectedNodeId(newId)
    setEditingTitleNodeId(newId)
    setTitleDraft("New Step")
    clearWireDraft()
  }

  const deleteNode = (nodeId: string) => {
    pushHistorySnapshot()
    const remainingNodes = nodes.filter((node) => node.id !== nodeId)
    markProjectChanged()
    setNodes(remainingNodes)
    setEdges((previous) =>
      previous.filter(
        (edge) => edge.sourceId !== nodeId && edge.targetId !== nodeId
      )
    )
    setSelectedNodeId((previous) => {
      if (previous !== nodeId) return previous
      return remainingNodes[0]?.id ?? ""
    })
    setConnectingSourceId((previous) => (previous === nodeId ? null : previous))
    setHoveredEdgeId(null)
    setFilesDialogOpen(false)
    setEditingTitleNodeId((previous) => (previous === nodeId ? null : previous))
  }

  const addNodeAtPosition = (
    x: number,
    y: number,
    options?: { template?: WorkflowNode; preserveStepName?: boolean }
  ) => {
    const projectKey = project?.id ?? "workflow"
    const newId = `${projectKey}-node-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`
    const template = options?.template ?? copiedNode
    const preserveStepName = options?.preserveStepName ?? false
    const snappedX = snapCanvasCoord(x)
    const snappedY = snapCanvasCoord(y)
    const newNode: WorkflowNode = template
      ? {
          ...template,
          id: newId,
          stepName: preserveStepName ? template.stepName : `${template.stepName} Copy`,
          status: "Pending",
          executionStatus: "idle",
          lastRan: "Never",
          x: snappedX,
          y: snappedY,
        }
      : {
          id: newId,
          nodeType: "Action",
          stepName: "New Step",
          status: "Pending",
          executionStatus: "idle",
          owner: "You",
          provider: "ChatGPT",
          model: "GPT-5.2",
          prompt: "Define what this node should do.",
          tokenCount: 0,
          lastRan: "Never",
          usedApps: ["ChatGPT"],
          usedSkills: ["Action Planner"],
          files: [],
          x: snappedX,
          y: snappedY,
        }

    pushHistorySnapshot()
    markProjectChanged()
    setNodes((previous) => [...previous, newNode])
    setSelectedNodeId(newId)
    setEditingTitleNodeId(newId)
    setTitleDraft(newNode.stepName)
    clearWireDraft()
  }

  const addNodeFromContextMenu = () => {
    if (selectedNodeId && nodeMap.has(selectedNodeId)) {
      addNodeNextTo(selectedNodeId)
      return
    }

    if (contextMenuPoint) {
      addNodeAtPosition(
        Math.max(16, Math.round(contextMenuPoint.x - NODE_WIDTH / 2)),
        Math.max(16, Math.round(contextMenuPoint.y - 120))
      )
      return
    }

    const viewport = viewportRef.current
    if (!viewport) {
      addNodeAtPosition(WORKSPACE_OFFSET_X, WORKSPACE_OFFSET_Y)
      return
    }

    addNodeAtPosition(
      Math.max(16, Math.round((viewport.scrollLeft + viewport.clientWidth / 2) / zoom - NODE_WIDTH / 2)),
      Math.max(16, Math.round((viewport.scrollTop + viewport.clientHeight / 2) / zoom - 120))
    )
  }

  const editSelectedNode = () => {
    const selected = nodeMap.get(selectedNodeId)
    if (!selected) return
    openNodeChatPanel(selected)
  }

  const copySelectedNode = () => {
    const selected = nodeMap.get(selectedNodeId)
    if (!selected) return
    setCopiedNode({ ...selected })
  }

  const duplicateSelectedNode = () => {
    const selected = nodeMap.get(selectedNodeId)
    if (!selected) return
    setCopiedNode({ ...selected })
    addNodeAtPosition(selected.x + 48, selected.y + 48, {
      template: selected,
      preserveStepName: true,
    })
  }

  const pasteCopiedNode = useCallback(() => {
    if (!copiedNode) return

    const pointerPoint = pointerCanvasPointRef.current
    if (pointerPoint) {
      addNodeAtPosition(
        Math.max(16, Math.round(pointerPoint.x - NODE_WIDTH / 2)),
        Math.max(16, Math.round(pointerPoint.y - 120)),
        { template: copiedNode, preserveStepName: true }
      )
      return
    }

    if (contextMenuPoint) {
      addNodeAtPosition(
        Math.max(16, Math.round(contextMenuPoint.x - NODE_WIDTH / 2)),
        Math.max(16, Math.round(contextMenuPoint.y - 120)),
        { template: copiedNode, preserveStepName: true }
      )
      return
    }

    const viewport = viewportRef.current
    if (!viewport) return
    addNodeAtPosition(
      Math.max(16, Math.round((viewport.scrollLeft + viewport.clientWidth / 2) / zoom - NODE_WIDTH / 2)),
      Math.max(16, Math.round((viewport.scrollTop + viewport.clientHeight / 2) / zoom - 120)),
      { template: copiedNode, preserveStepName: true }
    )
  }, [addNodeAtPosition, contextMenuPoint, copiedNode, zoom])

  const focusFirstNodeWithAnimation = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const targetNode =
      (selectedNodeId ? nodeMap.get(selectedNodeId) : undefined) ??
      nodesRef.current[0]

    if (focusAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(focusAnimationFrameRef.current)
      focusAnimationFrameRef.current = null
    }

    const startZoom = zoom
    const targetZoom = 1
    const startLeft = viewport.scrollLeft
    const startTop = viewport.scrollTop

    const targetNodeHeight = targetNode
      ? (nodeHeights[targetNode.id] ?? DEFAULT_NODE_HEIGHT)
      : DEFAULT_NODE_HEIGHT
    const targetCenterX = targetNode
      ? targetNode.x + NODE_WIDTH / 2
      : WORKSPACE_WIDTH / 2
    const targetCenterY = targetNode
      ? targetNode.y + targetNodeHeight / 2
      : WORKSPACE_HEIGHT / 2
    const targetLeft = Math.max(
      0,
      targetCenterX * targetZoom - viewport.clientWidth / 2
    )
    const targetTop = Math.max(
      0,
      targetCenterY * targetZoom - viewport.clientHeight / 2
    )
    const startTime = performance.now()
    const durationMs = 260
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs)
      const eased = easeOutCubic(progress)

      setZoom(startZoom + (targetZoom - startZoom) * eased)
      viewport.scrollLeft = startLeft + (targetLeft - startLeft) * eased
      viewport.scrollTop = startTop + (targetTop - startTop) * eased

      if (progress < 1) {
        focusAnimationFrameRef.current = window.requestAnimationFrame(animate)
        return
      }

      setZoom(targetZoom)
      viewport.scrollLeft = targetLeft
      viewport.scrollTop = targetTop
      focusAnimationFrameRef.current = null
    }

    focusAnimationFrameRef.current = window.requestAnimationFrame(animate)
  }, [nodeHeights, nodeMap, selectedNodeId, zoom])

  const deleteSelectedNode = () => {
    if (!selectedNodeId || !nodeMap.has(selectedNodeId)) return
    deleteNode(selectedNodeId)
  }

  const setNodeType = (nodeId: string, nodeType: "Action" | "Trigger") => {
    const existingNode = nodeMap.get(nodeId)
    if (!existingNode || existingNode.nodeType === nodeType) return
    pushHistorySnapshot()
    markProjectChanged()
    setNodes((previous) =>
      previous.map((node) =>
        node.id === nodeId ? { ...node, nodeType } : node
      )
    )
  }

  const showEdgeDelete = (edgeId: string) => {
    if (edgeHoverTimeoutRef.current !== null) {
      window.clearTimeout(edgeHoverTimeoutRef.current)
      edgeHoverTimeoutRef.current = null
    }
    setHoveredEdgeId(edgeId)
  }

  const hideEdgeDeleteSoon = (edgeId: string) => {
    if (edgeHoverTimeoutRef.current !== null) {
      window.clearTimeout(edgeHoverTimeoutRef.current)
    }
    edgeHoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredEdgeId((previous) => (previous === edgeId ? null : previous))
      edgeHoverTimeoutRef.current = null
    }, 120)
  }

  const handleStartConnectionMode = (nodeId: string) => {
    setSelectedNodeId(nodeId)
    setConnectingSourceId((previous) => (previous === nodeId ? null : nodeId))
    const sourceNode = nodeMap.get(nodeId)
    if (!sourceNode) {
      setWireCursor(null)
      return
    }
    const sourceHeight = nodeHeights[sourceNode.id] ?? DEFAULT_NODE_HEIGHT
    setWireCursor({
      x: sourceNode.x + NODE_WIDTH / 2,
      y: sourceNode.y + sourceHeight,
    })
  }

  const handleNodePointerDown = (
    nodeId: string,
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (connectingSourceId) {
      event.preventDefault()
      return
    }
    if (isSpacePressed || isPanning) {
      event.preventDefault()
      return
    }
    if (event.button !== 0) return
    const canvas = canvasRef.current
    const targetNode = nodes.find((node) => node.id === nodeId)
    if (!canvas || !targetNode) return

    const canvasRect = canvas.getBoundingClientRect()
    const pointerLocalX = event.clientX - canvasRect.left
    const pointerLocalY = event.clientY - canvasRect.top

    dragStateRef.current = {
      nodeId,
      pointerOffsetX: pointerLocalX - targetNode.x,
      pointerOffsetY: pointerLocalY - targetNode.y,
    }
    setSelectedNodeId(nodeId)
    setDraggingNodeId(nodeId)
  }

  useEffect(() => {
    if (!draggingNodeId) return
    let movedNode = false

    const onPointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      const canvas = canvasRef.current
      if (!dragState || !canvas) return

      const canvasRect = canvas.getBoundingClientRect()
      const nextX = Math.max(
        CANVAS_GRID_STEP,
        snapToGrid(event.clientX - canvasRect.left - dragState.pointerOffsetX, CANVAS_GRID_STEP)
      )
      const nextY = Math.max(
        CANVAS_GRID_STEP,
        snapToGrid(event.clientY - canvasRect.top - dragState.pointerOffsetY, CANVAS_GRID_STEP)
      )
      if (!movedNode) {
        pushHistorySnapshot()
      }
      movedNode = true

      setNodes((previous) =>
        previous.map((node) =>
          node.id === dragState.nodeId ? { ...node, x: nextX, y: nextY } : node
        )
      )
    }

    const finishDrag = () => {
      if (movedNode) {
        markProjectChanged()
      }
      dragStateRef.current = null
      setDraggingNodeId(null)
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", finishDrag)
    window.addEventListener("pointercancel", finishDrag)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", finishDrag)
      window.removeEventListener("pointercancel", finishDrag)
    }
  }, [draggingNodeId, markProjectChanged, pushHistorySnapshot])

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      return (
        target.isContentEditable ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT"
      )
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return
      if (isEditableTarget(event.target)) return
      event.preventDefault()
      setIsSpacePressed(true)
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") return
      setIsSpacePressed(false)
      setIsPanning(false)
      panStateRef.current = null
    }

    const onWindowBlur = () => {
      setIsSpacePressed(false)
      setIsPanning(false)
      panStateRef.current = null
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onWindowBlur)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onWindowBlur)
    }
  }, [])

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      return (
        target.isContentEditable ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT"
      )
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return

      const hasPrimaryModifier = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()

      if (hasPrimaryModifier && key === "z" && event.shiftKey) {
        if (!canRedo) return
        event.preventDefault()
        handleRedo()
        return
      }

      if ((event.ctrlKey && key === "y") || (hasPrimaryModifier && key === "y")) {
        if (!canRedo) return
        event.preventDefault()
        handleRedo()
        return
      }

      if (hasPrimaryModifier && key === "z") {
        if (!canUndo) return
        event.preventDefault()
        handleUndo()
        return
      }

      if (hasPrimaryModifier && key === "n") {
        event.preventDefault()
        addNodeFromContextMenu()
        return
      }

      const isZeroShortcut =
        key === "0" || event.code === "Digit0" || event.code === "Numpad0"
      if (hasPrimaryModifier && isZeroShortcut) {
        event.preventDefault()
        focusFirstNodeWithAnimation()
        return
      }

      if (hasPrimaryModifier && key === "v") {
        if (!canPaste) return
        event.preventDefault()
        pasteCopiedNode()
        return
      }

      if (!hasSelectedNode) return

      if (hasPrimaryModifier && key === "e") {
        event.preventDefault()
        editSelectedNode()
        return
      }

      if (hasPrimaryModifier && key === "c") {
        event.preventDefault()
        copySelectedNode()
        return
      }

      if (hasPrimaryModifier && key === "d") {
        event.preventDefault()
        duplicateSelectedNode()
        return
      }

      if (key === "backspace" || key === "delete") {
        event.preventDefault()
        deleteSelectedNode()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [
    addNodeFromContextMenu,
    canPaste,
    canRedo,
    canUndo,
    copySelectedNode,
    deleteSelectedNode,
    duplicateSelectedNode,
    editSelectedNode,
    focusFirstNodeWithAnimation,
    handleRedo,
    handleUndo,
    hasSelectedNode,
    pasteCopiedNode,
  ])

  useEffect(() => {
    if (!isPanning) return

    const onPointerMove = (event: PointerEvent) => {
      const viewport = viewportRef.current
      const panState = panStateRef.current
      if (!viewport || !panState) return

      const deltaX = event.clientX - panState.startClientX
      const deltaY = event.clientY - panState.startClientY
      viewport.scrollLeft = panState.startScrollLeft - deltaX
      viewport.scrollTop = panState.startScrollTop - deltaY
    }

    const stopPanning = () => {
      panStateRef.current = null
      setIsPanning(false)
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", stopPanning)
    window.addEventListener("pointercancel", stopPanning)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", stopPanning)
      window.removeEventListener("pointercancel", stopPanning)
    }
  }, [isPanning])

  const handleViewportWheel = (event: ReactWheelEvent<HTMLElement>) => {
    if (!event.ctrlKey && !event.metaKey) return

    const viewport = viewportRef.current
    if (!viewport) return
    event.preventDefault()

    const viewportRect = viewport.getBoundingClientRect()
    const pointerX = event.clientX - viewportRect.left
    const pointerY = event.clientY - viewportRect.top
    const worldX = (viewport.scrollLeft + pointerX) / zoom
    const worldY = (viewport.scrollTop + pointerY) / zoom
    const directionScale = event.deltaY < 0 ? 1.1 : 0.9
    const nextZoom = Math.min(2.5, Math.max(0.5, zoom * directionScale))
    if (Math.abs(nextZoom - zoom) < 0.001) return

    setZoom(nextZoom)

    window.requestAnimationFrame(() => {
      const activeViewport = viewportRef.current
      if (!activeViewport) return
      activeViewport.scrollLeft = worldX * nextZoom - pointerX
      activeViewport.scrollTop = worldY * nextZoom - pointerY
    })
  }

  const handleViewportPointerDownCapture = (
    event: ReactPointerEvent<HTMLElement>
  ) => {
    if (!isSpacePressed || event.button !== 0) return
    const viewport = viewportRef.current
    if (!viewport) return

    panStateRef.current = {
      startClientX: event.clientX,
      startClientY: event.clientY,
      startScrollLeft: viewport.scrollLeft,
      startScrollTop: viewport.scrollTop,
    }
    setIsPanning(true)
    event.preventDefault()
    event.stopPropagation()
  }

  useEffect(() => {
    if (!connectingSourceId) return

    const onPointerMove = (event: PointerEvent) => {
      const point = getCanvasPoint(event.clientX, event.clientY)
      if (!point) return
      setWireCursor(point)
    }

    window.addEventListener("pointermove", onPointerMove)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [connectingSourceId])

  useEffect(() => {
    return () => {
      if (edgeHoverTimeoutRef.current !== null) {
        window.clearTimeout(edgeHoverTimeoutRef.current)
      }
      if (runTimerRef.current !== null) {
        window.clearTimeout(runTimerRef.current)
      }
      if (publishTimerRef.current !== null) {
        window.clearTimeout(publishTimerRef.current)
      }
      if (autoRunIntervalRef.current !== null) {
        window.clearInterval(autoRunIntervalRef.current)
      }
      if (autoRunTimeoutRef.current !== null) {
        window.clearTimeout(autoRunTimeoutRef.current)
      }
      if (focusAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(focusAnimationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!projectId) return

    const onRunWorkflow = (event: Event) => {
      try {
        const detail = (event as CustomEvent<WorkflowControlEventDetail>).detail
        if (!detail || detail.projectId !== projectId) return
        handleRunWorkflow()
      } catch (error) {
        console.error("Failed to run workflow action:", error)
      }
    }

    const onPublishWorkflow = (event: Event) => {
      try {
        const detail = (event as CustomEvent<WorkflowControlEventDetail>).detail
        if (!detail || detail.projectId !== projectId) return
        handlePublishWorkflow()
      } catch (error) {
        console.error("Failed to publish workflow action:", error)
      }
    }

    const onOpenExecutionLog = (event: Event) => {
      try {
        const detail = (event as CustomEvent<WorkflowControlEventDetail>).detail
        if (!detail || detail.projectId !== projectId) return
        setExecutionLogOpen(true)
      } catch (error) {
        console.error("Failed to open workflow execution log:", error)
      }
    }

    const onSetAutoRun = (event: Event) => {
      try {
        const detail = (event as CustomEvent<WorkflowSetAutoRunEventDetail>).detail
        if (!detail || detail.projectId !== projectId) return
        setRunSchedule(detail.schedule)
      } catch (error) {
        console.error("Failed to update workflow auto-run schedule:", error)
      }
    }

    window.addEventListener(WORKFLOW_RUN_EVENT, onRunWorkflow as EventListener)
    window.addEventListener(WORKFLOW_PUBLISH_EVENT, onPublishWorkflow as EventListener)
    window.addEventListener(
      WORKFLOW_OPEN_LOG_EVENT,
      onOpenExecutionLog as EventListener
    )
    window.addEventListener(WORKFLOW_SET_AUTORUN_EVENT, onSetAutoRun as EventListener)

    return () => {
      window.removeEventListener(WORKFLOW_RUN_EVENT, onRunWorkflow as EventListener)
      window.removeEventListener(
        WORKFLOW_PUBLISH_EVENT,
        onPublishWorkflow as EventListener
      )
      window.removeEventListener(
        WORKFLOW_OPEN_LOG_EVENT,
        onOpenExecutionLog as EventListener
      )
      window.removeEventListener(
        WORKFLOW_SET_AUTORUN_EVENT,
        onSetAutoRun as EventListener
      )
    }
  }, [handlePublishWorkflow, handleRunWorkflow, projectId])

  useEffect(() => {
    if (autoRunIntervalRef.current !== null) {
      window.clearInterval(autoRunIntervalRef.current)
      autoRunIntervalRef.current = null
    }
    if (autoRunTimeoutRef.current !== null) {
      window.clearTimeout(autoRunTimeoutRef.current)
      autoRunTimeoutRef.current = null
    }

    if (runSchedule.mode === "at") {
      const runAtMs = new Date(runSchedule.atISO).getTime()
      if (!Number.isFinite(runAtMs)) return
      const delayMs = runAtMs - Date.now()

      if (delayMs <= 0) {
        handleRunWorkflow()
        setRunSchedule({ mode: "off" })
        return
      }

      autoRunTimeoutRef.current = window.setTimeout(() => {
        handleRunWorkflow()
        setRunSchedule({ mode: "off" })
      }, delayMs)

      return () => {
        if (autoRunTimeoutRef.current !== null) {
          window.clearTimeout(autoRunTimeoutRef.current)
          autoRunTimeoutRef.current = null
        }
      }
    }

    const intervalMs = getRunScheduleIntervalMs(runSchedule)
    if (!intervalMs) return

    autoRunIntervalRef.current = window.setInterval(() => {
      handleRunWorkflow()
    }, intervalMs)

    return () => {
      if (autoRunIntervalRef.current !== null) {
        window.clearInterval(autoRunIntervalRef.current)
        autoRunIntervalRef.current = null
      }
    }
  }, [handleRunWorkflow, runSchedule])

  useEffect(() => {
    if (!projectId) return
    const detail: WorkflowStateEventDetail = {
      projectId,
      isRunning: isRunningWorkflow,
      isPublishing: isPublishingWorkflow,
      publishState,
      hasUnpublishedChanges,
      runSchedule,
    }
    try {
      window.dispatchEvent(new CustomEvent(WORKFLOW_STATE_EVENT, { detail }))
    } catch (error) {
      console.error("Failed to broadcast workflow state update:", error)
    }
  }, [
    hasUnpublishedChanges,
    isPublishingWorkflow,
    isRunningWorkflow,
    projectId,
    publishState,
    runSchedule,
  ])

  if (!project) {
    return (
      <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 items-center justify-center bg-background px-4 py-10">
        <div className="rounded-xl border border-border bg-card px-5 py-4 text-center">
          <p className="text-sm font-medium text-foreground">Project not found.</p>
          <Link
            href="/workflow"
            className="mt-2 inline-flex text-sm text-primary hover:underline"
          >
            Back to Workflow
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100dvh-2.5rem)] w-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div
        className="min-h-0 min-w-0 flex flex-1 overflow-hidden"
        style={{
          backgroundColor: "var(--background)",
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--border) 70%, transparent) 0.75px, transparent 0.75px)",
          backgroundSize: `${CANVAS_GRID_STEP}px ${CANVAS_GRID_STEP}px`,
          backgroundPosition: "0 0",
        }}
      >
        <section
          ref={viewportRef}
          onWheel={handleViewportWheel}
          onPointerDownCapture={handleViewportPointerDownCapture}
          className={cn(
            "no-scrollbar relative h-full min-w-0 flex-1 overflow-auto overscroll-none",
            isPanning
              ? "cursor-grabbing"
              : isSpacePressed
                ? "cursor-grab"
                : "cursor-default"
          )}
        >
          <ContextMenu5Wrapper
            canUndo={canUndo}
            canRedo={canRedo}
            hasSelectedNode={hasSelectedNode}
            canPaste={canPaste}
            onNewNode={addNodeFromContextMenu}
            onEditNode={editSelectedNode}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onCopy={copySelectedNode}
            onPaste={pasteCopiedNode}
            onDuplicate={duplicateSelectedNode}
            onDelete={deleteSelectedNode}
          >
            <div
              ref={canvasRef}
              className="relative"
              onContextMenu={(event) => {
                const point = getCanvasPoint(event.clientX, event.clientY)
                if (point) setContextMenuPoint(point)
                const target = event.target as HTMLElement | null
                const clickedInsideNode = Boolean(
                  target?.closest("[data-workflow-node-card='true']")
                )
                if (!clickedInsideNode) {
                  setSelectedNodeId("")
                }
              }}
              onClick={() => {
                if (connectingSourceId) clearWireDraft()
                setSelectedNodeId("")
              }}
              onPointerMove={(event) => {
                const point = getCanvasPoint(event.clientX, event.clientY)
                if (point) {
                  pointerCanvasPointRef.current = point
                }
              }}
              style={{
                width: `${WORKSPACE_WIDTH}px`,
                height: `${WORKSPACE_HEIGHT}px`,
                zoom,
              }}
            >
            <svg
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {edgeGeometries.map((edge) => {
                return (
                  <g key={edge.id}>
                    <path
                      d={edge.path}
                      fill="none"
                      stroke="transparent"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={10}
                      pointerEvents="stroke"
                      onPointerEnter={() => showEdgeDelete(edge.id)}
                      onPointerLeave={() => hideEdgeDeleteSoon(edge.id)}
                    />
                    <path
                      d={edge.path}
                      fill="none"
                      style={{ stroke: "var(--muted-foreground)" }}
                      strokeOpacity={0.45}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.6}
                      pointerEvents="none"
                    />
                  </g>
                )
              })}
              {draftWirePath && (
                <path
                  d={draftWirePath}
                  fill="none"
                  style={{ stroke: "var(--muted-foreground)" }}
                  strokeOpacity={0.55}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.4}
                  strokeDasharray="6 6"
                />
              )}
            </svg>

            {hoveredEdgeId && (() => {
              const hoveredEdge = edgeGeometries.find((edge) => edge.id === hoveredEdgeId)
              if (!hoveredEdge) return null
              return (
                <button
                  type="button"
                  onPointerEnter={() => showEdgeDelete(hoveredEdge.id)}
                  onPointerLeave={() => hideEdgeDeleteSoon(hoveredEdge.id)}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation()
                    pushHistorySnapshot()
                    markProjectChanged()
                    setEdges((previous) =>
                      previous.filter((edge) => edge.id !== hoveredEdge.id)
                    )
                    setHoveredEdgeId(null)
                  }}
                  className="absolute z-20 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-popover text-muted-foreground shadow-sm transition-colors hover:text-destructive"
                  style={{
                    left: hoveredEdge.midX - 12,
                    top: hoveredEdge.midY - 12,
                  }}
                  aria-label="Delete wire"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )
            })()}

            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId
              const executionState = EXECUTION_STATUS_META[node.executionStatus]

              return (
                <div
                  key={node.id}
                  ref={(element) => setNodeHeightRef(node.id, element)}
                  role="button"
                  tabIndex={0}
                  data-workflow-node-card="true"
                  onContextMenu={(event) => {
                    const point = getCanvasPoint(event.clientX, event.clientY)
                    if (point) setContextMenuPoint(point)
                    setSelectedNodeId(node.id)
                  }}
                  onPointerDown={(event) => handleNodePointerDown(node.id, event)}
                  onClick={(event) => {
                    event.stopPropagation()
                    if (connectingSourceId) {
                      if (connectingSourceId !== node.id) {
                        toggleConnection(connectingSourceId, node.id)
                      }
                      clearWireDraft()
                      return
                    }
                    setSelectedNodeId(node.id)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      setSelectedNodeId(node.id)
                    }
                  }}
                  className={cn(
                    "absolute select-none !rounded-[16px] border bg-card p-2.5 text-left transition-colors touch-none",
                    executionState.borderClass,
                    "hover:border-border",
                    connectingSourceId &&
                      connectingSourceId !== node.id &&
                      "ring-1 ring-border/70",
                    draggingNodeId === node.id ? "cursor-grabbing" : "cursor-grab"
                  )}
                  style={{ left: node.x, top: node.y, width: NODE_WIDTH }}
                >
                  <button
                    type="button"
                    onPointerDown={(event) => {
                      event.stopPropagation()
                    }}
                    className={cn(
                      "absolute -top-2 left-1/2 inline-flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border shadow-sm",
                      "border-border bg-background text-muted-foreground",
                      edges.some((edge) => edge.targetId === node.id) &&
                        "border-border text-foreground/75",
                      connectingSourceId &&
                        connectingSourceId !== node.id &&
                        "border-border bg-muted text-foreground"
                    )}
                    aria-label={`Connect into ${node.stepName}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </button>

                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleStartConnectionMode(node.id)
                    }}
                    className={cn(
                      "absolute -bottom-2 left-1/2 inline-flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border shadow-sm",
                      "border-border bg-background text-muted-foreground",
                      edges.some((edge) => edge.sourceId === node.id) &&
                        "border-border text-foreground/75",
                      connectingSourceId === node.id &&
                        "border-border bg-muted text-foreground"
                    )}
                    aria-label={`Connect out from ${node.stepName}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={(event) => event.stopPropagation()}
                          className={cn(
                            "absolute -top-[26px] left-0 inline-flex h-5 items-center gap-1 rounded-[8px] border px-1.5 py-0.5 text-xs font-medium transition-colors",
                            node.nodeType === "Action"
                              ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-500/40 dark:bg-blue-500/12 dark:text-blue-300 dark:hover:bg-blue-500/22"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/12 dark:text-emerald-300 dark:hover:bg-emerald-500/22"
                          )}
                          aria-label={`Node type for ${node.stepName}`}
                        />
                      }
                    >
                      {node.nodeType === "Action" ? (
                        <PlayCircle className="h-2.5 w-2.5 fill-current/25" />
                      ) : (
                        <Zap className="h-2.5 w-2.5" />
                      )}
                      {node.nodeType}
                      <ChevronDown className="h-2.5 w-2.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-36">
                      <DropdownMenuItem
                        onClick={() => setNodeType(node.id, "Action")}
                        className="justify-between"
                      >
                        <span className="inline-flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                          <PlayCircle className="h-3.5 w-3.5 fill-current/25" />
                          Action
                        </span>
                        {node.nodeType === "Action" && <Check className="h-3.5 w-3.5" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setNodeType(node.id, "Trigger")}
                        className="justify-between"
                      >
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                          <Zap className="h-3.5 w-3.5" />
                          Trigger
                        </span>
                        {node.nodeType === "Trigger" && <Check className="h-3.5 w-3.5" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {editingTitleNodeId === node.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={titleDraft}
                            onChange={(event) => setTitleDraft(event.target.value)}
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={(event) => event.stopPropagation()}
                            onBlur={() => commitTitleEdit(node.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault()
                                commitTitleEdit(node.id)
                              }
                              if (event.key === "Escape") {
                                event.preventDefault()
                                setEditingTitleNodeId(null)
                                setTitleDraft("")
                              }
                            }}
                            className="h-6 rounded-lg border-input bg-transparent px-2 text-sm font-semibold focus-visible:border-ring"
                            autoFocus
                          />
                          <button
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onMouseDown={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                            }}
                            onClick={(event) => {
                              event.stopPropagation()
                              commitTitleEdit(node.id)
                            }}
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={`Save title for ${node.stepName}`}
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <p className="line-clamp-1 text-base leading-none font-semibold text-foreground">
                            {node.stepName}
                          </p>
                          <span
                            className={cn("inline-flex h-2.5 w-2.5 rounded-full", executionState.dotClass)}
                            title={`Status: ${executionState.label}`}
                            aria-label={`Status: ${executionState.label}`}
                          />
                          <button
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                              event.stopPropagation()
                              startTitleEdit(node)
                            }}
                            className="inline-flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={`Edit title for ${node.stepName}`}
                          >
                            <PenSquare className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-1.5 !rounded-[12px] border border-border/80 bg-muted/40 p-2">
                    <p className="line-clamp-4 text-[13px] leading-[1.45] text-muted-foreground">
                      {node.prompt}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-1/2 left-[calc(100%+12px)] z-10 flex -translate-y-1/2 flex-col gap-1.5">
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => addNodeNextTo(node.id)}
                        aria-label="Add node"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => openNodeChatPanel(node)}
                        aria-label="Open node chat"
                      >
                        <PenSquare className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => setFilesDialogOpen(true)}
                        aria-label="Open node files"
                      >
                        <Files className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-destructive/25 bg-card text-destructive transition-colors hover:bg-destructive/10"
                        onClick={() => deleteNode(node.id)}
                        aria-label="Delete node"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                </div>
              )
            })}
            </div>
          </ContextMenu5Wrapper>
          <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
            <div className="inline-flex items-center gap-4 rounded-[10px] border border-border bg-card/95 px-4 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur">
              <div className="inline-flex items-center gap-1.5">
                <span>Reset view</span>
                <Kbd keys={["cmd"]} className="text-muted-foreground" listenToKeyboard />
                <span>+</span>
                <Kbd keys={["0"]} className="text-muted-foreground" listenToKeyboard />
              </div>
              <div className="inline-flex items-center gap-1.5">
                <span>Pan</span>
                <Kbd keys={["space"]} className="text-muted-foreground" listenToKeyboard />
                <span>+</span>
                <span>Drag</span>
              </div>
            </div>
          </div>
        </section>
        <aside
          className={cn(
            "hidden h-full min-w-0 shrink-0 overflow-hidden bg-transparent transition-[width,padding] duration-300 ease-out lg:flex lg:flex-col",
            isNodeChatPanelOpen && panelNode
              ? "w-[min(42vw,620px)] p-3 pl-2"
              : "w-0 p-0"
          )}
        >
          <div
            className={cn(
              "flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/95 backdrop-blur-sm transition-all duration-300 ease-out",
              isNodeChatPanelOpen && panelNode
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-8 opacity-0"
            )}
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Node Chat
                </p>
                <p className="truncate text-sm font-medium text-foreground">
                  {panelNode?.stepName ?? ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNodeChatPanelOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close node chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-2">
              {panelNode && (
                <div className="relative flex h-full min-h-0 w-full items-stretch justify-center">
                  <AIPrompt
                    key={`workflow-node-chat-${panelNode.id}`}
                    chatId={
                      projectId
                        ? `workflow-node-chat-${projectId}-${panelNode.id}`
                        : `workflow-node-chat-${panelNode.id}`
                    }
                    persistChatListEntry={false}
                    hideGreeting
                    dockComposerToBottom
                    userFullName={panelNode.owner}
                    onAddUserToChat={() => {
                      window.dispatchEvent(new CustomEvent(OPEN_MANAGE_CHAT_USERS_EVENT))
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </aside>

      </div>

      <Dialog open={filesDialogOpen} onOpenChange={setFilesDialogOpen}>
        <DialogContent className="max-w-lg p-0">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-lg">
              Files · {selectedNode?.stepName ?? "Node"}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[420px] space-y-2 overflow-y-auto px-5 py-4">
            {selectedNode?.files.length ? (
              selectedNode.files.map((fileName) => (
                <div
                  key={fileName}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3 py-2"
                >
                  <span className="truncate text-sm text-foreground">{fileName}</span>
                  <span className="text-xs text-muted-foreground">Attached</span>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                No files attached to this node yet.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={executionLogOpen} onOpenChange={setExecutionLogOpen}>
        <DialogContent className="max-h-[85vh] w-[min(980px,calc(100vw-2rem))] overflow-hidden p-0 sm:max-w-[980px]">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-lg">Execution Log · {project.title}</DialogTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Runtime visibility for the current workflow graph and latest node activity.
            </p>
          </DialogHeader>
          <div className="max-h-[calc(85vh-72px)] space-y-5 overflow-y-auto px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-border bg-card px-3 py-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Latest run
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{lastExecutionLabel}</p>
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Completion
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {doneSteps}/{nodes.length} steps ({completionPercent}%)
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Tokens processed
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {totalTokenCount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Connections
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {edges.length} wire{edges.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Execution timeline</p>
                <div className="mt-3 space-y-3">
                  {executionTimeline.map((event) => (
                    <div key={event.title} className="flex gap-2">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/60" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Run metadata</p>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <p>
                    Execution mix: {idleNodeCount} idle · {runningNodeCount} running ·{" "}
                    {successNodeCount} success · {errorNodeCount} error
                  </p>
                  <p>Publish state: {publishState}</p>
                  <p>Auto-run: {runScheduleLabel}</p>
                  <p>
                    Node types: {actionNodeCount} action · {triggerNodeCount} trigger
                  </p>
                  <p>
                    Coverage: {uniqueAppsCount} apps · {uniqueSkillsCount} skills ·{" "}
                    {totalFileCount} files
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">Node run details</p>
                <p className="text-xs text-muted-foreground">{orderedNodes.length} nodes</p>
              </div>
              <div className="mt-3 space-y-2">
                {orderedNodes.map((node, index) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-background px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {index + 1}. {node.stepName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {node.provider} · {node.owner} · {node.tokenCount} tokens
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant={
                          node.executionStatus === "success"
                            ? "green"
                            : node.executionStatus === "running"
                              ? "amber"
                              : node.executionStatus === "error"
                                ? "red"
                                : "neutral"
                        }
                      >
                        {node.executionStatus === "success"
                          ? "Success"
                          : node.executionStatus === "running"
                            ? "Running"
                            : node.executionStatus === "error"
                              ? "Error"
                              : "Idle"}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{node.lastRan}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
              For production, connect this panel to backend execution IDs, structured logs,
              latencies, and failure traces for each node run.
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
