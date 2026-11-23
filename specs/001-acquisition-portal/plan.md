# Implementation Plan: Branch Acquisition & Monitoring Portal

**Branch**: `001-acquisition-portal` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-acquisition-portal/spec.md`, with the source
design in `docs/specs.md`.

## Summary

Build a single-page, unified dashboard prototype for Bank Mandiri branch and sales staff. It
covers six modules in priority order: dynamic acquisition intake, approval tracking, branch
pipeline with batch closing, EDA KPIs and merchant map, product catalog with simulators, and
executive reporting. All data is served from realistic seed data held in memory and persisted to
the browser's local storage, so the prototype runs with no backend. The UI is built with
shadcn/ui on Tailwind CSS. Verification uses static checks and a manual scenario guide, with no
unit tests, per the constitution.

## Technical Context

**Language/Version**: TypeScript (strict mode), React 18+ via Next.js 14+ (App Router)

**Primary Dependencies**:
- Next.js 14+ (App Router), React
- Tailwind CSS and shadcn/ui (Radix UI primitives, installed as owned source via the shadcn CLI)
- Lucide React for icons
- react-hook-form and zod for intake form state and validation (shipped with shadcn's Form
  component)
- Leaflet, react-leaflet, and leaflet.markercluster for the merchant map
- SheetJS (`xlsx`) for multi-sheet Excel export

**Storage**: No external database. An in-memory store is seeded from typed sample data and
mirrored to `localStorage` so edits survive a page reload. This matches decision 1 in
`docs/specs.md`.

**Testing**: None. The constitution (Principle III) excludes unit, component, and snapshot tests
from the workflow. Verification uses `tsc --noEmit`, the linter, `next build`, and the manual
scenarios in `quickstart.md`.

**Target Platform**: Modern desktop and tablet browsers (Chrome, Edge) on office computers. Hosted
on Vercel as a public prototype.

**Project Type**: Web application (frontend only; no server-side API in this version)

**Performance Goals**: Dashboard shell interactive within 2 seconds on a standard office laptop.
Map renders up to 500 merchant markers with clustering without visible lag. Filtering and status
changes respond within 200 ms. (Derived from spec SC-001 to SC-004 and typical office hardware.)

**Constraints**:
- No live bank integrations (ORFS, NBDS, Master Pegawai). All are simulated from seed data.
- The one-page A4 summary must print on one page, using print CSS.
- Leaflet must render client-side only (no server rendering of map components).
- No login or role enforcement in the prototype (spec assumption).
- Every UI primitive comes from shadcn/ui (constitution Principle IV).

**Scale/Scope**: About 6 modules, about 10 screens or panels, roughly 50 staff records, 5 branches,
about 300 submissions, 100 pipeline entries, and 500 merchants in seed data.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How the plan complies |
|---|---|---|
| I. MVP-First Delivery | PASS | Scope traces to spec user stories P1 to P6. Delivery is phased by priority, and each phase is demonstrable. Live integrations are deferred. |
| II. Maintainability by Design | PASS | Domain rules (NIP check, GMM status, merchant alert, route order, simulators) live in pure functions under `src/domain/`, separate from UI. Strict TypeScript. Thresholds are named constants. |
| III. No Unit Tests in the Workflow | PASS | No test directories, test tasks, or test frameworks are planned. Verification relies on static checks, build, and manual scenarios. |
| IV. shadcn/ui for All UI | PASS | Every primitive is installed via the shadcn CLI. Leaflet is the only exception (canvas map). Its controls and panels use shadcn components. |

**Gate result**: PASS. No violations, so Complexity Tracking is not needed.

**Post-design re-check**: PASS. The data model and contracts add no new principle violations.
Persistence uses localStorage and an in-memory store (no database), which keeps the stack small.

## Project Structure

### Documentation (this feature)

```text
specs/001-acquisition-portal/
├── spec.md                  # Feature specification
├── plan.md                  # This file
├── research.md              # Phase 0 output
├── data-model.md            # Phase 1 output
├── quickstart.md            # Phase 1 output (manual validation guide)
├── contracts/
│   ├── data-access.md       # Internal store and domain function contracts
│   └── exports.md           # Excel sheet and executive summary output contracts
├── checklists/
│   └── requirements.md      # Spec quality checklist
└── tasks.md                 # Created by /speckit-tasks, not by this command
```

### Source Code (repository root)

```text
app/
├── layout.tsx               # Root layout, theme, fonts
├── page.tsx                 # Unified dashboard shell (open tabs)
└── globals.css              # Tailwind base and shadcn theme tokens

components/
├── ui/                      # shadcn/ui components (generated, owned source)
├── dashboard/               # Tab bar, module shell
├── intake/                  # Dynamic intake form and type-specific fields
├── approval/                # Approval queue, NBDS log, status actions
├── pipeline/                # Pipeline matrix, visit panel, batch closing
├── monitoring/              # KPI cards, merchant map (client-only), merchant drawer, route panel
├── catalog/                 # Product cards, deposit and EDC simulators
└── reports/                 # Executive summary (print layout), export actions

src/domain/                  # Pure functions, no React imports
├── nip.ts                   # NIP format and master lookup
├── currency.ts              # Rupiah parse and format
├── acquisition-status.ts    # Status transitions and GMM eligibility
├── merchant-alert.ts        # Alert rule and thresholds (named constants)
├── pipeline.ts              # Stage order, batch closing selection
├── route.ts                 # Haversine distance, nearest-neighbor route
└── simulators.ts            # Deposit return and EDC fee comparison

src/data/
├── seed/                    # Typed sample data: staff, branches, products, submissions,
│                            #   pipeline, merchants, kpi
└── store.ts                 # In-memory store, actions, localStorage sync

src/exports/
├── excel.ts                 # SheetJS three-sheet workbook builder
└── summary-model.ts         # Executive summary view model (pure)

src/types/
└── entities.ts              # Shared TypeScript types from data-model.md

public/                      # Static assets (no external map tiles required beyond OSM)
```

**Structure Decision**: A single Next.js App Router project. The unified dashboard is one route
(`/`) that holds open tabs. Module logic lives in `src/domain/` (pure), data in `src/data/`, and
UI in `components/`. This keeps domain rules testable by reading, not by automated tests, and
keeps each module's UI independent of the others.

## Phase Plan (delivery order)

1. **Foundation**: Project setup, shadcn/ui init, theme, unified dashboard shell with open tabs,
   seed data, store with localStorage sync. Enables all other phases.
2. **P1 Intake**: Dynamic form, NIP lookup, Rupiah masking, product dropdown, submission to queue.
3. **P2 Approval**: Queue, NBDS simulation result, status transitions, rejection note rules.
4. **P3 Pipeline**: Branch and PIC filters, stage tracking, checklists, visit history, batch closing.
5. **P4 Monitoring**: KPI cards, map with clusters and alerts, merchant drawer, visit route.
6. **P5 Catalog**: Product segments, simulators, "Apply This Product" pre-fill.
7. **P6 Reports**: Executive summary print layout, three-sheet Excel export.

## Complexity Tracking

Not applicable. The Constitution Check passes with no violations.
