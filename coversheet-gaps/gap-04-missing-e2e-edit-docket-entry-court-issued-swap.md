# Gap 04 — Missing e2e: court-issued-with-coversheet → another-court-issued-with-coversheet appends a new coversheet

**Severity: MEDIUM (test coverage)**

## Spec
> Docket clerk adds a Court issued document that has a coversheet (e.g.,
> Returned Mail) and saves it to the docket record — coversheet generated.
> Docket clerk then **edits** the document to a different Court issued doc
> that has a coversheet (e.g., U.S.C.A.) → **new coversheet is appended to
> the front of the doc (original coversheet still exists).**

## Current code
`web-api/src/business/useCases/docketEntry/updateDocketEntryMetaInteractor.ts:118-148`
already handles this case (when both `originalEntryRequiresCoversheet` and
`entryRequiresCoverSheet` are true and `documentTitle` differs,
`shouldGenerateCoversheet` is true and `addCoversheetInteractor` is called
without `replaceCoversheet`, so it appends).

But there is **no e2e test** that exercises this transition end-to-end and
asserts the resulting page count is 3 (1 original doc page + 1 original
coversheet + 1 new coversheet).

## Existing test that's adjacent but doesn't cover this
`web-client/integration-tests/docketClerkEditsDocketEntryToRemoveCoversheet.test.ts`
covers the **TE → TRAN (with-coversheet → no-coversheet)** transition. It
asserts pages drop from `pdfDoc.getPageCount() + 1` back down to
`pdfDoc.getPageCount()`. There is no symmetric coversheet-add or
coversheet-swap test.

## Suggested test
Mirror the structure of
`docketClerkEditsDocketEntryToRemoveCoversheet.test.ts` but:

1. File a Court Issued doc that requires a coversheet (e.g. Trial Exhibits
   `TE`) — page count = `fakeFile pages + 1`.
2. Edit the docket entry to a different Court Issued doc that ALSO requires
   a coversheet (e.g. Returned Mail `RM`, U.S.C.A `USCA`, or any other
   `requiresCoversheet: true` event code).
3. Assert page count = `fakeFile pages + 2` (original + original coversheet
   + new coversheet).

Place the test next to the existing one:
`web-client/integration-tests/docketClerkEditsDocketEntryToAppendCoversheet.test.ts`

## Why this matters
This is the only Edit Docket Entry transition that requires the **append
not replace** semantics. The other transitions (add coversheet from no
coversheet; remove coversheet) don't disambiguate append vs replace. So
without this test, a regression that flips the call to
`replaceCoversheet: true` (matching the QC bug from
[gap-01-qc-replaces-coversheet.md](./gap-01-qc-replaces-coversheet.md))
would silently pass.

## Cross-reference
- Verified-correct row in [README.md](./README.md): "Court Issued: coversheet doc → another coversheet doc edit → APPENDED (original kept)"
- Related: [gap-01-qc-replaces-coversheet.md](./gap-01-qc-replaces-coversheet.md)
