# Gap 06 — Missing e2e: save-for-later then serve-later still produces a coversheet on docket doc

**Severity: MEDIUM (test coverage)**

## Spec
> Docket Clerk adds a paper filing, **saves for later**, then navigates back
> to the document to serve it at a later time → no coversheet is added to
> the print for paper service doc, but **a coversheet IS added** to the
> document on the docket record.

## Current code
- `web-api/src/business/useCases/docketEntry/addPaperFilingInteractor.ts:225`:
  `enqueueAddCoversheet` is gated on `if (isReadyForService)` — so when
  `isSavingForLater` is true, **no coversheet is queued at filing time**.
- `web-api/src/business/useCases/docketEntry/editPaperFilingInteractor.ts:332-336`:
  `serveDocketEntry` (used by both `singleDocketServeStrategy` and
  `multiDocketServeStrategy`) calls `enqueueAddCoversheet` after
  `serveDocumentAndGetPaperServicePdf`. So when the docket clerk later
  serves the saved entry, the coversheet IS queued.

This is the correct two-step behavior per spec.

## Existing tests
- `cypress/local-only/tests/integration/documentQC/docket-clerk-qcs-paper-filing.cy.ts`
  uses save-for-later → QC-and-serve. After serve it asserts page count
  equals 2 (1 doc + 1 coversheet). Implicitly verifies the coversheet is
  added on the later serve, but does NOT explicitly assert that the
  pre-serve / saved-state docket entry had **no** coversheet. So a
  regression that adds the coversheet at save-for-later time would silently
  pass (the assertion only fires after serve, when the coversheet is
  expected anyway).

## Suggested test
Either add a new test or strengthen the existing one to:

1. Add a paper filing with `save-for-later` clicked.
2. Navigate to the case detail and assert the saved docket entry's
   `numberOfPages` equals the **original** uploaded doc page count (NO
   coversheet yet).
3. Verify there's no `paperServicePdfUrl` in the response.
4. Then complete QC + serve from the in-progress queue.
5. Assert page count is now `original + 1`.
6. (Optional) Inspect the paper-service PDF URL and assert it does NOT
   include the coversheet (cross-reference
   [gap-05-missing-e2e-paper-service-print-vs-docket.md](./gap-05-missing-e2e-paper-service-print-vs-docket.md)).

Path suggestion:
`cypress/local-only/tests/integration/documentQC/docket-clerk-save-for-later-then-serve-coversheet.cy.ts`

## Why this matters
The save-for-later branch is in a separate strategy
(`saveForLaterStrategy` in `editPaperFilingInteractor.ts:131-184`) that
deliberately omits coversheet enqueueing. Without a test that asserts the
saved-but-not-served state has no coversheet, a refactor that consolidates
the strategies could accidentally start enqueueing a coversheet at save
time, making the saved doc on the docket record diverge from the user's
intent (and the worker would race the user's later edits).
