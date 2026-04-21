"use client"

import { Pattern as EmptyMyDataPattern } from "@/components/examples/c-empty-14"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import {
  CalendarDays,
  ChevronDown,
  Download,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Trash2,
  User,
} from "lucide-react"

type DateFilter = "all" | "7d" | "30d" | "90d"

type DataItem = {
  id: string
  fileType:
    | "pdf"
    | "docx"
    | "xlsx"
    | "csv"
    | "pptx"
    | "txt"
    | "json"
    | "zip"
    | "png"
    | "jpg"
  fileName: string
  fileSize: string
  relatedProject: string
  dateAdded: string
  workflowName: string
  addedBy: {
    name: string
    initials: string
    tone: string
  }
}

const tableData: DataItem[] = [
  {
    id: "d1",
    fileType: "pdf",
    fileName: "Supplier Master Agreement",
    fileSize: "2.4 MB",
    relatedProject: "Project Atlas Procurement rollout",
    dateAdded: "2026-03-10",
    workflowName: "Contract Risk Review",
    addedBy: {
      name: "Amir Haddad",
      initials: "AH",
      tone: "bg-sky-100 text-sky-700",
    },
  },
  {
    id: "d2",
    fileType: "xlsx",
    fileName: "Q1 Vendor Security Matrix",
    fileSize: "1.1 MB",
    relatedProject: "Vendor onboarding revamp - Q1",
    dateAdded: "2026-03-08",
    workflowName: "Vendor Onboarding QA",
    addedBy: {
      name: "Xi Sun",
      initials: "XS",
      tone: "bg-emerald-100 text-emerald-700",
    },
  },
  {
    id: "d3",
    fileType: "json",
    fileName: "IP Ownership Summary",
    fileSize: "420 KB",
    relatedProject: "IP compliance modernization",
    dateAdded: "2026-02-26",
    workflowName: "IP Clause Watch",
    addedBy: {
      name: "Mina Faris",
      initials: "MF",
      tone: "bg-violet-100 text-violet-700",
    },
  },
  {
    id: "d4",
    fileType: "docx",
    fileName: "Diligence Checklist v4",
    fileSize: "860 KB",
    relatedProject: "M&A diligence sprint - North region",
    dateAdded: "2026-02-14",
    workflowName: "M&A Diligence Runbook",
    addedBy: {
      name: "Bryan Lee",
      initials: "BL",
      tone: "bg-cyan-100 text-cyan-700",
    },
  },
  {
    id: "d5",
    fileType: "txt",
    fileName: "Clause Parser Ruleset",
    fileSize: "96 KB",
    relatedProject: "Contract AI extraction engine",
    dateAdded: "2026-01-29",
    workflowName: "Contract Risk Review",
    addedBy: {
      name: "Sarah Chen",
      initials: "SC",
      tone: "bg-amber-100 text-amber-700",
    },
  },
  {
    id: "d6",
    fileType: "pdf",
    fileName: "Data Processing Addendum",
    fileSize: "3.2 MB",
    relatedProject: "Enterprise privacy program 2026",
    dateAdded: "2026-03-12",
    workflowName: "IP Clause Watch",
    addedBy: {
      name: "Lena Noor",
      initials: "LN",
      tone: "bg-rose-100 text-rose-700",
    },
  },
]

const fileTypeIconMap: Record<DataItem["fileType"], string> = {
  pdf: "/data types icons/pdf.png",
  docx: "/data types icons/docx.png",
  xlsx: "/data types icons/xlsx.png",
  csv: "/data types icons/csv.png",
  pptx: "/data types icons/pptx.png",
  txt: "/data types icons/txt.png",
  json: "/data types icons/json.png",
  zip: "/data types icons/zip.png",
  png: "/data types icons/png.png",
  jpg: "/data types icons/jpg.png",
}

