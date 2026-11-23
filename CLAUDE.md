# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project

Branch Acquisition & Monitoring Portal for Bank Mandiri sales, branch, and supervisor staff. The
v1 deliverable is a frontend-only prototype with realistic sample data. There is no backend.

Source of truth, in priority order:
1. `.specify/memory/constitution.md`: non-negotiable principles. Read this first.
2. `specs/001-acquisition-portal/spec.md`: user stories and requirements.
3. `specs/001-acquisition-portal/plan.md`, `research.md`, `data-model.md`, `contracts/`: design decisions.
4. `specs/001-acquisition-portal/tasks.md`: ordered implementation work.
5. `docs/specs.md`: original product description (Indonesian). Consult it for domain terms.
6. `DESIGN.md`, `DEPLOYMENT.md`: reference docs, if present.

Paths in this file come from `specs/001-acquisition-portal/plan.md`. If a path is missing or moved,
`plan.md` wins. Update this file to match.

If a request conflicts with the constitution, stop and say so. Do not work around it.

## Stack

- Next.js (App Router), React, TypeScript in strict mode
- Tailwind CSS and shadcn/ui (Radix UI primitives, source owned in `components/ui/`)
- Lucide React for icons
- Leaflet, react-leaflet, leaflet.markercluster for the map (client-only)
- SheetJS (`xlsx`) for Excel export

## Where code goes

- Module UI: `components/<module>/` (intake, approval, pipeline, monitoring, catalog, reports)
- Shared primitives: `components/ui/` (shadcn-generated, do not hand-edit)
- Pure domain rules: `src/domain/*.ts`, no React imports
- Store and persistence: `src/data/store.ts`, `src/data/persistence.ts`
- Types: `src/types/entities.ts`

## Commands

Status: no `package.json` yet. Task T001 creates it. Until then, do not run these.
After T001, these must match `package.json` scripts. If they do not, fix this file.

```bash
npm run dev        # local dev server
npx tsc --noEmit   # type check
npm run lint       # lint
npm run build      # production build
```

No test runner, by design. Single-test commands do not apply.

## Rules that apply to every change

- **No unit tests.** Do not create unit, component, or snapshot tests, and do not add a test
  framework (constitution Principle III). Add one only when the user names it for a specific change.
- **shadcn/ui for all UI.** Add primitives with the shadcn CLI. Do not hand-build a component that
  shadcn/ui already provides. Style through theme tokens, not ad hoc colors. The Leaflet map canvas is
  the only exception (constitution Principle IV).
- **MVP scope only.** Build only what `spec.md` and `tasks.md` call for. Record ideas outside scope
  instead of building them (constitution Principle I).
- **Domain rules** are pure functions in `src/domain/`. Components call them, never duplicate them.
- **Thresholds** (for example the merchant alert limits) are named constants, not literals.
- **Strict TypeScript** with no `any` unless justified in a comment. Remove dead code. Remove
  duplication on the third occurrence (constitution Principle II).
- **Data stays local.** No external services or databases. Persist to localStorage through the store
  in `src/data/`. Components must not read or write localStorage directly.
- **Map is client-only.** Load Leaflet with a dynamic import and `ssr: false`.

## Workflow

- Work from `tasks.md`. Mark a task `[X]` only after it is built and verified.
- After any product-code change: run `npx tsc --noEmit` and `npm run build`, then start
  `npm run dev`, exercise the changed flow in the browser, and report what you observed.
  A passing compile alone is not verification.
- Keep to the file paths named in `plan.md`. Create new directories only when the plan calls for them.
- Commit only when the user asks. Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`,
  `chore:`). Do not push unless asked.
- Never commit `.env*` files, credentials, or tokens. Check `git status` before every commit.
- Do not hand-edit `.specify/scripts/`, `.specify/templates/`, or `.specify/feature.json`.
  Spec Kit manages them.
- Use `specs/` and `.specify/` artifacts for planning. Do not invent new spec files outside the
  Spec Kit workflow.

## Open questions (do not decide silently)

- **Merchant alert rule:** `spec.md` flags sales below Rp 5,000,000 OR transactions below 10. The
  source data model in `docs/specs.md` uses sales alone. Implement the spec rule and flag the
  conflict.
- **Priority AUM minimum:** The source gives "Rp 1 Miliar/Rp 500 Juta" without saying which applies.
  Use Rp 500,000,000 until the product owner confirms.
