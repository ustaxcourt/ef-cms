import { testPdfDoc } from '../test/getFakeFile';

import { PDFDocument } from 'pdf-lib';
import { copyPagesAndAppendToTargetPdf } from './copyPagesAndAppendToTargetPdf';

describe('copyPagesAndAppendToTargetPdf', () => {
  it('should copy the pages from the source pdf into the target pdf', async () => {
    const sourcePdf = await PDFDocument.load(testPdfDoc);
    const targetPdf = await PDFDocument.create();
    const sourcePdfInitialPageCount = sourcePdf.getPages().length;
    const targetPdfInitialPageCount = targetPdf.getPages().length;

    await copyPagesAndAppendToTargetPdf({
      copyFrom: sourcePdf,
      copyInto: targetPdf,
    });

    expect(targetPdf.getPages().length).toBe(
      sourcePdfInitialPageCount + targetPdfInitialPageCount,
    );
  });
});
