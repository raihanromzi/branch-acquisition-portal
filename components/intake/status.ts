export const STATUS_LABEL = {
  WAITING_APPROVAL: "Waiting for Approval",
  ACCEPTED_GMM: "Accepted (GMM)",
  REJECTED: "Rejected (NIP/CIF Error)",
  COMPLETED: "Completed",
} as const

export const NBDS_LABEL = {
  NEW_CIF: "New CIF",
  EXISTING_CIF: "Existing CIF",
  UNVERIFIED: "Unverified",
} as const

export const TYPE_LABEL = {
  INDIVIDUAL: "Individual",
  BUSINESS: "Business",
  PAYROLL: "Payroll",
  PRIORITY: "Priority",
  MERCHANT_OTBR: "Merchant (OTBR)",
} as const
