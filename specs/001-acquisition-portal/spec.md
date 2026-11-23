# Feature Specification: Branch Acquisition & Monitoring Portal

**Feature Branch**: `001-acquisition-portal`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "read the @docs/specs.md"

## User Scenarios & Testing *(mandatory)*

Scope: a single unified portal for Bank Mandiri sales, branch, and supervisor staff. It replaces
fragmented forms and spreadsheets for acquisition intake, approval tracking, branch pipeline
management, EDA and merchant monitoring, product presentation, and reporting. The first delivery
is a demonstrable prototype with realistic sample data. No live bank system connections are
included.

### User Story 1 - Submit an acquisition through one dynamic intake form (Priority: P1)

A sales officer opens the single intake form, selects the acquisition type (Individual, Business,
Payroll, Priority, or Merchant), and completes only the fields that apply to that type. The
officer enters a NIP, and the system immediately confirms the officer's name and branch. An
invalid NIP blocks submission. Amounts are shown in Rupiah format, and product codes come from a
fixed list.

**Why this priority**: Intake is the core data entry path. Errors here cause acquisitions to fail
later in the ORFS pull, so this story delivers the most immediate value.

**Independent Test**: Can be fully tested by submitting one acquisition of each of the five types
with valid and invalid NIPs. Each valid submission is saved and appears in the approval queue.
Each invalid submission is blocked with a clear message.

**Acceptance Scenarios**:

1. **Given** the intake form is open, **When** the officer selects "Payroll", **Then** only the
   fields for payroll (company name, estimated employee count, estimated balance) are shown.
2. **Given** the officer types a NIP that exists in the staff master, **When** the NIP is entered,
   **Then** the officer's name and branch are filled in automatically and locked.
3. **Given** the officer types a NIP that does not exist, **When** the officer tries to submit,
   **Then** submission is blocked and the message explains that the NIP is not recognized.
4. **Given** the officer enters an amount of 1500000, **When** the field loses focus, **Then** it
   displays as "Rp 1.500.000".
5. **Given** a valid form, **When** the officer submits, **Then** the acquisition appears in the
   approval queue with status "Waiting for Approval".

---

### User Story 2 - Track and approve acquisitions with a visible status (Priority: P2)

A branch manager or administrator reviews incoming acquisitions, checks whether each customer
qualifies as a New CIF under the NBDS check, and moves each acquisition to one of four statuses:
Waiting for Approval, Accepted (GMM), Rejected (NIP/CIF Error), or Completed. Rejections require
a note explaining what must be corrected.

**Why this priority**: Approval turns submitted data into counted results (GMM). It is the
second step of the core acquisition workflow.

**Independent Test**: Can be tested by taking a set of submissions, running the NBDS check on
each, changing statuses, and confirming that the queue reflects each change. Rejections without a
note are not allowed.

**Acceptance Scenarios**:

1. **Given** a submission with a New CIF result, **When** the manager approves it, **Then** its
   status becomes "Accepted (GMM)".
2. **Given** a submission with an Existing CIF result, **When** the manager tries to mark it
   "Accepted (GMM)", **Then** the system warns that it does not qualify for GMM and requires a
   confirmation.
3. **Given** a submission, **When** the manager rejects it without a note, **Then** rejection is
   blocked until a note is entered.
4. **Given** an accepted submission, **When** implementation is finished, **Then** the manager can
   mark it "Completed".

---

### User Story 3 - Manage branch pipeline and close the day in one batch (Priority: P3)

A sales officer or branch PIC views customer pipeline entries filtered by branch and PIC. Each
entry moves through the stages Prospecting, Pitching, Documents, MoU/Agreement, and
Acquisition/Live. Each entry has a checklist and a visit history. At the end of the day, a branch
manager or supervisor sees all visits scheduled for today and marks several as "Done" in one
action.

**Why this priority**: The pipeline replaces scattered manual tracking. It can be used on its
own, but depends on branches and staff data from earlier stories.

