const fs = require('fs');
const path = require('path');
const {
  addCoverToPDFDocument,
} = require('./addCoverToPDFDocumentInteractor.js');

const { PDFDocumentFactory } = require('pdf-lib');
const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../test-output/');

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
      caseCaptionPetitioner: 'John Doe',
      caseCaptionRespondent: 'Jane Doe',
      dateFiled: testDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      dateLodged: testDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      dateReceived: `${testDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })} ${testDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/New_York',
      })}`,
      docketNumber: '12345-67',
      documentTitle:
        'Notice of Filing of Petition and Right to Intervene on Jonathan Buck',
      includesCertificateOfService: true,
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

    fs.writeFile(testOutputPath + 'addCoverToPDFDocument.pdf', newPdfData);
  });
});
