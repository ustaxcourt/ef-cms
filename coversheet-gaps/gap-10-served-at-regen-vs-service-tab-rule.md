# Gap 10 — `servedAt` triggers coversheet regen but Service tab edits shouldn't

**Severity: RESOLVED (dead code; e2e coverage via gap-08)**

## Investigation result (2026-05-18)

The `servedAtUpdated` branch in
`updateDocketEntryMetaInteractor.shouldGenerateCoversheetForDocketEntry`
is **dead code from the Edit Docket Entry UI**.

Verified via grep across `web-client/src`:

- `EditDocketEntryMetaTabService.tsx` only exposes
  `servedPartiesCode` (P/R/B radios) — no input writes `servedAt`.
- `EditDocketEntryMetaTabAction.tsx` only exposes `action` (text) and a
  Strike Entry button — no input writes `servedAt`.
- `EditDocketEntryMetaFormDocument.tsx`,
  `EditDocketEntryMetaFormCourtIssued.tsx`,
  `EditDocketEntryMetaFormNoDocument.tsx` — none bind `servedAt`.
- `setDocketEntryMetaFormForEditAction.ts` initializes `state.form` from
  `documentDetail` (which carries `servedAt`), so the value is present
  on submit — but only as the unchanged original. The
  `editableFields.servedAt !== originalDocketEntry.servedAt` predicate
  is therefore always false through the UI.
- No `name="servedAt"`, `bind="form.servedAt"`, or
  `key: 'servedAt'` action/sequence write exists anywhere in
  `web-client/src`.

Conclusion: explanation #1 from the original gap doc ("Dead code") is
correct. The branch can be removed for clarity in a follow-up commit,
but the live behavior already matches the spec's Service-tab-no-regen
rule because nothing in the UI can make `servedAtUpdated` true.

The e2e coverage requested by this gap lives in
[gap-08](./gap-08-missing-e2e-edit-docket-entry-service-tab-no-regen.md)
— `cypress/local-only/tests/integration/editDocketEntry/edit-service-tab-does-not-regenerate-coversheet.cy.ts`
exercises the Service-tab `servedPartiesCode` toggle and the
Action(s)-tab `action` field, asserting the docket entry's
`numberOfPages` is unchanged. That test is the regression net for the
"Service / Action(s) edits do not regen" rule.

## Spec

From the updated CSV (see [SPEC.md](./SPEC.md)) — Edit Docket Entry:

> Note: edits made to the **Service** or **Action(s)** tab do **not**
> generate a new coversheet.

The positive whitelist of fields that DO regen the coversheet is:
- Filed Date
- Document Type
- Additional info 1 (with checkbox)
- Certificate of Service

`servedAt` (the service timestamp) does not appear on the whitelist and
sits on the Service tab in the UI.

## Current behavior

`web-api/src/business/useCases/docketEntry/updateDocketEntryMetaInteractor.ts:111-113, 222`:

```ts
const servedAtUpdated =
  editableFields.servedAt &&
  editableFields.servedAt !== originalDocketEntry.servedAt;
// ...
return (
  (servedAtUpdated ||
    filingDateUpdated ||
    ...
```

If `editableFields.servedAt` differs from the original, the coversheet is
regenerated.

## Why this needs investigation, not a blind fix

Three plausible explanations — pick one before changing code:

1. **Dead code.** The Service-tab UI may only expose `servedPartiesCode`
   and `serviceDate` for editing, never `servedAt`. If the server never
   receives a changed `servedAt` from this interactor, the branch is
   inert and can be removed for clarity.
2. **Intentional staleness guard.** Product may want the coversheet
   regenerated whenever the served-at timestamp moves so the visible
   service stamp stays accurate, even though the spec phrases the rule as
   "Service tab edits don't regen." Escalate to product to confirm.
3. **Genuine implementation gap.** The UI actually allows editing
   `servedAt`, and the regen is unwanted per the spec. Fix by dropping
   `servedAtUpdated` from the predicate.

## Suggested investigation steps

1. Search the React app for inputs bound to `servedAt` in the Edit Docket
   Entry flow (`web-client/src/`). Grep candidates:
   - `name="servedAt"`
   - `bind="form.servedAt"`
   - `servedAt:` in actions/sequences
2. If no UI control writes `servedAt`, this branch is dead — remove it
   and the `servedAtUpdated` parameter from
   `shouldGenerateCoversheetForDocketEntry`.
3. If a UI control does write it, ask product whether the spec means
   "literally no Service-tab edit ever regens, including service date"
   or "service-stamp data updates may regen as a safety net."

## Tests
- If removing `servedAtUpdated`: update
  `updateDocketEntryMetaInteractor.shouldGenerateCoversheetForDocketEntry.test.ts`
  to drop the servedAt-true case, or flip it to assert no regen.
- Either outcome should add an e2e test under
  [gap-08](./gap-08-missing-e2e-edit-docket-entry-service-tab-no-regen.md)
  exercising the Service tab path and asserting no coversheet regen.

## Cross-reference
- [gap-03 (superseded)](./gap-03-edit-docket-entry-narrow-field-detection.md)
  — this concern is the residual finding from that earlier gap.
- [gap-08](./gap-08-missing-e2e-edit-docket-entry-service-tab-no-regen.md)
  — the negative-control e2e test for the Service-tab-no-regen rule.
