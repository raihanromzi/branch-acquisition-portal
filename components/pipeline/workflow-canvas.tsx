"use client"

import {
  CheckCircle2Icon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  HandshakeIcon,
  PlusIcon,
  SearchIcon,
  TargetIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { STAGE_ORDER } from "@/src/domain/pipeline"
import type { BranchPipelineEntry, PipelineStage } from "@/src/types/entities"

const STAGE_META: Record<PipelineStage, { label: string; description: string; icon: typeof SearchIcon; taskCount: number }> = {
  PROSPECTING: { label: "Prospecting", description: "Identify & qualify opportunity", icon: SearchIcon, taskCount: 2 },
  PITCHING: { label: "Pitching", description: "Present solution & value", icon: TargetIcon, taskCount: 2 },
  DOCUMENTS: { label: "Documents", description: "Collect required documents", icon: FileTextIcon, taskCount: 3 },
  MOU: { label: "MoU / Agreement", description: "Negotiate & formalize", icon: HandshakeIcon, taskCount: 2 },
  ACQUISITION: { label: "Acquisition / Live", description: "Activate customer relationship", icon: ClipboardCheckIcon, taskCount: 2 },
}

export function WorkflowCanvas({
  entry,
  selectedStage,
  onSelectStage,
}: {
  entry: BranchPipelineEntry
  selectedStage: PipelineStage
  onSelectStage: (stage: PipelineStage) => void
}) {
  const currentIndex = STAGE_ORDER.indexOf(entry.stage)

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

        <div className="flex flex-1 justify-center overflow-y-auto px-4 py-8">
          <div className="flex w-full max-w-2xl flex-col items-center gap-0">
            {STAGE_ORDER.map((stage, index) => {
              const meta = STAGE_META[stage]
              const Icon = meta.icon
              const complete = index < currentIndex
              const active = index === currentIndex
              const selected = stage === selectedStage
              const visibleTasks = entry.checklist.filter((item) => item.description.toLowerCase().includes(stage.toLowerCase())).slice(0, 3)
              return (
                <div key={stage} className="flex w-full flex-col items-center">
                  <button
                    type="button"
                    onClick={() => onSelectStage(stage)}
                    className={`w-full max-w-md rounded-xl border bg-card p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                    } ${active ? "shadow-sm" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex size-10 items-center justify-center rounded-lg ${complete ? "bg-success/15 text-success" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {complete ? <CheckCircle2Icon className="size-5" /> : <Icon className="size-5" />}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{meta.label}</p>
                        <p className="text-xs text-muted-foreground">{meta.taskCount} Tasks · {complete ? "Completed" : active ? "In Progress" : "Pending"}</p>
                      </div>
                      {selected ? <div className="size-2 rounded-full bg-primary" /> : null}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{meta.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {visibleTasks.length > 0 ? visibleTasks.map((task) => (
                        <span key={task.id} className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] ${task.done ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-border bg-muted/40"}`}>
                          {task.description.length > 26 ? `${task.description.slice(0, 26)}…` : task.description}
                        </span>
                      )) : (
                        <span className="inline-flex items-center rounded-md border border-dashed border-border px-2 py-1 text-[11px] text-muted-foreground">
                          No tasks defined
                        </span>
                      )}
                    </div>
                  </button>

                  {index < STAGE_ORDER.length - 1 ? (
                    <div className="relative my-1 flex h-10 w-full justify-center">
                      <div className={`absolute top-0 bottom-0 w-px ${index < currentIndex ? "bg-emerald-500/60" : "bg-muted"}`} />
                      {active ? (
                        <button
                          type="button"
                          className="z-10 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                          title="Advance next stage"
                          onClick={() => {
                            if (index === currentIndex) onSelectStage(STAGE_ORDER[index + 1])
                          }}
                        >
                          <PlusIcon className="size-4" />
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-border bg-background/90 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Checklist: {entry.checklist.filter((i) => i.done).length}/{entry.checklist.length} completed
          </p>
          <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            Current: {STAGE_META[entry.stage].label}
            <ChevronRightIcon className="size-3" />
          </p>
        </footer>
      </div>
    </section>
  )
}
