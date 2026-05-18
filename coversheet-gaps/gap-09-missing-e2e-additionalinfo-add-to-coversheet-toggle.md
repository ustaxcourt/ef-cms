# Gap 09 — Missing e2e: additionalInfo with `add to coversheet` checked vs unchecked

**Severity: LOW (test coverage; precise behavior pin)**

## Spec
> Edits to **Additional info 1 (without checking *add to coversheet*)** are
> one of the three exceptions — they do **NOT** generate a new coversheet.
>
> If you add additional info 1 **AND** check the box for *add to coversheet*,
> then a new coversheet IS generated.

## Current code
This works today by virtue of `getDocumentTitleWithAdditionalInfo`
behavior:

`web-api/src/business/useCases/generateCoverSheetData.ts:88-92`:

```ts
let documentTitle =
  docketEntryEntity.documentTitle || docketEntryEntity.documentType;
if (docketEntryEntity.additionalInfo && docketEntryEntity.addToCoversheet) {
  documentTitle += ` ${docketEntryEntity.additionalInfo}`;
}
```

So:
- `addToCoversheet=true` + `additionalInfo` change → title differs → both
  `needsNewCoversheet` (QC) and `shouldGenerateCoversheetForDocketEntry`
  (Edit) trigger via the `documentTitleUpdated` flag.
- `addToCoversheet=false` + `additionalInfo` change → title unchanged → no
  regen.

## Existing test coverage
- `docket-clerk-qc-doc-type-change-regenerates-coversheet.cy.ts` covers QC
  with `additionalInfo + addToCoversheet checked` — but it asserts the
  WRONG (current replace) behavior; see
  [gap-01-qc-replaces-coversheet.md](./gap-01-qc-replaces-coversheet.md).
- `document-title.cy.ts` exercises the same path but only asserts the title
  rendering in My Outbox, not the resulting page count.
- ❌ **No negative-control test** that adds `additionalInfo` without
  checking the box and asserts no coversheet regeneration.

## Suggested tests
Two complementary cases:

**Test A: `additionalInfo` without checkbox does NOT regen**
1. Externally file an Exhibit; assert page count = 2 (1 doc + 1 coversheet).
2. QC the entry; type `additionalInfo` but do NOT check
   `add-to-coversheet`.
3. Save and finish QC.
4. Assert `numberOfPages` is still 2.
5. Assert no Notice of Docket Change is created (since the title with
   addToCoversheet=false is unchanged for the NODC comparison too).

**Test B: `additionalInfo` WITH checkbox DOES regen**
This is what `docket-clerk-qc-doc-type-change-regenerates-coversheet.cy.ts`
already exercises — but its expected page count needs to be updated to `3`
when [gap-01-qc-replaces-coversheet.md](./gap-01-qc-replaces-coversheet.md)
is fixed (so the new coversheet appends rather than replaces).

Path suggestion:
`cypress/local-only/tests/integration/documentQC/docket-clerk-qc-additional-info-without-checkbox-no-regen.cy.ts`

## Why this matters
The interaction between `additionalInfo` and `addToCoversheet` is one of
the three explicit exceptions in the spec. Without an explicit test for the
unchecked path, a refactor that always concatenates `additionalInfo` into
the title — or that adds `additionalInfo` to the trigger field list (see
[gap-02-qc-narrow-field-detection.md](./gap-02-qc-narrow-field-detection.md))
without preserving the addToCoversheet gate — would silently violate the
spec.

## Cross-reference
- [gap-01-qc-replaces-coversheet.md](./gap-01-qc-replaces-coversheet.md)
- [gap-02-qc-narrow-field-detection.md](./gap-02-qc-narrow-field-detection.md)
- [gap-03-edit-docket-entry-narrow-field-detection.md](./gap-03-edit-docket-entry-narrow-field-detection.md)
