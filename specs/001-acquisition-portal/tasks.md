# Tasks: Branch Acquisition & Monitoring Portal

**Input**: Design documents from `/specs/001-acquisition-portal/`

**Prerequisites**: [plan.md](plan.md) (required), [spec.md](spec.md) (required),
[research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/),
[quickstart.md](quickstart.md)

**Tests**: None. Constitution Principle III forbids unit, component, and snapshot tests in the
standard workflow. No test tasks are generated. Verification is by the static-check and
manual-scenario tasks in the final phase.

**Organization**: Tasks are grouped by user story so each story can be implemented and checked
on its own.

**Field citations**: Constrained fields cite `data-model.md` as `Entity.field`. Tasks add no
constraints beyond the canonical definitions.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1 to US6), required in story phases only
- Paths follow the structure in [plan.md](plan.md)

## Path Conventions

Single Next.js App Router project at the repository root. UI in `components/`, domain rules in
`src/domain/`, data in `src/data/`, exports in `src/exports/`, types in `src/types/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the project, install the UI system, and set up the tooling.

- [X] T001 Create the Next.js 14+ App Router project with strict TypeScript in `package.json`, `tsconfig.json`, and `next.config.ts` at the repository root
- [X] T002 Install and configure Tailwind CSS and initialize shadcn/ui, creating `components.json` and the theme tokens in `app/globals.css`
- [X] T003 [P] Add the shadcn/ui components button, input, label, select, card, tabs, table, badge, dialog, sheet, form, textarea, and sonner into `components/ui/` via the shadcn CLI
- [X] T004 [P] Install runtime dependencies: react-hook-form, zod, @hookform/resolvers, lucide-react, leaflet, react-leaflet, leaflet.markercluster, @types/leaflet, and xlsx, recorded in `package.json`
- [X] T005 [P] Configure ESLint and Prettier in `eslint.config.mjs` and `.prettierrc`
- [X] T006 [P] Add `node_modules/`, `.next/`, and `out/` to `.gitignore` at the repository root, keeping existing entries
- [X] T007 Create the directory layout from plan.md: `src/domain/`, `src/data/seed/`, `src/exports/`, `src/types/`, and `components/{dashboard,intake,approval,pipeline,monitoring,catalog,reports}/`

**Checkpoint**: Project builds an empty dashboard page with shadcn/ui available.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, pure domain helpers, seed data, store, and the dashboard shell. No
user story can start until this phase is complete.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T008 Define all shared entity types and enums in `src/types/entities.ts` per `data-model.md` (StaffMember, Branch, Product, AcquisitionSubmission, AcquisitionStatus, BranchPipelineEntry, Merchant, BranchKpi)
- [X] T009 [P] Implement `parseRupiah` (integer rounding, rejects letters) and `formatRupiah` (`Rp 1.500.000`) in `src/domain/currency.ts`, following `data-model.md` `AcquisitionSubmission.amount`
- [X] T010 [P] Implement `isValidNipFormat` in `src/domain/nip.ts`, following `data-model.md` `StaffMember.nip` (exactly 18 digits)
- [X] T011 [P] Implement `isMerchantAlert` with exported named threshold constants (Rp 5,000,000 and 10 transactions) in `src/domain/merchant-alert.ts`, following `data-model.md` `Merchant.isAlert` and `research.md` section 7
- [X] T012 [P] Create seed modules `src/data/seed/branches.ts`, `src/data/seed/staff.ts`, and `src/data/seed/products.ts` with realistic fictional records for `Branch`, `StaffMember.nip`, and `Product.code`
- [X] T013 [P] Create seed modules `src/data/seed/submissions.ts`, `src/data/seed/pipeline.ts`, `src/data/seed/merchants.ts`, and `src/data/seed/kpi.ts` with fictional records for `AcquisitionSubmission`, `BranchPipelineEntry`, `Merchant`, and `BranchKpi`
- [X] T014 Implement the in-memory store with actions `lookupStaff`, `submitAcquisition`, `setNbdsResult`, `transitionStatus`, `advancePipelineStage`, `addChecklistDone`, `addVisitRecord`, `batchMarkVisitsDone`, and `reset` in `src/data/store.ts`, per `contracts/data-access.md`
- [X] T015 Implement versioned localStorage sync (one key, reseed on version mismatch, try/catch on every read and write) in `src/data/persistence.ts`, per `research.md` section 12
- [X] T016 Implement a store subscription hook in `src/data/use-store.ts` that notifies components after each write
- [X] T017 Build the unified dashboard shell with open-tab state and a tab bar in `app/layout.tsx`, `app/page.tsx`, and `components/dashboard/tab-bar.tsx`, with open tabs mirrored to localStorage
- [X] T018 Add the reset action to the dashboard header in `components/dashboard/header.tsx`, calling `reset()` from `src/data/store.ts`

**Checkpoint**: Foundation ready. Store, seed data, and dashboard shell work. User stories can
now start in parallel if staffed.

---

## Phase 3: User Story 1 - Submit an acquisition through one dynamic intake form (Priority: P1) 🎯 MVP

**Goal**: One intake form with type-based fields, NIP lookup, Rupiah masking, product dropdown,
and submission to the approval queue.

**Independent Test**: Submit one acquisition of each of the five types. Valid submissions appear
in the queue as "Waiting for Approval". Invalid NIPs are blocked with a clear message.

- [X] T019 [P] [US1] Implement per-type zod schemas for the five acquisition types in `src/domain/intake-schema.ts`, following `data-model.md` `AcquisitionSubmission.acquisitionType`, `estimatedEmployees`, `estimatedAum` (min Rp 500,000,000 pending confirmation per data-model.md open question), `edcType`, and `estimatedSalesVolume`
- [X] T020 [P] [US1] Implement `visitDate` validation as a valid calendar date within the allowed range in `src/domain/date-rules.ts`, following `data-model.md` `AcquisitionSubmission.visitDate`
- [X] T021 [US1] Extend `submitAcquisition` in `src/data/store.ts` to run the schema and NIP lookup, copy `staffName` and `branchId` from StaffMember, set `status` to `WAITING_APPROVAL`, and return field errors, per `contracts/data-access.md`
- [X] T022 [US1] Build the intake form container with the type selector and only the fields for the chosen type in `components/intake/intake-form.tsx`
- [X] T023 [US1] Build the NIP field with live lookup that fills and locks name and branch in `components/intake/nip-field.tsx`, following `data-model.md` `StaffMember.nip`
- [X] T024 [US1] Build the Rupiah input with masking on blur in `components/intake/rupiah-input.tsx`, following `data-model.md` `AcquisitionSubmission.amount`
- [X] T025 [US1] Build the product dropdown from the fixed code list in `components/intake/product-select.tsx`, following `data-model.md` `Product.code`
- [X] T026 [US1] Build the date field with calendar validation in `components/intake/date-field.tsx`, following `data-model.md` `AcquisitionSubmission.visitDate`
- [X] T027 [US1] Build the Intake tab that combines the form and shows success or error messages in `components/intake/intake-tab.tsx`, and register it in `components/dashboard/tab-bar.tsx`

**Checkpoint**: User Story 1 works on its own. Submissions reach the store with status
"Waiting for Approval".

---

## Phase 4: User Story 2 - Track and approve acquisitions with a visible status (Priority: P2)

**Goal**: Approval queue, NBDS check indicator, status transitions with note and confirmation rules.

**Independent Test**: Accept a New CIF submission (becomes "Accepted (GMM)"). Attempt to accept an
Existing CIF submission (warning and confirmation). Reject without a note (blocked). Reject with
a note (accepted). Complete an accepted submission.

- [X] T028 [P] [US2] Implement the status state machine with `canTransition` and `isGmmEligible` in `src/domain/acquisition-status.ts`, following `data-model.md` `AcquisitionStatus state machine` and `AcquisitionSubmission.acceptedWithoutNewCif`
- [X] T029 [P] [US2] Implement the simulated NBDS classification (`NEW_CIF`, `EXISTING_CIF`, `UNVERIFIED`) from seed data in `src/domain/nbds.ts`, following `data-model.md` `AcquisitionSubmission.nbdsResult`
- [X] T030 [US2] Implement `transitionStatus` and `setNbdsResult` in `src/data/store.ts`, enforcing note required for `REJECTED` (`AcquisitionSubmission.note`) and confirmation for non-New CIF accepts (`AcquisitionSubmission.acceptedWithoutNewCif`), per `contracts/data-access.md`
- [X] T031 [US2] Build the approval queue with status filters in `components/approval/approval-queue.tsx`
- [X] T032 [US2] Build status action controls with a note dialog for rejection and a confirmation dialog for non-New CIF accepts in `components/approval/status-actions.tsx`, following `data-model.md` `AcquisitionSubmission.note`
- [X] T033 [US2] Build the NBDS log indicator showing New or Existing CIF in `components/approval/nbds-log.tsx`
- [X] T034 [US2] Build the Approval tab in `components/approval/approval-tab.tsx` and register it in `components/dashboard/tab-bar.tsx`

**Checkpoint**: User Stories 1 and 2 both work. Submissions can be approved, rejected, and completed.

---

## Phase 5: User Story 3 - Manage branch pipeline and close the day in one batch (Priority: P3)

**Goal**: Pipeline filtered by branch and PIC, stage movement, checklists, visit history, and
batch closing.

**Independent Test**: Filter by branch. Advance one entry by one stage. Add a visit note. Mark two
of three of today's visits as Done in one batch.

- [X] T035 [P] [US3] Implement stage order, forward-only `advanceStage`, and `selectBatchClosable` in `src/domain/pipeline.ts`, following `data-model.md` `BranchPipelineEntry.stage`, `scheduledDate`, and `visitStatus`
- [X] T036 [US3] Implement `advancePipelineStage`, `addChecklistDone`, `addVisitRecord`, and `batchMarkVisitsDone` in `src/data/store.ts`, per `contracts/data-access.md`; visit notes are append-only (`BranchPipelineEntry.visitHistory`)
- [X] T037 [US3] Build the pipeline matrix with branch and PIC filters in `components/pipeline/pipeline-matrix.tsx`, following `data-model.md` `BranchPipelineEntry.picNip`
- [X] T038 [US3] Build the entry detail view with stage control, checklist, and visit history form in `components/pipeline/entry-detail.tsx`, following `data-model.md` `BranchPipelineEntry.checklist` and `visitHistory`
- [X] T039 [US3] Build the batch closing panel with select-all and one-click "Mark Visit Done" in `components/pipeline/batch-closing-panel.tsx`, using `selectBatchClosable`
- [X] T040 [US3] Build the Pipeline tab in `components/pipeline/pipeline-tab.tsx` and register it in `components/dashboard/tab-bar.tsx`

**Checkpoint**: User Story 3 works on its own.

---

## Phase 6: User Story 4 - Monitor branch performance and merchants on a map (Priority: P4)

**Goal**: KPI cards, merchant map with clustering and alerts, merchant detail drawer, and visit route.

**Independent Test**: KPIs match seed data. Map clusters and alert markers match the rule. The
route for three alert merchants starts at the branch and lists all three in order.

- [X] T041 [P] [US4] Implement haversine distance and nearest-neighbor `planVisitRoute` returning ordered stops and total kilometers in `src/domain/route.ts`, per `contracts/data-access.md`
- [X] T042 [P] [US4] Build the KPI cards for wholesale units, savings portfolio, merchant growth, Livin' Merchant activity, and EDC penetration in `components/monitoring/kpi-cards.tsx`, following `data-model.md` `BranchKpi`
- [X] T043 [US4] Build the merchant map with marker clustering, a distinct alert icon, and client-only loading (`ssr: false`) in `components/monitoring/merchant-map.tsx`, following `data-model.md` `Merchant.latitude`, `longitude`, and `isAlert`; disable the alert blink under `prefers-reduced-motion`
- [X] T044 [US4] Build the merchant detail drawer with CIF, monthly sales, MDR scheme, and "Schedule Visit" action in `components/monitoring/merchant-drawer.tsx`, following `data-model.md` `Merchant.cif`, `monthlySales`, and `mdrPercent`
- [X] T045 [US4] Build the route panel that takes selected alert merchants and shows the ordered route in `components/monitoring/route-panel.tsx`, using `planVisitRoute` from `src/domain/route.ts`; disable the action when no merchants are in range
- [X] T046 [US4] Build the Monitoring tab in `components/monitoring/monitoring-tab.tsx` and register it in `components/dashboard/tab-bar.tsx`

**Checkpoint**: User Story 4 works on its own.

---

## Phase 7: User Story 5 - Present products with a catalog and simulators (Priority: P5)

**Goal**: Product catalog by segment, two simulators, and "Apply This Product" pre-fill into intake.

**Independent Test**: Run both simulators with known inputs. Click "Apply This Product" and confirm
the intake form opens with the matching type and product code.

- [X] T047 [P] [US5] Implement `estimateDepositReturn` and `compareEdcFeeSchemes` as pure functions in `src/domain/simulators.ts`, per `contracts/data-access.md`
- [X] T048 [US5] Add a `setIntakeDraft` action in `src/data/store.ts` that stores a product's type and code for the intake form to read, using `data-model.md` `Product.acquisitionType` and `Product.code`
- [X] T049 [US5] Build the product card with the "Apply This Product" action in `components/catalog/product-card.tsx`
- [X] T050 [US5] Build the deposit simulator with immediate recalculation in `components/catalog/deposit-simulator.tsx`
- [X] T051 [US5] Build the EDC fee simulator with side-by-side comparison in `components/catalog/edc-fee-simulator.tsx`
- [X] T052 [US5] Build the Catalog tab grouped by the five segments in `components/catalog/catalog-tab.tsx` and register it in `components/dashboard/tab-bar.tsx`
- [X] T053 [US5] Make the intake form read the pending draft from `setIntakeDraft` and pre-fill type and product code in `components/intake/intake-form.tsx`

**Checkpoint**: User Story 5 works on its own. Pre-fill from the catalog reaches the intake form.

---

## Phase 8: User Story 6 - Export an executive one-page summary and branch data (Priority: P6)

**Goal**: One-page A4 executive summary via print CSS, and a three-sheet Excel export.

**Independent Test**: Print preview of the summary shows one A4 page with no clipped content. The
exported workbook has three named sheets with the columns in `contracts/exports.md`.

- [X] T054 [P] [US6] Implement the executive summary view model with top-five truncation and omitted counts in `src/exports/summary-model.ts`, per `contracts/exports.md`
- [X] T055 [US6] Build the executive summary component and add `@page { size: A4; margin: 12mm }` print styles in `components/reports/executive-summary.tsx` and `app/globals.css`
- [X] T056 [US6] Implement the three-sheet workbook builder (`Branch Recap`, `Pipeline`, `Merchant/EDC`) with empty-data header rows in `src/exports/excel.ts`, per `contracts/exports.md`
- [X] T057 [US6] Build the export actions (print summary, download `.xlsx`) in `components/reports/export-actions.tsx`
- [X] T058 [US6] Build the Reports tab in `components/reports/reports-tab.tsx` and register it in `components/dashboard/tab-bar.tsx`

**Checkpoint**: All six user stories work on their own.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Static checks, manual scenario validation, and constitution compliance.

- [X] T059 Run `npx tsc --noEmit` and fix all errors across `src/` and `components/`
- [X] T060 [P] Run `npm run lint` and fix all reported issues
- [X] T061 Run `npm run build` and fix any build failures, including the client-only map import
- [X] T062 Run every scenario in `specs/001-acquisition-portal/quickstart.md` by hand in the running app and fix any failing acceptance scenario
- [X] T063 [P] Check the dashboard has no horizontal page scroll at 1024 px wide and that all tabs remain usable
- [X] T064 Confirm Principle III compliance: search the repository for test files and test frameworks (`find . -name "*.test.*" -not -path "./node_modules/*"`) and confirm none exist
- [X] T065 [P] Confirm every UI primitive is imported from `components/ui/` and no custom primitive duplicates a shadcn/ui component (Principle IV)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Stories (Phases 3 to 8)**: Each depends on Foundational. Stories are independent of each
  other except where noted below.
- **Polish (Final Phase)**: Depends on all user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational. Independent.
- **US2 (P2)**: Starts after Foundational. Reads submissions created by US1 in practice, but the
  seed data supports it independently.
- **US3 (P3)**: Starts after Foundational. Independent.
- **US4 (P4)**: Starts after Foundational. Independent.
- **US5 (P5)**: Starts after Foundational. T053 modifies the intake form from US1, so US5 should
  run after US1.
- **US6 (P6)**: Starts after Foundational. Reads data from all modules, so run after US2 to US4
  for real data.

### Within Each Phase

- Domain tasks (`src/domain/`) come before store actions that use them.
- Store actions come before UI components that call them.
- Tab registration (`components/dashboard/tab-bar.tsx`) is done after the tab component exists.

### File Conflicts (run sequentially)

- `src/data/store.ts` is touched by T014, T021, T030, T036, T048. Run these in order.
- `components/dashboard/tab-bar.tsx` is touched by T027, T034, T040, T046, T052, T058. Run in order.
- `components/intake/intake-form.tsx` is touched by T022 and T053. Run in order.

### Parallel Opportunities

- Setup: T003, T004, T005, T006 in parallel after T001 and T002.
- Foundational: T009, T010, T011, T012, T013 in parallel.
- Each story: its `[P]` domain tasks run in parallel with other stories' domain tasks.
- Different user stories can be staffed in parallel once Foundational is done.

---

## Parallel Example: User Story 1

```bash
# Domain rules in parallel:
Task: "T019 Implement per-type zod schemas in src/domain/intake-schema.ts"
Task: "T020 Implement visitDate validation in src/domain/date-rules.ts"

# Then the field components in sequence (both touch components/intake/):
Task: "T023 Build the NIP field in components/intake/nip-field.tsx"
Task: "T024 Build the Rupiah input in components/intake/rupiah-input.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: run the US1 scenarios in `quickstart.md`
5. Demo the intake flow

### Incremental Delivery

1. Setup + Foundational: dashboard shell and seed data
2. Add US1: intake (MVP)
3. Add US2: approval
4. Add US3: pipeline
5. Add US4: monitoring and map
6. Add US5: catalog and simulators
7. Add US6: reports
8. Polish: static checks and manual validation

---

## Notes

- No test tasks are included. This follows Constitution Principle III.
- `[P]` means different files and no dependency on incomplete tasks.
- `[Story]` maps each task to its user story for traceability.
- Open questions in `plan.md` and `data-model.md` (merchant alert rule, priority AUM minimum)
  are not resolved by these tasks. T011 and T019 flag them in code.
- Commit after each task or logical group.
