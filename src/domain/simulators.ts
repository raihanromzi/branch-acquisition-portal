/** Simple interest estimate, returned in whole Rupiah. */
export function estimateDepositReturn(
  amount: number,
  tenorMonths: number,
  annualRate: number,
): number {
  if (amount <= 0 || tenorMonths <= 0 || annualRate < 0) return 0
  return Math.round(amount * (annualRate / 100) * (tenorMonths / 12))
}

export interface FeeScheme {
  name: string
  mdrPercent: number
}

export interface FeeComparison {
  currentAnnual: number
  proposedAnnual: number
  difference: number
}

export function compareEdcFeeSchemes(
  monthlySales: number,
  current: FeeScheme,
  proposed: FeeScheme,
): FeeComparison {
  const currentAnnual = Math.round(monthlySales * 12 * (current.mdrPercent / 100))
  const proposedAnnual = Math.round(monthlySales * 12 * (proposed.mdrPercent / 100))
  return {
    currentAnnual,
    proposedAnnual,
    difference: currentAnnual - proposedAnnual,
  }
}
