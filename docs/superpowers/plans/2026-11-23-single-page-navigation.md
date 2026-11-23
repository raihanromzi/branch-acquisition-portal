# Single-Page Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace multiple open module tabs with exactly one sidebar-selected module page, defaulting to Intake.

**Architecture:** `DashboardShell` owns a single `activeModule: ModuleId` state. Sidebar clicks replace that state; it no longer persists module tabs. Delete the now-unused `TabBar` component.

**Tech Stack:** Next.js App Router, React 19, shadcn/ui, Tailwind CSS v4.

**Spec:** User-approved conversation request, 2026-11-23.

## Global Constraints
- No tests (Constitution Principle III); validate with `tsc`, lint, build, and live app.
- Preserve all six module views and their sidebar navigation.
- Use shadcn/ui primitives and existing theme tokens only.

## Review Focus
- Intake is rendered on first load.
- Each sidebar selection immediately replaces, rather than appends, content.
- No `TabBar` import/file or localStorage tab key remains.

---

### Task 1: Replace Multi-Tab State with Single Module Selection

**Files:**
- Modify: `components/dashboard/shell.tsx`
- Delete: `components/dashboard/tab-bar.tsx`

**Interfaces:**
- Consumes: `MODULES`, `ModuleId`, and the existing six module panel components.
- Produces: `DashboardShell` with `activeModule: ModuleId`, initialized to `"intake"`.

- [ ] Remove `TabState`, `TAB_KEY`, `loadTabs`, persistence effects, empty tab state, and `TabBar` imports/rendering.
- [ ] Initialize `const [activeModule, setActiveModule] = useState<ModuleId>("intake")`.
- [ ] Make every sidebar module button call `setActiveModule(module.id)`.
- [ ] Render `panel[activeModule]` directly with its module title and description.
- [ ] Delete `components/dashboard/tab-bar.tsx`.
- [ ] Run `npx tsc --noEmit && npm run lint && npm run build`.
- [ ] Run the app and confirm Intake shows first; click Approval then Monitoring and confirm only selected page appears.
