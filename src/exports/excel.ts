import * as XLSX from "xlsx"

import { isMerchantAlert } from "@/src/domain/merchant-alert"
import type { Branch, BranchKpi, BranchPipelineEntry, Merchant } from "@/src/types/entities"

function sheet(rows: Record<string, string | number>[]) {
  return XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Notice: "No records for this filter" }])
}

export function buildWorkbook(input: {
  branches: Branch[]
  kpi: BranchKpi[]
  pipeline: BranchPipelineEntry[]
  merchants: Merchant[]
}) {
  const branchName = (id: string) => input.branches.find((branch) => branch.id === id)?.name ?? id
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet(input.kpi.map((row) => ({
    Branch: branchName(row.branchId),
    Period: row.period,
    "Wholesale Units (CB)": row.wholesaleUnits,
    "Savings Portfolio (Rp)": row.savingsPortfolio,
    "Merchant Growth (%)": row.merchantGrowthPercent,
    "Livin' Merchant Activity": row.livinMerchantActivity,
    "EDC Penetration (%)": row.edcPenetrationPercent,
    "Target Achievement (%)": row.targetAchievementPercent,
  }))), "Branch Recap")
  XLSX.utils.book_append_sheet(workbook, sheet(input.pipeline.map((row) => ({
    Branch: branchName(row.branchId),
    Customer: row.customerName,
    Category: row.category,
    Stage: row.stage,
    "PIC NIP": row.picNip,
    "Scheduled Date": row.scheduledDate,
    "Visit Status": row.visitStatus,
    "Checklist Done": `${row.checklist.filter((item) => item.done).length}/${row.checklist.length}`,
    "Last Visit Note": row.visitHistory.at(-1)?.note ?? "",
  }))), "Pipeline")
  XLSX.utils.book_append_sheet(workbook, sheet(input.merchants.map((row) => ({
    Branch: branchName(row.branchId),
    Store: row.storeName,
    Owner: row.owner,
    CIF: row.cif,
    Area: row.area,
    "EDC Status": row.edcStatus,
    "Monthly Sales (Rp)": row.monthlySales,
    "Monthly Transactions": row.monthlyTransactions,
    "MDR (%)": row.mdrPercent,
    Alert: isMerchantAlert(row) ? "YES" : "NO",
  }))), "Merchant/EDC")
  return workbook
}

export function downloadWorkbook(workbook: XLSX.WorkBook) {
  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(workbook, `portal-export-${date}.xlsx`)
}
