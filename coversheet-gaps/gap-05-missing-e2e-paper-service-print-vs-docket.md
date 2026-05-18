# Gap 05 — Missing e2e: paper-service print PDF has no coversheet but docket entry doc does

**Severity: MEDIUM (test coverage)**

## Spec
> Docket Clerk adds a paper filing, serves document — **no coversheet** is
> added to the print for paper service, **but a coversheet IS added** to the
> document on the docket record.

## Current code
`web-api/src/business/useCases/docketEntry/addPaperFilingInteractor.ts:213-229`:

```ts
const paperServiceResult = await applicationContext
  .getUseCaseHelpers()
  .serveDocumentAndGetPaperServicePdf({
    applicationContext,
    caseEntities,
    docketEntryId,
    ...
  });

paperServicePdfUrl = paperServiceResult && paperServiceResult.pdfUrl;

await enqueueAddCoversheet(applicationContext, {
  authorizedUser,
  docketEntryId,
  docketNumber: subjectCaseDocketNumber,
});
```

The print/paper-service PDF is generated **before** the coversheet is
enqueued, so the printed PDF has no coversheet. The docket entry doc gets a
coversheet asynchronously via the worker.

## Existing tests (close but not asserting both sides)
- `cypress/local-only/tests/integration/documentQC/docket-clerk-qcs-paper-filing.cy.ts`
  asserts the docket entry shows page count 2 (1 doc + 1 coversheet) after
  serving but **does not** download / inspect the paper-service PDF and
  assert it has no coversheet.
- `cypress/local-only/tests/integration/documentQC/docket-clerk-paper-files-across-consolidated-cases.cy.ts`
  same — docket entry assertion only.

## Suggested test
Add a Cypress test that:

1. Logs in as a docket clerk.
2. Adds a paper filing to a case that has at least one paper-service party.
3. Serves the document.
4. Captures the URL returned in the success notification's `pdfUrl` /
   `paperServicePdfUrl` field.
5. Downloads that PDF (or intercepts the request) and asserts page count
   matches the original doc + address page only — **not** including the
   coversheet (which is `+1` more).
6. Asserts the docket entry's `numberOfPages` reflects the doc + coversheet.

Path suggestion:
`cypress/local-only/tests/integration/documentQC/docket-clerk-paper-service-print-omits-coversheet.cy.ts`

The existing `serveDocumentAndGetPaperServicePdf` helper already returns
the URL — no new infrastructure needed.

## Alternative: backend integration test
If downloading and parsing PDF in Cypress is heavy, the same assertion can
be made at the integration-test layer:
`web-api/integration-tests/.../paperServicePdfOmitsCoversheet.test.ts`
that mocks the persistence layer and verifies the byte stream passed to
`saveDocumentFromLambda` for the paper-service PDF has page count = doc + 1
(address page) and not doc + 2 (address + coversheet).

## Why this matters
The current ordering — paper service generated then coversheet queued — is
the load-bearing invariant. A future refactor that hoists `enqueueAddCoversheet`
above `serveDocumentAndGetPaperServicePdf` (or makes it sync) would silently
add the coversheet to printed mail, which is a real-world workflow break.
