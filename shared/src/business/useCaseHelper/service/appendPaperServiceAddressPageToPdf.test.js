const fs = require('fs');
const path = require('path');
const {
  appendPaperServiceAddressPageToPdf,
} = require('./appendPaperServiceAddressPageToPdf');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { PDFDocument } = require('pdf-lib');
const testAssetsPath = path.join(__dirname, '../../../../test-assets/');
const testPdfDocBytes = () => {
  // sample.pdf is a 1 page document
  return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.pdf'));
};
const testPdfDoc = testPdfDocBytes();

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
