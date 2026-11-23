import type { BranchPipelineEntry, PipelineStage } from "@/src/types/entities"

export const STAGE_ORDER: PipelineStage[] = [
  "PROSPECTING",
  "PITCHING",
  "DOCUMENTS",
  "MOU",
  "ACQUISITION",
]

/** Forward by exactly one step. Moving back or skipping is rejected. */
export function advanceStage(stage: PipelineStage): PipelineStage | null {
  const index = STAGE_ORDER.indexOf(stage)
  if (index < 0 || index === STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[index + 1]
}

export function selectBatchClosable(
  entries: BranchPipelineEntry[],
  today: string,
): BranchPipelineEntry[] {
  return entries.filter(
    (entry) => entry.visitStatus === "SCHEDULED" && entry.scheduledDate === today,
  )
}
