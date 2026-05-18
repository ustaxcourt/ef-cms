# Gap 07 — Missing e2e: court-issued add → edit removes coversheet; opinion → edit adds coversheet

**Severity: MEDIUM (test coverage)**

## Spec
> 1. Docket clerk adds a Court issued document that has a coversheet (e.g.
>    Returned Mail) → coversheet generated. Then edits to a Court doc that
>    does NOT have a coversheet → **coversheet is removed** and document is
>    served.
> 2. Docket clerk adds a Court issued document that does NOT have a
>    coversheet (e.g. Opinion) → no coversheet. Then edits to a Court issued
>    doc that has a coversheet → **coversheet is added.**

## Current code
`web-api/src/business/useCases/docketEntry/updateDocketEntryMetaInteractor.ts`:

- Lines 126-130: `shouldAddNewCoverSheet` and `shouldRemoveExistingCoverSheet`
  are derived from comparing the original and updated event codes against
  `COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET`.
- Lines 164-200: `shouldGenerateCoversheet` triggers
  `addCoversheetInteractor`; `shouldRemoveExistingCoverSheet` triggers
  `removeCoversheet`.

## Existing test coverage
- `web-client/integration-tests/docketClerkEditsDocketEntryToRemoveCoversheet.test.ts`
  ✅ covers scenario #1 (TE → TRAN, with-coversheet → no-coversheet).
  Asserts `numberOfPages` drops from `pdfDoc.getPageCount() + 1` to
  `pdfDoc.getPageCount()`.
- ❌ **No test** for scenario #2 (no-coversheet → with-coversheet add).

## Suggested test
Mirror `docketClerkEditsDocketEntryToRemoveCoversheet.test.ts` but in the
opposite direction:

1. Upload a Court Issued doc; add a docket entry with event code `TRAN` (or
   another code without `requiresCoversheet`). Assert `numberOfPages` ==
   `fakeFile pages` (no coversheet).
2. Edit the docket entry; change event code to `TE` (or any
   `requiresCoversheet: true` code). Assert `numberOfPages` ==
   `fakeFile pages + 1`.

Path suggestion:
`web-client/integration-tests/docketClerkEditsDocketEntryToAddCoversheet.test.ts`

## Why this matters
This is the symmetric path to the existing remove-coversheet test. Without
it, a regression that breaks the `shouldAddNewCoverSheet` branch (e.g. an
inverted boolean, or removing the call to `addCoversheetInteractor` when
`shouldAddNewCoverSheet` is true) would silently pass.

## Cross-reference
- [gap-04-missing-e2e-edit-docket-entry-court-issued-swap.md](./gap-04-missing-e2e-edit-docket-entry-court-issued-swap.md)
  covers the third combination — coversheet → coversheet (with title
  change). With this gap (#7) and #4 added, all four event-code transitions
  are covered.
