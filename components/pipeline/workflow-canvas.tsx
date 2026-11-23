"use client"

import {
  CheckCircle2Icon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  HandshakeIcon,
  SearchIcon,
  TargetIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { STAGE_ORDER } from "@/src/domain/pipeline"
import type { BranchPipelineEntry, PipelineStage } from "@/src/types/entities"

const STAGE_META: Record<PipelineStage, { label: string; description: string; icon: typeof SearchIcon }> = {
  PROSPECTING: { label: "Prospecting", description: "Identify & qualify opportunity", icon: SearchIcon },
  PITCHING: { label: "Pitching", description: "Present solution & value", icon: TargetIcon },
  DOCUMENTS: { label: "Documents", description: "Collect required documents", icon: FileTextIcon },
  MOU: { label: "MoU / Agreement", description: "Negotiate & formalize", icon: HandshakeIcon },
  ACQUISITION: { label: "Acquisition / Live", description: "Activate customer relationship", icon: ClipboardCheckIcon },
}

export function WorkflowCanvas({
  entry,
  selectedStage,
  onSelectStage,
  onAdvance,
}: {
  entry: BranchPipelineEntry
  selectedStage: PipelineStage
  onSelectStage: (stage: PipelineStage) => void
  onAdvance: () => void
}) {
  const currentIndex = STAGE_ORDER.indexOf(entry.stage)
  const checklistDone = entry.checklist.filter((item) => item.done).length

  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-xl border border-border bg-card">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="relative flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Acquisition workflow</p>
            <h3 className="text-sm font-semibold">{entry.customerName}</h3>
          </div>
          <Badge variant="outline">{entry.category}</Badge>
        </header>

        <div className="flex flex-1 items-center overflow-x-auto px-5 py-10">
          <div className="mx-auto flex min-w-max items-center gap-1">
            {STAGE_ORDER.map((stage, index) => {
              const meta = STAGE_META[stage]
              const Icon = meta.icon
              const complete = index < currentIndex
              const active = index === currentIndex
              const selected = stage === selectedStage
              return (
                <div key={stage} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => onSelectStage(stage)}
                    className={`w-40 rounded-xl border bg-card p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                    } ${active ? "shadow-sm" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`flex size-8 items-center justify-center rounded-lg ${complete ? "bg-success/15 text-success" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {complete ? <CheckCircle2Icon className="size-4" /> : <Icon className="size-4" />}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {complete ? "Completed" : active ? "In Progress" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold">{meta.label}</p>
                    <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{meta.description}</p>
                  </button>
                  {index < STAGE_ORDER.length - 1 ? (
                    <div className={`flex w-9 items-center ${index < currentIndex ? "text-success" : "text-muted-foreground/50"}`}>
                      <div className="h-px flex-1 bg-current" />
                      <ChevronRightIcon className="size-4" />
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-border bg-background/90 px-4 py-3">
          <p className="text-xs text-muted-foreground">Checklist: {checklistDone}/{entry.checklist.length} completed</p>
          <Button type="button" size="sm" disabled={currentIndex === STAGE_ORDER.length - 1} onClick={onAdvance}>
            Advance to next stage
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </footer>
      </div>
    </section>
  )
}
