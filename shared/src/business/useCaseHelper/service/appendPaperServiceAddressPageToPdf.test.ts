const {
  appendPaperServiceAddressPageToPdf,
} = require('./appendPaperServiceAddressPageToPdf');
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { PDFDocument } = require('pdf-lib');

describe('appendPaperServiceAddressPageToPdf', () => {
  applicationContext
    .getDocumentGenerators()
    .addressLabelCoverSheet.mockResolvedValue(testPdfDoc);

  it('should generate address page for each paper service party and combine into single pdf', async () => {
    const newPdfDoc = await PDFDocument.create();
    const noticeDoc = await PDFDocument.load(testPdfDoc);

    await appendPaperServiceAddressPageToPdf({
      applicationContext,
      caseEntity: { docketNumber: '123-20' },
      newPdfDoc,
      noticeDoc,
      servedParties: { paper: [{ name: '1' }, { name: '2' }] },
    });

    expect(newPdfDoc.getPages().length).toEqual(4);
  });
});
