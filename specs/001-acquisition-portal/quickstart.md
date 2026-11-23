# Quickstart: Manual Validation Guide

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

This guide shows how to run the prototype and check each user story by hand. No automated tests
are used (constitution Principle III).

## Prerequisites

- Node.js 20 LTS or newer, npm
- A modern browser (Chrome or Edge)
- Repository cloned on the `001-acquisition-portal` branch

## Setup

```bash
npm install
npx shadcn@latest init
npx shadcn@latest add button input label select card tabs table badge dialog sheet form textarea toast
npm run dev
```

Open `http://localhost:3000`. The unified dashboard loads with sample data.

## Static checks (must pass before any manual check)

```bash
npx tsc --noEmit
npm run lint
npm run build
```

All three must exit with code 0.

## Scenario checks

### US1: Intake form (P1)

1. Open the **Intake** tab.
2. Choose **Payroll**. Confirm that only payroll fields appear.
3. Type a NIP that is not in the staff list. Try to submit. Expect a blocked submission and a
   clear message.
4. Type a valid NIP from the staff list. Expect the name and branch to fill in and lock.
5. Enter `1500000` in an amount field. Expect `Rp 1.500.000` after focus leaves.
6. Enter a valid form and submit. Open the **Approval** tab and confirm the submission shows
   "Waiting for Approval".

### US2: Approval (P2)

1. In **Approval**, open a submission marked New CIF. Accept it. Expect "Accepted (GMM)".
2. Open a submission marked Existing CIF. Try to accept it. Expect a warning and a confirmation
   prompt.
3. Reject a submission without a note. Expect the action to be blocked.
4. Reject it again with a note. Expect "Rejected (NIP/CIF Error)" and the note shown.
5. Complete an accepted submission. Expect "Completed".

### US3: Pipeline and batch closing (P3)

1. In **Pipeline**, filter by one branch. Confirm only that branch's entries appear.
2. Open an entry. Advance its stage once. Expect the stage to move forward by one step.
3. Add a visit note. Confirm it appears in the history with date and PIC.
4. Open the batch closing panel. Select two of three scheduled visits for today. Confirm
   "Mark Visit Done". Expect two Done and one still Scheduled.

### US4: Monitoring and map (P4)

1. In **Monitoring**, confirm the KPI cards show values for the selected branch.
2. Open the map. Zoom out. Expect merchant clusters with counts.
3. Find a merchant with an active EDC and monthly sales under Rp 5,000,000. Expect an alert marker.
4. Find a merchant with sales of Rp 8,000,000 and 12 transactions. Expect no alert.
5. Select three alert merchants and request a visit route. Expect an ordered list starting at the
   branch office with a total distance.

### US5: Catalog and simulators (P5)

1. In **Catalog**, check that products appear under the five segments.
2. Enter an amount and tenor in the deposit simulator. Change one value. Expect the estimate to
   update immediately.
3. Enter a monthly sales volume in the EDC simulator. Expect current and proposed fees side by side.
4. Click **Apply This Product** on a product card. Expect the Intake tab to open with the type and
   product code already filled.

### US6: Reports (P6)

1. In **Reports**, generate the executive summary. Use print preview. Expect one A4 page with no
   cut-off content.
2. Export the spreadsheet. Open it and check for three sheets named `Branch Recap`, `Pipeline`,
   and `Merchant/EDC`, with the columns listed in
   [contracts/exports.md](contracts/exports.md).

### Cross-cutting checks

- **Open tabs**: Open three modules, reload the page, and confirm the same tabs are open.
- **Reset**: Use the reset action in the dashboard header. Expect sample data to return to its
  initial state.
- **Map loads only in the browser**: `npm run build` must not fail on the map component.
- **Layout**: Resize to 1024 px wide. No horizontal page scroll should appear on the dashboard.

## Expected outcomes

When every scenario passes, each acceptance scenario in [spec.md](spec.md) has been observed in
the running app. Record any failure with the scenario number and the observed behavior.
