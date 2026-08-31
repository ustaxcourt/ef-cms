# Cross-reference collision — findings for ticket 10377

A conforming PDF goes into `cleanFileMetadata` and a file Adobe refuses to open
comes out. The defect is four lines of pdf-lib 1.17.1. Everything below was
reproduced locally from library source to `qpdf --check`.

- **Branch:** `10377-bug-documents-unable-to-display-on-dawson`
- **pdf-lib:** 1.17.1, pinned, unchanged upstream since 2019
- **Companion docs:** [`README.md`](README.md) for the tools, [`HANDOFF.md`](HANDOFF.md) for session pickup

---

## What this establishes

**The committed fix does not fix it.** `PDF_SAVE_OPTIONS`
(`useObjectStreams: false`, commit `9623d64f7a`) makes no difference to this
defect. Both writers carry the same bug on the same comparison, and both outputs
fail `qpdf --check` identically.

**The precondition is narrower than assumed.** A duplicated object number only
survives parsing when the two copies carry *different generation numbers*.
Same-generation duplicates collapse harmlessly. That single condition explains
the rarity.

**The onset is real and one month wide.** Deep audits run continuously from
January 2025 through August 2026 with no gaps — 444,139 documents, two affected,
both in the final month. What that cannot do is prove itself: August is the month
that prompted the search.

---

## The defect, line by line

Five steps, all in `node_modules/pdf-lib/src/core`. Steps 1–3 create a duplicate
that should not exist; steps 4–5 turn it into a broken file.

### 1. The parser ignores the cross-reference table

`parseDocument` loops until the byte stream is exhausted, parsing every
`N G obj` header it finds anywhere in the file. It never consults the table that
says which objects are live. In an incrementally updated document — what an
Acrobat *Save* produces — superseded objects get parsed alongside their
replacements.

> `PDFParser.ts:61–67` — `while (!this.bytes.done()) await this.parseDocumentSection()`

### 2. Object identity includes the generation number

`parseIndirectObjectHeader` returns `PDFRef.of(objectNumber, generationNumber)`,
and `PDFRef` pools instances under the key `"N G R"`. So `2 0 R` and `2 1 R` are
two distinct objects to pdf-lib, while `2 0 R` parsed twice is one.

> `PDFParser.ts:114–127`, `PDFRef.ts:9–19`

### 3. Both copies are stored

`context.assign(ref, object)` writes into a `Map` keyed by that pooled `PDFRef`.
Different generations, different keys, no overwrite — the document now holds one
object number twice. `largestObjectNumber` counts it once.

> `PDFParser.ts:168`, `PDFContext.ts:74–79`

### 4. The writer sorts by object number only

`enumerateIndirectObjects` sorts with a comparator returning
`a.objectNumber - b.objectNumber` and no generation tiebreaker. For the duplicate
pair it returns `0`, so `Array.prototype.sort` — stable since ES2019 — falls back
to insertion order, which is byte order in the source file. The superseded copy
comes first.

> `PDFContext.ts:42–45, 181–185`, `PDFWriter.ts:126–136`

### 5. The subsection never splits, so every later row shifts

A cross-reference subsection is a header `start count` followed by fixed-width
rows; readers find object *n* by arithmetic, not by lookup. `append` opens a new
subsection only when the object number advances by more than one. A duplicate
advances by zero, so both rows land in the same run, the declared count
overshoots by one, and every row after the duplicate is attributed to the object
above it.

> `PDFCrossRefSection.ts:162` — `if (currEntry.ref.objectNumber - prevEntry.ref.objectNumber > 1)`

### The same bug exists twice

`PDFCrossRefStream.computeIndex` splits on the identical `> 1` comparison at
**`PDFCrossRefStream.ts:191`**. This is why `useObjectStreams` is irrelevant
here: the classic-table writer and the cross-reference-stream writer make the
same mistake independently and produce equally broken files.

### Why `/Root` specifically

The trailer's `/Root` carries a generation — `2 1 R`. The row sitting at the
catalog's slot belongs to the *first-in-file* copy, which is the superseded one
at generation `0`. A strict reader looks for generation 1 at that slot, finds
generation 0, and reports the root as unfindable. A lenient reader (PDFium,
pdf.js) discards the table and rescans the file, which is why Chrome renders
these documents perfectly.

### Where a collision lands is luck

All five confirmed production hits were the `/Catalog`, at object numbers 1, 3
and 7. A collision at a high object number displaces an image or a font instead
and degrades silently rather than failing to open. Two structural details make
the damage detectable at all: `PDFStreamWriter` excludes `generationNumber !== 0`
from object streams (`PDFStreamWriter.ts:65–69`), forcing the residue out as a
top-level entry that carries its generation; and the sort's missing tiebreaker
means the displaced row can itself sit at generation 0, which is why a
generation-only screen produces false negatives.

