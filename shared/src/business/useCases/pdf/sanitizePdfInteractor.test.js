const path = require('path');
const { PDFDocumentFactory } = require('pdf-lib');
const { sanitizePdf } = require('./sanitizePdfInteractor');
const testAssetsPath = path.join(__dirname, '../../../../test-assets/');
const fs = require('fs');

function testPdfDocBytes() {
  // sample.pdf is a 1 page document
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
}

describe('sanitizePdf', () => {
  describe('writes and reads to filesystem', () => {
    it('returns things', async () => {
      const pdfData = testPdfDocBytes();
      const originalPdfDoc = PDFDocumentFactory.load(pdfData);
      const result = await sanitizePdf({ pdfData });
      const newPdfDoc = PDFDocumentFactory.load(result);

      expect(result.length > 4000).toBeTruthy();
      expect(newPdfDoc.getPages().length).toEqual(
        originalPdfDoc.getPages().length,
      );
    });
  });
});
