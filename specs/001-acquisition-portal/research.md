# Research: Branch Acquisition & Monitoring Portal

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Date**: 2026-11-23

Each entry records a decision, its rationale, and the alternatives considered. No open
`NEEDS CLARIFICATION` items remain.

## 1. Application framework

- **Decision**: Next.js 14+ with the App Router, React, and TypeScript in strict mode. Use the
  latest 14.x or newer stable release at project creation.
- **Rationale**: Named in `docs/specs.md`. Deploys to Vercel with no configuration. Client
  components keep the prototype fully interactive with no backend.
- **Alternatives considered**: Vite + React SPA (simpler, but gives up the Vercel-native deploy
  the source design specifies). Remix (no advantage for a client-only prototype).

## 2. Single unified dashboard with open tabs

- **Decision**: One route (`/`) renders a tab bar. Each module is a tab. Open tabs and the active
  tab are kept in client state and mirrored to localStorage.
- **Rationale**: Spec FR-028 and `docs/specs.md` decision 8 require one dashboard with no login
  step. A single route avoids full-page reloads during demos.
- **Alternatives considered**: One route per module (`/intake`, `/approval`, and so on). Rejected
  because it complicates the shared store and the open-tabs behavior. A `?tab=` query parameter
  can be added later for deep links without a page reload.

## 3. Dynamic intake form

- **Decision**: shadcn/ui Form component built on react-hook-form with zod schemas. A discriminated
  union keyed on acquisition type selects the field set.
- **Rationale**: shadcn/ui's documented form pattern (constitution Principle IV). Zod gives one
  schema per acquisition type, which keeps type-specific rules in one place. The library choice
  is limited to form state and validation.
- **Alternatives considered**: Hand-written controlled inputs (more code to maintain, against
  Principle II). Formik (less aligned with shadcn/ui's own form component).

## 4. NIP validation and staff lookup

- **Decision**: A pure function in `src/domain/nip.ts` checks format (18 numeric digits) and looks
  up the staff master. The form calls it on each change and locks name and branch on a match.
- **Rationale**: Keeps the rule testable by reading, not by automated tests (Principle III).
  Matches spec FR-003 and FR-004.
- **Alternatives considered**: Server-side lookup (adds a backend, which the MVP does not need).

## 5. Rupiah formatting

- **Decision**: `src/domain/currency.ts` exports `parseRupiah` and `formatRupiah`. Display uses
  `Rp` with dot thousands separators. Stored values are integers in Rupiah.
- **Rationale**: Integer storage avoids floating-point errors for amounts. The display rule
  matches spec FR-005. Edge case in the spec: decimals round to whole Rupiah.
- **Alternatives considered**: `Intl.NumberFormat("id-ID")`. Acceptable for display. The
  custom parser is still needed for input masking, so the choice is to use Intl for display
  only and keep parsing in one place.

## 6. Acquisition status model

- **Decision**: A state machine in `src/domain/acquisition-status.ts` with four states: Waiting
  for Approval, Accepted (GMM), Rejected (NIP/CIF Error), and Completed. Transitions are explicit
  functions. Rejection requires a non-empty note (FR-011). Accepting an Existing CIF or Unverified
  submission requires a confirmation flag (FR-012).
- **Rationale**: Business rules are explicit and easy to review.
- **Alternatives considered**: Freeform status strings (allows invalid transitions).

## 7. Merchant alert rule

- **Decision**: A merchant is flagged when its EDC status is active AND (monthly sales are below
  Rp 5,000,000 OR monthly transactions are below 10). Both thresholds are named constants in
  `src/domain/merchant-alert.ts`.
- **Rationale**: Follows spec FR-019 and the edge case "exactly at threshold is not flagged".
- **Conflict noted**: `docs/specs.md` section 5 defines `isBermasalah` using sales alone. The spec
  adds the transaction-count condition. The spec wins because it is the approved requirement
  set. Confirm with the product owner during clarification.
- **Alternatives considered**: Sales-only rule (matches the data model comment in `docs/specs.md`
  but ignores FR-019).

## 8. Interactive map and clustering

- **Decision**: Leaflet with react-leaflet and leaflet.markercluster, loaded only on the client
  using a dynamic import with `ssr: false`. Alert markers are a distinct red icon. The blinking
  effect respects `prefers-reduced-motion`.
- **Rationale**: Named in `docs/specs.md`. Leaflet does not support server rendering. Reduced-motion
  support is an accessibility requirement the design source does not mention.
- **Alternatives considered**: MapLibre GL (heavier; needs a vector tile source the prototype does
  not have). Google Maps (requires an API key and billing, against the no-external-setup goal).

## 9. Visit route optimization

- **Decision**: Haversine great-circle distance between points. Route order uses a nearest-neighbor
  heuristic starting at the branch office, implemented in `src/domain/route.ts`. Total distance
  is reported in kilometers.
- **Rationale**: Deterministic and simple to read. Spec assumption says route quality is measured
  by distance only. Nearest neighbor is accurate enough for a handful of merchants per day.
- **Alternatives considered**: Google Directions or OSRM (external service, against the no-external
  dependency goal). Exact TSP solvers (unnecessary for under 20 stops).

## 10. Spreadsheet export

- **Decision**: SheetJS (`xlsx`) builds a three-sheet workbook in `src/exports/excel.ts`. The
  export is generated in the browser and downloaded as `.xlsx`. Sheet names and columns are
  defined in `contracts/exports.md`.
- **Rationale**: Named in `docs/specs.md`. Works offline with no server.
- **Alternatives considered**: ExcelJS (larger bundle, no simpler API for this need).

## 11. Executive one-page summary

- **Decision**: Print layout via CSS `@media print` with `@page { size: A4; margin: 12mm }`. The
  view model is built by a pure function in `src/exports/summary-model.ts`. Lower-priority lists
  are truncated to five items with a count of the rest (spec edge case).
- **Rationale**: Native browser print gives reliable one-page output with no PDF library.
  Matches `docs/specs.md` ("client-side render/print layout").
- **Alternatives considered**: jsPDF or pdfmake (extra dependency; layout harder to match to the
  design). Server-side PDF (no backend).

## 12. Persistence and seed data

- **Decision**: Typed seed modules in `src/data/seed/` load into an in-memory store
  (`src/data/store.ts`). Changes are written to localStorage under one versioned key. A version
  mismatch reseeds the data.
- **Rationale**: Demo works immediately with no database (`docs/specs.md` decision 1). Versioned
  keys prevent stale data from breaking the UI after a model change.
- **Alternatives considered**: Vercel Postgres or Blob (adds infrastructure the prototype does not
  need). IndexedDB (more complex; localStorage is enough for this data size).

## 13. Testing

- **Decision**: No automated tests. Verification uses `tsc --noEmit`, the project linter,
  `next build`, and the manual scenarios in `quickstart.md`.
- **Rationale**: Constitution Principle III. It explicitly forbids unit tests in the standard
  workflow to keep iteration fast.
- **Alternatives considered**: Vitest or Playwright. Excluded by the constitution unless a
  user asks for them for a named change.

## 14. UI system

- **Decision**: shadcn/ui initialized with Tailwind CSS theme tokens in `globals.css`. Components
  are added with the shadcn CLI and owned in `components/ui/`. Icons use Lucide React.
- **Rationale**: Constitution Principle IV. Owned source keeps customization in the repository.
- **Alternatives considered**: Component library packages such as MUI or Chakra (violate
  Principle IV).
