import { PDFDocument } from 'pdf-lib';
import {
  type PdfAnalysis,
  analyzePdf,
  comparePdfs,
  decodeAscii85,
} from './pdf-compare.helpers';
import { deflateRawSync, deflateSync } from 'zlib';

const latin1 = (text: string): Buffer => Buffer.from(text, 'latin1');

const buildPdf = async (): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([200, 200]).drawText('DAWSON');
  return Buffer.from(await pdfDoc.save());
};

/** A PdfAnalysis with no distinguishing features, for verdict tests. */
const analysis = (overrides: Partial<PdfAnalysis> = {}): PdfAnalysis => ({
  hashes: [],
  hasAcroForm: false,
  hasEncryption: false,
  hasSignature: false,
  hasXfa: false,
  objectStreamCount: 0,
  size: 0,
  typeCounts: { Page: 1 },
  undecodable: [],
  ...overrides,
});

describe('decodeAscii85', () => {
  // Hand-verified against the encoding of the four bytes 'Man ', whose base-85
  // digits are 24 73 80 78 61 and therefore the characters 9 j q o ^.
  it('decodes a full five-character group', () => {
    expect(decodeAscii85(latin1('9jqo^')).toString('latin1')).toBe('Man ');
  });

  // A partial final group is padded with the maximum digit and yields one
  // fewer byte than it has characters.
  it('decodes a partial final group', () => {
    expect(decodeAscii85(latin1('9jn')).toString('latin1')).toBe('Ma');
  });

  it('expands z to four zero bytes', () => {
    expect([...decodeAscii85(latin1('z'))]).toEqual([0, 0, 0, 0]);
  });

  it('does not treat z as a shortcut mid-group', () => {
    expect(decodeAscii85(latin1('9zjqo^')).length).toBe(4);
  });

  it('strips the delimiters', () => {
    expect(decodeAscii85(latin1('<~9jqo^~>')).toString('latin1')).toBe('Man ');
  });

  it('ignores whitespace and out-of-range characters', () => {
    expect(decodeAscii85(latin1('9j q\no^')).toString('latin1')).toBe('Man ');
  });

  it('returns nothing for empty input', () => {
    expect(decodeAscii85(latin1('')).length).toBe(0);
  });
});

