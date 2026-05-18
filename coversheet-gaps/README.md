# Coversheet Logic — Audit & Gaps

Audit of the current ef-cms coversheet behavior against the canonical
spec, sourced from the latest product CSV (see [SPEC.md](./SPEC.md)).

Each `gap-*.md` file describes a divergence between code and spec, or a
missing e2e test. Each one is self-contained: the file paths, line numbers,
current behavior, expected behavior, and a suggested fix are captured so
the file can be picked up later without re-running the audit.

> **Spec update note (2026-05-18)**: The product CSV was updated to use a
> narrow positive whitelist of fields that trigger coversheet regen,
> rather than the prior "everything except 3 exceptions" framing. This
> re-verification superseded two prior MAJOR gaps and surfaced one new
> investigation item:
> - **gap-01** (QC replaces coversheet): FIX IN PROGRESS — already
>   applied on this branch (`completeDocketEntryQCInteractor.ts` no longer
>   passes `replaceCoversheet: true`; cypress assertions updated to expect
>   3 pages instead of 2).
> - **gap-02 & gap-03** (QC and Edit Docket Entry narrow field detection):
>   SUPERSEDED and deleted — implementation matches the new narrow
>   whitelist. Residual `servedAt` concern from gap-03 moved to gap-10.
> - **gap-10** (NEW): investigate whether `servedAt` regen path is dead
>   code, intentional, or a true divergence from the Service-tab-no-regen
>   rule.

## Verified-correct behavior

These spec scenarios are implemented correctly today:

| Scenario | Where |
|---|---|
| Party eFile: coversheet on every party-eFiled doc | `web-api/src/business/useCases/externalDocument/fileExternalDocumentInteractor.ts:245-251` |
| Party eFile: simultaneous = no service stamp on coversheet | `shared/src/business/entities/DocketEntry.ts:455-474` (`isAutoServed` returns false for Simultaneous) + `web-api/src/business/useCases/generateCoverSheetData.ts:69-71` (`dateServed` is empty when `servedAt` is null) |
| Party eFile: non-simultaneous = service stamp on coversheet | Same — auto-served sets `servedAt`, populates `dateServed` |
| Document QC: no metadata edits = no new coversheet | `completeDocketEntryQCInteractor.ts:158-162` (`needsNewCoversheet`) |
| Document QC: regen on Document Type / Additional info (with checkbox) / Certificate of Service / Filed Date | `completeDocketEntryQCInteractor.ts:406-430` via `getDocumentTitleWithAdditionalInfo` semantics |
| Document QC: NO regen on Lodged toggle / addInfo w/o checkbox / addInfo2 / Attachments / Filed by / Pending report | Same predicate — none of these are checked |
| Document QC: APPENDS coversheet (does not replace) | `completeDocketEntryQCInteractor.ts:379-387` — no longer passes `replaceCoversheet: true` (fix-in-flight on this branch) |
| Document QC paper service: no coversheet on print, coversheet on docket doc | `addPaperFilingInteractor.ts:213-229` (paperServicePdf generated BEFORE `enqueueAddCoversheet`) |
| Save-for-later then serve-later: coversheet added on serve only | `addPaperFilingInteractor` skips `enqueueAddCoversheet` when `isSavingForLater` is true; `editPaperFilingInteractor.serveDocketEntry` enqueues it (`editPaperFilingInteractor.ts:332-336`) |
| Edit Docket Entry: regen on Filed Date / Document Type / Additional info (with checkbox) / Certificate of Service | `updateDocketEntryMetaInteractor.ts:212-230` |
| Edit Docket Entry: NO regen on Lodged toggle / addInfo w/o checkbox / addInfo2 / Attachments / CoS date / Filed by / Objections / Pending report | Same predicate — none of these are checked |
| Edit Docket Entry: Service/Actions tab edits (`servedPartiesCode`, `judge`, `trialLocation`, `action`, `date`) do not regen | Same predicate — none of these are checked |
| Service of Simultaneous: NEW coversheet appended (original kept) | `serveExternallyFiledDocumentInteractor.ts:165-174` calls `addCoversheetInteractor` with `replaceCoversheet` defaulting to false |
| Court Issued doc with coversheet (e.g., RM, USCA): coversheet generated | `fileCourtIssuedDocketEntryInteractor.ts:195-206` |
| Court Issued: coversheet doc → no-coversheet doc edit → coversheet removed | `updateDocketEntryMetaInteractor.ts:190-200` (`removeCoversheet`) |
| Court Issued: no-coversheet doc → coversheet doc edit → coversheet added | `updateDocketEntryMetaInteractor.ts:126-127` (`shouldAddNewCoverSheet`) |
| Court Issued: coversheet doc → another coversheet doc edit → APPENDED (original kept) | `updateDocketEntryMetaInteractor.ts:171-187` calls `addCoversheetInteractor` without `replaceCoversheet` (defaults to false → append) |

