import { isMerchantAlert } from "@/src/domain/merchant-alert"
import type { Branch, BranchKpi, Merchant } from "@/src/types/entities"

export function buildSummary(branches: Branch[], kpi: BranchKpi[], merchants: Merchant[]) {
  const ranked = [...kpi].sort((a, b) => b.targetAchievementPercent - a.targetAchievementPercent)
  const alerts = branches
    .map((branch) => ({
      branch,
      count: merchants.filter((merchant) => merchant.branchId === branch.id && isMerchantAlert(merchant)).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
  return {
    topBranch: ranked[0] ? branches.find((branch) => branch.id === ranked[0].branchId) : undefined,
    targets: ranked,
    edcIssues: alerts.slice(0, 5),
    omittedEdcIssues: Math.max(0, alerts.length - 5),
  }
}
