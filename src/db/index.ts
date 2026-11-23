import { neon } from "@neondatabase/serverless"

import type { AcquisitionSubmission } from "@/src/types/entities"

export function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) return null
  return neon(url)
}

let tableEnsured = false

export async function ensureSubmissionsTable() {
  if (tableEnsured) return
  const sql = getDb()
  if (!sql) return
  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      nip TEXT NOT NULL,
      staff_name TEXT NOT NULL,
      branch_id TEXT NOT NULL,
      acquisition_type TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      cif TEXT,
      product_code TEXT NOT NULL,
      product_name TEXT NOT NULL,
      amount BIGINT,
      estimated_employees INT,
      estimated_aum BIGINT,
      edc_type TEXT,
      estimated_sales_volume BIGINT,
      visit_date DATE NOT NULL,
      nbds_result TEXT NOT NULL,
      status TEXT NOT NULL,
      note TEXT,
      accepted_without_new_cif BOOLEAN NOT NULL DEFAULT FALSE
    );
  `
  tableEnsured = true
}

export async function insertSubmissionDb(sub: AcquisitionSubmission): Promise<boolean> {
  const sql = getDb()
  if (!sql) return false
  await ensureSubmissionsTable()
  await sql`
    INSERT INTO submissions (
      id, submitted_at, nip, staff_name, branch_id, acquisition_type,
      customer_name, cif, product_code, productName, amount,
      estimated_employees, estimated_aum, edc_type, estimated_sales_volume,
      visit_date, nbds_result, status, note, accepted_without_new_cif
    ) VALUES (
      ${sub.id}, ${sub.submittedAt}, ${sub.nip}, ${sub.staffName}, ${sub.branchId}, ${sub.acquisitionType},
      ${sub.customerName}, ${sub.cif ?? null}, ${sub.productCode}, ${sub.productName}, ${sub.amount ?? null},
      ${sub.estimatedEmployees ?? null}, ${sub.estimatedAum ?? null}, ${sub.edcType ?? null}, ${sub.estimatedSalesVolume ?? null},
      ${sub.visitDate}, ${sub.nbdsResult}, ${sub.status}, ${sub.note ?? null}, ${sub.acceptedWithoutNewCif}
    )
    ON CONFLICT (id) DO NOTHING;
  `
  return true
}

export async function fetchSubmissionsDb(): Promise<AcquisitionSubmission[]> {
  const sql = getDb()
  if (!sql) return []
  await ensureSubmissionsTable()
  const rows = await sql`
    SELECT
      id,
      submitted_at as "submittedAt",
      nip,
      staff_name as "staffName",
      branch_id as "branchId",
      acquisition_type as "acquisitionType",
      customer_name as "customerName",
      cif,
      product_code as "productCode",
      product_name as "productName",
      amount,
      estimated_employees as "estimatedEmployees",
      estimated_aum as "estimatedAum",
      edc_type as "edcType",
      estimated_sales_volume as "estimatedSalesVolume",
      TO_CHAR(visit_date, 'YYYY-MM-DD') as "visitDate",
      nbds_result as "nbdsResult",
      status,
      note,
      accepted_without_new_cif as "acceptedWithoutNewCif"
    FROM submissions
    ORDER BY submitted_at DESC;
  `
  return rows.map((r) => ({
    id: String(r.id),
    submittedAt: r.submittedAt instanceof Date ? r.submittedAt.toISOString() : String(r.submittedAt),
    nip: String(r.nip),
    staffName: String(r.staffName),
    branchId: String(r.branchId),
    acquisitionType: r.acquisitionType as AcquisitionSubmission["acquisitionType"],
    customerName: String(r.customerName),
    cif: r.cif ? String(r.cif) : undefined,
    productCode: String(r.productCode),
    productName: String(r.productName),
    amount: r.amount !== null && r.amount !== undefined ? Number(r.amount) : undefined,
    estimatedEmployees: r.estimatedEmployees !== null && r.estimatedEmployees !== undefined ? Number(r.estimatedEmployees) : undefined,
    estimatedAum: r.estimatedAum !== null && r.estimatedAum !== undefined ? Number(r.estimatedAum) : undefined,
    edcType: r.edcType ? String(r.edcType) : undefined,
    estimatedSalesVolume: r.estimatedSalesVolume !== null && r.estimatedSalesVolume !== undefined ? Number(r.estimatedSalesVolume) : undefined,
    visitDate: String(r.visitDate),
    nbdsResult: r.nbdsResult as AcquisitionSubmission["nbdsResult"],
    status: r.status as AcquisitionSubmission["status"],
    note: r.note ? String(r.note) : undefined,
    acceptedWithoutNewCif: Boolean(r.acceptedWithoutNewCif),
  }))
}
