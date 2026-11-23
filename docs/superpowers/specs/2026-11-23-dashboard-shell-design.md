# Dashboard Shell Redesign

## Intent
Make the portal read as a focused shadcn-style desktop workspace, based on the supplied reference, while retaining all six modules and their behavior.

## Goals
- Persistent 280px module sidebar on desktop.
- Compact top workspace bar: portal identity, current context, reset action.
- Open module tabs directly below the top bar.
- Spacious token-based content canvas for existing module components.
- Keep the existing desktop/tablet breakpoint and no-horizontal-scroll requirement.

## Non-goals
- No new features, backend, charts, data, navigation routes, or mobile-first redesign.
- No change to existing Intake, Approval, Pipeline, Monitoring, Catalog, or Reports logic.

## Approaches
1. **Chosen — compact admin shell:** full-width fixed sidebar, top header, tab strip, content canvas. Closest to the supplied reference and best preserves open-tab behavior.
2. Header-only navigation: smaller diff, but does not match the requested workspace dashboard model.
3. Collapsed icon rail: saves horizontal space but reduces module discoverability.

## Design
```text
┌ Sidebar ────────────┬────────────────────────────────────┐
│ Portal identity      │ Workspace context · Reset           │
│ Search affordance    ├────────────────────────────────────┤
│ Six module entries   │ [Intake ×] [Approval ×] ...         │
│                      ├────────────────────────────────────┤
│                      │ Existing module content             │
└──────────────────────┴────────────────────────────────────┘
```

- Sidebar uses installed shadcn `Sidebar`, `Input`, `Button`, `Separator`, and Lucide icons.
- Sidebar width is `18rem`; current module has semantic muted active treatment.
- Header uses neutral surfaces, 1px borders, no gradients or card shadows.
- Tab strip uses existing `Tabs` primitives, compact close buttons, horizontal inner scrolling only when necessary.
- Content keeps its module-specific cards and maintains an outer `p-6` comfortable canvas.
- All styling uses existing `globals.css` theme tokens.

## Files
- `components/dashboard/shell.tsx`: layout composition and sidebar search/filter state.
- `components/dashboard/header.tsx`: workspace top bar.
- `components/dashboard/tab-bar.tsx`: compact workspace tabs.
- `components/dashboard/modules.tsx`: module metadata/search labels if needed.

## Verification
Run `npx tsc --noEmit`, `npm run lint`, `npm run build`; launch the app and verify module opening, closing, persistence, 1024px layout, and no horizontal page scroll.
