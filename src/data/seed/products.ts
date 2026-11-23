import type { Product } from "@/src/types/entities"

export const products: Product[] = [
  { code: "SAV-TAB-001", name: "Tabungan Mandiri", segment: "RETAIL", acquisitionType: "INDIVIDUAL", description: "Savings account for individual customers." },
  { code: "SAV-DEP-002", name: "Deposito Mandiri", segment: "RETAIL", acquisitionType: "INDIVIDUAL", description: "Time deposit with fixed tenor." },
  { code: "BIZ-CUR-001", name: "Giro Bisnis", segment: "BUSINESS_CURRENT", acquisitionType: "BUSINESS", description: "Current account for business customers." },
  { code: "BIZ-LOAN-002", name: "Kredit Modal Kerja", segment: "BUSINESS_CURRENT", acquisitionType: "BUSINESS", description: "Working capital facility." },
  { code: "PAY-CORP-001", name: "Payroll Korporasi", segment: "CORPORATE_PAYROLL", acquisitionType: "PAYROLL", description: "Corporate payroll package." },
  { code: "PAY-SME-002", name: "Payroll UKM", segment: "CORPORATE_PAYROLL", acquisitionType: "PAYROLL", description: "Payroll package for small companies." },
  { code: "PRI-WEALTH-001", name: "Mandiri Prioritas", segment: "PRIORITY_WEALTH", acquisitionType: "PRIORITY", description: "Priority banking relationship." },
  { code: "PRI-AUM-002", name: "Wealth Management", segment: "PRIORITY_WEALTH", acquisitionType: "PRIORITY", description: "Managed wealth portfolio." },
  { code: "EDC-STD-001", name: "EDC Standard", segment: "MERCHANT_EDC", acquisitionType: "MERCHANT_OTBR", description: "Countertop EDC terminal." },
  { code: "EDC-QR-002", name: "Livin' Merchant QR", segment: "MERCHANT_EDC", acquisitionType: "MERCHANT_OTBR", description: "QR acceptance for merchants." },
]
