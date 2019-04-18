const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
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

  it('adds a cover page to a pdf document', async () => {
    const getCaseByCaseIdStub = sinon.stub().resolves({
      caseId: '123',
      docketNumber: '101-19',
    });
    const saveDocumentStub = sinon
      .stub()
      .callsFake(({ document: newPdfData }) => {
        fs.writeFile(testOutputPath + 'addCoverToPDFDocument.pdf', newPdfData);
      });
    const getObjectStub = sinon.stub().returns({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });

    const params = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdStub,
          saveDocument: saveDocumentStub,
        }),
        getStorageClient: () => ({
          getObject: getObjectStub,
        }),
      },
      caseId: 'abc',
      documentId: '123',
    };

    const newPdfData = await addCoverToPDFDocument(params);

    const newPdfDoc = PDFDocumentFactory.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(saveDocumentStub.calledOnce).toBeTruthy();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
