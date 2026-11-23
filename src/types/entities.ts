export type StaffRole =
  | "INDIVIDUAL_SALES"
  | "PAYROLL_SALES"
  | "PRIORITY_SALES"
  | "MERCHANT_OFFICER"

export interface StaffMember {
  nip: string
  name: string
  role: StaffRole
  branchId: string
}

export interface Branch {
  id: string
  name: string
  latitude: number
  longitude: number
}

export type ProductSegment =
  | "RETAIL"
  | "BUSINESS_CURRENT"
  | "CORPORATE_PAYROLL"
  | "PRIORITY_WEALTH"
  | "MERCHANT_EDC"

export type AcquisitionType =
  | "INDIVIDUAL"
  | "BUSINESS"
  | "PAYROLL"
  | "PRIORITY"
  | "MERCHANT_OTBR"

export interface Product {
  code: string
  name: string
  segment: ProductSegment
  acquisitionType: AcquisitionType
  description: string
}

export type NbdsResult = "NEW_CIF" | "EXISTING_CIF" | "UNVERIFIED"

export type AcquisitionStatus =
  | "WAITING_APPROVAL"
  | "ACCEPTED_GMM"
  | "REJECTED"
  | "COMPLETED"

export interface AcquisitionSubmission {
  id: string
  submittedAt: string
  nip: string
  staffName: string
  branchId: string
  acquisitionType: AcquisitionType
  customerName: string
  cif?: string
  productCode: string
  productName: string
  amount?: number
  estimatedEmployees?: number
  estimatedAum?: number
  edcType?: string
  estimatedSalesVolume?: number
  visitDate: string
  nbdsResult: NbdsResult
  status: AcquisitionStatus
  note?: string
  acceptedWithoutNewCif: boolean
}

export type PipelineCategory = "PAYROLL" | "PRIORITY" | "BUSINESS" | "MERCHANT"

export type PipelineStage =
  | "PROSPECTING"
  | "PITCHING"
  | "DOCUMENTS"
  | "MOU"
  | "ACQUISITION"

export type VisitStatus = "SCHEDULED" | "DONE" | "RESCHEDULED"

export interface ChecklistItem {
  id: string
  description: string
  done: boolean
}

export interface VisitRecord {
  date: string
  note: string
  picNip: string
}

export interface BranchPipelineEntry {
  id: string
  branchId: string
  customerName: string
  category: PipelineCategory
  stage: PipelineStage
  picNip: string
  scheduledDate: string
  visitStatus: VisitStatus
  checklist: ChecklistItem[]
  visitHistory: VisitRecord[]
}

export type EdcStatus = "ACTIVE" | "INACTIVE" | "QRIS_ONLY"

export interface Merchant {
  id: string
  storeName: string
  owner: string
  cif: string
  area: string
  branchId: string
  latitude: number
  longitude: number
  edcStatus: EdcStatus
  monthlySales: number
  monthlyTransactions: number
  mdrPercent: number
}

export interface BranchKpi {
  branchId: string
  period: string
  wholesaleUnits: number
  savingsPortfolio: number
  merchantGrowthPercent: number
  livinMerchantActivity: number
  edcPenetrationPercent: number
  targetAchievementPercent: number
}
