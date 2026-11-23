# Dashboard Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portal dashboard layout to match a modern shadcn workspace layout (persistent sidebar with search and branding, top contextual header, sleek tab strip, and clean content canvas) while preserving all six modules and in-memory/localStorage behavior.

**Architecture:** Update `components/dashboard/` shell, header, and tab-bar components. Keep existing module views intact and compose installed shadcn primitives (`Sidebar`, `Tabs`, `Button`, `Input`, `Badge`, `Card`, `Separator`).

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4, shadcn/ui (Radix primitives), Lucide React.

**Spec:** `docs/superpowers/specs/2026-11-23-dashboard-shell-design.md`

## Global Constraints

- Strict TypeScript, no `any` without justification (Principle II).
- No unit tests in standard workflow (Principle III). Gates are static checks (`tsc`, `lint`, `build`) and running app verification.
- shadcn/ui primitives and theme tokens only; no raw hex or arbitrary inline colors (Principle IV).
- Desktop layout (1024px+) must have no horizontal page scroll (DESIGN.md).
- Preserve existing data model, seed data, store actions, and all six module flows.

## Review Focus

- Module tabs stay persisted across page reloads via localStorage (`branch-acquisition-portal:tabs`).
- Closing the active tab selects the preceding open tab, or shows the empty state when no tabs remain.
- Sidebar search input filters visible module items in real time.
- Sidebar collapses gracefully at tablet viewport (<768px via `useIsMobile`).
- Reset sample data button remains reachable and functions correctly.

---

### Task 1: Refactor `components/dashboard/tab-bar.tsx` into a Sleek Workspace Tab Strip

**Files:**
- Modify: `components/dashboard/tab-bar.tsx`

**Interfaces:**
- Consumes: `openTabs: ModuleId[]`, `activeTab: ModuleId | null`, `onSelect: (id: ModuleId) => void`, `onClose: (id: ModuleId) => void` from `components/dashboard/modules.tsx`.
- Produces: `TabBar` component rendering a compact horizontal tab strip with active pill indicator and close buttons.

- [ ] **Step 1: Update `components/dashboard/tab-bar.tsx`**

Style the tab strip with a bordered container (`inline-flex items-center gap-1 p-1 bg-muted/40 rounded-lg border border-border/60 overflow-x-auto max-w-full`). Render individual tab pills with subtle active elevation (`bg-background text-foreground shadow-xs font-medium`), an inline close icon button (`size-4 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground`), and stop-propagation click handling.

- [ ] **Step 2: Verify TypeScript and Linter**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0, no errors.

---

### Task 2: Enhance `components/dashboard/header.tsx` with Workspace Context and Action Controls

**Files:**
- Modify: `components/dashboard/header.tsx`

**Interfaces:**
- Consumes: `reset` action from `src/data/store.ts`.
- Produces: `Header` component with workspace breadcrumbs/branch selector indicator, date badge, and styled Reset action button.

- [ ] **Step 1: Update `components/dashboard/header.tsx`**

Build a clean header bar with:
- Left: Branch/workspace context indicator (Bank Mandiri logomark/shield icon, branch name badge "KC Jakarta Thamrin", and live status dot).
- Right: Formatted period/date pill ("23 Nov 2026") and Reset sample data button (`variant="outline" size="sm"`).
- Separator bottom border adhering to `border-border`.

- [ ] **Step 2: Verify TypeScript and Linter**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0, no errors.

---

### Task 3: Redesign `components/dashboard/shell.tsx` with Sidebar Search, Module List, and Canvas Layout

**Files:**
- Modify: `components/dashboard/shell.tsx`
- Modify: `components/dashboard/modules.tsx` (optional description/badge metadata)

**Interfaces:**
- Consumes: `MODULES`, `Header`, `TabBar`, and module tab components (`IntakeTab`, `ApprovalTab`, `PipelineTab`, `MonitoringTab`, `CatalogTab`, `ReportsTab`).
- Produces: `DashboardShell` providing the full responsive layout.

- [ ] **Step 1: Add Search Filter and Polish Sidebar in `components/dashboard/shell.tsx`**

1. Sidebar Header: Brand logo mark, "Acquisition Portal" title, and subtitle "Bank Mandiri Branch Operations".
2. Search Input: Add a quick filter input with search icon and `⌘K` keyboard shortcut badge that filters `MODULES` by label.
3. Sidebar Menu: Map filtered modules to `SidebarMenuButton` with active indicator styling, module icons, and quick badges.
4. Sidebar Footer: Add a small card showing environment info ("Prototype v1.0" · "Local In-Memory Store").
5. Page Content Area:
   - Page title row reflecting the active module name and brief summary description.
   - Embed `TabBar` directly below page title.
   - Wrap active panel inside a clean canvas container.
   - When no tab is open, render an empty state card with quick action to open Intake or Monitoring.

- [ ] **Step 2: Verify TypeScript and Linter**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0, no errors.

---

### Task 4: Static Verification and Live Browser Smoke Check

**Files:**
- Test target: All changed files in `components/dashboard/`

- [ ] **Step 1: Run Full Static Verification Suite**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: All commands exit 0.

- [ ] **Step 2: Verify App in Running Server**

1. Confirm dev server runs on `http://localhost:3000`.
2. Verify sidebar search filters modules when typing.
3. Verify opening each of the 6 modules displays properly.
4. Verify closing tabs updates active tab correctly.
5. Verify page reload preserves open tabs from localStorage.
6. Verify layout has no horizontal scroll at 1024px width.
