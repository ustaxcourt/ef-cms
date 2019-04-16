const fs = require('fs');
const path = require('path');
const {
  addCoverToPDFDocument,
} = require('./addCoverToPDFDocumentInteractor.js');

const { PDFDocumentFactory } = require('pdf-lib');
const testAssetsPath = path.join(__dirname, '../../../test-assets/');

function testPdfDocBytes() {
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
}

describe('addCoverToPDFDocument', () => {
  let testPdfDoc;

  beforeEach(() => {
    testPdfDoc = testPdfDocBytes();
  });

  it('adds a cover page to a pdf document', () => {
    const testDate = new Date();
    const coverSheetData = {
      caseCaption: 'This is the caption.',
      dateFiled: `${testDate.toDateString()} ${testDate.toTimeString()}`,
      dateLodged: `${testDate.toDateString()} ${testDate.toTimeString()}`,
      dateReceived: `${testDate.toDateString()} ${testDate.toTimeString()}`,
      docketNumber: '123456',
      documentTitle: 'Title',
      includesCertificateOfService: false,
      originallyFiledElectronically: true,
    };

    const params = {
      coverSheetData,
      pdfData: testPdfDoc,
    };

    const newPdfData = addCoverToPDFDocument(params);

    const newPdfDoc = PDFDocumentFactory.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
