import { z } from "zod"

import type { AcquisitionType } from "@/src/types/entities"

import { isValidVisitDate } from "./date-rules"

/**
 * Priority AUM floor. Open question: docs/specs.md says "Rp 1 Miliar/Rp 500
 * Juta" without saying which applies. CLAUDE.md rules: use Rp 500,000,000
 * until the product owner confirms.
 */
export const PRIORITY_AUM_MINIMUM = 500_000_000

const base = {
  nip: z.string(),
  customerName: z.string().trim().min(1, "Customer name is required"),
  cif: z.string().trim().optional(),
  productCode: z.string().min(1, "Select a product"),
  visitDate: z.string().refine(isValidVisitDate, "Enter a valid visit date"),
}

export const individualSchema = z.object({
  ...base,
  acquisitionType: z.literal("INDIVIDUAL"),
  amount: z.number().int().positive("Amount is required"),
})

export const businessSchema = z.object({
  ...base,
  acquisitionType: z.literal("BUSINESS"),
  amount: z.number().int().positive("Amount is required"),
})

export const payrollSchema = z.object({
  ...base,
  acquisitionType: z.literal("PAYROLL"),
  estimatedEmployees: z.number().int().positive("Employee count is required"),
})

export const prioritySchema = z.object({
  ...base,
  acquisitionType: z.literal("PRIORITY"),
  estimatedAum: z
    .number()
    .int()
    .min(PRIORITY_AUM_MINIMUM, "AUM must be at least Rp 500.000.000"),
})

export const merchantSchema = z.object({
  ...base,
  acquisitionType: z.literal("MERCHANT_OTBR"),
  edcType: z.string().trim().min(1, "EDC type is required"),
  estimatedSalesVolume: z.number().int().nonnegative("Sales volume is required"),
})

export const intakeSchemas = {
  INDIVIDUAL: individualSchema,
  BUSINESS: businessSchema,
  PAYROLL: payrollSchema,
  PRIORITY: prioritySchema,
  MERCHANT_OTBR: merchantSchema,
} as const

export type IntakeInput = z.input<(typeof intakeSchemas)[AcquisitionType]>

export function validateIntake(input: Record<string, unknown>) {
  const type = input.acquisitionType
  if (typeof type !== "string" || !(type in intakeSchemas)) {
    return { success: false as const, fieldErrors: { acquisitionType: "Select a type" } }
  }
  const result = intakeSchemas[type as AcquisitionType].safeParse(input)
  if (result.success) return { success: true as const, data: result.data }
  const fieldErrors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form")
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return { success: false as const, fieldErrors }
}