---

## Reproduction

Run against `cypress/helpers/file/incremental-catalog.pdf` — a synthetic but
fully conforming document whose catalog is superseded at generation 1, exactly as
an Acrobat *Save* leaves it.

**Before.** The last cross-reference section names one live object. `qpdf --check`
reports no errors.

```
xref
0 1
0000000000 65535 f
2 1
0000002023 00001 n
trailer
<< /Size 9 /Root 2 1 R /Prev 1765 >>

$ qpdf --check incremental-catalog.pdf
  No syntax or stream encoding errors found
```

**What pdf-lib registers.** Nine references for eight objects — object 2 is
present at both generations.

```
1 0 R   2 0 R   2 1 R   3 0 R   4 0 R   5 0 R   6 0 R   7 0 R   8 0 R
largestObjectNumber = 8      trailerInfo.Root = 2 1 R
```

**After `save({ useObjectStreams: false })`.** The subsection header claims ten
rows while `/Size` accounts for nine. Every row from the duplicate onward points
at the wrong object.

```
xref
0 10                          ← 10 rows declared, /Size 9
row→obj 0   gen 65535  (free)
row→obj 1   gen 00000  offset 16     header "1 0 obj"
row→obj 2   gen 00000  offset 82     header "2 0 obj"
row→obj 3   gen 00001  offset 132    header "2 1 obj"   ✗ MISMATCH
row→obj 4   gen 00000  offset 182    header "3 0 obj"   ✗
row→obj 5   gen 00000  offset 652    header "4 0 obj"   ✗
row→obj 6   gen 00000  offset 750    header "5 0 obj"   ✗
row→obj 7   gen 00000  offset 1001   header "6 0 obj"   ✗
row→obj 8   gen 00000  offset 1283   header "7 0 obj"   ✗
row→obj 9   gen 00000  offset 1534   header "8 0 obj"   ✗
trailer
<< /Size 9 /Root 2 1 R /Info 3 0 R >>   ← slot 2 holds gen 0
```

**The production symptom, reproduced verbatim.** Both save paths fail, and both
produce the two messages seen on the real files.

```
$ qpdf --check out-stock.pdf          # useObjectStreams: false (PDF_SAVE_OPTIONS)
WARNING: reported number of objects (9) is not one plus the highest object number (9)
qpdf: unable to find /Root dictionary

$ qpdf --check out-objstm.pdf         # pdf-lib defaults (useObjectStreams: true)
WARNING: reported number of objects (11) is not one plus the highest object number (11)
qpdf: unable to find /Root dictionary
```

> **Consequence for the ten remaining call sites.** The ten `.save()` calls still
> using pdf-lib's defaults are neither more nor less exposed than the ones already
> converted. Standardising on `PDF_SAVE_OPTIONS` remains worth doing for
> consistency, but it should not be recorded anywhere as the fix for 10377 — on
> this defect it changes nothing.

### The control: same generation is harmless

Rewriting the fixture's superseding copy to `2 0 obj` — an incremental update
that reuses the generation, which is what most producers do — makes the `PDFRef`
pool hand back the same instance, so the `Map` overwrites instead of
accumulating. Eight objects in, nine rows out, table clean.

```
registered: 1 0 R, 2 0 R, 3 0 R, 4 0 R, 5 0 R, 6 0 R, 7 0 R, 8 0 R
xref
0 9                           ← 9 rows, /Size 9, every row correct
```

This is the real precondition, and it is much narrower than "the source was
incrementally updated": the producer must have **freed an object number and
reused it at a raised generation**. That is uncommon, which is what holds the
incidence down around one in forty thousand documents.

---

## Onset

Nothing on our side changed: `cleanFileMetadata` has been functionally unchanged
since February 2024 (the 10247 series), and pdf-lib has been pinned at 1.17.1
since 2019. So any real onset has to be on the input side.

### The baseline is a true zero, and it is unbroken

An earlier reading of this investigation held that the onset was an artifact: the
2025 audit had been run without `--deep`, so its zero could not distinguish "no
damage" from "not measured", and it had left five unsettled candidates. That
objection is retired. Re-running the window with `--deep` settled all five to
`VALID`, and two further runs carried coverage forward — the second closing the
six-week hole the first left when its credentials expired mid-March. Coverage is
now continuous from January 2025 through August 2026 with no unaudited months, by
the same method throughout.

Worth keeping from those five: each carried cross-reference residue — rows above
generation zero, thirteen of them in one case — and none was damaged. Residue is
common and benign on its own. Only a genuine duplicate matters, which is why the
screen-then-confirm design earns its cost.

