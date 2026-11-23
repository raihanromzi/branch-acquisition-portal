import type { AcquisitionStatus, NbdsResult } from "@/src/types/entities"

export type TransitionReason =
  | "OK"
  | "TERMINAL"
  | "NOT_ALLOWED"
  | "NOTE_REQUIRED"
  | "CONFIRMATION_REQUIRED"

const ALLOWED: Record<AcquisitionStatus, AcquisitionStatus[]> = {
  WAITING_APPROVAL: ["ACCEPTED_GMM", "REJECTED"],
  ACCEPTED_GMM: ["COMPLETED"],
  REJECTED: [],
  COMPLETED: [],
}

export function canTransition(
  from: AcquisitionStatus,
  to: AcquisitionStatus,
): { ok: boolean; reason: TransitionReason } {
  if (ALLOWED[from].includes(to)) return { ok: true, reason: "OK" }
  if (from === "COMPLETED" || from === "REJECTED") {
    return { ok: false, reason: "TERMINAL" }
  }
  return { ok: false, reason: "NOT_ALLOWED" }
}

/** GMM-eligible without extra confirmation only for a New CIF result. */
export function isGmmEligible(nbdsResult: NbdsResult): boolean {
  return nbdsResult === "NEW_CIF"
}
