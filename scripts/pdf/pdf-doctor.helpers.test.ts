import { PDFContext, PDFDocument, PDFName, PDFRef } from 'pdf-lib';
import {
  findDuplicateObjectNumbers,
  repairDuplicateObjectNumbers,
} from './pdf-doctor.helpers';
import { inspectCrossReferenceTable } from './crossReference.helpers';

const buildPdf = async (): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([200, 200]).drawText('DAWSON');
  return pdfDoc;
};

/**
 * Reproduces what an incremental save by an external editor leaves behind: one
 * object number present at two generation numbers. pdf-lib keys its objects by
 * reference, so both survive into the writer.
 */
const buildPdfWithDuplicateObjectNumber = async (): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.load(await (await buildPdf()).save());
  const [reference] = pdfDoc.context.enumerateIndirectObjects()[1];

  pdfDoc.context.assign(
    PDFRef.of(reference.objectNumber, reference.generationNumber + 1),
    pdfDoc.context.lookup(reference)!,
  );

  return pdfDoc;
};

describe('findDuplicateObjectNumbers', () => {
  it('reports the duplicate without altering the document', async () => {
    const pdfDoc = await buildPdfWithDuplicateObjectNumber();
    const before = pdfDoc.context.enumerateIndirectObjects().length;

    const report = findDuplicateObjectNumbers(pdfDoc);

    expect(report.duplicates).toHaveLength(1);
    expect(report.duplicates[0].objectNumber).toBe(2);
    expect(report.duplicates[0].objectType).toBe('Catalog');
    expect(pdfDoc.context.enumerateIndirectObjects().length).toBe(before);
  });

  // Diagnosis must never be destructive: a survey followed by a repair has to
  // find the same thing the repair does.
  it('agrees with the repair it precedes', async () => {
    const pdfDoc = await buildPdfWithDuplicateObjectNumber();

    const surveyed = findDuplicateObjectNumbers(pdfDoc);
    const repaired = repairDuplicateObjectNumbers(pdfDoc);

    expect(surveyed.duplicates).toEqual(repaired.duplicates);
    expect(surveyed.objectsBefore).toBe(repaired.objectsBefore);
    expect(surveyed.unresolved).toBe(repaired.unresolved);
    expect(repaired.referencesRemoved).toBe(1);
  });

  it('reports nothing for an undamaged document', async () => {
    const report = findDuplicateObjectNumbers(await buildPdf());

    expect(report.duplicates).toEqual([]);
    expect(report.unresolved).toBe(0);
  });
});

