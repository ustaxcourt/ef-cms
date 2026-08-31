import { PDFDocument } from 'pdf-lib';
import {
  appendSupersededCatalogRevision,
  crossReferenceRow,
} from './pdf-fixture.helpers';
import { inspectCrossReferenceTable } from './crossReference.helpers';

const bytes = (text: string): Uint8Array =>
  Uint8Array.from(text, character => character.charCodeAt(0));

const latin1 = (input: Uint8Array): string =>
  String.fromCharCode(...Array.from(input));

const buildSource = async (): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([200, 200]).drawText('DAWSON');
  pdfDoc.addPage([200, 200]).drawText('DAWSON');

  return pdfDoc.save({ useObjectStreams: false });
};

/** What an ingest pipeline does: load through pdf-lib, save again. */
const roundTrip = async (input: Uint8Array): Promise<Uint8Array> =>
  (
    await PDFDocument.load(input, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
      updateMetadata: false,
    })
  ).save({ useObjectStreams: false });

describe('appendSupersededCatalogRevision', () => {
  it('leaves the original revision byte-for-byte intact', async () => {
    const source = await buildSource();

    const { bytes: fixture } = appendSupersededCatalogRevision(source);

    expect(fixture.subarray(0, source.length)).toEqual(source);
    expect(fixture.length).toBeGreaterThan(source.length);
  });

  it('chains to the previous revision and repoints /Root', async () => {
    const source = await buildSource();

    const { bytes: fixture, revision } =
      appendSupersededCatalogRevision(source);
    const text = latin1(fixture);
    const previousOffset = /startxref\s+(\d+)/.exec(latin1(source))![1];

    expect(text).toContain(`/Prev ${previousOffset}`);
    expect(text).toContain(
      `/Root ${revision.objectNumber} ${revision.supersedingGeneration} R`,
    );
    expect(revision.supersedingGeneration).toBe(1);
  });

  // The whole point of the fixture: a reader that follows the cross-reference
  // section sees a sound document, so it must not be reported as damaged.
  it('produces a document the checker declines to accuse', async () => {
    const { bytes: fixture } = appendSupersededCatalogRevision(
      await buildSource(),
    );

    const result = inspectCrossReferenceTable(fixture);

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('incrementally updated');
  });

  it('still loads, and keeps every page', async () => {
    const source = await buildSource();
    const { bytes: fixture } = appendSupersededCatalogRevision(source);

    const pdfDoc = await PDFDocument.load(fixture, {
      throwOnInvalidObject: false,
      updateMetadata: false,
    });

    expect(pdfDoc.getPageCount()).toBe(2);
  });

  // The reproduction this fixture exists for.
  it('is damaged by a single pdf-lib load and save', async () => {
    const { bytes: fixture } = appendSupersededCatalogRevision(
      await buildSource(),
    );

    const result = inspectCrossReferenceTable(await roundTrip(fixture));

    expect(result.status).toBe('DUPLICATED');
  });

  it('leaves an untouched document undamaged by the same round trip', async () => {
    const source = await buildSource();

    const result = inspectCrossReferenceTable(await roundTrip(source));

    expect(result.status).toBe('VALID');
  });

  it('rejects a document with no startxref to chain from', () => {
    expect(() =>
      appendSupersededCatalogRevision(bytes('%PDF-1.7\nnothing\n')),
    ).toThrow('no startxref');
  });

  it('rejects a document that declares no /Root', () => {
    expect(() =>
      appendSupersededCatalogRevision(
        bytes('%PDF-1.7\ntrailer\n<< /Size 3 >>\nstartxref\n9\n%%EOF\n'),
      ),
    ).toThrow('no /Root');
  });

  it('rejects a document whose catalog body is missing', () => {
    expect(() =>
      appendSupersededCatalogRevision(
        bytes(
          '%PDF-1.7\ntrailer\n<< /Size 3 /Root 1 0 R >>\nstartxref\n9\n%%EOF\n',
        ),
      ),
    ).toThrow('no body found for the catalog');
  });

  it('appends a newline when the source does not end with one', () => {
    const source = bytes(
      '%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n' +
        'trailer\n<< /Size 2 /Root 1 0 R >>\nstartxref\n9\n%%EOF',
    );

    const { bytes: fixture } = appendSupersededCatalogRevision(source);

    expect(latin1(fixture)).toContain('%%EOF\n1 1 obj');
  });

  // A cross-reference stream document has no `trailer` keyword at all - /Root
  // lives in the stream dictionary - so the search has to fall back to the
  // whole document.
  it('finds /Root in a document that has no trailer keyword', () => {
    const source = bytes(
      '%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n' +
        '2 0 obj\n<< /Type /XRef /Size 3 /Root 1 0 R /W [1 2 1] >>\n' +
        'stream\nendstream\nendobj\nstartxref\n9\n%%EOF\n',
    );

    const { revision } = appendSupersededCatalogRevision(source);

    expect(revision.objectNumber).toBe(1);
    expect(revision.supersedingGeneration).toBe(1);
  });

  it('carries the trailer /ID onto the appended revision', () => {
    const source = bytes(
      '%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n' +
        'trailer\n<< /Size 2 /Root 1 0 R /ID [ <A1> <A1> ] >>\n' +
        'startxref\n9\n%%EOF\n',
    );

    const { bytes: fixture } = appendSupersededCatalogRevision(source);

    expect(latin1(fixture).split('trailer')[2]).toContain('/ID [ <A1> <A1> ]');
  });

  it('falls back to a computed /Size when the trailer declares none', () => {
    const source = bytes(
      '%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n' +
        'trailer\n<< /Root 1 0 R >>\nstartxref\n9\n%%EOF\n',
    );

    const { bytes: fixture } = appendSupersededCatalogRevision(source);

    expect(latin1(fixture).split('trailer')[2]).toContain('/Size 2');
  });
});

describe('crossReferenceRow', () => {
  it('pads both fields to the conforming twenty-byte width', () => {
    expect(crossReferenceRow(1234, 1, 'n')).toBe('0000001234 00001 n \n');
    expect(crossReferenceRow(0, 65535, 'f')).toBe('0000000000 65535 f \n');
  });

  // A row of the wrong width shifts every row after it, which is the defect
  // this fixture reproduces - so a miswritten row must fail loudly rather than
  // yield a fixture that is broken for the wrong reason.
  it('refuses to emit a row that would not be twenty bytes', () => {
    expect(() => crossReferenceRow(12345678901, 0, 'n')).toThrow('not 20');
  });
});