describe('analyzePdf', () => {
  it('counts object types and hashes content streams of a real document', async () => {
    const result = analyzePdf(await buildPdf());

    expect(result.typeCounts.Page).toBe(1);
    expect(result.typeCounts.Catalog).toBe(1);
    expect(result.hashes.length).toBeGreaterThan(0);
    expect(result.undecodable).toEqual([]);
  });

  it('counts the types packed inside an object stream', async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([200, 200]).drawText('DAWSON');

    const result = analyzePdf(
      Buffer.from(await pdfDoc.save({ useObjectStreams: true })),
    );

    expect(result.objectStreamCount).toBeGreaterThan(0);
    // Catalog and Pages live inside the object stream, not at top level.
    expect(result.typeCounts.Catalog).toBe(1);
    expect(result.typeCounts.Pages).toBe(1);
  });

  // The point of the tool: the same content reorganised must still match.
  it('counts nothing from an object stream that declares no /First or /N', () => {
    const payload = deflateSync(latin1('1 0 2 40'));
    const pdf = Buffer.concat([
      latin1(
        '%PDF-1.7\n1 0 obj\n<< /Type /ObjStm /Filter /FlateDecode >>\nstream\n',
      ),
      payload,
      latin1('\nendstream\nendobj\n'),
    ]);
    const result = analyzePdf(pdf);

    expect(result.objectStreamCount).toBe(1);
    expect(result.hashes).toEqual([]);
  });

  it('excludes structural objects from the content hashes', async () => {
    const source = await buildPdf();
    const reorganised = Buffer.from(
      await (await PDFDocument.load(source)).save({ useObjectStreams: false }),
    );

    expect(analyzePdf(source).hashes.sort()).toEqual(
      analyzePdf(reorganised).hashes.sort(),
    );
  });

  it('reads a stream whose /Length is an indirect reference', () => {
    const payload = deflateSync(latin1('DAWSON'));
    const pdf = Buffer.concat([
      latin1(
        '%PDF-1.7\n1 0 obj\n<< /Filter /FlateDecode /Length 2 0 R >>\nstream\n',
      ),
      payload,
      latin1('\nendstream\nendobj\n2 0 obj ' + payload.length + ' endobj\n'),
    ]);

    expect(analyzePdf(pdf).hashes).toHaveLength(1);
  });

  it('falls back to endstream when an indirect /Length cannot be resolved', () => {
    const payload = deflateSync(latin1('DAWSON'));
    const pdf = Buffer.concat([
      latin1(
        '%PDF-1.7\n1 0 obj\n<< /Filter /FlateDecode /Length 9 0 R >>\nstream\n',
      ),
      payload,
      latin1('\nendstream\nendobj\n'),
    ]);

    expect(analyzePdf(pdf).hashes).toHaveLength(1);
  });

  it('falls back to endstream when a stream declares no /Length', () => {
    const payload = deflateSync(latin1('DAWSON'));
    const pdf = Buffer.concat([
      latin1('%PDF-1.7\n1 0 obj\n<< /Filter /FlateDecode >>\nstream\n'),
      payload,
      latin1('\nendstream\nendobj\n'),
    ]);

    expect(analyzePdf(pdf).hashes).toHaveLength(1);
  });

  // A chain must be unwrapped in order; feeding ASCII85 text straight to zlib
  // reports a healthy object as damaged.
  it('unwraps an ASCII85 and Flate filter chain in order', () => {
    const pdf = latin1(
      '%PDF-1.7\n1 0 obj\n<< /Filter [ /ASCII85Decode /FlateDecode ] >>\nstream\n' +
        'not really ascii85\nendstream\nendobj\n',
    );

    expect(analyzePdf(pdf).undecodable).toEqual([1]);
  });

  it('accepts a raw deflate stream', () => {
    const payload = deflateRawSync(latin1('DAWSON'));
    const pdf = Buffer.concat([
      latin1('%PDF-1.7\n1 0 obj\n<< /Filter /FlateDecode >>\nstream\n'),
      payload,
      latin1('\nendstream\nendobj\n'),
    ]);

    expect(analyzePdf(pdf).hashes).toHaveLength(1);
    expect(analyzePdf(pdf).undecodable).toEqual([]);
  });

  it('records a stream that cannot be inflated', () => {
    const pdf = latin1(
      '%PDF-1.7\n7 0 obj\n<< /Filter /FlateDecode >>\nstream\nrubbish\nendstream\nendobj\n',
    );

    expect(analyzePdf(pdf).undecodable).toEqual([7]);
  });

  it('hashes an unfiltered stream', () => {
    const pdf = latin1(
      '%PDF-1.7\n1 0 obj\n<< /Length 6 >>\nstream\nDAWSON\nendstream\nendobj\n',
    );

    expect(analyzePdf(pdf).hashes).toHaveLength(1);
  });

  it('ignores an object whose stream is never closed', () => {
    const result = analyzePdf(
      latin1(
        '%PDF-1.7\n1 0 obj\n<< /Type /Page /Length 6 >>\nstream\nDAWSON\n',
      ),
    );

    expect(result.typeCounts.Page).toBe(1);
    expect(result.hashes).toEqual([]);
  });

  it('ignores an object with no stream at all', () => {
    const result = analyzePdf(
      latin1('%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n'),
    );

    expect(result.typeCounts.Catalog).toBe(1);
    expect(result.hashes).toEqual([]);
  });

  it('detects encryption, forms, signatures and XFA', () => {
    const result = analyzePdf(
      latin1(
        '%PDF-1.7\n/Encrypt 1 0 R /AcroForm 2 0 R /XFA 3 0 R /ByteRange [0 1 2 3]\n',
      ),
    );

    expect(result.hasEncryption).toBe(true);
    expect(result.hasAcroForm).toBe(true);
    expect(result.hasXfa).toBe(true);
    expect(result.hasSignature).toBe(true);
  });

  it('reports a document with none of those features', async () => {
    const result = analyzePdf(await buildPdf());

    expect(result.hasEncryption).toBe(false);
    expect(result.hasAcroForm).toBe(false);
    expect(result.hasXfa).toBe(false);
    expect(result.hasSignature).toBe(false);
  });
});

