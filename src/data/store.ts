"use client"

import { classifyNbds } from "@/src/domain/nbds"
import { canTransition, isGmmEligible } from "@/src/domain/acquisition-status"
import { advanceStage } from "@/src/domain/pipeline"
import { validateIntake } from "@/src/domain/intake-schema"
import { isValidNipFormat } from "@/src/domain/nip"
import type {
  AcquisitionStatus,
  AcquisitionSubmission,
  BranchPipelineEntry,
  NbdsResult,
  VisitRecord,
} from "@/src/types/entities"

import { clearState, loadState, saveState } from "./persistence"
import { branches } from "./seed/branches"
import { kpi } from "./seed/kpi"
import { merchants } from "./seed/merchants"
import { pipeline } from "./seed/pipeline"
import { products } from "./seed/products"
import { staff } from "./seed/staff"
import { submissions } from "./seed/submissions"

export interface IntakeDraft {
  acquisitionType: AcquisitionSubmission["acquisitionType"]
  productCode: string
}

interface PortalState {
  submissions: AcquisitionSubmission[]
  pipeline: BranchPipelineEntry[]
  intakeDraft: IntakeDraft | null
}

const seedState = (): PortalState => ({
  submissions: structuredClone(submissions),
  pipeline: structuredClone(pipeline),
  intakeDraft: null,
})

let state: PortalState = seedState()
const listeners = new Set<() => void>()

function commit(next: PortalState) {
  state = next
  saveState(next)
  listeners.forEach((listener) => listener())
}

export function hydrateStore() {
  state = loadState(seedState())
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getState() {
  return state
}

export function getCatalog() {
  return { branches, staff, products, merchants, kpi }
}

export function lookupStaff(nip: string) {
  if (!isValidNipFormat(nip)) return null
  return staff.find((member) => member.nip === nip) ?? null
}

export type StoreError =
  | "NIP_NOT_FOUND"
  | "VALIDATION_FAILED"
  | "NOT_FOUND"
  | "INVALID_TRANSITION"
  | "NOTE_REQUIRED"
  | "CONFIRMATION_REQUIRED"

export function submitAcquisition(input: Record<string, unknown>) {
  const staffMember = lookupStaff(String(input.nip ?? ""))
  if (!staffMember) {
    return { ok: false as const, error: "NIP_NOT_FOUND" as const, fieldErrors: { nip: "NIP is not recognized" } }
  }
  const validated = validateIntake(input)
  if (!validated.success) {
    return { ok: false as const, error: "VALIDATION_FAILED" as const, fieldErrors: validated.fieldErrors }
  }
  const product = products.find((item) => item.code === validated.data.productCode)
  if (!product || product.acquisitionType !== validated.data.acquisitionType) {
    return {
      ok: false as const,
      error: "VALIDATION_FAILED" as const,
      fieldErrors: { productCode: "Select a product for this type" },
    }
  }
  const { nip: submittedNip, ...fields } = validated.data
  void submittedNip
  const submission: AcquisitionSubmission = {
    id: `SUB-${Date.now().toString(36)}`,
    submittedAt: new Date().toISOString(),
    nip: staffMember.nip,
    staffName: staffMember.name,
    branchId: staffMember.branchId,
    productName: product.name,
    nbdsResult: classifyNbds(fields.cif),
    status: "WAITING_APPROVAL",
    acceptedWithoutNewCif: false,
    ...fields,
  }
  commit({ ...state, submissions: [submission, ...state.submissions], intakeDraft: null })
  return { ok: true as const, submission }
}

export function setNbdsResult(submissionId: string, result: NbdsResult) {
  const current = state.submissions.find((item) => item.id === submissionId)
  if (!current) return { ok: false as const, error: "NOT_FOUND" as const }
  const updated = { ...current, nbdsResult: result }
  commit({
    ...state,
    submissions: state.submissions.map((item) => (item.id === submissionId ? updated : item)),
  })
  return { ok: true as const, submission: updated }
}

export function transitionStatus(
  submissionId: string,
  target: AcquisitionStatus,
  options: { note?: string; confirmNonNewCif?: boolean } = {},
) {
  const current = state.submissions.find((item) => item.id === submissionId)
  if (!current) return { ok: false as const, error: "NOT_FOUND" as const }
  const allowed = canTransition(current.status, target)
  if (!allowed.ok) return { ok: false as const, error: "INVALID_TRANSITION" as const }
  if (target === "REJECTED" && !options.note?.trim()) {
    return { ok: false as const, error: "NOTE_REQUIRED" as const }
  }
  if (target === "ACCEPTED_GMM" && !isGmmEligible(current.nbdsResult) && !options.confirmNonNewCif) {
    return { ok: false as const, error: "CONFIRMATION_REQUIRED" as const }
  }
  const updated: AcquisitionSubmission = {
    ...current,
    status: target,
    note: target === "REJECTED" ? options.note?.trim() : current.note,
    acceptedWithoutNewCif:
      target === "ACCEPTED_GMM" && !isGmmEligible(current.nbdsResult),
  }
  commit({
    ...state,
    submissions: state.submissions.map((item) => (item.id === submissionId ? updated : item)),
  })
  return { ok: true as const, submission: updated }
}

export function advancePipelineStage(entryId: string) {
  const current = state.pipeline.find((item) => item.id === entryId)
  if (!current) return { ok: false as const, error: "NOT_FOUND" as const }
  const next = advanceStage(current.stage)
  if (!next) return { ok: false as const, error: "INVALID_TRANSITION" as const }
  const updated = { ...current, stage: next }
  commit({ ...state, pipeline: state.pipeline.map((item) => (item.id === entryId ? updated : item)) })
  return { ok: true as const, entry: updated }
}

export function addChecklistDone(entryId: string, itemId: string, done: boolean) {
  const current = state.pipeline.find((item) => item.id === entryId)
  if (!current) return { ok: false as const, error: "NOT_FOUND" as const }
  const updated = {
    ...current,
    checklist: current.checklist.map((item) => (item.id === itemId ? { ...item, done } : item)),
  }
  commit({ ...state, pipeline: state.pipeline.map((item) => (item.id === entryId ? updated : item)) })
  return { ok: true as const, entry: updated }
}

export function addVisitRecord(entryId: string, record: VisitRecord) {
  const current = state.pipeline.find((item) => item.id === entryId)
  if (!current) return { ok: false as const, error: "NOT_FOUND" as const }
  if (!record.note.trim() || !record.date) {
    return { ok: false as const, error: "VALIDATION_FAILED" as const }
  }
  const updated = { ...current, visitHistory: [...current.visitHistory, record] }
  commit({ ...state, pipeline: state.pipeline.map((item) => (item.id === entryId ? updated : item)) })
  return { ok: true as const, entry: updated }
}

export function batchMarkVisitsDone(entryIds: string[], today: string) {
  let updated = 0
  let skipped = 0
  const selected = new Set(entryIds)
  const pipelineNext = state.pipeline.map((entry) => {
    if (!selected.has(entry.id)) return entry
    if (entry.visitStatus === "SCHEDULED" && entry.scheduledDate === today) {
      updated += 1
      return { ...entry, visitStatus: "DONE" as const }
    }
    skipped += 1
    return entry
  })
  commit({ ...state, pipeline: pipelineNext })
  return { updated, skipped }
}

export function setIntakeDraft(draft: IntakeDraft) {
  commit({ ...state, intakeDraft: draft })
}

export function clearIntakeDraft() {
  commit({ ...state, intakeDraft: null })
}

export function reset() {
  clearState()
  commit(seedState())
}
