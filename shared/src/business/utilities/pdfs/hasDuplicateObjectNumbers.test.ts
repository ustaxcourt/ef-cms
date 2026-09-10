import {
  hasDuplicateObjectNumbers,
  hasRaisedGenerationHeader,
} from '@shared/business/utilities/pdfs/hasDuplicateObjectNumbers';
import { readFileSync } from 'fs';
import path from 'path';

const readTestAsset = (fileName: string): Uint8Array =>
  new Uint8Array(
    readFileSync(path.join(__dirname, '../../../../test-assets', fileName)),
  );

const encode = (text: string): Uint8Array =>
  Uint8Array.from(text, character => character.charCodeAt(0));

/** Catalog reused at generation 1: clears the screen, collides with nothing. */
const buildSoundReuseDocument = (): Uint8Array => {
  const objects = [
    '1 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\n',
    '2 1 obj\n<< /Type /Catalog /Pages 1 0 R >>\nendobj\n',
  ];

  let document = '%PDF-1.7\n';
  const offsets: number[] = [];
  for (const object of objects) {
    offsets.push(document.length);
    document += object;
  }

  const startXref = document.length;
  const offsetOf = (index: number): string =>
    String(offsets[index]).padStart(10, '0');

  document += `xref\n0 3\n0000000000 65535 f \n${offsetOf(0)} 00000 n \n${offsetOf(1)} 00001 n \n`;
  document += `trailer\n<< /Size 3 /Root 2 1 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  return encode(document);
};

describe('hasRaisedGenerationHeader', () => {
  it('finds a header above generation zero', () => {
    expect(hasRaisedGenerationHeader(encode('2 1 obj\n<<>>\nendobj'))).toBe(
      true,
    );
  });

  it('ignores headers at generation zero', () => {
    expect(hasRaisedGenerationHeader(encode('2 0 obj\n<<>>\nendobj'))).toBe(
      false,
    );
  });

  it('ignores a multi-digit generation written as zero', () => {
    expect(hasRaisedGenerationHeader(encode('2 00000 obj'))).toBe(false);
  });

  it('reads a multi-digit generation above zero', () => {
    expect(hasRaisedGenerationHeader(encode('2 00012 obj'))).toBe(true);
  });

  it('matches a keyword glued to what follows, as pdf-lib does', () => {
    expect(hasRaisedGenerationHeader(encode('2 1 objstm'))).toBe(true);
  });

  it('finds a generation separated from its object number by a comment', () => {
    expect(hasRaisedGenerationHeader(encode('2 % note\n1 obj'))).toBe(true);
  });

  it('finds a keyword separated from its generation by a comment', () => {
    expect(hasRaisedGenerationHeader(encode('2 1 % note\nobj'))).toBe(true);
  });

  it('ends a comment at a carriage return', () => {
    expect(hasRaisedGenerationHeader(encode('2 %a\r1 obj'))).toBe(true);
  });

  it('finds a keyword with no whitespace before it', () => {
    expect(hasRaisedGenerationHeader(encode('2 1obj'))).toBe(true);
  });

  it('does not match when a comment runs to the end of the file', () => {
    expect(hasRaisedGenerationHeader(encode('2 1 % obj'))).toBe(false);
  });

  it('does not match obj without a generation before it', () => {
    expect(hasRaisedGenerationHeader(encode('obj'))).toBe(false);
  });

  it('does not match obj preceded only by whitespace', () => {
    expect(hasRaisedGenerationHeader(encode('   obj'))).toBe(false);
  });

  it('does not match a name ending in a digit', () => {
    expect(hasRaisedGenerationHeader(encode('/Name1 obj'))).toBe(false);
  });

  it('does not match a generation with no object number before it', () => {
    expect(hasRaisedGenerationHeader(encode('  1 obj'))).toBe(false);
  });

  it('does not match when the keyword runs to the end of the file', () => {
    expect(hasRaisedGenerationHeader(encode('2 1 ob'))).toBe(false);
  });

  it('returns false for an empty file', () => {
    expect(hasRaisedGenerationHeader(new Uint8Array())).toBe(false);
  });
});

describe('hasDuplicateObjectNumbers', () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('detects the precondition in an incrementally updated document', async () => {
    const bytes = readTestAsset('incrementally-updated.pdf');

    await expect(hasDuplicateObjectNumbers(bytes)).resolves.toBe(true);
  });

  it('detects a collision whose header separates its tokens with a comment', async () => {
    const original = Buffer.from(
      readTestAsset('incrementally-updated.pdf'),
    ).toString('latin1');

    await expect(
      hasDuplicateObjectNumbers(
        encode(original.replace('2 1 obj', '2 % note\n1 obj')),
      ),
    ).resolves.toBe(true);
  });

  it('clears a document that carries no duplicate', async () => {
    const bytes = readTestAsset('sample.pdf');

    await expect(hasDuplicateObjectNumbers(bytes)).resolves.toBe(false);
  });

  it('clears a document that reuses an object number without colliding', async () => {
    await expect(
      hasDuplicateObjectNumbers(buildSoundReuseDocument()),
    ).resolves.toBe(false);
  });

  it('skips the parse when no header sits above generation zero', async () => {
    await expect(hasDuplicateObjectNumbers(encode('2 0 obj'))).resolves.toBe(
      false,
    );
  });

  it('clears a file pdf-lib cannot load, which it therefore never rewrites', async () => {
    await expect(
      hasDuplicateObjectNumbers(encode('2 1 obj\n<<>>\nendobj\n')),
    ).resolves.toBe(false);

    expect(consoleError).toHaveBeenCalled();
  });

  it('goes straight to the parse when the caller has already screened', async () => {
    // No raised generation here, so reaching the failed parse proves the screen was skipped.
    await expect(
      hasDuplicateObjectNumbers(encode('2 0 obj'), { alreadyScreened: true }),
    ).resolves.toBe(false);

    expect(consoleError).toHaveBeenCalled();
  });

  it('runs the screen itself when the caller has not', async () => {
    await expect(
      hasDuplicateObjectNumbers(encode('2 0 obj'), { alreadyScreened: false }),
    ).resolves.toBe(false);

    expect(consoleError).not.toHaveBeenCalled();
  });
});