function DateAdded({ value }: { value: string }) {
  const date = new Date(value)
  return (
    <time dateTime={value} className="text-sm text-foreground">
      {date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </time>
  )
}

export default function MyDataPage() {
  const [dataRows, setDataRows] = useState<DataItem[]>(tableData)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [workflowFilter, setWorkflowFilter] = useState("all")
  const [addedByFilter, setAddedByFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<DateFilter>("all")

  const workflowOptions = useMemo(
    () => Array.from(new Set(dataRows.map((item) => item.workflowName))),
    [dataRows]
  )

  const addedByOptions = useMemo(
    () => Array.from(new Set(dataRows.map((item) => item.addedBy.name))),
    [dataRows]
  )

  const filteredRows = useMemo(() => {
    const now = new Date("2026-03-14")

    return dataRows.filter((item) => {
      const matchSearch =
        search.trim().length === 0 ||
        item.fileName.toLowerCase().includes(search.toLowerCase()) ||
        item.relatedProject.toLowerCase().includes(search.toLowerCase())

      const matchWorkflow =
        workflowFilter === "all" || item.workflowName === workflowFilter

      const matchAddedBy =
        addedByFilter === "all" || item.addedBy.name === addedByFilter

      const itemDate = new Date(item.dateAdded)
      const diffDays = Math.floor(
        (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      const matchDate =
        dateFilter === "all" ||
        (dateFilter === "7d" && diffDays <= 7) ||
        (dateFilter === "30d" && diffDays <= 30) ||
        (dateFilter === "90d" && diffDays <= 90)

      return matchSearch && matchWorkflow && matchAddedBy && matchDate
    })
  }, [dataRows, search, workflowFilter, addedByFilter, dateFilter])

  const selectedRowIdsSet = useMemo(() => new Set(selectedRowIds), [selectedRowIds])
  const hasSelectedRows = selectedRowIds.length > 0
  const areAllFilteredRowsSelected =
    filteredRows.length > 0 &&
    filteredRows.every((row) => selectedRowIdsSet.has(row.id))
  const isSomeFilteredRowSelected =
    filteredRows.length > 0 &&
    filteredRows.some((row) => selectedRowIdsSet.has(row.id))

  const deleteRows = (rowIds: string[]) => {
    if (rowIds.length === 0) return
    const rowIdsSet = new Set(rowIds)
    setDataRows((previous) => previous.filter((item) => !rowIdsSet.has(item.id)))
    setSelectedRowIds((previous) =>
      previous.filter((rowId) => !rowIdsSet.has(rowId))
    )
  }

  const handleDeleteRow = (rowId: string) => {
    deleteRows([rowId])
  }

  const handleDeleteSelectedRows = () => {
    deleteRows(selectedRowIds)
  }

  const toggleRowSelection = (rowId: string, checked: boolean) => {
    setSelectedRowIds((previous) => {
      if (checked) {
        if (previous.includes(rowId)) return previous
        return [...previous, rowId]
      }
      return previous.filter((itemId) => itemId !== rowId)
    })
  }

  const toggleSelectAllFilteredRows = (checked: boolean) => {
    const filteredRowIds = filteredRows.map((row) => row.id)
    setSelectedRowIds((previous) => {
      if (checked) {
        return Array.from(new Set([...previous, ...filteredRowIds]))
      }
      const filteredRowIdsSet = new Set(filteredRowIds)
      return previous.filter((itemId) => !filteredRowIdsSet.has(itemId))
    })
  }

  const workflowFilterLabel =
    workflowFilter === "all" ? "All workflows" : workflowFilter
  const addedByFilterLabel =
    addedByFilter === "all" ? "All users" : addedByFilter
  const dateFilterLabel =
    dateFilter === "all"
      ? "Any date"
      : dateFilter === "7d"
        ? "Last 7 days"
        : dateFilter === "30d"
          ? "Last 30 days"
          : "Last 90 days"

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col bg-background">
      <section className="sticky top-10 z-30 flex h-10 items-center border-b border-border bg-background px-3">
        <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto">
          <div className="relative h-7 min-w-64 shrink-0">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search file name or related project"
              className="h-7 rounded-lg border-border/60 bg-transparent pl-7 text-xs"
            />
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
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Workflow:</span>
              <span>{workflowFilterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-44 rounded-xl p-1"
            >
              <DropdownMenuItem onClick={() => setWorkflowFilter("all")}>
                All workflows
              </DropdownMenuItem>
              {workflowOptions.map((workflow) => (
                <DropdownMenuItem
                  key={workflow}
                  onClick={() => setWorkflowFilter(workflow)}
                >
                  {workflow}
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
                  className="h-7 shrink-0 gap-1.5 rounded-lg border-border/60 bg-transparent px-2.5 text-xs"
                />
              }
            >
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Added by:</span>
              <span>{addedByFilterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-44 rounded-xl p-1"
            >
              <DropdownMenuItem onClick={() => setAddedByFilter("all")}>
                All users
              </DropdownMenuItem>
              {addedByOptions.map((user) => (
                <DropdownMenuItem
                  key={user}
                  onClick={() => setAddedByFilter(user)}
                >
                  {user}
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
                  className="h-7 shrink-0 gap-1.5 rounded-lg border-border/60 bg-transparent px-2.5 text-xs"
                />
              }
            >
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span>{dateFilterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-40 rounded-xl p-1"
            >
              <DropdownMenuItem onClick={() => setDateFilter("all")}>
                Any date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("7d")}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("30d")}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("90d")}>
                Last 90 days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {hasSelectedRows && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 shrink-0 bg-sidebar px-2.5 text-xs text-foreground hover:bg-sidebar-accent"
              onClick={handleDeleteSelectedRows}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete selected ({selectedRowIds.length})
            </Button>
          )}
        </div>
      </section>

      <div className="flex-1 px-3 pt-0 pb-4">
        {dataRows.length === 0 ? (
          <div className="flex h-full min-h-[50vh] items-center justify-center">
            <EmptyMyDataPattern />
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-border">
            <p className="text-sm text-muted-foreground">
              No files match the current filters.
            </p>
          </div>
        ) : (
          <div className="-mx-3 overflow-x-auto">
            <table className="w-full min-w-[1060px] border-collapse">
              <thead className="border-b border-border bg-muted/30">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="w-11 border-r border-border/80 px-3 py-1.5 text-center font-medium">
                    <input
                      type="checkbox"
                      checked={areAllFilteredRowsSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isSomeFilteredRowSelected && !areAllFilteredRowsSelected
                      }}
                      onChange={(event) =>
                        toggleSelectAllFilteredRows(event.target.checked)
                      }
                      aria-label="Select all visible files"
                      className="h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-ring"
                    />
                  </th>
                  <th className="border-r border-border/80 px-4 py-1.5 font-medium">
                    File name
                  </th>
                  <th className="border-r border-border/80 px-4 py-1.5 font-medium">
                    File size
                  </th>
                  <th className="border-r border-border/80 px-4 py-1.5 font-medium">
                    Related project
                  </th>
                  <th className="border-r border-border/80 px-4 py-1.5 font-medium">
                    Date added
                  </th>
                  <th className="border-r border-border/80 px-4 py-1.5 font-medium">
                    Workflow assigned
                  </th>
                  <th className="border-r border-border/80 px-4 py-1.5 font-medium">
                    Added by
                  </th>
                  <th className="px-4 py-1.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const iconSrc =
                    fileTypeIconMap[row.fileType] ??
                    "/data types icons/any other file type.png"

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-border text-sm hover:bg-muted/30"
                    >
                      <td className="border-r border-border/70 px-3 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRowIdsSet.has(row.id)}
                          onChange={(event) =>
                            toggleRowSelection(row.id, event.target.checked)
                          }
                          aria-label={`Select ${row.fileName}`}
                          className="h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-ring"
                        />
                      </td>
                      <td className="border-r border-border/70 px-4 py-1 font-medium text-foreground">
                        <span className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-8 shrink-0 items-center justify-center overflow-hidden rounded-sm align-middle">
                            <Image
                              src={iconSrc}
                              alt={`${row.fileType.toUpperCase()} icon`}
                              width={20}
                              height={20}
                              className="h-auto w-auto max-h-5 max-w-5 object-contain"
                            />
                          </span>
                          <span>{row.fileName}</span>
                        </span>
                      </td>
                      <td className="border-r border-border/70 px-4 py-1 text-muted-foreground">
                        {row.fileSize}
                      </td>
                      <td className="border-r border-border/70 px-4 py-1 text-muted-foreground">
                        {row.relatedProject}
                      </td>
                      <td className="border-r border-border/70 px-4 py-1">
                        <DateAdded value={row.dateAdded} />
                      </td>
                      <td className="border-r border-border/70 px-4 py-1 text-foreground">
                        {row.workflowName}
                      </td>
                      <td className="border-r border-border/70 px-4 py-1">
                        <span
                          title={row.addedBy.name}
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${row.addedBy.tone}`}
                        >
                          {row.addedBy.initials}
                        </span>
                      </td>
                      <td className="px-4 py-1">
                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            variant="ghost"
                            className="bg-sidebar px-1.5 text-xs text-foreground hover:bg-sidebar-accent hover:text-foreground"
                          >
                            Update
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  size="icon-xs"
                                  variant="ghost"
                                  className="bg-sidebar text-foreground hover:bg-sidebar-accent hover:text-foreground"
                                  aria-label="More actions"
                                  title="More actions"
                                />
                              }
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="min-w-32 rounded-xl p-1"
                            >
                              <DropdownMenuItem>
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDeleteRow(row.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
