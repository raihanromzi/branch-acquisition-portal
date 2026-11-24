"use client"

import { useMemo, useState } from "react"
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/reui/badge"
import { Frame, FrameHeader, FramePanel, FrameTitle } from "@/components/reui/frame"
import { BatchClosingPanel } from "@/components/pipeline/batch-closing-panel"
import { PipelineTimeline } from "@/components/pipeline/pipeline-timeline"
import { StageInspector } from "@/components/pipeline/stage-inspector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCatalog } from "@/src/data/store"
import { useStore } from "@/src/data/use-store"
import type { PipelineStage } from "@/src/types/entities"

export function PipelineTab() {
  const { pipeline } = useStore()
  const { branches, staff } = getCatalog()
  const [view, setView] = useState<"workflow" | "batch">("workflow")
  const [branchId, setBranchId] = useState("ALL")
  const [picNip, setPicNip] = useState("ALL")
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(pipeline[0]?.id ?? null)
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return pipeline.filter((entry) => {
      const matchBranch = branchId === "ALL" || entry.branchId === branchId
      const matchPic = picNip === "ALL" || entry.picNip === picNip
      const matchSearch = !term || entry.customerName.toLowerCase().includes(term)
      return matchBranch && matchPic && matchSearch
    })
  }, [pipeline, branchId, picNip, search])

  const selectedEntry = useMemo(() => {
    return pipeline.find((item) => item.id === selectedId) ?? filtered[0] ?? null
  }, [pipeline, selectedId, filtered])

  const effectiveStage: PipelineStage = selectedStage ?? selectedEntry?.stage ?? "PROSPECTING"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-56">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter customer..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          <Select value={branchId} onValueChange={setBranchId}>
            <SelectTrigger className="h-8 w-44 text-xs">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">All branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={picNip} onValueChange={setPicNip}>
            <SelectTrigger className="h-8 w-44 text-xs">
              <SelectValue placeholder="PIC" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">All PIC</SelectItem>
                {staff.map((member) => (
                  <SelectItem key={member.nip} value={member.nip}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={view === "workflow" ? "default" : "outline"}
            onClick={() => setView("workflow")}
          >
            Workflow
          </Button>
          <Button
            type="button"
            size="sm"
            variant={view === "batch" ? "default" : "outline"}
            onClick={() => setView("batch")}
          >
            <SlidersHorizontalIcon data-icon="inline-start" />
            Batch closing
          </Button>
        </div>
      </div>

      {view === "batch" ? (
        <Frame>
          <FrameHeader>
            <FrameTitle>Batch closing</FrameTitle>
          </FrameHeader>
          <FramePanel>
            <BatchClosingPanel entries={pipeline} />
          </FramePanel>
        </Frame>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_320px]">
          <Frame>
            <FrameHeader>
              <FrameTitle>Customers</FrameTitle>
              <p className="text-xs text-muted-foreground tabular-nums">{filtered.length} in view</p>
            </FrameHeader>
            <FramePanel className="flex max-h-[70vh] flex-col gap-1.5 overflow-y-auto">
              {filtered.map((entry) => {
                const active = entry.id === selectedEntry?.id
                const branch = branches.find((item) => item.id === entry.branchId)
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(entry.id)
                      setSelectedStage(entry.stage)
                    }}
                    className={`rounded-lg border p-2.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      active
                        ? "border-primary bg-muted/60 font-medium"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate font-semibold">{entry.customerName}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {entry.category}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-muted-foreground">{branch?.name}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{entry.stage}</span>
                      <span>Visit {entry.scheduledDate}</span>
                    </div>
                  </button>
                )
              })}
              {filtered.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted-foreground">
                  No customers match these filters.
                </p>
              ) : null}
            </FramePanel>
          </Frame>

          {selectedEntry ? (
            <>
              <PipelineTimeline
                entry={selectedEntry}
                selectedStage={effectiveStage}
                onSelectStage={setSelectedStage}
              />
              <div className="lg:col-span-2 xl:col-span-1">
                <StageInspector entry={selectedEntry} selectedStage={effectiveStage} />
              </div>
            </>
          ) : (
            <Frame className="lg:col-span-2">
              <FramePanel className="flex items-center justify-center text-sm text-muted-foreground">
                Select a customer from the list.
              </FramePanel>
            </Frame>
          )}
        </div>
      )}
    </div>
  )
}
