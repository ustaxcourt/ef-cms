import { testPdfDoc } from '../../test/getFakeFile';

import { PDFDocument } from 'pdf-lib';
import { applicationContext } from '../../test/createTestApplicationContext';
import { combineTwoPdfs } from './combineTwoPdfs';

describe('combineTwoPdfs', () => {
  applicationContext
    .getDocumentGenerators()
    .addressLabelCoverSheet.mockResolvedValue(testPdfDoc);

  it('should combine two pdfs into single pdf', async () => {
    const newPdfData = await combineTwoPdfs({
      applicationContext,
      firstPdf: testPdfDoc,
      secondPdf: testPdfDoc,
    });

    const newPdf = await PDFDocument.load(newPdfData);

    expect(newPdf.getPages().length).toEqual(2);
  });
});
