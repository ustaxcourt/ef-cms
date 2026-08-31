import { PDFDocument, PDFName, PDFRef } from 'pdf-lib';
import { OBJECT_HEADER_PROBE_BYTES } from './crossReference.helpers';
import {
  AUDIT_COLUMNS,
  type RangeReader,
  TAIL_RANGE,
  auditDocument,
  formatDuplicates,
  mapWithConcurrency,
  parseContentRange,
  summarize,
  toCsvLine,
} from './pdf-audit.helpers';

const bytes = (text: string): Uint8Array =>
  Uint8Array.from(text, character => character.charCodeAt(0));

/**
 * Serves byte ranges out of an in-memory document the way S3 does, including
 * the `Content-Range` header a caller needs to learn the total length.
 */
const serve =
  (document: Uint8Array, calls: string[] = []): RangeReader =>
  range => {
    calls.push(range);

    const suffix = /^bytes=-(\d+)$/.exec(range);
    const bounded = /^bytes=(\d+)-(\d*)$/.exec(range);
    const from = suffix
      ? Math.max(0, document.length - Number(suffix[1]))
      : Number(bounded![1]);
    const to =
      !suffix && bounded![2]
        ? Math.min(Number(bounded![2]) + 1, document.length)
        : document.length;

    return Promise.resolve({
      bytes: document.subarray(from, to),
      contentRange: `bytes ${from}-${to - 1}/${document.length}`,
    });
  };

const buildPdf = async (): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([200, 200]).drawText('DAWSON');
  return pdfDoc;
};

/** One object number present at two generations, as pdf-doctor describes. */
const buildDamagedPdf = async (): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(await (await buildPdf()).save());
  const [reference] = pdfDoc.context.enumerateIndirectObjects()[1];

  pdfDoc.context.assign(
    PDFRef.of(reference.objectNumber, reference.generationNumber + 1),
    pdfDoc.context.lookup(reference)!,
  );

  return pdfDoc.save({ useObjectStreams: false });
};

/** One object at a raised generation with no collision: sound, not damaged. */
const buildReusedGenerationPdf = async (): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(await (await buildPdf()).save());
  const spare = pdfDoc.context.nextRef().objectNumber;

  pdfDoc.context.assign(PDFRef.of(spare, 1), pdfDoc.context.obj({}));
  pdfDoc.catalog.set(PDFName.of('DawsonProbe'), PDFRef.of(spare, 1));

  return pdfDoc.save({ useObjectStreams: false });
};

describe('parseContentRange', () => {
  it('reads the total length', () => {
    expect(parseContentRange('bytes 0-2047/58801')).toBe(58801);
  });

  it('returns null when the total is unknown', () => {
    expect(parseContentRange('bytes 0-2047/*')).toBeNull();
  });

  it('returns null when the header is absent', () => {
    expect(parseContentRange()).toBeNull();
  });
});

describe('auditDocument', () => {
  it('clears a document pdf-lib wrote from an undamaged source', async () => {
    const calls: string[] = [];
    const document = await (await buildPdf()).save();

    const outcome = await auditDocument(serve(document, calls));

    expect(outcome.status).toBe('VALID');
    expect(calls).toEqual([TAIL_RANGE]);
  });

  // The generation screen alone cannot tell a duplicate from a sound reuse, so
  // a few dozen bytes at each probed row settle it — object headers at known
  // offsets, never document content.
  it('settles the defect with short reads into the body', async () => {
    const calls: string[] = [];
    const document = await buildDamagedPdf();

    const outcome = await auditDocument(serve(document, calls));

    expect(outcome.status).toBe('DUPLICATED');
    expect(outcome.displacedObjectNumber).toBe(3);
    // The tail, then one bounded read per probed row.
    expect(outcome.requests).toBe(1 + calls.slice(1).length);
    expect(calls.slice(1).every(call => /^bytes=\d+-\d+$/.test(call))).toBe(
      true,
    );
    expect(outcome.bytesRead - document.length).toBeLessThan(
      OBJECT_HEADER_PROBE_BYTES * calls.slice(1).length + 1,
    );
  });

  // A document that reuses an object number at a raised generation without any
  // collision is sound, and opens without complaint. Accusing it was the
  // failure this confirmation step exists to prevent.
  it('clears a raised generation that names the object it points at', async () => {
    const calls: string[] = [];
    const document = await buildReusedGenerationPdf();

    const outcome = await auditDocument(serve(document, calls));

    expect(outcome.status).toBe('VALID');
    expect(outcome.residue).toHaveLength(1);
    expect(outcome.displacedObjectNumber).toBeNull();
  });

  it('reads only the tail of a large document', async () => {
    const body = 'x'.repeat(500000);
    const section = 'xref\n0 1\n0000000000 65535 f \ntrailer\n<< /Size 1 >>';
    const document = bytes(
      `${body}${section}\nstartxref\n${body.length}\n%%EOF\n`,
    );

    const outcome = await auditDocument(serve(document));

    expect(outcome.status).toBe('VALID');
    expect(outcome.bytesRead).toBe(2048);
    expect(outcome.bytesRead / document.length).toBeLessThan(0.01);
  });

  // A large table sits further back than the tail request reaches, so the
  // section has to be fetched separately.
  it('issues a second request when the section lies outside the tail', async () => {
    const calls: string[] = [];
    const entries = 200;
    const body = 'x'.repeat(4096);
    const section =
      `xref\n0 ${entries}\n` +
      '0000000000 65535 f \n'.repeat(entries) +
      `trailer\n<< /Size ${entries} >>`;
    const document = bytes(
      `${body}${section}\nstartxref\n${body.length}\n%%EOF\n`,
    );

    const outcome = await auditDocument(serve(document, calls));

    expect(outcome.status).toBe('VALID');
    expect(outcome.requests).toBe(2);
    expect(calls).toEqual([TAIL_RANGE, `bytes=${body.length}-`]);
  });

  it('reports a document with no startxref as indeterminate', async () => {
    const outcome = await auditDocument(serve(bytes('%PDF-1.7\nnothing')));

    expect(outcome.status).toBe('INDETERMINATE');
    expect(outcome.reason).toBe('the document has no startxref keyword');
    expect(outcome.requests).toBe(1);
  });

  it('reports a startxref beyond the document as indeterminate', async () => {
    const outcome = await auditDocument(
      serve(bytes('%PDF-1.7\nstartxref\n999999\n%%EOF\n')),
    );

    expect(outcome.status).toBe('INDETERMINATE');
    expect(outcome.reason).toBe('startxref points outside the document');
  });

  // Without a total length the fetched tail is all there is to go on, so the
  // survey must still reach a verdict rather than throw.
  it('falls back to the fetched length when Content-Range is absent', async () => {
    const document = await buildDamagedPdf();

    const outcome = await auditDocument(range =>
      Promise.resolve(serve(document)(range)).then(result => ({
        bytes: result.bytes,
      })),
    );

    expect(outcome.status).toBe('DUPLICATED');
  });
});

