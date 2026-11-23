# Data Model: Branch Acquisition & Monitoring Portal

**Feature**: [spec.md](spec.md) | **Research**: [research.md](research.md)

Entities come from spec "Key Entities". Field names follow `docs/specs.md` section 5, with the
spec's English terms in the descriptions. All money values are integers in Rupiah.

## Entities

### StaffMember (Sales Officer)

| Field | Type | Rules |
|---|---|---|
| `nip` | string | Exactly 18 digits. Unique. Primary key. |
| `name` | string | Required. |
| `role` | enum | `INDIVIDUAL_SALES` \| `PAYROLL_SALES` \| `PRIORITY_SALES` \| `MERCHANT_OFFICER` |
| `branchId` | string | Must reference an existing `Branch.id`. |

### Branch

| Field | Type | Rules |
|---|---|---|
| `id` | string | Unique. Example: `KC-JKT-THAMRIN`. |
| `name` | string | Example: `KC Jakarta Thamrin`. |
| `latitude`, `longitude` | number | Office location, used as the route start. |

### Product

| Field | Type | Rules |
|---|---|---|
| `code` | string | Unique. Fixed Bank Mandiri product code list. |
| `name` | string | Required. |
| `segment` | enum | `RETAIL` \| `BUSINESS_CURRENT` \| `CORPORATE_PAYROLL` \| `PRIORITY_WEALTH` \| `MERCHANT_EDC` |
| `acquisitionType` | enum | Links the product to an intake type (see AcquisitionType). |

### AcquisitionSubmission

| Field | Type | Rules |
|---|---|---|
| `id` | string | Unique. Generated at creation. |
| `submittedAt` | ISO datetime | Set at creation. |
| `nip` | string | Must exist in StaffMember at submission. |
| `staffName` | string | Copied from StaffMember at submission (snapshot). |
| `branchId` | string | Copied from StaffMember at submission. |
| `acquisitionType` | enum | `INDIVIDUAL` \| `BUSINESS` \| `PAYROLL` \| `PRIORITY` \| `MERCHANT_OTBR` |
| `customerName` | string | Required. |
| `cif` | string? | Optional. Required before NBDS check can be `NEW_CIF` or `EXISTING_CIF`. |
| `productCode` | string | Must exist in Product. |
| `productName` | string | Snapshot from Product. |
| `amount` | integer? | Rupiah. Required for INDIVIDUAL and BUSINESS. |
| `estimatedEmployees` | integer? | PAYROLL only. Positive. |
| `estimatedAum` | integer? | PRIORITY only. Minimum Rp 500,000,000 (see note below). |
| `edcType` | string? | MERCHANT_OTBR only. |
| `estimatedSalesVolume` | integer? | MERCHANT_OTBR only. |
| `visitDate` | date | Must be a valid calendar date (FR-007). |
| `nbdsResult` | enum | `NEW_CIF` \| `EXISTING_CIF` \| `UNVERIFIED`. Default `UNVERIFIED` until checked. |
| `status` | enum | See state machine below. Default `WAITING_APPROVAL`. |
| `note` | string? | Required when status is `REJECTED`. |
| `acceptedWithoutNewCif` | boolean | True when the approver confirmed acceptance for a non-New CIF (FR-012). |

**Open question on AUM threshold**: `docs/specs.md` gives the minimum AUM for priority segments
as "Rp 1 Miliar/Rp 500 Juta" without saying which applies when. The prototype enforces Rp
500,000,000 as the floor until the product owner confirms. Confirm during `/speckit-clarify`.

### AcquisitionStatus state machine

```text
WAITING_APPROVAL ──approve (New CIF)──────────────▶ ACCEPTED_GMM
WAITING_APPROVAL ──approve (Existing/Unverified,  ▶ ACCEPTED_GMM
                    confirmation flag required)
WAITING_APPROVAL ──reject (note required)─────────▶ REJECTED
ACCEPTED_GMM     ──complete──────────────────────▶ COMPLETED
REJECTED         ──resubmit (new record)─────────▶ (new WAITING_APPROVAL record)
```

Invalid transitions are rejected by `src/domain/acquisition-status.ts`. `COMPLETED` is terminal.

### BranchPipelineEntry

| Field | Type | Rules |
|---|---|---|
| `id` | string | Unique. |
| `branchId` | string | Must reference Branch. |
| `customerName` | string | Required. |
| `category` | enum | `PAYROLL` \| `PRIORITY` \| `BUSINESS` \| `MERCHANT` |
| `stage` | enum | `PROSPECTING` → `PITCHING` → `DOCUMENTS` → `MOU` → `ACQUISITION`. Forward moves only. |
| `picNip` | string | Must reference StaffMember. |
| `scheduledDate` | date | Visit date. |
| `visitStatus` | enum | `SCHEDULED` \| `DONE` \| `RESCHEDULED`. |
| `checklist` | ChecklistItem[] | Each item: `id`, `description`, `done`. |
| `visitHistory` | VisitRecord[] | Each record: `date`, `note`, `picNip`. Append-only. |

**Stage transitions**: forward by one step at a time. Moving back is not allowed in the prototype.

**Batch closing rule**: A batch action sets `visitStatus` to `DONE` for selected entries where
`scheduledDate` equals the current date and `visitStatus` is `SCHEDULED`. Rescheduled entries are
excluded (spec edge case).

### Merchant

| Field | Type | Rules |
|---|---|---|
| `id` | string | Unique. |
| `storeName` | string | Required. |
| `owner` | string | Required. |
| `cif` | string | Required. |
| `area` | string | Free text. |
| `branchId` | string | Must reference Branch. |
| `latitude`, `longitude` | number | Within the branch area (spec US4 scenario 1). |
| `edcStatus` | enum | `ACTIVE` \| `INACTIVE` \| `QRIS_ONLY` |
| `monthlySales` | integer | Rupiah. Non-negative. |
| `monthlyTransactions` | integer | Non-negative. |
| `mdrPercent` | number | Current MDR scheme. |
| `isAlert` | derived boolean | True when `edcStatus = ACTIVE` AND (`monthlySales < 5_000_000` OR `monthlyTransactions < 10`). Derived, never stored. |

### BranchKpi

| Field | Type | Rules |
|---|---|---|
| `branchId` | string | Primary key with `period`. |
| `period` | string | `YYYY-MM`. |
| `wholesaleUnits` | integer | Unit Wholesale (CB). |
| `savingsPortfolio` | integer | Rupiah. |
| `merchantGrowthPercent` | number | |
| `livinMerchantActivity` | integer | LVM activity count. |
| `edcPenetrationPercent` | number | |
| `targetAchievementPercent` | number | Used in the executive summary. |

## Relationships

- Branch 1 → many StaffMember, Merchant, BranchPipelineEntry, BranchKpi
- StaffMember 1 → many AcquisitionSubmission (by `nip`)
- Product 1 → many AcquisitionSubmission (by `productCode`)
- StaffMember 1 → many BranchPipelineEntry (as PIC)

## Validation summary

| Rule | Source |
|---|---|
| NIP must exist in StaffMember | FR-003, FR-004 |
| Amounts stored as integers, displayed as Rp | FR-005 |
| Product code from fixed list | FR-006 |
| Valid calendar dates only | FR-007 |
| Rejection requires note | FR-011 |
| Existing or Unverified acceptance requires confirmation | FR-012 |
| Alert rule with exact thresholds | FR-019, spec edge cases |
