import { Frame, FramePanel } from "@/components/reui/frame"
import { formatRupiah } from "@/src/domain/currency"
import type { BranchKpi } from "@/src/types/entities"

export function KpiCards({ kpi }: { kpi: BranchKpi }) {
  const cards = [
    { label: "Wholesale units (CB)", value: String(kpi.wholesaleUnits) },
    { label: "Savings portfolio", value: formatRupiah(kpi.savingsPortfolio) },
    { label: "Merchant growth", value: `${kpi.merchantGrowthPercent}%` },
    { label: "Livin' Merchant activity", value: String(kpi.livinMerchantActivity) },
    { label: "EDC penetration", value: `${kpi.edcPenetrationPercent}%` },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Frame key={card.label}>
          <FramePanel className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="text-lg font-semibold tracking-tight break-words tabular-nums">{card.value}</p>
          </FramePanel>
        </Frame>
      ))}
    </div>
  )
}
