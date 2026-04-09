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
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ContextMenu5Wrapper } from "@/components/examples/c-context-menu-5"
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
  ArrowLeft,
  Check,
  Clock3,
  Files,
  Layers,
  MoreVertical,
  PenSquare,
  PlayCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react"

type WorkflowNode = {
  id: string
  stepName: string
  status: "Done" | "In review" | "Pending"
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

const NODE_WIDTH = 320
const NODE_HANDLE_Y = 146
const WORKSPACE_WIDTH = 10000
const WORKSPACE_HEIGHT = 7000
const WORKSPACE_OFFSET_X = 2200
const WORKSPACE_OFFSET_Y = 1400
const appLogoTone: Record<string, string> = {
  Anthropic: "bg-neutral-900 text-white",
  ChatGPT: "bg-emerald-500 text-white",
  Slack: "bg-fuchsia-500 text-white",
  Airtable: "bg-amber-500 text-white",
  Asana: "bg-rose-500 text-white",
  GitHub: "bg-slate-900 text-white",
  Notion: "bg-zinc-900 text-white",
}

function getAppGlyph(app: string) {
  const clean = app.trim()
  if (!clean) return "A"
  if (clean.length <= 3) return clean.toUpperCase()
  return clean.slice(0, 2).toUpperCase()
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
    stepName: step.name,
    status: step.status,
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
    x: WORKSPACE_OFFSET_X + 110 + index * 380,
    y: WORKSPACE_OFFSET_Y + (index % 2 === 0 ? 150 : 330),
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
  if (runSchedule.frequency === "day") return 24 * 60 * 60 * 1000
  if (runSchedule.frequency === "week") return 7 * 24 * 60 * 60 * 1000
  return 30 * 24 * 60 * 60 * 1000
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
  const [zoom, setZoom] = useState(1)
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false)
  const [isPublishingWorkflow, setIsPublishingWorkflow] = useState(false)
  const [publishState, setPublishState] = useState<"Draft" | "Published">("Draft")
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false)
  const [lastExecutionLabel, setLastExecutionLabel] = useState("Not run yet")
  const [runSchedule, setRunSchedule] = useState<WorkflowRunSchedule>({
    mode: "off",
  })
  const viewportRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const edgeHoverTimeoutRef = useRef<number | null>(null)
  const runTimerRef = useRef<number | null>(null)
  const publishTimerRef = useRef<number | null>(null)
  const autoRunIntervalRef = useRef<number | null>(null)
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
    setZoom(1)
    setIsSpacePressed(false)
    setIsPanning(false)
    setIsRunningWorkflow(false)
    setIsPublishingWorkflow(false)
    setPublishState("Draft")
    setHasUnpublishedChanges(false)
    setLastExecutionLabel("Not run yet")
    setRunSchedule({ mode: "off" })

    window.requestAnimationFrame(() => {
      const viewport = viewportRef.current
      if (!viewport || initialNodes.length === 0) return

      const minX = Math.min(...initialNodes.map((node) => node.x))
      const maxX = Math.max(...initialNodes.map((node) => node.x + NODE_WIDTH))
      const minY = Math.min(...initialNodes.map((node) => node.y))
      const maxY = Math.max(...initialNodes.map((node) => node.y + 520))
      const clusterCenterX = (minX + maxX) / 2
      const clusterCenterY = (minY + maxY) / 2

      viewport.scrollLeft = Math.max(
        0,
        clusterCenterX - viewport.clientWidth / 2
      )
      viewport.scrollTop = Math.max(
        0,
        clusterCenterY - viewport.clientHeight / 2
      )
    })
  }, [project])

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId]
  )

  const doneSteps = useMemo(
    () => nodes.filter((node) => node.status === "Done").length,
    [nodes]
  )

  const nodeMap = useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes]
  )

  const edgeGeometries = useMemo<EdgeGeometry[]>(() => {
    return edges
      .map((edge) => {
        const sourceNode = nodeMap.get(edge.sourceId)
        const targetNode = nodeMap.get(edge.targetId)
        if (!sourceNode || !targetNode) return null

        const fromX = sourceNode.x + NODE_WIDTH
        const fromY = sourceNode.y + NODE_HANDLE_Y
        const toX = targetNode.x
        const toY = targetNode.y + NODE_HANDLE_Y
        const curve = Math.max(80, Math.abs(toX - fromX) / 2)
        const curveDirection = toX >= fromX ? 1 : -1
        const c1x = fromX + curve * curveDirection
        const c1y = fromY
        const c2x = toX - curve * curveDirection
        const c2y = toY
        const path = `M ${fromX} ${fromY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${toX} ${toY}`

        const t = 0.5
        const oneMinusT = 1 - t
        const midX =
          oneMinusT ** 3 * fromX +
          3 * oneMinusT ** 2 * t * c1x +
          3 * oneMinusT * t ** 2 * c2x +
          t ** 3 * toX
        const midY =
          oneMinusT ** 3 * fromY +
          3 * oneMinusT ** 2 * t * c1y +
          3 * oneMinusT * t ** 2 * c2y +
          t ** 3 * toY

        return { ...edge, path, fromX, fromY, toX, toY, midX, midY }
      })
      .filter((edge): edge is EdgeGeometry => edge !== null)
  }, [edges, nodeMap])

  const draftWirePath = useMemo(() => {
    if (!connectingSourceId || !wireCursor) return null
    const sourceNode = nodeMap.get(connectingSourceId)
    if (!sourceNode) return null

    const fromX = sourceNode.x + NODE_WIDTH
    const fromY = sourceNode.y + NODE_HANDLE_Y
    const toX = wireCursor.x
    const toY = wireCursor.y
    const curve = Math.max(80, Math.abs(toX - fromX) / 2)
    const curveDirection = toX >= fromX ? 1 : -1
    return `M ${fromX} ${fromY} C ${fromX + curve * curveDirection} ${fromY}, ${toX - curve * curveDirection} ${toY}, ${toX} ${toY}`
  }, [connectingSourceId, nodeMap, wireCursor])

  const markProjectChanged = useCallback(() => {
    setHasUnpublishedChanges(true)
    setPublishState("Draft")
  }, [])

  const handleRunWorkflow = useCallback(() => {
    if (isRunningWorkflow) return
    if (runTimerRef.current !== null) {
      window.clearTimeout(runTimerRef.current)
      runTimerRef.current = null
    }

    setIsRunningWorkflow(true)
    setNodes((previous) =>
      previous.map((node) => ({
        ...node,
        status: "In review",
        lastRan: "Running...",
      }))
    )

    runTimerRef.current = window.setTimeout(() => {
      setNodes((previous) =>
        previous.map((node, index) => ({
          ...node,
          status: index === previous.length - 1 ? "In review" : "Done",
          lastRan: index === 0 ? "Just now" : `${index + 1} min ago`,
        }))
      )
      setLastExecutionLabel("Just now")
      setIsRunningWorkflow(false)
      runTimerRef.current = null
    }, 1300)
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

  const commitTitleEdit = (nodeId: string) => {
    const nextTitle = titleDraft.trim()
    if (!nextTitle) {
      setEditingTitleNodeId(null)
      setTitleDraft("")
      return
    }
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
      stepName: "New Step",
      status: "Pending",
      owner: "You",
      provider: source.provider,
      model: source.model,
      prompt: "Define what this node should do.",
      tokenCount: 0,
      lastRan: "Never",
      usedApps: [source.provider],
      usedSkills: ["Action Planner"],
      files: [],
      x: source.x + 380,
      y: source.y,
    }

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
    setWireCursor({
      x: sourceNode.x + NODE_WIDTH,
      y: sourceNode.y + NODE_HANDLE_Y,
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
        16,
        Math.round(event.clientX - canvasRect.left - dragState.pointerOffsetX)
      )
      const nextY = Math.max(
        16,
        Math.round(event.clientY - canvasRect.top - dragState.pointerOffsetY)
      )
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
  }, [draggingNodeId, markProjectChanged])

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
      <section className="sticky top-0 z-30 flex h-10 min-h-10 max-h-10 shrink-0 items-center justify-between border-b border-border bg-background px-3">
        <div className="flex h-full min-w-0 items-center gap-2">
          <Link
            href="/workflow"
            className="inline-flex h-6 items-center gap-1 rounded-md border border-border px-2 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm leading-none font-semibold text-foreground">
              {project.title}
              <span className="ml-2 text-[11px] leading-none font-normal text-muted-foreground">
                {project.tags.join(" • ")}
              </span>
            </p>
          </div>
        </div>

        <div className="flex h-full items-center gap-1.5">
          <span className="inline-flex h-6 items-center rounded-md border border-border px-2 text-[11px] text-muted-foreground">
            {doneSteps}/{nodes.length} steps done
          </span>
          <span className="inline-flex h-6 items-center rounded-md border border-border px-2 text-[11px] text-muted-foreground">
            Workspace: Atmet AI
          </span>
          {connectingSourceId && (
            <button
              type="button"
              onClick={clearWireDraft}
              className="inline-flex h-6 items-center rounded-md border border-primary/40 bg-primary/10 px-2 text-[11px] text-primary"
            >
              Connecting from{" "}
              {nodeMap.get(connectingSourceId)?.stepName ?? "node"} · Click target box ·
              Cancel
            </button>
          )}
        </div>
      </section>

      <div className="min-h-0 min-w-0 flex flex-1 overflow-hidden">
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
          style={{
            backgroundColor: "var(--background)",
            backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0",
            backgroundAttachment: "local",
          }}
        >
          <ContextMenu5Wrapper>
            <div
              ref={canvasRef}
              className="relative"
              onClick={() => {
                if (connectingSourceId) clearWireDraft()
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
                      strokeWidth={14}
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
                      strokeWidth={2.25}
                      pointerEvents="none"
                    />
                  </g>
                )
              })}
              {draftWirePath && (
                <path
                  d={draftWirePath}
                  fill="none"
                  style={{ stroke: "var(--primary)" }}
                  strokeOpacity={0.7}
                  strokeLinecap="round"
                  strokeWidth={2}
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

              return (
                <div
                  key={node.id}
                  role="button"
                  tabIndex={0}
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
                    "absolute w-80 select-none rounded-xl border bg-card p-4 text-left shadow-sm transition-colors touch-none",
                    isSelected
                      ? "border-primary ring-1 ring-primary/35 shadow-md"
                      : "border-border/80 hover:border-primary/35",
                    connectingSourceId &&
                      connectingSourceId !== node.id &&
                      "ring-1 ring-primary/20",
                    draggingNodeId === node.id ? "cursor-grabbing" : "cursor-grab"
                  )}
                  style={{ left: node.x, top: node.y }}
                >
                  <button
                    type="button"
                    onPointerDown={(event) => {
                      event.stopPropagation()
                    }}
                    className={cn(
                      "absolute -left-2.5 inline-flex h-5 w-5 items-center justify-center rounded-full border shadow-sm",
                      "border-border bg-background text-muted-foreground",
                      edges.some((edge) => edge.targetId === node.id) &&
                        "border-primary/40 text-primary",
                      connectingSourceId &&
                        connectingSourceId !== node.id &&
                        "border-primary bg-primary/10 text-primary"
                    )}
                    style={{ top: NODE_HANDLE_Y }}
                    aria-label={`Connect into ${node.stepName}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                  </button>

                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleStartConnectionMode(node.id)
                    }}
                    className={cn(
                      "absolute -right-2.5 inline-flex h-5 w-5 items-center justify-center rounded-full border shadow-sm",
                      "border-border bg-background text-muted-foreground",
                      edges.some((edge) => edge.sourceId === node.id) &&
                        "border-primary/40 text-primary",
                      connectingSourceId === node.id &&
                        "border-primary bg-primary text-primary-foreground"
                    )}
                    style={{ top: NODE_HANDLE_Y }}
                    aria-label={`Connect out from ${node.stepName}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                  </button>

                  <span className="absolute -top-7 left-0 inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary">
                    <PlayCircle className="h-3.5 w-3.5 fill-primary/30" />
                    Action
                  </span>

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
                            className="h-7 rounded-lg border-input bg-transparent px-2.5 text-sm font-semibold focus-visible:border-ring"
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
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={`Save title for ${node.stepName}`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <p className="line-clamp-1 text-lg leading-none font-semibold text-foreground">
                            {node.stepName}
                          </p>
                          <button
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                              event.stopPropagation()
                              startTitleEdit(node)
                            }}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={`Edit title for ${node.stepName}`}
                          >
                            <PenSquare className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <MoreVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>

                  <div className="mt-1">
                    <p className="text-[11px] text-muted-foreground">
                      {node.provider} • {node.owner}
                    </p>
                  </div>

                  <div className="mt-3 rounded-lg border border-border/80 bg-muted/40 p-3">
                    <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                      {node.prompt}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2 py-1 text-xs text-foreground">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      {node.model}
                    </span>
                    <span className="inline-flex rounded-lg border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground">
                      {node.tokenCount} Tokens
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {node.lastRan}
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                      Used Apps
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {node.usedApps.map((app) => (
                        <span
                          key={app}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] text-foreground"
                        >
                          <span
                            className={cn(
                              "inline-flex h-4 w-4 items-center justify-center rounded-[4px] text-[9px] font-semibold",
                              appLogoTone[app] ?? "bg-primary text-primary-foreground"
                            )}
                          >
                            {getAppGlyph(app)}
                          </span>
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                      Used Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {node.usedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}

            {selectedNode && (
              <div
                className="absolute z-10 flex flex-col gap-2"
                style={{
                  left: selectedNode.x + 332,
                  top: selectedNode.y + NODE_HANDLE_Y - 22,
                }}
              >
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                  onClick={() => addNodeNextTo(selectedNode.id)}
                  aria-label="Add node"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                  onClick={() => {}}
                  aria-label="Edit node"
                >
                  <PenSquare className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                  onClick={() => setFilesDialogOpen(true)}
                  aria-label="Open node files"
                >
                  <Files className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-destructive/25 bg-card text-destructive shadow-sm transition-colors hover:bg-destructive/10"
                  onClick={() => deleteNode(selectedNode.id)}
                  aria-label="Delete node"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            </div>
          </ContextMenu5Wrapper>
        </section>

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
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-lg">Execution Log · {project.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 px-5 py-4">
            <div className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-sm font-medium text-foreground">Latest run</p>
              <p className="mt-1 text-xs text-muted-foreground">{lastExecutionLabel}</p>
            </div>
            <div className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-sm font-medium text-foreground">Project status</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {doneSteps}/{nodes.length} steps done · Publish state: {publishState}
              </p>
            </div>
            <div className="rounded-lg border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
              Full execution logs can be connected to your backend runner later.
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
