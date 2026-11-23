import { NextResponse } from "next/server"

import { fetchSubmissionsDb, insertSubmissionDb } from "@/src/db"
import { products } from "@/src/data/seed/products"
import { staff } from "@/src/data/seed/staff"
import { validateIntake } from "@/src/domain/intake-schema"
import { classifyNbds } from "@/src/domain/nbds"
import { isValidNipFormat } from "@/src/domain/nip"
import type { AcquisitionSubmission } from "@/src/types/entities"

export async function GET() {
  try {
    const submissions = await fetchSubmissionsDb()
    return NextResponse.json({ ok: true, submissions })
  } catch (err) {
    console.error("Failed to fetch submissions:", err)
    return NextResponse.json({ ok: true, submissions: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const nip = String(body.nip ?? "").trim()

    if (!isValidNipFormat(nip)) {
      return NextResponse.json(
        { ok: false, error: "NIP_NOT_FOUND", fieldErrors: { nip: "NIP must be exactly 18 digits" } },
        { status: 400 },
      )
    }

    const staffMember = staff.find((s) => s.nip === nip)
    if (!staffMember) {
      return NextResponse.json(
        { ok: false, error: "NIP_NOT_FOUND", fieldErrors: { nip: "NIP is not recognized in staff master" } },
        { status: 400 },
      )
    }

    const validated = validateIntake(body)
    if (!validated.success) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_FAILED", fieldErrors: validated.fieldErrors },
        { status: 400 },
      )
    }

    const product = products.find((p) => p.code === validated.data.productCode)
    if (!product || product.acquisitionType !== validated.data.acquisitionType) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_FAILED",
          fieldErrors: { productCode: "Select a valid product for this type" },
        },
        { status: 400 },
      )
    }

    const { nip: _unusedNip, ...fields } = validated.data
    void _unusedNip
    const submission: AcquisitionSubmission = {
      id: `SUB-${Date.now().toString(36).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
      nip: staffMember.nip,
      staffName: staffMember.name,
      branchId: staffMember.branchId,
      productName: product.name,
      nbdsResult: classifyNbds(fields.cif),
      status: "WAITING_APPROVAL",
      acceptedWithoutNewCif: false,
      ...fields,
    }

    await insertSubmissionDb(submission)
    return NextResponse.json({ ok: true, submission })
  } catch (err) {
    console.error("Submission creation failed:", err)
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", message: "Failed to process submission" },
      { status: 500 },
    )
  }
}
