"use client"

import Link from "next/link"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
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
  ArrowLeft,
  Bot,
  Check,
  ChevronDown,
  Clock3,
  Files,
  Layers,
  MoreVertical,
  PenSquare,
  PlayCircle,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"

type WorkflowNode = {
  id: string
  stepName: string
  status: "Done" | "In review" | "Pending"
  owner: string
  description: string
  provider: string
  model: string
  prompt: string
  instructions: string
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

const APP_LIBRARY = [
  "Anthropic",
  "ChatGPT",
  "Slack",
  "Airtable",
  "Asana",
  "Box",
  "Calendly",
  "ClickUp",
  "GitHub",
  "Notion",
] as const

const FAVORITE_APPS = ["Anthropic", "ChatGPT", "Slack"] as const
const favoriteAppSet = new Set<string>(FAVORITE_APPS)
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
    description: "Add a description...",
    provider: index % 2 === 0 ? "Anthropic" : "ChatGPT",
    model: index % 2 === 0 ? "Claude Opus 4.1" : "GPT-5.2",
    prompt: `Execute "${step.name}" for ${project.title}. Return concise, structured output that can be passed to the next workflow node.`,
    instructions:
      "Use clear language, preserve key evidence, and flag uncertainty before finalizing.",
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
    x: 110 + index * 380,
    y: index % 2 === 0 ? 150 : 330,
  }))
}

