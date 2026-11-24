# DESIGN.md

Visual and interaction rules for the Branch Acquisition & Monitoring Portal. Read this before any
UI work. For product scope, see `specs/001-acquisition-portal/spec.md`. For the stack and code
locations, see `CLAUDE.md`.

## Golden rule

Cut first, write little. A screen shows the data and the action a person needs, and nothing that
only decorates. Every label, caption and badge must earn its place. If a string states nothing the
screen does not already show, delete it. Never invent a number, claim or benefit that the code
cannot back.

## Design language

Neutral, flat and operational. Staff scan tables of IDR amounts and CIF numbers all day, so the
interface stays quiet and the data stays loud.

- **Container family: Frame.** Dashboard panels, tables and lists are ReUI `Frame` with
  `FramePanel`. Use `Card` only for bounded public forms. Never nest a Card inside a Frame or a
  Frame inside a Card. A screen uses one family.
- **Neutral surfaces.** Grayscale only, with one accent (`primary`). Status colour comes only from
  the status tokens below.
- **Hairlines, not shadows.** Separate regions with `border-border`. No drop shadows on panels,
  cards or rows. Overlays (Dialog, Sheet, Popover, Select) may use the shadcn default.
- **No gradients, glows, blur or decorative backgrounds.**
- **Radius.** `rounded-lg` (0.5rem) on controls and panels. Badges and tags are ReUI defaults.
- **Density.** One density per screen. `size="sm"` controls and `gap-4` between panels for
  operational screens. Default size only on forms.
- **Gaps, not margins.** Use `gap-*` on the parent. `gap-1` to `gap-2` in a row, `gap-3` to `gap-4`
  between groups, `gap-6` between sections.

## Tokens

Defined in `app/globals.css` (shadcn neutral). Components use tokens only: `bg-background`,
`bg-card`, `text-muted-foreground`, `bg-primary`, `border-border`. Never raw hex, and never
palette classes such as `bg-zinc-900` or `text-emerald-600` in components.

### Status tokens

| Token | Meaning in this app | Use |
|---|---|---|
| `--success` | Accepted GMM, completed, healthy | `Badge` `success-light` |
| `--warning` | Waiting on a person, low volume, unverified CIF | `Badge` `warning-light` |
| `--danger` | Rejected, inactive EDC | `Badge` `destructive-light` |
| `--info` | Waiting for approval, neutral state | `Badge` `info-light` |

Status is always text plus colour. A badge always carries its label ("Rejected", "Low volume").
Never use colour alone. Use `@reui/badge` and `@reui/alert` for status, not the shadcn versions.

## Typography

- **Interface text:** Geist Sans. Body `text-sm`. Meta and helper text `text-xs`. Nothing below
  `text-xs`.
- **Page title:** the header breadcrumb names the page. Do not repeat the title in the content area
  unless the page has a sub-view that needs one.
- **Panel titles:** `FrameTitle` or `CardTitle` with no size class. Keep titles to 1 to 3 words.
- **KPI value:** `text-2xl font-semibold tracking-tight tabular-nums`.
- **Numbers:** every numeric column and figure uses `tabular-nums`. Right-align numeric columns.
- **IDR amounts:** display as `Rp 1.500.000` through `formatRupiah` in `src/domain/currency.ts`.
  Never format money inline.
- **Identifiers** (NIP, CIF, TID) are shown in full. Never truncate them.

## Copy

- **Sentence case** everywhere. No title case, no uppercase eyebrows, no letter-spaced labels.
- **Headings and captions** are 5 words or fewer.
- **No eyebrow labels, no numbering, no decorative emoji or icons** in headings, buttons or KPIs.
- **No subtitle that repeats the heading.** A panel description appears only when it states a fact
  the title does not show.