describe('repairDuplicateObjectNumbers', () => {
  it('leaves an undamaged document untouched', async () => {
    const pdfDoc = await buildPdf();

    const result = repairDuplicateObjectNumbers(pdfDoc);

    expect(result.duplicates).toEqual([]);
    expect(result.referencesRemoved).toBe(0);
    expect(result.unresolved).toBe(0);
  });

  it('removes the duplicate and restores the table', async () => {
    const pdfDoc = await buildPdfWithDuplicateObjectNumber();

    const result = repairDuplicateObjectNumbers(pdfDoc);

    expect(result.referencesRemoved).toBe(1);
    expect(result.duplicates).toHaveLength(1);
    expect(inspectCrossReferenceTable(await pdfDoc.save()).status).toBe(
      'VALID',
    );
  });

  // The rule is reachability, never age. An earlier implementation kept the
  // highest generation and deleted a live object that a font still referenced.
  it('keeps the older generation when that is the reachable one', async () => {
    const pdfDoc = await buildPdfWithDuplicateObjectNumber();

    const [duplicate] = repairDuplicateObjectNumbers(pdfDoc).duplicates;

    expect(duplicate.generations).toEqual([0, 1]);
    expect(duplicate.liveGenerations).toEqual([0]);
    expect(duplicate.keptGeneration).toBe(0);
  });

  // The collision lands on the document spine. Object #2 is the /Catalog, and
  // a duplicate there misattributes every row after it, including the one a
  // reader follows to reach /Root.
  it('reports the object number and declared type of the duplicate', async () => {
    const pdfDoc = await buildPdfWithDuplicateObjectNumber();

    const [duplicate] = repairDuplicateObjectNumbers(pdfDoc).duplicates;

    expect(duplicate.objectNumber).toBe(2);
    expect(duplicate.objectType).toBe('Catalog');
  });

  it('reads the declared type through a stream dictionary', async () => {
    const pdfDoc = await buildPdf();
    const { context } = pdfDoc;
    const spare = context.nextRef().objectNumber;

    context.assign(PDFRef.of(spare, 0), context.obj({}));
    context.assign(
      PDFRef.of(spare, 1),
      context.stream('q Q', { Type: PDFName.of('XObject') }),
    );
    pdfDoc.catalog.set(PDFName.of('DawsonProbe'), PDFRef.of(spare, 1));

    const [duplicate] = repairDuplicateObjectNumbers(pdfDoc).duplicates;

    expect(duplicate.objectType).toBe('XObject');
  });

  it('reports no type for a dictionary that declares none', async () => {
    const pdfDoc = await buildPdf();
    const { context } = pdfDoc;
    const spare = context.nextRef().objectNumber;

    context.assign(PDFRef.of(spare, 0), context.obj({}));
    context.assign(PDFRef.of(spare, 1), context.obj({}));
    pdfDoc.catalog.set(PDFName.of('DawsonProbe'), PDFRef.of(spare, 1));

    const [duplicate] = repairDuplicateObjectNumbers(pdfDoc).duplicates;

    expect(duplicate.objectType).toBeNull();
  });

  it('reports no type for a duplicate that is not a dictionary', async () => {
    const pdfDoc = await buildPdf();
    const { context } = pdfDoc;
    const spare = context.nextRef().objectNumber;

    context.assign(PDFRef.of(spare, 0), context.obj([1, 2, 3]));
    context.assign(PDFRef.of(spare, 1), context.obj([4, 5, 6]));

    const [duplicate] = repairDuplicateObjectNumbers(pdfDoc).duplicates;

    expect(duplicate.objectType).toBeNull();
  });

  it('keeps the newer generation when that is the reachable one', async () => {
    const pdfDoc = await buildPdf();
    const { context } = pdfDoc;
    const spare = context.nextRef().objectNumber;

    context.assign(PDFRef.of(spare, 0), context.obj({}));
    context.assign(PDFRef.of(spare, 1), context.obj({}));
    pdfDoc.catalog.set(PDFName.of('DawsonProbe'), PDFRef.of(spare, 1));

    const [duplicate] = repairDuplicateObjectNumbers(pdfDoc).duplicates;

    expect(duplicate.liveGenerations).toEqual([1]);
    expect(duplicate.keptGeneration).toBe(1);
  });

  it('reports an unresolved duplicate when neither generation is reachable', async () => {
    const pdfDoc = await buildPdf();
    const { context } = pdfDoc;
    const spare = context.nextRef().objectNumber;

    context.assign(PDFRef.of(spare, 0), context.obj({}));
    context.assign(PDFRef.of(spare, 1), context.obj({}));

    const result = repairDuplicateObjectNumbers(pdfDoc);

    expect(result.unresolved).toBe(1);
    expect(result.duplicates[0].liveGenerations).toEqual([]);
    expect(result.duplicates[0].keptGeneration).toBe(1);
  });

  it('reports an unresolved duplicate when both generations are reachable', async () => {
    const pdfDoc = await buildPdf();
    const { context } = pdfDoc;
    const spare = context.nextRef().objectNumber;

    context.assign(PDFRef.of(spare, 0), context.obj({}));
    context.assign(PDFRef.of(spare, 1), context.obj({}));
    pdfDoc.catalog.set(PDFName.of('DawsonProbeA'), PDFRef.of(spare, 0));
    pdfDoc.catalog.set(PDFName.of('DawsonProbeB'), PDFRef.of(spare, 1));

    const result = repairDuplicateObjectNumbers(pdfDoc);

    expect(result.unresolved).toBe(1);
    expect(result.duplicates[0].liveGenerations).toEqual([0, 1]);
  });

  it('keeps the highest generation regardless of the order they were assigned', async () => {
    const pdfDoc = await buildPdf();
    const { context } = pdfDoc;
    const spare = context.nextRef().objectNumber;

    // Assigned newest first, so the fallback must compare rather than take
    // whichever copy it happens to meet first.
    context.assign(PDFRef.of(spare, 1), context.obj({}));
    context.assign(PDFRef.of(spare, 0), context.obj({}));

    const result = repairDuplicateObjectNumbers(pdfDoc);

    expect(result.unresolved).toBe(1);
    expect(result.duplicates[0].keptGeneration).toBe(1);
  });

  it('walks no further than the trailer when there is no /Root', () => {
    const context = PDFContext.create();
    context.assign(PDFRef.of(1, 0), context.obj({}));
    context.assign(PDFRef.of(1, 1), context.obj({}));

    const result = repairDuplicateObjectNumbers({ context } as PDFDocument);

    expect(result.unresolved).toBe(1);
    expect(result.referencesRemoved).toBe(1);
  });
});
