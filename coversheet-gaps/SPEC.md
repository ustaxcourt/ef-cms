# Coversheet Spec — Source of Truth

The following describes how coversheet generation must work in ef-cms. This
file is the authoritative reference; all gap files compare implementation
against this. Derived from the canonical product CSV.

## Coversheet functionality

### Party eFiles a document
- Coversheet is added to **every** party eFiled document.
- For **simultaneous** docs: **no** service stamp.
- For **all docs besides simultaneous**: coversheet **includes** service stamp.

### Document QC — eService parties only
- Docket Clerk completes QC on eFiled doc **without any document metadata
  edits** → **no changes** to original coversheet.
- Docket Clerk completes QC on eFiled doc **with edits to the document
  metadata** → **new coversheet is appended to the front of the document
  (original coversheet still exists)**.
- Fields that **DO** generate a new coversheet (positive whitelist):
  - Document Type
  - Additional info 1 (only when *add to coversheet* checkbox is checked)
  - Certificate of Service
- Fields that **DO NOT** generate a new coversheet:
  - Filed → Lodged
  - Additional info 1 (without checking *add to coversheet*)
  - Additional info 2
  - Attachments
  - Filed by
  - Add to pending report

#### Known quirk — Filed Date in QC
Edits to the filed date **will generate a new coversheet**, but no data
actually gets updated on the coversheet or on the docket record. Example:
filed date is 5/15/26, during QC, edit the filed date to 5/11/25 — a new
coversheet is generated, but the displayed filed date doesn't change and
the docket record still shows 5/15. Documented as a known issue; not a
fix to chase here (CSV: "we may need to overhaul coversheets all-together").

### Document QC — Paper Service parties
- Docket Clerk adds a paper filing, serves document → **no coversheet** is
  added to the print for paper service, **but a coversheet IS added** to the
  document on the docket record.
- Docket Clerk adds a paper filing, **saves for later**, then navigates back
  to the document to serve it at a later time → **no coversheet** is added
  to the print for paper service doc, **but a coversheet IS added** to the
  document on the docket record.

### Edit Docket Entry
- Docket Clerk edits an existing document on the docket record. Makes edits
  to the document metadata on the **Document Info tab** → **new coversheet
  is appended to the front of the doc (original coversheet still exists)**.
- Fields that **DO** generate a new coversheet (positive whitelist):
  - Filed Date
  - Document Type
  - Additional info 1 (only when *add to coversheet* checkbox is checked)
  - Certificate of Service
- Fields that **DO NOT** generate a new coversheet:
  - Filed → Lodged
  - Additional info 1 (without checking *add to coversheet*)
  - Additional info 2
  - Attachments
  - Certificate of service **date**
  - Filed by
  - Objections (for motions)
  - Add to pending report
- **Edits made to the Service or Action(s) tab do NOT generate a new
  coversheet.**

#### Known bug — Lodged + Filed Date + Additional Info ordering
Steps to reproduce (per CSV — documented but not currently being addressed;
the team is considering a broader overhaul):
1. Edit a docket entry from Filed → Lodged. No new coversheet is generated.
2. Edit the docket entry again, change the filed date (5/15 → 5/11). Filed
   date changes, new coversheet generated with new date, and the coversheet
   now reflects that the doc is lodged (from step 1).
3. Edit the docket entry again, add additional info 1 with "add to
   coversheet" checked. A new coversheet is generated, but the Received date
   has reverted to the original date instead of the date from step 2.

### Service of Simultaneous docs
- Docket Clerk serves an eFiled simultaneous document → **new coversheet is
  appended to the front of the doc (original coversheet still exists)**. The
  coversheet is the same, but a service stamp is added.
- Docket Clerk serves a paper-filed simultaneous document → **coversheet is
  added to the front of the document on the docket record** (includes the
  service stamp), but the print for paper service page does not include a
  coversheet.
- Docket Clerk saves a paper-filed simultaneous document for later, then
  clicks on the document from the docket record and serves → **coversheet
  is added to the front of the document on the docket record** (includes
  the service stamp), **and** the print for paper service page **does**
  include a coversheet.

### Court Issued documents with Coversheet
- Docket clerk adds a Court issued document that has a coversheet (e.g.,
  Returned Mail, U.S.C.A., etc.) and saves it to the docket record →
  **coversheet generated**.
- Docket clerk adds a Court issued document that has a coversheet (e.g.,
  Returned Mail), then **edits** the document to a different Court issued
  doc that has a coversheet (e.g., U.S.C.A.) → **new coversheet is appended
  to the front of the doc (original coversheet still exists)**.
- Docket clerk adds a Court issued document that has a coversheet, then
  edits the document and changes the document type to a Court document that
  does **NOT** have a coversheet → **coversheet is removed** and document
  is served.
- Docket clerk adds a Court issued document that does **NOT** have a
  coversheet (e.g., Opinion) and saves or serves it (no coversheet). Then
  edits the document and changes the document type to a Court issued
  document that has a coversheet → **coversheet is added** to the document.

### Consolidated filings (pre-8477)
- **Pre-8477 — Simultaneous**: Party eFiles a simultaneous doc across a
  group, Docket QCs each individual filing, **singular coversheet** upon QC.
  When Docket Clerk serves the simultaneous doc, they must serve it in each
  individual case. Upon service in each case, a **new coversheet is
  appended** to the original doc. For each case served, a new coversheet is
  appended each time.
  > Note: This will be resolved with 8477; the document will only have two
  > coversheets — the original and the new appended one with the service
  > stamp.

- **Pre-8477 — Metadata edit**: Party eFiles a doc across a group, Docket
  QCs each individual filing and each filing needs an update to the
  metadata. They must QC it in each individual case. Upon QC in each case,
  a **new coversheet is appended** to the original doc. For each case QC'd,
  a new coversheet is appended each time.
  > Note: This will be resolved with 8477; the document will only have two
  > coversheets — the original and the new appended one with the service
  > stamp.