- **No botsplaining.** Do not describe what a control does ("Click below to…", "This chart
  shows…").
- **No arrows on links or buttons.** The text says where it goes.
- **Buttons and links name the result** ("Save changes", "Sync live submissions"). Avoid "Learn
  more", "Click here" and "Submit" when a specific verb fits.
- **Empty states** use one plain sentence saying what is missing, plus the next action.
- **Errors** say what happened and what to do next, in one or two sentences, with no "Oops".
- **Domain terms stay in Indonesian** as written: NIP, CIF, GMM, EDC, Livin' Merchant, PIC, cabang.
  Other labels use English.
- **Em dashes:** none in copy. Use a period or a comma.

## Layout

- **App shell:** shadcn `Sidebar`, dark, `variant="inset"`, `collapsible="icon"`. The sidebar
  holds the brand, a module search and the module list. Clicking a module shows it in the inset
  content panel. Icon-only mode shows tooltips.
- **Sidebar footer:** no marketing or status card. The sidebar ends with the module list.
- **Header:** breadcrumb (`Bank Mandiri / <module>`) on the left, date and the reset action on the
  right. The header is the only page title.
- **Dashboard grid:** a KPI row, then one or two chart or list panels, then the table. Use
  `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` for a KPI row.
- **Breakpoints:** design for 1024px and up. Below `md`, the sidebar becomes a `Sheet`. No
  horizontal page scroll at 390px. A wide table scrolls inside its own Frame.

## Components

Use these ReUI or shadcn primitives. Do not hand-build them.

| Need | Primitive | Notes |
|---|---|---|
| Panels, sections | `Frame`, `FramePanel`, `FrameHeader`, `FrameTitle` | Operational surfaces |
| Dense tables | `DataGrid` (`@reui/data-grid`) | Sorting, filtering, pagination inside a `FramePanel p-0` |
| Status | `Badge` (`@reui/badge`) | Status tokens above; one status badge per row |
| Callouts and errors | `Alert` (`@reui/alert`) | Inline next to the affected block |
| Process history | `Timeline` (`@reui/timeline`) | Pipeline stage history |
| Module navigation | `Sidebar` | Inset, icon collapse |
| Form fields | `Input`, `Select`, `Label` | Visible label above the field, never placeholder-only |
| Destructive confirmation | `AlertDialog` | `Dialog` is for non-destructive input only |
| Row and toolbar actions | `Button` (`ghost`, `outline`) | One primary per region |
| Loading | `Skeleton` | Shape of the final content |
| Charts | `Chart` (`ChartContainer`) on recharts | Hairline grid, no gradient fills |

Icons come from Lucide React. Use `data-icon` on buttons and `size-4` in rows and controls.
An icon stays only when it is the control itself, carries meaning the text does not, or sits in a
toolbar where every item has one. Icon-only buttons have an accessible name.

## Patterns

- **KPI panel:** label (`text-sm text-muted-foreground`), value, and at most one line of context.
  No extra badges that restate the value. A badge appears only when it reflects real state.
- **Chart panel:** a title that names the metric, the chart, and nothing else. No description.
  Label series directly when there are four or fewer; use a legend only for stacked series.
- **Approval queue:** `DataGrid` with a `Badge` per status. Rejection opens a `Dialog` with a
  required note. Accepting a non-New CIF opens an `AlertDialog`.
- **Pipeline:** a list of customers, a `Timeline` for stage history and an inspector for the
  selected stage. The batch closing panel is a Frame with row checkboxes and one primary action,
  "Mark visit done".
- **Monitoring:** KPI row, the Leaflet map and the visit route. The map is the only exception to
  shadcn primitives. Alert markers use `--danger`. Respect `prefers-reduced-motion`.
- **Intake:** one Frame for the external sales form link and one for the optional branch form.
  No banners, no gradients, no icon tiles.

## Status and feedback

- Badge text is always present. Colour is never the only signal.
- Empty states: a short sentence and the next action. Never a blank table.
- Loading uses `Skeleton` in the shape of the final content. Never a page-wide spinner.
- Field errors appear under the field in `text-danger`. Block errors use `Alert`.
- Toasts use `sonner` and a title of 4 words at most.

## Accessibility

- **Contrast:** body text at least 4.5:1 in both themes.
- **Focus:** keep the `ring-ring` focus ring. Never remove it.
- **Keyboard:** every control reachable with Tab, with a visible focus state.
- **Icon-only buttons** have `aria-label`.
- **Motion:** no blinking, pulsing or auto-advancing content. Respect `prefers-reduced-motion`.
- **Touch targets:** 44px minimum on touch-capable layouts.
- **Forms:** every field has a visible label tied to its input.

## Anti-patterns

- Raw `button`, `input`, `select` or `div` where a primitive exists.
- `Card` or a bordered div where a Frame is the container family.
- Gradients, glassmorphism, glows, blur or decorative backgrounds.
- Drop shadows on panels, cards or rows.
- Raw hex or palette classes inside components.
- Eyebrows, numbered sections, arrows on links, status dots without live state.
- Edge accent stripes (`border-l-4` in a colour) on cards or rows.
- Subtitles that repeat the heading, and helper text that restates a placeholder.
- Stacked captions that restate the same figure (value, percentage and remainder).
- Truncated CIF, NIP or TID values.

## Checks before a UI change ships

1. Only tokens from `globals.css`. No raw hex or palette classes in components.
2. Numeric columns use `tabular-nums` and right alignment.
3. Every control is reachable by keyboard, with a visible focus ring.
4. Status badges have text, and contrast passes 4.5:1 in both themes.
5. The dashboard works at 1024px and 390px, with no horizontal page scroll on the page.
6. Copy passes the Copy section above. Read every string aloud and cut what says nothing new.
7. The flow was exercised in the browser, not just compiled (see `CLAUDE.md` Workflow).

## Sources

- `docs/specs.md`: original product description, tab and module design, entity definitions.
- `specs/001-acquisition-portal/spec.md`: user stories and FR-001 to FR-029. The rules here
  reference FR-005 (money), FR-011 and FR-012 (approval rules), FR-019 (alert thresholds) and
  FR-028 (single dashboard).
- `specs/001-acquisition-portal/plan.md`: stack and file layout.
- ReUI agent skill (`get_agent_skill`): component APIs and house defaults.
- `.specify/memory/constitution.md`: Principle IV requires shadcn/ui for all UI. ReUI is a
  shadcn-compatible registry, so its components count as shadcn/ui components.

## Open items

- **Font:** Geist is the default for product UI. Confirm with the team, since the source document
  does not specify a font.
- **Radius:** `0.5rem` is kept from the current theme. Change it here first if the team changes it.
- **Catalog and Reports** are removed. See git history before the removal commit `91a99b4` to
  restore them.
