import { formatRupiah } from "@/src/domain/currency"
import { buildSummary } from "@/src/exports/summary-model"
import type { Branch, BranchKpi, Merchant } from "@/src/types/entities"

export function ExecutiveSummary({ branches, kpi, merchants }: { branches: Branch[]; kpi: BranchKpi[]; merchants: Merchant[] }) {
  const summary = buildSummary(branches, kpi, merchants)
  return (
    <section className="print-summary flex flex-col gap-3 text-sm">
      <header>
        <h2 className="text-lg font-semibold">Executive summary</h2>
        <p className="text-muted-foreground">Branch Acquisition Portal · {new Date().toISOString().slice(0, 10)}</p>
      </header>
      <div className="grid grid-cols-5 gap-2">
        {kpi.map((row) => <p key={row.branchId} className="tabular-nums">{row.wholesaleUnits}</p>)}
      </div>
      {summary.targets.map((row) => (
        <p key={row.branchId} className="text-right tabular-nums">{branches.find((branch) => branch.id === row.branchId)?.name}: {row.targetAchievementPercent}%</p>
      ))}
      <p>Top branch: {summary.topBranch?.name ?? "None"}</p>
      {summary.edcIssues.map((item) => <p key={item.branch.id}>{item.branch.name}: {item.count} alert merchants</p>)}
      {summary.omittedEdcIssues > 0 ? <p>+{summary.omittedEdcIssues} more</p> : null}
      <p className="text-right tabular-nums">Savings: {formatRupiah(kpi.reduce((sum, row) => sum + row.savingsPortfolio, 0))}</p>
    </section>
  )
}