Two documents came back `INDETERMINATE`, neither of them this defect, both
reproducible across runs: an `SDEC` from September 2025 with *no `startxref`
keyword*, and a `HEAR` from February 2026 whose *cross-reference rows are not the
conforming twenty bytes wide*. Both are worth a separate look, since a reader
locates a row by multiplying its width.

Windows overlap between runs, so these counts are de-duplicated by month:

| Window | Documents | Method | Affected | Per 100k |
| --- | ---: | --- | ---: | ---: |
| Jan – Jul 2025 | 158,293 | `--deep` | 0 | 0.0 |
| Aug – Dec 2025 | 119,529 | `--deep` | 0 | 0.0 |
| Jan – Apr 2026 | 90,657 | `--deep` | 0 | 0.0 |
| May – Aug 2026 | 75,660 | `--deep` | 2 (both Aug) | 2.6 |

### The onset is real, and it is one month wide

Zero in 368,479 documents puts the pre-May-2026 rate below **0.81 per 100k** at
95% confidence, against **2.6 per 100k** in the final window — a factor of about
three, at **p ≈ 0.029**. But the window understates it. May, June and July 2026
were audited in that same run and were clean, so the two hits sit in *August
alone*. On the plausible range of monthly volumes that concentration runs at
**p ≈ 0.002**: nineteen consecutive clean months, then two in the twentieth.

> **Why that number is weaker than it looks.** August is the month that prompted
> the investigation. Testing whether the events cluster in the month where the
> events were noticed is very close to circular, and the tighter the window is
> drawn, the more of the apparent significance comes from that choice rather than
> from the data. The long clean run before it is genuine evidence and the
> direction is not in doubt — something changed. The *p*-value attached to the
> August window is not a result to quote.

The test that escapes the circularity is prospective: watch September 2026
forward, a period nobody has looked at and no cluster selected. If the rate holds
near 2.6 per 100k in months chosen before their contents were known, the onset is
confirmed on clean evidence. That is the same instrumentation as recommendation 2
below — wiring the existing detector into validation turns the fix into the
monitor.

### What changed on the input side

A one-month onset is the best possible starting point: whatever began producing
source PDFs that free and reuse an object number at a raised generation, it began
in August 2026, and August's own clean documents are the control group. Ranked by
how cheap they are to test:

1. **Producer fingerprinting.** Because `cleanFileMetadata` loads with
   `updateMetadata: false` and clears only Title, Author, Subject and Keywords,
   the original `/Producer` and `/Creator` survive into the stored file. Extract
   them from the five confirmed damaged documents and compare against the clean
   August 2026 uploads. A producer version present across the damaged files and
   absent from the controls — or newly present in August at all — is the answer.
   `pdf-audit.ts` already does a full read under `--deep`, so capturing two more
   dictionary keys is a small change.
2. **A form template in common.** STIN and ATP are filled-and-uploaded court
   forms. If a form was reissued and the new file is one an Acrobat save mangles,
   the damaged uploads would share page count, field names and `/Creator`. The
   same extraction pass answers this.
3. **Reporting, not incidence.** Compare the first help-desk report date against
   the `createdAt` of the affected documents. A long gap means something changed
   about how users open documents — a Reader rollout, a default-handler change —
   rather than about what they upload.

---

## What to write PDFs with

Upstream pdf-lib is effectively unmaintained — 1.17.1 is five years old and
issues sit untriaged. That is a real argument for moving, but it is a separate
argument from fixing 10377, and two of the options below fix 10377 without a
dependency change at all.

| Option | License | Browser | Fixes this | Cost |
| --- | --- | --- | --- | --- |
| **pdf-lib + repair before save** | MIT (no change) | yes | **verified** | lowest — one call, helper already written and covered |
| `@cantoo/pdf-lib` 2.9.1 | MIT | yes | **verified** | low — drop-in fork, but a 2.x API bump and a new maintainer to trust |
| `mupdf` (Artifex, WASM) | **AGPL-3.0** or commercial | yes | expected | high — real engine, but AGPL over a network service needs counsel |
| `pdfcpu` (Go) | Apache-2.0 | no | expected | high — strongest correctness story, server-side only |
| `muhammara` (Node native) | Apache-2.0 | no | expected | high — native addon in Lambda, no browser path |
| `qpdf-wasm` | Apache-2.0 | yes | n/a — validator | use as a checker, not a writer |

The browser column is what rules most of this out. `cleanFileMetadata` runs in
the user's browser, so a server-only library cannot replace it without moving
metadata stripping to the API — a much larger change than the bug warrants.
`pdfjs-dist`, already a dependency, is a renderer and cannot write.

