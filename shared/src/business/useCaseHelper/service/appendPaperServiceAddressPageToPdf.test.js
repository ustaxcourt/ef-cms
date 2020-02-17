const fs = require('fs');
const path = require('path');
const {
  appendPaperServiceAddressPageToPdf,
} = require('./appendPaperServiceAddressPageToPdf');
const { PDFDocument } = require('pdf-lib');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');
const testPdfDocBytes = () => {
  // sample.pdf is a 1 page document
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
};
const testPdfDoc = testPdfDocBytes();

describe('appendPaperServiceAddressPageToPdf', () => {
  const generatePaperServiceAddressPagePdfMock = jest
    .fn()
    .mockResolvedValue(testPdfDoc);

  const applicationContext = {
    getUseCaseHelpers: () => ({
      generatePaperServiceAddressPagePdf: generatePaperServiceAddressPagePdfMock,
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
