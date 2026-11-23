import { formatRupiah } from "@/src/domain/currency"
import type { BranchKpi } from "@/src/types/entities"

export function KpiCards({ kpi }: { kpi: BranchKpi }) {
  const cards = [
    { label: "Wholesale Units (CB)", value: String(kpi.wholesaleUnits) },
    { label: "Savings Portfolio", value: formatRupiah(kpi.savingsPortfolio) },
    { label: "Merchant Growth", value: `${kpi.merchantGrowthPercent}%` },
    { label: "Livin' Merchant Activity", value: String(kpi.livinMerchantActivity) },
    { label: "EDC Penetration", value: `${kpi.edcPenetrationPercent}%` },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="flex flex-col gap-1 border border-border p-4">
          <p className="text-xs text-muted-foreground">{card.label}</p>
          <p className="text-sm font-semibold tabular-nums">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
