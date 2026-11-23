# Visual Pipeline Workflow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Pipeline tab into an interactive visual workflow layout inspired by modern pipeline/flow editors: a selectable pipeline entries list on the left, an SVG dotted canvas with connected step boxes and directional arrows in the center, and a live step detail inspector with checklists and visit notes on the right.

**Architecture:** Pure Tailwind + SVG layout inside `components/pipeline/`. No heavy 3rd-party graph canvas dependencies. Uses the existing pipeline store actions (`advancePipelineStage`, `addChecklistDone`, `addVisitRecord`, `batchMarkVisitsDone`) and forward-only stage rules.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4, Lucide icons, shadcn/ui components (`Card`, `Badge`, `Button`, `Input`, `Select`, `Checkbox`, `Textarea`).

**Spec:** User visual request based on pipeline workflow references (Image 7–11), 2026-11-23.

## Global Constraints
- No tests (Constitution Principle III). Static gates (`tsc`, `lint`, `build`) and live smoke testing.
- Follow forward-only stage transition rule (`PROSPECTING` → `PITCHING` → `DOCUMENTS` → `MOU` → `ACQUISITION`).
- Keep batch closing functionality accessible (Batch closing sub-tab or modal toggle).
- Desktop layout must not introduce horizontal scrollbars at 1024px.

## Review Focus
- Selecting a pipeline customer on the left updates the active canvas workflow and inspector immediately.
- Current stage node displays distinct highlighted active styling; completed stages show check indicators; pending stages show muted styling.
- Advancing stage triggers the forward-only rule and updates the active stage visually.
- Adding checklist items and visit notes saves directly into the store and updates the selected stage inspector.

---

### Task 1: Build the Visual Pipeline Workflow Canvas Component

**Files:**
- Create: `components/pipeline/workflow-canvas.tsx`

**Interfaces:**
- Consumes: `BranchPipelineEntry`, `activeStage: PipelineStage`, `onSelectStage: (stage: PipelineStage) => void`, `onAdvanceStage: () => void`.
- Produces: Canvas component with dotted background grid, 5 sequential stage cards (`PROSPECTING`, `PITCHING`, `DOCUMENTS`, `MOU`, `ACQUISITION`), SVG connection lines with arrowheads, and current progress indicators.

- [ ] Implement responsive SVG/flex connector with 5 stage nodes.
- [ ] Nodes render icon, stage name, status (Completed / In Progress / Pending), and brief description.
- [ ] Clicking a stage node sets it as the active inspection stage.
- [ ] Provide an "Advance Next Stage" button on the active node or top canvas toolbar.

---

### Task 2: Build the Stage Detail & Inspector Panel

**Files:**
- Create: `components/pipeline/stage-inspector.tsx`

**Interfaces:**
- Consumes: `BranchPipelineEntry`, `selectedStage: PipelineStage`, `onAdvance: () => void`.
- Produces: Detail panel showing:
  - Header with stage name, customer name, PIC info, and scheduled date.
  - Interactive checklist checkboxes (`addChecklistDone`).
  - Visit history timeline and add visit note form (`addVisitRecord`).
  - Advance Stage action button (disabled if already at ACQUISITION or if current stage is not active).

- [ ] Connect interactive checklist checkboxes with `addChecklistDone`.
- [ ] Connect visit note creation with `addVisitRecord`.
- [ ] Add forward-only Advance Stage button using `advancePipelineStage`.

---

### Task 3: Assemble the Redesigned `components/pipeline/pipeline-tab.tsx`

**Files:**
- Modify: `components/pipeline/pipeline-tab.tsx`
- Delete: `components/pipeline/pipeline-matrix.tsx` (deprecated table view)
- Keep: `components/pipeline/batch-closing-panel.tsx`

**Interfaces:**
- Consumes: `useStore().pipeline`, `getCatalog().branches`, `getCatalog().staff`.
- Produces: Complete Pipeline tab with:
  - Top header: Branch filter, PIC filter, customer search input, and view toggle (Workflow Editor vs. Batch Closing).
  - Main area: Left sidebar list of customer pipeline records, center workflow canvas, right stage inspector panel.

- [ ] Assemble 3-column interactive layout (Customer list, Canvas, Inspector).
- [ ] Include search and branch filters.
- [ ] Include Batch Closing view toggle.
- [ ] Run `npx tsc --noEmit && npm run lint && npm run build`.
- [ ] Test in live dev server.
