"use client"

import { CheckIcon, ChevronDownIcon, CircleIcon } from "lucide-react"

import { Badge } from "@/components/reui/badge"
import { Frame, FrameHeader, FramePanel } from "@/components/reui/frame"
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { STAGE_ORDER } from "@/src/domain/pipeline"
import type { BranchPipelineEntry, PipelineStage } from "@/src/types/entities"

const STAGE_META: Record<PipelineStage, { label: string; description: string; taskCount: number }> = {
  PROSPECTING: { label: "Prospecting", description: "Identify & qualify opportunity", taskCount: 2 },
  PITCHING: { label: "Pitching", description: "Present solution & value", taskCount: 2 },
  DOCUMENTS: { label: "Documents", description: "Collect required documents", taskCount: 3 },
  MOU: { label: "MoU / Agreement", description: "Negotiate & formalize", taskCount: 2 },
  ACQUISITION: { label: "Acquisition / Live", description: "Activate customer relationship", taskCount: 2 },
}

/** Stage progress relative to the entry's current stage. */
type StageState = "completed" | "active" | "pending"

const STATE_LABEL: Record<StageState, string> = {
  completed: "Completed",
  active: "In progress",
  pending: "Pending",
}

const STATE_BADGE: Record<StageState, "success-light" | "info-light" | "outline"> = {
  completed: "success-light",
  active: "info-light",
  pending: "outline",
}

function stageState(index: number, currentIndex: number): StageState {
  if (index < currentIndex) return "completed"
  if (index === currentIndex) return "active"
  return "pending"
}

function StageIcon({ state }: { state: StageState }) {
  if (state === "completed") return <CheckIcon className="size-3.5" />
  if (state === "active") return <Spinner className="size-3.5" />
  return <CircleIcon className="size-3.5" />
}

export function PipelineTimeline({
  entry,
  selectedStage,
  onSelectStage,
}: {
  entry: BranchPipelineEntry
  selectedStage: PipelineStage
  onSelectStage: (stage: PipelineStage) => void
}) {
  const currentIndex = STAGE_ORDER.indexOf(entry.stage)
  const doneTasks = entry.checklist.filter((item) => item.done).length

  return (
    <section aria-labelledby="pipeline-timeline-title" className="flex min-w-0 flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">Acquisition workflow</p>
          <h3 id="pipeline-timeline-title" className="truncate text-base font-semibold tracking-tight">
            {entry.customerName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{entry.category}</Badge>
          <span className="text-xs text-muted-foreground tabular-nums">
            Checklist {doneTasks}/{entry.checklist.length}
          </span>
        </div>
      </header>

      <Timeline value={currentIndex} orientation="vertical">
        {STAGE_ORDER.map((stage, index) => {
          const meta = STAGE_META[stage]
          const state = stageState(index, currentIndex)
          const selected = stage === selectedStage
          const tasks = entry.checklist
            .filter((item) => item.description.toLowerCase().includes(stage.toLowerCase()))
            .slice(0, 3)

          return (
            <TimelineItem key={stage} step={index + 1} className="ms-10 pb-8">
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
                <div className="flex flex-wrap items-center gap-2">
                  <TimelineTitle className="text-sm font-semibold">{meta.label}</TimelineTitle>
                  <Badge variant={STATE_BADGE[state]} size="sm">
                    {STATE_LABEL[state]}
                  </Badge>
                </div>
                <TimelineIndicator
                  className={cn(
                    "flex size-6 items-center justify-center border-none bg-muted text-muted-foreground group-data-[orientation=vertical]/timeline:-left-7 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground",
                    state === "active" && "ring-2 ring-ring/40",
                  )}
                >
                  <StageIcon state={state} />
                </TimelineIndicator>
              </TimelineHeader>

              <TimelineContent className="mt-2">
                <Frame stacked dense spacing="sm" className={cn(selected && "ring-1 ring-ring")}>
                  <Collapsible defaultOpen={state === "active"} className="group/collapsible">
                    <CollapsibleTrigger className="flex w-full">
                      <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                          {meta.description} · {meta.taskCount} tasks
                        </span>
                        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      </FrameHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <FramePanel className="flex flex-col gap-3">
                        {tasks.length > 0 ? (
                          <ul className="flex flex-wrap gap-1.5">
                            {tasks.map((task) => (
                              <li key={task.id}>
                                <Badge variant={task.done ? "success-light" : "outline"} size="sm">
                                  {task.description}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground">No tasks defined for this stage.</p>
                        )}
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant={selected ? "default" : "outline"}
                            aria-pressed={selected}
                            onClick={() => onSelectStage(stage)}
                          >
                            {selected ? "Viewing in inspector" : "Open in inspector"}
                          </Button>
                        </div>
                      </FramePanel>
                    </CollapsibleContent>
                  </Collapsible>
                </Frame>
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </section>
  )
}
