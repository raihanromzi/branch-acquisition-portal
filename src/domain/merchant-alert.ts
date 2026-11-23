import type { Merchant } from "@/src/types/entities"

/**
 * Alert thresholds from spec FR-019. Flagged conflict: docs/specs.md uses sales
 * alone; spec.md flags sales below the limit OR transactions below the limit.
 * This implements the spec rule. Upgrade path: drop the transaction clause if
 * the product owner confirms the source document wins.
 */
export const MERCHANT_ALERT_SALES_LIMIT = 5_000_000
export const MERCHANT_ALERT_TRANSACTION_LIMIT = 10

export function isMerchantAlert(
  merchant: Pick<Merchant, "edcStatus" | "monthlySales" | "monthlyTransactions">,
): boolean {
  if (merchant.edcStatus !== "ACTIVE") return false
  return (
    merchant.monthlySales < MERCHANT_ALERT_SALES_LIMIT ||
    merchant.monthlyTransactions < MERCHANT_ALERT_TRANSACTION_LIMIT
  )
}
