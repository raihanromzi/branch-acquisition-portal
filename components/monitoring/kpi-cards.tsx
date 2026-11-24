import { Card, CardContent } from "@/components/ui/card"
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label} className="gap-1 p-4">
          <CardContent className="flex flex-col gap-1 p-0">
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="text-sm font-semibold break-words tabular-nums">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
