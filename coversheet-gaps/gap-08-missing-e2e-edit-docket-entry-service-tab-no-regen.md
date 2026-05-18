# Gap 08 — Missing e2e: Service / Action(s) tab edits do NOT regenerate coversheet

**Severity: LOW (test coverage; negative control)**

## Spec
> Note: edits made to the **Service** or **Action(s)** tab do **not**
> generate a new coversheet.

## Current code
`web-api/src/business/useCases/docketEntry/updateDocketEntryMetaInteractor.ts:212-230`
`shouldGenerateCoversheetForDocketEntry` does not include
`servedPartiesCode`, `judge`, `trialLocation`, `action`, `date`, etc. So
edits to those fields correctly do NOT trigger regen.

## Existing tests
- `cypress/local-only/tests/integration/documentQC/docket-clerk-qc-cosmetic-edit-leaves-coversheet-untouched.cy.ts`
  is a negative control for **QC with no edits at all** — verifies page
  count unchanged. But it doesn't exercise an actual Service/Actions tab
  edit. It tests "no edits", not "edits to non-coversheet-relevant fields".

## Suggested test
Add a Cypress test that:

1. Adds a docket entry that has a coversheet (page count = 2).
2. Goes to the Edit Docket Entry page.
3. Switches to the **Service** tab and edits a field there
   (e.g. `servedPartiesCode`, an additional served party, `judge`).
4. Saves the changes.
5. Asserts the docket entry's `numberOfPages` is unchanged (2) — meaning no
   new coversheet was appended.
6. Repeats for the **Action(s)** tab (e.g. an action change, a `date` field
   on the action).

Path suggestion:
`cypress/local-only/tests/integration/editDocketEntry/edit-service-tab-does-not-regenerate-coversheet.cy.ts`

## Why this matters
This pins the behavior. As [gap-03-edit-docket-entry-narrow-field-detection.md](./gap-03-edit-docket-entry-narrow-field-detection.md)
fixes the field-detection logic, the change should NOT include any
Service/Actions tab fields. A test that explicitly exercises a Service tab
edit and asserts no regen is the regression net for that fix going too far.

## Cross-reference
- [gap-03-edit-docket-entry-narrow-field-detection.md](./gap-03-edit-docket-entry-narrow-field-detection.md)
  expands the trigger set — this test is the safety net to ensure the
  expansion stops at the Document Info tab boundary.
