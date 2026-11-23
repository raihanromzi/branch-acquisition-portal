import type { NbdsResult } from "@/src/types/entities"

/**
 * Simulated NBDS classification. Seed data assigns results directly; this
 * classifies a fresh submission from its CIF so the prototype needs no live
 * NBDS service (spec assumption).
 */
export function classifyNbds(cif: string | undefined): NbdsResult {
  if (!cif || cif.trim() === "") return "UNVERIFIED"
  const last = cif.trim().slice(-1)
  if ("02468".includes(last)) return "NEW_CIF"
  return "EXISTING_CIF"
}
