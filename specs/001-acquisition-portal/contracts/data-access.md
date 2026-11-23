# Contract: Internal Data Access and Domain Functions

**Feature**: [../spec.md](../spec.md) | **Data model**: [../data-model.md](../data-model.md)

This prototype has no HTTP API. The contract below defines the boundary between UI components
and the in-memory store, and between UI and pure domain functions. Components MUST use these
functions and actions. They MUST NOT read or write localStorage directly.

## Store actions (`src/data/store.ts`)

| Action | Input | Output | Errors |
|---|---|---|---|
| `lookupStaff(nip)` | `string` | `StaffMember \| null` | None. Returns null when not found. |
| `submitAcquisition(input)` | `NewAcquisition` (type-specific fields) | `AcquisitionSubmission` | `NIP_NOT_FOUND`, `VALIDATION_FAILED` (with field errors) |
| `setNbdsResult(submissionId, result)` | id, `NbdsResult` | updated submission | `NOT_FOUND` |
| `transitionStatus(submissionId, target, options)` | id, target status, `{ note?, confirmNonNewCif? }` | updated submission | `INVALID_TRANSITION`, `NOTE_REQUIRED`, `CONFIRMATION_REQUIRED` |
| `advancePipelineStage(entryId)` | id | updated entry | `INVALID_TRANSITION`, `NOT_FOUND` |
| `addChecklistDone(entryId, itemId, done)` | ids, boolean | updated entry | `NOT_FOUND` |
| `addVisitRecord(entryId, record)` | id, `{ date, note, picNip }` | updated entry | `NOT_FOUND`, `VALIDATION_FAILED` |
| `batchMarkVisitsDone(entryIds, today)` | ids, date | `{ updated: number, skipped: number }` | None. Skipped items are reported, not thrown. |
| `reset()` | none | void | None. Reseeds all data. |

All actions return new objects. Subscribers are notified after each successful write. Every write
is persisted to localStorage under one versioned key (see `research.md` section 12).

## Domain functions (`src/domain/`, pure, no React)

| Module | Function | Contract |
|---|---|---|
| `nip.ts` | `isValidNipFormat(value)` | True only for exactly 18 digits. |
| `currency.ts` | `parseRupiah(input)` | Returns integer Rupiah. Rejects letters. Rounds decimals. |
| `currency.ts` | `formatRupiah(amount)` | Returns `Rp 1.500.000` format. |
| `acquisition-status.ts` | `canTransition(from, to)` | Returns boolean and reason. |
| `acquisition-status.ts` | `isGmmEligible(nbdsResult)` | True only for `NEW_CIF`. |
| `merchant-alert.ts` | `isMerchantAlert(merchant)` | Implements the derived alert rule. Thresholds are exported constants. |
| `pipeline.ts` | `selectBatchClosable(entries, today)` | Returns entries with `SCHEDULED` status on the given date. |
| `route.ts` | `planVisitRoute(start, stops)` | Returns ordered stops and total kilometers. Deterministic for equal inputs. |
| `simulators.ts` | `estimateDepositReturn(amount, tenorMonths, annualRate)` | Returns estimated return in Rupiah. |
| `simulators.ts` | `compareEdcFeeSchemes(monthlySales, current, proposed)` | Returns both annual fee totals and the difference. |

Each function is deterministic. Each is documented with its inputs and outputs in its module.
