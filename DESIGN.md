# DESIGN.md

Visual and interaction rules for the Branch Acquisition & Monitoring Portal. Read this before any
UI work. For product scope, see `specs/001-acquisition-portal/spec.md`. For the stack and code
locations, see `CLAUDE.md`.

## Design language

shadcn/ui-inspired, light-first, neutral. The interface should feel calm and precise, so that staff
can scan tables of IDR amounts and CIF numbers without visual noise.

- **Neutral zinc base.** Only grayscale surfaces, with one accent (`primary`).
- **1px hairlines.** Separate regions with `border-border`. Do not use drop shadows for layout.
  At most, one `shadow-sm` on floating layers (Sheet, Dialog, Select, Popover).
- **Radius 0.5rem** (`rounded-lg`) on cards, inputs, and buttons. Badges use `rounded-md`.
- **Semantic tokens only.** Use `bg-background`, `bg-card`, `text-muted-foreground`, `bg-primary`,
  `border-border`. Never use raw hex or `bg-zinc-900` in components.
- **One density per page.** Comfortable (`gap-6 p-6`) for overviews. Compact (`gap-4 p-4`) for
  tables and the pipeline matrix. Do not mix them on one screen.

## Tokens

Define these in `app/globals.css`. Values below are the shadcn zinc preset, light mode. Confirm
them against the preset when `shadcn init` runs. Do not hand-tune them without a reason.

```css
:root {
  --radius: 0.5rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
  --destructive: oklch(0.577 0.245 27.325);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.552 0.016 285.938);
}
```

### Status tokens

Status badges use three semantic tokens, mapped to the Tailwind v4 palette. Components use the
token names, not the palette names, so the mapping can change in one place.

| Token | Palette | Meaning in this app | Use |
|---|---|---|---|
| `--success` | emerald-600 | Healthy merchant, accepted GMM, batch done | Badge text and dot |
| `--warning` | amber-600 | Active EDC with low volume (alert), unverified CIF | Badge text and dot |
| `--danger` | rose-600 | Inactive EDC, rejected submission | Badge text and dot |

Badges use a tinted background (the palette's 50 shade in light mode, 950 at 40% opacity in dark
mode) with the 600 shade for text. Never use color alone. Each badge also carries a text label
(for example "Low volume", "Rejected").

```css
@theme inline {
  --color-success: var(--color-emerald-600);
  --color-warning: var(--color-amber-600);
  --color-danger: var(--color-rose-600);
}
```

## Typography

- **Interface text:** Geist Sans, loaded with `next/font`. Body 14px (`text-sm`), line-height 1.5.
  Table cells use `text-sm`. Page titles use `text-2xl font-semibold tracking-tight`.
- **Numbers:** every numeric column uses `tabular-nums` (Tailwind class). This applies to CIF,
  EDC TID, NIP, counts, percentages, and IDR amounts. Right-align numeric columns.
- **IDR amounts:** display as `Rp 1.500.000` (spec FR-005). Use `formatRupiah` from
  `src/domain/currency.ts`. Never format money inline in a component.
- **Identifiers** such as NIP, CIF, and TID are shown in full, with `font-mono` only if the
  team prefers it. Do not truncate them.

## Layout

- **App shell:** shadcn `Sidebar` for the six modules (Intake, Approval, Pipeline, Monitoring,
  Catalog, Reports). Clicking a module opens it as a tab in the top tab strip.
- **Open tabs:** a shadcn `Tabs` strip at the top of the content area. Closing a tab uses an
  icon button with an accessible label.
- **Inside a module:** use `Card` for each logical block. Use `Tabs` for sub-views (for example
  the Pipeline matrix and the batch closing panel).
- **Breakpoints:** design for 1024px and up. At 768px, the Sidebar collapses to a `Sheet`. There
  is no mobile-only layout (spec assumption).
- **No horizontal page scroll.** Wide tables scroll inside their own `Card`.

## Components

Use these shadcn primitives. Do not hand-build them.

| Need | Primitive | Notes |
|---|---|---|
| Module navigation | `Sidebar` | Collapsible to icons at 1024px |
| Overview and detail blocks | `Card` | `CardHeader`, `CardTitle`, `CardContent` |
| Dense data | `Table` | Sticky header, `tabular-nums` on numeric cells |
| Status | `Badge` | Use the status tokens above |
| Sub-views and open tabs | `Tabs` | |
| Filters (branch, PIC, status) | `Select` | Label above the field, never placeholder-only |
| Merchant drawer, mobile nav | `Sheet` | Side panel |
| Rejection note and confirmations | `Dialog` | Use `AlertDialog` only for destructive confirmation |
| Actions on a row | `DropdownMenu` | |
| Loading | `Skeleton` | Reserve space to avoid layout shift |
| Errors and rejection reasons | `Alert` | Inline, next to the field or block |