function providerModelForApp(app: string) {
  if (app === "Anthropic") return { provider: "Anthropic", model: "Claude Opus 4.1" }
  if (app === "ChatGPT") return { provider: "ChatGPT", model: "GPT-5.2" }
  if (app === "Slack") return { provider: "Slack AI", model: "Slack Summarizer" }
  return { provider: app, model: `${app} Assistant` }
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
  const [editingTitleNodeId, setEditingTitleNodeId] = useState<string | null>(null)
  const [editingDescriptionNodeId, setEditingDescriptionNodeId] =
    useState<string | null>(null)
  const [titleDraft, setTitleDraft] = useState("")
  const [descriptionDraft, setDescriptionDraft] = useState("")
  const [replaceOpen, setReplaceOpen] = useState(false)
  const [appSearch, setAppSearch] = useState("")
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const edgeHoverTimeoutRef = useRef<number | null>(null)
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
    setEditingTitleNodeId(null)
    setEditingDescriptionNodeId(null)
    setTitleDraft("")
    setDescriptionDraft("")
    setReplaceOpen(false)
    setAppSearch("")
  }, [project])

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId]
  )

  const selectedNodeIndex = useMemo(
    () => nodes.findIndex((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId]
  )

  const filteredFavorites = useMemo(
    () =>
      FAVORITE_APPS.filter((app) =>
        app.toLowerCase().includes(appSearch.trim().toLowerCase())
      ),
    [appSearch]
  )

  const filteredApps = useMemo(
    () =>
      APP_LIBRARY.filter(
        (app) =>
          app.toLowerCase().includes(appSearch.trim().toLowerCase()) &&
          !favoriteAppSet.has(app)
      ),
    [appSearch]
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

  const updateSelectedNode = (patch: Partial<WorkflowNode>) => {
    if (!selectedNodeId) return
    setNodes((previous) =>
      previous.map((node) =>
        node.id === selectedNodeId ? { ...node, ...patch } : node
      )
    )
  }

  const toggleConnection = (sourceId: string, targetId: string) => {
    if (!sourceId || !targetId || sourceId === targetId) return
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
      x: Math.round(clientX - canvasRect.left),
      y: Math.round(clientY - canvasRect.top),
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
    setNodes((previous) =>
      previous.map((node) =>
        node.id === nodeId ? { ...node, stepName: nextTitle } : node
      )
    )
    setEditingTitleNodeId(null)
    setTitleDraft("")
  }

  const startDescriptionEdit = (node: WorkflowNode) => {
    setSelectedNodeId(node.id)
    setEditingDescriptionNodeId(node.id)
    setDescriptionDraft(node.description || "Add a description...")
  }

  const commitDescriptionEdit = (nodeId: string) => {
    const nextDescription = descriptionDraft.trim() || "Add a description..."
    setNodes((previous) =>
      previous.map((node) =>
        node.id === nodeId ? { ...node, description: nextDescription } : node
      )
    )
    setEditingDescriptionNodeId(null)
    setDescriptionDraft("")
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
      description: "Add a description...",
      provider: source.provider,
      model: source.model,
      prompt: "Define what this node should do.",
      instructions: "Add clear guardrails and expected output shape.",
      tokenCount: 0,
      lastRan: "Never",
      usedApps: [source.provider],
      usedSkills: ["Action Planner"],
      files: [],
      x: source.x + 380,
      y: source.y,
    }

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
    setEditingDescriptionNodeId((previous) =>
      previous === nodeId ? null : previous
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
    setReplaceOpen(false)
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
    event.preventDefault()
  }

  useEffect(() => {
    if (!draggingNodeId) return

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

      setNodes((previous) =>
        previous.map((node) =>
          node.id === dragState.nodeId ? { ...node, x: nextX, y: nextY } : node
        )
      )
    }

    const finishDrag = () => {
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
  }, [draggingNodeId])

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
    }
  }, [])

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
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <section className="flex h-11 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2">
          <Link
            href="/workflow"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <div>
            <p className="text-sm font-semibold text-foreground">{project.title}</p>
            <p className="text-[11px] text-muted-foreground">
              {project.tags.join(" • ")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground">
            {doneSteps}/{nodes.length} steps done
          </span>
          <span className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground">
            Workspace: Atmet AI
          </span>
          {connectingSourceId && (
            <button
              type="button"
              onClick={clearWireDraft}
              className="rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-[11px] text-primary"
            >
              Connecting from{" "}
              {nodeMap.get(connectingSourceId)?.stepName ?? "node"} · Click target box ·
              Cancel
            </button>
          )}
        </div>
      </section>

      <div className="flex min-h-0 flex-1">
        <section className="relative min-w-0 flex-1 overflow-auto border-r border-border">
          <ContextMenu5Wrapper>
            <div
              ref={canvasRef}
              className="relative min-h-[840px] min-w-[1700px]"
              onClick={() => {
                if (connectingSourceId) clearWireDraft()
              }}
              style={{
                backgroundColor: "var(--background)",
                backgroundImage:
                  "radial-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, color-mix(in oklab, var(--border) 40%, transparent) 1px, transparent 1px)",
                backgroundSize: "20px 20px, 106px 100%",
                backgroundPosition: "0 0, 0 0",
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
                    {editingDescriptionNodeId === node.id ? (
                      <div className="flex items-start gap-1">
                        <Textarea
                          value={descriptionDraft}
                          onChange={(event) => setDescriptionDraft(event.target.value)}
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={(event) => event.stopPropagation()}
                          onBlur={() => commitDescriptionEdit(node.id)}
                          className="min-h-20 resize-none rounded-lg border-input bg-transparent px-2.5 py-2 text-sm leading-relaxed text-muted-foreground focus-visible:border-ring"
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
                            commitDescriptionEdit(node.id)
                          }}
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={`Save description for ${node.stepName}`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          event.stopPropagation()
                          startDescriptionEdit(node)
                        }}
                        className="w-full rounded-md border border-transparent px-1 py-1 text-left text-xs text-muted-foreground hover:border-border/60 hover:bg-muted/30"
                      >
                        {node.description || "Add a description..."}
                      </button>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {node.provider} • {node.owner}
                    </p>
                  </div>

                  <div className="mt-3 rounded-lg border border-border/80 bg-muted/40 p-3">
                    <span className="inline-flex rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-foreground">
                      PROMPT
                    </span>
                    <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
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

            {replaceOpen && selectedNode && (
              <div
                className="absolute z-20 w-[350px] rounded-3xl border border-border bg-popover p-3 shadow-xl"
                style={{
                  left: Math.min(selectedNode.x + 390, 1320),
                  top: selectedNode.y + 10,
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-2xl font-medium text-foreground">Replace</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-xl border border-border bg-muted/40 px-2 py-1 text-sm text-foreground"
                  >
                    <Bot className="h-4 w-4" />
                    {selectedNode.provider}
                  </button>
                </div>

                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={appSearch}
                    onChange={(event) => setAppSearch(event.target.value)}
                    placeholder="Search Apps"
                    className="h-10 rounded-xl border-border bg-muted/30 pl-9"
                  />
                </div>

                <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">Favorites</p>
                    <div className="space-y-1">
                      {filteredFavorites.map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => {
                            const replacement = providerModelForApp(app)
                            updateSelectedNode(replacement)
                            setReplaceOpen(false)
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left text-base text-foreground hover:bg-muted/60"
                        >
                          <span>{app}</span>
                          {selectedNode.provider === app && (
                            <Check className="h-4 w-4 text-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">All Apps</p>
                    <div className="space-y-1">
                      {filteredApps.map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => {
                            const replacement = providerModelForApp(app)
                            updateSelectedNode(replacement)
                            setReplaceOpen(false)
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left text-base text-foreground hover:bg-muted/60"
                        >
                          <span>{app}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </ContextMenu5Wrapper>
        </section>

        <aside className="w-[390px] shrink-0 bg-background">
          <div className="h-full overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4">
              <p className="text-4xl font-semibold tracking-tight text-foreground">
                LLM Settings
              </p>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setReplaceOpen(false)}
                aria-label="Close side actions"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedNode ? (
              <div className="space-y-5 px-5 py-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-sm text-muted-foreground"
                >
                  <span>General Settings</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <div className="space-y-2">
                  <p className="text-2xl font-medium text-foreground">Provider</p>
                  <button
                    type="button"
                    onClick={() => setReplaceOpen(true)}
                    className="flex h-14 w-full items-center justify-between rounded-2xl border border-border bg-card px-4 text-lg text-foreground hover:bg-muted/40"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Bot className="h-5 w-5 text-muted-foreground" />
                      {selectedNode.provider}
                    </span>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-medium text-foreground">Model</p>
                  <div className="flex h-14 w-full items-center justify-between rounded-2xl border border-border bg-card px-4 text-lg text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Layers className="h-5 w-5 text-muted-foreground" />
                      {selectedNode.model}
                    </span>
                    <span className="rounded-xl bg-primary/15 px-2 py-0.5 text-sm font-medium text-primary">
                      Large Context
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-medium text-foreground">Prompt</p>
                  <Textarea
                    value={selectedNode.prompt}
                    onChange={(event) =>
                      updateSelectedNode({ prompt: event.target.value })
                    }
                    className="min-h-[210px] rounded-2xl border-border bg-card p-4 text-lg leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-medium text-foreground">Instructions</p>
                  <Textarea
                    value={selectedNode.instructions}
                    onChange={(event) =>
                      updateSelectedNode({ instructions: event.target.value })
                    }
                    className="min-h-[120px] rounded-2xl border-border bg-card p-4 text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl"
                    onClick={() => {
                      if (!selectedNode) return
                      updateSelectedNode({
                        prompt: buildNodes(project)[selectedNodeIndex]?.prompt ?? "",
                        instructions:
                          buildNodes(project)[selectedNodeIndex]?.instructions ?? "",
                      })
                    }}
                  >
                    Reset
                  </Button>
                  <Button className="h-10 rounded-xl">Save Node</Button>
                </div>
              </div>
            ) : (
              <div className="px-5 py-6 text-sm text-muted-foreground">
                Select a node to edit settings.
              </div>
            )}
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
    </div>
  )
}
