import { ExecutiveSummary } from "@/components/reports/executive-summary"
import { ExportActions } from "@/components/reports/export-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCatalog } from "@/src/data/store"

export function ReportsTab() {
  const { branches, kpi, merchants } = getCatalog()
  return (
    <Card>
      <CardHeader><CardTitle>Reports</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ExportActions />
        <ExecutiveSummary branches={branches} kpi={kpi} merchants={merchants} />
      </CardContent>
    </Card>
  )
}