Icons: Lucide React, `h-4 w-4` in buttons and table rows, `h-5 w-5` in navigation.

### Patterns from the spec

- **Intake form:** `Card` with one `Select` for the acquisition type. Fields below update to match
  the type (spec FR-001, FR-002). The NIP field locks name and branch once valid (FR-003).
- **Approval queue:** `Table` with a `Badge` per status. Rejection opens a `Dialog` with a required
  note (FR-011). Accepting a non-New CIF opens an `AlertDialog` (FR-012).
- **Pipeline:** `Table` filtered by branch and PIC. The batch closing panel is a `Card` with
  row checkboxes and one primary action, "Mark Visit Done".
- **Map:** the Leaflet canvas is the exception to shadcn primitives. Its surrounding controls,
  legend, and drawer use shadcn components. Alert markers use the `--danger` token. Respect
  `prefers-reduced-motion` (no blink).
- **Catalog:** product `Card`s grouped by segment. Simulators are `Card`s with `Input` and a live
  result. "Apply This Product" is a `Button` that opens the intake tab pre-filled.
- **Executive summary:** a print-only layout, A4 (`@page { size: A4; margin: 12mm }`). No
  shadows, no sidebar, one page (spec FR-026).

## Status and feedback

- Badge text is always present, and color is never the only signal.
- Empty states use a `Card` with a short sentence and the next action. Do not show a blank table.
- Loading uses `Skeleton` in the shape of the final content.
- Errors appear next to the field (`text-danger` under the input) and as an `Alert` for block errors.
- Button labels are verbs: "Submit acquisition", "Mark Visit Done", "Export workbook".

## Language

The UI labels follow `docs/specs.md`. Use the Indonesian domain terms as written (NIP, CIF,
GMM, EDC, Livin' Merchant, PIC, cabang) and keep them unchanged. Other labels use English, as in
the spec. Do not translate domain terms into English in the UI, because staff already use the
Indonesian terms.

## Accessibility

- Contrast: body text at least 4.5:1 against its background in both themes. Check with the
  token values above.
- Focus: keep the shadcn `ring-ring` focus ring. Never remove it.
- Keyboard: every control reachable by Tab, with a visible focus state.
- Icon-only buttons have `aria-label`.
- Motion: respect `prefers-reduced-motion`. No blinking or auto-advancing content.
- Touch targets: 44px minimum on touch-capable layouts.

## Anti-patterns

- Raw `button`, `input`, `select`, or `div` where a shadcn primitive exists.
- Repeated `div rounded-xl border p-6` instead of `Card`.
- Drop shadows on cards or table rows.
- Raw hex or palette classes (`bg-zinc-900`, `text-emerald-600`) inside components. Use tokens.
- Gradients, glassmorphism, or decorative backgrounds.
- `Dialog` for a destructive action. Use `AlertDialog`.
- Nested cards inside cards.
- Color-only status.
- Truncated CIF, NIP, or TID values.

## Checks before a UI change ships

1. Uses only tokens from `globals.css`; no raw hex or palette classes in components.
2. Numeric columns use `tabular-nums` and right alignment.
3. Every control is reachable by keyboard, with a visible focus ring.
4. Status badges have text, and contrast passes 4.5:1 in both themes.
5. Layout works at 1024px with no horizontal page scroll on the dashboard.
6. The flow was exercised in the browser, not just compiled (see `CLAUDE.md` Workflow).

## Sources

- `docs/specs.md`: original product description, the tab and module design (sections 3 and 4), and
  the entity definitions (section 5).
- `specs/001-acquisition-portal/spec.md`: user stories and FR-001 to FR-029. The rules here
  reference FR-005 (money), FR-011 and FR-012 (approval rules), FR-019 (alert thresholds),
  FR-026 (A4 summary), and FR-028 (single dashboard).
- `specs/001-acquisition-portal/plan.md`: stack and file layout.
- `.specify/memory/constitution.md`: Principle IV requires shadcn/ui for all UI.

## Open items

- **Status colors:** the status tokens are mapped to Tailwind palette names. Confirm the exact
  oklch values when the tokens are added to `globals.css`.
- **Font:** Geist is the shadcn default for product UI. Confirm with the team, since the source
  document does not specify a font.
- **Radius:** this file sets `0.5rem`. shadcn's own default is `0.625rem`. Keep `0.5rem` unless the
  team changes it here first.