### The fork's fix, tested

`@cantoo/pdf-lib` has already changed the exact line: the split condition reads
`!== 1` rather than `> 1`. Applying that single change to a sandboxed copy of our
pinned 1.17.1 and re-running the fixture gives a correct table and a clean
`qpdf --check` — the duplicate opens a second subsection, so every object after
it is addressed correctly and `/Root 2 1 R` resolves to the live catalog.

```
xref
0 3                           objects 0–2
0000000000 65535 f
0000000016 00000 n            "1 0 obj"  ✓
0000000082 00000 n            "2 0 obj"  ✓
2 7                           ← new subsection restarts at 2
0000000132 00001 n            "2 1 obj"  ✓  live catalog wins
0000000182 00000 n            "3 0 obj"  ✓
…
0000001534 00000 n            "8 0 obj"  ✓

$ qpdf --check out-patched.pdf
  No syntax or stream encoding errors found
```

It works, but it works by declaring object 2 twice and relying on the later
subsection winning — which holds only because the live copy sorts second.
Dropping the dead object before writing is the stronger fix, and it is the one we
can ship without changing a dependency.

---

## Recommendation: repair in place, then detect

Calling the existing `repairDuplicateObjectNumbers` on the loaded document before
`save` resolves the fixture on both save paths. It identifies the collision,
keeps the copy reachable from `/Root`, drops the dead one, and leaves nothing
unresolved:

```json
{ "duplicates": [ { "objectNumber": 2, "generations": [0, 1],
                    "keptGeneration": 1, "liveGenerations": [1],
                    "objectType": "Catalog" } ],
  "objectsBefore": 9, "referencesRemoved": 1, "unresolved": 0 }
```

```
$ qpdf --check out-repaired.pdf           # classic table   → clean
$ qpdf --check out-repaired-objstm.pdf    # object streams  → clean
```

1. **Repair before every save.** Call it in `cleanFileMetadata` immediately
   before `pdfDoc.save(PDF_SAVE_OPTIONS)`, extracted as a shared helper the
   server-side sites can adopt. Because it corrects both writers, it is safe to
   land ahead of the `PDF_SAVE_OPTIONS` standardisation rather than behind it.
2. **Make validation able to fail.** `validatePdfInteractor` validates with the
   same lenient pdf-lib that created the damage, so it structurally cannot catch
   what Adobe rejects. The detector already exists and is fully covered —
   `crossReference.helpers.ts` reads the verdict from the cross-reference section
   alone. Wiring it in costs almost nothing and closes the loop for anything that
   reaches storage by another route.
3. **Regression test on the real path.** The fixture and the Cypress upload spec
   are written. Add a unit-level test that runs an incrementally updated document
   through `cleanFileMetadata` and asserts the output cross-reference table is
   well formed — cheap, and it fails today.
4. **Fingerprint August, then watch forward.** The baseline is closed: nothing
   before May 2026 is affected, and remediation covers the two known documents
   plus anything fingerprinting turns up in August. Keep auditing September
   onward — the prospective months are the only ones that can confirm the onset
   without the selection problem.
5. **Treat the fork as a follow-up, not a fix.** Moving to `@cantoo/pdf-lib`
   addresses the maintenance risk, not this bug — the repair covers the bug.
   Worth its own ticket, with the 2.x API change and the fork's provenance
   assessed on their own terms.

---

## What is verified and what is not

- **Verified.** Every claim about pdf-lib's behaviour, the two failing save
  paths, the same-generation control, the fork's one-line fix and the repair
  helper's output — all reproduced locally against the pinned 1.17.1 and checked
  with `qpdf 12.4.0`.
- **Verified.** January 2025 through April 2026 is clean: 368,479 documents, zero
  affected, `--deep`, no unaudited months. Remediation is bounded to the two known
  August 2026 documents.
- **Open.** Whether incidence changed is well supported in direction but cannot
  be established from August alone — that window was selected by the cluster.
  Only September 2026 onward can settle it cleanly.
- **Open.** August 2026's document count was never broken out of the 75,660, so
  the sharpest *p*-values here rest on an estimated denominator.
- **Open.** What produces the source files. No producer fingerprinting has been
  done.
- **Open.** The non-browser alternatives are assessed on documentation and
  license, not on a trial migration.
- **Unchanged.** Nothing on S3 has been modified, no deployed environment was
  contacted from an agent session, and the only PDF bytes this investigation
  parsed are the synthetic fixture.

Audit CSVs contain document storage identifiers and must not be committed — and
each run overwrites the same file unless `--output` is passed, so prior windows
survive only as the figures above.