describe('comparePdfs', () => {
  it('confirms an untouched document when every stream matches', () => {
    const result = comparePdfs(
      analysis({ hashes: ['a', 'b'] }),
      analysis({ hashes: ['b', 'a'] }),
    );

    expect(result.byteIdenticalStreams).toBe(2);
    expect(result.onlyInOriginal).toBe(0);
    expect(result.onlyInRepaired).toBe(0);
    expect(result.verdict).toContain('byte-identical');
  });

  it('rejects a repair that changed the page count', () => {
    const result = comparePdfs(
      analysis({ hashes: ['a'], typeCounts: { Page: 5 } }),
      analysis({ hashes: ['a'], typeCounts: { Page: 3 } }),
    );

    expect(result.pageCountChanged).toBe(true);
    expect(result.verdict).toContain('do NOT trust this repair');
  });

  it('flags content that exists only in the repaired file', () => {
    const result = comparePdfs(
      analysis({ hashes: ['a'] }),
      analysis({ hashes: ['a', 'invented'] }),
    );

    expect(result.onlyInRepaired).toBe(1);
    expect(result.verdict).toContain('invented');
  });

  // Superseded revisions are unreachable by definition, so dropping them is
  // the expected outcome rather than a fault.
  it('explains streams that were dropped from the original', () => {
    const result = comparePdfs(
      analysis({ hashes: ['a', 'superseded'] }),
      analysis({ hashes: ['a'] }),
    );

    expect(result.onlyInOriginal).toBe(1);
    expect(result.verdict).toContain('dropped');
  });

  it('refuses to compare two documents that share no content', () => {
    const result = comparePdfs(
      analysis({ hashes: ['a'] }),
      analysis({ hashes: ['b'] }),
    );

    expect(result.sharesNoContent).toBe(true);
    expect(result.verdict).toContain('two different documents');
  });

  it('does not claim two documents with no streams are different', () => {
    const result = comparePdfs(analysis(), analysis());

    expect(result.sharesNoContent).toBe(false);
    expect(result.verdict).toContain('byte-identical');
  });

  it('treats a missing Page count as zero on both sides', () => {
    const result = comparePdfs(
      analysis({ hashes: ['a'], typeCounts: {} }),
      analysis({ hashes: ['a'], typeCounts: {} }),
    );

    expect(result.pageCountChanged).toBe(false);
  });

  describe('warnings', () => {
    it('warns when a signature was lost', () => {
      const result = comparePdfs(
        analysis({ hasSignature: true, hashes: ['a'] }),
        analysis({ hashes: ['a'] }),
      );

      expect(result.warnings[0]).toContain('signature in the original is gone');
    });

    it('warns that a surviving signature is almost certainly invalid', () => {
      const result = comparePdfs(
        analysis({ hasSignature: true, hashes: ['a'] }),
        analysis({ hasSignature: true, hashes: ['a'] }),
      );

      expect(result.warnings[0]).toContain('invalidates the signature');
    });

    it('warns when encryption was lost', () => {
      const result = comparePdfs(
        analysis({ hasEncryption: true, hashes: ['a'] }),
        analysis({ hashes: ['a'] }),
      );

      expect(result.warnings[0]).toContain('encrypted');
    });

    it('warns when form fields were lost', () => {
      const result = comparePdfs(
        analysis({ hasAcroForm: true, hashes: ['a'] }),
        analysis({ hashes: ['a'] }),
      );

      expect(result.warnings[0]).toContain('/AcroForm');
    });

    it('warns when an XFA form was lost', () => {
      const result = comparePdfs(
        analysis({ hasXfa: true, hashes: ['a'] }),
        analysis({ hashes: ['a'] }),
      );

      expect(result.warnings[0]).toContain('XFA');
    });

    it('says nothing when every feature survived', () => {
      const intact = {
        hasAcroForm: true,
        hasEncryption: true,
        hasXfa: true,
        hashes: ['a'],
      };

      expect(comparePdfs(analysis(intact), analysis(intact)).warnings).toEqual(
        [],
      );
    });
  });
});
