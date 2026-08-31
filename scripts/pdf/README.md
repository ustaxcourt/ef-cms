# PDF cross-reference tools

Five scripts for diagnosing and repairing a PDF that Adobe refuses to open —
"There was a problem reading this document (109)", or a page count of 0 of 0 —
while Chrome and the DAWSON viewer render it without complaint, and for
measuring how many stored documents are affected.

| script | reads | what it is for |
| --- | --- | --- |
| [`pdf-doctor`](#pdf-doctor) | one local file | is *this* document affected, and repair it |
| [`pdf-triage`](#pdf-triage) | a local folder | which of these documents are affected |
| [`pdf-compare`](#pdf-compare) | two local files | did a repair alter any content |
| [`pdf-audit`](#pdf-audit) | S3 + the database | how many stored documents are affected, by month |
| [`pdf-fixture`](#pdf-fixture) | nothing | writes a valid PDF that breaks when a pipeline re-saves it |

Only `pdf-audit` needs an AWS session or touches the network.

## The defect these tools address

A PDF ends with a cross-reference section: a list of byte offsets that tells a
reader where each object lives. It is written as subsections, each declaring a
first object number and a count, with the rows that follow taken to be
consecutive from there.

pdf-lib builds the section by walking its objects in ascending object number,
starting a new subsection only when the object number advances by more than
one. A document that carries the same object number at two different
*generation* numbers — what an incremental save by an external editor such as
Acrobat leaves behind — contributes two rows under a single object number. The
subsection's count then overshoots by one, and **every row after the duplicate
is attributed to the wrong object.**

Both of pdf-lib's writers share this defect, so `useObjectStreams: false` does
not prevent it. It only leaves plain-text object headers in the file, which
gives a reader something to recover from. PDFium (Chrome) and pdf.js rebuild a
broken section by rescanning and render the document anyway; Adobe's engine,
which backs both Acrobat and Edge on Windows, rejects it outright. That is why
an affected document renders everywhere except the two places that matter most.

### How it is detected

Detection is two steps: a cheap screen over the trailing bytes, then a short
read that settles what the screen found.

**The screen.** The duplicate leaves no trace in the numbering: a subsection
names a start and a count, so the shifted rows still read as consecutive object
numbers. What it does leave is a **generation number**. Two entries under one
object number must differ in generation — pdf-lib keys its objects by number
*and* generation together, so an exact repeat could not be held twice — so
every duplicate shows up as an in-use entry above generation zero, in a
document with no `/Prev` and no `/XRefStm`.

Neither writer can hide one. `PDFStreamWriter` excludes any object whose
`generationNumber !== 0` from an object stream, so the residue is always a
top-level entry carrying its generation, never a compressed entry whose second
field means something else.

**Why the screen is not the verdict.** A document can carry an object at
generation 1 with no collision at all — the ordinary residue of a source that
once freed and reused an object number. Such a document is perfectly sound and
opens without complaint, and *nothing in the trailing bytes distinguishes it
from a real duplicate*. Treating the screen as a verdict accuses those files.

**The confirmation.** What separates them is whether the rows are *displaced*,
so the flagged document is checked against the object headers its rows point
at:

| the header says | meaning |
| --- | --- |
| the object the row is filed under | correctly attributed there |
| a **lower** object number | rows have been displaced — a duplicate sits earlier in the same subsection, and every entry from here on resolves to the wrong object |

That costs a read of a few dozen bytes per probed row, and only for the
minority of documents the screen flags. It reads object headers, never document
content.

**Which rows get probed, and why it is not the obvious one.** The tempting
choice is the row carrying the raised generation. That is wrong, and it clears
genuinely broken files. `enumerateIndirectObjects` sorts by object number with
*no tiebreaker on generation*, so of a duplicated pair either copy may be
written first:

| written first | row 0 | row 1 |
| --- | --- | --- |
| generation 0 | filed under 2, gen 0 — correct | filed under **3**, gen 1 → points at `2 1 obj` — **displaced** |
| generation 1 | filed under 2, gen **1** → points at `2 1 obj` — correct | filed under **3**, gen 0 → points at `2 0 obj` — **displaced** |

In the second ordering the displaced row sits at generation *zero*, so a check
that only reads rows above generation zero sees nothing wrong and clears the
file. Both orderings occur, and the second is the one qpdf reports as `unable
to find /Root dictionary`.

So the probe set is the **last in-use row of every subsection holding
residue** — displaced under either ordering, because the duplicate is
necessarily somewhere before it in the same subsection — together with the
residue rows themselves. A new subsection declares a fresh starting object
number and re-anchors the numbering, which is why the subsection, not the
section, is the unit.

`displacedObjectNumber` reports where misattribution begins. It is **not** the
duplicated object: that one sits earlier in the subsection, and naming it takes
a full read of the document — `pdf-doctor check`, or the audit's `--deep`.

**What these tools no longer do** is compare the entry count against `/Size`.

`/Size` is one greater than the highest object number, not a count of rows, so
any document with unused object numbers legitimately declares *fewer* rows than
`/Size`. A shortfall therefore proves nothing, and treating it as damage
reported healthy documents as broken.

A **surplus** is the opposite: gaps can only subtract, so more rows than
`/Size` accounts for can only come from object numbers appearing twice. That
direction is proof, it costs no reads, and it reaches a case the probes cannot
— a duplicate whose copies are both compressed still inflates the count.

The two are complementary rather than redundant. A document carrying both a
duplicate and a gap has the deficit cancel the surplus exactly, leaving the
arithmetic silent; the displaced row still catches it.

### The three signals

Each can condemn or abstain. None can acquit on its own.

| signal | cost | what it proves |
| --- | --- | --- |
| more rows than `/Size` accounts for | free | a duplicate exists |
| a displaced row | ~64 bytes per probed row | a duplicate exists, and where misattribution begins |
| probe **coverage** | free | whether a clean pass means anything |

Coverage is the one that decides whether a document may be cleared. A probe
needs a type-1 row, because a compressed row's second field is an object stream
number and a free row's is the next free object number — neither is a byte
offset. If the *last* row of a subsection holding residue is probeable and it
checks out, every duplicate in that subsection would have displaced it, so a
clean pass is real. If that last row cannot be probed, a clean pass proves
nothing: the duplicate could sit past the last row anyone can read. The
document then stays a candidate rather than being cleared.

## pdf-doctor

Reports whether a document's cross-reference table is sound, and optionally
writes a repaired copy.

```bash
./scripts/pdf/pdf-doctor.ts check <file.pdf>
./scripts/pdf/pdf-doctor.ts fix   <in.pdf> <out.pdf>
```

`check` reads the file, prints a verdict, and lists any duplicated object
numbers. It modifies nothing:

```
--- cross-reference table ---
  input
    /Size            9
    entries          10
    DUPLICATED: the entry filed under object 3 points at object 2, so object 2
                is held at two generations and every entry from there on is
                attributed to the wrong object

--- duplicate object numbers ---
  objects in context      9
  object #2 (/Catalog): generations 0*, 1   kept gen 0
  (* = reachable from /Root, i.e. the live copy)
```

| status | meaning |
| --- | --- |
| `VALID` | no residue, or residue cleared with proven coverage |
| `DUPLICATED` | **this defect** — proven, by arithmetic or by a displaced row |
| `RESIDUE` | screened, unproven either way: a candidate |
| `INDETERMINATE` | the section could not be judged at all |

`RESIDUE` and `INDETERMINATE` are different kinds of unknown. `INDETERMINATE`
means the screen never ran — an incremental or hybrid file, or a section that
would not decode. `RESIDUE` means the screen fired and the confirmation could
not settle it, either because a probe was unreadable or because coverage was
incomplete. A `RESIDUE` document is a suspect; an `INDETERMINATE` one is not.

Note the two object numbers in that output. Misattribution begins at object
**3**, which the section alone proves; the collision is on object **2**, which
the full read names.

`INDETERMINATE` is not a failure. It is returned for documents that cannot
meaningfully be judged:

- **incrementally updated** files, in which reusing an object number at a
  higher generation is exactly what a conforming free-and-reuse produces;
- **hybrid-reference** files, which carry a classic table for older readers
  beside a cross-reference stream holding the rest, linked by `/XRefStm`, so
  the classic table describes only part of the document by design;
- sections that cannot be walked or decoded safely — a non-conforming entry
  width, a filter other than `FlateDecode`, a predictor outside the PNG set;
- residue whose offset holds no readable object header, so the confirmation
  cannot settle it either way.

Reporting "unknown" is deliberate: a legitimate file must never be accused.
This check runs *before* generation numbers are looked at, so neither kind can
be reported as `DUPLICATED` even when it carries entries above generation zero.

The `/Type` in parentheses locates the collision within the document. `Catalog`,
`Pages` and `Page` are the structural spine that every editing pass rewrites, so
duplicates concentrate there — and that is the worst place for one to land,
because the section misattributes every row *after* the duplicate. A collision at
a low object number therefore corrupts the rows a reader follows to reach
`/Root`, which is why the failure presents as "0 of 0 pages" rather than a
missing image. Objects that declare no type at all, such as content streams,
print `untyped`.

`fix` removes the superseded copy of each duplicated object number and rewrites
the document with a classic cross-reference table:

```
--- repair ---
  objects in context      7
  duplicate refs removed  1
  object #2 (/Catalog): generations 0*, 1   kept gen 0
  (* = reachable from /Root, i.e. the live copy)
  duplicate refs removed  1
  written                 1262 bytes
```

Which copy survives is decided by reachability from `/Root`, never by age. A
reference names a specific generation, and the live copy may be either one — an
observed document kept generation 0 alive while generation 1 was the dead
leftover. Deleting "the older one" removes objects the document still uses.

Nothing reachable is discarded, so content is preserved. Confirm that with
`pdf-compare` rather than taking it on faith.

## pdf-triage

Reads every PDF in a folder and reports which ones carry a duplicated object
number. Local files only: no AWS session, no network, and nothing is written.

```bash
./scripts/pdf/pdf-triage.ts <folder> [--verbose]
```

```
  file                      verdict        duplicated objects
  clean.pdf                 VALID          -
  duplicate-gen0-first.pdf  DUPLICATED     2:/Catalog
  duplicate-gen1-first.pdf  DUPLICATED     2:/Catalog
  sound-reuse.pdf           VALID          -
  truncated.pdf             INDETERMINATE  -

--- summary ---
  DUPLICATED          2
  INDETERMINATE       1
  VALID               2
```

Because a local file can be read in full, every document gets the definitive
verdict rather than the screen's provisional one — the same settling
`pdf-audit --deep` performs, without the download. So `RESIDUE` never survives
here unless pdf-lib cannot load the file.

`--verbose` adds the reason for each document. Non-PDF files are ignored.

Use it on a folder of files pulled out of an audit. `qpdf` remains a useful
independent second opinion across the same folder:

```bash
for f in <folder>/*.pdf; do echo "== $f"; qpdf --check "$f" 2>&1 | tail -3; done
```

## pdf-compare

Proves whether a repair altered document content.

```bash
./scripts/pdf/pdf-compare.ts <original.pdf> <repaired.pdf>
```

A repair rewrites the document's structure, so comparing the files byte for
byte says nothing useful. Instead, every content stream in both files is
decoded and hashed, and the two sets of hashes are compared. Cross-reference
streams and object streams are excluded, because reorganising those is exactly
what a repair is for.

```
--- content streams (structural excluded) ---
  streams                       1         1   same
  byte-identical        1
  only in original      0
  only in repaired      0

VERDICT
  every content stream is byte-identical and the page count matches - no
  document content was altered
```

The verdicts to act on:

- **page count changed** — do not trust the repair, investigate.
- **streams only in the repaired file** — content was invented, investigate.
- **no shared content streams at all** — you are almost certainly comparing two
  different documents; nothing else in the output is meaningful.
- **streams dropped from the original** — expected when the original carried
  superseded revisions, since those objects are unreachable and no reader was
  rendering them.

Only hashes and counts are printed, never stream data, so a comparison can be
shared without disclosing the contents of the document.

### Warnings it raises

Re-serialising a document is not free. `pdf-compare` reports when any of these
were present in the original:

- a **digital signature** — re-serialising almost certainly invalidates it,
  whether or not the signature object survives
- **encryption** — the repaired file will not be encrypted
- **`/AcroForm` form fields** or an **XFA form** that did not survive

For a court document of record, those are decisions to escalate, not to absorb
into a repair.

## pdf-audit

Surveys documents already in S3 and reports how many carry the defect, broken
down by month. **Read-only** — it never writes to S3 or the database.

```bash
./scripts/pdf/pdf-audit.ts <startDate> <endDate> \
  [--deep] [--limit N] [--newest] [--output report.csv] [--concurrency N]
```

Requires `ENV` and an active AWS session. It must be run by an operator against
the environment being surveyed; it is not something to run from an agent
session.

### How it reads so little

The verdict depends only on the cross-reference section and the trailer, which
both sit at the end of a document. `pdf-audit` issues a range request for the
final 2KB to read `startxref`, then a second for the section it points at —
skipping the second when the section already fell inside the first, which for a
small document it usually does.

That means roughly 2–60KB per document instead of the whole file, and **no page
content, image data or embedded text is ever transferred.** A survey of court
documents stays proportionate as well as cheap: at that size a full census is
affordable rather than a sample, and a million documents costs well under a
dollar in request charges.

A screened document costs one extra request per probed row — a few dozen bytes
at a known offset — to settle it. That is the only case where the survey
reaches into the body of a document.

`--deep` opts into downloading the whole file, for flagged documents only. It
enumerates the document's objects directly rather than trusting byte offsets,
so it settles every `RESIDUE` candidate either way — promoting it to
`DUPLICATED` or clearing it to `VALID` — and names the object that actually
collided, with its `/Type`. Documents pdf-lib cannot load stay as they were,
since a file too damaged to parse is evidence rather than an absence of it.

### How fast it goes

A survey is bound by request latency, not by work, so `--concurrency` (default
100) is the only knob that matters. It sizes both the number of documents in
flight and the HTTP connection pool, which is the part that makes it real: the
shared `getStorageClient` fixes its pool at 75 sockets, and past that limit
extra workers only queue for a connection. `pdf-audit` builds its own client so
that raising the flag raises throughput.

Tune it against a measurement rather than a guess. The run reports its rate:

```
  12000/166191  310/s  ~8m left
  ...
  8.9 min at 310 document(s)/s
```

Re-run a `--limit 5000` slice at a higher concurrency and compare. Retries are
adaptive, so a value set too high backs off rather than failing — though the
ceiling in practice is usually the operator's own link, not S3.

### Settling the candidates

A `RESIDUE` document is one whose duplicate, if any, sits where no byte offset
reaches: inside an object stream. Settling it exactly means fetching that
object stream, inflating it and reading its header pairs, which is a whole
object download rather than a few dozen bytes. That is not done by default,
deliberately — it is worth paying only for however large the candidate bucket
turns out to be, and `--deep` already downloads and settles any document you
want a definitive answer on.

### Enumeration

Documents come from a `dwDocketEntry` query over `createdAt`, not from listing
the bucket. The database knows which documents the application actually
references and when each was created; S3's `LastModified` changes on any later
copy and would misdate them.

**`--limit` truncates the range; it does not sample it.** The query orders by
`createdAt` ascending, so `--limit 5000` over a year returns the oldest 5,000
documents — which may be the first few days of it — and reports 0 affected for
every month it never reached. That reads like a clean bill of health and is
not one. `--newest` flips the order to take the most recent instead, which is
the useful half when you are checking whether a recent change introduced the
defect. The run prints a warning whenever a limit is in force, naming the date
range it actually covered.

Because a full census costs so little, prefer narrowing the *dates* over
setting a limit. A limit is for timing a `--concurrency` change, not for
estimating scope.

### What it reports

A CSV of identifiers, verdicts and counts — `documentStorageId`, `createdAt`,
`eventCode`, `isAutoGenerated`, `status`, `/Size`, entry count, the screened
residue, the object number misattribution begins at, the `--deep` type survey
and the reason. No
captions, party names, docket numbers or document text. Plus a summary:

```
--- verdicts ---            (illustrative, not from a real run)
  VALID                 48210  97.42%
  INDETERMINATE          1104   2.23%
  DUPLICATED              167   0.34%
  RESIDUE                  42   0.08%
  UNREADABLE                9   0.02%

  167 confirmed, 42 unproven candidate(s);
  the number actually affected is between 167 and 209.

--- confirmed by month ---
  2025-09      12 /    4021  0.30%
  2025-10      15 /    4388  0.34%
  ...
```

The count is reported as a bracket rather than a single number, because a
single number would be false in one direction or the other: `DUPLICATED` alone
is a floor, and `DUPLICATED + RESIDUE` a ceiling. If the candidate bucket turns
out small, settling it exactly is cheap — see below.

`pdf-audit` adds one verdict of its own to the three `pdf-doctor` reports.
**`UNREADABLE`** is not a judgement about the document — it means the survey
never got far enough to reach one, because S3 did not hand over the bytes: a
`documentStorageId` with no object behind it (`NoSuchKey`), `AccessDenied`, a
zero-byte object (`InvalidRange`), or a timeout that outlived its retries.
Parsing itself never throws; an undecodable section is `INDETERMINATE`. The
`reason` column carries the first line of the underlying error.

A `--deep` failure is recorded in the `duplicateTypes` column instead, so that
a document too damaged for pdf-lib to load keeps the `DUPLICATED` verdict its
cross-reference section already earned.

### Why a hit is evidence, not just a count

`judge` in `pdf-doctor.helpers.ts` returns `INDETERMINATE` for any
incrementally updated document *before* it looks at generation numbers, so a
`DUPLICATED` verdict is only ever reached on a single-revision file. And it is
never reached on the screen alone: a header at a known offset has to have been
read and seen to name the wrong object. Every hit is therefore evidence of a
non-conforming rewrite, not of an unusual source document.

A count, on the other hand, is a floor rather than a total: `INDETERMINATE`
documents are not cleared, only set aside.

What the survey establishes is **scope and history**: how many documents are
affected and how far back it goes. It does not establish causation on its own,
and does not need to — that was settled directly by injecting a duplicate into
a document, saving it through pdf-lib, and watching qpdf report `unable to find
/Root dictionary`.

Note also that there is no clean control group in S3 to compare against:
[uploadPdfFromClient.ts](../../web-client/src/persistence/s3/uploadPdfFromClient.ts)
re-saves every browser upload through pdf-lib to strip metadata, and
coversheeting re-saves most of the rest, so nearly every stored document has
passed through a pdf-lib save.

## pdf-fixture

Writes a synthetic **valid** PDF that carries the precondition for the defect,
for testing an ingest pipeline end to end.

```bash
./scripts/pdf/pdf-fixture.ts ~/Downloads/fixture.pdf [--pages 2]
```

The output is an incrementally updated document: a normal first revision,
followed by an appended revision that supersedes the `/Catalog` at generation
1. That is exactly what an Acrobat "Save" produces, and it is entirely legal —
a conforming reader follows the last cross-reference section, resolves `/Root`
to the new generation, and ignores the superseded copy still sitting in the
file.

pdf-lib is the odd one out. `PDFParser.parseDocument` scans the whole file for
`N G obj` headers instead of following the cross-reference table, so it
registers *both* copies as distinct objects and writes both rows under one
object number.

So the fixture opens cleanly everywhere and breaks the moment a pipeline
re-saves it through pdf-lib. That difference is the point: it isolates the
pipeline as the variable.

The script proves both halves for you: it judges the file it just wrote, then
re-saves it through pdf-lib in memory and judges that. If the round trip does
*not* damage the document, it says so and **exits 2** — a fixture that no
longer reproduces the defect would silently clear a pipeline that is still
broken, so a failure here is a hard one.

```
--- the fixture as written ---
  INDETERMINATE: the document is incrementally updated, so entries above
                 generation zero are the expected result of a conforming
                 free-and-reuse

--- after one pdf-lib load and save ---
  DUPLICATED: the row filed under object 3 points at object 2, so rows have
              been displaced and every entry from there on is attributed to
              the wrong object
```

Verify independently with `qpdf --check` before using it: the fixture must
report `No syntax or stream encoding errors found`. Then upload it through the
application and check what comes back out of storage.

### The committed fixture

A generated copy is checked in at
[incremental-catalog.pdf](../../cypress/helpers/file/incremental-catalog.pdf) —
two pages, `qpdf --check` clean — so the round trip can be exercised without
regenerating it.

[upload-incremental-catalog-pdf.cy.ts](../../cypress/deployed-and-local/integration/fileUpload/upload-incremental-catalog-pdf.cy.ts)
drives it through the real upload path: it creates its own case, uploads the
fixture as a docket entry, and writes the resulting storage key to
`cypress/downloads/incremental-catalog-storage-key.txt`. Pull that object down
and run `pdf-doctor check` on it — a `DUPLICATED` verdict on bytes that were
`VALID` before the upload puts the damage inside the pipeline.

It lives in `deployed-and-local` so it can run against a deployed environment,
which an operator must do; an agent session cannot. It creates its own case
rather than using a seeded one, and its single `cy.intercept` — normally a
DON'T under [CYPRESS-README](../../cypress/CYPRESS-README.md) — is there only to
capture the storage key, which is not otherwise exposed to the UI. The spec
comments say so at the call site.

## Typical workflow

```bash
# 0. How widespread is this? (operator-run, against a chosen environment)
./scripts/pdf/pdf-audit.ts 2025-08-01 2026-08-01 --deep --output audit.csv

# 1. Pull the flagged documents into a folder, then confirm them in bulk.
./scripts/pdf/pdf-triage.ts ~/Downloads/flagged --verbose

# 2. Is this one document actually affected, and which object collided?
./scripts/pdf/pdf-doctor.ts check ~/Downloads/afflicted.pdf

# 3. If it reports DUPLICATED, repair it.
./scripts/pdf/pdf-doctor.ts fix ~/Downloads/afflicted.pdf ~/Downloads/repaired.pdf

# 4. Prove the repair changed no content before accepting it.
./scripts/pdf/pdf-compare.ts ~/Downloads/afflicted.pdf ~/Downloads/repaired.pdf
```

To test a pipeline rather than a document, start from a file known to be sound:

```bash
# Write a valid fixture carrying the precondition, upload it, fetch it back.
./scripts/pdf/pdf-fixture.ts ~/Downloads/fixture.pdf
qpdf --check ~/Downloads/fixture.pdf          # must be clean before you start
./scripts/pdf/pdf-doctor.ts check ~/Downloads/from-storage.pdf
```

If `qpdf` is installed, it is a useful independent check on the result:

```bash
qpdf --check ~/Downloads/repaired.pdf
```

An affected file reports `unable to find /Root dictionary`; a sound one reports
`No syntax or stream encoding errors found`.

## Running them

All five are executable and carry a `ts-node` shebang, so they run directly
from the repository root. Pass `--help` to any of them for its generated usage.
The `-v` flag echoes the parsed arguments back before running; none adds output
of its own beyond what is shown above.

```bash
./scripts/pdf/pdf-doctor.ts --help
```

If your shell will not execute them directly:

```bash
npx ts-node --transpile-only scripts/pdf/pdf-doctor.ts check <file.pdf>
```

`pdf-doctor`, `pdf-triage`, `pdf-compare` and `pdf-fixture` read and write
local files only: no AWS session, no environment variables, no network.

`pdf-audit` is the exception. It requires `ENV` and an active AWS session, and
reads from both the database and S3 — so it must be run by an operator against
the environment being surveyed, never from an agent session.

## Tests

```bash
npm run test:scripts:file -- scripts/pdf
```

Every `*.helpers.ts` module is covered at 100% of statements, branches,
functions and lines. The entry points are thin argument
handling and are excluded from coverage in
[jest-scripts.config.ts](../jest-scripts.config.ts), following the convention
used by the other scripts.

The modules split byte-level work from document-level work:

| module | responsibility |
| --- | --- |
| `crossReferenceEntries.helpers.ts` | decodes a section into rows — classic tables, cross-reference streams, inflate, PNG predictors |
| `crossReference.helpers.ts` | decides what the rows mean: screen, probe set, coverage, verdict |
| `pdf-doctor.helpers.ts` | surveys and repairs a *loaded* document |
| `pdf-audit.helpers.ts` | one document from range requests, concurrency, CSV, summary |
| `pdf-triage.helpers.ts` | settles a byte verdict against a full read; formats the table |
| `pdf-fixture.helpers.ts` | appends a superseded-catalog revision to a sound document |
| `pdf-compare.helpers.ts` | hashes content streams either side of a repair |

Their tests follow, with the cross-reference tests further split by the form
they exercise — `...inspectCrossReferenceTable.test.ts` for classic tables and
whole-document behaviour, `...inspectCrossReferenceStream.test.ts` for stream
decoding. That split is a `max-lines` requirement as much as an organisational
one.

The helper tests include a regression test for the underlying defect: it builds
a document, injects one object number at two generations, saves it with each of
pdf-lib's two writers, and asserts that both are caught. If a future pdf-lib
upgrade fixes or re-breaks this, that test will say so.

They also pin the two failures earlier detectors had. One case adds *both* a
duplicate and an unused range of object numbers, and asserts the document is
still `DUPLICATED` even though its entry count now falls short of `/Size` — the
arrangement the count comparison filed as under-declared and passed over.
Another builds a document that reuses an object number at generation 1 with no
collision, and asserts it comes back `VALID` — the sound file the generation
screen accused on its own. A third builds the same duplicate under *both*
insertion orderings and asserts both are condemned, pinning the case where the
displaced row sits at generation zero and probing the residue alone cleared a
broken file. A fourth ends a subsection on an unprobeable row and asserts the
document is held as a candidate rather than cleared.