## Gaps

| # | File | Severity | One-liner |
|---|---|---|---|
| 1 | [gap-01-qc-replaces-coversheet.md](./gap-01-qc-replaces-coversheet.md) | RESOLVED in-flight | Document QC was REPLACING coversheet; now appends per spec. Tests updated on this branch. |
| 4 | [gap-04-missing-e2e-edit-docket-entry-court-issued-swap.md](./gap-04-missing-e2e-edit-docket-entry-court-issued-swap.md) | MEDIUM | Missing e2e: court-issued-with-coversheet → another-court-issued-with-coversheet appends new coversheet |
| 5 | [gap-05-missing-e2e-paper-service-print-vs-docket.md](./gap-05-missing-e2e-paper-service-print-vs-docket.md) | MEDIUM | Missing e2e: paper-service print PDF has no coversheet but docket entry doc does |
| 6 | [gap-06-missing-e2e-save-for-later-then-serve.md](./gap-06-missing-e2e-save-for-later-then-serve.md) | MEDIUM | Missing e2e: save-for-later then serve-later still produces coversheet on docket doc |
| 7 | [gap-07-missing-e2e-edit-docket-entry-coversheet-toggling.md](./gap-07-missing-e2e-edit-docket-entry-coversheet-toggling.md) | MEDIUM | Missing e2e: court-issued add → edit removes coversheet; opinion → edit adds coversheet |
| 8 | [gap-08-missing-e2e-edit-docket-entry-service-tab-no-regen.md](./gap-08-missing-e2e-edit-docket-entry-service-tab-no-regen.md) | MEDIUM (was LOW) | Missing e2e: Service/Actions tab edits do NOT regenerate coversheet (negative control). Promoted because the new CSV calls this out as an explicit rule. |
| 9 | [gap-09-missing-e2e-additionalinfo-add-to-coversheet-toggle.md](./gap-09-missing-e2e-additionalinfo-add-to-coversheet-toggle.md) | LOW | Missing e2e: additionalInfo with add-to-coversheet=true generates new coversheet; without checkbox does not |
| 10 | [gap-10-served-at-regen-vs-service-tab-rule.md](./gap-10-served-at-regen-vs-service-tab-rule.md) | NEEDS INVESTIGATION | `servedAt` triggers coversheet regen in Edit Docket Entry, but Service tab edits shouldn't per spec — confirm if path is dead code, intentional, or a real divergence |

## Documented quirks (NOT to fix here)

The new CSV explicitly documents two known issues the product team is
parking for a possible broader coversheet overhaul. Do **not** chase
these as bugs in this audit:

- **Filed Date in QC**: regenerates a coversheet, but the displayed filed
  date doesn't change on the coversheet or docket record.
- **Lodged + Filed Date + Additional Info ordering** in Edit Docket Entry:
  step 3 (adding additional info with the checkbox) reverts the Received
  date to the original value instead of the date set in step 2.

See [SPEC.md](./SPEC.md) for full reproduction steps.