**Independent Test**: Can be tested by creating pipeline entries for two branches, moving one
entry through every stage, completing checklist items, and using the batch action to mark several
visits as done.

**Acceptance Scenarios**:

1. **Given** pipeline entries exist for two branches, **When** a user filters by one branch,
   **Then** only that branch's entries are shown.
2. **Given** a pipeline entry, **When** the user records a visit with a note, **Then** the note
   appears in the entry's visit history with the date and PIC.
3. **Given** three visits scheduled for today, **When** the supervisor selects two and confirms
   "Mark Visit Done", **Then** those two are marked Done and the third stays Scheduled.

---

### User Story 4 - Monitor branch performance and merchants on a map (Priority: P4)

A branch manager or supervisor views a set of KPIs for the branch (wholesale units, savings
portfolio, merchant growth, Livin' Merchant activity, and EDC penetration). The manager also sees
a map of merchants near the branch, grouped into clusters. Merchants with an active EDC but sales
volume below Rp 5,000,000 per month or fewer than 10 transactions are highlighted as alerts. A
merchant's detail panel shows its CIF, monthly sales, current MDR scheme, and a button to schedule
a visit. The user can also generate a daily visit route from the branch to the flagged merchants.

**Why this priority**: Monitoring adds analytical value and is most useful after the pipeline and
approval data exist.

**Independent Test**: Can be tested by loading the sample branch data, confirming that the KPI
values and map clusters match the sample data, verifying that flagged merchants match the alert
rule, and generating a route for a set of flagged merchants.

**Acceptance Scenarios**:

1. **Given** the map is open, **When** the user zooms out, **Then** nearby merchants are grouped
   into numbered clusters.
2. **Given** a merchant with an active EDC and monthly sales of Rp 3,000,000, **When** the map
   loads, **Then** the merchant is shown with an alert marker.
3. **Given** a merchant with an active EDC and monthly sales of Rp 8,000,000 and 12 transactions,
   **When** the map loads, **Then** the merchant is not flagged.
4. **Given** three flagged merchants, **When** the user requests a visit route, **Then** the
   system shows an ordered route starting at the branch office and visiting all three.

---

### User Story 5 - Present products with a catalog and simulators (Priority: P5)

A sales officer browses products grouped by segment (Retail, Business/Current Account, Corporate
Payroll, Priority and Wealth, and Merchant & EDC). The officer uses a savings and deposit
simulator to estimate returns for a given amount and tenor, and an EDC fee simulator to compare
merchant fee schemes. Each product card has an "Apply This Product" action that opens the intake
form with the product type and code already filled in.

**Why this priority**: The catalog supports customer conversations and feeds intake. It is useful
but does not affect the core data path.

**Independent Test**: Can be tested by running both simulators with known inputs, checking the
results against the expected values, and confirming that "Apply This Product" opens the intake
form with the correct fields filled.

**Acceptance Scenarios**:

1. **Given** the deposit simulator, **When** the user enters an amount and tenor, **Then** the
   estimated interest appears and updates immediately when either value changes.
2. **Given** the EDC fee simulator, **When** the user enters a monthly sales volume, **Then** the
   current and proposed fee schemes are compared side by side.
3. **Given** a product card, **When** the user selects "Apply This Product", **Then** the intake
   form opens with the matching acquisition type and product code already filled in.

---

### User Story 6 - Export an executive one-page summary and branch data (Priority: P6)

A branch manager or supervisor generates a one-page A4 executive summary with branch KPIs,
achievement against target, the top-performing branch, and branches with EDC problems. The
manager also exports a spreadsheet with three sheets: branch performance and EDA metrics,
the full pipeline with visit status, and the merchant and EDC/LVM master data.

**Why this priority**: Reporting is needed for leadership reviews. It relies on data from all
earlier stories, so it comes last.

**Independent Test**: Can be tested by generating the summary and checking that it prints on one
A4 page, then exporting the spreadsheet and checking that it has three sheets with the expected
columns and sample rows.

**Acceptance Scenarios**:

1. **Given** branch data exists, **When** the user generates the executive summary, **Then** the
   result fits on one A4 page without cut-off content.
2. **Given** branch data exists, **When** the user exports the spreadsheet, **Then** the file
   contains three named sheets: Branch Recap, Pipeline, and Merchant/EDC.

---

### Edge Cases

- What happens when a NIP is valid but the officer belongs to a different branch from the one
  selected for the pipeline? The system shows the officer's branch and asks the user to confirm.
- How does the system handle an amount entered with decimals or letters? Letters are rejected,
  and the value is rounded to whole Rupiah.
- What happens when a New CIF check returns "unverified" because the NBDS simulation has no data
  for that customer? The submission remains "Waiting for Approval" with status "Unverified" and
  cannot be marked "Accepted (GMM)" without a manager's note.
- What happens when a merchant's sales volume is exactly Rp 5,000,000 or exactly 10 transactions?
  The merchant is not flagged, because the rule flags only values below the thresholds.
- What happens when the map has no merchants within the branch area? An empty-state message
  explains this, and the route action is disabled.
- What happens when a batch closing includes a visit that was rescheduled during the day? The
  rescheduled visit is excluded from the batch and stays on the pipeline with its new date.
- What happens when an export is requested for a branch with no pipeline entries? The spreadsheet
  is produced with headers and no data rows, and a notice explains that no records exist.
- What happens when an executive summary contains more content than fits on one page? Lower-priority
  items, such as the list of branches with EDC problems, are truncated to the top five with a count
  of the rest.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide one intake form in which the user selects the acquisition
  type first, and only the fields for that type are shown.
- **FR-002**: The system MUST support five acquisition types: Individual, Business, Payroll,
  Priority, and Merchant (OTBR).
- **FR-003**: The system MUST validate a NIP as the user types it and MUST fill in the officer's
  name and branch from the staff master.
- **FR-004**: The system MUST block submission when the NIP is not found in the staff master.
- **FR-005**: The system MUST display Rupiah amounts with thousands separators and the "Rp" prefix.
- **FR-006**: Product codes MUST be selected from a fixed list of Bank Mandiri product codes.
- **FR-007**: Date fields MUST accept only valid calendar dates within the allowed range.
- **FR-008**: The system MUST place each new submission in the status "Waiting for Approval".
- **FR-009**: The system MUST run a simulated NBDS check that classifies each customer as New CIF,
  Existing CIF, or Unverified.
- **FR-010**: The system MUST allow an approver to move a submission to "Accepted (GMM)",
  "Rejected (NIP/CIF Error)", or "Completed".
- **FR-011**: The system MUST require a note before any submission can be rejected.
- **FR-012**: The system MUST warn the approver and require confirmation before a submission
  with an Existing CIF or Unverified result is accepted as GMM.
- **FR-013**: The system MUST provide a pipeline view filterable by branch and PIC.
- **FR-014**: Each pipeline entry MUST move through the stages Prospecting, Pitching, Documents,
  MoU/Agreement, and Acquisition/Live.
- **FR-015**: Each pipeline entry MUST have a checklist and a visit history showing date, note,
  and PIC.
- **FR-016**: The system MUST provide a batch action that lets a branch manager or supervisor mark
  multiple of today's scheduled visits as Done in one confirmation.
- **FR-017**: The system MUST display branch KPIs: wholesale units, savings portfolio, merchant
  growth, Livin' Merchant activity, and EDC penetration.
- **FR-018**: The system MUST display merchants on a map, grouped into clusters that expand as the
  user zooms in.
- **FR-019**: The system MUST flag a merchant as an alert when its EDC status is active and its
  monthly sales are below Rp 5,000,000 or its monthly transactions are below 10.
- **FR-020**: The system MUST show a merchant detail panel with CIF, monthly sales, current MDR
  scheme, and a button to schedule a visit.
- **FR-021**: The system MUST generate a visit route that starts at the branch office and visits
  a selected set of merchants in an efficient order.
- **FR-022**: The system MUST present a product catalog grouped into the five segments listed in
  the specification.
- **FR-023**: The system MUST provide a savings and deposit simulator that updates the estimated
  return when the amount or tenor changes.
- **FR-024**: The system MUST provide an EDC fee simulator that compares the current and proposed
  fee schemes for a given monthly sales volume.
- **FR-025**: Each product card MUST provide an action that opens the intake form with the product
  type and code filled in.
- **FR-026**: The system MUST generate a one-page A4 executive summary that prints without
  cut-off content.
- **FR-027**: The system MUST export a spreadsheet with three sheets: Branch Recap and EDA Metrics,
  Pipeline and Visit Status, and Merchant and EDC/LVM Master Data.
- **FR-028**: All modules MUST be reachable from one unified dashboard through open tabs, without
  a login or logout step during the demonstration.
- **FR-029**: The system MUST load with realistic sample data for staff, branches, submissions,
  pipeline entries, and merchants, so that every story can be demonstrated without external
  connections.

### Key Entities *(include if feature involves data)*

- **Sales Officer (Staff)**: A bank employee identified by NIP, with a name, role (Individual
  Sales, Payroll Sales, Priority Sales, or Merchant Officer), and home branch.
- **Branch**: A bank branch office, with an identifier and name, that owns pipeline entries,
  merchants, and KPI data.
- **Acquisition Submission**: One customer acquisition, with the submitting officer, branch,
  acquisition type, customer name, optional CIF, product code and name, amount or type-specific
  estimates (employee count, AUM, EDC type), approval status, NBDS result, and an optional note.
- **Branch Pipeline Entry**: A prospective customer being worked by a branch, with a category,
  current stage, assigned PIC, scheduled visit date, visit status, checklist items, and visit
  history.
- **Merchant**: A business location near a branch, with owner, CIF, area, map position, EDC status,
  monthly sales, monthly transaction count, MDR scheme, and an alert flag.
- **Product**: A catalog item with a segment, name, code, and description used by the catalog and
  intake form.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A sales officer completes one acquisition submission from the intake form in under
  2 minutes.
- **SC-002**: 100% of submissions with an unrecognized NIP are blocked before they reach the
  approval queue.
- **SC-003**: An approver can review and change the status of 20 submissions in under 10 minutes.
- **SC-004**: A branch supervisor can mark an entire day's scheduled visits as done in one action
  that takes under 30 seconds.
- **SC-005**: 100% of merchants that meet the alert rule are shown with an alert marker, and none
  that fail the rule are shown with one, on the sample data set.
- **SC-006**: A user can generate and print the executive summary on one A4 page on the first
  attempt in 9 out of 10 trials.
- **SC-007**: Exported spreadsheets open with all three sheets and their expected columns on
  the sample data set.
- **SC-008**: A first-time user can find and open any of the six modules from the unified
  dashboard in under 30 seconds without help.

## Assumptions

- The first delivery is a prototype demonstrated with realistic sample data. It does not connect
  to live bank systems, the ORFS data pull, or the NBDS service. NBDS results are simulated.
- The staff master, branch list, product list, and merchant data are provided as sample data.
- Sales volume alert thresholds (Rp 5,000,000 per month and 10 transactions) are fixed for the
  prototype and are not configurable in the interface.
- The alert rule applies only to merchants with an active EDC. QRIS-only merchants are not flagged.
- Users access the portal from office computers at desktop and tablet widths. Phone-only layouts
  are out of scope for this version.
- No login or role separation is enforced in the prototype, as stated in the source
  specification. Role names are shown for context only.
- The one-page executive summary is produced for printing through the browser's print layout.
- Spreadsheet export covers only the three sheets listed in the source specification.
- Route optimization is measured by total route distance from the branch office. Real traffic
  and fuel models are out of scope.
- Customer personal data in the sample set is fictional.
