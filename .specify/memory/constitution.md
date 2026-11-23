# Branch Acquisition & Monitoring Portal Constitution

## Core Principles

### I. MVP-First Delivery
- Every feature MUST be the smallest slice that delivers a usable outcome for sales, branch,
  or supervisor users. Scope MUST be traced to `docs/specs.md`.
- Work MUST NOT add modules, fields, roles, or integrations that are not in the approved spec.
  Such ideas MUST be recorded as deferred items for a later version.
- Prototype data MUST come from realistic seed data so the MVP can be demonstrated without
  external infrastructure, as decided in `docs/specs.md`.
- A feature is complete when its core flow works end to end and is demonstrable. Polish,
  optimization, and edge-case expansion MUST wait until the core flow is validated.
- Rationale: The product exists to validate the workflow quickly. Speculative breadth delays
  that validation and adds code that must be maintained.

### II. Maintainability by Design
- Code MUST be written in strict TypeScript. The use of `any` is prohibited unless it is
  justified in a comment at the point of use.
- Each module MUST have one clear responsibility. Domain logic (for example NIP validation,
  GMM status, EDC anomaly rules) MUST live in pure functions separate from UI components.
- Duplication MUST be removed once the same logic appears a third time. Shared code MUST
  have a single owner, not copies across features.
- Names MUST describe domain intent using the spec's terms (for example `acquisition`,
  `pipeline`, `cabang`, `nip`). Abbreviations MUST NOT be introduced unless the spec already
  defines them.
- Dead code, unused exports, commented-out code, and unexplained magic numbers MUST NOT be
  merged. Thresholds such as the EDC alert limit MUST be named constants.
- Comments MUST explain why, not what. New runtime dependencies MUST be justified in the pull
  request description.
- Rationale: The project will be extended, handed over, and demonstrated repeatedly. Clear
  structure keeps later changes cheap.

### III. No Unit Tests in the Workflow
- Contributors and agents MUST NOT create unit tests, component tests, or snapshot tests as
  part of the standard workflow. Test-first gates and test tasks MUST NOT be added to plans or
  task lists.
- Verification MUST rely on the type checker, linter, and production build, plus manual
  verification of the affected flow in the running app.
- A unit test MAY be added only when the user explicitly requests it for a named change. That
  request overrides this principle for that change alone.
- Rationale: This project optimizes for fast iteration in the MVP phase. Test scaffolding slows
  each cycle, and the static checks plus manual verification cover the MVP's risk.

### IV. shadcn/ui for All UI
- All UI primitives (buttons, inputs, selects, dialogs, sheets, tabs, tables, cards, badges,
  forms, toasts, and similar) MUST come from shadcn/ui, installed through its CLI so the source
  is owned in the repository.
- Primitives MUST NOT be hand-built when a shadcn/ui component exists for the need.
- Styling MUST use Tailwind CSS utilities and the shadcn/ui theme tokens (CSS variables). Ad hoc
  colors, fonts, or spacing that bypass the theme MUST NOT be introduced.
- Components MUST be customized by composition or by editing the installed shadcn/ui source
  with a clear reason, never by forking a parallel component library.
- Icons MUST come from Lucide React, as specified. Map and chart views (Leaflet) MAY use their
  own rendering, but their surrounding controls and panels MUST use shadcn/ui.
- Rationale: A single component system keeps the interface consistent across all modules and
  keeps the UI code easy to maintain.

## Technology & UI Constraints

- Stack: Next.js (App Router), React, and TypeScript, deployed on Vercel, as specified in
  `docs/specs.md`. Changes of stack MUST be treated as a MAJOR amendment.
- UI stack: Tailwind CSS, shadcn/ui (Radix UI primitives), and Lucide React icons.
- Data for the MVP MUST be served through the documented in-memory and local-storage engine with
  seed data. Introducing a database or external service is a scope change and requires an
  amendment or an explicit spec update.
- Exports (PDF one-pager, Excel via SheetJS) and print layouts MUST respect the A4 and
  one-page constraints defined in the spec.
- Layouts MUST work on common desktop and tablet widths used by field staff. Mobile support
  MUST NOT be required unless the spec states it.

## Development Workflow & Quality Gates

- Before a change is considered complete, the following MUST pass: type check, lint, and
  production build. Verification MUST include a manual run of the affected flow.
- Each change MUST map to a spec section or a recorded deferred item. Changes without a traceable
  source MUST NOT be merged.
- Pull requests MUST be reviewed for compliance with all four Core Principles. Reviewers MUST
  reject new UI primitives that bypass shadcn/ui and any unit tests added without a named request.
- Commit messages MUST follow the Conventional Commits format (`feat:`, `fix:`, `docs:`,
  `refactor:`, `chore:`).

## Governance

- This constitution supersedes all other development practices, templates, and ad hoc
  conventions in this repository.
- Amendments MUST be proposed in writing, state the version bump and its rationale, and be
  approved by the project owner before merging. The amendment MUST update any affected
  templates or commands in the same change.
- Versioning follows semantic versioning:
  - MAJOR: removing or redefining a principle in a way that makes existing work non-compliant.
  - MINOR: adding a principle or section, or materially expanding guidance.
  - PATCH: wording clarifications and typo fixes that do not change obligations.
- Compliance MUST be checked during every pull request review and during every plan or task
  generation. Any deviation MUST be justified in the change description or rejected.
- Complexity beyond the MVP scope MUST be justified against Principle I before it is added.

**Version**: 1.0.0 | **Ratified**: 2026-11-23 | **Last Amended**: 2026-11-23
