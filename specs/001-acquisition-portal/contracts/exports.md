# Contract: Exports and Printed Summary

**Feature**: [../spec.md](../spec.md) | **Spec**: FR-026, FR-027

## Excel workbook (`src/exports/excel.ts`)

File name: `portal-export-YYYY-MM-DD.xlsx`. Exactly three sheets, in this order.

### Sheet 1: `Branch Recap`

Source: BranchKpi for the selected period, joined with Branch name.

| Column | Source |
|---|---|
| Branch | Branch.name |
| Period | BranchKpi.period |
| Wholesale Units (CB) | wholesaleUnits |
| Savings Portfolio (Rp) | savingsPortfolio |
| Merchant Growth (%) | merchantGrowthPercent |
| Livin' Merchant Activity | livinMerchantActivity |
| EDC Penetration (%) | edcPenetrationPercent |
| Target Achievement (%) | targetAchievementPercent |

### Sheet 2: `Pipeline`

Source: all BranchPipelineEntry rows for the selected branch filter (or all branches).

| Column | Source |
|---|---|
| Branch | Branch.name |
| Customer | customerName |
| Category | category |
| Stage | stage |
| PIC NIP | picNip |
| Scheduled Date | scheduledDate (ISO date) |
| Visit Status | visitStatus |
| Checklist Done | count of done / total |
| Last Visit Note | most recent visitHistory note |

### Sheet 3: `Merchant/EDC`

Source: Merchant rows for the selected branch filter (or all branches).

| Column | Source |
|---|---|
| Branch | Branch.name |
| Store | storeName |
| Owner | owner |
| CIF | cif |
| Area | area |
| EDC Status | edcStatus |
| Monthly Sales (Rp) | monthlySales |
| Monthly Transactions | monthlyTransactions |
| MDR (%) | mdrPercent |
| Alert | "YES" or "NO" from isMerchantAlert |

**Empty data**: The sheet keeps its header row and a single note row "No records for this filter"
(spec edge case). It is not omitted.

**Amounts**: Numeric cells, not formatted text, so spreadsheet users can compute with them.

## Executive one-page summary (`src/exports/summary-model.ts` and print CSS)

Print settings: `@page { size: A4; margin: 12mm }`. The summary MUST fit one page. Sections, in
order:

1. Header: branch or portal name, period, generation date.
2. KPI row: wholesale units, savings portfolio, merchant growth, Livin' Merchant activity, EDC
   penetration.
3. Target achievement: percentage per branch, sorted descending.
4. Highlights: top-performing branch (one line).
5. EDC issues: branches with alert merchants. Shows the top five by alert count, then "+N more".

**Overflow rule**: If a list exceeds its limit, it is truncated and the count of omitted items is
shown. The summary MUST NOT scroll or spill onto a second page.
