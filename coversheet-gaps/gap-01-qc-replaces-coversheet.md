# Gap 01 — Document QC replaces the coversheet instead of appending a new one

**Status: FIX APPLIED ON THIS BRANCH** (was CRITICAL)

The interactor change and cypress test updates are already present on
the `9915-queue-coversheets` working tree. Keeping this gap document for
historical context; close once the branch lands.

## Spec
> Docket Clerk completes QC on eFiled doc with edits to any of the document
> metadata (per the [SPEC.md](./SPEC.md) field whitelist) — **new
> coversheet is appended to the front of the document (original coversheet
> still exists).**

After a QC metadata edit, the served PDF should contain **two** coversheets:
the original (file-time) one followed by the regenerated one. The original
must remain visible as a historical record of the doc's prior metadata.

## Current behavior
The QC interactor **REPLACES** the coversheet rather than appending.

`web-api/src/business/useCases/docketEntry/completeDocketEntryQCInteractor.ts:365-388`:

```ts
if (isNewCoverSheetNeeded) {
  await applicationContext.getUseCases().addCoversheetInteractor(
    applicationContext,
    {
      bypassIdempotencyGate: true,
      docketEntryId,
      docketNumber: caseEntity.docketNumber,
      replaceCoversheet: true,   // <-- REPLACES, drops original coversheet
    },
    authorizedUser,
  );
}
```

`web-api/src/business/useCases/addCoverToPdf.ts:60-65` shows what
`replaceCoversheet: true` does — it removes page 0 (the original coversheet)
before inserting the new one:

```ts
if (replaceCoversheet) {
  pdfDoc.removePage(0);
  pdfDoc.insertPage(0, coverPageDocumentPages[0]);
} else {
  pdfDoc.insertPage(0, coverPageDocumentPages[0]);
}
```

## Tests that pin the wrong behavior
The e2e test
`cypress/local-only/tests/integration/documentQC/docket-clerk-qc-doc-type-change-regenerates-coversheet.cy.ts`
**asserts the wrong (current) behavior** with this comment and assertion:

```ts
// Regression signal: coversheet replaced, not stacked (would be 3),
// not dropped (would be 1).
goToCase(docketNumber);
assertDocketEntryPageCount({ eventCode: 'EXH', expected: '2' });
```

Per the spec, after QC with metadata edit on a 1-page exhibit (which already
has 1 coversheet from upload, total 2 pages), the doc should have **3**
pages (original doc + original coversheet + new coversheet), not 2.

The same wrong assertion appears in
`cypress/local-only/tests/integration/documentQC/petitioner-files-document-across-consolidated-cases-qc-doc-type-change.cy.ts:124-129`.

## Fix
1. Change the call in `completeDocketEntryQCInteractor.ts:365-388` to omit
   `replaceCoversheet: true` (or pass `false` explicitly). The default
   behavior of `addCoverToPdf` is to insert at index 0 without removing the
   existing first page.
2. Update the e2e tests above so the page-count assertion expects `3`
   instead of `2`, and update the comments to describe append-not-replace.
3. Add a new unit test in
   `web-api/src/business/useCases/docketEntry/completeDocketEntryQCInteractor.test.ts`
   asserting that `addCoversheetInteractor` is called with
   `replaceCoversheet: false` (or omitted) when `isNewCoverSheetNeeded` is
   true.

## Watch out for
- The doc-comment on `bypassIdempotencyGate` in `addCoversheetInteractor.ts`
  remains accurate (the QC entry is already COMPLETE so the gate must still
  be bypassed). Only `replaceCoversheet` needs to change.
- For court-issued doc edits with coversheet → coversheet (handled in
  `updateDocketEntryMetaInteractor`) the code already does the right thing
  (append, no replace) — do not regress that.
- Note that `addCoverToPdf` always reads the document's current first page
  as "the coversheet to keep." If the doc was filed without a coversheet
  (e.g., legacy data), the first non-coversheet page would now be pushed
  down — verify there's no path that produces a docket entry without a
  coversheet that could later go through QC.
