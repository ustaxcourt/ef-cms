---
applyTo: "shared/src/business/utilities/documentGenerators/**"
---

# Document Generator Conventions

## Purpose

Rules for PDF document generators and their visual-diff tests.

## Visual PDF Tests

- DAWSON uses a custom image diffing utility: `generateAndVerifyPdfDiff`
  in `shared/src/business/utilities/documentGenerators/generateAndVerifyPdfDiff.ts`
- It relies on `pdf2pic` and `pixelmatch`
- Refer to existing `*.test.ts` files in the same directory for usage examples
- New or materially altered PDF generators must ship with a `generateAndVerifyPdfDiff`-based
  snapshot test

## Test Suite

- These files use the `test:document-generation` suite, not `test:shared`
- Run: `npm run test:document-generation`
- Single file: `npm run test:document-generation:file -- path/to/file.test.ts`

## Clean Architecture

- Document generators live in `shared/` — no browser-only code allowed
- Access via `applicationContext.getDocumentGenerators()`