describe('mapWithConcurrency', () => {
  it('returns results in the order of the input', async () => {
    const results = await mapWithConcurrency([5, 1, 3], 2, async value => {
      await new Promise(resolve => setTimeout(resolve, value));
      return value * 2;
    });

    expect(results).toEqual([10, 2, 6]);
  });

  it('never exceeds the concurrency limit', async () => {
    let running = 0;
    let peak = 0;

    await mapWithConcurrency([1, 2, 3, 4, 5, 6, 7, 8], 3, async value => {
      running += 1;
      peak = Math.max(peak, running);
      await new Promise(resolve => setTimeout(resolve, 1));
      running -= 1;
      return value;
    });

    expect(peak).toBe(3);
  });

  it('handles an empty list', async () => {
    expect(await mapWithConcurrency([], 4, () => Promise.resolve(1))).toEqual(
      [],
    );
  });
});

describe('toCsvLine', () => {
  it('leaves ordinary values unquoted', () => {
    expect(toCsvLine(['abc', 12, true])).toBe('abc,12,true');
  });

  it('renders null and undefined as empty fields', () => {
    expect(toCsvLine([null, undefined, 'x'])).toBe(',,x');
  });

  it('quotes and escapes values that need it', () => {
    expect(toCsvLine(['a,b', 'say "hi"', 'one\ntwo'])).toBe(
      '"a,b","say ""hi""","one\ntwo"',
    );
  });

  it('names the columns it writes', () => {
    expect(AUDIT_COLUMNS).toContain('documentStorageId');
    expect(AUDIT_COLUMNS).toContain('status');
  });
});

describe('formatDuplicates', () => {
  it('pairs each object number with its declared type', () => {
    expect(
      formatDuplicates([
        {
          generations: [0, 1],
          keptGeneration: 0,
          liveGenerations: [0],
          objectNumber: 2,
          objectType: 'Catalog',
        },
        {
          generations: [0, 1],
          keptGeneration: 1,
          liveGenerations: [1],
          objectNumber: 9,
          objectType: null,
        },
      ]),
    ).toBe('2:/Catalog 9:untyped');
  });

  it('renders an empty survey as an empty field', () => {
    expect(formatDuplicates([])).toBe('');
  });
});

describe('summarize', () => {
  it('counts verdicts and orders months oldest first', () => {
    const summary = summarize([
      { createdAt: '2026-03-04T00:00:00.000Z', status: 'VALID' },
      { createdAt: '2026-01-09T00:00:00.000Z', status: 'DUPLICATED' },
      { createdAt: '2026-01-22T00:00:00.000Z', status: 'VALID' },
      { createdAt: '2026-03-15T00:00:00.000Z', status: 'DUPLICATED' },
      { createdAt: '2026-03-19T00:00:00.000Z', status: 'VALID' },
    ]);

    expect(summary.byMonth).toEqual([
      { affected: 1, month: '2026-01', total: 2 },
      { affected: 1, month: '2026-03', total: 3 },
    ]);
    expect(summary.byStatus).toEqual([
      { count: 3, status: 'VALID' },
      { count: 2, status: 'DUPLICATED' },
    ]);
  });

  it('summarizes an empty survey', () => {
    expect(summarize([])).toEqual({ byMonth: [], byStatus: [] });
  });
});
